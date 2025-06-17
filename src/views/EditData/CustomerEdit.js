import React, { useContext, useEffect, useState } from 'react';
import {
  Row,
  Col,
  Form,
  FormGroup,
  Button,
  Label,
  Input,
  TabContent, // Keep TabContent
  TabPane,    // Keep TabPane
  Nav,        // Keep Nav
  NavItem,    // Keep NavItem
  NavLink,    // Keep NavLink
} from 'reactstrap';
import classnames from 'classnames'; // Keep classnames for active tab styling
import { useNavigate, useParams } from 'react-router-dom';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../form-editor/editor.scss';
import { ToastContainer } from 'react-toastify';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ComponentCardV2 from '../../components/ComponentCardV2';
import message from '../../components/Message';
import api from '../../constants/api';
import ComponentCard from '../../components/ComponentCard';
import creationdatetime from '../../constants/creationdatetime';
import AppContext from '../../context/AppContext';
import ContentMoreDetails from '../../components/Customer/CustomerMoreDetails';
import CustomerLogin from '../../components/Customer/CustomerLogin';
import ContactPerson from '../../components/Customer/ContactPerson';
import CustomerShippingDetail from '../../components/Customer/ShippingDetail';
import CustomerSalesmen from '../../components/Customer/SalesMan';
import Transaction from '../../components/Customer/Module';
import CustomerProductDetails from '../../components/Customer/ProductDetails';


const ContentUpdate = () => {
  const [contentDetails, setContentDetails] = useState({});
  const { loggedInuser } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('1'); // State for active tab

  const { id } = useParams();
  const navigate = useNavigate();

  const handleInputs = (e) => {
    const { name, value, type, checked } = e.target;
    setContentDetails({
      ...contentDetails,
      [name]: type === 'checkbox' || type === 'switch' ? (checked ? 1 : 0) : value,
    });
  };

  const getContentById = () => {
    api
      .post('/contact/getContactssById', { contact_id: id })
      .then((res) => {
        setContentDetails(res.data.data[0]);
      })
      .catch(() => {
        message('Content Data Not Found', 'info');
      });
  };

  const editContentData = () => {
    if (
      contentDetails.first_name !== '' &&
      contentDetails.mobile !== '' &&
      contentDetails.email !== ''
    ) {
      contentDetails.modification_date = creationdatetime;
      contentDetails.modified_by = loggedInuser.first_name;
      api
        .post('/contact/editContact', contentDetails)
        .then(() => {
          message('Record edited successfully', 'success');
        })
        .catch((error) => {
          message('Unable to edit record.', 'error');
          console.error('Edit error:', error);
        });
    } else {
      message('Please fill all required fields', 'warning');
    }
  };

  useEffect(() => {
    getContentById();
  }, [id]);

  // Function to toggle tabs
  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <>
      <BreadCrumbs heading={contentDetails && contentDetails.first_name} />
      <Form>
        <FormGroup>
          <ComponentCardV2>
            <Row>
              <Col>
                <Button
                  color="primary"
                  onClick={() => {
                    editContentData();
                    setTimeout(() => {
                      navigate('/Customer');
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
                    editContentData();
                  }}
                >
                  Apply
                </Button>
              </Col>
              <Col>
                <Button
                  color="dark"
                  onClick={() => {
                    navigate('/Customer');
                  }}
                >
                  Back to List
                </Button>
              </Col>
            </Row>
          </ComponentCardV2>
          <ComponentCard title="Customer details" creationModificationDate={contentDetails} >
            <ToastContainer></ToastContainer>
            <Row>
              <Col md="3">
                <FormGroup>
                  <Label> Customer Code </Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={contentDetails && contentDetails.customer_code}
                    name="customer_code"
                    disabled
                  />
                </FormGroup>
              </Col> 

              <Col md="3">
                <FormGroup>
                  <Label> Customer Name </Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={contentDetails && contentDetails.company_name}
                    name="company_name"
                  />
                </FormGroup>
              </Col>
              </Row>
              </ComponentCard>



          {/* Customer Details Form with Tabs */}
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
            Additional
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === '2' })}
                  onClick={() => {
                    toggle('2');
                  }}
                >
                  Customer Login Info
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === '3' })}
                  onClick={() => {
                    toggle('3');
                  }}
                >
                  Contact
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === '4' })}
                  onClick={() => {
                    toggle('4');
                  }}
                >
                  ShippingDetail
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === '5' })}
                  onClick={() => {
                    toggle('5');
                  }}
                >
                  SalesMan
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === '6' })}
                  onClick={() => {
                    toggle('6');
                  }}
                >
                  Transaction
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === '7' })}
                  onClick={() => {
                    toggle('7');
                  }}
                >
                  ProductDetails
                </NavLink>
              </NavItem>


            </Nav>
            <TabContent activeTab={activeTab} className="p-4">
              {/* Tab 1: Customer Details */}
              <TabPane tabId="1">
<ContentMoreDetails 
                  handleInputs={handleInputs}
                  contentDetails={contentDetails}
></ContentMoreDetails>
              </TabPane>

              {/* Tab 2: Additional */}
              <TabPane tabId="2">
                <CustomerLogin 
                                  handleInputs={handleInputs}
                                  contentDetails={contentDetails}
                ></CustomerLogin>
              </TabPane>
              <TabPane tabId="3">
                <ContactPerson></ContactPerson>
              </TabPane>
              <TabPane tabId="4">
                <CustomerShippingDetail></CustomerShippingDetail>
              </TabPane>

              <TabPane tabId="5">
                <CustomerSalesmen></CustomerSalesmen>
              </TabPane>
              <TabPane tabId="6">
                <Transaction></Transaction>
              </TabPane>
              <TabPane tabId="7">
                <CustomerProductDetails></CustomerProductDetails>
              </TabPane>


            </TabContent>
          </ComponentCard>
        </FormGroup>
      </Form>
    </>
  );
};
export default ContentUpdate;