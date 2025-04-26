import React, { useState } from 'react';
import { Row, Col, Form, FormGroup, Label, Input, Button, Table } from 'reactstrap';
import PropTypes from 'prop-types';
import ComponentCard from '../ComponentCard';

const transactions = {
  purchase_order: [
    { tran_no: 'PO001', tran_date: '2025-04-01', sub_total: 1000, tax: 50, net_total: 1050 },
    { tran_no: 'PO002', tran_date: '2025-04-02', sub_total: 2000, tax: 100, net_total: 2100 },
  ],
  goods_receipt: [
    { tran_no: 'GR001', tran_date: '2025-04-01', sub_total: 1500, tax: 75, net_total: 1575 },
    { tran_no: 'GR002', tran_date: '2025-04-03', sub_total: 1800, tax: 90, net_total: 1890 },
  ],
  purchase_invoice: [
    { tran_no: 'PI001', tran_date: '2025-04-01', sub_total: 1200, tax: 60, net_total: 1260 },
    { tran_no: 'PI002', tran_date: '2025-04-02', sub_total: 2200, tax: 110, net_total: 2310 },
  ],
  payments: [
    { payment_no: 'P001', payment_date: '2025-04-01', pay_mode: 'Credit Card', gl_name: 'Sales', paid_amount: 1050 },
    { payment_no: 'P002', payment_date: '2025-04-02', pay_mode: 'Bank Transfer', gl_name: 'Purchases', paid_amount: 2100 },
  ],
  goods_return: [
    { tran_no: 'GRN001', tran_date: '2025-04-01', sub_total: 500, tax: 25, net_total: 525 },
    { tran_no: 'GRN002', tran_date: '2025-04-02', sub_total: 600, tax: 30, net_total: 630 },
  ],
};

export default function Transaction({ handleEdit, handleDelete }) {
  const [selectedTransaction, setSelectedTransaction] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Handle dropdown and date changes
  const handleTransactionTypeChange = (e) => {
    setSelectedTransaction(e.target.value);
  };

  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
  };

  const handleToDateChange = (e) => {
    setToDate(e.target.value);
  };

  const getTableColumns = () => {
    switch (selectedTransaction) {
      case 'purchase_order':
      case 'goods_receipt':
      case 'purchase_invoice':
      case 'goods_return':
        return [
          { label: 'Tran No', key: 'tran_no' },
          { label: 'Tran Date', key: 'tran_date' },
          { label: 'Sub Total', key: 'sub_total' },
          { label: 'Tax', key: 'tax' },
          { label: 'Net Total', key: 'net_total' },
        ];
      case 'payments':
        return [
          { label: 'Payment No', key: 'payment_no' },
          { label: 'Payment Date', key: 'payment_date' },
          { label: 'Pay Mode', key: 'pay_mode' },
          { label: 'GL Name', key: 'gl_name' },
          { label: 'Paid Amount', key: 'paid_amount' },
        ];
      default:
        return [];
    }
  };

  const handleSearch = () => {
    if (!selectedTransaction) {
      alert('Please select a transaction type.');
      return;
    }
  
    const data = transactions[selectedTransaction] || [];
  
    const filtered = data.filter((tran) => {
      const dateField = selectedTransaction === 'payments' ? 'payment_date' : 'tran_date';
      const tranDate = new Date(tran[dateField]);
  
      const isInDateRange =
        (!fromDate || tranDate >= new Date(fromDate)) &&
        (!toDate || tranDate <= new Date(toDate));
  
      return isInDateRange;
    });
  
    setFilteredTransactions(filtered);
  };
  
  

  const tableColumns = getTableColumns();

  return (
    <Form>
      <FormGroup>
        <ComponentCard title="Transaction Details">
          <Row>
            <Col md="3">
              <FormGroup>
                <Label>Transaction Type</Label>
                <Input
                  type="select"
                  onChange={handleTransactionTypeChange}
                  value={selectedTransaction}
                  name="transaction_type"
                >
                  <option value="">Select</option>
                  <option value="purchase_order">Purchase Order</option>
                  <option value="goods_receipt">Goods Receipt</option>
                  <option value="purchase_invoice">Purchase Invoice</option>
                  <option value="payments">Payments</option>
                  <option value="goods_return">Goods Return</option>
                </Input>
              </FormGroup>
            </Col>

            <Col md="3">
              <FormGroup>
                <Label>From Date</Label>
                <Input
                  type="date"
                  onChange={handleFromDateChange}
                  value={fromDate}
                  name="fromDate"
                />
              </FormGroup>
            </Col>

            <Col md="3">
              <FormGroup>
                <Label>To Date</Label>
                <Input
                  type="date"
                  onChange={handleToDateChange}
                  value={toDate}
                  name="toDate"
                />
              </FormGroup>
            </Col>

            <Col md="3">
              <Button
                color="primary"
                onClick={handleSearch}
                className="mt-4"
              >
                Search
              </Button>
            </Col>
          </Row>

          {/* Render the table if transactions are available */}
          {selectedTransaction && filteredTransactions.length > 0 ? (
            <Row className="mt-4">
              <Col md="12">
                <Table bordered responsive>
                  <thead>
                    <tr>
                      {tableColumns.map((col) => (
                        <th key={col.key}>{col.label}</th>
                      ))}
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((tran) => (
                      <tr key={tran.tran_no}>
                        {tableColumns.map((col) => (
                          <td key={col.key}>{tran[col.key]}</td>
                        ))}
                        <td>
                          <Button
                            color="warning"
                            size="sm"
                            className="me-2"
                            onClick={() => handleEdit(tran)}
                          >
                            Edit
                          </Button>
                          <Button
                            color="danger"
                            size="sm"
                            onClick={() => handleDelete(tran)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          ) : (
            <p>No transactions found for the selected filters.</p>
          )}
        </ComponentCard>
      </FormGroup>
    </Form>
  );
}

Transaction.propTypes = {
  handleEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};
