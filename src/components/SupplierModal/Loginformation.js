import React, { useState } from 'react';
import { Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import PropTypes from 'prop-types';
import ComponentCard from '../ComponentCard';

export default function LogInfo({ logInfo = {}, handleInputs }) {
  const [showPassword, setShowPassword] = useState(false);

  // Define default values if not provided
  const defaultLogInfo = {
    company_name: 'BANHJKUL',   // <-- Default username
    password: 'password123',     // <-- Default password
    ...logInfo, // In case any value is passed from parent
  };

  LogInfo.propTypes = {
    logInfo: PropTypes.object,
    handleInputs: PropTypes.func,
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Form>
      <FormGroup>
        <ComponentCard title="Log Information">
          <Row className="align-items-center mb-3">
            <Col md="2">
              <Label>User Name</Label>
            </Col>
            <Col md="4">
              <Input
                type="text"
                name="company_name"
                value={defaultLogInfo.company_name}
                onChange={handleInputs}
              />
            </Col>
          </Row>

          <Row className="align-items-center">
            <Col md="2">
              <Label>Password</Label>
            </Col>
            <Col md="4">
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={defaultLogInfo.password}
                onChange={handleInputs}
              />
              <FormGroup check className="mt-2">
                <Label check>
                  <Input
                    type="checkbox"
                    onChange={toggleShowPassword}
                    checked={showPassword}
                  />{' '}
                  Show Password
                </Label>
              </FormGroup>
            </Col>
          </Row>
        </ComponentCard>
      </FormGroup>
    </Form>
  );
}
