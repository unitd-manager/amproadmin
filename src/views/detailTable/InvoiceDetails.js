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

const OpportunityDetails = () => {
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

  //Logic for adding company in db
  // const [companyInsertData, setCompanyInsertData] = useState({
  //   company_name: '',
  //   address_street: '',
  //   address_town: '',
  //   address_country: 'Singapore',
  //   address_po_code: '',
  //   phone: '',
  //   fax: '',
  //   website: '',
  //   supplier_type: '',
  //   industry: '',
  //   company_size: '',
  //   source: '',
  // });

  // const handleInputs = (e) => {
  //   console.log("companyInsertData",{ ...companyInsertData, [e.target.name]: e.target.value })
  //   setCompanyInsertData({ ...companyInsertData, [e.target.name]: e.target.value });
  // };

  // const insertCompany = () => {
  //   if (
  //     companyInsertData.company_name !== '' &&
  //     companyInsertData.address_street !== '' &&
  //     companyInsertData.address_po_code !== '' &&
  //     companyInsertData.address_country !== ''
  //   ) {
  //     api
  //       .post('/company/insertCompany', companyInsertData)
  //       .then(() => {
  //         message('Company inserted successfully.', 'success');
  //         getCompany();
  //         setTimeout(() => {
  //           toggle()
  //         }, 1000)

  //       })
  //       .catch(() => {
  //         message('Network connection error.', 'error');
  //       });
  //   } else {
  //     setAddFormSubmitted(true)
  //     message('Please fill all required fields.', 'warning');
  //   }
  // };

  //Logic for adding tender in db
  const [tenderForms, setTenderForms] = useState({
    company_name: '',
   currency_id: '',
  });

  const handleInputsTenderForms = (e) => {

    console.log("handleInputsTenderForms",{ ...tenderForms, [e.target.name]: e.target.value })

    setTenderForms({ ...tenderForms, [e.target.name]: e.target.value });
  };

  //Api for getting all countries
  // const getAllCountries = () => {
  //   api
  //     .get('/clients/getCountry')
  //     .then((res) => {
  //       setallCountries(res.data.data);
  //     })
  //     .catch(() => {
  //       message('Country Data Not Found', 'info');
  //     });
  // };
  //const[tenderDetails,setTenderDetails]=useState();
  const getTendersById = () => {
    api
      .post('/invoice/getSalesorderById', { invoice_id: id })
      .then((res) => {
        setTenderForms(res.data.data);
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

  const insertTender = (code) => {
    if (tenderForms.company_id !== '' ) {
      tenderForms.invoice_code = code;
      tenderForms.invoice_date = new Date().toISOString().slice(0, 10);
      tenderForms.creation_date = creationdatetime
      tenderForms.created_by = loggedInuser.first_name;
      api
        .post('/invoice/insertInvoice', tenderForms)
       .then((res) => {
    console.log("Insert Response:", res); // log full res object
  console.log("Insert Response data:", res.data); // log res.data
  const insertedDataId = res.data.data?.insertId;
  if (insertedDataId) {
    message('Order inserted successfully.', 'success');
    setTimeout(() => {
      navigate(`/InvoiceEdit/${insertedDataId}?tab=1`);
    }, 300);
  } else {
    throw new Error('Invalid insert ID');
  }
})
.catch((error) => {
  console.error("Insert error:", error);
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
      .post('/commonApi/getCodeValues', { type: 'invoice' })
      .then((res) => {
        insertTender(res.data.data);
      })
      .catch(() => {
        insertTender('');
      });
  }; 
useEffect(() => {
  getCompany();
  getCurrency();
}, []); // only on component mount

useEffect(() => {
  if (id) {
    getTendersById();
  }
}, [id]); // only when editing


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
                      className={`form-control ${formSubmitted && tenderForms && (tenderForms.company_id === undefined || tenderForms.company_id.trim() === '')
                          ? 'highlight'
                          : ''
                        }`}
                      //value={tenderForms && tenderForms.company_id}
                      // onChange={handleInputsTenderForms}
                      onChange={(e) => {
                        handleInputsTenderForms(e)
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
                    {formSubmitted && tenderForms && (tenderForms.company_id === undefined || tenderForms.company_id.trim() === '') && (
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
            

<FormGroup>
                <Row>
                  <Col md="9">
                    <Label>
                      Currency Name <span className="required"> *</span>{' '}
                    </Label>
                    <Input
                      type="select"
                      name="currency_id"
                    
                      onChange={(e) => {
                        handleInputsTenderForms(e)
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
                  
                  </Col>
                </Row>
              </FormGroup>
             
              <Row>
                <div className="pt-3 mt-3 d-flex align-items-center gap-2">
                  <Button
                    type="button"
                    color="primary"
                    className="btn mr-2 shadow-none"
                    onClick={() => {
                      generateCode();
                    }}
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
            </Form>
          </ComponentCard>
        </Col>
      </Row>
    </div>
  );
};

export default OpportunityDetails;
