import React from 'react';
import { Row, Col, FormGroup, Label, Input } from 'reactstrap';
import PropTypes from 'prop-types';
import moment from 'moment';
import ComponentCard from '../ComponentCard';

function EmployeePart({ employeeDetails, handleInputChange, allCountries, companies }) {
  EmployeePart.propTypes = {
    employeeDetails: PropTypes.object,
    handleInputChange: PropTypes.func,
    allCountries: PropTypes.array,
    companies: PropTypes.array,
  };

  return (
    <div>
      <FormGroup>
        <ComponentCard title="Personal Information">
          <Row>
            <Col md="3">
              <FormGroup>
                <Label>Code</Label>
                <Input
                  name="emp_code"
                  value={employeeDetails && employeeDetails.emp_code}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="EMP-1002"
                  disabled
                />
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <Label>
                  Full Name <span style={{ color: 'red' }}>*</span>
                </Label>
                <Input
                  name="employee_name"
                  value={employeeDetails && employeeDetails.employee_name}
                  onChange={handleInputChange}
                  type="text"
                />
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <Label>Salutation</Label>
                <Input
                  name="salutation"
                  value={employeeDetails && employeeDetails.salutation}
                  onChange={handleInputChange}
                  type="select"
                >
                  <option defaultValue="selected">Please Select</option>
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Ms">Ms</option>
                </Input>
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <Label>
                  Gender <span style={{ color: 'red' }}>*</span>
                </Label>
                <Input
                  name="gender"
                  value={employeeDetails && employeeDetails.gender}
                  onChange={handleInputChange}
                  type="select"
                >
                  <option defaultValue="selected">Please Select</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </Input>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md="3">
              <FormGroup>
                <Label>Status</Label>
                <Input
                  name="status"
                  value={employeeDetails && employeeDetails.status}
                  onChange={handleInputChange}
                  type="select"
                >
                  <option defaultValue="selected" value="Current">
                    Current
                  </option>
                  <option value="Archive">Archive</option>
                  <option value="Cancel">Cancel</option>
                </Input>
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <Label>
                  Date of Birth <span style={{ color: 'red' }}>*</span>
                </Label>
                <Input
                  type="date"
                  onChange={handleInputChange}
                  name="date_of_birth"
                  value={
                    employeeDetails && moment(employeeDetails.date_of_birth).format('YYYY-MM-DD')
                  }
                  max={moment().format('YYYY-MM-DD')}
                />
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <Label>Passport No</Label>
                <Input
                  name="passport"
                  value={employeeDetails && employeeDetails.passport}
                  onChange={handleInputChange}
                  type="text"
                />
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <Label>Passport Expiry</Label>
                <Input
                  type="date"
                  onChange={handleInputChange}
                  name="date_of_expiry"
                  value={
                    employeeDetails && moment(employeeDetails.date_of_expiry).format('YYYY-MM-DD')
                  }
                  min={moment().format('YYYY-MM-DD')}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md="3">
              <FormGroup>
                <Label>Marital Status</Label>
                <Input
                  name="marital_status"
                  value={employeeDetails && employeeDetails.marital_status}
                  onChange={handleInputChange}
                  type="select"
                >
                  <option>Please Select</option>
                  <option defaultValue="selected" value="Married">
                    Married
                  </option>
                  <option value="Single">Single</option>
                </Input>
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <Label>
                  Nationality <span style={{ color: 'red' }}>*</span>
                </Label>
                <Input
                  name="nationality"
                  value={employeeDetails && employeeDetails.nationality}
                  onChange={handleInputChange}
                  type="select"
                >
                  <option>Please Select</option>
                  {allCountries &&
                    allCountries.map((ele) => {
                      return (
                        <option key={ele.country_code} value={ele.country_code}>
                          {ele.name}
                        </option>
                      );
                    })}
                </Input>
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <Label>Race</Label>
                <Input
                  name="race"
                  value={employeeDetails && employeeDetails.race}
                  onChange={handleInputChange}
                  type="select"
                >
                  <option defaultValue="selected">Please Select</option>
                  <option value="Singaporean">Singaporean</option>
                  <option value="Malaysian">Malaysian</option>
                  <option value="Bengali">Bengali</option>
                  <option value="Indian">Indian</option>
                </Input>
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <Label>Religion</Label>
                <Input
                  name="religion"
                  value={employeeDetails && employeeDetails.religion}
                  onChange={handleInputChange}
                  type="select"
                >
                  <option defaultValue="selected">Please Select</option>
                  <option value="BUDDHIST">BUDDHIST</option>
                  <option value="CHRISTIAN">CHRISTIAN</option>
                  <option value="HINDU">HINDU</option>
                  <option value="MUSLIM">MUSLIM</option>
                </Input>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md="3">
              <FormGroup>
                <Label>Project Designation</Label>
                <Input
                  name="project_designation"
                  value={employeeDetails && employeeDetails.project_designation}
                  onChange={handleInputChange}
                  type="select"
                >
                  <option>Please Select</option>
                  <option defaultValue="selected" value="Employee">
                    Employee
                  </option>
                  <option value="Manager">Manager</option>
                  <option value="Supervisor">Supervisor</option>
                </Input>
              </FormGroup>
            </Col>
            {/* <Col md="3">
              <FormGroup>
                <Label>Team</Label>
                <Input
                  name="team"
                  value={employeeDetails && employeeDetails.team}
                  onChange={handleInputChange}
                  type="select"
                >
                  <option defaultValue="selected">Please Select</option>
                  <option value="Team A">Team A</option>
                  <option value="Team B">Team B</option>
                  <option value="Team C">Team C</option>
                  <option value="Team D">Team D</option>
                </Input>
              </FormGroup>
            </Col> */}
            <Col md="3">
              <FormGroup>
                <Label>Company</Label>
                <Input
                  name="company_id"
                  value={employeeDetails && employeeDetails.company_id}
                  onChange={handleInputChange}
                  type="select"
                >
                  <option value="">Please Select</option>
                  {companies &&
                    companies.map((ele) => {
                      return (
                        <option key={ele.company_id} value={ele.company_id}>
                          {ele.company_name}
                        </option>
                      );
                    })}
                </Input>
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <Label>Project manager</Label>
                <br></br>
                <Label>Yes</Label>
                &nbsp;
                <Input
                  name="project_manager"
                  value="1"
                  type="radio"
                  defaultChecked={employeeDetails && employeeDetails.project_manager === 1 && true}
                  onChange={handleInputChange}
                />
                &nbsp; &nbsp;
                <Label>No</Label>
                &nbsp;
                <Input
                  name="project_manager"
                  value="0"
                  type="radio"
                  defaultChecked={employeeDetails && employeeDetails.project_manager === 0 && true}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
          </Row>
        </ComponentCard>
      </FormGroup>
    </div>
  );
}

export default EmployeePart;
