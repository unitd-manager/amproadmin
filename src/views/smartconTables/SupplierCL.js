import React, { useEffect, useState } from 'react';
import * as Icon from 'react-feather';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'; // Combine reactstrap imports
import { Link, useParams } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { FaCheck } from 'react-icons/fa';

import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../../constants/api';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import CommonTable from '../../components/CommonTable';

const SupplierCL = () => {
  //Const Variables
  const [supplier, setSupplier] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('Active');
  const [searchName, setSearchName] = useState(''); // New state for supplier name filter
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const { id } = useParams();

  // get supplier
  const getSupplier = () => {
    setLoading(true);
    api
      .get('/supplier/getSupplier')
      .then((res) => {
        let filteredSuppliers = res.data.data;
        if (filterStatus !== 'All') {
          filteredSuppliers = filteredSuppliers.filter((s) => s.status === filterStatus);
        }
        if (searchName.trim() !== '') {
          filteredSuppliers = filteredSuppliers.filter((s) =>
            s.company_name && s.company_name.toLowerCase().includes(searchName.toLowerCase())
          );
        }
        setSupplier(filteredSuppliers);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getSupplier();
    // eslint-disable-next-line
  }, [id, filterStatus, searchName]); // Add searchName to dependency array

  // Delete supplier handler
  const handleDelete = (supplierId) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      setLoading(true);
      api
        .post('/supplier/deleteSupplier', { supplier_id: supplierId })
        .then(() => {
          setSupplier((prev) => prev.filter((s) => s.supplier_id !== supplierId));
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  };

  // Activate supplier handler
  const handleActivate = (supplierRow) => {
    setSelectedSupplier(supplierRow);
    setShowActivateModal(true);
  }; 
       
  const confirmActivate = () => {
    if (!selectedSupplier) return;
    setLoading(true);
    api
      .post('/supplier/activateSupplier', { supplier_id: selectedSupplier.supplier_id })
      .then(() => {
        setShowActivateModal(false);
        setSelectedSupplier(null);
        getSupplier();
      })
      .catch(() => {
        setLoading(false);
        setShowActivateModal(false);
        setSelectedSupplier(null);
      });
  };

  // DataTable columns
  const baseColumns = [
    {
      name: '#',
      cell: (row, index) => index + 1,
      width: '60px',
      sortable: false,
    },
    {
      name: 'Edit',
      cell: (row) => (
        <Link to={`/SupplierCLEdit/${row.supplier_id}/?tab=1`}>
          <Icon.Edit2 />
        </Link>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '70px',
    },
    // Delete and Action columns will be conditionally added
    {
      name: 'Supplier Code',
      selector: (row) => row.supplier_code,
      sortable: true,
      cell: (row) => (
        <Link to={`/SupplierCLEdit/${row.supplier_id}/?tab=1`}>
          {row.supplier_code}
        </Link>
      ),
    },
    {
      name: 'Supplier name',
      selector: (row) => row.company_name,
      sortable: true,
      cell: (row) => (
        <Link to={`/SupplierCLEdit/${row.supplier_id}/?tab=1`}>
          {row.company_name}
        </Link>
      ),
    },
    {
      name: 'Address',
      selector: (row) => `${row.address_flat || ''}${row.address_street || ''}${row.address_state || ''}`,
      sortable: false,
    },
    {
      name: 'Phone No',
      selector: (row) => row.phone,
      sortable: false,
    },
    {
      name: 'Email',
      selector: (row) => row.email,
      sortable: false,
    },
  ];

  // Conditionally add Delete and Action columns
  const columns = [...baseColumns];
  if (filterStatus === 'Active') {
    columns.splice(2, 0, {
      name: 'Delete',
      cell: (row) => (
        <Button color="danger" size="sm" className="shadow-none" onClick={() => handleDelete(row.supplier_id)}>
          <Icon.Trash2 size={16} />
        </Button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '90px',
    });
  } else if (filterStatus === 'InActive') {
    columns.splice(2, 0, {
      name: 'Action',
      cell: (row) => (
        <Button color="success" size="sm" className="shadow-none" onClick={() => handleActivate(row)}>
          <FaCheck />
        </Button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '70px',
    });
  } else if (filterStatus === 'All') {
    columns.splice(2, 0, {
      name: 'Delete',
      cell: (row) =>
        row.status === 'Active' ? (
          <Button color="danger" size="sm" className="shadow-none" onClick={() => handleDelete(row.supplier_id)}>
            <Icon.Trash2 size={16} />
          </Button>
        ) : null,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '90px',
    });
    columns.splice(3, 0, {
      name: 'Action',
      cell: (row) =>
        row.status === 'InActive' ? (
          <Button color="success" size="sm" className="shadow-none" onClick={() => handleActivate(row)}>
            <FaCheck />
          </Button>
        ) : null,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '70px',
    });
  }

  return (
    <div className="MainDiv">
      <div className=" pt-xs-25">
        <BreadCrumbs />
        {/* Filters Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 13 }}>
          <input
            type="text"
            placeholder="Search Supplier.."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="form-control w-25"
          />
          <span style={{ color: '#1976d2', fontWeight: 500, fontSize: 13 }}>Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="form-control w-25"
          >
            <option value="Active">Active</option>
            <option value="InActive">InActive</option>
            <option value="All">All</option>
          </select>
        </div>
        {/* Supplier Add new button */}
        <CommonTable
          loading={loading}
          title="Supplier List"
          Button={
            <Link to="/SupplierCLDetails">
              <Button color="primary" className="shadow-none">
                Add New
              </Button>
            </Link>
          }
        >
          <DataTable
            columns={columns}
            data={supplier}
            progressPending={loading}
            pagination
            highlightOnHover
            pointerOnHover
            responsive
            noHeader
          />
        </CommonTable>
        {/* Activate Modal */}
        <Modal isOpen={showActivateModal} toggle={() => setShowActivateModal(false)}>
          <ModalHeader toggle={() => setShowActivateModal(false)}>Activate Data</ModalHeader>
          <ModalBody>
            Are you sure to activate this Supplier -{' '}
            <span style={{ color: '#8e24aa', fontWeight: 600 }}>{selectedSupplier?.company_name}</span>?
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={confirmActivate}>
              ACTIVATE
            </Button>{' '}
            <Button color="secondary" onClick={() => setShowActivateModal(false)}>
              CLOSE
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
};

export default SupplierCL;
