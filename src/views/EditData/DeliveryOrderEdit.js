import React, { useState, useEffect, useContext } from 'react';
import {  Form,  TabContent,TabPane,  Row, Col, FormGroup, Label, Input} from 'reactstrap';
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
//import ComponentCard from '../../components/ComponentCard';
//  import ComponentCardV2 from '../../components/ComponentCardV2';
import message from '../../components/Message';
import api from '../../constants/api';
import Tab from '../../components/ProjectTabs/Tab';
import creationdatetime from '../../constants/creationdatetime';

//import ApiButton from '../../components/ApiButton';
import Customer from '../../components/Delivery/Customer';
import Currency from '../../components/Delivery/Currency';
import Shipping from '../../components/Delivery/Shipping';
import SalesMan from '../../components/Delivery/SalesMan';
// import QuoteLineItem from '../../components/Delivery/QuoteLineItem';
// import EditLineItemModal from '../../components/Delivery/EditLineItemModal';
import SalesOrderProducts from '../../components/Delivery/SalesOrderProductsEdit';

import AppContext from '../../context/AppContext';


const InvoiceEdit = () => {
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
    api.post('/invoice/getDeliveryLineItemsById', { delivery_order_id: id }).then((res) => {
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
        api.post('/invoice/deleteDeliveryItem', { delivery_order_item_id: deleteID }).then(() => {
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
    .post('/invoice/getDeliveryorderById', { delivery_order_id: id })
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
    
      .post('/invoice/editDeliveryOrder', settingdetails)
      .then(() => {
        message('Record editted successfully', 'success');
      })
      .catch(() => {
        message('Unable to edit record.', 'error');
      });
};

const insertSettingData = () => {
  settingdetails.creation_date = creationdatetime;
  settingdetails.created_by = loggedInuser.first_name;
  return api
    .post('/salesOrder/insertDeliveryOrder', settingdetails)
    .then((res) => {
      message('Record inserted successfully', 'success');
      const insertedDataId = res.data.data.insertId;
        setTimeout(() => {
            navigate(`/DeliveryOrderEdit/${insertedDataId}?tab=1`);
          }, 300);
    })
    .catch(() => {
      message('Unable to insert record.', 'error');
    });
};

const saveSalesOrder = () => {
  if (id) {
    editSettingData();
  } else {
    insertSettingData();
  }
};
useEffect(() => {
  getSettingById();
      getLineItem();
}, [id]);
 return (
  <div >
      {/* Fixed Header Section */}
      <div style={{ flexShrink: 0, backgroundColor: '#ffffff', borderBottom: '1px solid #dee2e6', padding: '4px 8px' }}>
        <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '4px', color: '#495057' }}>Add/Edit Invoice</div>
        <Form>
          <Row>
            <Col md="2">
              <FormGroup style={{ marginBottom: '4px' }}>
                <Label style={{ fontSize: '10px', marginBottom: '1px' }}>Tran No</Label>
                <Input
                  type="text"
                  onChange={handleInputs}
                  value={settingdetails && settingdetails.delivery_code}
                  name="delivery_code"
                  style={{ backgroundColor: '#e9ecef', fontSize: '10px', padding: '2px 4px', height: '24px' }}
                  
                />
              </FormGroup>
            </Col>
            <Col md="2">
              <FormGroup style={{ marginBottom: '4px' }}>
                <Label style={{ fontSize: '10px', marginBottom: '1px' }}>Tran Date</Label>
                <Input
                  type="date"
                  onChange={handleInputs}
                  value={settingdetails && settingdetails.date}
                  name="date"
                  style={{ fontSize: '10px', padding: '2px 4px', height: '24px' }}
                />
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </div>
      <ToastContainer></ToastContainer>
      
   
            {/* Compact tabs */}
            <Tab toggle={toggle} tabs={tabs} />
            <TabContent style={{ padding: '4px 6px' }} activeTab={activeTab}>
              <TabPane tabId="1" >
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
     
              <SalesOrderProducts
                addLineItemModal={addLineItemModal}
                setAddLineItemModal={setAddLineItemModal}
                lineItem={lineItem}
                setEditLineModelItem={setEditLineModelItem}
                setEditLineModal={setEditLineModal}
                editLineModal={editLineModal}
                editLineModelItem={editLineModelItem}
                saveSalesOrder={saveSalesOrder}
                getLineItem={getLineItem}
                deleteRecord={deleteRecord}
                id={id}
                setViewLineModal={setViewLineModal}
              />
        
    </div>
 
  );
};

export default InvoiceEdit;
