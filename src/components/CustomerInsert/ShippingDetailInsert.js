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
              value={contentDetails && contentDetails.address_street}
              name="address_street"
            />
          </FormGroup>
        </Col>
        <Col md="6">
          <FormGroup>
            <Label>Address Line 2</Label>
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
            <Label>Address Line 3</Label>
            <Input
              type="text"
              onChange={handleInputs}
              value={contentDetails && contentDetails.address_town}
              name="address_town"
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
            <Label>Country</Label>
            <Input
              type="text"
              onChange={handleInputs}
              value={contentDetails && contentDetails.address_country}
              name="address_country"
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