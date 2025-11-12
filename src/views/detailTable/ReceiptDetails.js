import React, { useState, useEffect } from 'react';
import { Row, Col, Input, Nav, NavItem, NavLink, TabContent, TabPane, Button, Form, FormGroup, Label } from 'reactstrap';
import classnames from 'classnames';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import api from '../../constants/api';
import message from '../../components/Message';

const ReceiptDetails = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [customers, setCustomers] = useState([]);
  const [salesmen, setSalesmen] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedCustomerName, setSelectedCustomerName] = useState('');
  const [receiptDate, setReceiptDate] = useState(new Date().toISOString().split('T')[0]);
  const [remarks, setRemarks] = useState('');
  const [criticalRemarks, setCriticalRemarks] = useState('');
  const [collectedBy, setCollectedBy] = useState('');

  // Handle customer selection
  const handleCustomerSelect = (customerId) => {
    setSelectedCustomer(customerId);
    // IDs from <option> values are strings; compare as strings to avoid type mismatch
    const selectedCust = customers.find(c => String(c.company_id) === String(customerId));
    setSelectedCustomerName(selectedCust ? selectedCust.company_name : '');
  };

  // Fetch customers and salesmen when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch customers
        const customerResponse = await api.get('company/getCompany');
        if (customerResponse.data?.data) {
          setCustomers(customerResponse.data.data);
        }

        // Fetch salesmen
        // Fetch employees for "Collected By" (use employee_id)
        // backend exposes GET /getEmployee (see server routes)
        const employeesResponse = await api.get('employee/getEmployee');
        if (employeesResponse.data?.data) {
          // normalize to employee_id & employee_name fields
          setSalesmen(employeesResponse.data.data.map(emp => ({
            employee_id: emp.employee_id || emp.employee_id_duplicate || emp.employee_id,
            employee_name: emp.employee_name || emp.first_name || `${emp.first_name || ''} ${emp.last_name || ''}`.trim()
          })));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        message('Error fetching data', 'error');
      }
    };
    fetchData();
  }, []);

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };  
  // Get customer details based on selected customer
  const getSelectedCustomerDetails = () => {
    const customer = customers.find(c => String(c.company_id) === String(selectedCustomer));
    return {
      customer_id: customer ? customer.company_id : null,
      customer_name: customer ? customer.company_name : null
    };
  };

  const [payMode, setPayMode] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [currencyCode, setCurrencyCode] = useState('SGD');
  const [currencyName, setCurrencyName] = useState('Singapore Dollar');
  const [currencyRate, setCurrencyRate] = useState(1);
  const [id, setId] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [splitAmount, setSplitAmount] = useState('');
  const [totalPaidAmount, setTotalPaidAmount] = useState(0);

  // Recompute total paid amount when invoices change
  useEffect(() => {
    const total = invoices.reduce((acc, inv) => {
      if (inv && inv.selected) {
        const val = Number(inv.receipt_amount) || 0;
        return acc + val;
      }
      return acc;
    }, 0);
    setTotalPaidAmount(total);
  }, [invoices]);

  const fetchInvoices = async () => {
    if (!selectedCustomer) {
      message('Please select a customer first', 'warning');
      return;
    }
    try {
      // try a common invoice endpoint — adapt if your backend path differs
      const res = await api.get(`/invoice/getInvoicesByCompany?company_id=${selectedCustomer}`);
      if (res.data?.data && Array.isArray(res.data.data)) {
        // normalize minimal fields
        const normalized = res.data.data.map((r) => ({
          tran_type: r.tran_type || 'Sales Invoice',
          invoice_no: r.invoice_no || r.invoice_code || '',
          date: r.invoice_date || r.receipt_date || '',
          net_total: r.net_total ?? r.total_amount ?? 0,
          paid: r.paid ?? 0,
          balance: r.balance ?? 0,
          receipt_amount: r.receipt_amount ?? 0,
          credit_amount: r.credit_amount ?? 0,
          selected: false,
          carry_days: r.carry_days ?? '',
          debit_amount: r.debit_amount ?? 0,
        }));
        setInvoices(normalized);
        return;
      }
      message('No invoices returned from server', 'warning');
      setInvoices([]);
    } catch (err) {
      console.error('Error fetching invoices:', err);
      message('Error fetching invoices', 'error');
      setInvoices([]);
    }
  };

  // Note: code generation is handled inline by generateCodeAndInsert below.

  // Insert new receipt record using generated code; returns inserted id
  const insertReceiptData = (code) => {
    const customerDetails = getSelectedCustomerDetails();
    // require a customer/company to be selected
    if (customerDetails.customer_id) {
      const details = {
        receipt_code: code || null,
        receipt_date: receiptDate || new Date().toISOString().slice(0, 10),
        company_id: customerDetails.customer_id,
        invoice_id: null,
        mode_of_payment: payMode,
        remarks: remarks || null,
        critical_remarks: criticalRemarks || null,
        collected_by: collectedBy || null,
        amount_paid: amountPaid || null,
        customer_id: customerDetails.customer_id,
        customer_name: customerDetails.customer_name,
        currency: currencyCode,
        exchange_rate: currencyRate,
        creation_date: new Date().toISOString(),
      };

      return api.post('/receipt/createReceipt', details)
        .then((res) => {
          const insertId = res.data?.data?.insertId || res.data?.insertId || null;
          if (insertId) return insertId;
          // if API returns full object, try to return its id
          return res.data?.data || res.data;
        })
        .catch((err) => {
          console.error('Error inserting receipt:', err);
          message('Network connection error.', 'error');
          throw err;
        });
    }

    message('Please select a customer before saving', 'warning');
    return Promise.reject(new Error('Please select a customer before saving'));
  };

  const generateCodeAndInsert = () => {
    return api.post('/commonApi/getCodeValues', { type: 'ReceiptCode' })
      .then((res) => insertReceiptData(res.data?.data))
      .catch(() => insertReceiptData(''));
  };

  const editReceiptData = () => {
    // If id present, call update API
    const customerDetails = getSelectedCustomerDetails();
    const details = {
      receipt_date: receiptDate || new Date().toISOString().slice(0, 10),
      company_id: customerDetails.customer_id,
      invoice_id: null,
      mode_of_payment: payMode,
      remarks: remarks || null,
      critical_remarks: criticalRemarks || null,
      collected_by: collectedBy || null,
      amount_paid: amountPaid || null,
      customer_id: customerDetails.customer_id,
      customer_name: customerDetails.customer_name,
      currency: currencyCode,
      exchange_rate: currencyRate,
    };

    return api.post('/receipt/updateReceipt', { ...details, receipt_id: id })
      .then(() => {
        return id;
      })
      .catch((err) => {
        console.error('Error updating receipt:', err);
        message('Network connection error.', 'error');
        throw err;
      });
  };

  const handleSave = async () => {
    try {
      if (id) {
        const updatedId = await editReceiptData();
        message('Receipt updated successfully', 'success');
        setId(updatedId);
        return updatedId;
      }

      const newId = await generateCodeAndInsert();
      if (newId) {
        setId(newId);
        message('Receipt saved successfully', 'success');
      }
      return newId;
    } catch (err) {
      console.error('Save error:', err);
      // message already shown in helper functions
      return null;
    }
  };

  return (
    <div className="MainDiv">
      <BreadCrumbs />
      <h4 className="mb-3">Receipt Management</h4>

      <Form>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '1' })}
              onClick={() => { toggle('1'); }}
            >
              Customer
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '2' })}
              onClick={() => { toggle('2'); }}
            >
              Currency
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab} className="p-3" style={{ background: '#fff', marginBottom: 20 }}>
          <TabPane tabId="1">
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label>Receipt Date</Label>
                  <Input 
                    type="date" 
                    value={receiptDate} 
                    onChange={(e) => setReceiptDate(e.target.value)}
                    defaultValue={new Date().toISOString().split('T')[0]}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Customer Code</Label>
                  <Input
                    type="select"
                    value={selectedCustomer}
                    onChange={(e) => handleCustomerSelect(e.target.value)}
                  >
                    <option value="">Select Customer code</option>
                    {customers.map((customer) => (
                      <option key={customer.company_id} value={customer.company_id}>
                        {customer.customer_code}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label>Customer Name</Label>
                  <Input
                    type="text"
                    value={selectedCustomerName}
                    disabled
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Remarks</Label>
                  <Input 
                    type="textarea"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Critical Remarks</Label>
                  <Input 
                    type="textarea"
                    value={criticalRemarks}
                    onChange={(e) => setCriticalRemarks(e.target.value)}
                  />
                </FormGroup>
              </Col>

              <Col md="6">
                <FormGroup>
                  <Label>Collected By</Label>
                  <Input 
                    type="select"
                    value={collectedBy}
                    onChange={(e) => setCollectedBy(e.target.value)}
                  >
                    <option value="">Select Salesman</option>
                    {salesmen.map((salesman) => (
                      <option key={salesman.employee_id} value={salesman.employee_id}>
                        {salesman.employee_name}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label>Total Paid Amount</Label>
                  <Input 
                    type="number" 
                    value={amountPaid} 
                    onChange={(e) => setAmountPaid(e.target.value)} 
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Total Customer Paid Amount</Label>
                  <Input
                    type="number"
                    value={splitAmount}
                    onChange={(e) => setSplitAmount(e.target.value)}
                    placeholder="Enter amount to split"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>PayMode</Label>
                  <Input 
                    type="select" 
                    value={payMode} 
                    onChange={(e) => setPayMode(e.target.value)}
                  >
                    <option value="">Select Paymode</option>
                    <option value="CASH">CASH</option>
                    <option value="CHEQUE">CHEQUE</option>
                    <option value="ONLINE">ONLINE</option>
                    <option value="TT">TT</option>
                  </Input>
                </FormGroup>
              
                <div style={{ marginTop: 20 }}>
                  <Button color="secondary" className="me-2" onClick={() => {
                    // put splitAmount into first invoice row's receipt_amount
                    if (!invoices || invoices.length === 0) {
                      message('No invoices available to split into. Click Get Invoice first.', 'warning');
                      return;
                    }
                    const amt = Number(splitAmount) || 0;
                    const updated = [...invoices];
                    updated[0] = { ...updated[0], receipt_amount: amt };
                    setInvoices(updated);
                  }}>Split</Button>
                </div>
              </Col>
            </Row>
          </TabPane>

          <TabPane tabId="2">
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label>Currency</Label>
                  <Input value={currencyCode} onChange={(e) => setCurrencyCode(e.target.value)} />
                </FormGroup>
                <FormGroup>
                  <Label>Currency Name</Label>
                  <Input value={currencyName} onChange={(e) => setCurrencyName(e.target.value)} />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label>Currency Rate</Label>
                  <Input value={currencyRate} onChange={(e) => setCurrencyRate(e.target.value)} />
                </FormGroup>
              </Col>
            </Row>
          </TabPane>
        </TabContent>

        <div style={{ marginTop: 10 }}>
          <h5>Receipt</h5>
          <Row className="align-items-center mb-2">
            <Col md="3">
              <Input type="date" placeholder="From Date" />
            </Col>
            <Col md="3">
              <Input type="date" placeholder="To Date" />
            </Col>
            <Col md="2">
              <Button color="primary" onClick={fetchInvoices}>Get Invoice</Button>
            </Col>
            <Col md="2">
              <div className="form-check">
                <Input type="checkbox" /> <Label check style={{ display: 'inline', marginLeft: 6 }}>Select Payment</Label>
              </div>
            </Col>
          </Row>

          <div style={{ background: '#fff', padding: 12 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Tran Type</th>
                  <th>Invoice No</th>
                  <th>Date</th>
                  <th>Net Total</th>
                  <th>Paid</th>
                  <th>Balance</th>
                  <th>Receipt Amount</th>
                  <th>Credit Amount</th>
                  <th>Select</th>
                  <th>Carry Days</th>
                  <th>Debit Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {invoices.length === 0 && (
                  <tr>
                    <td colSpan="12" style={{ textAlign: 'center' }}>No invoices loaded.</td>
                  </tr>
                )}
                {invoices.map((inv, idx) => (
                  <tr key={inv.invoice_no || idx}>
                    <td>{inv.tran_type || 'Sales Invoice'}</td>
                    <td>{inv.invoice_no || ''}</td>
                    <td>{inv.date || ''}</td>
                    <td>{inv.net_total ?? ''}</td>
                    <td>{inv.paid ?? 0}</td>
                    <td>{inv.balance ?? ''}</td>
                    <td>
                      <Input
                        type="number"
                        value={inv.receipt_amount ?? ''}
                        onChange={(e) => {
                          const { value } = e.target;
                          const updated = [...invoices];
                          updated[idx] = { ...updated[idx], receipt_amount: value };
                          setInvoices(updated);
                        }}
                      />
                    </td>
                    <td>
                      <Input
                        type="number"
                        value={inv.credit_amount ?? ''}
                        onChange={(e) => {
                          const { value } = e.target;
                          const updated = [...invoices];
                          updated[idx] = { ...updated[idx], credit_amount: value };
                          setInvoices(updated);
                        }}
                      />
                    </td>
                    <td>
                      <Input
                        type="checkbox"
                        checked={!!inv.selected}
                        onChange={(e) => {
                          const { checked } = e.target;
                          const updated = [...invoices];
                          updated[idx] = { ...updated[idx], selected: checked };
                          setInvoices(updated);
                        }}
                      />
                    </td>
                    <td>
                      <Input
                        type="number"
                        value={inv.carry_days ?? ''}
                        onChange={(e) => {
                          const { value } = e.target;
                          const updated = [...invoices];
                          updated[idx] = { ...updated[idx], carry_days: value };
                          setInvoices(updated);
                        }}
                      />
                    </td>
                    <td>
                      <Input
                        type="number"
                        value={inv.debit_amount ?? ''}
                        onChange={(e) => {
                          const { value } = e.target;
                          const updated = [...invoices];
                          updated[idx] = { ...updated[idx], debit_amount: value };
                          setInvoices(updated);
                        }}
                      />
                    </td>
                    <td>
                      <Button color="link" onClick={() => {
                        const updated = invoices.filter((_, i) => i !== idx);
                        setInvoices(updated);
                      }}>
                        🗑️
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        <div style={{ position: 'fixed', left: 0, bottom: 0, right: 0, background: '#111', padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Button color="dark" className="me-2">Cancel</Button>
            <Button color="primary">Hold</Button>
          </div>
            <div style={{ color: '#fff' }}>
            <strong>Total PaidAmount: $</strong> <span style={{ color: '#00bfff' }}>{Number(totalPaidAmount).toFixed(2)}</span>
            <Button color="primary" className="ms-3" onClick={handleSave}>Save</Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default ReceiptDetails;
