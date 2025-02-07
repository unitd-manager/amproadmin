import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, FormGroup, Label, Input,Button } from 'reactstrap';
import { ToastContainer } from 'react-toastify';
import moment from 'moment';
import ComponentCard from '../ComponentCard';
import ComponentCardV2 from '../ComponentCardV2';
import PdfEmployeeContract from '../PDF/PdfEmployeeContract';
import PdfKET from '../PDF/PdfKET';

export default function Jobinformationedit({ handleInputsJobInformation, job,insertJobInformation,id }) {
  Jobinformationedit.propTypes = {
    handleInputsJobInformation: PropTypes.any,
    insertJobInformation: PropTypes.any,
    id: PropTypes.any,
    job: PropTypes.any,
  };
  return (
    <>
      <ComponentCardV2>
        <Row>
          <Col>
            <PdfEmployeeContract job={job}></PdfEmployeeContract>
          </Col>
          <Col>
            {/* Include PdfKET component here */}
            <PdfKET lang="arabic" />
          </Col>
          <Col>
          <Button className="shadow-none" onClick={() => insertJobInformation(id)} color="dark">
            Duplicate
          </Button>
          </Col>
        </Row>
      </ComponentCardV2>
      <ComponentCard title="Details of Employment (KET)" creationModificationDate={job}>
        <ToastContainer></ToastContainer>
        <br />
        <FormGroup>
          <Row>
            <Col md="6">
              <FormGroup>
                <Label>Employment Start/Commencement Date<span className="required"> *</span></Label>
                <Input
                  type="date"
                  onChange={handleInputsJobInformation}
                  value={job && moment(job.act_join_date).format('YYYY-MM-DD')}
                  name="act_join_date"
                />
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label>Duties & Responsibility</Label>
                <Input
                  type="text"
                  onChange={handleInputsJobInformation}
                  value={job && job.duty_responsibility}
                  name="duty_responsibility"
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md="6">
              <FormGroup>
                <Label>Duration of Employment(only for employees on fixed term contract)</Label>
                <Input
                  type="text"
                  onChange={handleInputsJobInformation}
                  value={job && job.duration_of_employment}
                  name="duration_of_employment"
                />
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label>Place of Work(if different from companys registered address)</Label>
                <Input
                  type="text"
                  onChange={handleInputsJobInformation}
                  value={job && job.place_of_work}
                  name="place_of_work"
                />
              </FormGroup>
            </Col>
          </Row>
        </FormGroup>
      </ComponentCard>
    </>
  );
}
