import React, { useState } from 'react';
import { Row, Col, FormGroup, Label, Input } from 'reactstrap';
import PropTypes from 'prop-types';

export default function SupplierLogin({ contentDetails, handleInputs }) {
  // State to manage the visibility of the password
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="container">
      <Row className="mb-3">
        <Col sm="3" className="d-flex align-items-center">
          <Label className="mb-0">User Name</Label>
        </Col>
        <Col sm="9">
          <Input
            type="text"
            onChange={handleInputs}
            value={contentDetails.email || ''}
            name="email"
            className="form-control"
          />
        </Col>
      </Row>

      <Row className="mb-3">
        <Col sm="3" className="d-flex align-items-center">
          <Label className="mb-0">Password</Label>
        </Col>
        <Col sm="9">
          <Input
            type={showPassword ? 'text' : 'password'}
            onChange={handleInputs}
            value={contentDetails.pass_word || ''}
            name="pass_word"
            className="form-control"
          />
        </Col>
      </Row>

      <Row className="mb-3">
        <Col sm="3"></Col>
        <Col sm="9">
          <FormGroup check>
            <Input
              type="checkbox"
              id="showPassword"
              onChange={() => setShowPassword(!showPassword)}
              checked={showPassword}
              className="form-check-input me-2"
            />
            <Label check for="showPassword" className="form-check-label">
              Show Password
            </Label>
          </FormGroup>
        </Col>
      </Row>
{/* 
      <Row className="mb-3">
        <Col sm="3" className="d-flex align-items-center">
          <Label className="mb-0">Is Active</Label>
        </Col>
        <Col sm="9" className="d-flex align-items-center">
          <FormGroup switch>
            <Input
              type="switch"
              id="is_active_toggle"
              onChange={handleInputs}
              checked={contentDetails.is_active === 1}
              name="is_active"
              role="switch"
            />
          </FormGroup>
        </Col>
      </Row> */}

      {/* <Row>
        <Col sm="3"></Col>
        <Col sm="9">
          <Button color="primary" onClick={handleInputs}>
            Send Mail
          </Button>
        </Col>
      </Row> */}
    </div>
  );
}

SupplierLogin.propTypes = {
  contentDetails: PropTypes.object,
  handleInputs: PropTypes.func, // Changed to func as it's a function
};