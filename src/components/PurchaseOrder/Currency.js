import React, { useState, useEffect } from 'react';
import { Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import PropTypes from 'prop-types';

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
      // Update settingdetails with selected company data (including currency_code for validation/save)
      setSettingDetails((prevDetails) => ({
        ...prevDetails,
        currency_code: selectedCompany.currency_code || '',
        currency_name: selectedCompany.currency_name || '',
        currency_rate: selectedCompany.currency_rate || '',
      }));
    }
  };

  return (
    <Form>
      <FormGroup>
        <div style={{ padding: '8px', backgroundColor: '#e9e9e9', borderRadius: '4px', marginBottom: '8px' }}>
          <h6 style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: '#495057' }}>Currency Details</h6>
          <Row>
            <Col md="3">
              <FormGroup style={{ marginBottom: '8px' }}>
                <Label style={{ fontSize: '11px', marginBottom: '2px' }}>
                  Currency code <span className="required"> *</span>
                </Label>
                <Input
                  type="select"
                  name="currency_id"
                  onChange={handleCompanyChange}
                  value={settingdetails?.currency_id ? String(settingdetails.currency_id) : ''}
                  style={{ fontSize: '11px', padding: '4px 6px', height: '28px' }}
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
            <Col md="3">
              <FormGroup style={{ marginBottom: '8px' }}>
                <Label style={{ fontSize: '11px', marginBottom: '2px' }}>Currency Name</Label>
                <Input type="text" name="currency_name" onChange={handleInputs} value={settingdetails?.currency_name || ''} style={{ fontSize: '11px', padding: '4px 6px', height: '28px' }} />
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup style={{ marginBottom: '8px' }}>
                <Label style={{ fontSize: '11px', marginBottom: '2px' }}>Currency Rate</Label>
                <Input type="text" name="currency_rate" onChange={handleInputs} value={settingdetails?.currency_rate || ''} style={{ fontSize: '11px', padding: '4px 6px', height: '28px' }} />
              </FormGroup>
            </Col>
          </Row>
         
        </div>
      </FormGroup>
    </Form>
  );
}
