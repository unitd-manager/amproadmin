import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, FormGroup, Label, Input } from 'reactstrap';
import moment from 'moment';

export default function JobTermination({ handleInputsJobInformation, job }) {
  JobTermination.propTypes = {
    handleInputsJobInformation: PropTypes.any,
    job: PropTypes.any,
  };
  return (
      <FormGroup>
        <Row>
          <Col md="4">
            <FormGroup>
              <Label>Notice Period for Termination</Label>
              <Input
                type="textarea"
                onChange={handleInputsJobInformation}
                value={job && job.notice_period_for_termination}
                name="notice_period_for_termination"
              />
            </FormGroup>
          </Col>
          <Col md="4">
            <FormGroup>
              <Label>Date of Resignation Notice</Label>
              <Input
                type="date"
                onChange={handleInputsJobInformation}
                value={job && moment(job.resignation_notice_date).format('YYYY-MM-DD')}
                name="resignation_notice_date"
              />
            </FormGroup>
          </Col>
          <Col md="4">
            <FormGroup>
              <Label>Termination/Cessation Date</Label>
              <Input
                type="date"
                onChange={handleInputsJobInformation}
                value={job && moment(job.termination_date).format('YYYY-MM-DD')}
                name="termination_date"
              />
            </FormGroup>
          </Col>
          <Col md="4">
            <FormGroup>
              <Label>Reason for Termination</Label>
              <Input
                type="textarea"
                onChange={handleInputsJobInformation}
                value={job && job.termination_reason}
                name="termination_reason"
              />
            </FormGroup>
          </Col>
          <Col md="4">
            <FormGroup>
              <Label>Departure Date</Label>
              <Input
                type="date"
                onChange={handleInputsJobInformation}
                value={job && moment(job.departure_date).format('YYYY-MM-DD')}
                name="departure_date"
              />
            </FormGroup>
          </Col>
        </Row>
      </FormGroup>
  );
}
