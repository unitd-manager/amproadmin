import React, { useEffect, useState } from 'react';
import { Row, Col, Input, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import * as Icon from 'react-feather';
import Swal from 'sweetalert2';
import api from '../../constants/api';
import message from '../../components/Message';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';

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

  const getPayments = () => {
    setLoading(true);
    api
      .get('/finance/getPayments')
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

  useEffect(() => {
    let filtered = payments;

    if (paymentNo) filtered = filtered.filter((x) => x.payment_no?.includes(paymentNo));
    if (supplier) filtered = filtered.filter((x) =>
      x.supplier_name?.toLowerCase().includes(supplier.toLowerCase())
    );
    if (chequeNo) filtered = filtered.filter((x) => x.cheque_no?.includes(chequeNo));
    if (paidAmount) filtered = filtered.filter((x) =>
      x.paid_amount?.toString().includes(paidAmount)
    );
    if (payMode) filtered = filtered.filter((x) =>
      x.pay_mode?.toLowerCase() === payMode.toLowerCase()
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
          .post('/finance/deletePayment', { id })
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

  const columns = [
    { name: 'Payment No', selector: row => row.payment_no, sortable: true },
    { name: 'Payment Date', selector: row => row.payment_date, sortable: true },
    { name: 'Supplier Name', selector: row => row.supplier_name, sortable: true },
    { name: 'Paymode', selector: row => row.pay_mode, sortable: true },
    { name: 'Paid Amount', selector: row => row.paid_amount, sortable: true },
    { name: 'Credit Amount', selector: row => row.credit_amount, sortable: true },
    { name: 'Deposit Amount', selector: row => row.deposit_amount, sortable: true },
    {
      name: 'Action',
      cell: (row) => (
        <>
          <Link to={`/Finance/EditPayment/${row.payments_id}`} className="me-2">
            <Icon.Edit2 size={16} />
          </Link>
          <Icon.Trash2 size={16} color="red" onClick={() => handleDelete(row.payments_id)} />
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
          </Input>
        </Col>
      </Row>

      {/* Add Payment Button */}
      <div className="d-flex justify-content-end mb-2">
        <Button color="primary" tag={Link} to="/Finance/AddPayment">
          + Add Payment
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
      />
    </div>
  );
};

export default PaymentsCL;
