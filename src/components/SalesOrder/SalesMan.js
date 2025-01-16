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
  <ComponentCard title="Sales man Details">
    <Row>
      <Col md="4">
        <FormGroup>
          <Label>
            Sales Man <span className="required"> *</span>
          </Label>
          <Input
            type="text"
            onChange={handleInputs}
            value={supplier && supplier.sales_man}
            name="company_name"/>
        </FormGroup>
      </Col>
      </Row>
    
  </ComponentCard>
</FormGroup>
</Form>

  );
}
