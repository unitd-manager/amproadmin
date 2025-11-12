import React, { useState, useEffect } from 'react';
import {
  Row, Col, Form, Label, Input, Button, Table, Nav, NavItem, NavLink, TabContent, TabPane,
} from 'reactstrap';
import classnames from 'classnames';
import { useParams, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import api from '../../constants/api';
import ComponentCard from '../../components/ComponentCard';
import message from '../../components/Message';

const BASE_IMAGE_URL = 'https://amproadmin.zaitunsoftsolutions.com/storage/uploads/';

const CatalogueAddProduct = () => {
  const [filters, setFilters] = useState({
    department: '',
    category: '',
    subcategory: '',
    brand: '',
    supplier: '',
    status: '',
  });

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
const handleProductSelect = async (selected, index) => {
  if (!selected) return;

  const currentRow = addRows[index];

  // 🔁 Same product reselected in same row
  if (currentRow.product_id === selected.value) {
    message('This product is already selected in this row', 'info');
    return;
  }

  // 🚫 Duplicate check in other rows
  const isDuplicate = addRows.some(
    (row, i) => row.product_id === selected.value && i !== index
  );

  if (isDuplicate) {
    // 🔔 Popup warning for duplicate selection
    message('This product is already selected in another row', 'warning');
    return;
  }

  try {
    // 📸 Optional: Fetch image or extra details if needed
    const imageUrl = await fetchProductImage(selected.value);

    // ✅ Update selected row
    const updatedRows = [...addRows];
    updatedRows[index] = {
      ...updatedRows[index],
      product_id: selected.value,
      product_code: selected.code || selected.product_code || '',
      title: selected.title || selected.label || '',
      image_url: imageUrl || '',
    };

    setAddRows(updatedRows);
  } catch (error) {
    console.error('Error fetching product image:', error);
    message('Failed to load product image', 'error');
  }
};

  const handleSortOrderChange = (index, value) => {
    const updatedRows = [...addRows];
    updatedRows[index].sort_order = value;
    setAddRows(updatedRows);
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

  const filterProducts = (filterParams) => {
    api.post('/product/getFilteredProducts', filterParams)
      .then((res) => {
        const formatted = res.data.data.map((item) => ({
          value: item.product_id,
          label: item.title,
          product_code: item.product_code,
          title: item.title,
        }));
        setProductOptions(formatted);
      })
      .catch((err) => {
        console.error('Failed to fetch filtered products', err);
        message('Failed to fetch filtered products', 'error');
      });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    filterProducts(updatedFilters);
  };

  
 const loadCatalogueProducts = (catalogueIdParam) => {
    api.post('/catalogue/getCatalogueProductsByCatalogueId', { catalogue_id: catalogueIdParam })
      .then((res) => setViewProducts(res.data.data || []))
      .catch(() => message('Unable to load catalogue products', 'error'));
  };
  const handleAddProductsSubmit = () => {
    const data = addRows.map(p => ({
      catalogue_id: catalogueId,
      product_id: p.product_id,
      sort_order: p.sort_order || 0,
      created_by: 'admin',
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
    api.post('/catalogue/getCatalogueById', { catalogue_id: id })
      .then((res) => {
        const [cat] = res.data.data;
        setCatalogueId(cat.catalogue_id);
        setCatalogueName(cat);
        loadCatalogueProducts(cat.catalogue_id);
      });
  };

  useEffect(() => {
    loadCatalogue();
    filterProducts(filters); // fetch default products list

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
                  <option value="">Select Department</option>
                  {departments.map(dep => (
                    <option key={dep.department_cli_id} value={dep.department_cli_id}>{dep.department_name}</option>
                  ))}
                </Input>
              </Col>
              <Col md="3">
                <Input type="select" name="category" onChange={handleFilterChange}>
                  <option value="">Select Category</option>
                  {categoryDropdown.map(cat => (
                    <option key={cat.category_id} value={cat.category_id}>{cat.category_title}</option>
                  ))}
                </Input>
              </Col>
              <Col md="3">
                <Input type="select" name="subcategory" onChange={handleFilterChange}>
                  <option value="">Select SubCategory</option>
                  {subCategoryDropdown.map(sub => (
                    <option key={sub.sub_category_id} value={sub.sub_category_id}>{sub.sub_category_title}</option>
                  ))}
                </Input>
              </Col>
              <Col md="3">
                <Input type="select" name="brand" onChange={handleFilterChange}>
                  <option value="">Select Brand</option>
                  {brands.map(b => (
                    <option key={b.brand_id} value={b.brand_id}>{b.brand_name}</option>
                  ))}
                </Input>
              </Col>
            </Row>

            <Row className="mt-2">
              <Col md="3">
                <Input type="select" name="supplier" onChange={handleFilterChange}>
                  <option value="">Select Supplier</option>
                  {supplierDropdown.map(s => (
                    <option key={s.supplier_id} value={s.supplier_id}>{s.company_name}</option>
                  ))}
                </Input>
              </Col>
              <Col md="3">
                <Input type="select" name="status" onChange={handleFilterChange} value={filters.status}>
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
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
                  <th>Product Title</th>
                  <th>Sort Order</th>
                  <th>Image</th>
                </tr>
              </thead>
              <tbody>
                {addRows.map((row, index) => (
                  <tr key={row.product_id || index}>
                    <td>
  {row.product_id ? (
    // ✅ Show product code once product title is selected
    <Input value={row.product_code || ""} readOnly />
  ) : (
    // ✅ Show dropdown initially to select product
    <Select
      options={productOptions}
      value={productOptions.find(p => p.value === row.product_id) || null}
      onChange={(selected) => handleProductSelect(selected, index)}
      getOptionLabel={(option) => option.title}  // show product title in dropdown
      getOptionValue={(option) => option.value}  // value = product_id
      placeholder="Select Product"
    />
  )}
</td>


{/* Product Code field (auto-filled when product selected) */}
<td>
  <Input
    type="text"
    value={row.title || ""}
    readOnly
  />
</td>
                    <td>
                      <Input
                        type="number"
                        value={row.sort_order}
                        onChange={(e) => handleSortOrderChange(index, e.target.value)}
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
                    <td><img src={`${BASE_IMAGE_URL}${p.file_name}`} alt="" width={50} /></td>
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

export default CatalogueAddProduct;
