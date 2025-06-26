import React, { useContext, useEffect, useState } from 'react';
import {
  Row,
  Col,
  Form,
  FormGroup,
  Button,
  Label,
  Input,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import classnames from 'classnames';
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
import ContentMoreDetails from '../../components/Customer/CustomerMoreDetails'; // Ensure this path is correct for your ContentMoreDetails
import CustomerLogin from '../../components/Customer/CustomerLogin';
import ContactPerson from '../../components/Customer/ContactPerson';
import CustomerShippingDetail from '../../components/Customer/ShippingDetail';
import CustomerSalesmen from '../../components/Customer/SalesMan';
import CustomerTransactions from '../../components/Customer/Module';
import CustomerProductDetails from '../../components/Customer/ProductDetails';

const ContentUpdate = () => {
  const [contentDetails, setContentDetails] = useState({});
  const { loggedInuser } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('1');

  const { id } = useParams();
  const navigate = useNavigate();

  // This handleInputs function is ALREADY CORRECT for switches.
  // It converts boolean 'checked' to 1 or 0 for your state.
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
        const fetchedData = res.data.data[0];
        if (fetchedData) {
          // KEY FIX: Normalize is_active to 0 or 1 upon fetching
          setContentDetails({
            ...fetchedData,
            is_active: (fetchedData.is_active === 1 || fetchedData.is_active === true) ? 1 : 0,
            // Ensure other fields that might be null/undefined are handled gracefully if needed
            // e.g., first_name: fetchedData.first_name || '',
          });
        } else {
            message('No content data found for this ID.', 'info');
            // Optionally, reset contentDetails to a default empty state
            setContentDetails({});
        }
      })
      .catch((error) => { // Added error parameter for logging
        message('Content Data Not Found', 'info');
        console.error("Error fetching content data:", error); // Log the actual error
      });
  };

  const editContentData = () => {
    // Added console logs for debugging
    console.log('Saving contentDetails:', contentDetails);

    if (
      contentDetails.first_name !== '' &&
      contentDetails.mobile !== '' &&
      contentDetails.email !== ''
    ) {
      const updatedDetails = {
        ...contentDetails,
        modification_date: creationdatetime,
        modified_by: loggedInuser.first_name,
      };

      api
        .post('/contact/editContact', updatedDetails)
        .then(() => {
          message('Record edited successfully', 'success');
        })
        .catch((error) => {
          message('Unable to edit record.', 'error');
          console.error('Edit error:', error);
        });
    } else {
      message('Please fill all required fields (Name, Mobile, Email)', 'warning');
    }
  };

  useEffect(() => {
    if (id) { // Only fetch if ID is present
      getContentById();
    }
  }, [id]); // Dependency array: re-fetch when 'id' changes

  // Function to toggle tabs
  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <>
      {/* Ensure contentDetails is defined before trying to access first_name */}
      <BreadCrumbs heading={contentDetails && contentDetails.first_name || 'Loading...'} />
      <Form>
        <FormGroup>
          <ComponentCardV2>
            <Row>
              <Col>
                <Button
                  color="primary"
                  onClick={() => {
                    editContentData();
                    // Using navigate with a delay can be problematic if the API call takes longer
                    // Consider navigating only after successful API response.
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
                    value={contentDetails.customer_code || ''} // Handle potential undefined
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
                    value={contentDetails.company_name || ''} // Handle potential undefined
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
              {/* Tab 1: Additional/More Details (your ContentMoreDetails) */}
              <TabPane tabId="1">
                <ContentMoreDetails
                  handleInputs={handleInputs}
                  contentDetails={contentDetails}
                />
              </TabPane>

              {/* Tab 2: Customer Login Info */}
              <TabPane tabId="2">
                <CustomerLogin
                  handleInputs={handleInputs}
                  contentDetails={contentDetails}
                />
              </TabPane>
              <TabPane tabId="3">
                {/* Assuming ContactPerson needs customerId or contentDetails */}
                <ContactPerson customerId={id} contentDetails={contentDetails} />
              </TabPane>
              <TabPane tabId="4">
                 {/* Assuming CustomerShippingDetail needs customerId or contentDetails */}
                <CustomerShippingDetail customerId={id} contentDetails={contentDetails} />
              </TabPane>

              <TabPane tabId="5">
                {/* Assuming CustomerSalesmen needs customerId or contentDetails */}
                <CustomerSalesmen customerId={id} contentDetails={contentDetails} />
              </TabPane>
              <TabPane tabId="6">
                <CustomerTransactions customerId={id} />
              </TabPane>

              <TabPane tabId="7">
                {/* Assuming CustomerProductDetails needs customerId or contentDetails */}
                <CustomerProductDetails customerId={id} contentDetails={contentDetails} />
              </TabPane>

            </TabContent>
          </ComponentCard>
        </FormGroup>
      </Form>
    </>
  );
};
export default ContentUpdate;
