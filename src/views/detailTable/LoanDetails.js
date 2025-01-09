import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ComponentCard from '../../components/ComponentCard';
import AppContext from '../../context/AppContext';
import api from '../../constants/api';
import message from '../../components/Message';
import creationdatetime from '../../constants/creationdatetime';

const LoanDetails = () => {
  //state variable
  const [employee, setEmployee] = useState();
  

  //Navigation and Parameter Constants
  const { id } = useParams();
  const navigate = useNavigate();
  const { loggedInuser } = useContext(AppContext);
  // Get Employee By Id
  const getEmployee = () => {
    api
      .get('/loan/TabEmployee')
      .then((res) => {
        setEmployee(res.data.data);
      })
      .catch(() => {});
  };

  const [loanForms, setLoanForms] = useState({
    employee_id: '',
    amount: '',
    month_amount: '',
  });

  //setting data in loanForms
  const handleLoanForms = (e) => {
    setLoanForms({ ...loanForms, [e.target.name]: e.target.value });
  };

  //Logic for adding Loan in db
  const insertLoan = () => {
    if (loanForms.employee_id !== '' && loanForms.amount !== '' && loanForms.month_amount !== '') {
      loanForms.date = moment();
      loanForms.creation_date = creationdatetime;
      loanForms.created_by = loggedInuser.first_name;
      api
        .post('/loan/insertLoan', loanForms)
        .then((res) => {
          const insertedDataId = res.data.data.insertId;
          message('Loan inserted successfully.', 'success');
          setTimeout(() => {
            navigate(`/LoanEdit/${insertedDataId}?tab=1`);
          }, 300);
        })
        .catch(() => {
          message('Network connection error.', 'error');
        });
    } else {
      message('Please fill all required fields', 'warning');
    }
  };

  useEffect(() => {
    getEmployee();
  }, [id]);

  return (
    <div>
      <BreadCrumbs />
      <ToastContainer />
      <Row>
        <Col md="6">
          <ComponentCard title="Loan Details">
            <Form>
              <FormGroup>
                <Row>
                  <Col md="12">
                    <FormGroup>
                      <Label>
                        Employee Name <span className="required"> *</span>
                      </Label>
                      <Input
                        type="select"
                        name="employee_id"
                        onChange={handleLoanForms}
                        value={loanForms && loanForms.employee_id}
                      >
                        <option value="" selected>
                          Please Select
                        </option>
                        {employee &&
                          employee.map((ele) => {
                            return <option value={ele.employee_id}>{ele.employee_name}</option>;
                          })}
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md="12">
                    <FormGroup>
                      <Label>
                        Total Loan Amount<span className="required"> *</span>
                      </Label>
                      <Input
                        type="number"
                        onChange={handleLoanForms}
                        value={loanForms && loanForms.amount}
                        name="amount"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="12">
                    <FormGroup>
                      <Label>
                        Amount Payable(per month)<span className="required"> *</span>
                      </Label>
                      <Input
                        type="number"
                        onChange={handleLoanForms}
                        value={loanForms && loanForms.month_amount}
                        name="month_amount"
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup>
              <Row>
                  <div className="d-flex align-items-center gap-2">
                    <Button
                      color="primary"
                      onClick={() => {
                        insertLoan();
                      }}
                      type="button"
                      className="btn mr-2 shadow-none"
                    >
                      Save & Continue
                    </Button>
                    <Button
                      className="shadow-none"
                      color="dark"
                      onClick={() => {
                        if (
                          window.confirm(
                            'Are you sure you want to cancel  \n  \n You will lose any changes made',
                          )
                        ) {
                          navigate(-1);
                        }
                      }}
                    >
                      Cancel
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
export default LoanDetails;
