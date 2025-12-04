import React, { useState, useEffect, useContext } from 'react';
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
import Select from 'react-select';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import message from '../../components/Message';
import api from '../../constants/api';
import creationdatetime from '../../constants/creationdatetime';
import AppContext from '../../context/AppContext';
import SupplierLogin from '../../components/Supplier/SupplierLogin';
import ContactPerson from '../../components/Supplier/ContactPerson';
//import SupplierShippingDetail from '../../components/Supplier/ShippingDetail';
//import SupplierSalesmen from '../../components/Supplier/SalesMan';
import SupplierTransactions from '../../components/Supplier/Module';
//import SupplierProductDetails from '../../components/Supplier/ProductDetails';

const SupplierDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // For edit mode
  const { loggedInuser } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState('1');
  const [contentDetails, setContentDetails] = useState({});
  const [supplierDetails, setCustomerDetails] = useState({
    supplier_code: '',
    company_name: '',
  });
  const [taxTypes, setTaxTypes] = useState([]);
  const [currencyTypes, setCurrencyTypes] = useState([]);
  const [areaTypes, setAreaTypes] = useState([]);
  const [priceGroups, setPriceGroups] = useState([]);
  const [contactTypes, setContactTypes] = useState([]);
  const [terms, setTerms] = useState([]);

  // Fetch details if editing
  useEffect(() => {
    if (id) {
      api
        .post('supplier/get-SupplierById', { supplier_id: id })
        .then((res) => {
          const fetched = res.data.data[0];
          if (fetched) {
            setCustomerDetails(fetched);
            setContentDetails({
              ...fetched,
              is_active: (fetched.is_active === 1 || fetched.is_active === true) ? 1 : 0,
            });
          }
        })
        .catch((err) => {
          console.error('Error fetching supplier:', err);
         // message('Error fetching supplier details', 'error');
        });
    }
  }, [id]);

  // Fetch tax types
  useEffect(() => {
    api
      .get('/valuelist/getTaxType')
      .then((res) => {
        const data = res.data && res.data.data ? res.data.data : [];
        setTaxTypes(data);
        if (contentDetails && contentDetails.tax_type) {
          const match = data.find(
            (t) =>
              String(t.valuelist_id) === String(contentDetails.tax_type) ||
              String(t.value) === String(contentDetails.tax_type) ||
              String(t.code) === String(contentDetails.tax_type)
          );
          if (match) {
            setContentDetails((prev) => ({ ...prev, tax_type: String(match.valuelist_id) }));
          }
        }
      })
      .catch(() => {});
  }, []);

  // Fetch currency types
  useEffect(() => {
    api
      .get('/valuelist/getCurrency')
      .then((res) => {
        const data = res.data && res.data.data ? res.data.data : [];
        setCurrencyTypes(data);
        if (contentDetails && contentDetails.currency) {
          const match = data.find(
            (t) =>
              String(t.valuelist_id) === String(contentDetails.currency) ||
              String(t.value) === String(contentDetails.currency) ||
              String(t.code) === String(contentDetails.currency)
          );
          if (match) {
            setContentDetails((prev) => ({ ...prev, currency: String(match.valuelist_id) }));
          }
        }
      })
      .catch(() => {});
  }, []);

  // Fetch area types
  useEffect(() => {
    api
      .get('/valuelist/getArea')
      .then((res) => {
        const data = res.data && res.data.data ? res.data.data : [];
        setAreaTypes(data);
        if (contentDetails && contentDetails.area) {
          const match = data.find(
            (t) =>
              String(t.valuelist_id) === String(contentDetails.area) ||
              String(t.value) === String(contentDetails.area) ||
              String(t.code) === String(contentDetails.area)
          );
          if (match) {
            setContentDetails((prev) => ({ ...prev, area: String(match.valuelist_id) }));
          }
        }
      })
      .catch(() => {});
  }, []);

  // Fetch terms
  useEffect(() => {
    api
      .get('/valuelist/getSupplierTerms')
      .then((res) => {
        const data = res.data && res.data.data ? res.data.data : [];
        setTerms(data);
        if (contentDetails && contentDetails.terms) {
          const match = data.find(
            (t) =>
              String(t.valuelist_id) === String(contentDetails.terms) ||
              String(t.value) === String(contentDetails.terms) ||
              String(t.code) === String(contentDetails.terms)
          );
          if (match) {
            setContentDetails((prev) => ({ ...prev, terms: String(match.valuelist_id) }));
          }
        }
      })
      .catch(() => {});
  }, []);

  // Fetch contact types
  useEffect(() => {
    api
      .get('/valuelist/getContactType')
      .then((res) => {
        const data = res.data && res.data.data ? res.data.data : [];
        setContactTypes(data);
        if (contentDetails && contentDetails.contact_type) {
          const match = data.find(
            (t) =>
              String(t.valuelist_id) === String(contentDetails.contact_type) ||
              String(t.value) === String(contentDetails.contact_type) ||
              String(t.code) === String(contentDetails.contact_type)
          );
          if (match) {
            setContentDetails((prev) => ({ ...prev, contact_type: String(match.valuelist_id) }));
          }
        }
      })
      .catch(() => {});
  }, []);

  // Fetch price groups
  useEffect(() => {
    api
      .get('/valuelist/getPriceGroup')
      .then((res) => {
        const data = res.data && res.data.data ? res.data.data : [];
        setPriceGroups(data);
        if (contentDetails && contentDetails.price_group) {
          const match = data.find(
            (t) =>
              String(t.valuelist_id) === String(contentDetails.price_group) ||
              String(t.value) === String(contentDetails.price_group) ||
              String(t.code) === String(contentDetails.price_group)
          );
          if (match) {
            setContentDetails((prev) => ({ ...prev, price_group: String(match.valuelist_id) }));
          }
        }
      })
      .catch(() => {});
  }, []);

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

  // Insert supplier (generates code if missing)
  const insertCustomerData = async () => {
    if (!contentDetails.company_name || contentDetails.company_name.trim() === '') {
      message('Please fill Supplier Name.', 'error');
      return;
    }
    const payload = {
      ...contentDetails,
      supplier_code: contentDetails.supplier_code || supplierDetails.supplier_code || '',
      creation_date: creationdatetime,
      created_by: loggedInuser && loggedInuser.first_name ? loggedInuser.first_name : '',
    };
    // const ensureCode = async () => {
    //   if (!payload.supplier_code || payload.supplier_code.trim() === '') {
    //     try {
    //       const resCode = await api.post('/commonApi/getCodeValues', { type: 'SupplierCode' });
    //       payload.supplier_code = resCode.data.data || '';
    //     } catch (e) {
    //       payload.supplier_code = '';
    //     }
    //   }
    // };
    try {
      // await ensureCode();
      const res = await api.post('supplier/insertCompanySupplier', payload);
      const insertedId = res.data && res.data.data ? res.data.data.insertId : null;
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

  // Edit supplier uses full contentDetails
  const editCustomerData = async () => {
    if (!contentDetails.company_name || !contentDetails.company_name.trim() || !contentDetails.supplier_code || !contentDetails.supplier_code.trim()) {
      message('Please fill all required fields.', 'error');
      return;
    }
    try {
      await api.post('supplier/editSuppliers', contentDetails);
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
                      value={contentDetails.supplier_code || ''}
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
                      value={contentDetails.company_name || ''}
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
            <Row>
              <Col md="6">
                <FormGroup row><Label sm="3">Address 1</Label><Col sm="7"><Input type="text" name="address1" value={contentDetails.address1 || ''} onChange={handleInputs} /></Col></FormGroup>
                <FormGroup row><Label sm="3">Address 2</Label><Col sm="7"><Input type="text" name="address2" value={contentDetails.address2 || ''} onChange={handleInputs} /></Col></FormGroup>
                <FormGroup row><Label sm="3">Address 3</Label><Col sm="7"><Input type="text" name="address_street" value={contentDetails.address_street || ''} onChange={handleInputs} /></Col></FormGroup>
                <FormGroup row><Label sm="3">Country</Label><Col sm="7"><Input type="text" name="address_country" value={contentDetails.address_country || ''} onChange={handleInputs} /></Col></FormGroup>
                <FormGroup row><Label sm="3">Postal Code</Label><Col sm="7"><Input type="text" name="address_po_code" value={contentDetails.address_po_code || ''} onChange={handleInputs} /></Col></FormGroup>
                <FormGroup row><Label sm="3">Phone</Label><Col sm="7"><Input type="text" name="phone" value={contentDetails.phone || ''} onChange={handleInputs} /></Col></FormGroup>
                <FormGroup row><Label sm="3">Mobile</Label><Col sm="7"><Input type="text" name="mobile" value={contentDetails.mobile || ''} onChange={handleInputs} /></Col></FormGroup>
                <FormGroup row><Label sm="3">Email</Label><Col sm="7"><Input type="email" name="email" value={contentDetails.email || ''} onChange={handleInputs} /></Col></FormGroup>
                <FormGroup row><Label sm="3">Website</Label><Col sm="7"><Input type="text" name="website" value={contentDetails.website || ''} onChange={handleInputs} /></Col></FormGroup>
                <FormGroup row><Label sm="3">Fax</Label><Col sm="7"><Input type="text" name="fax" value={contentDetails.fax || ''} onChange={handleInputs} /></Col></FormGroup>
              </Col>

              <Col md="6">
                <FormGroup row>
                  <Label sm="3">Tax</Label>
                  <Col sm="7">
                    <Input type="select" name="tax_type" value={contentDetails.tax_type || ''} onChange={handleInputs}>
                      <option value="">Select Tax</option>
                      {taxTypes && taxTypes.map((t) => (
                        <option key={t.valuelist_id || t.code || t.value} value={String(t.valuelist_id)}>
                          {t.value || t.code || t.key_text}
                        </option>
                      ))}
                    </Input>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm="3">Price Group</Label>
                  <Col sm="7">
                    <Input type="select" name="price_group" value={contentDetails.price_group || ''} onChange={handleInputs}>
                      <option value="">Select Price Group</option>
                      {priceGroups && priceGroups.map((p) => (
                        <option key={p.valuelist_id || p.code || p.value} value={String(p.valuelist_id)}>
                          {p.value || p.code || p.key_text}
                        </option>
                      ))}
                    </Input>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm="3">Contact Type</Label>
                  <Col sm="7">
                    <Input type="select" name="contact_type" value={contentDetails.contact_type || ''} onChange={handleInputs}>
                      <option value="">Select Contact Type</option>
                      {contactTypes && contactTypes.map((t) => (
                        <option key={t.valuelist_id || t.code || t.value} value={String(t.valuelist_id)}>
                          {t.value || t.code || t.key_text}
                        </option>
                      ))}
                    </Input>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm="3">Area</Label>
                  <Col sm="7">
                    <Select
                      isClearable
                      name="area"
                      options={(areaTypes || []).map((t) => ({ value: String(t.valuelist_id), label: t.value || t.code || t.key_text || String(t.valuelist_id) }))}
                      value={(areaTypes || []).map((t) => ({ value: String(t.valuelist_id), label: t.value || t.code || t.key_text || String(t.valuelist_id) })).find((o) => o.value === String(contentDetails.area)) || null}
                      onChange={(opt) => setContentDetails({ ...contentDetails, area: opt ? opt.value : '' })}
                      placeholder="Select Area"
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm="3">Currency</Label>
                  <Col sm="7">
                    <Input type="select" name="currency" value={contentDetails.currency || ''} onChange={handleInputs}>
                      <option value="">Select Currency</option>
                      {currencyTypes && currencyTypes.map((t) => (
                        <option key={t.valuelist_id || t.code || t.value} value={String(t.valuelist_id)}>
                          {t.value || t.code || t.key_text}
                        </option>
                      ))}
                    </Input>
                  </Col>
                </FormGroup>
                <FormGroup row><Label sm="3">Company Reg. No</Label><Col sm="7"><Input type="text" name="company_reg_no" value={contentDetails.company_reg_no || ''} onChange={handleInputs} /></Col></FormGroup>
                <FormGroup row>
                  <Label sm="3">Terms</Label>
                  <Col sm="7">
                    <Input type="select" name="terms" value={contentDetails.terms || ''} onChange={handleInputs}>
                      <option value="">Select Terms</option>
                      {terms && terms.map((p) => (
                        <option key={p.valuelist_id || p.code || p.value} value={String(p.valuelist_id)}>
                          {p.value || p.code || p.key_text}
                        </option>
                      ))}
                    </Input>
                  </Col>
                </FormGroup>
                <FormGroup row><Label sm="3">Credit Limit</Label><Col sm="7"><Input type="text" name="credit_limit" value={contentDetails.credit_limit || ''} onChange={handleInputs} /></Col></FormGroup>
                <FormGroup row><Label sm="3">Remarks</Label><Col sm="7"><Input type="textarea" name="remarks" value={contentDetails.remarks || ''} onChange={handleInputs} rows="3" /></Col></FormGroup>
                <FormGroup row><Label sm="3">Cheque Print Name</Label><Col sm="7"><Input type="text" name="cheque_print_name" value={contentDetails.cheque_print_name || ''} onChange={handleInputs} /></Col></FormGroup>
                <FormGroup row>
                  <Label sm="3">Status</Label>
                  <Col sm="7" className="d-flex align-items-center">
                    <div className="form-check form-switch">
                      <Input type="switch" name="is_active" checked={contentDetails.is_active === 1} onChange={handleInputs} className="form-check-input" />
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
