// src/views/Finance/PaymentsCL.js
import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Input,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button
} from 'reactstrap';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import * as Icon from 'react-feather';
import Swal from 'sweetalert2';
import api from '../../constants/api';
import message from '../../components/Message';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import EditActionModal from '../../components/Payments/EditActionModal';
import PaymentVoucherModal from '../../components/Payments/PaymentVoucherModal';
import PaymentsPrintPdf from '../../components/PDF/PaymentsPrintPdf';

const PaymentsCL = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter fields
  const [paymentNo, setPaymentNo] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [supplier, setSupplier] = useState('');
  const [chequeNo, setChequeNo] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [payMode, setPayMode] = useState('');
  const [printPaymentId, setPrintPaymentId] = useState(null);

  // selection & modal
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [voucherModalOpen, setVoucherModalOpen] = useState(false);

  const getPayments = () => {
    setLoading(true);
    api
      .get('/payments/getPayments')
      .then((res) => {
        const data = res.data.data || [0];
        setPayments(data);
        console.log('Payments fetched:', data);
        setFilteredPayments(data);
        setLoading(false);
      })
      .catch(() => {
        message('Unable to fetch payments', 'error');
        setLoading(false);
      });
  };

  useEffect(() => {
    getPayments();
  }, []);

  useEffect(() => {
    let filtered = payments;

    if (paymentNo) filtered = filtered.filter((x) => (x.payment_no || '').includes(paymentNo));
    if (supplier)
      filtered = filtered.filter((x) =>
        (x.company_name || '').toLowerCase().includes(supplier.toLowerCase())
      );
    if (chequeNo) filtered = filtered.filter((x) => (x.cheque_no || '').includes(chequeNo));
    if (paidAmount) filtered = filtered.filter((x) =>
      (x.paid_amount || '').toString().includes(paidAmount)
    );
    if (payMode) filtered = filtered.filter((x) =>
      (x.pay_mode || '').toLowerCase() === payMode.toLowerCase()
    );
    if (fromDate && toDate) {
      filtered = filtered.filter((x) => {
        const date = new Date(x.payment_date);
        return date >= new Date(fromDate) && date <= new Date(toDate);
      });
    }

    setFilteredPayments(filtered);
  }, [paymentNo, supplier, chequeNo, paidAmount, payMode, fromDate, toDate, payments]);

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .post('/payments/deletePayment', { id })
          .then(() => {
            Swal.fire('Deleted!', 'Payment record has been deleted.', 'success');
            getPayments();
          })
          .catch(() => {
            message('Unable to delete payment', 'error');
          });
      }
    });
  };

  const handleEditClick = () => {
    if (!selectedPayment) {
      // same wording as your screenshot
      Swal.fire({
        icon: 'warning',
        title: 'Select Atleast One Payment',
        confirmButtonText: 'OK',
      });
      return;
    }
    setEditModalOpen(true);
  };

  const handlePrintClick = () => {
    if (!selectedPayment) {
      Swal.fire({
        icon: 'warning',
        title: 'Select Atleast One Payment',
        confirmButtonText: 'OK',
      });
      return;
    }
    setPrintPaymentId(selectedPayment.payments_id);
    console.log("🔍 Printing payment with ID:", selectedPayment.payments_id);
  };

