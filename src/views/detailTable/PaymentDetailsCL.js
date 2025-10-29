import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  FormGroup,
  Label,
  Input,
  Button,
  Table,
  Card,
  CardBody,
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import classnames from 'classnames';
import { FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import message from '../../components/Message';
import api from '../../constants/api';
import AppContext from '../../context/AppContext';
import creationdatetime from '../../constants/creationdatetime';

const PaymentManagement = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [supplierDetails, setSupplierDetails] = useState({
    paymentDate: '',
    supplierCode: '',
    supplierName: '',
    supplierId: '',
    remarks: '',
    criticalRemarks: '',
    paidAmountToSupplier: '',
    voucherno: '',
    paymode: '',
    accounts: '',
  });
  const [currencyDetails, setCurrencyDetails] = useState({
    currency: 'USD',
    currencyRate: '1.33',
    currencyName: 'US DOLLAR',
  });
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [payModes, setPayModes] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const navigate = useNavigate();
  const { loggedInuser } = useContext(AppContext);

  const fetchSuppliers = async () => {
    try {
      const res = await api.get('/payments/getSupplierDropdown');
      const supplierData = res.data?.data || res.data || [];
      setSuppliers(Array.isArray(supplierData) ? supplierData : []);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
      message('Failed to fetch suppliers', 'error');
    }
  };

  const fetchPayModes = async () => {
    try {
      const res = await api.get('/payments/getPaymodeDropdown');
      const payModeData = res.data?.data || res.data || [];
      setPayModes(Array.isArray(payModeData) ? payModeData : []);
    } catch (err) {
      console.error('Error fetching pay modes:', err);
      message('Failed to fetch pay modes', 'error');
    }
  };

  const fetchAccounts = async () => {
    try {
      const res = await api.get('/payments/getAccountsDropdown');
      const accountData = res.data?.data || res.data || [];
      setAccounts(Array.isArray(accountData) ? accountData : []);
    } catch (err) {
      console.error('Error fetching accounts:', err);
      message('Failed to fetch accounts', 'error');
    }
  };

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const handleSupplierChange = async (e) => {
  const { name, value } = e.target;
  if (name === 'supplierCode') {
    const selectedSupplier = suppliers.find((s) => s.supplier_code === value);
    const updatedSupplier = {
      ...supplierDetails,
      supplierCode: value,
      supplierName: selectedSupplier ? selectedSupplier.company_name : '',
      supplierId: selectedSupplier ? selectedSupplier.supplier_id : '',
    };
    setSupplierDetails(updatedSupplier);

    // 🔥 Fetch invoices automatically when supplier selected
    if (selectedSupplier && selectedSupplier.supplier_id) {
      try {
        const res = await api.get(`/payments/getInvoices/${selectedSupplier.supplier_id}`, {
          params: { fromDate, toDate },
        });
        const invoiceData = res.data?.data || [];
        setInvoices(Array.isArray(invoiceData) ? invoiceData : []);
      } catch (err) {
        console.error('Error fetching supplier invoices:', err);
        message('Failed to fetch invoices for selected supplier', 'error');
      }
    } else {
      setInvoices([]); // clear if no supplier
    }
  } else {
    setSupplierDetails((prev) => ({ ...prev, [name]: value }));
  }
};


  const handleCurrencyChange = (e) => {
    const { name, value } = e.target;
    setCurrencyDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleInvoiceSelection = (e, invoiceId) => {
    if (e.target.checked) {
      setSelectedInvoices((prev) => [...prev, invoiceId]);
    } else {
      setSelectedInvoices((prev) => prev.filter((id) => id !== invoiceId));
    }
  };

  const fetchInvoices = async () => {
    if (!supplierDetails.supplierId) {
      message('Please select a supplier first', 'warning');
      return;
    }
    try {
      const res = await api.get(`/payments/getInvoices/${supplierDetails.supplierId}`, {
        params: { fromDate, toDate },
      });
      const invoiceData = res.data?.data || [];
      setInvoices(Array.isArray(invoiceData) ? invoiceData : []);
    } catch (err) {
      console.error('Error fetching purchase invoices:', err);
      message('Failed to fetch invoices', 'error');
    }
  };

  const handleSave = async () => {
    try {
      const paymentRes = await api.post('/payments/insertPayment', {
        supplier_id: supplierDetails.supplierId,
        payment_date: supplierDetails.paymentDate,
        paid_amount: supplierDetails.paidAmountToSupplier,
        created_by: loggedInuser.first_name,
        creation_date: creationdatetime,
        paymode_id: supplierDetails.paymode,
        remarks: supplierDetails.remarks,
        critical_remarks: supplierDetails.criticalRemarks,
        payment_no: supplierDetails.voucherno,
      });

      const paymentsId = paymentRes.data.data.insertId;
      if (!paymentsId) {
        message('Payment ID not returned from server', 'error');
        return;
      }

      await Promise.all(
        selectedInvoices.map(async (invoiceId) => {
          const invoice = invoices.find((inv) => inv.purchase_invoice_id === invoiceId);
          if (!invoice) return;

          const paidAmt = invoice.payable_amount || 0;

          await api.post('/payments/insertPaymentHistory', {
            payments_id: paymentsId,
            purchase_invoice_id: invoiceId,
            paid_amount: paidAmt,
            created_by: loggedInuser.first_name,
            creation_date: creationdatetime,
          });
        })
      );

      await api.post('/payments/updateMultipleInvoiceStatus', {
        invoices: selectedInvoices.map((invoiceId) => {
          const invoice = invoices.find((inv) => inv.purchase_invoice_id === invoiceId);
          return {
            purchase_invoice_id: invoiceId,
            paid_amount: invoice?.payable_amount || 0,
          };
        }),
        creation_date: creationdatetime,
        modified_by: loggedInuser.first_name,
      });

      message('Payment saved successfully!', 'success');
      navigate('/paymentsCL');
    } catch (err) {
      console.error('Error saving payment:', err);
      message('Error saving payment', 'error');
    }
  };

  const totalPaidAmount = invoices.reduce((sum, inv) => sum + (inv.paid || 0), 0);

  const getInvoices = (supplierId) => {
  api
    .post('/purchaseinvoice/getInvoicesBySupplier', { supplier_id: supplierId })
    .then((res) => {
      const invoiceData = res.data.data.map((inv) => ({
        ...inv,
        payable_amount: parseFloat(inv.balance || 0),
      }));
      setInvoices(invoiceData);
    })
    .catch(() => message('Error fetching invoices', 'error'));
};

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    setSupplierDetails((prev) => ({ ...prev, paymentDate: today }));
    fetchSuppliers();
    fetchPayModes();
    fetchAccounts();
    getInvoices();
  }, []);

  const handleCancel = () => {
    navigate('/paymentsCL');
  };

  const handleDeleteInvoice = (id) => {
    setInvoices((prev) => prev.filter((inv) => inv.purchase_invoice_id !== id));
  }

