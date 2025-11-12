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
import SupplierLogin from '../../components/Supplier/SupplierLogin';
import ContactPerson from '../../components/Supplier/ContactPerson';
//import SupplierShippingDetail from '../../components/Supplier/ShippingDetail';
//import SupplierSalesmen from '../../components/Supplier/SalesMan';
import SupplierTransactions from '../../components/Supplier/Module';
//import SupplierProductDetails from '../../components/Supplier/ProductDetails';

const SupplierDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // For edit mode

  const [activeTab, setActiveTab] = useState('1');
  const [contentDetails, setContentDetails] = useState({});
  const [supplierDetails, setCustomerDetails] = useState({
    supplier_code: '',
    company_name: '',
  });

  // Fetch details if editing
  useEffect(() => {
    if (id) {
      api
        .post('supplier/get-SupplierById', { supplier_id: id })
        .then((res) => {
          setCustomerDetails(res.data.data[0]);
          setContentDetails(res.data.data[0]);
        })
        .catch((err) => {
          console.error('Error fetching supplier:', err);
          message('Error fetching supplier details', 'error');
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

  // Insert supplier
  const insertCustomerData = async () => {
    if (!supplierDetails.company_name.trim() || !supplierDetails.supplier_code.trim()) {
      message('Please fill all required fields.', 'error');
      return;
    }

    try {
      const res = await api.post('supplier/insert-Supplier', supplierDetails);
      const insertedId = res.data.data.insertId;
      if (insertedId) {
        message('Supplier inserted successfully.', 'success');
        setTimeout(() => {
          navigate(`/SupplierEdit/${insertedId}`);
        }, 300);
      }
    } catch (error) {
      console.error('Insert error:', error);
      message('Failed to insert supplier. Try again.', 'error');
    }
  };

  // Edit supplier
  const editCustomerData = async () => {
    if (!supplierDetails.company_name.trim() || !supplierDetails.supplier_code.trim()) {
      message('Please fill all required fields.', 'error');
      return;
    }

    try {
      await api.post('supplier/edit-Supplier', supplierDetails);
      message('Supplier updated successfully.', 'success');
    } catch (error) {
      console.error('Update error:', error);
      message('Failed to update supplier. Try again.', 'error');
    }
  };

  // Cancel button
  const handleCancel = () => navigate('/Supplier');

  return (
    <div>
      <BreadCrumbs />
      <ToastContainer />
      <div style={{ minHeight: '100vh', padding: '5px', width: '100%' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="m-0">{id ? 'Edit Supplier' : 'New Supplier'}</h4>
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
                    <Label>Supplier Code</Label>
                    <Input
                      type="text"
                      onChange={handleInputs}
                      value={supplierDetails.supplier_code || ''}
                      name="supplier_code"
                    />
                  </Col>
                  <Col md="6">
                    <Label>
                      Supplier Name<span className="required">*</span>
                    </Label>
                    <Input
                      type="text"
                      onChange={handleInputs}
                      value={supplierDetails.company_name || ''}
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
              Supplier Login Info
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={classnames({ active: activeTab === '3' })} onClick={() => toggle('3')}>
              Contact
            </NavLink>
          </NavItem>
          {/* <NavItem>
            <NavLink className={classnames({ active: activeTab === '4' })} onClick={() => toggle('4')}>
              Shipping Detail
            </NavLink>
          </NavItem> */}
          {/* <NavItem>
            <NavLink className={classnames({ active: activeTab === '5' })} onClick={() => toggle('5')}>
              Salesman
            </NavLink>
          </NavItem> */}
          <NavItem>
            <NavLink className={classnames({ active: activeTab === '6' })} onClick={() => toggle('6')}>
              Transactions
            </NavLink>
          </NavItem>
          {/* <NavItem>
            <NavLink className={classnames({ active: activeTab === '7' })} onClick={() => toggle('7')}>
              Product Details
            </NavLink>
          </NavItem> */}
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
            <SupplierLogin handleInputs={handleInputs} contentDetails={contentDetails} />
          </TabPane>
          <TabPane tabId="3">
            <ContactPerson contactId={id} contentDetails={contentDetails} />
          </TabPane>
          {/* <TabPane tabId="4">
            <SupplierShippingDetail contactId={id} contentDetails={contentDetails} />
          </TabPane> */}
          {/* <TabPane tabId="5">
            <SupplierSalesmen supplierId={id} contentDetails={contentDetails} />
          </TabPane> */}
          <TabPane tabId="6">
            <SupplierTransactions supplierId={id} />
          </TabPane>
          {/* <TabPane tabId="7">
            <SupplierProductDetails supplierId={id} contentDetails={contentDetails} />
          </TabPane> */}
        </TabContent>
      </div>
    </div>
  );
};

export default SupplierDetails;
