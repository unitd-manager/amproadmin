import React, { useState, useEffect, useContext } from 'react';
import {  Form,  TabContent,TabPane,  Row, Col, FormGroup, Label, Input,Button} from 'reactstrap';
import { ToastContainer } from 'react-toastify';
// import * as Icon from 'react-feather';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import 'datatables.net-buttons/js/buttons.colVis';
import 'datatables.net-buttons/js/buttons.flash';
import 'datatables.net-buttons/js/buttons.html5';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useNavigate, useParams } from 'react-router-dom';
import '../form-editor/editor.scss';
// import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ComponentCard from '../../components/ComponentCard';
 import ComponentCardV2 from '../../components/ComponentCardV2';
import message from '../../components/Message';
import api from '../../constants/api';
import Tab from '../../components/ProjectTabs/Tab';
import creationdatetime from '../../constants/creationdatetime';

//import ApiButton from '../../components/ApiButton';
import Customer from '../../components/SalesCredit/Customer';
import Currency from '../../components/SalesCredit/Currency';
import Shipping from '../../components/SalesCredit/Shipping';
import SalesMan from '../../components/SalesCredit/SalesMan';

import SalesOrderProducts from '../../components/SalesCredit/SalesOrderProducts';

import AppContext from '../../context/AppContext';


const SalesOrderEdit = () => {
   const { id } = useParams();
 
  const [activeTab, setActiveTab] = useState('1');
  const { loggedInuser } = useContext(AppContext);

  const navigate = useNavigate();

    const tabs = [
      { id: '1', name: 'Customer' },
      { id: '2', name: 'Currency' },
      { id: '3', name: 'Shipping' },
      { id: '4', name: 'Sales Man' },
    
    ];
    const toggle = (tab) => {
      setActiveTab(tab);
    };
  const [addLineItemModal, setAddLineItemModal] = useState(false);
  const [lineItem, setLineItem] = useState();
  const [viewLineModal, setViewLineModal] = useState(false);

  const [editLineModelItem, setEditLineModelItem] = useState(null);
  const [editLineModal, setEditLineModal] = useState(false);
  


  //   const addQuoteItemsToggle = () => {
  //   setAddLineItemModal(!addLineItemModal);
  // };

   const viewLineToggle = () => {
    setViewLineModal(!viewLineModal);
  };
  console.log(viewLineToggle);


    // Get Line Item
  const getLineItem = () => {
    api.post('/salesreturn/getCreditLineItemsById', { credit_note_id: id }).then((res) => {
      setLineItem(res.data.data);
      //setAddLineItemModal(true);
    });
  };


  const deleteRecord = (deleteID) => {
    Swal.fire({
      title: `Are you sure? ${deleteID}`,
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        api.post('/salesreturn/deleteCreditNote', { credit_note_item_id: deleteID }).then(() => {
          Swal.fire('Deleted!', 'Your Line Items has been deleted.', 'success');
          window.location.reload();
        });
      }
    });
  };
  const [settingdetails, setSettingDetails] = useState();
//setting data in settingDetails
const handleInputs = (e) => {
  setSettingDetails({ ...settingdetails, [e.target.name]: e.target.value });
};

const getSettingById = () => {
  api
    .post('/salesreturn/getCreditNoteById', { credit_note_id: id })
    .then((res) => {
      setSettingDetails(res.data.data[0]);
    })
    .catch(() => {
      message('setting Data Not Found', 'info');
    });
};
//Update Setting
const editSettingData = () => {
    settingdetails.modification_date = creationdatetime;
      settingdetails.modified_by= loggedInuser.first_name;
    api
    
      .post('/salesreturn/editcreditnote', settingdetails)
      .then(() => {
        message('Record editted successfully', 'success');
      })
      .catch(() => {
        message('Unable to edit record.', 'error');
      });
};
useEffect(() => {
  getSettingById();
      getLineItem();
}, [id]);
 return (
    <div>   
      <Form>     
        <ComponentCardV2>
                        <Row>
                          <Col>
                            <Button
                              color="primary"
                              onClick={() => {
                                editSettingData();
                                setTimeout(() => {
                                  navigate('/SalesCredit');
                                  window.location.reload();
                                }, 1100);
                              }}
                            >
                              Save
                            </Button>
                          </Col>
                          <Col>
                            <Button
                              color="primary"
                              onClick={() => {
                                editSettingData();
                              }}
                            >
                              Apply
                            </Button>
                          </Col>
                          <Col>
                            <Button
                              color="dark"
                              onClick={() => {
                                navigate('/SalesCredit');
                                console.log('back to list');
                              }}
                            >
                              Back to List
                            </Button>
                          </Col>
                        </Row>
                      </ComponentCardV2>
      </Form>
      <ToastContainer></ToastContainer>
      <Form>
        <FormGroup>
          <ComponentCard title="Setting Details" creationModificationDate={settingdetails}>
            {' '}
            <Row>
              <Col md="4">
                <FormGroup>
                  <Label>Tran No</Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={settingdetails && settingdetails.credit_note_code}
                    name="credit_note_code"
                  ></Input>
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label>Tran Date</Label>
                  <Input
                    type="date"
                    onChange={handleInputs}
                    value={settingdetails && settingdetails.credit_note_date}
                    name="credit_note_date"
                  />
                </FormGroup>
              </Col>
             
            </Row>
          </ComponentCard>
        </FormGroup>
      </Form>
      <ComponentCard title="More Details">
        {/* Replace toggle and tabs with your implementation */}
        <Tab toggle={toggle} tabs={tabs} />
            <TabContent className="p-4" activeTab={activeTab}>
              <TabPane tabId="1">
                <Customer
                 settingdetails={settingdetails}
                 handleInputs={handleInputs}
                 setSettingDetails={setSettingDetails}
                ></Customer>
       </TabPane>
          <TabPane tabId="2">
            <Currency
             setSettingDetails={setSettingDetails}
            settingdetails={settingdetails}
            handleInputs={handleInputs}
            ></Currency>
     </TabPane>
          <TabPane tabId="3">
            <Shipping
            settingdetails={settingdetails}
            handleInputs={handleInputs}
            setSettingDetails={setSettingDetails}
            ></Shipping>
          </TabPane>
          <TabPane tabId="4">
            <SalesMan
             settingdetails={settingdetails}
             handleInputs={handleInputs}
             ></SalesMan>
          </TabPane>
       
         
        
        </TabContent>
      </ComponentCard>
      <>
      <ComponentCard title="Products">
      <SalesOrderProducts
  addLineItemModal={addLineItemModal}
  setAddLineItemModal={setAddLineItemModal}
  lineItem={lineItem}
  setEditLineModelItem={setEditLineModelItem}
  setEditLineModal={setEditLineModal}
  editLineModal={editLineModal}
  editLineModelItem={editLineModelItem}
  getLineItem={getLineItem}
  deleteRecord={deleteRecord}
  id={id}
  setViewLineModal={setViewLineModal}
/>

      </ComponentCard>
      </>
    </div>
  );
};

export default SalesOrderEdit;
