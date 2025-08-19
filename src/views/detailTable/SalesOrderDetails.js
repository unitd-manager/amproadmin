import React, { useState, useEffect,useContext } from 'react';
import { Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { ToastContainer } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ComponentCard from '../../components/ComponentCard';
import api from '../../constants/api';
import message from '../../components/Message';
//import TenderCompanyDetails from '../../components/TenderTable/TenderCompanyDetails';
import creationdatetime from '../../constants/creationdatetime';
import AppContext from '../../context/AppContext';

const SalesOrderDetails = () => {
  const [company, setCompany] = useState();
  const [currency, setCurrency] = useState();

 // const [allCountries, setallCountries] = useState();
  //const [contact, setContact] = useState();
  const [formSubmitted, setFormSubmitted] = useState(false);
 // const [addFormSubmitted, setAddFormSubmitted] = useState(false);
 // const [modal, setModal] = useState(false);
  const { id } = useParams();
  const { loggedInuser } = useContext(AppContext);
  const navigate = useNavigate();
  // const toggle = () => {
  //   setModal(!modal);
  // };

  //Api call for getting company dropdown
  const getCompany = () => {
    api.get('/company/getCompany').then((res) => {
      setCompany(res.data.data);
    });
  };


  const getCurrency = () => {
    api.get('/currency/getCurrency').then((res) => {
      setCurrency(res.data.data);
    });
  };

  const [salesOrderForms, setSalesOrderForms] = useState({
    company_id: '',
   currency_id: '',
  });

  const handleInputsSalesOrderForms = (e) => {

    console.log("handleInputsSalesOrderForms",{ ...salesOrderForms, [e.target.name]: e.target.value })

    setSalesOrderForms({ ...salesOrderForms, [e.target.name]: e.target.value });
  };


  const getSalesOrderById = () => {
    api
      .post('/salesorder/getSalesorderById', { sales_order_id: id })
      .then((res) => {
        setSalesOrderForms(res.data.data[0]);
        // getContact(res.data.data.company_id);
      })
      .catch(() => { });
  };

  // Get contact 
  // const getContact = (companyId) => {
  //   // setSelectedCompany(companyId);
  //   api.post('/company/getContactByCompanyId', { company_id: companyId }).then((res) => {
  //     setContact(res.data.data[0]?.company_id);
  //   });
  // };

  const insertSalesOrder = (code) => {
    if (salesOrderForms.company_id !== '' ) {

      salesOrderForms.tran_no = code;
      salesOrderForms.tran_date = new Date().toISOString().slice(0, 10);
      salesOrderForms.creation_date = creationdatetime
      salesOrderForms.created_by = loggedInuser.first_name;
      salesOrderForms.status = 'Open';
      api
        .post('/salesOrder/insertSalesOrder', salesOrderForms)
        .then((res) => {
          const insertedDataId = res.data.data.insertId;
          getSalesOrderById();

          message('Order inserted successfully.', 'success');
          setTimeout(() => {
            navigate(`/salesorderEdit/${insertedDataId}?tab=1`);
          }, 300);
        })
        .catch(() => {
          message('Network connection error.', 'error');
        });
    } else {
      setFormSubmitted(true);
      message('Please fill all required fields', 'warning');
    }
  };

  //QUTO GENERATED CODE
  const generateCode = () => {
    api
      .post('/commonApi/getCodeValues', { type: 'salesorder' })
      .then((res) => {
        insertSalesOrder(res.data.data);
      })
      .catch(() => {
        insertSalesOrder('');
      });
  }; 

  useEffect(() => {
    getCompany();
    getCurrency();
    
    // If id is provided, fetch existing sales order data
    if (id) {
      getSalesOrderById();
    }
  }, [id]);

  return (
    <div>
      <BreadCrumbs />
      <Row>
        <ToastContainer></ToastContainer>
        <Col md="6" xs="12">
          <ComponentCard title="New Sales Order">
            <Form>
             
              <FormGroup>
                <Row>
                  <Col md="9">
                    <Label>
                      Company Name <span className="required"> *</span>{' '}
                    </Label>
                    <Input
                      type="select"
                      name="company_id"
                      className={`form-control ${formSubmitted && salesOrderForms && (salesOrderForms.company_id === undefined || salesOrderForms.company_id.trim() === '')
                          ? 'highlight'
                          : ''
                        }`}
                      value={salesOrderForms && salesOrderForms.company_id}
                      onChange={(e) => {
                        handleInputsSalesOrderForms(e)
                      }}

                    >
                      <option value=''>Please Select</option>
                      {company &&
                        company.map((ele) => {
                          return (
                            <option key={ele.company_id} value={ele.company_id}>
                              {ele.company_name}
                            </option>
                          );
                        })}
                    </Input>
                    {formSubmitted && salesOrderForms && (salesOrderForms.company_id === undefined || salesOrderForms.company_id.trim() === '') && (
                      <div className="error-message">Please select the company name</div>
                    )}
                  </Col>
                  {/* <Col md="3" className="addNew">
                    <Label>Add New Name</Label>
                    <Button color="primary" className="shadow-none" onClick={toggle.bind(null)}>
                      Add New
                    </Button>
                  </Col> */}
                </Row>
              </FormGroup>
              {/* <TenderCompanyDetails
                allCountries={allCountries}
                insertCompany={insertCompany}
                handleInputs={handleInputs}
                toggle={toggle}
                modal={modal}
                setModal={setModal}
                companyInsertData={companyInsertData}
                addFormSubmitted={addFormSubmitted}
              ></TenderCompanyDetails> */}


<FormGroup>
                <Row>
                  <Col md="9">
                    <Label>
                      Currency Name <span className="required"> *</span>{' '}
                    </Label>
                    <Input
                      type="select"
                      name="currency_id"
                      value={salesOrderForms && salesOrderForms.currency_id}
                      onChange={(e) => {
                        handleInputsSalesOrderForms(e)
                      }}

                    >
                      <option value=''>Please Select</option>
                      {currency &&
                        currency.map((ele) => {
                          return (
                            <option key={ele.currency_id} value={ele.currency_id}>
                              {ele.currency_name}
                            </option>
                          );
                        })}
                    </Input>
                    {/* {formSubmitted && tenderForms && (tenderForms.currency_id === undefined || tenderForms.currency_id.trim() === '') && (
                      <div className="error-message">Please select the currency name</div>
                    )} */}
                  </Col>
                </Row>
              </FormGroup>
             
              <Row>
                <div className="pt-3 mt-3 d-flex align-items-center gap-2">
                  <Button
                    type="submit"
                    color="primary"
                    className="btn mr-2 shadow-none"
                    onClick={() => {
                      generateCode();
                    }}
                  >
                    Submit
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
            </Form>
          </ComponentCard>
        </Col>
      </Row>
    </div>
  );
};

export default SalesOrderDetails;
