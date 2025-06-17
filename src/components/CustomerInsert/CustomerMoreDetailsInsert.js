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
                  {/* Left Column for Customer Details */}
                  <Col md="6">
                    <Row> {/* Inner Row for fields within this column */}
                      <Col md="6">
                        <FormGroup>
                          <Label>Contact Id</Label>
                          <Input type="text" onChange={handleInputs} value={contentDetails.contact_id || ''} name="contact_id" disabled />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label>Name</Label>
                          <Input type="text" onChange={handleInputs} value={contentDetails.first_name || ''} name="first_name" />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label>Mobile</Label>
                          <Input type="text" onChange={handleInputs} value={contentDetails.mobile || ''} name="mobile" />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label>Email</Label>
                          <Input type="text" onChange={handleInputs} value={contentDetails.email || ''} name="email" />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label>Password</Label>
                          <Input type="text" onChange={handleInputs} value={contentDetails.pass_word || ''} name="pass_word" />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label>Address1</Label>
                          <Input type="text" onChange={handleInputs} value={contentDetails.address1 || ''} name="address1" />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label>Address2</Label>
                          <Input type="text" onChange={handleInputs} value={contentDetails.address2 || ''} name="address2" />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label>Address3</Label>
                          <Input type="text" onChange={handleInputs} value={contentDetails.address3 || ''} name="address3" />
                        </FormGroup>
                      </Col>
                  <Col md="6">
                        <FormGroup>
                          <Label>Tax</Label>
                          <Input type="text" onChange={handleInputs} value={contentDetails.tax || ''} name="tax" />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label>Price Group</Label>
                          <Input type="text" onChange={handleInputs} value={contentDetails.price_group || ''} name="price_group" />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label>Remarks</Label>
                          <Input type="textarea" onChange={handleInputs} value={contentDetails.remarks || ''} name="remarks" />
                        </FormGroup>
                      </Col>
                      </Row>
                  </Col>


                  {/* Right Column for Customer Details */}
                  <Col md="6">
                    <Row> {/* Inner Row for fields within this column */}
                      <Col md="6">
                        <FormGroup>
                          <Label>Contact Type</Label>
                          <Input type="text" onChange={handleInputs} value={contentDetails.contact_type || ''} name="contact_type" />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label>Country/Postal</Label>
                          <Input type="text" onChange={handleInputs} value={contentDetails.country_postal || ''} name="country_postal" />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label>Area</Label>
                          <Input type="text" onChange={handleInputs} value={contentDetails.area || ''} name="area" />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label>Phone Number</Label>
                          <Input type="text" onChange={handleInputs} value={contentDetails.phone_number || ''} name="phone_number" />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label>Currency</Label>
                          <Input type="text" onChange={handleInputs} value={contentDetails.currency || ''} name="currency" />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label>Hand Phone Number</Label>
                          <Input type="text" onChange={handleInputs} value={contentDetails.hand_phone_no || ''} name="hand_phone_no" />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label>Terms</Label>
                          <Input type="text" onChange={handleInputs} value={contentDetails.terms || ''} name="terms" />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label>Fax No</Label>
                          <Input type="text" onChange={handleInputs} value={contentDetails.fax_no || ''} name="fax_no" />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label>Credit Limit</Label>
                          <Input type="text" onChange={handleInputs} value={contentDetails.credit_limit || ''} name="credit_limit" />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label>Website</Label>
                          <Input type="text" onChange={handleInputs} value={contentDetails.web_site || ''} name="web_site" />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label>Company RegNo</Label>
                          <Input type="text" onChange={handleInputs} value={contentDetails.company_reg_no || ''} name="company_reg_no" />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label>Cheque Print Name</Label>
                          <Input type="text" onChange={handleInputs} value={contentDetails.cheque_print_name || ''} name="cheque_print_name" />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup switch>
                          <Label check for="is_active_toggle">
                            IsActive
                          </Label>
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

                    </Row>
                  </Col>
                </Row>
    </div>
  );
}
