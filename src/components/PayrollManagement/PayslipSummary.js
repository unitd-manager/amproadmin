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

  return (
    <div>
      <Form>
        <FormGroup>
          <ComponentCard title="Payslip Summary">
            <Row>
              <Col md="4">
                <FormGroup>
                <Label dir="rtl" style={{ textAlign: 'right' }}>
                <span className="required" style={{ color: 'red' }}>
                      {' '}
                      *
                    </span>
                Start Date
                
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
                <Label dir="rtl" style={{ textAlign: 'right' }}>
                End Date
              </Label>
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
                <Label dir="rtl" style={{ textAlign: 'right' }}>
                Working Days in Month
              </Label>
                
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
                <Label dir="rtl" style={{ textAlign: 'right' }}>
                Actual worked days in month
              </Label>
                  
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
                <Label dir="rtl" style={{ textAlign: 'right' }}>
                Mode Of Payment
              </Label>
                  
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
                <Label dir="rtl" style={{ textAlign: 'right' }}>
                Employee Name(DOB)
              </Label>
                 
                  <Input
                    type="text"
                    value={
                      payroll && payroll.employee_name ||
                         payroll && payroll.first_name
                  
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
                <Label dir="rtl" style={{ textAlign: 'right' }}>
                Generated Date
              </Label>
                  
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
                <Label dir="rtl" style={{ textAlign: 'right' }}>
                Basic Pay
              </Label>
                 
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
                <Label dir="rtl" style={{ textAlign: 'right' }}>
                Status
              </Label>
                 
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
