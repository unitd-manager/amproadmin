import React from 'react';
import { Row, Col, FormGroup, Label, Input } from 'reactstrap';
import PropTypes from 'prop-types';

function LoginDetailsTab({ employeeDetails, handleInputChange }) {
  LoginDetailsTab.propTypes = {
    employeeDetails: PropTypes.object,
    handleInputChange: PropTypes.func,
  };
  return (
    <div>
      <Row>
        <Col md="3">
          <FormGroup>
            <Label>Login Email</Label>
            <Input
              name="login_email"
              value={employeeDetails && employeeDetails.login_email}
              onChange={handleInputChange}
              type="email"
            />
          </FormGroup>
        </Col>
        <Col md="3">
          <FormGroup>
            <Label>Password</Label>
            <Input
              name="login_pass_word"
              value={employeeDetails && employeeDetails.login_pass_word}
              onChange={handleInputChange}
              type="password"
            />
          </FormGroup>
        </Col>
        <Col md="3">
          <FormGroup>
            <Label>User Group</Label>
            <Input
              name="staff_user_group_id"
              value={employeeDetails && employeeDetails.staff_user_group_id}
              onChange={handleInputChange}
              type="select"
            >
              <option value="2">Tender</option>
              <option value="3">HR</option>
              <option value="4">Admin and Purchase</option>
              <option value="5">Tender and Project</option>
              <option value="6">Projects</option>
              <option value="7">Accounts</option>
              <option value="8">Super Admin</option>
              <option value="9">Testing Universal</option>
            </Input>
          </FormGroup>
        </Col>

        <Col md="3">
          <FormGroup>
            <Label>Published</Label>
            <br></br>
            <Label>Yes</Label>
            &nbsp;
            <Input
              name="staff_published"
              value="1"
              type="radio"
              defaultChecked={employeeDetails && employeeDetails.staff_published === 1 && true}
              onChange={handleInputChange}
            />
            &nbsp; &nbsp;
            <Label>No</Label>
            &nbsp;
            <Input
              name="staff_published"
              value="0"
              type="radio"
              defaultChecked={employeeDetails && employeeDetails.staff_published === 0 && true}
              onChange={handleInputChange}
            />
          </FormGroup>
        </Col>
      </Row>
    </div>
  );
}

export default LoginDetailsTab;
