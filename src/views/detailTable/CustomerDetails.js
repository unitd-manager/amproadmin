import React, { useState, useEffect } from 'react';
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
import { ToastContainer } from 'react-toastify';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import message from '../../components/Message';
import api from '../../constants/api';
import CustomerLogin from '../../components/Customer/CustomerLogin';
import ContactPerson from '../../components/Customer/ContactPerson';
import CustomerShippingDetail from '../../components/Customer/ShippingDetail';
import CustomerSalesmen from '../../components/Customer/SalesMan';
import CustomerTransactions from '../../components/Customer/Module';
import CustomerProductDetails from '../../components/Customer/ProductDetails';

const CustomerDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // For edit mode

  const [activeTab, setActiveTab] = useState('1');
  const [contentDetails, setContentDetails] = useState({});
  const [customerDetails, setCustomerDetails] = useState({
    customer_code: '',
    company_name: '',
  });

  // Fetch details if editing
  useEffect(() => {
    if (id) {
      api
        .post('company/getCompanyById', { company_id: id })
        .then((res) => {
          setCustomerDetails(res.data.data[0]);
          setContentDetails(res.data.data[0]);
        })
        .catch((err) => {
          console.error('Error fetching customer:', err);
          message('Error fetching customer details', 'error');
        });
    }
  }, [id]);

  // Toggle tabs
  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  // Handle form inputs
  const handleInputs = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' || type === 'switch' ? (checked ? 1 : 0) : value;

    setCustomerDetails((prev) => ({ ...prev, [name]: val }));
    setContentDetails((prev) => ({ ...prev, [name]: val }));
  };

  // Insert customer
  const insertCustomerData = async () => {
    if (!customerDetails.company_name.trim() || !customerDetails.customer_code.trim()) {
      message('Please fill all required fields.', 'error');
      return;
    }

    try {
      const res = await api.post('company/insertCompany', customerDetails);
      const insertedId = res.data.data.insertId;
      if (insertedId) {
        message('Customer inserted successfully.', 'success');
        setTimeout(() => {
          navigate(`/CustomerEdit/${insertedId}`);
        }, 300);
      }
    } catch (error) {
      console.error('Insert error:', error);
      message('Failed to insert customer. Try again.', 'error');
    }
  };

  // Edit customer
  const editCustomerData = async () => {
    if (!customerDetails.company_name.trim() || !customerDetails.customer_code.trim()) {
      message('Please fill all required fields.', 'error');
      return;
    }

    try {
      await api.post('company/editCompany', customerDetails);
      message('Customer updated successfully.', 'success');
    } catch (error) {
      console.error('Update error:', error);
      message('Failed to update customer. Try again.', 'error');
    }
  };

  // Cancel button
  const handleCancel = () => navigate('/Customer');

  return (
    <div>
      <BreadCrumbs />
      <ToastContainer />
      <div style={{ minHeight: '100vh', padding: '5px', width: '100%' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="m-0">{id ? 'Edit Customer' : 'New Customer'}</h4>
        </div>

        {/* Fixed Cancel Button */}
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            zIndex: 1000,
          }}
        >
          <Button color="secondary" onClick={handleCancel} className="shadow">
            Cancel
          </Button>
        </div>

        {/* Fixed Save Button */}
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
          }}
        >
          <Button
            color="primary"
            onClick={id ? editCustomerData : insertCustomerData}
            className="shadow"
          >
            Save
          </Button>
        </div>

        <Row>
          <Col md="10">
            <Form>
              <FormGroup>
                <Row>
                  <Col md="6">
                    <Label>Customer Code</Label>
                    <Input
                      type="text"
                      onChange={handleInputs}
                      value={customerDetails.customer_code || ''}
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
                      value={customerDetails.company_name || ''}
                      name="company_name"
                      required
                    />
                  </Col>
                </Row>
              </FormGroup>
            </Form>
          </Col>
        </Row>

        {/* Tabs */}
        <Nav tabs>
          <NavItem>
            <NavLink className={classnames({ active: activeTab === '1' })} onClick={() => toggle('1')}>
              Additional
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={classnames({ active: activeTab === '2' })} onClick={() => toggle('2')}>
              Customer Login Info
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={classnames({ active: activeTab === '3' })} onClick={() => toggle('3')}>
              Contact
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={classnames({ active: activeTab === '4' })} onClick={() => toggle('4')}>
              Shipping Detail
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={classnames({ active: activeTab === '5' })} onClick={() => toggle('5')}>
              Salesman
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={classnames({ active: activeTab === '6' })} onClick={() => toggle('6')}>
              Transactions
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={classnames({ active: activeTab === '7' })} onClick={() => toggle('7')}>
              Product Details
            </NavLink>
          </NavItem>
        </Nav>

        {/* Tab Content */}
        <TabContent activeTab={activeTab} style={{ overflow: 'visible' }}>
          <TabPane tabId="1">
            {/* Example: Additional fields */}
           <Row>
                         {/* Left Column */}
                         <Col md="6">
                           <FormGroup row><Label sm="3">Address 1</Label><Col sm="7"><Input type="text" name="address1" value={contentDetails.address1 || ''} onChange={handleInputs} /></Col></FormGroup>
                           <FormGroup row><Label sm="3">City</Label><Col sm="7"><Input type="text" name="city" value={contentDetails.city || ''} onChange={handleInputs} /></Col></FormGroup>
                           <FormGroup row><Label sm="3">State</Label><Col sm="7"><Input type="text" name="state" value={contentDetails.state || ''} onChange={handleInputs} /></Col></FormGroup>
                           <FormGroup row><Label sm="3">Postal Code</Label><Col sm="7"><Input type="text" name="postal_code" value={contentDetails.postal_code || ''} onChange={handleInputs} /></Col></FormGroup>
                           <FormGroup row><Label sm="3">Phone</Label><Col sm="7"><Input type="text" name="phone" value={contentDetails.phone || ''} onChange={handleInputs} /></Col></FormGroup>
                           <FormGroup row><Label sm="3">Mobile</Label><Col sm="7"><Input type="text" name="mobile" value={contentDetails.mobile || ''} onChange={handleInputs} /></Col></FormGroup>
                           <FormGroup row><Label sm="3">Email</Label><Col sm="7"><Input type="email" name="email" value={contentDetails.email || ''} onChange={handleInputs} /></Col></FormGroup>
                           <FormGroup row><Label sm="3">Website</Label><Col sm="7"><Input type="text" name="website" value={contentDetails.website || ''} onChange={handleInputs} /></Col></FormGroup>
                           <FormGroup row><Label sm="3">Fax</Label><Col sm="7"><Input type="text" name="fax" value={contentDetails.fax || ''} onChange={handleInputs} /></Col></FormGroup>
                         </Col>
           
                         {/* Right Column */}
                         <Col md="6">
                           <FormGroup row><Label sm="3">Company Reg. No</Label><Col sm="7"><Input type="text" name="company_reg_no" value={contentDetails.company_reg_no || ''} onChange={handleInputs} /></Col></FormGroup>
                           <FormGroup row><Label sm="3">Terms</Label><Col sm="7"><Input type="select" name="terms" value={contentDetails.terms || ''} onChange={handleInputs}><option value="">Select Terms</option></Input></Col></FormGroup>
                           <FormGroup row><Label sm="3">Credit Limit</Label><Col sm="7"><Input type="text" name="credit_limit" value={contentDetails.credit_limit || ''} onChange={handleInputs} /></Col></FormGroup>
                           <FormGroup row><Label sm="3">Address 2</Label><Col sm="7"><Input type="text" name="address2" value={contentDetails.address2 || ''} onChange={handleInputs} /></Col></FormGroup>
                           <FormGroup row><Label sm="3">Address 3</Label><Col sm="7"><Input type="text" name="address3" value={contentDetails.address3 || ''} onChange={handleInputs} /></Col></FormGroup>
                           <FormGroup row><Label sm="3">Country</Label><Col sm="7"><Input type="text" name="country" value={contentDetails.country || ''} onChange={handleInputs} /></Col></FormGroup>
                           <FormGroup row><Label sm="3">Remarks</Label><Col sm="7"><Input type="textarea" name="remarks" value={contentDetails.remarks || ''} onChange={handleInputs} rows="3" /></Col></FormGroup>
                           <FormGroup row><Label sm="3">Cheque Print Name</Label><Col sm="7"><Input type="text" name="cheque_print_name" value={contentDetails.cheque_print_name || ''} onChange={handleInputs} /></Col></FormGroup>
                           <FormGroup row>
                             <Label sm="3">Status</Label>
                             <Col sm="7" className="d-flex align-items-center">
                               <div className="form-check form-switch">
                                 <Input
                                   type="switch"
                                   name="is_active"
                                   checked={contentDetails.is_active === 1}
                                   onChange={handleInputs}
                                   className="form-check-input"
                                 />
                               </div>
                             </Col>
                           </FormGroup>
                         </Col>
                       </Row>
          </TabPane>

          <TabPane tabId="2">
            <CustomerLogin handleInputs={handleInputs} contentDetails={contentDetails} />
          </TabPane>
          <TabPane tabId="3">
            <ContactPerson contactId={id} contentDetails={contentDetails} />
          </TabPane>
          <TabPane tabId="4">
            <CustomerShippingDetail contactId={id} contentDetails={contentDetails} />
          </TabPane>
          <TabPane tabId="5">
            <CustomerSalesmen customerId={id} contentDetails={contentDetails} />
          </TabPane>
          <TabPane tabId="6">
            <CustomerTransactions customerId={id} />
          </TabPane>
          <TabPane tabId="7">
            <CustomerProductDetails customerId={id} contentDetails={contentDetails} />
          </TabPane>
        </TabContent>
      </div>
    </div>
  );
};

export default CustomerDetails;
