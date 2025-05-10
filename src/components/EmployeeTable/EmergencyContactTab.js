import React from 'react';
import { Col, Row, FormGroup, Label, Input } from 'reactstrap';
import PropTypes from 'prop-types';

function EmergencyContactTab({ emergencyContactDetails, handleEcInputs,arabic,arb }) {
  EmergencyContactTab.propTypes = {
    emergencyContactDetails: PropTypes.object,
    handleEcInputs: PropTypes.func,
    arb: PropTypes.any,
    arabic: PropTypes.any,
  };

 console.log('ara', arabic);

  
  return (
    <div>
      <Row>
        <Col md="3">
          <FormGroup>
          <Label dir="rtl" style={{ textAlign: 'right' }}>
                Name</Label>
            <Input
            name= {arb ? 'emergency_contact_name_arb' : 'emergency_contact_name'}
            value={
              arb
                ? (
                  emergencyContactDetails && emergencyContactDetails.emergency_contact_name_arb ? emergencyContactDetails.emergency_contact_name_arb :
                    (emergencyContactDetails && emergencyContactDetails.emergency_contact_name_arb !== null ? '' : emergencyContactDetails && emergencyContactDetails.emergency_contact_name)
                  )
                : (emergencyContactDetails && emergencyContactDetails.emergency_contact_name)
            }
              
              onChange={handleEcInputs}
              type="text"
            />
          </FormGroup>
        </Col>
        <Col md="3">
          <FormGroup>
          <Label dir="rtl" style={{ textAlign: 'right' }}>
                Phone 1</Label>
            <Input
            name= {arb ? 'emergency_contact_phone_arb' : 'emergency_contact_phone'}
            value={
              arb
                ? (
                  emergencyContactDetails && emergencyContactDetails.emergency_contact_phone_arb ? emergencyContactDetails.emergency_contact_phone_arb :
                    (emergencyContactDetails && emergencyContactDetails.emergency_contact_phone_arb !== null ? '' : emergencyContactDetails && emergencyContactDetails.emergency_contact_phone)
                  )
                : (emergencyContactDetails && emergencyContactDetails.emergency_contact_phone)
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
          <Label dir="rtl" style={{ textAlign: 'right' }}>
                Phone 2</Label>
            <Input
            name= {arb ? 'emergency_contact_phone2_arb' : 'emergency_contact_phone2'}
            value={
              arb
                ? (
                  emergencyContactDetails && emergencyContactDetails.emergency_contact_phone2_arb ? emergencyContactDetails.emergency_contact_phone2_arb :
                    (emergencyContactDetails && emergencyContactDetails.emergency_contact_phone2_arb !== null ? '' : emergencyContactDetails && emergencyContactDetails.emergency_contact_phone2)
                  )
                : (emergencyContactDetails && emergencyContactDetails.emergency_contact_phone2)
            }
              
              onChange={handleEcInputs}
              type="text"
            />
          </FormGroup>
        </Col>
        <Col md="3">
          <FormGroup>
          <Label dir="rtl" style={{ textAlign: 'right' }}>
                Address</Label>
            <Input
            name= {arb ? 'emergency_contact_address_arb' : 'emergency_contact_address'}
            value={
              arb
                ? (
                  emergencyContactDetails && emergencyContactDetails.emergency_contact_address_arb ? emergencyContactDetails.emergency_contact_address_arb :
                    (emergencyContactDetails && emergencyContactDetails.emergency_contact_address_arb !== null ? '' : emergencyContactDetails && emergencyContactDetails.emergency_contact_address)
                  )
                : (emergencyContactDetails && emergencyContactDetails.emergency_contact_address)
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
