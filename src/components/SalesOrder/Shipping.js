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
     
        billing_address_town: selectedCompany.billing_address_town || '',
        billing_address_street: selectedCompany.billing_address_street || '',
        billing_address_state: selectedCompany.billing_address_state || '',
        billing_address_country: selectedCompany.billing_address_country || '',
        billing_address_po_code: selectedCompany.billing_address_po_code || '',
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
                  Delivery name <span className="required"> *</span>
                </Label>
                <Input
                  type="select"
                  name="delivery_id"
                  onChange={handleCompanyChange} // Updated function
                  value={settingdetails?.delivery_id ? String(settingdetails.delivery_id) : ''}
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
                <Label>Delivery Address 1</Label>
                <Input type="text" name="address_street" onChange={handleInputs} value={settingdetails?.billing_address_street || ''} />
              </FormGroup>
            </Col>
            {/* <Col md="4">
              <FormGroup>
                <Label>Delivery Address 2</Label>
                <Input type="text" name="address_town" onChange={handleInputs} value={settingdetails?.billing_address_town || ''} />
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <Label>Delivery Address 3</Label>
                <Input type="text" name="address_state" onChange={handleInputs} value={settingdetails?.billing_address_state || ''} />
              </FormGroup>
            </Col> */}
          </Row>
          <Row>
            <Col md="4">
              <FormGroup>
                <Label>Delivery Country</Label>
                <Input type="text" name="address_country" onChange={handleInputs} value={settingdetails?.billing_address_country || ''} />
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <Label>Delivery Po Code</Label>
                <Input type="text" name="address_po_code" onChange={handleInputs} value={settingdetails?.billing_address_po_code || ''} />
              </FormGroup>
            </Col>
            
          </Row>
        </ComponentCard>
      </FormGroup>
    </Form>
  );
}
