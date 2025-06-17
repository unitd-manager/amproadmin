import React from 'react';
import { Row, Col, FormGroup, Label, Input } from 'reactstrap';
import PropTypes from 'prop-types';

export default function CustomerShippingDetailInsert({ handleInputs, contentDetails }) {
  return (
    <>
      <Row>
        <Col md="6">
          <FormGroup>
            <Label>Address Line 1</Label>
            <Input
              type="text"
              onChange={handleInputs}
              value={contentDetails && contentDetails.address}
              name="address"
            />
          </FormGroup>
        </Col>
        <Col md="6">
          <FormGroup>
            <Label>Address Line 2</Label>
            <Input
              type="text"
              onChange={handleInputs}
              value={contentDetails && contentDetails.address1}
              name="address1"
            />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md="6">
          <FormGroup>
            <Label>Address Line 3</Label>
            <Input
              type="text"
              onChange={handleInputs}
              value={contentDetails && contentDetails.address2}
              name="address2"
            />
          </FormGroup>
        </Col>
        <Col md="6">
          <FormGroup>
            <Label>Area / District</Label>
            <Input
              type="text"
              onChange={handleInputs}
              value={contentDetails && contentDetails.address_area}
              name="address_area"
            />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md="6">
          <FormGroup>
            <Label>City</Label>
            <Input
              type="text"
              onChange={handleInputs}
              value={contentDetails && contentDetails.address_city}
              name="address_city"
            />
          </FormGroup>
        </Col>
        <Col md="6">
          <FormGroup>
            <Label>State</Label>
            <Input
              type="text"
              onChange={handleInputs}
              value={contentDetails && contentDetails.address_state}
              name="address_state"
            />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md="6">
          <FormGroup>
            <Label>Country Code</Label>
            <Input
              type="text"
              onChange={handleInputs}
              value={contentDetails && contentDetails.address_country_code}
              name="address_country_code"
              placeholder="e.g., US, IN, UK"
            />
          </FormGroup>
        </Col>
        <Col md="6">
          <FormGroup>
            <Label>Postal Code</Label>
            <Input
              type="text"
              onChange={handleInputs}
              value={contentDetails && contentDetails.address_po_code}
              name="address_po_code"
            />
          </FormGroup>
        </Col>
      </Row>
    </>
  );
}

CustomerShippingDetailInsert.propTypes = {
  handleInputs: PropTypes.func,
  contentDetails: PropTypes.object,
};