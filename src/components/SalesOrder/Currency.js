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
    api.get('/currency/getCurrency').then((res) => {
      setCompany(res.data.data);
    });
  };

  useEffect(() => {
    getCompany();
  }, []);

  // Handle company selection change
  const handleCompanyChange = (e) => {
    const selectedCompanyId = e.target.value;
    handleInputs(e); // Update currency_id in settingdetails

    // Find selected company details
    const selectedCompany = company.find((comp) => String(comp.currency_id) === selectedCompanyId);

    if (selectedCompany) {
      // Update settingdetails with selected company data
      setSettingDetails((prevDetails) => ({
        ...prevDetails,
        currency_name: selectedCompany.currency_name || '',
        currency_rate: selectedCompany.currency_rate || '',
     
      }));
    }
  };

  return (
    <Form>
      <FormGroup>
        <ComponentCard title="Currency Details">
          <Row>
            <Col md="4">
              <FormGroup>
                <Label>
                  Currency code <span className="required"> *</span>
                </Label>
                <Input
                  type="select"
                  name="currency_id"
                  onChange={handleCompanyChange} // Updated function
                  value={settingdetails?.currency_id ? String(settingdetails.currency_id) : ''}
                >
                  <option value="">Please Select</option>
                  {company.map((ele) => (
                    <option key={ele.currency_id} value={String(ele.currency_id)}>
                      {ele.currency_code}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <Label>Currency Name</Label>
                <Input type="text" name="currency_name" onChange={handleInputs} value={settingdetails?.currency_name || ''} />
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <Label>Currency Rate</Label>
                <Input type="text" name="currency_rate" onChange={handleInputs} value={settingdetails?.currency_rate || ''} />
              </FormGroup>
            </Col>
          </Row>
         
        </ComponentCard>
      </FormGroup>
    </Form>
  );
}
