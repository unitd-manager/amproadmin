import React, { useState, useEffect,useContext } from 'react';
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
import { useParams, useNavigate } from 'react-router-dom';
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
   const { id: paramId } = useParams();
  const navigate = useNavigate();

  const [id, setId] = useState(paramId);
  const [triggerSave, setTriggerSave] = useState(false);
  const [pendingSalesmen, setPendingSalesmen] = useState([]);
  const [billDiscount, setBillDiscount] = useState(0);

console.log(navigate);
  const [activeTab, setActiveTab] = useState("1");
  const { loggedInuser } = useContext(AppContext);


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
  const [settingdetails, setSettingDetails] = useState({ company_id: '' });
 //setting data in settingDetails
const handleInputs = (e) => {
  const { name, value } = e.target;
  setSettingDetails((prev) => ({ ...prev, [name]: value }));
  if (name === 'bill_discount') {
    setBillDiscount(parseFloat(value) || 0);
  }
};

const getSettingById = () => {
  api
    .post('/salesorder/getSalesorderById', { sales_order_id: id })
    .then((res) => {
      setSettingDetails(res.data.data[0]);
      setBillDiscount(parseFloat(res.data.data[0]?.bill_discount) || 0);
    })
    .catch(() => {
      message('setting Data Not Found', 'info');
    });
};
//Update Setting
const editSettingData = () => {
   settingdetails.modification_date = creationdatetime;
      settingdetails.modified_by= loggedInuser.first_name;
    return api
      .post('/salesorder/editSalesOrder', settingdetails)
      .then(() => {
      
        return id; // Return the existing ID for consistency
      })
      .catch(() => {
        message('Unable to edit record.', 'error');
        throw new Error('Unable to edit record.'); // Propagate error
      });
};

const insertSettingData = (code) => {
  
 if (settingdetails.company_id !== '') {
      settingdetails.tran_no = code;
      settingdetails.tran_date = new Date().toISOString().slice(0, 10);
      settingdetails.creation_date = creationdatetime;
      settingdetails.created_by = loggedInuser.first_name;
      settingdetails.status = 'Open';
      // Always include bill_discount in payload
      const payload = { ...settingdetails, bill_discount: billDiscount };
      return api
        .post('/salesOrder/insertSalesOrder', payload)
        .then((res) => {
          const insertedDataId = res.data.data.insertId;
         
          return insertedDataId; // Return the newly inserted ID
        })
        .catch(() => {
          message('Network connection error.', 'error');
          throw new Error('Network connection error.'); // Propagate error
        });
    }
      message('Please fill all required fields', 'warning');
      return Promise.reject(new Error('Please fill all required fields')); // Return a rejected Promise
  };

    const generateCode = () => {
    return api
      .post('/commonApi/getCodeValues', { type: 'salesorder' })
      .then((res) => {
        return insertSettingData(res.data.data);
      })
      .catch(() => {
        return insertSettingData('');
      });
  };

const saveSalesOrder = async () => {
  if (id) {
    return editSettingData();
  }
  try {
    const newId = await generateCode();
    setId(newId);
    setTriggerSave(true);
    // Save any pending salesmen with the new sales order ID
    if (pendingSalesmen && pendingSalesmen.length > 0) {
      const savePromises = pendingSalesmen.map((salesman) =>
        api.post('/employee/addSalesOrderSalesman', {
          sales_order_id: newId,
          sales_id: salesman.sales_id_dup,
          salesman_name: salesman.salesman_name,
        }).catch((err) => {
          console.error('Failed to save salesman:', err);
          // Continue with other salesmen even if one fails
          return null;
        })
      );
      await Promise.all(savePromises);
      setPendingSalesmen([]); // Clear pending after saving
    }
    return newId;
  } catch (error) {
    message('Failed to create sales order', 'error');
    throw error;
  }
};

console.log(editSettingData);
useEffect(() => {
    const fetchData = async () => {
      if (id) {
        getSettingById();
        getLineItem();
      }
    };
    fetchData();
  }, [id, settingdetails.company_id]);
  return (
  <div >
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
                 salesOrderId={id}
                 onSavePendingSalesmen={(salesmen) => setPendingSalesmen(salesmen)}
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
                onSaveTrigger={triggerSave}
                setOnSaveTrigger={setTriggerSave}
                billDiscount={billDiscount}
                setBillDiscount={setBillDiscount}
              />
        
    </div>
 
  );
};

export default SalesOrderEdit;