//   const handleVoucher = () => {
//   if (!selectedPayment) {
//     Swal.fire({
//       icon: 'warning',
//       title: 'Select Atleast One Payment',
//       confirmButtonText: 'OK',
//     });
//     return;
//   }
//   setVoucherModalOpen(true);
// };


  const columns = [
    { name: 'Payment No', selector: (row) => row.payment_no, sortable: true },
    { name: 'Payment Date', selector: (row) => row.payment_date, sortable: true },
    { name: 'Supplier Name', selector: (row) => row.company_name, sortable: true },
    { name: 'Paymode', selector: (row) => row.paymode_name, sortable: true },
    { name: 'Paid Amount', selector: (row) => row.paid_amount, sortable: true },
    { name: 'Credit Amount', selector: (row) => row.credit_amount, sortable: true },
    { name: 'Deposit Amount', selector: (row) => row.deposit_amount, sortable: true },
    {
      name: 'Action',
      cell: (row) => (
        <>
          {/* <Icon.Edit2
            size={16}
            className="me-2"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setSelectedPayment(row);
              setEditModalOpen(true);
            }}
            title="Edit"
          /> */}
          <Icon.Trash2
            size={16}
            color="red"
            style={{ cursor: 'pointer' }}
            onClick={() => handleDelete(row.payments_id)}
            title="Delete"
          />
        </>
      ),
      width: '100px',
    },
  ];

  return (
    <div className="MainDiv">
      <BreadCrumbs />
      <h4 className="mb-3">Payments Management</h4>

      {/* Filters */}
      <Row className="mb-3">
        <Col md="2">
          <Input
            placeholder="Payment No"
            value={paymentNo}
            onChange={(e) => setPaymentNo(e.target.value)}
          />
        </Col>
        <Col md="2">
          <Input
            type="date"
            placeholder="From Date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </Col>
        <Col md="2">
          <Input
            type="date"
            placeholder="To Date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </Col>
        <Col md="2">
          <Input
            placeholder="Supplier"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
          />
        </Col>
        <Col md="2">
          <Input
            placeholder="Cheque No"
            value={chequeNo}
            onChange={(e) => setChequeNo(e.target.value)}
          />
        </Col>
        <Col md="2">
          <Input
            placeholder="Paid Amount"
            value={paidAmount}
            onChange={(e) => setPaidAmount(e.target.value)}
          />
        </Col>

        <Col md="2" className="mt-2">
          <Input
            type="select"
            value={payMode}
            onChange={(e) => setPayMode(e.target.value)}
          >
            <option value="">Select Paymode</option>
            <option value="Cash">Cash</option>
            <option value="Cheque">Cheque</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="TT">TT</option>
          </Input>
        </Col>
      </Row>
      

      {/* Add Payment Dropdown */}
      <div className="d-flex justify-content-end mb-2">
        
       <UncontrolledDropdown className="d-inline-block ms-1">
    <DropdownToggle caret color="primary" >
      <Link to="/PaymentDetailsCL">
      <Button color="primary">Add Payment</Button>
    </Link>
    </DropdownToggle>
    <DropdownMenu end/>
      <DropdownMenu end>
        {/* <DropdownItem onClick={handleVoucher}>Payment Voucher</DropdownItem> */}
        <DropdownItem onClick={() => { /* Implement recap */ message('Recap clicked', 'info'); }}>Recap</DropdownItem>
        <DropdownItem onClick={handleEditClick}>Edit</DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
    <Button color="secondary" type="button" onClick={handlePrintClick}>
          <Icon.Printer size={16} className="me-1" />
         
            <DropdownItem>   <PaymentsPrintPdf
         
            paymentId={printPaymentId}
          onClose={() => setPrintPaymentId(null)}
        /></DropdownItem>
        </Button>
      </div>

      {/* Payment List Table */}
      <DataTable
        columns={columns}
        data={filteredPayments}
        pagination
        paginationPerPage={10}
        highlightOnHover
        progressPending={loading}
        striped
        selectableRows
        selectableRowsSingle // allow only one selection at a time
        onSelectedRowsChange={(state) => setSelectedPayment(state.selectedRows[0] || null)}
      />

      {/* Edit Modal */}
      <EditActionModal
        isOpen={editModalOpen}
        toggle={() => setEditModalOpen((s) => !s)}
        payment={selectedPayment}
        refreshPayments={getPayments}
      />
      <PaymentVoucherModal
  isOpen={voucherModalOpen}
  toggle={() => setVoucherModalOpen(false)}
  payment={selectedPayment}
/>
     
    </div>
  );
};

export default PaymentsCL;