// ✅ Logic to distribute the entered amount
const splitAmountAcrossInvoices = (enteredAmount) => {
  let remaining = enteredAmount;

  const updatedInvoices = invoices.map((inv) => {
    const balance = parseFloat(inv.balance || 0);
    let allocated = 0;

    if (remaining > 0) {
      if (remaining >= balance) {
        allocated = balance;
        remaining -= balance;
      } else {
        allocated = remaining;
        remaining = 0;
      }
    }

    return {
      ...inv,
      payable_amount: allocated, // update payable amount automatically
    };
  });

  setInvoices(updatedInvoices);
  message('Amount successfully split across invoices', 'success');
};

// ✅ When user clicks "Split"
const handleSplitAmount = () => {
  const enteredAmount = parseFloat(supplierDetails.paidAmountToSupplier || 0);
  const totalBalance = invoices.reduce(
    (sum, inv) => sum + parseFloat(inv.balance || 0),
    0
  );

  if (enteredAmount <= 0) {
    message('Please enter a valid amount to split', 'warning');
    return;
  }

  // ✅ Show popup if entered amount exceeds total balance
  if (enteredAmount > totalBalance) {
    Swal.fire({
      title: 'Supplier Paid Amount must be less than or equal to Total Balance Amount',
      html: '<p>Are you sure to continue?</p>',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'CLOSE',
      confirmButtonColor: '#28a745', // green
      cancelButtonColor: '#6c757d', // gray
    }).then((result) => {
      if (result.isConfirmed) {
        splitAmountAcrossInvoices(enteredAmount);
      }
    });
  } else {
    splitAmountAcrossInvoices(enteredAmount);
  }
};




  return (
    <Container fluid className="p-4">
      <h3>Payment Management</h3>
      <Card>
        <CardBody>
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '1' })}
                onClick={() => toggleTab('1')}
              >
                Supplier
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '2' })}
                onClick={() => toggleTab('2')}
              >
                Currency
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent activeTab={activeTab} className="mt-3">
            {/* Supplier Tab */}
            <TabPane tabId="1">
              <Row>
                

                {/* RIGHT SIDE */}
                <Col md={6}>
                  <FormGroup row className="align-items-center">
                    <Label sm="4">Payment Date</Label>
                    <Col sm="8">
                      <Input
                        type="date"
                        name="paymentDate"
                        value={supplierDetails.paymentDate}
                        onChange={handleSupplierChange}
                      />
                    </Col>
                  </FormGroup>

                  <FormGroup row className="align-items-center">
                    <Label sm="4">Supplier Code</Label>
                    <Col sm="8">
                      <Input
                        type="select"
                        name="supplierCode"
                        value={supplierDetails.supplierCode}
                        onChange={handleSupplierChange}
                      >
                        <option value="">Search Supplier Code</option>
                        {suppliers.map((s) => (
                          <option key={s.supplier_id} value={s.supplier_code}>
                            {s.supplier_code}
                          </option>
                        ))}
                      </Input>
                    </Col>
                  </FormGroup>

                  <FormGroup row className="align-items-center">
                    <Label sm="4">Supplier Name</Label>
                    <Col sm="8">
                      <Input
                        name="supplierName"
                        value={supplierDetails.supplierName}
                        readOnly
                      />
                    </Col>
                  </FormGroup>

                  <FormGroup row className="align-items-center">
                    <Label sm="4">Remarks</Label>
                    <Col sm="8">
                      <Input
                        type="textarea"
                        name="remarks"
                        value={supplierDetails.remarks}
                        onChange={handleSupplierChange}
                      />
                    </Col>
                  </FormGroup>

                  <FormGroup row className="align-items-center">
                    <Label sm="4">Critical Remarks</Label>
                    <Col sm="8">
                      <Input
                        type="textarea"
                        name="criticalRemarks"
                        value={supplierDetails.criticalRemarks}
                        onChange={handleSupplierChange}
                      />
                    </Col>
                  </FormGroup>

                  <FormGroup row className="align-items-center">
                    <Label sm="4">Paid Amount To Supplier</Label>
                    <Col sm="8">
                      <div className="d-flex">
                        <Input
                          type="number"
                          name="paidAmountToSupplier"
                          value={supplierDetails.paidAmountToSupplier}
                          onChange={handleSupplierChange}
                        />
                       <Button color="info" className="ms-2" onClick={handleSplitAmount}>
  Split
