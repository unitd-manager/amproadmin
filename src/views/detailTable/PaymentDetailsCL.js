import React, { useState, useEffect } from 'react';
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
import message from '../../components/Message';
import api from '../../constants/api';



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
  const [suppliers, setSuppliers] = useState([]);
  const [payModes, setPayModes] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const navigate = useNavigate();
  // Fetch suppliers
  const fetchSuppliers = async () => {
    try {
      const res = await api.get('/payments/getSupplierDropdown');
      const supplierData = res.data?.data || res.data || [];
      setSuppliers(Array.isArray(supplierData) ? supplierData : []);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
      setSuppliers([]);
      message('Failed to fetch suppliers', 'error');
    }
  };

  // Fetch pay modes
  const fetchPayModes = async () => {
    try {
      const res = await api.get('/payments/getPaymodeDropdown');
      const payModeData = res.data?.data || res.data || [];
      setPayModes(Array.isArray(payModeData) ? payModeData : []);
    } catch (err) {
      console.error('Error fetching pay modes:', err);
      setPayModes([]);
      message('Failed to fetch pay modes', 'error');
    }
  };

  // Fetch accounts
  const fetchAccounts = async () => {
    try {
      const res = await api.get('/payments/getAccountsDropdown');
      const accountData = res.data?.data || res.data || [];
      setAccounts(Array.isArray(accountData) ? accountData : []);
    } catch (err) {
      console.error('Error fetching accounts:', err);
      setAccounts([]);
      message('Failed to fetch accounts', 'error');
    }
  };

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const handleSupplierChange = (e) => {
    const { name, value } = e.target;
    if (name === 'supplierCode') {
      const selectedSupplier = suppliers.find((s) => s.supplier_code === value);
      setSupplierDetails((prev) => ({
        ...prev,
        supplierCode: value,
        supplierName: selectedSupplier ? selectedSupplier.company_name : '',
        supplierId: selectedSupplier ? selectedSupplier.supplier_id : '',
      }));
    } else {
      setSupplierDetails((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCurrencyChange = (e) => {
    const { name, value } = e.target;
    setCurrencyDetails((prev) => ({ ...prev, [name]: value }));
  };

  const fetchInvoices = async () => {
    if (!supplierDetails.supplierId) {
      message('Please select a supplier first', 'warning');
      return;
    }
    try {
      const res = await api.get(`/payments/getInvoices/${supplierDetails.supplierId}`, {
        params: {
          fromDate,
          toDate,
        },
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
    const payload = {
      supplierId: supplierDetails.supplierId,
      paymentDate: supplierDetails.paymentDate,
      remarks: supplierDetails.remarks,
      criticalRemarks: supplierDetails.criticalRemarks,
      paidAmountToSupplier: supplierDetails.paidAmountToSupplier,
      voucherno: supplierDetails.voucherno,
      paymode: supplierDetails.paymode,
      accounts: supplierDetails.accounts,
      currency: currencyDetails.currency,
      currencyRate: currencyDetails.currencyRate,
    };

    const res = await api.post('/payments/insertPayment', payload);
    if (res.data.success) {
      message('Payment saved successfully', 'success');
    } else {
      message('Failed to save payment', 'error');
    }
  } catch (err) {
    console.error('Error saving payment:', err);
    message('Error saving payment', 'error');
  }
};


  const totalPaidAmount = invoices.reduce((sum, inv) => sum + (inv.paid || 0), 0);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    setSupplierDetails((prev) => ({ ...prev, paymentDate: today }));

    fetchSuppliers();
    fetchPayModes();
    fetchAccounts();
  }, []);

  const handleCancel = () => {
    navigate('/paymentsCL');
  };
const handleDeleteInvoice = (id) => {
  setInvoices((prev) => prev.filter((inv) => inv.purchase_invoice_id !== id));
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
            <TabPane tabId="1">
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label>Payment Date</Label>
                    <Input
                      type="date"
                      name="paymentDate"
                      value={supplierDetails.paymentDate}
                      onChange={handleSupplierChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Supplier Code</Label>
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
                  </FormGroup>
                  <FormGroup>
                    <Label>Supplier Name</Label>
                    <Input
                      name="supplierName"
                      value={supplierDetails.supplierName}
                      readOnly
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Remarks</Label>
                    <Input
                      type="textarea"
                      name="remarks"
                      value={supplierDetails.remarks}
                      onChange={handleSupplierChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Critical Remarks</Label>
                    <Input
                      type="textarea"
                      name="criticalRemarks"
                      value={supplierDetails.criticalRemarks}
                      onChange={handleSupplierChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Paid Amount To Supplier</Label>
                    <Input
                      type="number"
                      name="paidAmountToSupplier"
                      value={supplierDetails.paidAmountToSupplier}
                      onChange={handleSupplierChange}
                    />
                    <Button color="info" className="mt-2">
                      Split
                    </Button>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>Voucher No</Label>
                    <Input
                      name="voucherno"
                      value={supplierDetails.voucherno}
                      onChange={handleSupplierChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Pay Mode</Label>
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
                  </FormGroup>
                  <FormGroup>
                    <Label>Accounts</Label>
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
                  </FormGroup>
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId="2">
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label>Currency</Label>
                    <Input
                      name="currency"
                      value={currencyDetails.currency}
                      onChange={handleCurrencyChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Currency Name</Label>
                    <Input
                      name="currencyName"
                      value={currencyDetails.currencyName}
                      onChange={handleCurrencyChange}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>Currency Rate</Label>
                    <Input
                      type="number"
                      name="currencyRate"
                      value={currencyDetails.currencyRate}
                      onChange={handleCurrencyChange}
                    />
                  </FormGroup>
                </Col>
              </Row>
            </TabPane>
          </TabContent>
        </CardBody>
      </Card>

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
                    <Input type="checkbox" />
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
      <div className="d-flex justify-content-between align-items-center mt-3">
        <Button color="secondary" onClick={handleCancel}>Cancel</Button>

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
