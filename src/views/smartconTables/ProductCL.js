import React, { useEffect, useState } from 'react';
import * as Icon from 'react-feather';
import { Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Swal from 'sweetalert2';
import { Link, useParams } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import message from '../../components/Message';
import api from '../../constants/api';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import QRCodeModal from '../../components/ProductTable/QRCodeModal';

const SectionDetails = () => {
  const [section, setSection] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categoryDropdown, setCategoryDropdown] = useState([]);
  const [subCategoryDropdown, setSubCategoryDropdown] = useState([]);
  const [supplierDropdown, setSupplierDropdown] = useState([]);
  const [filteredSection, setFilteredSection] = useState([]);
  const [qrModalOpen, setQrModalOpen] = useState(false);
const [qrProduct, setQrProduct] = useState(null);

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  const { id } = useParams();

  const getSection = () => {
    setLoading(true);
    api
      .get('/product/getProductAdmin')
      .then((res) => {
        setSection(res.data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    api.get('/product/getDepartmentCli')
      .then((res) => setDepartments(res.data.data || []))
      .catch(() => setDepartments([]));

    api.get('/product/getBrand')
      .then((res) => setBrands(res.data.data || []))
      .catch(() => setBrands([]));
  }, []);

  const getCategory = () => {
    api.get('/product/getCategory')
      .then((res) => setCategoryDropdown(res.data.data))
      .catch(() => message('Unable to get categories', 'error'));
  };

  const getSubCategory = () => {
    api.get('/product/getSubCategory')
      .then((res) => setSubCategoryDropdown(res.data.data))
      .catch(() => message('Unable to get Subcategories', 'error'));
  };

  const getSupplier = () => {
    api.get('/supplier/getSupplier')
      .then((res) => setSupplierDropdown(res.data.data))
      .catch(() => message('Unable to get suppliers', 'error'));
  };

  useEffect(() => {
    getSection();
    getCategory();
    getSubCategory();
    getSupplier();
  }, [id]);

  const [filters, setFilters] = useState({
    productCode: '',
    productName: '',
    department: '',
    category: '',
    subCategory: '',
    supplier: '',
    brand: '',
    purchaseProduct: '',
    salesProduct: '',
    ecommerceProduct: '',
    posProduct: '',
    eprocurementProduct: '',
    status: '',
    styleFabric: '',
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    setFilteredSection(section);
  }, [section]);

  const filteredData = searchTerm
    ? section.filter(
        (item) =>
          item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.product_code?.toString().includes(searchTerm)
      )
    : filteredSection;

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchTerm('');
    setLoading(true);

    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(([ value]) => value !== '')
    );

    try {
      const res = await api.post('/product/getProductSearchAdmin', cleanedFilters);
      setFilteredSection(res.data.data);
    } catch (error) {
      message('Unable to fetch filtered products', 'error');
    }

    setLoading(false);
  };

  const handleClear = () => {
    const cleared = {
      productCode: '',
      productName: '',
      department: '',
      category: '',
      subCategory: '',
      supplier: '',
      brand: '',
      purchaseProduct: '',
      salesProduct: '',
      ecommerceProduct: '',
      posProduct: '',
      eprocurementProduct: '',
      status: '',
      styleFabric: '',
    };
    setFilters(cleared);
    setFilteredSection(section);
  };

  const handleDelete = (productId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .post('/product/deleteProduct', { product_id: productId })
          .then(() => {
            Swal.fire('Deleted!', 'Product has been deleted.', 'success');
            getSection();
          })
          .catch(() => {
            message('Unable to Delete Product', 'info');
          });
      }
    });
  };

  const handleBulkDelete = () => {
    if (window.confirm('Are you sure you want to delete selected products?')) {
      selectedRows.forEach((row) => {
        api.post('/product/deleteProduct', { product_id: row.product_id });
      });
      getSection();
    }
  };

  const handleGenerateQR = () => {
  if (selectedRows.length === 0) {
    Swal.fire('No product selected', 'Please select a product to generate QR Code', 'info');
    return;
  }
  if (selectedRows.length > 1) {
    Swal.fire('Multiple products selected', 'Please select only one product', 'warning');
    return;
  }

  const selected = selectedRows[0];
  setQrProduct({
    id: selected.product_id,
    code: selected.product_code,
    name: selected.title,
    uom: selected.unit,
    retail: selected.retail_price,
    wholesale: selected.wholesale_price,
    quantity: selected.qty_in_stock,
  });
  setQrModalOpen(true);
};


  const columns = [
    {
      name: 'Action',
      cell: (row) => (
        <>
          <Button
            color="danger"
            size="sm"
            onClick={() => handleDelete(row.product_id)}
            className="me-1"
          >
            <Icon.Trash2 size={14} />
          </Button>
          <Link to={`/ProductCLEdit/${row.product_id}/?tab=1`}>
            <Icon.Edit2 size={14} />
          </Link>
        </>
      ),
    },
    { name: 'Product Code', selector: (row) => row.product_code, sortable: true },
    { name: 'Product Name', selector: (row) => row.title, sortable: true },
    { name: 'Department', selector: (row) => row.department_name, sortable: true },
    { name: 'Product Name2', selector: (row) => row.alternative_product_name },
    { name: 'UOM', selector: (row) => row.unit },
    { name: 'Part No', selector: (row) => row.part_number },
    { name: 'Unit Cost', selector: (row) => row.purchase_unit_cost },
    { name: 'Retail Price', selector: (row) => row.retail_price },
    { name: 'Ecommerce Price', selector: (row) => row.ecommerce_price },
    { name: 'Wholesale Price', selector: (row) => row.wholesale_price },
    { name: 'Carton Price', selector: (row) => row.carton_price },
    { name: 'Carton Qty', selector: (row) => row.carton_qty },
    { name: 'Loose Qty', selector: (row) => row.loose_qty },
    { name: 'Quantity', selector: (row) => row.qty_in_stock },
  ];

  return (
    <div className="MainDiv">
      <BreadCrumbs />
      <div className="d-flex justify-content-between align-items-center mb-2">
        <input
          type="text"
          placeholder="Search Product..."
          className="form-control w-25"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="d-flex align-items-center">
          <Button
            color="light"
            className="me-2"
            onClick={() => setShowFilter((prev) => !prev)}
            title="Show Filters"
          >
            <Icon.Filter size={20} />
          </Button>
          <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
            <DropdownToggle color="primary" caret className="shadow-none">
              <Button color="primary" tag={Link} to="/ProductCLDetails" className="shadow-none">
                New Product
              </Button>
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={handleBulkDelete}>Bulk Delete</DropdownItem>
              <DropdownItem onClick={handleGenerateQR}>Generate QR COde</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      {showFilter && (
        <div className="mb-3 p-3 bg-light rounded border">
          <form onSubmit={handleSearch}>
            <div className="row g-2 align-items-end">
              {[
                { name: 'productCode', type: 'text', placeholder: 'Search Productcode/BarCode.' },
                { name: 'productName', type: 'text', placeholder: 'Product Name' },
                { name: 'styleFabric', type: 'text', placeholder: 'Style/Fabric' },
              ].map(({ name, type, placeholder }) => (
                <div key={name} className="col-md-2">
                  <input
                    type={type}
                    className="form-control"
                    name={name}
                    value={filters[name]}
                    onChange={handleFilterChange}
                    placeholder={placeholder}
                  />
                </div>
              ))}
              {[ // Dropdowns
                { name: 'department', label: 'Select Department', options: departments, key: 'department_cli_id', labelField: 'department_name' },
                { name: 'category', label: 'Select Category', options: categoryDropdown, key: 'category_id', labelField: 'category_title' },
                { name: 'subCategory', label: 'Select SubCategory', options: subCategoryDropdown, key: 'sub_category_id', labelField: 'sub_category_title' },
                { name: 'supplier', label: 'Select Supplier', options: supplierDropdown, key: 'supplier_id', labelField: 'company_name' },
                { name: 'brand', label: 'Select Brand', options: brands, key: 'brand_id', labelField: 'brand_name' },
              ].map(({ name, label, options, key, labelField }) => (
                <div key={name} className="col-md-2">
                  <select className="form-select" name={name} value={filters[name]} onChange={handleFilterChange}>
                    <option value="">{label}</option>
                    {options.map((item) => (
                      <option key={item[key]} value={item[key]}>
                        {item[labelField]}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              {[ // Yes/No selects
                { name: 'purchaseProduct', label: 'Purchase Product' },
                { name: 'salesProduct', label: 'Sales Product' },
                { name: 'ecommerceProduct', label: 'Ecommerce Product' },
                { name: 'posProduct', label: 'POS Product' },
                { name: 'eprocurementProduct', label: 'EProcurement Product' },
                { name: 'status', label: 'Status', options: [{ value: '1', label: 'Active' }, { value: '0', label: 'InActive' }] },
              ].map(({ name, label, options }) => (
                <div key={name} className="col-md-2">
                  <select className="form-select" name={name} value={filters[name]} onChange={handleFilterChange}>
                    <option value="">{`Select ${label}`}</option>
                    {(options || [{ value: '1', label: 'Yes' }, { value: '0', label: 'No' }]).map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              <div className="col-md-1">
                <Button color="primary" className="w-100" type="submit">Search</Button>
              </div>
              <div className="col-md-1">
                <Button color="primary" outline className="w-100" type="button" onClick={handleClear}>Clear</Button>
              </div>
            </div>
          </form>
        </div>
      )}

      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        selectableRows
        onSelectedRowsChange={({ selectedRows: rows }) => setSelectedRows(rows)}
        progressPending={loading}
        highlightOnHover
        responsive
        striped
      />
      <QRCodeModal isOpen={qrModalOpen} toggle={() => setQrModalOpen(false)} qrData={qrProduct} />

    </div>
  );
};

export default SectionDetails;
