import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes for validation
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Button,
  Table,
} from 'reactstrap';
import classnames from 'classnames';
import api from '../../constants/api';
import message from '../Message';

// The 'payment' prop was not used, so it's removed. Props 'isOpen' and 'toggle' are now validated.
const PaymentVoucherModal = ({ isOpen, toggle }) => {
  const [activeTab, setActiveTab] = useState('1');
  const [tranNo, setTranNo] = useState('');
  const [tranDate, setTranDate] = useState(new Date().toISOString().split('T')[0]);

  // Supplier data
  const [supplierList, setSupplierList] = useState([]);
  const [supplierCode, setSupplierCode] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [remarks, setRemarks] = useState('');
  const [paymodes, setPaymodes] = useState([]);
  const [paymode, setPaymode] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [account, setAccount] = useState('');
  const [billNo, setBillNo] = useState('');
console.log(setSupplierCode,setPaymode,paymodes);
  // Expense rows, now with a unique ID for better keying
  const [expenseGroups, setExpenseGroups] = useState([]);
  const [expenses, setExpenses] = useState([{ id: crypto.randomUUID(), group: '', account: '', amount: '' }]);

  // Currency
  const [currencyList, setCurrencyList] = useState([]);
  const [currency, setCurrency] = useState('');
  const [currencyRate, setCurrencyRate] = useState('');

  // Load dropdown data
  useEffect(() => {
    // This is a placeholder for your API calls.
    // In a real application, you'd want to handle loading states and errors.
    api.get('/payments/getSupplierDropdown').then((res) => setSupplierList(res.data.data));
    api.get('/payments/getPaymodeDropdown').then((res) => setPaymodes(res.data.data));
    api.get('/payments/getAccountsDropdown').then((res) => setAccounts(res.data.data));
    api.get('/payments/getExpenseGroup').then((res) => setExpenseGroups(res.data));
    api.get('/payments/getCurrency').then((res) => setCurrencyList(res.data));

    // Generate Tran No from backend
    api.get('/payments/getNextTranNo').then((res) => setTranNo(res.data.tran_no));
  }, []);

  // Auto-fill supplier name
  useEffect(() => {
    if (supplierCode) {
      const selected = supplierList.find((s) => s.code === supplierCode);
      setSupplierName(selected ? selected.name : '');
    }
  }, [supplierCode, supplierList]);

  // Auto fetch currency rate
  useEffect(() => {
    if (currency) {
      api.post('/payments/getCurrencyRate', { code: currency }).then((res) => {
        setCurrencyRate(res.data.rate);
      });
    }
  }, [currency]);

  // Handle expense row changes
  const handleExpenseChange = (id, field, value) => {
    const updated = expenses.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    setExpenses(updated);
  };

  const addExpenseRow = () => {
    // We now use a unique ID for each new row to fix the 'react/no-array-index-key' error.
    setExpenses([...expenses, { id: crypto.randomUUID(), group: '', account: '', amount: '' }]);
  };

  const removeExpenseRow = (id) => {
    const updated = expenses.filter((exp) => exp.id !== id);
    setExpenses(updated);
  };

  // Submit form
  const handleSubmit = () => {
    const payload = {
      tranNo,
      tranDate,
      supplierCode,
      supplierName,
      remarks,
      paymode,
      account,
      billNo,
      expenses,
      currency,
      currencyRate,
    };

    api.post('/payments/createVoucher', payload)
      .then(() => {
        message('Voucher created successfully', 'success');
        toggle();
      })
      .catch(() => message('Failed to create voucher', 'error'));
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>Payment Voucher</ModalHeader>
      <ModalBody>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label>Tran No</Label>
              <Input type="text" value={tranNo} readOnly />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label>Tran Date</Label>
              <Input type="date" value={tranDate} onChange={(e) => setTranDate(e.target.value)} />
            </FormGroup>
          </Col>
        </Row>

        <Nav tabs>
          <NavItem>
            <NavLink className={classnames({ active: activeTab === '1' })} onClick={() => setActiveTab('1')}>
              Supplier
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={classnames({ active: activeTab === '2' })} onClick={() => setActiveTab('2')}>
              Expense
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={classnames({ active: activeTab === '3' })} onClick={() => setActiveTab('3')}>
              Currency
            </NavLink>
          </NavItem>
        </Nav>

        <TabContent activeTab={activeTab}>
          {/* Supplier Tab */}
          <TabPane tabId="1">
            <Row className="mt-3">
              <Col md={6}>
                {/* <FormGroup>
                  <Label>Supplier Code</Label>
                  <Input type="select" value={supplierCode} onChange={(e) => setSupplierCode(e.target.value)}>
                    <option value="">Select</option>
                    {supplierList && supplierList.map((s) => (
                      <option key={s.code} value={s.code}>{s.code}</option>
                    ))}
                  </Input>
                </FormGroup> */}
                <FormGroup>
                  <Label>Remarks</Label>
                  <Input type="text" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
                </FormGroup>
                {/* <FormGroup>
                  <Label>Paymode</Label>
                  <Input type="select" value={paymode} onChange={(e) => setPaymode(e.target.value)}>
                    <option value="">Select</option>
                    {paymodes.map((p) => (
                      <option key={p.id} value={p.code}>{p.name}</option>
                    ))}
                  </Input>
                </FormGroup> */}
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Supplier Name</Label>
                  <Input type="text" value={supplierName} readOnly />
                </FormGroup>
                <FormGroup>
                  <Label>Accounts</Label>
                  <Input type="select" value={account} onChange={(e) => setAccount(e.target.value)}>
                    <option value="">Select</option>
                    {accounts.map((a) => (
                      <option key={a.id} value={a.code}>{a.name}</option>
                    ))}
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label>Bill No</Label>
                  <Input type="text" value={billNo} onChange={(e) => setBillNo(e.target.value)} />
                </FormGroup>
              </Col>
            </Row>
          </TabPane>

          {/* Expense Tab */}
          <TabPane tabId="2">
            <Table bordered className="mt-3">
              <thead>
                <tr>
                  <th>Expense Group</th>
                  <th>Account</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp.id}>
                    <td>
                      <Input
                        type="select"
                        value={exp.group}
                        onChange={(e) => handleExpenseChange(exp.id, 'group', e.target.value)}
                      >
                        <option value="">Select</option>
                        {expenseGroups.map((g) => (
                          <option key={g.id} value={g.code}>{g.name}</option>
                        ))}
                      </Input>
                    </td>
                    <td>
                      <Input
                        type="select"
                        value={exp.account}
                        onChange={(e) => handleExpenseChange(exp.id, 'account', e.target.value)}
                      >
                        <option value="">Select</option>
                        {accounts.map((a) => (
                          <option key={a.id} value={a.code}>{a.name}</option>
                        ))}
                      </Input>
                    </td>
                    <td>
                      <Input
                        type="number"
                        value={exp.amount}
                        onChange={(e) => handleExpenseChange(exp.id, 'amount', e.target.value)}
                      />
                    </td>
                    <td>
                      {/* We now use the unique ID to find the correct row to remove */}
                      <Button color="danger" size="sm" onClick={() => removeExpenseRow(exp.id)}>X</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Button color="primary" size="sm" onClick={addExpenseRow}>+ Add Expense</Button>
          </TabPane>

          {/* Currency Tab */}
          <TabPane tabId="3">
            <Row className="mt-3">
              <Col md={6}>
                <FormGroup>
                  <Label>Currency Code</Label>
                  <Input type="select" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                    <option value="">Select</option>
                    {currencyList.map((c) => (
                      <option key={c.id} value={c.code}>{c.code}</option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Currency Rate</Label>
                  <Input type="text" value={currencyRate} readOnly />
                </FormGroup>
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </ModalBody>
      <ModalFooter>
        <Button color="success" onClick={handleSubmit}>Save</Button>
        <Button color="secondary" onClick={toggle}>Cancel</Button>
      </ModalFooter>
    </Modal>
  );
};

// Add PropTypes for validation
PaymentVoucherModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default PaymentVoucherModal;
