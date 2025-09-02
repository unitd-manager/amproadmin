import React, { useState, useEffect,useContext } from 'react';
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
//import ComponentCard from '../../components/ComponentCard';
//  import ComponentCardV2 from '../../components/ComponentCardV2';
import message from '../../components/Message';
import api from '../../constants/api';
import Tab from '../../components/ProjectTabs/Tab';
import creationdatetime from '../../constants/creationdatetime';

//import ApiButton from '../../components/ApiButton';
import Customer from '../../components/SalesOrder/Customer';
import Currency from '../../components/SalesOrder/Currency';
import Shipping from '../../components/SalesOrder/Shipping';
import SalesMan from '../../components/SalesOrder/SalesMan';
// import QuoteLineItem from '../../components/SalesOrder/QuoteLineItem';
// import EditLineItemModal from '../../components/SalesOrder/EditLineItemModal';
import SalesOrderProducts from '../../components/SalesOrder/SalesOrderProducts';

// import SalesOrderPrintWithCost from '../../components/PDF/SalesOrderPrintWithCost';
// import PdfPickingList from '../../components/PDF/PdfPick';
// import PdfPackingList from '../../components/PDF/PdfPack';
// import PdfSalesQuote from '../../components/PDF/PdfSalesOrderQuote';
// import PrintPerfoma from '../../components/PDF/PrintPerfoma';
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
    api.post('/salesOrder/getQuoteLineItemsById', { sales_order_id: id }).then((res) => {
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
        api.post('/salesOrder/deleteProjectQuote', { sales_order_item_id: deleteID }).then(() => {
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
    .post('/salesorder/getSalesorderById', { sales_order_id: id })
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
      .post('/salesorder/editSalesOrder', settingdetails)
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
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>   
      {/* Fixed Header Section */}
      <div style={{ flexShrink: 0, backgroundColor: '#ffffff', borderBottom: '1px solid #dee2e6', padding: '4px 8px' }}>
        <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '4px', color: '#495057' }}>Add/Edit Sales Order</div>
        <Form>
          <Row>
            <Col md="2">
              <FormGroup style={{ marginBottom: '4px' }}>
                <Label style={{ fontSize: '10px', marginBottom: '1px' }}>Tran No</Label>
                <Input
                  type="text"
                  onChange={handleInputs}
                  value={settingdetails && settingdetails.tran_no}
                  name="tran_no"
                  style={{ backgroundColor: '#e9ecef', fontSize: '10px', padding: '2px 4px', height: '24px' }}
                  readOnly
                />
              </FormGroup>
            </Col>
            <Col md="2">
              <FormGroup style={{ marginBottom: '4px' }}>
                <Label style={{ fontSize: '10px', marginBottom: '1px' }}>Tran Date</Label>
                <Input
                  type="date"
                  onChange={handleInputs}
                  value={settingdetails && settingdetails.tran_date}
                  name="tran_date"
                  style={{ fontSize: '10px', padding: '2px 4px', height: '24px' }}
                />
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </div>
      <ToastContainer></ToastContainer>
      
      {/* Scrollable Middle Section */}
      <div style={{ flex: 1, overflow: 'auto', padding: '4px 8px' }}>
        <Form>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #dee2e6', borderRadius: '2px' }}>
            {/* Compact tabs */}
            <Tab toggle={toggle} tabs={tabs} />
            <TabContent style={{ padding: '4px 6px' }} activeTab={activeTab}>
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
          {/* <TabPane tabId="5">
            <PdfPickingList
            id={id}
            ></PdfPickingList>
          </TabPane> */}
          {/* <TabPane tabId="6">
            <PdfPackingList
            id={id}
            ></PdfPackingList>
          </TabPane>
          <TabPane tabId="10">
            <PdfSalesQuote
            id={id}
            ></PdfSalesQuote>
            </TabPane> */}
              {/* <TabPane tabId="7">
              <SalesOrderPrintWithCost
              id={id}
                       settingdetails={settingdetails}
                       lineItem={lineItem}
                    ></SalesOrderPrintWithCost>
                    <PrintPerfoma
                       id={id}
                       settingdetails={settingdetails}
                       lineItem={lineItem}
                    ></PrintPerfoma>
              </TabPane> */}
             
            </TabContent>
          </div>
          
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #dee2e6', borderRadius: '2px', marginTop: '4px' }}>
            <div style={{ padding: '4px 6px', borderBottom: '1px solid #dee2e6', backgroundColor: '#f8f9fa', fontSize: '11px', fontWeight: 'bold' }}>Products</div>
            <div style={{ padding: '4px 6px' }}>
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
            </div>
          </div>
        </Form>
      </div>
      
      {/* Fixed Footer Section */}
      <div style={{ 
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#2c3e50',
        borderTop: '1px solid #dee2e6',
        padding: '4px 8px',
        color: '#ffffff',
        zIndex: 1000
      }}>
        <Row className="align-items-center">
          <Col md="2">
            <div style={{ fontSize: '10px', marginBottom: '1px' }}>Bill Discount: $</div>
            <Input 
              type="number" 
              defaultValue="0" 
              style={{ 
                height: '20px', 
                fontSize: '9px', 
                padding: '1px 4px',
                width: '60px'
              }} 
            />
          </Col>
          <Col md="2">
            <div style={{ fontSize: '10px', color: '#ffffff' }}>Total Product:</div>
            <div style={{ fontSize: '11px', fontWeight: 'bold' }}>7</div>
          </Col>
          <Col md="2">
            <div style={{ fontSize: '10px', color: '#ffffff' }}>Sub Total:</div>
            <div style={{ fontSize: '11px', fontWeight: 'bold' }}>$ 130.25</div>
          </Col>
          <Col md="2">
            <div style={{ fontSize: '10px', color: '#ffffff' }}>Tax:</div>
            <div style={{ fontSize: '11px', fontWeight: 'bold' }}>$ 11.72</div>
          </Col>
          <Col md="2">
            <div style={{ fontSize: '10px', color: '#ffffff' }}>Net Total:</div>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#28a745' }}>$ 141.97</div>
          </Col>
          <Col md="2" className="text-right">
            <Button
              color="secondary"
              size="sm"
              onClick={() => {
                navigate('/salesOrder');
              }}
              style={{ marginRight: '3px', fontSize: '9px', padding: '2px 6px' }}
            >
              Cancel
            </Button>
            <Button
              color="info"
              size="sm"
              onClick={() => {
                editSettingData();
              }}
              style={{ marginRight: '3px', fontSize: '9px', padding: '2px 6px' }}
            >
              Print
            </Button>
            <Button
              color="primary"
              size="sm"
              onClick={() => {
                editSettingData();
                setTimeout(() => {
                  navigate('/salesOrder');
                  window.location.reload();
                }, 1100);
              }}
              style={{ fontSize: '9px', padding: '2px 6px' }}
            >
              Save
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default SalesOrderEdit;

