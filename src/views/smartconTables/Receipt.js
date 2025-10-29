import React, { useEffect, useState } from 'react';
import { Row, Col, Input, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import * as Icon from 'react-feather';
import Swal from 'sweetalert2';
import api from '../../constants/api';
import message from '../../components/Message';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import EditReceiptModal from '../../components/Receipt/EditReceiptModal';

const Receipt = () => {
  const [receipts, setReceipts] = useState([]);
  const [filteredReceipts, setFilteredReceipts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [receiptNo, setReceiptNo] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [customer, setCustomer] = useState('');
  const [chequeNo, setChequeNo] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [paymodeFilter, setPaymodeFilter] = useState('');
  const [employees, setEmployees] = useState([]);
  const [userFilter, setUserFilter] = useState('');

  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
  };

  const getReceipts = () => {
    setLoading(true);
    // Placeholder: try to fetch receipts if API exists, otherwise use empty array
    api
      .get('/receipt/getReceipts', {})
      .then((res) => {
        const data = res.data?.data || [];
        setReceipts(data);
        setFilteredReceipts(data);
        setLoading(false);
      })
      .catch(() => {
        // API may not exist in this project; fall back to empty list
        setReceipts([]);
        setFilteredReceipts([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    getReceipts();
  }, []);

  // fetch employees for "Select All User" filter
  useEffect(() => {
    api.get('employee/getEmployee')
      .then((res) => {
        const data = res.data?.data || [];
        // normalize employee objects (employee_id, employee_name)
        setEmployees(data.map(e => ({
          employee_id: e.employee_id || e.employee_id_duplicate || e.employee_id,
          employee_name: e.employee_name || e.first_name || `${e.first_name || ''} ${e.last_name || ''}`.trim()
        })));
      })
      .catch(() => {
        setEmployees([]);
      });
  }, []);

  useEffect(() => {
    let filtered = receipts;
    if (receiptNo) filtered = filtered.filter((x) => (x.receipt_no || '').includes(receiptNo));
    if (customer) filtered = filtered.filter((x) => (x.company_name || '').toLowerCase().includes(customer.toLowerCase()));
    if (chequeNo) filtered = filtered.filter((x) => (x.cheque_no || '').includes(chequeNo));
    if (paidAmount) filtered = filtered.filter((x) => (x.paid_amount || '').toString().includes(paidAmount));
    if (paymodeFilter) filtered = filtered.filter((x) => String((x.mode_of_payment || '')).toLowerCase() === String(paymodeFilter).toLowerCase());
    if (userFilter) {
      const selectedEmp = employees.find(e => String(e.employee_id) === String(userFilter));
      const empName = selectedEmp ? (selectedEmp.employee_name || '').toLowerCase() : '';
      filtered = filtered.filter((x) => {
        // match by collected_by id, user_id, or username string
        if (String(x.collected_by || '') === String(userFilter)) return true;
        if (String(x.user_id || '') === String(userFilter)) return true;
        if (empName && (x.user || '').toLowerCase().includes(empName)) return true;
        return false;
      });
    }
    if (fromDate && toDate) {
      filtered = filtered.filter((x) => {
        const date = new Date(x.receipt_date);
        return date >= new Date(fromDate) && date <= new Date(toDate);
      });
    }
    setFilteredReceipts(filtered);
  }, [receiptNo, customer, chequeNo, paidAmount, fromDate, toDate, receipts, paymodeFilter, userFilter, employees]);

  const handleDelete = (id) => {
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
        // call API if available
        api.post('/receipt/deleteReceipt', { id }).then(() => {
          Swal.fire('Deleted!', 'Receipt record has been deleted.', 'success');
          getReceipts();
        }).catch(() => {
          message('Unable to delete receipt', 'error');
        });
      }
    });
  };

  const columns = [
    { name: 'Receipt No', selector: (row) => row.receipt_no, sortable: true },
    { name: 'Receipt Date', selector: (row) => row.receipt_date, sortable: true },
    { name: 'Customer Name', selector: (row) => row.company_name, sortable: true },
    { name: 'Paymode', selector: (row) => row.mode_of_payment, sortable: true },
    { name: 'Receipt Amount', selector: (row) => row.amount_paid, sortable: true },
    { name: 'Credit Amount', selector: (row) => row.amount, sortable: true },
    { name: 'Deposit Amount', selector: (row) => row.balance_amount, sortable: true },
    {
      name: 'Action',
      cell: (row) => (
        <>
          <Icon.Trash2 size={16} color="red" style={{ cursor: 'pointer' }} onClick={() => handleDelete(row.receipt_id)} title="Delete" />
        </>
      ),
      width: '100px',
    },
  ];

  const onRecap = () => message('Recap clicked', 'info');
  const onTrackingImages = () => message('Tracking Images clicked', 'info');

  const handlePrint = () => {
    if (!selectedReceipt) {
      Swal.fire({ icon: 'warning', title: 'Select Atleast One Receipt', confirmButtonText: 'OK' });
      return;
    }
    // TODO: wire this to an actual print/preview component
    message(`Print Receipt Voucher for ${selectedReceipt.receipt_no || selectedReceipt.receipt_id}`, 'info');
  };

  return (
    <div className="MainDiv">
      <BreadCrumbs />
      <h4 className="mb-3">Receipt Management</h4>

      <Row className="mb-2">
        <Col md="2">
          <Input placeholder="Receipt No" value={receiptNo} onChange={(e) => setReceiptNo(e.target.value)} />
        </Col>
        <Col md="2">
          <Input type="date" placeholder="From Date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        </Col>
        <Col md="2">
          <Input type="date" placeholder="To Date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </Col>
        <Col md="2">
          <Input placeholder="Customer" value={customer} onChange={(e) => setCustomer(e.target.value)} />
        </Col>
        <Col md="2">
          <Input type="select" value={paymodeFilter} onChange={(e) => setPaymodeFilter(e.target.value)}>
            <option value="">Select All Paymode</option>
            <option value="CASH">CASH</option>
            <option value="CHEQUE">CHEQUE</option>
            <option value="ONLINE">ONLINE</option>
            <option value="TT">TT</option>
          </Input>
        </Col>
        <Col md="2">
          <Input type="select" value={userFilter} onChange={(e) => setUserFilter(e.target.value)}>
            <option value="">Select All User</option>
            {employees.map(emp => (
              <option key={emp.employee_id} value={emp.employee_id}>{emp.employee_name}</option>
            ))}
          </Input>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md="3">
          <Input placeholder="Cheque No" value={chequeNo} onChange={(e) => setChequeNo(e.target.value)} />
        </Col>
        <Col md="3">
          <Input placeholder="Paid Amount" value={paidAmount} onChange={(e) => setPaidAmount(e.target.value)} />
        </Col>
      </Row>

      <div className="d-flex justify-content-end mb-2">
        <UncontrolledDropdown className="d-inline-block ms-1">
          <DropdownToggle caret color="primary">
            <Link to="/ReceiptDetails">
              <Button color="primary">Add Receipt</Button>
            </Link>
          </DropdownToggle>
          <DropdownMenu end>
            <DropdownItem onClick={() => message('Receipt Voucher clicked', 'info')}>Receipt Voucher</DropdownItem>
            <DropdownItem onClick={onTrackingImages}>Tracking Images</DropdownItem>
            <DropdownItem onClick={onRecap}>Recap</DropdownItem>
            <DropdownItem onClick={() => {
              if (selectedReceipt) {
                toggleEditModal();
              } else {
                message('Please select a receipt to edit', 'warning');
              }
            }}>Edit</DropdownItem>
            <DropdownItem onClick={handlePrint}>Print Receipt Voucher</DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>

      {/* Edit Receipt Modal */}
      <EditReceiptModal
        isOpen={editModalOpen}
        toggle={toggleEditModal}
        receipt={selectedReceipt}
        onSave={(updatedData) => {
          // Handle save logic here
          console.log('Updated receipt data:', updatedData);
          api
            .post('/receipt/updateReceipt', { ...updatedData, receipt_id: selectedReceipt.receipt_id })
            .then(() => {
              message('Receipt updated successfully', 'success');
              getReceipts();
              toggleEditModal();
            })
            .catch((error) => {
              console.error('Error updating receipt:', error);
              message('Error updating receipt', 'error');
            });
        }}
      />

      <DataTable
        columns={columns}
        data={filteredReceipts}
        pagination
        paginationPerPage={10}
        highlightOnHover
        progressPending={loading}
        striped
        selectableRows
        selectableRowsSingle
        onSelectedRowsChange={(state) => setSelectedReceipt(state.selectedRows[0] || null)}
      />
    </div>
  );
};

export default Receipt;
