import React, { useState, useEffect } from 'react';
import { Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import PropTypes from 'prop-types';
import ComponentCard from '../ComponentCard';
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
        <ComponentCard title="Customer Details">
          <Row>
            <Col md="4">
              <FormGroup>
                <Label>
                  Sales man <span className="required"> *</span>
                </Label>
                <Input
                  type="select"
                  name="sales_id"
                  onChange={handleInputs} // Updated function
                  value={settingdetails?.sales_id ? String(settingdetails.sales_id) : ''}
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
         
        </ComponentCard>
      </FormGroup>
    </Form>
  );
}
