import React, { useState, useEffect } from 'react';
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
//import ApiButton from '../../components/ApiButton';
import Customer from '../../components/SalesOrder/Customer';
import Currency from '../../components/SalesOrder/Currency';
import Shipping from '../../components/SalesOrder/Shipping';
import SalesMan from '../../components/SalesOrder/SalesMan';
import QuoteLineItem from '../../components/SalesOrder/QuoteLineItem';
import EditLineItemModal from '../../components/SalesOrder/EditLineItemModal';
import SalesInvoicePickingListPdf from '../../components/PDF/SalesInvoicePickingListPdf';
// import QuoteLineItem from '../../components/SalesOrder/QuoteLineItem';
// import EditLineItemModal from '../../components/SalesOrder/EditLineItemModal';
import SalesOrderProducts from '../../components/SalesOrder/SalesOrderProducts';

// import SalesOrderPrintWithCost from '../../components/PDF/SalesOrderPrintWithCost';
// import PdfPickingList from '../../components/PDF/PdfPick';
// import PdfPackingList from '../../components/PDF/PdfPack';
// import PdfSalesQuote from '../../components/PDF/PdfSalesOrderQuote';
// import PrintPerfoma from '../../components/PDF/PrintPerfoma';


const SalesOrderEdit = () => {
   const { id } = useParams();
 
  const [activeTab, setActiveTab] = useState('1');

  const navigate = useNavigate();

    const tabs = [
      { id: '1', name: 'Customer' },
      { id: '2', name: 'Currency' },
      { id: '3', name: 'Shipping' },
      { id: '4', name: 'Sales Man' },
       { id: '5', name: 'Sales order Items' },
       { id: '6', name: 'Pdf' },
    ];
    const toggle = (tab) => {
      setActiveTab(tab);
    };
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
    api.post('/invoice/getQuoteLineItemsById', { invoice_id: id }).then((res) => {
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
        api.post('/invoice/deleteProjectQuote', { invoice_item_id: deleteID }).then(() => {
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
    .post('/invoice/getInvoiceorderById', { invoice_id: id })
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
      .post('/invocie/editInvoice', settingdetails)
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
                                  navigate('/Invoice');
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
                                navigate('/Invoice');
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

            <TabPane tabId="5">
            <Row>
                <Col md="6">
                <Button
                  className="shadow-none"
                  color="primary"
                  to=""
                  onClick={addQuoteItemsToggle.bind(null)}
                >
                  Add Sales Items 
                </Button>
              </Col>
            </Row>
            <br />
            <Row>
              {/* <div className="container">
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
                            <td data-label="Title">{e.title}</td>
                            <td data-label="Description">{e.description}</td>
                            <td data-label="Quantity">{e.quantity}</td>
                            <td data-label="Unit Price">{e.unit_price}</td>
                            <td data-label="Amount">{e.amount}</td>
                            <td data-label="Updated By">
              <Icon.Eye
                id={`tooltip-${index}`}
                onMouseOver={() => toggleTooltip(index)} // Pass index to toggle function
              />
              <Tooltip
                placement="top"
                isOpen={hoveredRowIndex === index} // Check if current row index matches hoveredRowIndex
                target={`tooltip-${index}`}
                toggle={() => toggleTooltip(index)}
              >
                <span className="tooltiptext">
                  {e.modification_date
                    ? `Modified by ${e.modified_by} on ${e.modification_date}`
                    : `Created by ${e.created_by} on ${e.creation_date}`}
                </span>
              </Tooltip>
            </td>
                            
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
              </div> */}
            </Row>
            

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
          </TabPane>
          <TabPane tabId="6">
          <SalesInvoicePickingListPdf
          id={id}
                   settingdetails={settingdetails}
                   lineItem={lineItem}
                ></SalesInvoicePickingListPdf>
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
