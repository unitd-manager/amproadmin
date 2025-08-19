import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
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
    supplier_name: '',
    bank_id: '',
    paymode_id: '',
    account_id: '',
    cheque_ref_no: '',
    cheque_date: '',
    paid_amount: '',
    remarks: ''
  });

  const [banks, setBanks] = useState([]);
  const [payModes, setPayModes] = useState([]);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    if (payment) {
      setFormData({
        payments_id: payment.payments_id || '',
        payment_no: payment.payment_no || '',
        supplier_name: payment.supplier_name || '',
        bank_id: payment.bank_id || '',
        paymode_id: payment.paymode_id || '',
        account_id: payment.account_id || '',
        cheque_ref_no: payment.cheque_ref_no || '',
        cheque_date: payment.cheque_date || '',
        paid_amount: payment.paid_amount || '',
        remarks: payment.remarks || ''
      });
    }
  }, [payment]);

  useEffect(() => {
    api.get('/payments/getBankDropdown')
      .then(res => setBanks(res.data.data || []))
      .catch(() => message('Unable to fetch banks', 'error'));

    api.get('/payments/getPaymodeDropdown')
      .then(res => setPayModes(res.data.data || []))
      .catch(() => message('Unable to fetch pay modes', 'error'));

    api.get('/payments/getAccountsDropdown')
      .then(res => setAccounts(res.data.data || []))
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
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>Edit Payment</ModalHeader>
      <ModalBody>
        <Form>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Payment No</Label>
                <Input value={formData.payment_no} readOnly />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Supplier</Label>
                <Input value={formData.supplier_name} readOnly />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Bank</Label>
                <Input
                  type="select"
                  name="bank_id"
                  value={formData.bank_id}
                  onChange={handleChange}
                >
                  <option value="">Select Bank</option>
                  {banks.map(bank => (
                    <option key={bank.valuelist_id} value={bank.key_text}>
                      {bank.key_text}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Pay Mode</Label>
                <Input
                  type="select"
                  name="paymode_id"
                  value={formData.paymode_id}
                  onChange={handleChange}
                >
                  <option value="">Select Pay Mode</option>
                  {payModes.map(pm => (
                    <option key={pm.paymode_id} value={pm.paymode_id}>
                      {pm.paymode_name}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Account</Label>
                <Input
                  type="select"
                  name="account_id"
                  value={formData.account_id}
                  onChange={handleChange}
                >
                  <option value="">Select Account</option>
                  {accounts.map(acc => (
                    <option key={acc.account_id} value={acc.account_id}>
                      {acc.account_name}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Paid Amount</Label>
                <Input
                  type="number"
                  name="paid_amount"
                  value={formData.paid_amount}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Cheque Ref No</Label>
                <Input
                  name="cheque_ref_no"
                  value={formData.cheque_ref_no}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Cheque Date</Label>
                <Input
                  type="date"
                  name="cheque_date"
                  value={formData.cheque_date}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>
          </Row>

          <FormGroup>
            <Label>Remarks</Label>
            <Input
              type="textarea"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSave}>
          Save
        </Button>
        <Button color="secondary" onClick={toggle}>
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
