import React from 'react';
import { Col, Row, FormGroup, Label, Input } from 'reactstrap';
import PropTypes from 'prop-types';

function EmergencyContactTab({ emergencyContactDetails, handleEcInputs }) {
  EmergencyContactTab.propTypes = {
    emergencyContactDetails: PropTypes.object,
    handleEcInputs: PropTypes.func,
  };

  return (
    <div>
      <Row>
        <Col md="3">
          <FormGroup>
            <Label>Name</Label>
            <Input
              name="emergency_contact_name"
              defaultValue={
                emergencyContactDetails && emergencyContactDetails.emergency_contact_name
              }
              onChange={handleEcInputs}
              type="text"
            />
          </FormGroup>
        </Col>
        <Col md="3">
          <FormGroup>
            <Label>Phone 1</Label>
            <Input
              name="emergency_contact_phone"
              defaultValue={
                emergencyContactDetails && emergencyContactDetails.emergency_contact_phone
              }
              onChange={handleEcInputs}
              type="text"
            />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md="3">
          <FormGroup>
            <Label>Phone 2</Label>
            <Input
              name="emergency_contact_phone2"
              defaultValue={
                emergencyContactDetails && emergencyContactDetails.emergency_contact_phone2
              }
              onChange={handleEcInputs}
              type="text"
            />
          </FormGroup>
        </Col>
        <Col md="3">
          <FormGroup>
            <Label>Address</Label>
            <Input
              name="emergency_contact_address"
              defaultValue={
                emergencyContactDetails && emergencyContactDetails.emergency_contact_address
              }
              onChange={handleEcInputs}
              type="text"
            />
          </FormGroup>
        </Col>
      </Row>
    </div>
  );
}

export default EmergencyContactTab;
