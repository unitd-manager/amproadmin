import React, { useState, useEffect } from 'react';
import { Row, Col, Form, FormGroup, Button, TabContent, TabPane } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import 'datatables.net-buttons/js/buttons.colVis';
import 'datatables.net-buttons/js/buttons.flash';
import 'datatables.net-buttons/js/buttons.html5';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useNavigate, useParams } from 'react-router-dom';
import '../form-editor/editor.scss';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import Tab from '../../components/ProjectTabs/Tab';
import ComponentCard from '../../components/ComponentCard';
import ComponentCardV2 from '../../components/ComponentCardV2';
import message from '../../components/Message';
import api from '../../constants/api';
import SupplierDetails from '../../components/SupplierModal/SupplierDetails';
import Loginformation from '../../components/SupplierModal/Loginformation';
import ContactDetails from '../../components/SupplierModal/ContactDetails';
import Transaction from '../../components/SupplierModal/Transaction';

const SupplierEdit = () => {
  //all state variables
  const [supplier, setSupplier] = useState();
  // const [purchaseOrder, setPurchaseOrder] = useState();
  const [allCountries, setAllCountries] = useState();
  const [editPurchaseOrderLinked, setEditPurchaseOrderLinked] = useState(false);
  const [supplierStatus, setSupplierStatus] = useState();
  const [status, setStatus] = useState();
  const [taxfromvaluelist, setTaxFromValuelist] = useState();
  const [pricegroupfromvaluelist, setPriceGroupFromValuelist] = useState();
  const [contacttypefromvaluelist, setContactTypeFromValuelist] = useState();
  const [currencyfromvaluelist, setCurrencyFromValuelist] = useState();
  const [areafromvaluelist, setAreaFromValuelist] = useState();
  const [termsfromvaluelist, setTermsFromValuelist] = useState();
  const [activeTab, setActiveTab] = useState('1');


  //navigation and params
  const { id } = useParams();
  const navigate = useNavigate();
  const applyChanges = () => {};

  const tabs = [
    { id: '1', name: 'Supplier Login Info' },
    { id: '2', name: 'Contact' },
    { id: '3', name: 'Transaction' },
  ];
  const toggle = (tab) => {
    setActiveTab(tab);
  };
  // Get Supplier By Id
  const editSupplierById = () => {
    api
      .post('/supplier/get-SupplierById', { supplier_id: id })
      .then((res) => {
        setSupplier(res.data.data[0]);
      })
      .catch(() => {
        message('Supplier Data Not Found', 'info');
      });
  };

  const handleInputs = (e) => {
    setSupplier({ ...supplier, [e.target.name]: e.target.value });
  };
  //Logic for edit data in db
  const editSupplierData = () => {
    if (supplier.company_name !== '')
      api
        .post('/supplier/edit-Supplier', supplier)
        .then(() => {
          message('Record editted successfully', 'success');
        })
        .catch(() => {
          message('Unable to edit record.', 'error');
        });
    else {
      message('Please fill all required fields.', 'error');
    }
  };
  //Logic for edit data in db
  const Status = () => {
    api
      .post('/supplier/getStatus', { supplier_id: id })
      .then((res) => {
        setStatus(res.data.data[0]);
      })
      .catch(() => {
        message('Unable to edit record.', 'error');
      });
  };
//Api call for getting Tax From Valuelist
const getTaxDrodownFromValuelist = () => {
  api
    .get('/supplier/getTaxDrodownFromValuelist')
    .then((res) => {
      setTaxFromValuelist(res.data.data);
    })
    .catch(() => {
      message('Staff Data Not Found', 'info');
    });
};
//Api call for getting Price Group From Valuelist
const getPriceGroupDrodownFromValuelist = () => {
  api
    .get('/supplier/getPriceGroupDrodownFromValuelist')
    .then((res) => {
      setPriceGroupFromValuelist(res.data.data);
    })
    .catch(() => {
      message('Staff Data Not Found', 'info');
    });
};
//Api call for getting Contact Type From Valuelist
const getContactTypeDrodownFromValuelist = () => {
  api
    .get('/supplier/getContactTypeDrodownFromValuelist')
    .then((res) => {
      setContactTypeFromValuelist(res.data.data);
    })
    .catch(() => {
      message('Staff Data Not Found', 'info');
    });
};
//Api call for getting Tax From Valuelist
const getAreaDrodownFromValuelist = () => {
  api
    .get('/supplier/getAreaDrodownFromValuelist')
    .then((res) => {
      setAreaFromValuelist(res.data.data);
    })
    .catch(() => {
      message('Staff Data Not Found', 'info');
    });
};
//Api call for getting Currency From Valuelist
const getCurrencyDrodownFromValuelist = () => {
  api
    .get('/supplier/getCurrencyDrodownFromValuelist')
    .then((res) => {
      setCurrencyFromValuelist(res.data.data);
    })
    .catch(() => {
      message('Staff Data Not Found', 'info');
    });
};

//Api call for getting Tax From Valuelist
const getTermsDrodownFromValuelist = () => {
  api
    .get('/supplier/getTermsDrodownFromValuelist')
    .then((res) => {
      setTermsFromValuelist(res.data.data);
    })
    .catch(() => {
      message('Staff Data Not Found', 'info');
    });
};
  useEffect(() => {
    editSupplierById();
  }, [id]);
  // Get purchaseOrder By Id
  // const getpurchaseOrder = () => {
  //   api
  //     .post('/supplier/getPurchaseOrderLinkedss', { supplier_id: id })
  //     .then((res) => {
  //       setPurchaseOrder(res.data.data);
  //     })
  //     .catch(() => {
  //       message('Supplier not found', 'info');
  //     });
  // };
  const suppliereditdetails = () => {
    api
      .get('/geocountry/getCountry')
      .then((res) => {
        setAllCountries(res.data.data);
      })
      .catch(() => {
        message('Supplier Data Not Found', 'info');
      });
  };
  //Api call for getting Staff Type From Valuelist
  const getSupplierStatus = () => {
    api
      .get('/supplier/getValueList')
      .then((res) => {
        setSupplierStatus(res.data.data);
      })
      .catch(() => {
        message('Status Data Not Found', 'info');
      });
  };
  useEffect(() => {
    // getpurchaseOrder();
    suppliereditdetails();
    getSupplierStatus();
    Status();
    getTaxDrodownFromValuelist();
    getPriceGroupDrodownFromValuelist();
    getContactTypeDrodownFromValuelist();
    getAreaDrodownFromValuelist();
    getTermsDrodownFromValuelist();
    getCurrencyDrodownFromValuelist();
  }, []);

  return (
    <>
      <BreadCrumbs heading={supplier && supplier.company_name} />
      <Form>
        <FormGroup>
          <ComponentCardV2>
            <Row>
              <Col>
                <Button
                  className="shadow-none"
                  color="primary"
                  onClick={() => {
                    editSupplierData();
                    setTimeout(() => {
                      navigate('/Supplier');
                    }, 1100);
                  }}
                >
                  Save
                </Button>
              </Col>
              <Col>
                <Button
                  color="primary"
                  className="shadow-none"
                  onClick={() => {
                    editSupplierData();
                   
                  }}
                >
                  Apply
                </Button>
              </Col>
              <Col>
                <Button
                  color="dark"
                  className="shadow-none"
                  onClick={() => {
                    applyChanges();
                  }}
                >
                  Back to List
                </Button>
              </Col>
            </Row>
          </ComponentCardV2>
        </FormGroup>
      </Form>
      <SupplierDetails
        handleInputs={handleInputs}
        supplier={supplier}
        allCountries={allCountries}
        supplierStatus={supplierStatus}
        status={status}
        setEditPurchaseOrderLinked={setEditPurchaseOrderLinked}
        taxfromvaluelist={taxfromvaluelist}
        pricegroupfromvaluelist={pricegroupfromvaluelist}
        contacttypefromvaluelist={contacttypefromvaluelist}
        areafromvaluelist={areafromvaluelist}
        currencyfromvaluelist={currencyfromvaluelist}
        termsfromvaluelist={termsfromvaluelist}
        editPurchaseOrderLinked={editPurchaseOrderLinked}
      ></SupplierDetails>

      {/* <PurchaseOrderLinked
        editPurchaseOrderLinked={editPurchaseOrderLinked}
        setEditPurchaseOrderLinked={setEditPurchaseOrderLinked}
      ></PurchaseOrderLinked> */}

      {/* <ComponentCard>
        <ToastContainer></ToastContainer>
        <SupplierTable purchaseOrder={purchaseOrder}></SupplierTable>
      </ComponentCard> */}

       <ComponentCard title="More Details">
              {/* Replace toggle and tabs with your implementation */}
              <Tab toggle={toggle} tabs={tabs} />
                  <TabContent className="p-4" activeTab={activeTab}>
                <TabPane tabId="1">
                  <Loginformation
                  id={id}>
                  </Loginformation>
                  
                </TabPane>
                <TabPane tabId="2">
                  <ContactDetails
                ></ContactDetails>
                 
                </TabPane>
                <TabPane tabId="3">
                <Transaction></Transaction>
                </TabPane>
               
              </TabContent>
            </ComponentCard>
    </>
  );
};

export default SupplierEdit;
