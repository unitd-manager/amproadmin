import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Input,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import * as Icon from 'react-feather';
import Swal from 'sweetalert2';
import api from '../../constants/api';
import message from '../../components/Message';
import EditActionModal from '../../components/Payments/EditActionModal';
import PaymentVoucherModal from '../../components/Payments/PaymentVoucherModal';
import PaymentsPrintPdf from '../../components/PDF/PaymentsPrintPdf';

const PaymentsCL = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [paymentNo, setPaymentNo] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [supplier, setSupplier] = useState('');
  const [chequeNo, setChequeNo] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [payMode, setPayMode] = useState('');

  // Selection & modals
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [voucherModalOpen, setVoucherModalOpen] = useState(false);
  const [printPaymentId, setPrintPaymentId] = useState(null);

  // Fetch payments
  const getPayments = () => {
    setLoading(true);
    api
      .get('/payments/getPayments')
      .then((res) => {
        const data = res.data.data || [];
        setPayments(data);
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

  // Filter logic
  useEffect(() => {
    let filtered = payments;

    if (paymentNo)
      filtered = filtered.filter((x) =>
        (x.payment_no || '').toLowerCase().includes(paymentNo.toLowerCase())
      );
    if (supplier)
      filtered = filtered.filter((x) =>
        (x.company_name || '').toLowerCase().includes(supplier.toLowerCase())
      );
    if (chequeNo)
      filtered = filtered.filter((x) =>
        (x.cheque_no || '').toLowerCase().includes(chequeNo.toLowerCase())
      );
    if (paidAmount)
      filtered = filtered.filter((x) =>
        (x.paid_amount || '').toString().includes(paidAmount)
      );
    if (payMode)
      filtered = filtered.filter(
        (x) => (x.paymode_name || '').toLowerCase() === payMode.toLowerCase()
      );
    if (fromDate && toDate) {
      filtered = filtered.filter((x) => {
        const date = new Date(x.payment_date);
        return date >= new Date(fromDate) && date <= new Date(toDate);
      });
    }

    setFilteredPayments(filtered);
  }, [paymentNo, supplier, chequeNo, paidAmount, payMode, fromDate, toDate, payments]);

  // Delete handler
  const handleDelete = (id) => {
    if (!selectedPayment) {
      Swal.fire({
        icon: 'warning',
        title: 'Select at least one payment',
        confirmButtonText: 'OK',
      });
      return;
    }
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

  // Edit Payment handler
  const handleEditClick = () => {
    if (!selectedPayment) {
      Swal.fire({
        icon: 'warning',
        title: 'Select a payment to edit',
        confirmButtonText: 'OK',
      });
      return;
    }
    setEditModalOpen(true);
  };

  // Payment Voucher handler
  const handleVoucherClick = () => {
    if (!selectedPayment) {
      Swal.fire({
        icon: 'warning',
        title: 'Select a payment first',
        confirmButtonText: 'OK',
      });
      return;
    }
    setVoucherModalOpen(true);
  };

  // Print handler
  const handlePrintClick = () => {
    if (!selectedPayment) {
      Swal.fire({
        icon: 'warning',
        title: 'Select a payment to print',
        confirmButtonText: 'OK',
      });
      return;
    }
    setPrintPaymentId(selectedPayment.payments_id);
  };

  // Recap handler (placeholder)
  const handleRecapClick = () => {
    Swal.fire({
      icon: 'info',
      title: 'Recap feature coming soon!',
      confirmButtonText: 'OK',
    });
  };

  // Table columns
  const columns = [
    { name: 'Payment No', selector: (row) => row.payment_no, sortable: true },
    { name: 'Payment Date', selector: (row) => row.payment_date, sortable: true },
    { name: 'Supplier Name', selector: (row) => row.company_name, sortable: true },
    { name: 'Paymode', selector: (row) => row.paymode_name, sortable: true },
    { name: 'Paid Amount', selector: (row) => row.paid_amount, sortable: true },
    { name: 'Credit Amount', selector: (row) => row.credit_amount, sortable: true },
    { name: 'Deposit Amount', selector: (row) => row.deposit_amount, sortable: true },
  ];

  return (
    <div className="MainDiv">

      {/* Header + Dropdown */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Payments Management</h4>

        <UncontrolledDropdown>
          <DropdownToggle color="primary" caret>
            Add Payment
          </DropdownToggle>
          <DropdownMenu end>
            <DropdownItem tag={Link} to="/PaymentDetailsCL">
              <Icon.PlusCircle size={14} className="me-2" /> Add Payment
            </DropdownItem>
            <DropdownItem onClick={handleEditClick}>
              <Icon.Edit2 size={14} className="me-2" /> Edit Payment
            </DropdownItem>
            <DropdownItem onClick={handleVoucherClick}>
              <Icon.FileText size={14} className="me-2" /> Payment Voucher
            </DropdownItem>
            <DropdownItem onClick={handleRecapClick}>
              <Icon.List size={14} className="me-2" /> Recap
            </DropdownItem>
            <DropdownItem onClick={handlePrintClick}>
              <Icon.Printer size={14} className="me-2" /> Print Payment Voucher
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>

      {/* Row 1 – Main Filters */}
      <Row className="align-items-end mb-2">
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
        <Col md="3">
          <Input
            placeholder="Supplier"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
          />
        </Col>

        {/* Search / Print / Delete */}
        <Col md="3" className="d-flex justify-content-end">
          <Button color="primary" className="me-2" onClick={getPayments}>
            <Icon.Search size={16} />
          </Button>
          <Button
            color="danger"
            onClick={() => handleDelete(selectedPayment?.payments_id)}
          >
            <Icon.Trash2 size={16} />
          </Button>
        </Col>
      </Row>

      {/* Row 2 – Secondary Filters */}
      <Row className="mb-3">
        <Col md="3">
          <Input type="select" value={payMode} onChange={(e) => setPayMode(e.target.value)}>
            <option value="">Select Paymode</option>
            <option value="Cash">Cash</option>
            <option value="Cheque">Cheque</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="TT">TT</option>
          </Input>
        </Col>
        <Col md="3">
          <Input
            placeholder="Cheque No"
            value={chequeNo}
            onChange={(e) => setChequeNo(e.target.value)}
          />
        </Col>
        <Col md="3">
          <Input
            placeholder="Paid Amount"
            value={paidAmount}
            onChange={(e) => setPaidAmount(e.target.value)}
          />
        </Col>
      </Row>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredPayments}
        pagination
        paginationPerPage={10}
        highlightOnHover
        progressPending={loading}
        striped
        selectableRows
        selectableRowsSingle
        onSelectedRowsChange={(state) => setSelectedPayment(state.selectedRows[0] || null)}
      />

      {/* Modals */}
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

      {/* Print PDF */}
      {printPaymentId && (
        <PaymentsPrintPdf
          paymentId={printPaymentId}
          onClose={() => setPrintPaymentId(null)}
        />
      )}
    </div>
  );
};

export default PaymentsCL;
