import React, { useContext, useState, useEffect } from 'react';
import {
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ComponentCard from '../../components/ComponentCard';
import message from '../../components/Message';
import api from '../../constants/api';
import creationdatetime from '../../constants/creationdatetime';
import AppContext from '../../context/AppContext';

const ProductDetails = () => {
  const navigate = useNavigate();
  const { loggedInuser } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('1');

  // Form data
  const [productDetails, setProductDetails] = useState({
    product_code: '',
    title: '',
    department_id: '',
    category_id: '',
    sub_category_id: '',
    brand_id: '',
    supplier_id: '',
    product_type: '',
    tax_percentage: '',
    display_order: '',
    purchase_uom: '',
    sales_uom: '',
    pcs_per_carton: '',
    weight: '',
    purchase_unit_cost: '',
    operation_cost: '',
    retail_price: '',
    min_retail_price: '',
    wholesale_price: '',
    min_wholesale_price: '',
    carton_price: '',
    min_car_price: '',
    style_fabric: '',
    model_no: '',
    carton_weight: '',
    m3_per_carton: '',
    bin: '',
    remarks: '',
    show_on_purchase: true,
    show_on_sales: true,
    is_active: true,
    eprocurement: false,
    ecommerce: false,
    show_on_pos: false,
    creation_date: moment(),
  });

  const [dropdownData, setDropdownData] = useState({
    departments: [],
    categories: [],
    subCategories: [],
    brands: [],
    suppliers: [],
    uoms: [],
    productTypes: [],
  });

  // Handle change
  const handleInputs = (e) => {
    const { name, value, type, checked } = e.target;
    setProductDetails({
      ...productDetails,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Fetch dropdown data
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [dept, cat, subCat, brand, supplier, uom, prodType] = await Promise.all([
          api.get('/common/getDepartments'),
          api.get('/common/getCategories'),
          api.get('/common/getSubCategories'),
          api.get('/common/getBrands'),
          api.get('/common/getSuppliers'),
          api.get('/common/getUOMs'),
          api.get('/common/getProductTypes'),
        ]);

        setDropdownData({
          departments: dept.data.data || [],
          categories: cat.data.data || [],
          subCategories: subCat.data.data || [],
          brands: brand.data.data || [],
          suppliers: supplier.data.data || [],
          uoms: uom.data.data || [],
          productTypes: prodType.data.data || [],
        });
      } catch (err) {
        console.error('Error fetching dropdown data:', err);
      }
    };

    fetchDropdowns();
  }, []);

  // Auto-generate product code
  useEffect(() => {
    api
      .post('/commonApi/getCodeValues', { type: 'product' })
      .then((res) => {
        const code = res.data.data;
        setProductDetails((prev) => ({ ...prev, product_code: code }));
      })
      .catch(() => setProductDetails((prev) => ({ ...prev, product_code: '' })));
  }, []);

  // Save data
  const insertProductData = async () => {
    try {
      if (!productDetails.title || !productDetails.department_id || !productDetails.category_id) {
        message('Please fill all required fields', 'warning');
        return;
      }

      const payload = {
        ...productDetails,
        created_by: loggedInuser.first_name,
        creation_date: creationdatetime,
      };

      const res = await api.post('/product/insertProduct', payload);
      const { insertId } = res.data.data;

      message('Product inserted successfully.', 'success');

      // Create inventory record
      const inv = await api.post('/commonApi/getCodeValues', { type: 'inventory' });
      const inventoryCode = inv.data.data;

      await api.post('/inventory/insertinventory', {
        product_id: insertId,
        inventory_code: inventoryCode,
        created_by: loggedInuser.first_name,
        creation_date: creationdatetime,
      });

      message('Inventory created successfully.', 'success');
      navigate(`/ProductEdit/${insertId}?tab=1`);
    } catch (err) {
      console.error('Error inserting product:', err);
      message('Unable to insert product.', 'error');
    }
  };

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <div>
      <BreadCrumbs />
      <ToastContainer />
      <ComponentCard>
        <Form>
          <Row>
            <Col md="6">
              <FormGroup row>
                <Label sm="4">Product Code</Label>
                <Col sm="8">
                  <Input value={productDetails.product_code} readOnly />
                </Col>
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup row>
                <Label sm="4">
                  Product Name <span className="required">*</span>
                </Label>
                <Col sm="8">
                  <Input name="title" value={productDetails.title} onChange={handleInputs} />
                </Col>
              </FormGroup>
            </Col>
          </Row>
          <Nav tabs>
            <NavItem>
              <NavLink
                className={activeTab === '1' ? 'active' : ''}
                onClick={() => {
                  toggle('1');
                }}
              >
                Details
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <Row className="mt-3">
                {/* Dynamic Dropdowns */}
                <Col md="6">
                  <FormGroup row>
                    <Label sm="4">Department *</Label>
                    <Col sm="8">
                      <Input
                        type="select"
                        name="department_id"
                        value={productDetails.department_id}
                        onChange={handleInputs}
                      >
                        <option value="">Select...</option>
                        {dropdownData.departments.map((d) => (
                          <option key={d.department_id} value={d.department_id}>
                            {d.department_name}
                          </option>
                        ))}
                      </Input>
                    </Col>
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup row>
                    <Label sm="4">Category *</Label>
                    <Col sm="8">
                      <Input
                        type="select"
                        name="category_id"
                        value={productDetails.category_id}
                        onChange={handleInputs}
                      >
                        <option value="">Select...</option>
                        {dropdownData.categories.map((c) => (
                          <option key={c.category_id} value={c.category_id}>
                            {c.category_name}
                          </option>
                        ))}
                      </Input>
                    </Col>
                  </FormGroup>
                </Col>

                <Col md="6">
                  <FormGroup row>
                    <Label sm="4">Sub Category</Label>
                    <Col sm="8">
                      <Input
                        type="select"
                        name="sub_category_id"
                        value={productDetails.sub_category_id}
                        onChange={handleInputs}
                      >
                        <option value="">Select...</option>
                        {dropdownData.subCategories.map((s) => (
                          <option key={s.sub_category_id} value={s.sub_category_id}>
                            {s.sub_category_name}
                          </option>
                        ))}
                      </Input>
                    </Col>
                  </FormGroup>
                </Col>

                <Col md="6">
                  <FormGroup row>
                    <Label sm="4">Brand *</Label>
                    <Col sm="8">
                      <Input
                        type="select"
                        name="brand_id"
                        value={productDetails.brand_id}
                        onChange={handleInputs}
                      >
                        <option value="">Select...</option>
                        {dropdownData.brands.map((b) => (
                          <option key={b.brand_id} value={b.brand_id}>
                            {b.brand_name}
                          </option>
                        ))}
                      </Input>
                    </Col>
                  </FormGroup>
                </Col>

                <Col md="6">
                  <FormGroup row>
                    <Label sm="4">Supplier *</Label>
                    <Col sm="8">
                      <Input
                        type="select"
                        name="supplier_id"
                        value={productDetails.supplier_id}
                        onChange={handleInputs}
                      >
                        <option value="">Select...</option>
                        {dropdownData.suppliers.map((s) => (
                          <option key={s.contact_id} value={s.contact_id}>
                            {s.company_name}
                          </option>
                        ))}
                      </Input>
                    </Col>
                  </FormGroup>
                </Col>

                <Col md="6">
                  <FormGroup row>
                    <Label sm="4">Product Type</Label>
                    <Col sm="8">
                      <Input
                        type="select"
                        name="product_type"
                        value={productDetails.product_type}
                        onChange={handleInputs}
                      >
                        <option value="">Select...</option>
                        {dropdownData.productTypes.map((t) => (
                          <option key={t.id} value={t.type_name}>
                            {t.type_name}
                          </option>
                        ))}
                      </Input>
                    </Col>
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup row>
                    <Label sm="4">Purchase UOM</Label>
                    <Col sm="8">
                      <Input
                        type="select"
                        name="purchase_uom"
                        value={productDetails.purchase_uom}
                        onChange={handleInputs}
                      >
                        <option value="">Select...</option>
                        {(dropdownData.uoms || []).map((u) => (
                          <option key={u.uom_id} value={u.uom_name}>
                            {u.uom_name}
                          </option>
                        ))}
                      </Input>
                    </Col>
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup row>
                    <Label sm="4">Sales UOM</Label>
                    <Col sm="8">
                      <Input
                        type="select"
                        name="sales_uom"
                        value={productDetails.sales_uom}
                        onChange={handleInputs}
                      >
                        <option value="">Select...</option>
                        {(dropdownData.uoms || []).map((u) => (
                          <option key={u.uom_id} value={u.uom_name}>
                            {u.uom_name}
                          </option>
                        ))}
                      </Input>
                    </Col>
                  </FormGroup>
                </Col>

                {/* Numeric Fields */}
                {[
                  ['tax_percentage', 'Tax Percentage'],
                  ['display_order', 'Display Order'],
                  ['pcs_per_carton', 'Pcs Per Carton'],
                  ['weight', 'Weight'],
                  ['purchase_unit_cost', 'Purchase Unit Cost'],
                  ['operation_cost', 'Operation Cost'],
                  ['retail_price', 'Retail Price'],
                  ['min_retail_price', 'Min Retail Price'],
                  ['wholesale_price', 'Wholesale Price'],
                  ['min_wholesale_price', 'Min Wholesale Price'],
                  ['carton_price', 'Carton Price'],
                  ['min_car_price', 'Min Car Price'],
                ].map(([key, label]) => (
                  <Col md="6" key={key}>
                    <FormGroup row>
                      <Label sm="4">{label}</Label>
                      <Col sm="8">
                        <Input
                          type="number"
                          name={key}
                          value={productDetails[key]}
                          onChange={handleInputs}
                        />
                      </Col>
                    </FormGroup>
                  </Col>
                ))}

                {/* Text fields */}
                {[
                  ['style_fabric', 'Style/Fabric'],
                  ['model_no', 'Model No'],
                  ['bin', 'Bin'],
                  ['remarks', 'Remarks / Other Name'],
                ].map(([key, label]) => (
                  <Col md="6" key={key}>
                    <FormGroup row>
                      <Label sm="4">{label}</Label>
                      <Col sm="8">
                        <Input name={key} value={productDetails[key]} onChange={handleInputs} />
                      </Col>
                    </FormGroup>
                  </Col>
                ))}

                {/* Toggles */}
                <Col md="12">
                  <Row>
                    {[
                      ['show_on_purchase', 'Show On Purchase'],
                      ['show_on_sales', 'Show On Sales'],
                      ['is_active', 'Is Active'],
                      ['eprocurement', 'EProcurement'],
                      ['ecommerce', 'ECommerce'],
                      ['show_on_pos', 'Show On POS'],
                    ].map(([key, label]) => (
                      <Col md="4" key={key}>
                        <FormGroup>
                          <Row>
                            <Label sm="8">{label}</Label>
                            <Col sm="4">
                              <Input
                                type="checkbox"
                                name={key}
                                checked={productDetails[key]}
                                onChange={handleInputs}
                              />
                            </Col>
                          </Row>
                        </FormGroup>
                      </Col>
                    ))}
                  </Row>
                </Col>

                {/* Upload */}
                <Col md="6">
                  <FormGroup row>
                    <Label sm="4">Upload (500x500)</Label>
                    <Col sm="8">
                      <Input type="file" name="image" />
                    </Col>
                  </FormGroup>
                </Col>
              </Row>
            </TabPane>
          </TabContent>

          <div className="d-flex gap-2 mt-3">
            <Button color="primary" onClick={insertProductData}>
              Save
            </Button>
            <Button
              color="dark"
              onClick={(e) => {
                if (window.confirm('Cancel without saving?')) navigate('/Product');
                else e.preventDefault();
              }}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </ComponentCard>
    </div>
  );
};

export default ProductDetails;