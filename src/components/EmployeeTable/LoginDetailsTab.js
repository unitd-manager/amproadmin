import React from 'react';
import { Row, Col, FormGroup, Label, Input } from 'reactstrap';
import PropTypes from 'prop-types';

function LoginDetailsTab({ employeeDetails, handleInputChange }) {
  // Define prop types
  LoginDetailsTab.propTypes = {
    employeeDetails: PropTypes.object.isRequired,
    handleInputChange: PropTypes.func.isRequired,
  };

  return (
    <div>
      <Row>
        <Col md="3">
          <FormGroup>
            <Label>Login Email</Label>
            <Input
              name="login_email"
              value={employeeDetails?.login_email ?? ''}
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
              value={employeeDetails?.login_pass_word ?? ''}
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
              value={employeeDetails?.staff_user_group_id ?? ''}
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
            <br />
            <Label for="published-yes">Yes</Label>
            <Input
              id="published-yes"
              name="published"
              value="1"
              type="radio"
              checked={employeeDetails?.published === 1}
              onChange={() => handleInputChange({ target: { name: 'published', value: 1 } })}
            />
            <Label for="published-no">No</Label>
            <Input
              id="published-no"
              name="published"
              value="0"
              type="radio"
              checked={employeeDetails?.published === 0}
              onChange={() => handleInputChange({ target: { name: 'published', value: 0 } })}
            />
          </FormGroup>
        </Col>
      </Row>
    </div>
  );
}

export default LoginDetailsTab;
