import React from 'react';
import { Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import PropTypes from 'prop-types';
import moment from 'moment';
import ComponentCard from '../ComponentCard';

export default function LoanDetailComp({ loanDetails, loanStatus, handleInputs }) {
  LoanDetailComp.propTypes = {
    loanDetails: PropTypes.object,
    handleInputs: PropTypes.func,
    loanStatus: PropTypes.string,
  };

  return (
    <Form>
      <FormGroup>
        <ComponentCard title="Loan Details" creationModificationDate={loanDetails} >
          <Row>
            <Col md="3">
              <FormGroup>
                <Label>Employee Name</Label>
                <br />
                <span> {loanDetails && loanDetails.employee_name} </span>
              </FormGroup>
            </Col>
            {(loanStatus === 'Approved' ||
              loanStatus === 'Hold' ||
              loanStatus === 'Denied' ||
              loanStatus === 'Waiting for Approval' ||
              loanStatus === 'Applied') && (
              <Col md="3">
                <FormGroup>
                  <Label>Status</Label>
                  <Input
                    value={loanDetails && loanDetails.status}
                    type="select"
                    onChange={handleInputs}
                    name="status"
                  >
                    <option>Please Select</option>
                    <option value="Approved">Approved</option>
                    <option value="Active">Active</option>
                    <option value="Hold">Hold</option>
                    <option value="Closed">Closed</option>
                    <option value="Denied">Denied</option>
                    <option value="Waiting for Approval">Waiting for Approval</option>
                    <option defaultValue="selected" value="Applied">
                      Applied
                    </option>
                  </Input>
                </FormGroup>
              </Col>
            )}
            {(loanStatus === 'Active' || loanStatus === 'Closed') && (
              <Col md="3">
                <FormGroup>
                  <Label>Status</Label>
                  <Input
                    type="select"
                    defaultValue={loanDetails && loanDetails.status}
                    disabled
                    name="status"
                  >
                    <option>Please Select</option>
                    <option value="Approved">Approved</option>
                    <option value="Active">Active</option>
                    <option value="Hold">Hold</option>
                    <option value="Closed">Closed</option>
                    <option value="Denied">Denied</option>
                    <option value="Waiting for Approval">Waiting for Approval</option>
                    <option defaultValue="selected" value="Applied">
                      Applied
                    </option>
                  </Input>
                </FormGroup>
              </Col>
            )}

            <Col md="3">
              <FormGroup>
                <Label>
                  {' '}
                  Type of Loan <span className="required"> *</span>
                </Label>
                <Input
                  value={loanDetails && loanDetails.type}
                  type="select"
                  onChange={handleInputs}
                  name="type"
                >
                  <option>Please Select</option>
                  <option value="Car Loan">Car Loan</option>
                  <option value="Personal Loan">Personal Loan</option>
                  <option value="Home Loan">Home Loan</option>
                  <option value="other">Other</option>
                </Input>
              </FormGroup>
            </Col>

            <Col md="3">
              <FormGroup>
                <Label>Loan Application Date</Label>
                <Input
                  value={loanDetails && moment(loanDetails.date).format('YYYY-MM-DD')}
                  type="date"
                  onChange={handleInputs}
                  name="date"
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            {loanStatus !== 'Active' && loanStatus !== 'Closed' && (
              <Col md="3">
                <FormGroup>
                  <Label>
                    Total Loan Amount<span className="required"> *</span>
                  </Label>
                  <Input
                    value={loanDetails && loanDetails.amount}
                    type="number"
                    onChange={handleInputs}
                    name="amount"
                  />
                </FormGroup>
              </Col>
            )}
            {(loanStatus === 'Active' || loanStatus === 'Closed') && (
              <Col md="3">
                <FormGroup>
                  <Label>
                    Total Loan Amount<span className="required"> *</span>
                  </Label>
                  <br />
                  <span>{loanDetails && loanDetails.amount}</span>
                </FormGroup>
              </Col>
            )}
            <Col md="3">
              <FormGroup>
                <Label>
                  Amount payable(permonth)<span className="required"> *</span>
                </Label>
                <Input
                  type="text"
                  defaultValue={loanDetails && loanDetails.month_amount}
                  onChange={handleInputs}
                  name="month_amount"
                />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label>Loan Start Date</Label>
                <br />
                {(loanStatus === 'Active' || loanDetails.loan_start_date) && (
                  <span>
                    {loanDetails.loan_start_date
                      ? moment(loanDetails.loan_start_date).format('DD-MM-YYYY')
                      : ''}
                  </span>
                )}
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <Label>Actual Loan Closing Date</Label>
                <br />
                {loanDetails && loanDetails.loan_closing_date && (
                  <span>
                    {loanDetails.loan_closing_date
                      ? moment(loanDetails.loan_closing_date).format('DD-MM-YYYY')
                      : ''}
                  </span>
                )}
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <Label>Amount Payable</Label>
                <br />

                <span>{loanDetails && loanDetails.amount_payable}</span>
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <Label>Notes</Label>
                <Input
                  defaultValue={loanDetails && loanDetails.notes}
                  type="textarea"
                  onChange={handleInputs}
                  name="notes"
                />
              </FormGroup>
            </Col>
          </Row>
        </ComponentCard>
      </FormGroup>
    </Form>
  );
}
