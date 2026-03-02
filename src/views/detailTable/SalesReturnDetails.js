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
import Customer from '../../components/SalesReturn/Customer';
import Currency from '../../components/SalesReturn/Currency';
import Shipping from '../../components/SalesReturn/Shipping';
import SalesMan from '../../components/SalesReturn/SalesMan';
// import QuoteLineItem from '../../components/SalesReturn/QuoteLineItem';
// import EditLineItemModal from '../../components/SalesReturn/EditLineItemModal';
import SalesOrderProducts from '../../components/SalesReturn/SalesOrderProducts';

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
    api.post('/salesreturn/getQuoteLineItemsById', { sales_return_id: id }).then((res) => {
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
        api.post('/salesreturn/deleteProjectQuote', { sales_return_item_id: deleteID }).then(() => {
          Swal.fire('Deleted!', 'Your Line Items has been deleted.', 'success');
          window.location.reload();
        });
      }
    });
  };
  const [settingdetails, setSettingDetails] = useState({ company_id: '' });
  const [billDiscount, setBillDiscount] = useState(0);
 //setting data in settingDetails
 const handleInputs = (e) => {
  setSettingDetails({ ...settingdetails, [e.target.name]: e.target.value });
  if (e.target.name === 'bill_discount') {
    setBillDiscount(parseFloat(e.target.value) || 0);
  }
};

const getSettingById = () => {
  api
    .post('/salesreturn/getSalesorderById', { sales_return_id: id })
    .then((res) => {
      setSettingDetails(res.data.data[0]);
      setBillDiscount(parseFloat(res.data.data[0]?.bill_discount) || 0);
    })
    .catch(() => {
      message('setting Data Not Found', 'info');
    });
};


const editSettingData = () => {
   settingdetails.modification_date = creationdatetime;
      settingdetails.modified_by= loggedInuser.first_name;
    return api
      .post('/salesreturn/editSalesOrder', settingdetails)
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
      settingdetails.sales_return_code = code;
      settingdetails.sales_return_date = new Date().toISOString().slice(0, 10);
      settingdetails.creation_date = creationdatetime;
      settingdetails.created_by = loggedInuser.first_name;
      // Always include bill_discount in payload
      const payload = { ...settingdetails, bill_discount: billDiscount };
  
      return api
        .post('/salesreturn/insertInvoice', payload)
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
      .post('/commonApi/getCodeValues', { type: 'salesreturn' })
      .then((res) => {
        return insertSettingData(res.data.data);
      })
      .catch(() => {
        return insertSettingData('');
      });
  };
  const [pendingSalesmen, setPendingSalesmen] = useState([]);

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
        api.post('/employee/addSalesReturnSalesman', {
          sales_return_id: newId,
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
      // } else if (settingdetails.company_id !== '') {
      //   const newId = await saveSalesOrder();
      //   setId(newId);
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
                  value={settingdetails && settingdetails.sales_return_code}
                  name="sales_return_code"
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
                  value={settingdetails && settingdetails.sales_return_date}
                  name="sales_return_date"
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
                 onSaveTrigger={triggerSave}
                setOnSaveTrigger={setTriggerSave}
                billDiscount={billDiscount}
                setBillDiscount={setBillDiscount}
              />
        
    </div>
 
  );
};

export default SalesOrderEdit;

