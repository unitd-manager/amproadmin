import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, FormGroup, Label, Input } from 'reactstrap';

export default function JobWorkingHours({ handleInputsJobInformation, job }) {
  JobWorkingHours.propTypes = {
    handleInputsJobInformation: PropTypes.any,
    job: PropTypes.any,
  };
  return (
    <FormGroup>
      <Row>
        <Col md="4">
          <FormGroup>
            <Label>Details of Working Hours</Label>
            <Input
              type="textarea"
              onChange={handleInputsJobInformation}
              value={job && job.work_hour_details}
              name="work_hour_details"
            />
          </FormGroup>
        </Col>
        <Col md="4">
          <FormGroup>
            <Label>Rest day per Week</Label>
            <Input
              type="text"
              onChange={handleInputsJobInformation}
              value={job && job.rest_day_per_week}
              name="rest_day_per_week"
            />
          </FormGroup>
        </Col>
      </Row>
    </FormGroup>
  );
}
