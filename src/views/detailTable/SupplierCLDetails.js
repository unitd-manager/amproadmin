import React, { useState, useEffect, useContext} from 'react';
import { Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ComponentCard from '../../components/ComponentCard';
import api from '../../constants/api';
import message from '../../components/Message';
import creationdatetime from '../../constants/creationdatetime';
import AppContext from '../../context/AppContext';

const SupplierCLDetails = () => {
  //all state variables
  const [supplierForms, setSupplierForms] = useState({
    company_name: '',
  });
  //navigation and params
  const navigate = useNavigate();
  const { loggedInuser } = useContext(AppContext);
  //supplierData in supplier details
  const handleInputsSupplierForms = (e) => {
    setSupplierForms({ ...supplierForms, [e.target.name]: e.target.value });
  };
  //inserting supplier data
 

  const insertSupplier = (code) => {
    if (supplierForms.company_name !== '') {
      supplierForms.supplier_code = code;
      supplierForms.creation_date = creationdatetime
      supplierForms.created_by = loggedInuser.first_name;
      api
        .post('/supplier/insert-Supplier', supplierForms)
        .then((res) => {
          const insertedDataId = res.data.data.insertId;
          message('Supplier inserted successfully.', 'success');
          setTimeout(() => {
            navigate(`/SupplierCLEdit/${insertedDataId}?tab=1`);
          }, 300);
        })
        .catch(() => {
          message('Network connection error.', 'error');
        });
    } else {
      message('Please fill all required fields', 'warning');
    }
  };

  const generateCode = () => {
    api
      .post('/commonApi/getCodeValues', { type: 'SupplierCode' })
      .then((res) => {
        insertSupplier(res.data.data);
      })
      .catch(() => {
        insertSupplier('');
      });
  };


  useEffect(() => {}, []);
  return (
    <div>
       <BreadCrumbs />
      <ToastContainer />
      <Row>
        <Col md="6" xs="12">
          {/* Key Details */}
          <ComponentCard title="Supplier Name">
          <Form>
              <FormGroup>
                <Row>
                  <Col md="12">
                    <Label>
                      {' '}
                      Supplier Name <span className="required"> *</span>{' '}
                    </Label>
                    <Input type="text" name="company_name" onChange={handleInputsSupplierForms} />
                    </Col>
                </Row>
              </FormGroup>
              <FormGroup>
                <Row>
          <div className="pt-3 mt-3 d-flex align-items-center gap-2">
            <Button color="primary"
              onClick={() => {
                generateCode();
                // setTimeout(() => {
                //   navigate('/SupplierEdit');
                // }, 800);
              }}
              type="button"
              className="btn mr-2 shadow-none"  >
              Save & Continue
            </Button>
            <Button
              onClick={() => {
                navigate('/SupplierCL')
              }}
              type="button"
              className="btn btn-dark shadow-none" >
              Go to List
            </Button>
            </div>
                </Row>
              </FormGroup>
            </Form>
          </ComponentCard>
        </Col>
      </Row>
    </div>
  );
};

export default SupplierCLDetails;
