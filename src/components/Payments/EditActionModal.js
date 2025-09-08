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
    company_name: '',
    payment_date: '',
    paymode_id: '',
    bank_name: '',
    cheque_ref_date: '',
    remarks: '',
    accounts: '',
    cheque_ref_no: ''
  });

  const [banks, setBanks] = useState([]);
  const [payModes, setPayModes] = useState([]);
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
        cheque_ref_date: payment.cheque_ref_date || '',
        remarks: payment.remarks || '',
        accounts: payment.accounts || '',
        cheque_ref_no: payment.cheque_ref_no || ''
      });
    }
  }, [payment]);

  useEffect(() => {
    api.get('/payments/getBankDropdown')
      .then(res => {
        const banksData = res.data && res.data.data ? res.data.data : [];
        console.log('Banks data:', banksData);
        setBanks(banksData);
      })
      .catch(() => message('Unable to fetch banks', 'error'));

    api.get('/payments/getPaymodeDropdown')
      .then(res => {
        const payModesData = res.data && res.data.data ? res.data.data : [];
        console.log('PayModes data:', payModesData);
        if (!Array.isArray(payModesData)) {
          message('PayModes data is not an array', 'error');
          setPayModes([]);
        } else {
          setPayModes(payModesData);
        }
      })
      .catch(() => {
        message('Unable to fetch pay modes', 'error');
        setPayModes([]);
      });

    api.get('/payments/getAccountsDropdown')
      .then(res => {
        const accountsData = res.data && res.data.data ? res.data.data : [];
        console.log('Accounts data:', accountsData);
        setAccounts(accountsData);
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
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>Edit Payments</ModalHeader>
      <ModalBody>
        <Form>
          <Row>
            <Col md={6} className="d-flex align-items-center">
              <div>
                <Label className="mb-1">Payment No</Label>
                <div style={{ fontWeight: 'bold' }}>{formData.payment_no}</div>
              </div>
            </Col>
            <Col md={6} className="d-flex align-items-center">
              <div>
                <Label className="mb-1">Supplier Name</Label>
                <div style={{ fontWeight: 'bold', whiteSpace: 'pre-wrap' }}>{formData.company_name}</div>
              </div>
            </Col>
          </Row>
         <br></br>

          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Payment Date</Label>
                <Input
                  type="date"
                  name="payment_date"
                  value={formData.payment_date}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Remarks</Label>
                <Input
                  type="text"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>PayMode</Label>
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
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Accounts</Label>
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
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Bank</Label>
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
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Cheque/Reference No</Label>
                <Input
                  name="cheque_ref_no"
                  value={formData.cheque_ref_no}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Cheque/Reference Date</Label>
                <Input
                  type="date"
                  name="cheque_ref_date"
                  value={formData.cheque_ref_date}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              {/* Empty column for alignment */}
            </Col>
          </Row>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSave}>
          Save
        </Button>
        <Button color="danger" onClick={toggle}>
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
