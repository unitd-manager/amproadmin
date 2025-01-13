import React from 'react';
import { Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import moment from 'moment';
import PropTypes from 'prop-types';
import ComponentCard from '../ComponentCard';

function PayslipSummary({ payroll, handleInputs, workingDaysInMonth }) {
  PayslipSummary.propTypes = {
    payroll: PropTypes.object,
    handleInputs: PropTypes.func,
    workingDaysInMonth: PropTypes.any,
  };

  // const calculateDaysInRange = () => {
  //   const startDate = moment(payroll.payslip_start_date);
  //   const endDate = moment(payroll.payslip_end_date);
  //   const daysInRange = endDate.diff(startDate, 'days') + 1;
  //   console.log('1', daysInRange);

  //   // Calculate the number of weeks between the two dates
  //   const weeksInRange = Math.ceil(endDate.diff(startDate, 'days') / 7);
  //   console.log('2', weeksInRange);

  // // Calculate the number of weeks (rounded up)
  // const TotaldaysInRanges =Math.floor(daysInRange / 7);
  // // Calculate the remaining days
  // const remainingDays =daysInRange- (TotaldaysInRanges * 7);
  // //working days in full week
  // const workingdaysInRanges =(TotaldaysInRanges * weeksInRange)+remainingDays;

  // console.log("3",'Total days in range:', daysInRange);
  // console.log("4",'Total weeks in range:', TotaldaysInRanges);
  // console.log("5",'Total weeks in range:', remainingDays);
  // console.log("6",'Total weeks in range:', workingdaysInRanges);
  // return { daysInRange, weeksInRange,workingdaysInRanges,remainingDays };// Add 1 to include both start and end dates

  // };

  return (
    <div>
      <Form>
        <FormGroup>
          <ComponentCard title="Payslip Summary">
            <Row>
              <Col md="4">
                <FormGroup>
                  <Label>
                    Start Date{' '}
                    <span className="required" style={{ color: 'red' }}>
                      {' '}
                      *
                    </span>
                  </Label>
                  <Input
                    type="date"
                    value={payroll && payroll.payslip_start_date}
                    onChange={handleInputs}
                    name="payslip_start_date"
                    disabled
                  />
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label>End Date</Label>
                  <Input
                    type="Date"
                    value={payroll && moment(payroll.payslip_end_date).format('YYYY-MM-DD')}
                    onChange={handleInputs}
                    name="payslip_end_date"
                    disabled
                  />
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label>Working Days in Month</Label>
                  <Input
                    type="text"
                    value={workingDaysInMonth}
                    onChange={handleInputs}
                    name="working_days_in_month"
                    disabled
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="4">
                <FormGroup>
                  <Label>Actual worked days in month</Label>
                  <Input
                    type="text"
                    value={payroll && payroll.actual_working_days}
                    onChange={handleInputs}
                    name="actual_working_days"
                  />
                  {/* <div className="text-danger">{errorMessage}</div> */}
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label>Mode Of Payment</Label>
                  <Input
                    type="select"
                    value={payroll && payroll.mode_of_payment}
                    onChange={handleInputs}
                    name="mode_of_payment"
                  >
                    <option defaultValue="selected">Please Select</option>
                    <option value="cheque">cheque</option>
                    <option value="cash">cash</option>
                    <option value="giro">giro payment transfer</option>
                  </Input>
                </FormGroup>
              </Col>

              <Col md="4">
                <FormGroup>
                  <Label>Employee Name(DOB)</Label>
                  <Input
                    type="text"
                    value={
                      payroll && payroll.employee_name
                        ? payroll && payroll.employee_name
                        : payroll && payroll.employee_name
                    }
                    onChange={handleInputs}
                    name="employee_name"
                    disabled
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="4">
                <FormGroup>
                  <Label>Generated Date</Label>
                  <Input
                    type="Date"
                    value={moment(payroll && payroll.generated_date).format('YYYY-MM-DD')}
                    onChange={handleInputs}
                    name="generated_date"
                  />
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label>Basic Pay</Label>
                  <Input
                    type="text"
                    value={payroll && payroll.basic_pay}
                    onChange={handleInputs}
                    name="basic_pay"
                    disabled
                  />
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label>Status</Label>
                  <Input
                    type="select"
                    onChange={handleInputs}
                    value={payroll && payroll.status}
                    name="status"
                  >
                    <option defaultValue="selected">Please Select</option>
                    <option value="paid">Paid</option>
                    <option value="approved">Approved</option>
                    <option value="generated">Generated</option>
                    <option value="hold">Hold</option>
                    <option value="cancelled">Cancelled</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>
          </ComponentCard>
        </FormGroup>
      </Form>
    </div>
  );
}

export default PayslipSummary;
