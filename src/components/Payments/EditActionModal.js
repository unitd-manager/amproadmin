import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  Label,
  Input,
  Row,
  Col
} from 'reactstrap';
import api from '../../constants/api';
import message from '../Message';

const EditActionModal = ({ isOpen, toggle, payment, refreshPayments }) => {
  const [formData, setFormData] = useState({
    payments_id: '',
    payment_no: '',
    company_name: '',
    payment_date: '',
    paymode_id: '', 
    bank_name: '',
    cheque_reference_date: '',
    remarks: '',
    accounts: '',
    cheque_reference_no: ''
  });

  const [banks, setBanks] = useState([]);
  const [payModes, setPayModes] = useState([]);
  console.log(payModes,'payModes');
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    if (payment) {
      setFormData({
        payments_id: payment.payments_id || '',
        payment_no: payment.payment_no || '',
        company_name: payment.company_name || '',
        payment_date: payment.payment_date || '',
        paymode_id: payment.paymode_id || '',
        bank_name: payment.bank_name || '',
        cheque_reference_date: payment.cheque_reference_date || '',
        remarks: payment.remarks || '',
        accounts: payment.accounts || '',
        cheque_reference_no: payment.cheque_reference_no || ''
      });
    }
  }, [payment]);

 useEffect(() => {
  // Fetch banks
  api.get('/payments/getBankDropdown')
    .then(res => {
      console.log('Banks Response:', res.data);
      setBanks(res.data?.data || []);
    })
    .catch(() => message('Unable to fetch banks', 'error'));

  // Fetch paymodes
  api.get('/payments/getPaymodeDropdown')
    .then(res => {
      console.log('PayModes Response:', res.data);
      setPayModes(res.data || []);
    })
    .catch(() => message('Unable to fetch pay modes', 'error'));

  // Fetch accounts
  api.get('/payments/getAccountsDropdown')
    .then(res => {
      console.log('Accounts Response:', res.data);
      setAccounts(res.data?.data || []);
    })
    .catch(() => message('Unable to fetch accounts', 'error'));
}, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    api
      .post('/payments/updatePayment', formData)
      .then(() => {
        message('Payment updated successfully', 'success');
        refreshPayments();
        toggle();
      })
      .catch(() => {
        message('Unable to update payment', 'error');
      });
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle} className="fw-bold">
        Edit Payments
      </ModalHeader>
      <ModalBody>
        <Form>
          {/* Top section */}
          <Row className="mb-3">
            <Col md={2}>
              <Label className="fw-bold">Payment No</Label>
              </Col>
              <Col md={4}>
              {formData.payment_no}
            </Col>
            <Col md={2}>
              <Label className="fw-bold">Supplier Name</Label></Col><Col md={4}>
              {formData.company_name}
            </Col>
          </Row>
          <br></br>
          <br></br>
          


          {/* Payment Date / Remarks */}
          <Row className="mb-3 align-items-center">
            <Col md={2}><Label>Payment Date</Label></Col>
            <Col md={4}>
              <Input
                type="date"
                name="payment_date"
                value={formData.payment_date}
                onChange={handleChange}
              />
            </Col>
            <Col md={2}><Label>Remarks</Label></Col>
            <Col md={4}>
              <Input
                type="text"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
              />
            </Col>
          </Row>

          {/* PayMode / Accounts */}
          <Row className="mb-3 align-items-center">
            <Col md={2}><Label>PayMode</Label></Col>
            <Col md={4}>
              <Input
                type="select"
                name="paymode_id"
                value={formData.paymode_id}
                onChange={handleChange}
              >
                <option value="">Select PayMode</option>
                {payModes.map(pm => (
                  <option key={pm.paymode_id} value={pm.paymode_id}>
                    {pm.paymode_name}
                  </option>
                ))}
              </Input>
            </Col>
            <Col md={2}><Label>Accounts</Label></Col>
            <Col md={4}>
              <Input
                type="select"
                name="accounts"
                value={formData.accounts}
                onChange={handleChange}
              >
                <option value="">Select Account</option>
                {accounts.map(acc => (
                  <option key={acc.valuelist_id} value={acc.value}>
                    {acc.value}
                  </option>
                ))}
              </Input>
            </Col>
          </Row>

          {/* Bank / Cheque No */}
          <Row className="mb-3 align-items-center">
            <Col md={2}><Label>Bank</Label></Col>
            <Col md={4}>
              <Input
                type="select"
                name="bank_name"
                value={formData.bank_name}
                onChange={handleChange}
              >
                <option value="">Select Bank</option>
                {banks.map(bank => (
                  <option key={bank.valuelist_id} value={bank.value}>
                    {bank.value}
                  </option>
                ))}
              </Input>
            </Col>
            <Col md={2}><Label>Cheque/Reference No</Label></Col>
            <Col md={4}>
              <Input
                type="text"
                name="cheque_reference_no"
                value={formData.cheque_reference_no}
                onChange={handleChange}
              />
            </Col>
          </Row>

          {/* Cheque/Reference Date */}
          <Row className="mb-3 align-items-center">
            <Col md={2}><Label>Cheque/Reference Date</Label></Col>
            <Col md={4}>
              <Input
                type="date"
                name="cheque_reference_date"
                value={formData.cheque_reference_date}
                onChange={handleChange}
              />
            </Col>
          </Row>
        </Form>
      </ModalBody>

      <ModalFooter>
        <Button
          style={{
            backgroundColor: '#003366',
            borderColor: '#003366',
            padding: '6px 20px',
          }}
          onClick={handleSave}
        >
          Save
        </Button>
        <Button
          style={{
            backgroundColor: '#e74c3c',
            borderColor: '#e74c3c',
            padding: '6px 20px',
          }}
          onClick={toggle}
        >
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

EditActionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  payment: PropTypes.object,
  refreshPayments: PropTypes.func.isRequired
};

export default EditActionModal;
