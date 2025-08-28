import React, { useState, useEffect } from 'react';
import { Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import PropTypes from 'prop-types';
import ComponentCard from '../ComponentCard';
import api from '../../constants/api';

export default function SupplierDetails({ handleInputs, settingdetails, setSettingDetails }) {
  SupplierDetails.propTypes = {
    handleInputs: PropTypes.func,
    settingdetails: PropTypes.any,
    setSettingDetails: PropTypes.func, // Added prop to update settingdetails state
  };

  const [company, setCompany] = useState([]);

  // Fetch company data
  const getCompany = () => {
    api.get('/company/getCompany').then((res) => {
      setCompany(res.data.data);
    });
  };

  useEffect(() => {
    getCompany();
  }, []);

  // Handle company selection change
  const handleCompanyChange = (e) => {
    const selectedCompanyId = e.target.value;
    handleInputs(e); // Update company_id in settingdetails

    // Find selected company details
    const selectedCompany = company.find((comp) => String(comp.company_id) === selectedCompanyId);

    if (selectedCompany) {
      // Update settingdetails with selected company data
      setSettingDetails((prevDetails) => ({
        ...prevDetails,
        contact_person: selectedCompany.contact_person || '',
        customer_code: selectedCompany.customer_code || '',
        address_town: selectedCompany.address_town || '',
        address_street: selectedCompany.address_street || '',
        address_state: selectedCompany.address_state || '',
        address_country: selectedCompany.address_country || '',
        address_po_code: selectedCompany.address_po_code || '',
        notes: selectedCompany.notes || '',
      }));
    }
  };

  return (
    <Form>
      <FormGroup>
        <ComponentCard title="Customer Details">
          <Row>
            <Col md="4">
              <FormGroup>
                <Label>
                  Customer name <span className="required"> *</span>
                </Label>
                <Input
                  type="select"
                  name="company_id"
                  onChange={handleCompanyChange} // Updated function
                  value={settingdetails?.company_id ? String(settingdetails.company_id) : ''}
                >
                  <option value="">Please Select</option>
                  {company.map((ele) => (
                    <option key={ele.company_id} value={String(ele.company_id)}>
                      {ele.company_name}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <Label>Customer Code</Label>
                <Input type="text" name="customer_code" onChange={handleInputs} value={settingdetails?.customer_code || ''} />
              </FormGroup>
            </Col>
              <Col md="4">
              <FormGroup>
                <Label>Contact Address 1</Label>
                <Input type="text" name="address_street" onChange={handleInputs} value={settingdetails?.address_street || ''} />
              </FormGroup>
            </Col>
          
          </Row>
          {/* <Row>
            <Col md="4">
              <FormGroup>
                <Label>Contact Person</Label>
                <Input type="text" name="contact_person" onChange={handleInputs} value={settingdetails?.contact_person || ''} />
              </FormGroup>
            </Col> 
            <Col md="4">
              <FormGroup>
                <Label>Contact Address 2</Label>
                <Input type="text" name="address_town" onChange={handleInputs} value={settingdetails?.address_town || ''} />
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <Label>Contact Address 3</Label>
                <Input type="text" name="address_state" onChange={handleInputs} value={settingdetails?.address_state || ''} />
              </FormGroup>
            </Col>
          </Row> */}
          <Row>
            <Col md="4">
              <FormGroup>
                <Label>Country</Label>
                <Input type="text" name="address_country" onChange={handleInputs} value={settingdetails?.address_country || ''} />
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <Label>Country Po Code</Label>
                <Input type="text" name="address_po_code" onChange={handleInputs} value={settingdetails?.address_po_code || ''} />
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <Label>Remarks</Label>
                <Input type="text" name="notes" onChange={handleInputs} value={settingdetails?.notes || ''} />
              </FormGroup>
            </Col>
          </Row>
        </ComponentCard>
      </FormGroup>
    </Form>
  );
}
