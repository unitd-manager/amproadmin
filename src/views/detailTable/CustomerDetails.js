import React, { useState } from 'react';
import {
  Row,
  Col,
  Form,
  FormGroup,
  Button,
  Label,
  Input,
  // TabContent,
  // TabPane,
  // Nav,
  // NavItem,
  // NavLink,
} from 'reactstrap';
// import classnames from 'classnames';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ComponentCard from '../../components/ComponentCard';
import message from '../../components/Message';
import api from '../../constants/api'; // Ensure this path is correct
// import CustomerSalesmenInsert, { saveSalesmenToBackend } from '../../components/CustomerInsert/SalesManInsert';

// // Import child components
// import CustomerLogininsert from '../../components/CustomerInsert/CustomerLoginInsert';
// import ContactPersonInsert from '../../components/CustomerInsert/ContactPersonInsert';
// import CustomerShippingDetailInsert from '../../components/CustomerInsert/ShippingDetailInsert';
// import ContentMoreDetailsInsert from '../../components/CustomerInsert/CustomerMoreDetailsInsert'; // Corrected name to match earlier discussion

const CustomerDetails = () => {
  const navigate = useNavigate();

  const [customerDetails, setCustomerDetails] = useState({
    customer_code: '',
    company_name: '',
  });

  // const [associatedSalesmen, setAssociatedSalesmen] = useState([]);
  // const [associatedContactPersons, setAssociatedContactPersons] = useState([]);

  // const [activeTab, setActiveTab] = useState('1');

  const handleInputs = (e) => {
    setCustomerDetails({ ...customerDetails, [e.target.name]: e.target.value });
  };

  // const toggle = (tab) => {
  //   if (activeTab !== tab) setActiveTab(tab);
  // };

  const insertCustomerData = async () => {
    if (!customerDetails.company_name.trim() || !customerDetails.customer_code.trim()) {
      message('Please fill all required fields.', 'error');
      return;
    }

    try {
      const res = await api.post('company/insertCompany', customerDetails);
      const insertedContactId = res.data.data.insertId;
      if (insertedContactId) {
        message('Customer details inserted successfully.', 'success');
        setTimeout(() => {
          navigate(`/CustomerEdit/${insertedContactId}`);
        }, 300);
      } else {
        throw new Error('Failed to get inserted ID.');
      }
    } catch (error) {
      console.error('Error in customer insertion process:', error);
      message('Failed to insert customer. Please try again.', 'error');
    }
  };

  return (
    <div>
      <BreadCrumbs />
      <ToastContainer />
      <Row>
        <Col md="10">
          <ComponentCard title="New Customer Details">
            <Form>
              <FormGroup>
                <Row>
                  <Col md="6">
                    <Label>Customer Code</Label>
                    <Input
                      type="text"
                      onChange={handleInputs}
                      value={customerDetails.customer_code}
                      name="customer_code"
                    />
                  </Col>
                  <Col md="6">
                    <Label>
                      Customer Name<span className="required">*</span>
                    </Label>
                    <Input
                      type="text"
                      onChange={handleInputs}
                      value={customerDetails.company_name}
                      name="company_name"
                      required
                    />
                  </Col>
                </Row>
              </FormGroup>

              {/* <ComponentCard>
                <Nav tabs>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === '1' })}
                      onClick={() => toggle('1')}
                    >
                      More Details
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === '2' })}
                      onClick={() => toggle('2')}
                    >
                      Customer Login Info
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === '3' })}
                      onClick={() => toggle('3')}
                    >
                      Contact Person
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === '4' })}
                      onClick={() => toggle('4')}
                    >
                      Shipping Detail
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === '5' })}
                      onClick={() => toggle('5')}
                    >
                      Salesman
                    </NavLink>
                  </NavItem>
                </Nav>

                <TabContent activeTab={activeTab} className="p-4">
                  <TabPane tabId="1">
                    <ContentMoreDetailsInsert
                      handleInputs={handleInputs}
                      contentDetails={customerDetails} // Pass the entire state for display/prefill
                    />
                  </TabPane>

                  <TabPane tabId="2">
                    <CustomerLogininsert
                      handleInputs={handleInputs}
                      contentDetails={customerDetails} // Pass the entire state
                    />
                  </TabPane>

                  <TabPane tabId="3">
                    <ContactPersonInsert
                      setContactsData={setAssociatedContactPersons} // This prop updates the parent's state
                      // We don't pass handleInputs/contentDetails here, as ContactPersonInsert manages a list
                    />
                  </TabPane>

                  <TabPane tabId="4">
                    <CustomerShippingDetailInsert
                      handleInputs={handleInputs}
                      contentDetails={customerDetails} // Pass the entire state
                    />
                  </TabPane>

                  <TabPane tabId="5">
                    <CustomerSalesmenInsert
                      contactId={null} // Important: This is a new customer, so no contactId yet.
                                      // The component should adapt to this for new entries.
                      setSalesmenData={setAssociatedSalesmen} // This prop updates the parent's state
                    />
                  </TabPane>
                </TabContent>
              </ComponentCard> */}

              <FormGroup>
                <Row>
                  <div className="pt-3 mt-3 d-flex align-items-center gap-2">
                    <Button
                      className="shadow-none"
                      color="primary"
                      onClick={insertCustomerData}
                      disabled={!customerDetails.customer_code || !customerDetails.company_name}
                    >
                      Save
                    </Button>
                    <Button
                      onClick={() => navigate(-1)}
                      type="button"
                      className="btn btn-dark shadow-none"
                    >
                      Cancel
                    </Button>
                  </div>
                </Row>
              </FormGroup>
            </Form>
          </ComponentCard>
        </Col>
      </Row>
    </div>
  );
};

export default CustomerDetails;