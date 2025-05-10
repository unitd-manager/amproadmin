import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, FormGroup, Label, Input } from 'reactstrap';

export default function JobWorkingHours({ handleInputsJobInformation, job,arb }) {
  JobWorkingHours.propTypes = {
    handleInputsJobInformation: PropTypes.any,
    job: PropTypes.any,
    arb: PropTypes.any,

  };
 
  return (
    <FormGroup>
      <Row>
        <Col md="4">
          <FormGroup>
          <Label dir="rtl" style={{ textAlign: 'right' }}>
                Details of Working Hours
              </Label>
          
            <Input
              type="textarea"
              onChange={handleInputsJobInformation}
              value={
                arb
                  ? job && job.work_hour_details_arb
                  : job && job.work_hour_details
              }
              name={arb ? 'work_hour_details_arb' : 'work_hour_details'}
            />
          </FormGroup>
        </Col>
        <Col md="4">
          <FormGroup>
          <Label dir="rtl" style={{ textAlign: 'right' }}>
                Rest day per Week
              </Label>
            
              <Input
              type="text"
              onChange={handleInputsJobInformation}
              value={
                arb
                  ? job && job.rest_day_per_week_arb
                  : job && job.rest_day_per_week
              }
              name={arb ? 'rest_day_per_week_arb' : 'rest_day_per_week'}
            />
          </FormGroup>
        </Col>
      </Row>
    </FormGroup>
  );
}
