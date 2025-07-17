import React, { useState } from 'react';
import { Row, Col, FormGroup, Label, Input,Button } from 'reactstrap';
import PropTypes from 'prop-types';

export default function CustomerLogin({ contentDetails, handleInputs }) {
  // State to manage the visibility of the password
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Row>
      <Col md="6">
        {/* User Name */}
        <FormGroup>
          <Label>User Name</Label>
          <Input
            type="text"
            onChange={handleInputs}
            value={contentDetails.email || ''} // Assuming 'email' is the field in contentDetails
            name="email"
          />
        </FormGroup>
      </Col>

      <Col md="6">
        {/* Password */}
        <FormGroup>
          <Label>Password</Label>
          <Input
            type={showPassword ? 'text' : 'password'} // Toggle type based on showPassword state
            onChange={handleInputs}
            value={contentDetails.pass_word || ''} // Assuming 'password' is the field in contentDetails
            name="pass_word"
          />
        </FormGroup>
      </Col>

      <Col md="6">
        {/* Show Password Checkbox */}
        <FormGroup check className="p-3"> {/* Added some padding for better alignment */}
          <Label check>
            <Input
              type="checkbox"
              onChange={() => setShowPassword(!showPassword)} // Toggle showPassword state
              checked={showPassword}
            />{' '}
            Show Password
          </Label>
        </FormGroup>
      </Col>

      <Col md="6">
        {/* IsActive Switch/Toggle */}
        <FormGroup switch className="p-3"> {/* Added some padding for better alignment */}
          <Label check for="is_active_toggle">
            IsActive
          </Label>
          <Input
            type="switch"
            id="is_active_toggle"
            onChange={handleInputs}
            checked={contentDetails.is_active === 1} // Assuming 1 for active, 0 for inactive
            name="is_active"
            role="switch"
          />
        </FormGroup>
      </Col>

          {/* --- Send Mail Button --- */}
          <Col md="12" className="mt-3"> {/* Use md="12" to make the button span the full width */}
          <Button color="primary" onClick={handleInputs}>
            Send Mail
          </Button>
        </Col>
      </Row>
  
  );
}

CustomerLogin.propTypes = {
  contentDetails: PropTypes.object,
  handleInputs: PropTypes.func, // Changed to func as it's a function
};