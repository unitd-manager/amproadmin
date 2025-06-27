import React from 'react';
import { Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import PropTypes from 'prop-types';
import ComponentCard from '../ComponentCard';

export default function SupplierDetails({  handleInputs ,supplier ,allCountries , taxfromvaluelist,
  pricegroupfromvaluelist,contacttypefromvaluelist, areafromvaluelist, currencyfromvaluelist, termsfromvaluelist
}) {
  SupplierDetails.propTypes = {
    handleInputs: PropTypes.func,
    supplier: PropTypes.object,
    allCountries: PropTypes.object,
    taxfromvaluelist: PropTypes.object,
    pricegroupfromvaluelist: PropTypes.object,
    contacttypefromvaluelist: PropTypes.object,
    areafromvaluelist: PropTypes.object,
    currencyfromvaluelist: PropTypes.object,
    termsfromvaluelist: PropTypes.object,
  };

  return (
    <Form>
    <FormGroup>
  <ComponentCard title="Supplier Details" creationModificationDate={supplier}>
    <Row>
    <Col md="3">
        <FormGroup>
          <Label>
            Supplier Code <span className="required"> *</span>
          </Label>
          <Input
            type="text"
            onChange={handleInputs}
            value={supplier && supplier.supplier_code}
            name="supplier_code"
            disabled/>
        </FormGroup>
      </Col>
      <Col md="3">
        <FormGroup>
          <Label>
           Supplier Name <span className="required"> *</span>
          </Label>
          <Input
            type="text"
            onChange={handleInputs}
            value={supplier && supplier.company_name}
            name="company_name"/>
        </FormGroup>
      </Col>
      <Col md="3">
        <FormGroup>
          <Label>Phone Number</Label>
          <Input
            type="text"
            onChange={handleInputs}
            value={supplier && supplier.phone}
            name="phone" />
        </FormGroup>
      </Col>
      <Col md="3">
        <FormGroup>
          <Label>Hand Phone Number</Label>
          <Input
            type="text"
            onChange={handleInputs}
            value={supplier && supplier.hand_phone_no}
            name="hand_phone_no" />
        </FormGroup>
      </Col>
      </Row>
      <Row>
      <Col md="3">
        <FormGroup>
          <Label>Email</Label>
          <Input
            type="text"
            onChange={handleInputs}
            value={supplier && supplier.email}
            name="email" />
        </FormGroup>
      </Col>
      <Col md="3">
        <FormGroup>
          <Label>Fax No</Label>
          <Input
            type="text"
            onChange={handleInputs}
            value={supplier && supplier.fax}
            name="fax"  />
        </FormGroup>
      </Col>
      <Col md="3">
        <FormGroup>
          <Label>WebSite</Label>
          <Input
            type="text"
            onChange={handleInputs}
            value={supplier && supplier.website}
            name="website"  />
        </FormGroup>
      </Col>
      <Col md="3">
        <FormGroup>
          <Label>Company RegNo </Label>
          <Input
            type="text"
            onChange={handleInputs}
            value={supplier && supplier.company_reg_no}
            name="company_reg_no"  />
        </FormGroup>
      </Col>
      {/* <Col md="4">
      <FormGroup>
        <Label>Status</Label>
        <Input
          type="select"
          name="status"
          onChange={handleInputs}
          value={supplier && supplier.status}
        >
          <option defaultValue="selected">
            Please Select
          </option>
          <option value="current">Current</option>
            <option value="old">Old</option>
          {supplierStatus &&
            supplierStatus.map((ele) => {
              return <option value={ele.value}>{ele.value}</option>;
            })}
        </Input>
      </FormGroup>
    </Col> */}
    </Row>
    <Row>
      <Col md="3">
        <FormGroup>
          <Label>Tax</Label>
           <Input
            type="select"
            name="tax"
            onChange={handleInputs}
            value={supplier && supplier.tax}
            >
            <option defaultValue="selected">
                Please Select
            </option>
                {taxfromvaluelist && taxfromvaluelist.map((ele) => {
                    return <option key={ele.value} value={ele.value}>{ele.value}</option>;
                })}
            </Input>
        </FormGroup>
      </Col>
      <Col md="3">
        <FormGroup>
          <Label>Price group</Label>
          <Input
            type="select"
            name="price_group"
            onChange={handleInputs}
            value={supplier && supplier.price_group}
            >
            <option defaultValue="selected">
                Please Select
            </option>
                {pricegroupfromvaluelist && pricegroupfromvaluelist.map((ele) => {
                    return <option key={ele.value} value={ele.value}>{ele.value}</option>;
                })}
            </Input>
        </FormGroup>
      </Col>
      <Col md="3">
        <FormGroup>
          <Label>Contact Type</Label>
          <Input
            type="select"
            name="contact_type"
            onChange={handleInputs}
            value={supplier && supplier.contact_type}
            >
            <option defaultValue="selected">
                Please Select
            </option>
                {contacttypefromvaluelist && contacttypefromvaluelist.map((ele) => {
                    return <option key={ele.value} value={ele.value}>{ele.value}</option>;
                })}
            </Input>
        </FormGroup>
      </Col>
      <Col md="3">
        <FormGroup>
          <Label>Area</Label>
          <Input
            type="select"
            name="area"
            onChange={handleInputs}
            value={supplier && supplier.area}
            >
            <option defaultValue="selected">
                Please Select
            </option>
                {areafromvaluelist && areafromvaluelist.map((ele) => {
                    return <option key={ele.value} value={ele.value}>{ele.value}</option>;
                })}
            </Input>
        </FormGroup>
      </Col>
      </Row>
      <Row>
      <Col md="3">
        <FormGroup>
          <Label>Currency</Label>
          <Input
            type="select"
            name="currency"
            onChange={handleInputs}
            value={supplier && supplier.currency}
            >
            <option defaultValue="selected">
                Please Select
            </option>
                {currencyfromvaluelist && currencyfromvaluelist.map((ele) => {
                    return <option key={ele.value} value={ele.value}>{ele.value}</option>;
                })}
            </Input>
        </FormGroup>
      </Col>
      <Col md="3">
        <FormGroup>
          <Label>Terms</Label>
          <Input
            type="select"
            name="terms"
            onChange={handleInputs}
            value={supplier && supplier.terms}
            >
            <option defaultValue="selected">
                Please Select
            </option>
                {termsfromvaluelist && termsfromvaluelist.map((ele) => {
                    return <option key={ele.value} value={ele.value}>{ele.value}</option>;
                })}
            </Input>
        </FormGroup>
      </Col>
      <Col md="3">
        <FormGroup>
          <Label>Credit Limit</Label>
          <Input
            type="text"
            onChange={handleInputs}
            value={supplier && supplier.credit_limit}
            name="credit_limit" />
        </FormGroup>
      </Col>
      <Col md="3">
        <FormGroup>
          <Label>Remarks</Label>
          <Input
            type="text"
            onChange={handleInputs}
            value={supplier && supplier.remarks}
            name="remarks" />
        </FormGroup>
      </Col>
      <Col md="3">
        <FormGroup>
          <Label>Cheque Print Name</Label>
          <Input
            type="text"
            onChange={handleInputs}
            value={supplier && supplier.cheque_print_name}
            name="cheque_print_name" />
        </FormGroup>
      </Col>
      <Col md="3">
                <Label>Is Active</Label>
                <FormGroup>
                  <Label>Yes</Label>
                  &nbsp;
                  <Input
                    name="is_active"
                    value="1"
                    type="radio"
                    defaultChecked={supplier && supplier.is_active === 1 && true}
                    onChange={handleInputs}
                  />
                  &nbsp; &nbsp;
                  <Label>No</Label>
                  &nbsp;
                  <Input
                    name="is_active"
                    value="0"
                    type="radio"
                    defaultChecked={supplier && supplier.is_active === 0 && true}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>
    </Row>
  </ComponentCard>
</FormGroup>
<FormGroup>
  <ComponentCard title="Address">
    <Row>
      <Col md="3">
        <FormGroup>
          <Label>
            Address 1 
          </Label>
          <Input
            type="text"
            onChange={handleInputs}
            value={supplier && supplier.address_flat}
            name="address_flat"  />
        </FormGroup>
      </Col>
      <Col md="3">
        <FormGroup>
          <Label>Address 2</Label>
          <Input
            type="text"
            onChange={handleInputs}
            value={supplier && supplier.address_street}
            name="address_street"  />
        </FormGroup>
      </Col>
      <Col md="3">
        <FormGroup>
          <Label>Address 3</Label>
          <Input
            type="text"
            onChange={handleInputs}
            value={supplier && supplier.address_state}
            name="address_state"  />
        </FormGroup>
      </Col>
      <Col md="3">
        <FormGroup>
        <Label>Country</Label>
          <Input
            type="select"
            name="address_country"
            onChange={handleInputs}
            value={supplier && supplier.address_country}>
            <option defaultValue="selected">
              Please Select
            </option>
            {allCountries && allCountries.map(country=>(<option value={country.country_code}>{country.name}</option>))}
  </Input>
        </FormGroup>
      </Col>
      </Row>
      <Row>
        <Col md="3">
        <FormGroup>
          <Label>Portal</Label>
          <Input
            type="text"
            onChange={handleInputs}
            value={supplier && supplier.address_po_code}
            name="address_po_code" />
        </FormGroup>
      </Col>
    </Row>
   {/* {status &&(status.payment_status === 'Due' ||status.payment_status === 'Partially Paid' ||status.payment_status === 'Paid') &&(
   <Row>
      <div className="pt-3 mt-3 d-flex align-items-center gap-2">
        <Button className='shadow-none'
          onClick={() => {
            setEditPurchaseOrderLinked(true);
          }}
          color="primary" >
          Make Supplier Payment
        </Button>
      </div>
    </Row>
)} */}
  </ComponentCard>
</FormGroup>
</Form>

  );
}
