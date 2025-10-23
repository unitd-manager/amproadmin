import React, { useEffect, useState } from 'react';
import * as Icon from 'react-feather';
import { Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Swal from 'sweetalert2';
import { Link, useParams } from 'react-router-dom';
import message from '../../components/Message';
import api from '../../constants/api';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import QRCodeModal from '../../components/ProductTable/QRCodeModal';

const SectionDetails = () => {
  const [filteredSection, setFilteredSection] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrProduct, setQrProduct] = useState(null);

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  const { id } = useParams();

  // Fetch product list
  const getSection = () => {
    setLoading(true);
    api
      .get('/product/getProductAdmin')
      .then((res) => {
        setFilteredSection(res.data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    getSection();
  }, [id]);

  // Delete single product
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

  // Bulk delete
  const handleBulkDelete = () => {
    if (selectedRows.length === 0) {
      Swal.fire('No product selected', 'Please select at least one product', 'info');
      return;
    }
    if (window.confirm('Are you sure you want to delete selected products?')) {
      selectedRows.forEach((row) => {
        api.post('/product/deleteProduct', { product_id: row.product_id });
      });
      getSection();
    }
  };

  // QR Code
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

  // Row selection toggle
  const handleRowSelect = (row) => {
    if (selectedRows.some((r) => r.product_id === row.product_id)) {
      setSelectedRows(selectedRows.filter((r) => r.product_id !== row.product_id));
    } else {
      setSelectedRows([...selectedRows, row]);
    }
  };

  return (
    <div className="MainDiv">
      <div className="pt-xs-25">
      <BreadCrumbs />
      <div className="d-flex justify-content-between align-items-center mb-2">
        <input
          type="text"
          placeholder="Search Product..."
          className="form-control w-25"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="d-flex align-items-center">
          <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
            <DropdownToggle color="primary" caret className="shadow-none">
              <Button color="primary" tag={Link} to="/ProductCLDetails" className="shadow-none">
                New Product
              </Button>
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={handleBulkDelete}>Bulk Delete</DropdownItem>
              <DropdownItem onClick={handleGenerateQR}>Generate QR Code</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      {/* Fixed Table (no horizontal scroll) */}
      <div className="sales-order-table">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Action</th>
              <th>Code</th>
              <th>Product Name</th>
              <th>Department</th>
              <th>Product Name2</th>
              <th>UOM</th>
              <th>Part No</th>
              <th>Unit Cost</th>
              <th>Retail Price</th>
              <th>Ecommerce Price</th>
              <th>Wholesale Price</th>
              <th>Carton Price</th>
              <th>Carton Qty</th>
              <th>Loose Qty</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {!loading && filteredSection.length > 0 ? (
              filteredSection
                .filter(
                  (item) =>
                    item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.product_code?.toString().includes(searchTerm)
                )
                .map((row) => (
                  <tr key={row.product_id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedRows.some((r) => r.product_id === row.product_id)}
                        onChange={() => handleRowSelect(row)}
                        className="me-2"
                      />
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
                    </td>
                    <td>{row.product_code}</td>
                    <td>{row.title}</td>
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
                <td colSpan="15" className="text-center">
                  {loading ? 'Loading...' : 'No products found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </div>

      <QRCodeModal isOpen={qrModalOpen} toggle={() => setQrModalOpen(false)} qrData={qrProduct} />
    </div>
  );
};

export default SectionDetails;
