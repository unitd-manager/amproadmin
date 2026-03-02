import React, { useEffect, useState } from 'react';
import * as Icon from 'react-feather';
import { Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Swal from 'sweetalert2';
import { Link, useParams } from 'react-router-dom';
import message from '../../components/Message';
import api from '../../constants/api';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import QRCodeModal from '../../components/ProductTable/QRCodeModal';
import CommonTable from '../../components/CommonTable';
import './ProductCL.css';
 
const SectionDetails = () => {
  const [section, setSection] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  console.log("selectre", setSelectedRows)
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
  const [entriesPerPage, setEntriesPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  const { id } = useParams();

  const getSection = () => {
    setLoading(true);
    api
      .get('/product/getProducts')
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

  // Row selection toggle
  const handleRowSelect = (row) => {
    if (selectedRows.some((r) => r.product_id === row.product_id)) {
      setSelectedRows(selectedRows.filter((r) => r.product_id !== row.product_id));
    } else {
  setSelectedRows([...selectedRows, row]);
    }
  };

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
    console.log("filter", filteredData)

  const totalItems = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / entriesPerPage));
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredData, entriesPerPage]);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = Math.min(startIndex + entriesPerPage, totalItems);
  const paginatedData = filteredData.slice(startIndex, endIndex);
  const getPageNumbers = () => {
    const pages = [];
    const maxToShow = 5;
    if (totalPages <= maxToShow) {
      for (let i = 1; i <= totalPages; i += 1) pages.push(i);
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, currentPage + 2);
      if (start > 1) pages.push(1, '...');
      for (let i = start; i <= end; i += 1) pages.push(i);
      if (end < totalPages) pages.push('...', totalPages);
    }
    return pages;
  };

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
        <Button
          color="danger"
          size="sm"
          onClick={() => handleDelete(row.product_id)}
          className="me-1"
        >
          <Icon.Trash2 size={14} />
        </Button>
      ),
    },
    {
      name: (
        <input
          type="checkbox"
          checked={selectedRows.length > 0 && paginatedData.length > 0 && paginatedData.every((r) => selectedRows.some((s) => s.product_id === r.product_id))}
          onChange={() => {
            const allSelectedOnPage = paginatedData.every((r) => selectedRows.some((s) => s.product_id === r.product_id));
            if (allSelectedOnPage) {
              const idsOnPage = new Set(paginatedData.map((r) => r.product_id));
              setSelectedRows(selectedRows.filter((r) => !idsOnPage.has(r.product_id)));
            } else {
              const merged = [...selectedRows];
              paginatedData.forEach((r) => {
                if (!merged.some((m) => m.product_id === r.product_id)) merged.push(r);
              });
              setSelectedRows(merged);
            }
          }}
        />
      ),
      cell: (row) => (
        <input
          type="checkbox"
          checked={selectedRows.some((r) => r.product_id === row.product_id)}
          onChange={() => handleRowSelect(row)}
        />
      ),
    },
    { name: 'Code', selector: (row) => row.product_code, sortable: true },
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
      <div className="pt-xs-25">
        <BreadCrumbs />
        {/* First row: Title and New Product button */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">Product Management</h4>
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

        {/* Second row: Barcode/Product Name filters, Search/Clear buttons */}
        <div className="d-flex align-items-center mb-3 gap-2">
          <input
            type="text"
            placeholder="Search Productcode/BarCode."
            className="form-control me-2"
            style={{ width: 220 }}
            name="productCode"
            value={filters.productCode}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            placeholder="Product Name"
            className="form-control me-2"
            style={{ width: 220 }}
            name="productName"
            value={filters.productName}
            onChange={handleFilterChange}
          />
          <Button color="primary" className="me-2" onClick={handleSearch}>Search</Button>
          <Button color="primary" outline className="me-2" onClick={handleClear}>Clear</Button>
          <Button
            color="light"
            className="me-2"
            onClick={() => setShowFilter((prev) => !prev)}
            title="Show Filters"
          >
            <Icon.Filter size={20} />
          </Button>
        </div>

         {/* Third row: Show entries dropdown */}
        <div className="d-flex align-items-center mb-3">
          <label htmlFor="entriesDropdown" className="me-2 mb-0">
            Show
            <select
              id="entriesDropdown"
              className="form-select ms-2"
              style={{ width: 100 }}
              value={entriesPerPage}
              onChange={e => setEntriesPerPage(Number(e.target.value))}
            >
              {[10, 25, 50, 100].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </label>
          <span className="mb-0">entries</span>
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

      <div className="sales-order-table">
        <CommonTable
          loading={loading}
          title="Product List"
        >

          <thead>
            <tr>
              {columns.map((col) => (
                <td
                  key={col.name}
                    style={(() => {
                      switch (col.name) {
                        case 'Product Name':
                          return { minWidth: '400px', maxWidth: '600px', whiteSpace: 'normal', wordBreak: 'break-word' };
                        case 'Product Code':
                          return { minWidth: '120px', maxWidth: '160px', whiteSpace: 'normal', wordBreak: 'break-word' };
                        case 'Department':
                          return { minWidth: '120px', maxWidth: '160px', whiteSpace: 'normal', wordBreak: 'break-word' };
                        case 'Product Name2':
                          return { minWidth: '120px', maxWidth: '160px', whiteSpace: 'normal', wordBreak: 'break-word' };
                        case 'UOM':
                          return { minWidth: '80px', maxWidth: '100px', whiteSpace: 'normal', wordBreak: 'break-word' };
                        case 'Part No':
                          return { minWidth: '100px', maxWidth: '120px', whiteSpace: 'normal', wordBreak: 'break-word' };
                        case 'Unit Cost':
                          return { minWidth: '100px', maxWidth: '120px', whiteSpace: 'normal', wordBreak: 'break-word' };
                        case 'Retail Price':
                          return { minWidth: '100px', maxWidth: '120px', whiteSpace: 'normal', wordBreak: 'break-word' };
                        case 'Ecommerce Price':
                          return { minWidth: '100px', maxWidth: '120px', whiteSpace: 'normal', wordBreak: 'break-word' };
                        case 'Wholesale Price':
                          return { minWidth: '100px', maxWidth: '120px', whiteSpace: 'normal', wordBreak: 'break-word' };
                        case 'Carton Price':
                          return { minWidth: '100px', maxWidth: '120px', whiteSpace: 'normal', wordBreak: 'break-word' };
                        case 'Carton Qty':
                          return { minWidth: '80px', maxWidth: '100px', whiteSpace: 'normal', wordBreak: 'break-word' };
                        case 'Loose Qty':
                          return { minWidth: '80px', maxWidth: '100px', whiteSpace: 'normal', wordBreak: 'break-word' };
                        case 'Quantity':
                          return { minWidth: '100px', maxWidth: '120px', whiteSpace: 'normal', wordBreak: 'break-word' };
                        default:
                          return { minWidth: '80px', maxWidth: '120px', whiteSpace: 'normal', wordBreak: 'break-word' };
                      }
                    })()}
                >
                  {col.name}
                  <span style={{ marginLeft: 4, fontSize: 12 }}>
                    <span style={{ cursor: 'pointer' }}>&uarr;</span>
                    <span style={{ cursor: 'pointer', marginLeft: 2 }}>&darr;</span>
                  </span>
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData && paginatedData.length > 0 ? (
              paginatedData.map((row) => (
                <tr key={row.product_id}>
                  <td>
                    <Button
                      color="danger"
                      size="sm"
                      onClick={() => handleDelete(row.product_id)}
                      className="me-1"
                    >
                      <Icon.Trash2 size={14} />
                    </Button>
                    </td>
                    <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.some((r) => r.product_id === row.product_id)}
                      onChange={() => handleRowSelect(row)}
                      className="me-2"
                    />
                    </td>
                    
                  <td>{row.product_code}</td>
                  <td>
                    <Link to={`/ProductCLEdit/${row.product_id}/?tab=1`}>
                      {row.title}
                    </Link>
                  </td>
                  <td>{row.department_name}</td>
                  <td>{row.alternative_product_name}</td>
                  <td>{row.unit}</td>
                  <td>{row.part_number}</td>
                  <td>{row.purchase_unit_cost}</td>
                  <td>{row.retail_price}</td>
                  <td>{row.ecommerce_price}</td>
                  <td>{row.wholesale_price}</td>
                  <td>{row.carton_price}</td>
                  <td>{row.carton_qty}</td>
                  <td>{row.loose_qty}</td>
                  <td>{row.qty_in_stock}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="16" className="text-center">
                  {loading ? 'Loading...' : 'No products found'}
                </td>
              </tr>
            )}
          </tbody>
        </CommonTable>
        </div>
        <div className="d-flex justify-content-between align-items-center mt-2">
          <div>
            {totalItems > 0 ? `Showing ${startIndex + 1} to ${endIndex} of ${totalItems} entries` : 'Showing 0 to 0 of 0 entries'}
          </div>
          <div className="d-flex align-items-center gap-2">
            <Button color="light" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>First</Button>
            <Button color="light" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>Prev</Button>
           {getPageNumbers().map((p) => (
  typeof p === 'string' ? (
    <span key={`ellipsis-${p}`} style={{ padding: '0 6px' }}>{p}</span>
  ) : (
    <Button key={`page-${p}`} color={p === currentPage ? 'primary' : 'light'} size="sm" onClick={() => setCurrentPage(p)}>{p}</Button>
  )
))}
            <Button color="light" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>Next</Button>
            <Button color="light" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>Last</Button>
          </div>
        </div>
        <QRCodeModal isOpen={qrModalOpen} toggle={() => setQrModalOpen(false)} qrData={qrProduct} />
      </div>
    </div>
  );
};

export default SectionDetails;