</Button>

                      </div>
                    </Col>
                  </FormGroup>
                </Col>

                {/* LEFT SIDE */}
                <Col md={6}>
                  <FormGroup row className="align-items-center">
                    <Label sm="4">Voucher No</Label>
                    <Col sm="8">
                      <Input
                        name="voucherno"
                        value={supplierDetails.voucherno}
                        onChange={handleSupplierChange}
                      />
                    </Col>
                  </FormGroup>

                  <FormGroup row className="align-items-center">
                    <Label sm="4">Pay Mode</Label>
                    <Col sm="8">
                      <Input
                        type="select"
                        name="paymode"
                        value={supplierDetails.paymode}
                        onChange={handleSupplierChange}
                      >
                        <option value="">Select PayMode</option>
                        {payModes.map((p) => (
                          <option key={p.paymode_id} value={p.paymode_id}>
                            {p.paymode_name}
                          </option>
                        ))}
                      </Input>
                    </Col>
                  </FormGroup>

                  <FormGroup row className="align-items-center">
                    <Label sm="4">Accounts</Label>
                    <Col sm="8">
                      <Input
                        type="select"
                        name="accounts"
                        value={supplierDetails.accounts}
                        onChange={handleSupplierChange}
                      >
                        <option value="">Select Accounts</option>
                        {accounts.map((acc) => (
                          <option key={acc.valuelist_id} value={acc.value}>
                            {acc.value}
                          </option>
                        ))}
                      </Input>
                    </Col>
                  </FormGroup>
                </Col>
              </Row>
            </TabPane>

            {/* Currency Tab */}
            <TabPane tabId="2">
              <Row>
                <Col md={6}>
                  <FormGroup row className="align-items-center">
                    <Label sm="4">Currency</Label>
                    <Col sm="8">
                      <Input
                        name="currency"
                        value={currencyDetails.currency}
                        onChange={handleCurrencyChange}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row className="align-items-center">
                    <Label sm="4">Currency Name</Label>
                    <Col sm="8">
                      <Input
                        name="currencyName"
                        value={currencyDetails.currencyName}
                        onChange={handleCurrencyChange}
                      />
                    </Col>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup row className="align-items-center">
                    <Label sm="4">Currency Rate</Label>
                    <Col sm="8">
                      <Input
                        type="number"
                        name="currencyRate"
                        value={currencyDetails.currencyRate}
                        onChange={handleCurrencyChange}
                      />
                    </Col>
                  </FormGroup>
                </Col>
              </Row>
            </TabPane>
          </TabContent>
        </CardBody>
      </Card>

      {/* Payment Table Section */}
      <Card className="mt-4">
        <CardBody>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h5 className="mb-0">Payment</h5>
            <div className="d-flex">
              <FormGroup className="mb-0 me-2">
                <Input
                  type="date"
                  name="fromDate"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </FormGroup>
              <FormGroup className="mb-0 me-2">
                <Input
                  type="date"
                  name="toDate"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </FormGroup>
              <Button color="primary" onClick={fetchInvoices}>
                Get Invoice
              </Button>
              <FormGroup check inline className="ms-2">
                <Input type="checkbox" />
                <Label check>Select Payment</Label>
              </FormGroup>
            </div>
          </div>

          <Table responsive bordered>
            <thead>
              <tr>
                <th>Tran Type</th>
                <th>Invoice No</th>
                <th>Date</th>
                <th>Net Total</th>
                <th>Paid</th>
                <th>Balance</th>
                <th>Payable Amount</th>
                <th>Debit Amount</th>
                <th>Select</th>
                <th>Carry Days</th>
                <th>Credit Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.purchase_invoice_id}>
                  <td>{invoice.tran_type}</td>
                  <td>{invoice.tran_no}</td>
                  <td>{invoice.tran_date}</td>
                  <td>{Number(invoice.net_total).toFixed(2)}</td>
                  <td>{Number(invoice.paid).toFixed(2)}</td>
                  <td>{Number(invoice.balance).toFixed(2)}</td>
                  <td>{Number(invoice.payable_amount).toFixed(2)}</td>
                  <td>{Number(invoice.debit_amount).toFixed(2)}</td>
                  <td>
                    <Input
                      type="checkbox"
                      onChange={(e) =>
                        handleInvoiceSelection(e, invoice.purchase_invoice_id)
                      }
                      checked={selectedInvoices.includes(invoice.purchase_invoice_id)}
                    />
                  </td>
                  <td>{invoice.carry_days || ''}</td>
                  <td>{Number(invoice.credit_amount).toFixed(2)}</td>
                  <td>
                    <FaTrash
                      style={{ cursor: 'pointer', color: 'red' }}
                      onClick={() => handleDeleteInvoice(invoice.purchase_invoice_id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>

      {/* Footer Buttons */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <Button color="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <div className="d-flex align-items-center">
          <h5 className="mb-0 me-3">
            Total Paid Amount: $ {totalPaidAmount.toFixed(2)}
          </h5>
          <Button color="success" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default PaymentManagement;
