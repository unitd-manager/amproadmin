import React, { useContext, useEffect, useState } from 'react';
import {
  Row,
  Col,
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
import message from '../../components/Message';
import api from '../../constants/api';
import ComponentCard from '../../components/ComponentCard';
import creationdatetime from '../../constants/creationdatetime';
import AppContext from '../../context/AppContext';
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

  const handleInputs = (e) => {
    const { name, value, type, checked } = e.target;
    setContentDetails({
      ...contentDetails,
      [name]:
        type === 'checkbox' || type === 'switch' ? (checked ? 1 : 0) : value,
    });
  };

  const getContentById = () => {
    api
      .post('/contact/getContactssById', { company_id: id })
      .then((res) => {
        const fetchedData = res.data.data[0];
        if (fetchedData) {
          setContentDetails({
            ...fetchedData,
            is_active:
              fetchedData.is_active === 1 || fetchedData.is_active === true
                ? 1
                : 0,
          });
        } else {
          message('No content data found for this ID.', 'info');
          setContentDetails({});
        }
      })
      .catch((error) => {
        message('Content Data Not Found', 'info');
        console.error('Error fetching content data:', error);
      });
  };

  const editContentData = () => {
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
    if (id) {
      getContentById();
    }
  }, [id]);

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  // ✅ Compact layout: scale down form, no scrollbars
  const formStyle = {
    height: '100vh',
    width: '100%',
    overflow: 'hidden',      // no scrollbars
    padding: '5px',
    transform: 'scale(0.75)', // shrink everything
    transformOrigin: 'top left'
  };

  return (
    <div style={formStyle}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="m-0">New/Edit Customer</h4>
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
          onClick={() => {
            editContentData();
            setTimeout(() => {
              navigate('/Customer');
            }, 1100);
          }}
          className="shadow"
          style={{
            padding: '8px 20px',
            fontSize: '14px',
            borderRadius: '4px',
          }}
        >
          Save
        </Button>
      </div>

      {/* First Panel - Basic Info */}
      <ComponentCard title="Customer Details" style={{ marginBottom: '5px' }}>
        <Row>
          <Col md="6">
            <FormGroup row>
              <Label sm="3">Customer Code</Label>
              <Col sm="7">
                <Input
                  type="text"
                  name="customer_code"
                  value={contentDetails.customer_code || ''}
                  disabled
                />
              </Col>
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup row>
              <Label sm="3">
                Customer Name <span className="text-danger">*</span>
              </Label>
              <Col sm="7">
                <Input
                  type="text"
                  name="company_name"
                  value={contentDetails.company_name || ''}
                  onChange={handleInputs}
                />
              </Col>
            </FormGroup>
          </Col>
        </Row>
      </ComponentCard>

      {/* Second Panel - Tabs */}
      <ComponentCard style={{ marginBottom: '5px' }}>
        <ToastContainer />
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '1' })}
              onClick={() => toggle('1')}
            >
              Additional
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
              Contact
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '4' })}
              onClick={() => toggle('4')}
            >
              ShippingDetail
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '5' })}
              onClick={() => toggle('5')}
            >
              SalesMan
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '6' })}
              onClick={() => toggle('6')}
            >
              Transaction
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '7' })}
              onClick={() => toggle('7')}
            >
              ProductDetails
            </NavLink>
          </NavItem>
        </Nav>

        <TabContent activeTab={activeTab} style={{ overflow: 'visible' }}>
          {/* Tab 1: Additional */}
          <TabPane tabId="1">
            <Row>
              <Col md="6">
                <FormGroup row>
                  <Label sm="3">Address 1</Label>
                  <Col sm="7">
                    <Input
                      type="text"
                      name="address1"
                      value={contentDetails.address1 || ''}
                      onChange={handleInputs}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm="3">City</Label>
                  <Col sm="7">
                    <Input
                      type="text"
                      name="city"
                      value={contentDetails.city || ''}
                      onChange={handleInputs}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm="3">State</Label>
                  <Col sm="7">
                    <Input
                      type="text"
                      name="state"
                      value={contentDetails.state || ''}
                      onChange={handleInputs}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm="3">Postal Code</Label>
                  <Col sm="7">
                    <Input
                      type="text"
                      name="postal_code"
                      value={contentDetails.postal_code || ''}
                      onChange={handleInputs}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm="3">Phone</Label>
                  <Col sm="7">
                    <Input
                      type="text"
                      name="phone"
                      value={contentDetails.phone || ''}
                      onChange={handleInputs}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm="3">Mobile</Label>
                  <Col sm="7">
                    <Input
                      type="text"
                      name="mobile"
                      value={contentDetails.mobile || ''}
                      onChange={handleInputs}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm="3">Email</Label>
                  <Col sm="7">
                    <Input
                      type="email"
                      name="email"
                      value={contentDetails.email || ''}
                      onChange={handleInputs}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm="3">Website</Label>
                  <Col sm="7">
                    <Input
                      type="text"
                      name="website"
                      value={contentDetails.website || ''}
                      onChange={handleInputs}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm="3">Fax</Label>
                  <Col sm="7">
                    <Input
                      type="text"
                      name="fax"
                      value={contentDetails.fax || ''}
                      onChange={handleInputs}
                    />
                  </Col>
                </FormGroup>
              </Col>

              <Col md="6">
                <FormGroup row>
                  <Label sm="3">Company Reg. No</Label>
                  <Col sm="7">
                    <Input
                      type="text"
                      name="company_reg_no"
                      value={contentDetails.company_reg_no || ''}
                      onChange={handleInputs}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm="3">Terms</Label>
                  <Col sm="7">
                    <Input
                      type="select"
                      name="terms"
                      value={contentDetails.terms || ''}
                      onChange={handleInputs}
                    >
                      <option value="">Select Terms</option>
                    </Input>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm="3">Credit Limit</Label>
                  <Col sm="7">
                    <Input
                      type="text"
                      name="credit_limit"
                      value={contentDetails.credit_limit || ''}
                      onChange={handleInputs}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm="3">Address 2</Label>
                  <Col sm="7">
                    <Input
                      type="text"
                      name="address2"
                      value={contentDetails.address2 || ''}
                      onChange={handleInputs}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm="3">Address 3</Label>
                  <Col sm="7">
                    <Input
                      type="text"
                      name="address3"
                      value={contentDetails.address3 || ''}
                      onChange={handleInputs}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm="3">Country</Label>
                  <Col sm="7">
                    <Input
                      type="text"
                      name="country"
                      value={contentDetails.country || ''}
                      onChange={handleInputs}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm="3">Remarks</Label>
                  <Col sm="7">
                    <Input
                      type="textarea"
                      name="remarks"
                      value={contentDetails.remarks || ''}
                      onChange={handleInputs}
                      rows="3"
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm="3">Cheque Print Name</Label>
                  <Col sm="7">
                    <Input
                      type="text"
                      name="cheque_print_name"
                      value={contentDetails.cheque_print_name || ''}
                      onChange={handleInputs}
                    />
                  </Col>
                </FormGroup>
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

          {/* Other Tabs */}
          <TabPane tabId="2">
            <CustomerLogin
              handleInputs={handleInputs}
              contentDetails={contentDetails}
            />
          </TabPane>
          <TabPane tabId="3">
            <ContactPerson contactId={id} contentDetails={contentDetails} />
          </TabPane>
          <TabPane tabId="4">
            <CustomerShippingDetail
              contactId={id}
              contentDetails={contentDetails}
            />
          </TabPane>
          <TabPane tabId="5">
            <CustomerSalesmen customerId={id} contentDetails={contentDetails} />
          </TabPane>
          <TabPane tabId="6">
            <CustomerTransactions customerId={id} />
          </TabPane>
          <TabPane tabId="7">
            <CustomerProductDetails
              customerId={id}
              contentDetails={contentDetails}
            />
          </TabPane>
        </TabContent>
      </ComponentCard>
    </div>
  );
};

export default ContentUpdate;
