import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, FormGroup, Label, Input } from 'reactstrap';
import { ToastContainer } from 'react-toastify';
import moment from 'moment';
//import ComponentCard from '../ComponentCard';

export default function JobInformationKeyDetails({ handleInputs, jobModal }) {
  JobInformationKeyDetails.propTypes = {
    handleInputs: PropTypes.object,
    jobModal: PropTypes.object,
  };
  return (
 <>
       <ToastContainer></ToastContainer>
      <FormGroup>
        <Row>
          <Col md="3">
            <FormGroup>
              <Label>Employment Start/Commencement Date</Label>
              <Input
                type="date"
                onChange={handleInputs}
                value={jobModal && moment(jobModal.act_join_date).format('YYYY-MM-DD')}
                name="act_join_date"
              />
            </FormGroup>
          </Col>
          <Col md="3">
            <FormGroup>
              <Label>Duties & Responsibility</Label>
              <Input
                type="text"
                onChange={handleInputs}
                value={jobModal && jobModal.duty_responsibility}
                name="duty_responsibility"
              />
            </FormGroup>
          </Col>
          <Col md="3">
            <FormGroup>
              <Label>Duration of Employment(only for employees on fixed term contract)</Label>
              <Input
                type="text"
                onChange={handleInputs}
                value={jobModal && jobModal.duration_of_employment}
                name="duration_of_employment"
              />
            </FormGroup>
          </Col>
          <Col md="3">
            <FormGroup>
              <Label>Place of Work(if different from companys registered address)</Label>
              <Input
                type="text"
                onChange={handleInputs}
                value={jobModal && jobModal.place_of_work}
                name="place_of_work"
              />
            </FormGroup>
          </Col>
        </Row>
      </FormGroup>
    </>
  );
}
