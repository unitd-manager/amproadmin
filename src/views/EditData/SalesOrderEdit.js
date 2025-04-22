import React, { useState, useEffect } from 'react';
import {  Form,  TabContent,TabPane,  Row, Col, FormGroup, Label, Input,Button,Table} from 'reactstrap';
import { ToastContainer } from 'react-toastify';
import * as Icon from 'react-feather';
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
//import ApiButton from '../../components/ApiButton';
import Customer from '../../components/SalesOrder/Customer';
import Currency from '../../components/SalesOrder/Currency';
import Shipping from '../../components/SalesOrder/Shipping';
import SalesMan from '../../components/SalesOrder/SalesMan';
import QuoteLineItem from '../../components/SalesOrder/QuoteLineItem';
import EditLineItemModal from '../../components/SalesOrder/EditLineItemModal';
import PdfPickingList from '../../components/PDF/PdfPick';


const SalesOrderEdit = () => {
   const { id } = useParams();
 
  // const [supplierStatus, setSupplierStatus] = useState();
  const [activeTab, setActiveTab] = useState('1');


  //navigation and params
  // const { id } = useParams();
  const navigate = useNavigate();
  // const applyChanges = () => {};

  // const getSupplierStatus = () => {
  //   api
  //     .get('/supplier/getValueList')
  //     .then((res) => {
  //       setSupplierStatus(res.data.data);
  //     })
  //     .catch(() => {
  //       message('Status Data Not Found', 'info');
  //     });
  // };
  // useEffect(() => {
  //     getSupplierStatus();
  // }, []);

    // Start for tab refresh navigation #Renuka 1-06-23
    const tabs = [
      { id: '1', name: 'Customer' },
      { id: '2', name: 'Currency' },
      { id: '3', name: 'Shipping' },
      { id: '4', name: 'Sales Man' },
       { id: '6', name: 'Pdf Pick' },
     
    ];
    const toggle = (tab) => {
      setActiveTab(tab);
    };
  // Navigate back to the list
  // const backToList = () => {
  //   navigate('/SalesOrder');
  // };

  // const [hoveredRowIndex, setHoveredRowIndex] = useState(null);

  // // Function to handle tooltip toggle
  // const toggleTooltip = (index) => {
  //   setHoveredRowIndex(index === hoveredRowIndex ? null : index);
  // };

  
  const [addLineItemModal, setAddLineItemModal] = useState(false);
  const [lineItem, setLineItem] = useState();
  const [viewLineModal, setViewLineModal] = useState(false);

  const [editLineModelItem, setEditLineModelItem] = useState(null);
  const [editLineModal, setEditLineModal] = useState(false);
  


    const addQuoteItemsToggle = () => {
    setAddLineItemModal(!addLineItemModal);
  };

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


  const columns1 = [
    {
      name: '#',
    },
    {
      name: 'Product Name',
    },
    {
      name: 'Product Code',
    },
    {
      name: 'Carton Qty',
    },
    {
      name: 'Loose Qty',
    },
    {
      name: 'Qty',
    },
    {
      name: 'Carton Price',
    },
    {
      name: 'Price',
    },
    {
      name: 'Total',
    },
    {
      name: 'Discount',
    },
    {
      name: 'Gross Total',
    },
    {
      name: 'Action',
    },
  ];


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
                                  navigate('/salesOrder');
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
                                navigate('/salesOrder');
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
                    value={settingdetails && settingdetails.tran_no}
                    name="tran_no"
                  ></Input>
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label>Tran Date</Label>
                  <Input
                    type="date"
                    onChange={handleInputs}
                    value={settingdetails && settingdetails.tran_date}
                    name="tran_date"
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
          <TabPane tabId="6">
            <PdfPickingList
            id={id}
            ></PdfPickingList>
          </TabPane>
         
        </TabContent>
      </ComponentCard>
      <>
      <ComponentCard title="Products">
       
      <Row>
                <Col md="6">
                <Button
                  className="shadow-none"
                  color="primary"
                  to=""
                  onClick={addQuoteItemsToggle.bind(null)}
                >
                  Add Sale Items 
                </Button>
              </Col>
            </Row>
            <br />
          
       <Table id="example" className="display border border-secondary rounded">
                  <thead>
                    <tr>
                      {columns1.map((cell) => {
                        return <td key={cell.name}>{cell.name}</td>;
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {lineItem &&
                      lineItem.map((e, index) => {
                        return (
                          <tr key={e.project_quote_id}>
                            <td>{index + 1}</td>
                            <td data-label="Product Name">{e.product_name}</td>
                            <td data-label="Product Code">{e.product_code}</td>
                            <td data-label="Carton Qty">{e.carton_qty}</td>
                            <td data-label="Loose Qty">{e.loose_qty}</td>
                            <td data-label="Quantity">{e.quantity}</td>
                            <td data-label="carton Price">{e.carton_price}</td>
                            <td data-label="Price">{e.wholesale_price}</td>
                            <td data-label="Total">{e.total}</td>
                            <td data-label="Discount">{e.discount_value}</td>
                            <td data-label="Gross Total">{e.gross_total}</td> 
                            <td data-label="Actions">
                              <span
                                className="addline"
                                onClick={() => {
                                  setEditLineModelItem(e);
                                  setEditLineModal(true);
                                }}
                              >
                                <Icon.Edit2 />
                              </span>
                              <span
                                className="addline"
                                onClick={() => {
                                  deleteRecord(e.sales_order_item_id);
                                }}
                              >
                                <Icon.Trash2 />
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
               {/* End View Line Item Modal */}
            <EditLineItemModal
              editLineModal={editLineModal}
              setEditLineModal={setEditLineModal}
              FetchLineItemData={editLineModelItem}
              getLineItem={getLineItem}
              setViewLineModal={setViewLineModal}
            
              //insertquote={insertquote}
            ></EditLineItemModal>
            {addLineItemModal && (
              <QuoteLineItem
                //projectInfo={tenderId}
                addLineItemModal={addLineItemModal}
                setAddLineItemModal={setAddLineItemModal}
                quoteLine={id}
            
              ></QuoteLineItem>
            )}
  
         
      </ComponentCard>
      </>
    </div>
  );
};

export default SalesOrderEdit;
