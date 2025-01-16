import React from 'react';
import { Row, Col, Form, FormGroup, Label, Input,} from 'reactstrap';
import PropTypes from 'prop-types';
import ComponentCard from '../ComponentCard';

export default function SupplierDetails({  handleInputs ,supplier }) {
  SupplierDetails.propTypes = {
    handleInputs: PropTypes.func,
    supplier: PropTypes.object,
  };

  return (
    <Form>
    <FormGroup>
  <ComponentCard title="Customer Details">
    <Row>
      <Col md="4">
        <FormGroup>
          <Label>
          Customer Code <span className="required"> *</span>
          </Label>
          <Input
            type="text"
            onChange={handleInputs}
            value={supplier && supplier.company_name}
            name="company_name"/>
        </FormGroup>
      </Col>
      <Col md="4">
        <FormGroup>
          <Label>Customer Name</Label>
          <Input
            type="text"
            onChange={handleInputs}
            value={supplier && supplier.email}
            name="email" />
        </FormGroup>
      </Col>
      <Col md="4">
        <FormGroup>
          <Label>Contact Person</Label>
          <Input
            type="text"
            onChange={handleInputs}
            value={supplier && supplier.fax}
            name="fax"  />
        </FormGroup>
      </Col>
      </Row>
      <Row>
      <Col md="4">
        <FormGroup>
          <Label>Remarks</Label>
          <Input
            type="text"
            onChange={handleInputs}
            value={supplier && supplier.mobile}
            name="mobile"  />
        </FormGroup>
      </Col>
      <Col md="4">
        <FormGroup>
          <Label>Contact Address 1</Label>
          <Input
            type="text"
            onChange={handleInputs}
            value={supplier && supplier.mobile}
            name="mobile"  />
        </FormGroup>
      </Col>
      <Col md="4">
        <FormGroup>
          <Label>Contact Address 2</Label>
          <Input
            type="text"
            onChange={handleInputs}
            value={supplier && supplier.mobile}
            name="mobile"  />
        </FormGroup>
      </Col>
      </Row>
      <Row>
      <Col md="4">
        <FormGroup>
          <Label>Contact address 3</Label>
          <Input
            type="text"
            onChange={handleInputs}
            value={supplier && supplier.payment_details}
            name="payment_details" />
        </FormGroup>
      </Col>
      <Col md="4">
        <FormGroup>
          <Label>Country</Label>
          <Input
            type="text"
            onChange={handleInputs}
            value={supplier && supplier.terms}
            name="terms" />
        </FormGroup>
      </Col>
      <Col md="4">
        <FormGroup>
          <Label>Postal Code</Label>
          <Input
            type="text"
            onChange={handleInputs}
            value={supplier && supplier.contact_person}
            name="contact_person"  />
        </FormGroup>
      </Col>
    </Row>
  </ComponentCard>
</FormGroup>
</Form>

  );
}
