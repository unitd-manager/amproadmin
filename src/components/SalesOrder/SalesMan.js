import React, { useState, useEffect } from 'react';
import { Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import PropTypes from 'prop-types';
import api from '../../constants/api';

export default function SupplierDetails({ handleInputs, settingdetails }) {
  SupplierDetails.propTypes = {
    handleInputs: PropTypes.func,
    settingdetails: PropTypes.any,
  };

  const [company, setCompany] = useState([]);

  // Fetch company data
  const getCompany = () => {
    api.get('/employee/getEmployee').then((res) => {
      setCompany(res.data.data);
    });
  };

  useEffect(() => {
    getCompany();
  }, []);


  return (
    <Form>
      <FormGroup>
        <div style={{ padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '4px', marginBottom: '8px' }}>
          <h6 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>Salesman Details</h6>
          <Row>
            <Col md="3">
              <FormGroup>
                <Label style={{ fontSize: '12px', fontWeight: '500', marginBottom: '4px' }}>
                  Sales man <span className="required"> *</span>
                </Label>
                <Input
                  type="select"
                  name="sales_id"
                  onChange={handleInputs}
                  value={settingdetails?.sales_id ? String(settingdetails.sales_id) : ''}
                  style={{ fontSize: '12px', padding: '4px 6px', height: '28px' }}
                >
                  <option value="">Please Select</option>
                  {company.map((ele) => (
                    <option key={ele.employee_id_duplicate} value={String(ele.employee_id_duplicate)}>
                      {ele.employee_name}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            
         </Row>
         
        </div>
      </FormGroup>
    </Form>
  );
}
