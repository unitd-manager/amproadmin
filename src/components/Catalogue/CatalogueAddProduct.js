import React, { useState, useEffect } from 'react';
import {
  Row, Col, Form, Label, Input, Button, Table, Nav, NavItem, NavLink, TabContent, TabPane
} from 'reactstrap';
import classnames from 'classnames';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../constants/api';
import ComponentCard from '../../components/ComponentCard';
import message from '../../components/Message';


const BASE_IMAGE_URL = 'https://amproadmin.zaitunsoftsolutions.com/storage/uploads/';

const CatalogueEdit = () => {
  const [filters, setFilters] = useState({
    department: '', category: '', subcategory: '', brand: '', supplier: '', status: 'Active',
  });
  console.log('CatalogueEdit filters:', filters);   
  const [departments, setDepartments] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categoryDropdown, setCategoryDropdown] = useState([]);
  const [subCategoryDropdown, setSubCategoryDropdown] = useState([]);
  const [supplierDropdown, setSupplierDropdown] = useState([]);
  const [catalogueName, setCatalogueName] = useState('');
  const [catalogueId, setCatalogueId] = useState('');
  const [productOptions, setProductOptions] = useState([]);
  const [addRows, setAddRows] = useState([]);
  const [viewProducts, setViewProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('1');
  const navigate = useNavigate();
  const { id } = useParams();

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddRow = () => {
    setAddRows([...addRows, {
      product_id: '',
      sort_order: '',
      product_code: '',
      title: '',
      image_url: '',
    }]);
  };

  const fetchProductImage = async (productId) => {
    try {
      const response = await api.post('/media/getProductImage', {
        room_name: 'Product',
        record_id: productId,
      });
      const mediaData = response.data.data;
      if (mediaData?.length > 0) {
        return BASE_IMAGE_URL + mediaData[0].file_name;
      }
    } catch (err) {
      console.error('Image fetch error:', err);
    }
    return '';
  };

  const handleProductChange = async (index, selectedId) => {
    const product = productOptions.find((p) => p.product_id === parseInt(selectedId, 10));
    const imageUrl = await fetchProductImage(selectedId);
    const updatedRows = [...addRows];
    updatedRows[index] = {
      ...updatedRows[index],
      product_id: selectedId,
      product_code: product?.product_code || '',
      title: product?.title || '',
      image_url: imageUrl,
    };
    setAddRows(updatedRows);
  };

  const handleSortOrderChange = (index, value) => {
    const updatedRows = [...addRows];
    updatedRows[index].sort_order = value;
    setAddRows(updatedRows);
  };

  const loadCatalogueProducts = (catalogueIdParam) => {
    api.post(`/catalogue/getCatalogueProductsByCatalogueId`, { catalogue_id: catalogueIdParam })
      .then((res) => setViewProducts(res.data.data || []))
      .catch(() => message('Unable to load catalogue products', 'error'));
  };

  const handleAddProductsSubmit = () => {
    const data = addRows.map(p => ({
      catalogue_id: catalogueId,
      product_id: p.product_id,
      sort_order: p.sort_order || 0,
      created_by: 'admin'
    }));
    api.post('/catalogue/insertCatalogueProducts', data)
      .then(() => {
        message('Products added successfully', 'success');
        setAddRows([]);
        loadCatalogueProducts(catalogueId);
      })
      .catch(() => message('Error adding products', 'error'));
  };

  const loadCatalogue = () => {
    api.post(`/catalogue/getCatalogueById`, { catalogue_id: id })
      .then((res) => {
        const [cat] = res.data.data;
        setCatalogueId(cat.catalogue_id);
        setCatalogueName(cat);
        loadCatalogueProducts(cat.catalogue_id);
      });
  };

  useEffect(() => {
    loadCatalogue();
    api.get('/product/getAllProducts').then((res) => setProductOptions(res.data.data || []));
    api.get('/product/getDepartmentCli').then((res) => setDepartments(res.data.data || []));
    api.get('/product/getBrand').then((res) => setBrands(res.data.data || []));
    api.get('/product/getCategory').then((res) => setCategoryDropdown(res.data.data));
    api.get('/product/getSubCategory').then((res) => setSubCategoryDropdown(res.data.data));
    api.get('/supplier/getSupplier').then((res) => setSupplierDropdown(res.data.data));
  }, [id]);

  return (
    <ComponentCard title="New/Edit Catalogue Products">
      <Form>
        <Row>
          <Col md="6">
            <Label>Catalogue Code</Label>
            <Input value={catalogueName.catalogue_code || ''} disabled />
          </Col>
          <Col md="6">
            <Label>Catalogue Name</Label>
            <Input value={catalogueName.catalogue_name || ''} disabled />
          </Col>
        </Row>

        <Nav tabs className="mt-4">
          <NavItem>
            <NavLink className={classnames({ active: activeTab === '1' })} onClick={() => toggleTab('1')}>Add Product</NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={classnames({ active: activeTab === '2' })} onClick={() => toggleTab('2')}>View Product</NavLink>
          </NavItem>
        </Nav>

        <TabContent activeTab={activeTab} className="mt-3">
          <TabPane tabId="1">
            <Row>
              <Col md="3">
                <Input type="select" name="department" onChange={handleFilterChange}>
                  <option>Select Department</option>
                  {departments.map(dep => (
                    <option key={dep.department_cli_id} value={dep.department_cli_id}>{dep.department_name}</option>
                  ))}
                </Input>
              </Col>
              <Col md="3">
                <Input type="select" name="category" onChange={handleFilterChange}>
                  <option>Select Category</option>
                  {categoryDropdown.map(cat => (
                    <option key={cat.category_id} value={cat.category_id}>{cat.category_title}</option>
                  ))}
                </Input>
              </Col>
              <Col md="3">
                <Input type="select" name="subcategory" onChange={handleFilterChange}>
                  <option>Select SubCategory</option>
                  {subCategoryDropdown.map(sub => (
                    <option key={sub.sub_category_id} value={sub.sub_category_id}>{sub.sub_category_title}</option>
                  ))}
                </Input>
              </Col>
              <Col md="3">
                <Input type="select" name="brand" onChange={handleFilterChange}>
                  <option>Select Brand</option>
                  {brands.map(b => (
                    <option key={b.brand_id} value={b.brand_id}>{b.brand_name}</option>
                  ))}
                </Input>
              </Col>
            </Row>

            <Row className="mt-2">
              <Col md="3">
                <Input type="select" name="supplier" onChange={handleFilterChange}>
                  <option>Select Supplier</option>
                  {supplierDropdown.map(s => (
                    <option key={s.supplier_id} value={s.supplier_id}>{s.company_name}</option>
                  ))}
                </Input>
              </Col>
              <Col md="3">
                <Input type="select" name="status" onChange={handleFilterChange}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Input>
              </Col>
              <Col md="3">
                <Button color="primary" onClick={handleAddRow}><i className="bi bi-plus-circle" /> Add Row</Button>
              </Col>
            </Row>

            <Table bordered className="mt-3">
              <thead>
                <tr>
                  <th>Product Code</th>
                  <th>Product Name</th>
                  <th>Sort Order</th>
                  <th>Image</th>
                </tr>
              </thead>
              <tbody>
                {addRows.map((row) => (
                  <tr key={row.product_id || Math.random()}>
                    <td>
                      <Input
                        type="select"
                        name= "product_code"
                        value={row.product_id}
                        onChange={(e) => handleProductChange(addRows.indexOf(row), e.target.value)}
                      >
                        <option value="">Select Product</option>
                        {productOptions.map(p => (
                          <option key={p.product_id} value={p.product_id}>
                            {p.product_code} - {p.title}
                          </option>
                        ))}
                      </Input>
                    </td>
                    <td>{row.title}</td>
                    <td>
                      <Input
                        type="number"
                        value={row.sort_order}
                        onChange={(e) => handleSortOrderChange(addRows.indexOf(row), e.target.value)}
                      />
                    </td>
                    <td><img src={row.image_url} alt="" width={50} /></td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Button color="success" onClick={handleAddProductsSubmit}>Save</Button>
          </TabPane>

          <TabPane tabId="2">
            <Table bordered>
              <thead>
                <tr>
                  <th>Product Code</th>
                  <th>Product Name</th>
                  <th>Sort Order</th>
                  <th>Image</th>
                </tr>
              </thead>
              <tbody>
                {viewProducts.map((p) => (
                  <tr key={p.product_id}>
                    <td>{p.product_code}</td>
                    <td>{p.title}</td>
                    <td>{p.sort_order}</td>
                   <img src={`${BASE_IMAGE_URL}${p.file_name}`} alt="" width={50}></img>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TabPane>
        </TabContent>

        <Button className="mt-3" color="danger" onClick={() => navigate(-1)}>Cancel</Button>
      </Form>
    </ComponentCard>
  );
};

export default CatalogueEdit;
