import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, FormGroup, Label, Input } from 'reactstrap';

export default function JobProbation({
  handleInputsJobInformation,
  job,
  handleRadioGst,
  // overTimeRate,
}) {
  JobProbation.propTypes = {
    handleInputsJobInformation: PropTypes.any,
    job: PropTypes.any,
    handleRadioGst: PropTypes.any,
    // overTimeRate: PropTypes.any,
  };


  return (
    <>
      <FormGroup>
        <Row>
          <Col md="4">
            <FormGroup>
              <Label>Salary Period</Label>
              <Input
                type="select"
                value={job && job.payment_type}
                name="payment_type"
                onChange={handleInputsJobInformation}
              >
                <option defaultValue="selected">Please Select</option>
                <option value="monthly">Monthly</option>
                <option value="fortnightly">Fort Nightly</option>
                <option value="weekly">Weekly</option>
                <option value="daily">Daily</option>
                <option value="hourly">Hourly</option>
              </Input>
            </FormGroup>
          </Col>
          <Col md="4">
            <FormGroup>
              <Label>Date(s) of Salary Payment</Label>
              <Input
                type="date"
                onChange={handleInputsJobInformation}
                value={job && job.salary_payment_dates}
                name="salary_payment_dates"
              />
            </FormGroup>
          </Col>
          <Col md="4">
            <FormGroup>
              <Label>Date(s) of Overtime Payment (if different)</Label>
              <Input
                type="date"
                onChange={handleInputsJobInformation}
                value={job && job.overtime_payment_dates}
                name="overtime_payment_dates"
              />
            </FormGroup>
          </Col>

          <Col md="4">
            <FormGroup>
              <Label>
                {' '}
                Working Calendar(No of Days/Week)(KET)<span className="required"> *</span>{' '}
              </Label>
              <Input
                type="select"
                value={job && job.working_days}
                name="working_days"
                onChange={handleInputsJobInformation}
              >
                <option defaultValue="selected">Please Select</option>
                <option value="5">5</option>
                <option value="5.5">5.5</option>
                <option value="6">6</option>
              </Input>
            </FormGroup>
          </Col>
          <Col md="4">
            <FormGroup>
              <Label>
                {' '}
                Basic Pay <span className="required"> *</span>{' '}
              </Label>
              <Input
                type="numbers"
                onChange={(e) => {
                  handleInputsJobInformation(e);
                  handleRadioGst(job.over_time_rate, e.target.value, job.overtime);
                }}
                value={job && job.basic_pay}
                name="basic_pay"
              />
            </FormGroup>
          </Col>
          <Col md="4">
            <FormGroup>
              <Label> Overtime Applicable</Label>
              <br></br>
              <Label> Yes </Label>
              &nbsp;
              <Input
                name="overtime"
                value="1"
                type="radio"
                defaultChecked={job && job.overtime === 1 && true}
                onChange={(e) => {
                  handleInputsJobInformation(e);
                  handleRadioGst(job.over_time_rate, e.target.value, job.basic_pay);
                }}
              />
              &nbsp;
              &nbsp;
              <Label> No </Label>
              &nbsp;
              <Input
                name="overtime"
                value="0"
                type="radio"
                defaultChecked={job && job.overtime === 0 && true}
                onChange={(e) => {
                  handleInputsJobInformation(e);
                  handleRadioGst(job.over_time_rate, e.target.value, job.basic_pay);
                }}
              />
            </FormGroup>
          </Col>
          {job && (job.overtime === '1' || job.overtime === 1) && (
            <Col md="4">
              <FormGroup>
                <Label>
                  {' '}
                  Over Time Rate<span className="required"> *</span>{' '}
                </Label>
                <Input
                  type="select"
                  value={job && job.over_time_rate}
                  name="over_time_rate"
                  onChange={(e) => {
                    handleInputsJobInformation(e);
                    handleRadioGst(job.overtime, e.target.value, job.basic_pay);
                  }}
                >
                  <option defaultValue="selected">Please Select</option>
                  <option value="1.5">1.5</option>
                  <option value="2.0">2.0</option>
                </Input>
              </FormGroup>
            </Col>
          )}
          <Col md="4">
            <FormGroup>
              <Label>Overtime Pay Rate/ Hour</Label>
            
              <Input
                type="numbers"
                onChange={handleInputsJobInformation}
                value={job && job.overtime_pay_rate}
                name="overtime_pay_rate"
              />
            </FormGroup>
          </Col>

          <Col md="4">
            <FormGroup>
              <Label>Transport</Label>
              <Input
                type="numbers"
                onChange={handleInputsJobInformation}
                value={job && job.allowance1}
                name="allowance1"
              />
            </FormGroup>
          </Col>
          <Col md="4">
            <FormGroup>
              <Label>Entertainment</Label>
              <Input
                type="numbers"
                onChange={handleInputsJobInformation}
                value={job && job.allowance2}
                name="allowance2"
              />
            </FormGroup>
          </Col>
          <Col md="4">
            <FormGroup>
              <Label>Food</Label>
              <Input
                type="numbers"
                onChange={handleInputsJobInformation}
                value={job && job.allowance3}
                name="allowance3"
              />
            </FormGroup>
          </Col>
          <Col md="4">
            <FormGroup>
              <Label>Shift Allowance</Label>
              <Input
                type="numbers"
                onChange={handleInputsJobInformation}
                value={job && job.allowance4}
                name="allowance4"
              />
            </FormGroup>
          </Col>
          <Col md="4">
            <FormGroup>
              <Label>Others</Label>
              <Input
                type="numbers"
                onChange={handleInputsJobInformation}
                value={job && job.allowance5}
                name="allowance5"
              />
            </FormGroup>
          </Col>

          <Col md="4">
            <FormGroup>
              <Label>Housing</Label>
              <Input
                type="numbers"
                onChange={handleInputsJobInformation}
                value={job && job.deduction1}
                name="deduction1"
              />
            </FormGroup>
          </Col>
          <Col md="4">
            <FormGroup>
              <Label>Transportation</Label>
              <Input
                type="numbers"
                onChange={handleInputsJobInformation}
                value={job && job.deduction2}
                name="deduction2"
              />
            </FormGroup>
          </Col>
          <Col md="4">
            <FormGroup>
              <Label>Others</Label>
              <Input
                type="numbers"
                onChange={handleInputsJobInformation}
                value={job && job.deduction3}
                name="deduction3"
              />
            </FormGroup>
          </Col>
          <Col md="4">
            <FormGroup>
              <Label>Food</Label>
              <Input
                type="numbers"
                onChange={handleInputsJobInformation}
                value={job && job.deduction4}
                name="deduction4"
              />
            </FormGroup>
          </Col>
          <Col md="4">
            <FormGroup>
              <Label>Levy</Label>
              <Input
                type="numbers"
                onChange={handleInputsJobInformation}
                value={job && job.levy_amount}
                name="levy_amount"
              />
            </FormGroup>
          </Col>
        </Row>
      </FormGroup>
    </>
  );
}
