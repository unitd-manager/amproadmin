import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ComponentCard from '../../components/ComponentCard';
import api from '../../constants/api';
import message from '../../components/Message';
import AppContext from '../../context/AppContext';
import creationdatetime from '../../constants/creationdatetime';

const LoanDetails = () => {
  const [employee, setEmployee] = useState([]);
  const { loggedInuser } = useContext(AppContext);

  const getSelectedLocationFromLocalStorage = () => {
    const locations = localStorage.getItem('selectedLocation');
    const loc = JSON.parse(locations);
    return locations ? Number(loc) : null;
  };

  const selectedLocation = getSelectedLocationFromLocalStorage();
  const { id } = useParams();
  const navigate = useNavigate(); 

  const getEmployee = () => {
    api.post('/loan/getEmployeesite', { site_id: selectedLocation })
      .then((res) => {
        setEmployee(res.data.data);
      })
      .catch(() => {});
  };

  const [loanForms, setLoanForms] = useState({
    employee_id: '',
    amount: '',
    month_amount: '',
    date: '',
    status: '',
  });

  const handleLoanForms = (e) => {
    setLoanForms({ ...loanForms, [e.target.name]: e.target.value });
  };

  const insertLoan = () => {
    if (loanForms.employee_id !== '' && loanForms.amount !== '' && loanForms.month_amount !== '') {
      const loanDataForBackend = {
        ...loanForms,
        created_by: loggedInuser.first_name,
        creation_date: creationdatetime,
        date: moment().format('YYYY-MM-DD HH:mm:ss'),
        site_id: selectedLocation,
      };
      api.post('/loan/insertLoan', loanDataForBackend)
        .then((res) => {
          const insertedDataId = res.data.data.insertId;
          const employeeId = loanForms.employee_id;
          message('Loan inserted successfully.', 'success');
          setTimeout(() => {
            navigate(`/LoanEdit/${insertedDataId}/${employeeId}`);
          }, 300);
        })
        .catch(() => {
          message('Network connection error.', 'error');
        });
    } else {
      message('Please fill all required fields', 'error');
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
                        <span className="required">*</span> Employee Name
                      </Label>
                      <Input
                        type="select"
                        onChange={handleLoanForms}
                        value={loanForms.employee_id}
                        name="employee_id"
                      >
                        <option value="">Please Select</option>
                        {employee.map((ele) => (
                          <option key={ele.employee_id} value={ele.employee_id}>
                            {ele.employee_name}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md="12">
                    <FormGroup>
                      <Label>
                        <span className="required">*</span> Total Loan Amount
                      </Label>
                      <Input
                        type="number"
                        onChange={handleLoanForms}
                        value={loanForms.amount}
                        name="amount"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="12">
                    <FormGroup>
                      <Label>
                        <span className="required">*</span> Amount Payable (per month)
                      </Label>
                      <Input
                        type="number"
                        onChange={handleLoanForms}
                        value={loanForms.month_amount}
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
                      onClick={insertLoan}
                      type="button"
                      className="btn mr-2 shadow-none"
                    >
                      Save & Continue
                    </Button>
                    <Button
                      className="shadow-none"
                      color="dark"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to cancel?\n\nYou will lose any changes made.')) {
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
