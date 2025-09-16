import React, { useState, useEffect } from 'react';
import { Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import Select from 'react-select';
import PropTypes from 'prop-types';

import api from '../../constants/api';

export default function SupplierDetails({ handleInputs, settingdetails, setSettingDetails }) {
  SupplierDetails.propTypes = {
    handleInputs: PropTypes.func,
    settingdetails: PropTypes.any,
    setSettingDetails: PropTypes.func,
  };

  const [company, setCompany] = useState([]);

  // Fetch company data
  const getCompany = () => {
    api.get('/company/getCompany').then((res) => {
      setCompany(res.data.data);

      // prepare code options for dropdown
      // const opts = res.data.data.map((c) => ({
      //   value: c.customer_code,
      //   label: `${c.company_name}`,
      // }));
      // setCodeOptions(opts);
    });
  };

  useEffect(() => {
    getCompany();
  }, []);

  // Handle customer code selection
  // const handleCodeChange = (selected) => {
  //   if (!selected) return;

  //   const selectedCompany = company.find(
  //     (comp) => comp.customer_code === selected.value
  //   );

  //   if (selectedCompany) {
  //     // Update settingdetails with selected company data
  //     setSettingDetails((prevDetails) => ({
  //       ...prevDetails,
  //       company_id: selectedCompany.company_id || '',
  //       company_name: selectedCompany.company_name || '',
  //       contact_person: selectedCompany.contact_person || '',
  //       customer_code: selectedCompany.customer_code || '',
  //       address_town: selectedCompany.address_town || '',
  //       address_street: selectedCompany.address_street || '',
  //       address_state: selectedCompany.address_state || '',
  //       address_country: selectedCompany.address_country || '',
  //       address_po_code: selectedCompany.address_po_code || '',
  //       notes: selectedCompany.notes || '',
  //     }));
  //   }
  // };

  return (
    <Form>
      <FormGroup>
        <div
          style={{
            padding: '8px',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            marginBottom: '8px',
          }}
        >
          <h6
            style={{
              fontSize: '12px',
              fontWeight: 'bold',
              marginBottom: '8px',
              color: '#495057',
            }}
          >
            Customer Details
          </h6>

          <Row>
            {/* Customer Code Auto Search */}
            <Col md="3">
              <FormGroup style={{ marginBottom: '8px' }}>
                <Label style={{ fontSize: '11px', marginBottom: '2px' }}>
                  Customer Code <span className="required">*</span>
                </Label>
             <Select
  options={company.map((c) => ({
    value: c.company_id,              // save company_id
    label: c.company_name,            // show company name in dropdown
    customer_code: c.customer_code,   // keep customer code for selected display
    company_name: c.company_name,
  }))}

  onChange={(selected) => {
    if (!selected) return;

    const selectedCompany = company.find(
      (comp) => comp.company_id === selected.value
    );

    if (selectedCompany) {
      setSettingDetails((prevDetails) => ({
        ...prevDetails,
        company_id: selectedCompany.company_id || '',
        company_name: selectedCompany.company_name || '',
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
  }}

  value={
    settingdetails?.company_id
      ? {
          value: settingdetails.company_id,
          label: settingdetails.company_name,
          customer_code: settingdetails.customer_code,
        }
      : null
  }

  // custom rendering
  formatOptionLabel={(option, { context }) =>
    context === "menu"
      ? option.label             // in dropdown → company name
      : option.customer_code     // when selected → customer code
  }

  placeholder="Search by company name..."
  isClearable
  styles={{
    control: (base) => ({
      ...base,
      minHeight: '28px',
      height: '28px',
      fontSize: '11px',
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: '2px',
    }),
    clearIndicator: (base) => ({
      ...base,
      padding: '2px',
    }),
    valueContainer: (base) => ({
      ...base,
      padding: '0 6px',
    }),
    input: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
    }),
  }}
/>

              </FormGroup>
            </Col>

            {/* Customer Name (auto populated but still editable if needed) */}
            <Col md="3">
              <FormGroup style={{ marginBottom: '8px' }}>
                <Label style={{ fontSize: '11px', marginBottom: '2px' }}>
                  Customer Name
                </Label>
                <Input
                  type="text"
                  name="company_name"
                  onChange={handleInputs}
                  value={settingdetails?.company_name || ''}
                  style={{
                    fontSize: '11px',
                    padding: '4px 6px',
                    height: '28px',
                  }}
                />
              </FormGroup>
            </Col>

            <Col md="3">
              <FormGroup style={{ marginBottom: '8px' }}>
                <Label style={{ fontSize: '11px', marginBottom: '2px' }}>
                  Contact Address 1
                </Label>
                <Input
                  type="text"
                  name="address_street"
                  onChange={handleInputs}
                  value={settingdetails?.address_street || ''}
                  style={{
                    fontSize: '11px',
                    padding: '4px 6px',
                    height: '28px',
                  }}
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md="3">
              <FormGroup style={{ marginBottom: '8px' }}>
                <Label style={{ fontSize: '11px', marginBottom: '2px' }}>
                  Country
                </Label>
                <Input
                  type="text"
                  name="address_country"
                  onChange={handleInputs}
                  value={settingdetails?.address_country || ''}
                  style={{
                    fontSize: '11px',
                    padding: '4px 6px',
                    height: '28px',
                  }}
                />
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup style={{ marginBottom: '8px' }}>
                <Label style={{ fontSize: '11px', marginBottom: '2px' }}>
                  Country Po Code
                </Label>
                <Input
                  type="text"
                  name="address_po_code"
                  onChange={handleInputs}
                  value={settingdetails?.address_po_code || ''}
                  style={{
                    fontSize: '11px',
                    padding: '4px 6px',
                    height: '28px',
                  }}
                />
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup style={{ marginBottom: '8px' }}>
                <Label style={{ fontSize: '11px', marginBottom: '2px' }}>
                  Remarks
                </Label>
                <Input
                  type="text"
                  name="notes"
                  onChange={handleInputs}
                  value={settingdetails?.notes || ''}
                  style={{
                    fontSize: '11px',
                    padding: '4px 6px',
                    height: '28px',
                  }}
                />
              </FormGroup>
            </Col>
          </Row>
        </div>
      </FormGroup>
    </Form>
  );
}
