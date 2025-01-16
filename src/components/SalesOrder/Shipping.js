import React from 'react';
import { Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';
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
  <ComponentCard title="Currency Details">
    <Row>
      <Col md="4">
        <FormGroup>
          <Label>
          Delivery Name <span className="required"> *</span>
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
          <Label>Delivery Address1</Label>
          <Input
            type="text"
            onChange={handleInputs}
            value={supplier && supplier.email}
            name="email" />
        </FormGroup>
      </Col>
      <Col md="4">
        <FormGroup>
          <Label>Delivery Address2</Label>
          <Input
            type="text"
            onChange={handleInputs}
            value={supplier && supplier.fax}
            name="fax"  />
        </FormGroup>
      </Col>
      <Col md="4">
        <FormGroup>
          <Label>Delivery Address3</Label>
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
          <Label>Delivery Country</Label>
          <Input
            type="text"
            onChange={handleInputs}
            value={supplier && supplier.fax}
            name="fax"  />
        </FormGroup>
      </Col>
      <Col md="4">
        <FormGroup>
          <Label>Delivery Postal Code</Label>
          <Input
            type="text"
            onChange={handleInputs}
            value={supplier && supplier.fax}
            name="fax"  />
        </FormGroup>
      </Col>
      <Col md="4">
        <FormGroup>
          <Label>Deliery Date</Label>
          <Input
            type="text"
            onChange={handleInputs}
            value={supplier && supplier.fax}
            name="fax"  />
        </FormGroup>
      </Col>
    </Row>
  </ComponentCard>
</FormGroup>
</Form>

  );
}
