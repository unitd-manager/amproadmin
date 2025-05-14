import React from 'react';
import { Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import PropTypes from 'prop-types';
import moment from 'moment';
import ComponentCard from '../ComponentCard';

export default function TrainingMainDetails({ trainingDetails, handleInputs }) {
  TrainingMainDetails.propTypes = {
    trainingDetails: PropTypes.object,
    handleInputs: PropTypes.func,
  };

  return (
    <ComponentCard title="Main Details" creationModificationDate={trainingDetails}>
      <Form>
        <Row>
          <Col md="4">
            <FormGroup>
              <Label>Title <span className='required'>*</span></Label>
              <Input
                type="text"
                onChange={handleInputs}
                value={trainingDetails?.title || ''}
                name="title"
              />
            </FormGroup>
          </Col>
          <Col md="4">
            <FormGroup>
              <Label>From Date <span className='required'>*</span></Label>
              <Input
                type="date"
                onChange={handleInputs}
                value={trainingDetails?.from_date || ''}
                name="from_date"
              />
            </FormGroup>
          </Col>
          <Col md="4">
            <FormGroup>
              <Label>To Date <span className='required'>*</span></Label>
              <Input
                type="date"
                onChange={handleInputs}
                min={moment(trainingDetails?.from_date).format('YYYY-MM-DD')}
                value={trainingDetails?.to_date || ''}
                name="to_date"
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md="4">
            <FormGroup>
              <Label>Trainer</Label>
              <Input
                type="text"
                onChange={handleInputs}
                value={trainingDetails?.trainer || ''}
                name="trainer"
              />
            </FormGroup>
          </Col>
          <Col md="4">
            <FormGroup>
              <Label>Description</Label>
              <Input
                type="text"
                onChange={handleInputs}
                value={trainingDetails?.description || ''}
                name="description"
              />
            </FormGroup>
          </Col>
        </Row>
      </Form>
    </ComponentCard>
  );
}
