import React from 'react';
import { Row, Col, FormGroup, Label, Input } from 'reactstrap';
import PropTypes from 'prop-types';

export default function ContentMoreDetailsInsert({
  contentDetails,
  handleInputs,
}) {
  ContentMoreDetailsInsert.propTypes = {
    contentDetails: PropTypes.object,
    handleInputs: PropTypes.any,
  };

  return (
    <div>
      <Row>
        {/* Left Column */}
        <Col md="6">
          <FormGroup>
            <Label>Address1</Label>
            <Input type="text" onChange={handleInputs} value={contentDetails.address1 || ''} name="address1" />
          </FormGroup>
          <FormGroup>
            <Label>Tax</Label>
            <Input type="text" onChange={handleInputs} value={contentDetails.tax || ''} name="tax" />
          </FormGroup>
          <FormGroup>
            <Label>Address2</Label>
            <Input type="text" onChange={handleInputs} value={contentDetails.address2 || ''} name="address2" />
          </FormGroup>
          <FormGroup>
            <Label>Price Group</Label>
            <Input type="text" onChange={handleInputs} value={contentDetails.price_group || ''} name="price_group" />
          </FormGroup>
          <FormGroup>
            <Label>Address3</Label>
            <Input type="text" onChange={handleInputs} value={contentDetails.address3 || ''} name="address3" />
          </FormGroup>
          <FormGroup>
            <Label>Contact Type</Label>
            <Input type="text" onChange={handleInputs} value={contentDetails.contact_type || ''} name="contact_type" />
          </FormGroup>
          <FormGroup>
            <Label>Country/Postal</Label>
            <Input type="text" onChange={handleInputs} value={contentDetails.country_postal || ''} name="country_postal" />
          </FormGroup>
          <FormGroup>
            <Label>Area</Label>
            <Input type="text" onChange={handleInputs} value={contentDetails.area || ''} name="area" />
          </FormGroup>
          <FormGroup>
            <Label>Phone Number</Label>
            <Input type="text" onChange={handleInputs} value={contentDetails.phone_number || ''} name="phone_number" />
          </FormGroup>
        </Col>

        {/* Right Column */}
        <Col md="6">
          <FormGroup>
            <Label>Currency</Label>
            <Input type="text" onChange={handleInputs} value={contentDetails.currency || ''} name="currency" />
          </FormGroup>
          <FormGroup>
            <Label>Hand Phone Number</Label>
            <Input type="text" onChange={handleInputs} value={contentDetails.hand_phone_no || ''} name="hand_phone_no" />
          </FormGroup>
          <FormGroup>
            <Label>Terms</Label>
            <Input type="text" onChange={handleInputs} value={contentDetails.terms || ''} name="terms" />
          </FormGroup>
          <FormGroup>
            <Label>Fax No</Label>
            <Input type="text" onChange={handleInputs} value={contentDetails.fax_no || ''} name="fax_no" />
          </FormGroup>
          <FormGroup>
            <Label>Credit Limit</Label>
            <Input type="text" onChange={handleInputs} value={contentDetails.credit_limit || ''} name="credit_limit" />
          </FormGroup>
          <FormGroup>
            <Label>Email</Label>
            <Input type="text" onChange={handleInputs} value={contentDetails.email || ''} name="email" />
          </FormGroup>
          <FormGroup>
            <Label>Website</Label>
            <Input type="text" onChange={handleInputs} value={contentDetails.web_site || ''} name="web_site" />
          </FormGroup>
          <FormGroup>
            <Label>Remarks</Label>
            <Input type="textarea" onChange={handleInputs} value={contentDetails.remarks || ''} name="remarks" />
          </FormGroup>
          <FormGroup>
            <Label>Company Reg No</Label>
            <Input type="text" onChange={handleInputs} value={contentDetails.company_reg_no || ''} name="company_reg_no" />
          </FormGroup>
          <FormGroup>
            <Label>Cheque Print Name</Label>
            <Input type="text" onChange={handleInputs} value={contentDetails.cheque_print_name || ''} name="cheque_print_name" />
          </FormGroup>
          <FormGroup switch>
            <Label check for="is_active_toggle">
              IsActive
            </Label>
            <Input
              type="switch"
              id="is_active_toggle"
              onChange={e => handleInputs({
                ...e,
                target: {
                  ...e.target,
                  name: 'is_active',
                  value: e.target.checked ? 1 : 0,
                  checked: e.target.checked
                }
              })}
              checked={contentDetails.is_active === 1}
              name="is_active"
              role="switch"
            />
          </FormGroup>
        </Col>
      </Row>
    </div>
  );
}
