import React, { useState } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ComponentCard from '../../components/ComponentCard';
import message from '../../components/Message';
import api from '../../constants/api'; // Ensure this path is correct
import CustomerSalesmenInsert, { saveSalesmenToBackend } from '../../components/CustomerInsert/SalesManInsert';

// Import child components
import CustomerLogininsert from '../../components/CustomerInsert/CustomerLoginInsert';
import ContactPersonInsert from '../../components/CustomerInsert/ContactPersonInsert';
import CustomerShippingDetailInsert from '../../components/CustomerInsert/ShippingDetailInsert';
import ContentMoreDetailsInsert from '../../components/CustomerInsert/CustomerMoreDetailsInsert'; // Corrected name to match earlier discussion

const CustomerDetails = () => {
  const navigate = useNavigate();

  // Unified state for all direct customer details, including those from sub-tabs.
  // Initialize ALL fields that will be sent to the 'contact' table
  // Match these keys to your database column names for a smooth API
  const [customerDetails, setCustomerDetails] = useState({
    company_name: '',        // ✔
    position: '',            // ✔
    email: '',               // ✔
    address_street: '',      // ✔
    address_area: '',        // ✔
    address_town: '',        // ✔
    address_state: '',       // ✔
    address_country: '',     // ✔
    address_po_code: '',     // ✔
    phone: '',               // ✔
    fax: '',                 // ✔
    sort_order: '',          // optional, default to '' or 0
    published: 0,            // ✔ checkbox (1/0)
    creation_date: '',       // auto or manually set if needed
    modification_date: '',   // optional
    protected: 0,            // optional
    pass_word: '',           // ✔ handle securely
    subscribe: 0,            // ✔ checkbox
    first_name: '',          // ✔
    last_name: '',           // ✔
    mobile: '',              // ✔
    religion: '',            // optional
    relationship: '',        // optional
    known_as_name: '',       // optional
    address_street1: '',     // secondary address
    address_town1: '',       // ✔
    address_country1: '',    // ✔
    flag: 0,                 // ✔ checkbox
    sex: '',                 // M/F/Other
    date_of_birth: '',       // DOB field
    random_no: '',           // for OTPs or temp values
    member_status: '',       // optional
    direct_tel: '',          // ✔
    member_type: '',         // optional
    address_flat: '',        // optional
    phone_direct: '',        // ✔
    company_id: '',          // optional if using foreign keys
    salutation: '',          // Mr./Ms./Dr.
    department: '',          // ✔
    created_by: '',          // optional - if tracking user
    modified_by: '',         // optional
    published_test: 0,       // optional
    company_address_street: '',
    company_address_flat: '',
    company_address_town: '',
    company_address_state: '',
    company_address_country: '',
    company_address_id: '',
    category: '',            // optional
    status: '',              // active/inactive etc.
    user_group_id: '',       // optional
    name: '',                // main contact name
    notes: '',               // ✔
    user_name: '',           // login
    address: '',             // full single-line if used
    login_count: '',         // optional
    message: '',             // optional
    contact_type: '',        // ✔
    credit_limit: '',        // ✔
  });
  
  // States for lists managed by child components that need to be sent after main contact is created
  const [associatedSalesmen, setAssociatedSalesmen] = useState([]);
  const [associatedContactPersons, setAssociatedContactPersons] = useState([]); // For ContactPersonInsert

  const [activeTab, setActiveTab] = useState('1');

  // Universal handler for simple input fields (text, email, number, select).
  // Also handles switches/checkboxes by converting boolean to 0 or 1.
  const handleInputs = (e) => {
    const { name, value, type, checked } = e.target;
    setCustomerDetails({
      ...customerDetails,
      [name]: (type === 'checkbox' || type === 'switch') ? (checked ? 1 : 0) : value,
    });
  };

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };


  // Insert Customer Data (Main Submission Function)
  const insertCustomerData = async () => {
    const detailsWithCode = { ...customerDetails };
    if (!detailsWithCode.company_name.trim()) {
      message('Please fill the Customer Name field.', 'error');
      return;
    }
    // Add more essential validations here, e.g., email format, required fields etc.
    // if (!customerDetails.email.trim()) {
    //   message('Please fill the Email field.', 'error');
    //   return;
    // }

    try {
      // 1. Insert the main customer (contact) details
      const contactResponse = await api.post('contact/insertContact', detailsWithCode);
      console.log('Insert contact API response:', contactResponse.data); // Debug log
      // Use the correct path for the inserted ID based on backend response
      const insertedContactId = contactResponse.data.data && contactResponse.data.data.insertId;

      if (!insertedContactId) {
        throw new Error(`Failed to retrieve new contact ID after main insertion. Full response: ${JSON.stringify(contactResponse.data)}`);
      }
      message('Customer details inserted successfully.', 'success');

      // 2. Insert associated salesmen using the correct helper
      if (associatedSalesmen.length > 0) {
        await saveSalesmenToBackend(insertedContactId, associatedSalesmen);
        message('Salesmen associated successfully.', 'info');
      }

      // 3. Insert associated contact persons
      // **IMPORTANT**: This assumes you have a backend endpoint like '/contact/insertContactPersonsBatch'
      // that can handle an array of contact person objects for a given contact_id.
      if (associatedContactPersons.length > 0) {
        try {
          await api.post('contact/contact/insertContactPersonsBatch', {
            contact_id: insertedContactId,
            contact_persons: associatedContactPersons,
          });
          message('Contact persons added successfully.', 'info');
        } catch (contactPersonErr) {
          console.error('Error inserting contact persons:', contactPersonErr);
          message('Failed to add contact persons.', 'warning');
        }
      }

      // Redirect to edit page after successful insertion and association
      setTimeout(() => {
        navigate(`/CustomerEdit/${insertedContactId}`);
      }, 300);

    } catch (error) {
      console.error('Error in customer insertion process:', error);
      // More robust error messaging
      let errorMessage = 'Failed to insert customer. Please try again.';
      if (error.response && error.response.data && error.response.data.msg) {
        errorMessage = `Failed to insert customer: ${error.response.data.msg}`;
      } else if (error.message) {
        errorMessage = `An unexpected error occurred: ${error.message}`;
      }
      message(errorMessage, 'error');
    }
  };

  return (
    <div>
      <BreadCrumbs />
      <ToastContainer />
      <Row>
        <Col md="10"> {/* Adjusted column size for better layout */}
          <ComponentCard title="New Customer Details">
            <Form>
              <FormGroup>
                <Row>
                  <Col md="6"> {/* Use smaller columns within the form group */}
                    <Label>Customer Code</Label>
                    <Input
                      type="text"
                      onChange={handleInputs}
                      value={customerDetails.customer_code || ''}
                      name="customer_code"
                    />
                  </Col>
                  <Col md="6">
                    <Label>Customer Name<span className="required">*</span></Label>
                    <Input
                      type="text"
                      onChange={handleInputs}
                      value={customerDetails.company_name || ''}
                      name="company_name"
                      required
                    />
                  </Col>
                </Row>
              </FormGroup>

              <ComponentCard>
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
                    {/* This component will manage its own list of contact persons and pass it up */}
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
                    {/* This component will manage its own list of salesmen and pass it up */}
                    <CustomerSalesmenInsert
                      contactId={null} // Important: This is a new customer, so no contactId yet.
                                      // The component should adapt to this for new entries.
                      setSalesmenData={setAssociatedSalesmen} // This prop updates the parent's state
                    />
                  </TabPane>
                </TabContent>
              </ComponentCard>

              <FormGroup>
                <Row>
                  <div className="pt-3 mt-3 d-flex align-items-center gap-2">
                    <Button
                      className="shadow-none"
                      color="primary"
                      onClick={insertCustomerData}
                      disabled={!customerDetails.customer_code}
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