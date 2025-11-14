import React, { useState, useEffect, useContext } from 'react';
import { Form, Row, Col, FormGroup, Label, Input, Button,  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,} from 'reactstrap';
  import classnames from 'classnames';
import { ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import moment from 'moment';
import { useNavigate, useParams } from 'react-router-dom';
import ComponentCard from '../../components/ComponentCard';
import ComponentCardV2 from '../../components/ComponentCardV2';
//import Tabs from '../../components/Tabs';
// import Tabs from '../../components/ProjectTabs/Tab';
import message from '../../components/Message';
import api from '../../constants/api';
import creationdatetime from '../../constants/creationdatetime';
import AppContext from '../../context/AppContext';
import StockRequestProducts from '../../components/StockRequest/StockRequestProducts';

const StockRequestEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loggedInuser } = useContext(AppContext);
    const [activeTab, setActiveTab] = useState('1');
    // Function to toggle tabs
  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const [stockRequestDetails, setStockRequestDetails] = useState({});
  //const [products, setProducts] = useState([]);

  // Handle input changes
  const handleInputs = (e) => {
    setStockRequestDetails({ ...stockRequestDetails, [e.target.name]: e.target.value });
  };

  const [addLineItemModal, setAddLineItemModal] = useState(false);
  const [lineItem, setLineItem] = useState();
  // const [viewLineModal, setViewLineModal] = useState(false);

  const [editLineModelItem, setEditLineModelItem] = useState(null);
  const [editLineModal, setEditLineModal] = useState(false);

  // Get line items
  const getLineItem = () => {
    api.post('/stockRequest/getStockRequestProducts', { stock_request_id: id })
      .then((res) => {
        console.log('Fetched line items:', res.data.data);
        setLineItem(res.data.data);
      })
      .catch((error) => {
        console.error('Error fetching line items:', error);
        message('Error fetching line items', 'error');
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
        api.post('/stockRequest/deleteStockRequestProduct', { stock_request_item_id: deleteID }).then(() => {
          Swal.fire('Deleted!', 'Your Line Items has been deleted.', 'success');
          window.location.reload();
        });
      }
    });
  };

  // Fetch stock request details
  const getStockRequestById = () => {
    api
      .post('/stockRequest/getStockRequestById', { stock_request_id: id })
      .then((res) => {
        setStockRequestDetails(res.data.data[0]);
      })
      .catch(() => {
        message('Stock request not found', 'info');
      });
  };

  

  // Update stock request
  const editStockRequest = () => {
    const updatedData = {
      ...stockRequestDetails,
      modification_date: creationdatetime,
      modified_by: loggedInuser.first_name,
    };

    api
      .post('/stockRequest/editStockRequest', updatedData)
      .then(() => {
        message('Record updated successfully', 'success');
      })
      .catch(() => {
        message('Unable to update record.', 'error');
      });
  };

  // Delete stock request
  const deleteStockRequest = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This will delete the stock request permanently.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .post('/stockRequest/deleteStockRequest', { stock_request_id: id })
          .then(() => {
            message('Stock request deleted', 'success');
            navigate('/stockRequest');
          })
          .catch(() => {
            message('Unable to delete record.', 'error');
          });
      }
    });
  };

  useEffect(() => {
    getStockRequestById();
    getLineItem(); // Add this line to fetch line items when component mounts
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
                  editStockRequest();
                  setTimeout(() => {
                    navigate('/stockRequest');
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
                  editStockRequest();
                }}
              >
                Apply
              </Button>
            </Col>
            <Col>
              <Button
                color="dark"
                onClick={() => {
                  navigate('/stockRequest');
                }}
              >
                Back to List
              </Button>
            </Col>
            <Col>
              <Button color="danger" onClick={deleteStockRequest}>
                Delete
              </Button>
            </Col>
          </Row>
        </ComponentCardV2>
      </Form>

      <ToastContainer />

     <ComponentCard >
              <ToastContainer />
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === '1' })}
                    onClick={() => {
                      toggle('1');
                    }}
                  >
                    Details
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === '2' })}
                    onClick={() => {
                      toggle('2');
                    }}
                  >
                    Products
                  </NavLink>
                </NavItem>
  
              </Nav>
              <TabContent activeTab={activeTab} className="p-4">
                {/* Tab 1: Additional/More Details (your ContentMoreDetails) */}
                <TabPane tabId="1">
                   <ComponentCard title="Stock Request Details" creationModificationDate={stockRequestDetails}>
            <Row>
              <Col md="4">
                <FormGroup>
                  <Label>Stock Request No</Label>
                  <Input
                    type="text"
                    name="stock_req_no"
                    value={stockRequestDetails.stock_req_no || ''}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label>From Location</Label>
                  <Input
                    type="text"
                    name="from_location"
                    value={stockRequestDetails.from_location || ''}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label>To Location</Label>
                  <Input
                    type="text"
                    name="to_location"
                    value={stockRequestDetails.to_location || ''}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="4">
                <FormGroup>
                  <Label>Status</Label>
                  <Input
                    type="select"
                    name="status"
                    value={stockRequestDetails.status || ''}
                    onChange={handleInputs}
                  >
                    <option value="">Select</option>
                    <option value="Pending">Pending</option>
                    <option value="Draft">Draft</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Completed">Completed</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label>Stock Request Date</Label>
                  <Input
                    type="date"
                    name="stock_req_date"
                      value={
                    stockRequestDetails && moment(stockRequestDetails.stock_req_date).format('YYYY-MM-DD')
                  }
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label>Remarks</Label>
                  <Input
                    type="text"
                    name="remarks"
                    value={stockRequestDetails.remarks || ''}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>
            </Row>
          </ComponentCard>
        </TabPane>
  
        {/* Tab 2: Customer Login Info */}
        <TabPane tabId="2">
            <StockRequestProducts
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
        // setViewLineModal={setViewLineModal}
      />
                </TabPane>
              </TabContent>
            </ComponentCard>
    </div>
  );
};

export default StockRequestEdit;
