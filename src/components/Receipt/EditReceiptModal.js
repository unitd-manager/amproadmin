import React, { useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col,
} from 'reactstrap';
import PropTypes from 'prop-types';

const EditReceiptModal = ({ isOpen, toggle, receipt, onSave }) => {
  const [formData, setFormData] = useState({
    receipt_no: receipt?.receipt_no || '',
    receipt_date: receipt?.receipt_date || '',
    pay_mode: receipt?.pay_mode || 'CASH',
    bank: receipt?.bank || '',
    cheque_date: receipt?.cheque_date || '',
    remarks: receipt?.remarks || '',
    account: receipt?.account || '',
    cheque_no: receipt?.cheque_no || '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>Edit Receipt</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Receipt No</Label>
                <Input
                  type="text"
                  name="receipt_no"
                  value={formData.receipt_no}
                  onChange={handleInputChange}
                  disabled
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Customer Name</Label>
                <Input
                  type="text"
                  name="customer_name"
                  value={receipt?.customer_name || ''}
                  disabled
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Receipt Date</Label>
                <Input
                  type="date"
                  name="receipt_date"
                  value={formData.receipt_date}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Pay Mode</Label>
                <Input
                  type="select"
                  name="pay_mode"
                  value={formData.pay_mode}
                  onChange={handleInputChange}
                >
                  <option value="CASH">CASH</option>
                  <option value="CHEQUE">CHEQUE</option>
                  <option value="BANK TRANSFER">BANK TRANSFER</option>
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
                  name="bank"
                  value={formData.bank}
                  onChange={handleInputChange}
                >
                  <option value="">Select Bank</option>
                  <option value="DBS">DBS</option>
                  <option value="OCBC">OCBC</option>
                  <option value="UOB">UOB</option>
                </Input>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Accounts</Label>
                <Input
                  type="select"
                  name="account"
                  value={formData.account}
                  onChange={handleInputChange}
                >
                  <option value="">Select Account</option>
                  <option value="Account 1">Account 1</option>
                  <option value="Account 2">Account 2</option>
                </Input>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Cheque/Reference Date</Label>
                <Input
                  type="date"
                  name="cheque_date"
                  value={formData.cheque_date}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Cheque/Reference No</Label>
                <Input
                  type="text"
                  name="cheque_no"
                  value={formData.cheque_no}
                  onChange={handleInputChange}
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
              onChange={handleInputChange}
              rows="3"
            />
          </FormGroup>
          <div className="d-flex justify-content-end gap-2">
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
            <Button color="primary" type="submit">
              Save
            </Button>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  );
};

EditReceiptModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  receipt: PropTypes.object,
  onSave: PropTypes.func.isRequired,
};

export default EditReceiptModal;