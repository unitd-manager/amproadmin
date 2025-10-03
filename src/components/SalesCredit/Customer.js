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
    });
  };

  useEffect(() => {
    getCompany();
  }, []);

  return (
    <Form>
      <FormGroup>
        <div
          style={{
            padding: '8px',
            backgroundColor: '#e9e9e9',
            borderRadius: '4px',
            marginBottom: '8px',
          }}
        >
       
          {/* Row 1: Customer Code + Customer Name */}
          <Row form>
            <Col md="6">
              <FormGroup row style={{ marginBottom: '8px' }}>
                <Label sm={4} style={{ fontSize: '11px', marginBottom: '0' }}>
                  Customer Code <span className="required">*</span>
                </Label>
                <Col sm={8}>
                  <Select
                    options={company.map((c) => ({
                      value: c.company_id,
                      label: c.company_name,
                      customer_code: c.customer_code,
                      company_name: c.company_name,
                    }))}
                    onChange={(selected) => {
                      if (!selected) return;
                      const selectedCompany = company.find((comp) => comp.company_id === selected.value);
                      if (selectedCompany) {
                        setSettingDetails((prevDetails) => ({
                          ...prevDetails,
                          company_id: selectedCompany.company_id || '',
                          company_name: selectedCompany.company_name || '',
                          contact_person: selectedCompany.contact_person || '',
                          customer_code: selectedCompany.customer_code || '',
                          address: selectedCompany.address || '',
                          address_street1: selectedCompany.address_street1 || '',
                          address2: selectedCompany.address2 || '',
                          address_country: selectedCompany.address_country || '',
                          address_po_code: selectedCompany.address_po_code || '',
                          remarks: selectedCompany.remarks || '',
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
                    formatOptionLabel={(option, { context }) =>
                      context === 'menu' ? option.label : option.customer_code
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
                      dropdownIndicator: (base) => ({ ...base, padding: '2px' }),
                      clearIndicator: (base) => ({ ...base, padding: '2px' }),
                      valueContainer: (base) => ({ ...base, padding: '0 6px' }),
                      input: (base) => ({ ...base, margin: 0, padding: 0 }),
                    }}
                  />
                </Col>
              </FormGroup>
            </Col>

            <Col md="6">
              <FormGroup row style={{ marginBottom: '8px' }}>
                <Label sm={4} style={{ fontSize: '11px', marginBottom: '0' }}>
                  Customer Name
                </Label>
                <Col sm={8}>
                  <Input
                    type="text"
                    name="company_name"
                    onChange={handleInputs}
                    value={settingdetails?.company_name || ''}
                    style={{ fontSize: '11px', padding: '4px 6px', height: '28px' }}
                  />
                </Col>
              </FormGroup>
            </Col>
          </Row>

         
          {/* Row 3: Contact Address1 + Contact Address2 */}
          <Row form>
            <Col md="6">
              <FormGroup row style={{ marginBottom: '8px' }}>
                <Label sm={4} style={{ fontSize: '11px', marginBottom: '0' }}>
                  Contact Address 1
                </Label>
                <Col sm={8}>
                  <Input
                    type="text"
                    name="address"
                    onChange={handleInputs}
                    value={settingdetails?.address || ''}
                    style={{ fontSize: '11px', padding: '4px 6px', height: '28px' }}
                  />
                </Col>
              </FormGroup>
            </Col>

             <Col md="6">
              <FormGroup row style={{ marginBottom: '8px' }}>
                <Label sm={4} style={{ fontSize: '11px', marginBottom: '0' }}>
                  Contact Address 2
                </Label>
                <Col sm={8}>
                  <Input
                    type="text"
                    name="address2"
                    onChange={handleInputs}
                    value={settingdetails?.address2 || ''}
                    style={{ fontSize: '11px', padding: '4px 6px', height: '28px' }}
                  />
                </Col>
              </FormGroup>
            </Col>
          </Row>


           <Row form>
            <Col md="6">
              <FormGroup row style={{ marginBottom: '8px' }}>
                <Label sm={4} style={{ fontSize: '11px', marginBottom: '0' }}>
                  Contact Address 3
                </Label>
                <Col sm={8}>
                  <Input
                    type="text"
                    name="address_street1"
                    onChange={handleInputs}
                    value={settingdetails?.address_street1 || ''}
                    style={{ fontSize: '11px', padding: '4px 6px', height: '28px' }}
                  />
                </Col>
              </FormGroup>
            </Col>

             <Col md="6">
              <FormGroup row style={{ marginBottom: '8px' }}>
                <Label sm={4} style={{ fontSize: '11px', marginBottom: '0' }}>
                  Country
                </Label>
                <Col sm={8}>
                  <Input
                    type="text"
                    name="address_country"
                    onChange={handleInputs}
                    value={settingdetails?.address_country || ''}
                    style={{ fontSize: '11px', padding: '4px 6px', height: '28px' }}
                  />
                </Col>
              </FormGroup>
            </Col>
          </Row>

        
          {/* Row 5: Postal Code + Order Date */}
          <Row form>
            <Col md="6">
              <FormGroup row style={{ marginBottom: '8px' }}>
                <Label sm={4} style={{ fontSize: '11px', marginBottom: '0' }}>
                  Postal Code
                </Label>
                <Col sm={8}>
                  <Input
                    type="text"
                    name="address_po_code"
                    onChange={handleInputs}
                    value={settingdetails?.address_po_code || ''}
                    style={{ fontSize: '11px', padding: '4px 6px', height: '28px' }}
                  />
                </Col>
              </FormGroup>
            </Col>

            <Col md="6">
              <FormGroup row style={{ marginBottom: '8px' }}>
                <Label sm={4} style={{ fontSize: '11px', marginBottom: '0' }}>
                Remarks
                </Label>
                <Col sm={8}>
                  <Input
                    type="text"
                    name="remarks"
                    onChange={handleInputs}
                    value={settingdetails?.remarks || ''}
                    style={{ fontSize: '11px', padding: '4px 6px', height: '28px' }}
                  />
                </Col>
              </FormGroup>
            </Col>
          </Row>
        </div>
      </FormGroup>
    </Form>
  );
}
