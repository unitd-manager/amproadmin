import React, { useState, useEffect } from 'react';
import { Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import message from '../../components/Message';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ComponentCard from '../../components/ComponentCard';
import api from '../../constants/api';
import creationdatetime from '../../constants/creationdatetime';

const ClientDetails = () => {
  // Navigation and Parameter Constants
  const navigate = useNavigate();

  //  insertClient
  const [clientForms, setClientForms] = useState({
    company_name: '',
  });

  //Client Functions/Methods
  const handleClientForms = (e) => {
    setClientForms({ ...clientForms, [e.target.name]: e.target.value });
  };

  // Client Insert
  const insertClient = () => {
    if (clientForms.company_name !== '') {
      clientForms.creation_date = creationdatetime;
      api
        .post('/clients/insertCompany', clientForms)
        .then((res) => {
          const insertedDataId = res.data.data.insertId;
          message('Client inserted successfully.', 'success');
          setTimeout(() => {
            navigate(`/ClientEdit/${insertedDataId}`);
          }, 300);
        })
        .catch(() => {
          message('Network connection error.', 'error');
        });
    } else {
      message('Please fill all required fields', 'warning');
    }
  };

  useEffect(() => {}, []);

  return (
    <div>
      <BreadCrumbs />
      <ToastContainer></ToastContainer>
      <Row>
        <Col md="6" xs="12">
          <ComponentCard title="Key Details">
            <Form>
              <FormGroup>
                <Row>
                  <Col md="12">
                    <Label>
                      Company Name <span className="required"> *</span>{' '}
                    </Label>

                    <Input
                      type="text"
                      name="company_name"
                      onChange={(e) => {
                        handleClientForms(e);
                      }}
                    ></Input>
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup>
                <Row>
                  <div className="pt-3 mt-3 d-flex align-items-center gap-2">
                    <Button
                      color="primary"
                      onClick={() => {
                        insertClient();
                      }}
                      type="button"
                      className="btn mr-2 shadow-none"
                    >
                      Save & Continue
                    </Button>
                    <Button
                      onClick={() => {
                        navigate(-1);
                      }}
                      type="button"
                      className="btn btn-dark shadow-none"
                    >
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

export default ClientDetails;
