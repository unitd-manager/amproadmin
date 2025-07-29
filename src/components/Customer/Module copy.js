// src/components/Customer/CustomerTransactions.js
import React, { useState, useEffect } from 'react';
import { Row, Col, Form, FormGroup, Label, Input, Button, Table } from 'reactstrap';
import PropTypes from 'prop-types';
import ComponentCard from '../ComponentCard';
import message from '../Message'; // Assuming message utility is available
import api from '../../constants/api'; // Your API constant (e.g., pointing to http://localhost:3000)

export default function CustomerTransactions({ customerId }) {
  const [selectedTransactionType, setSelectedTransactionType] = useState('');
  const [transactions, setTransactions] = useState([]); // This will hold fetched transactions
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for adding a new transaction
  const [newTransaction, setNewTransaction] = useState({
    transaction_type: '', // Will be set by dropdown
    tran_no: '',
    tran_date: '',
    sub_total: '',
    tax: '',
    net_total: '',
    payment_no: '',
    payment_date: '',
    pay_mode: '',
    gl_name: '',
    paid_amount: '',
  });

  // State for editing an existing transaction
  const [editingTransaction, setEditingTransaction] = useState(null);

  // --- API Calls ---

  const fetchTransactions = async () => {
    if (!customerId) return; // Don't fetch if no customerId
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/Transaction/getTransactionsByCustomerId', { customer_id: customerId });

      if (response.data.status === 'success') {
        setTransactions(response.data.data);
        // On initial fetch, also populate filteredTransactions (no filters applied yet)
        setFilteredTransactions(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch transactions.');
        message(response.data.message || 'Failed to fetch transactions.', 'danger');
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('An error occurred while fetching transactions.');
      message('An error occurred while fetching transactions.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleNewInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction({ ...newTransaction, [name]: value });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingTransaction({ ...editingTransaction, [name]: value });
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const dataToSubmit = {
      customer_id: customerId,
      ...newTransaction,
      tran_date: newTransaction.tran_date || new Date().toISOString().slice(0, 10), // Default to today if empty
      payment_date: newTransaction.payment_date || null,
      sub_total: newTransaction.sub_total ? parseFloat(newTransaction.sub_total) : null,
      tax: newTransaction.tax ? parseFloat(newTransaction.tax) : null,
      net_total: newTransaction.net_total ? parseFloat(newTransaction.net_total) : null,
      paid_amount: newTransaction.paid_amount ? parseFloat(newTransaction.paid_amount) : null,
      created_by: 'Frontend User', // Replace with actual loggedInuser from AppContext if available
    };

    try {
      const response = await api.post('/Transaction/insertTransaction', dataToSubmit);

      if (response.data.status === 'success') {
        message('Transaction added successfully!', 'success');
        setNewTransaction({ // Reset form
          transaction_type: '', tran_no: '', tran_date: '',
          sub_total: '', tax: '', net_total: '', payment_no: '', payment_date: '',
          pay_mode: '', gl_name: '', paid_amount: '',
        });
        fetchTransactions(); // Re-fetch all transactions
      } else {
        setError(response.data.message || 'Failed to add transaction.');
        message(response.data.message || 'Failed to add transaction.', 'danger');
      }
    } catch (err) {
      console.error('Error adding transaction:', err);
      setError('An error occurred while adding the transaction.');
      message('An error occurred while adding the transaction.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTransaction = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const dataToSubmit = {
      transaction_id: editingTransaction.transaction_id,
      modified_by: 'Frontend User', // Replace with actual loggedInuser
      ...editingTransaction,
      tran_date: editingTransaction.tran_date ? new Date(editingTransaction.tran_date).toISOString().slice(0, 10) : null,
      payment_date: editingTransaction.payment_date ? new Date(editingTransaction.payment_date).toISOString().slice(0, 10) : null,
      sub_total: editingTransaction.sub_total ? parseFloat(editingTransaction.sub_total) : null,
      tax: editingTransaction.tax ? parseFloat(editingTransaction.tax) : null,
      net_total: editingTransaction.net_total ? parseFloat(editingTransaction.net_total) : null,
      paid_amount: editingTransaction.paid_amount ? parseFloat(editingTransaction.paid_amount) : null,
    };

    try {
      const response = await api.post('/Transaction/updateTransaction', dataToSubmit);

      if (response.data.status === 'success') {
        message('Transaction updated successfully!', 'success');
        setEditingTransaction(null); // Exit edit mode
        fetchTransactions(); // Re-fetch all transactions
      } else {
        setError(response.data.message || 'Failed to update transaction.');
        message(response.data.message || 'Failed to update transaction.', 'danger');
      }
    } catch (err) {
      console.error('Error updating transaction:', err);
      setError('An error occurred while updating the transaction.');
      message('An error occurred while updating the transaction.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/Transaction/deleteTransaction', { transaction_id: transactionId });

      if (response.data.status === 'success') {
        message('Transaction deleted successfully!', 'success');
        fetchTransactions(); // Re-fetch all transactions
      } else {
        setError(response.data.message || 'Failed to delete transaction.');
        message(response.data.message || 'Failed to delete transaction.', 'danger');
      }
    } catch (err) {
      console.error('Error deleting transaction:', err);
      setError('An error occurred while deleting the transaction.');
      message('An error occurred while deleting the transaction.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  // --- Effects and Handlers ---

  useEffect(() => {
    fetchTransactions();
  }, [customerId]); // Fetch transactions when component mounts or customerId changes

  // Handle dropdown and date changes for filtering
  const handleFilterTypeChange = (e) => {
    setSelectedTransactionType(e.target.value);
    setFilteredTransactions([]); // Clear filtered results when type changes
  };

  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
  };

  const handleToDateChange = (e) => {
    setToDate(e.target.value);
  };

  // Filter transactions based on selected type and date range
  const handleSearch = () => {
    if (!selectedTransactionType) {
      message('Please select a transaction type.', 'warning');
      setFilteredTransactions([]); // Clear previous results
      return;
    }

    const dataToFilter = transactions.filter(t => t.transaction_type === selectedTransactionType);

    const filtered = dataToFilter.filter((tran) => {
      const dateField = selectedTransactionType === 'payments' ? 'payment_date' : 'tran_date';
      const tranDate = new Date(tran[dateField]);

      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;

      const isInDateRange =
        (!from || tranDate >= from) &&
        (!to || tranDate <= to);

      return isInDateRange;
    });

    setFilteredTransactions(filtered);
  };

  // Define columns dynamically based on transaction type
  const getTableColumns = () => {
    switch (selectedTransactionType) {
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

  const tableColumns = getTableColumns();

  return (
    <Form>
      <FormGroup>
        {/* Transaction Add Form */}
        <ComponentCard title="Add New Transaction">
          <Row>
            <Col md="3">
              <FormGroup>
                <Label>Transaction Type<span className="required"> *</span></Label>
                <Input
                  type="select"
                  name="transaction_type"
                  value={newTransaction.transaction_type}
                  onChange={handleNewInputChange}
                  required
                >
                  <option value="">Select</option>
                  <option value="purchase_order">Purchase Order</option>
                  <option value="goods_receipt">Goods Receipt</option>
                  <option value="fpc">FPC</option>
                  <option value="purchase_invoice">Purchase Invoice</option>
                  <option value="payments">Payments</option>
                  <option value="goods_return">Goods Return</option>
                  <option value="other">Other</option>
                </Input>
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <Label>Tran No<span className="required"> *</span></Label>
                <Input type="text" name="tran_no" value={newTransaction.tran_no} onChange={handleNewInputChange} required />
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <Label>Tran Date<span className="required"> *</span></Label>
                <Input type="date" name="tran_date" value={newTransaction.tran_date} onChange={handleNewInputChange} required />
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <Label>Sub Total</Label>
                <Input type="number" name="sub_total" value={newTransaction.sub_total} onChange={handleNewInputChange} />
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <Label>Tax</Label>
                <Input type="number" name="tax" value={newTransaction.tax} onChange={handleNewInputChange} />
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <Label>Net Total</Label>
                <Input type="number" name="net_total" value={newTransaction.net_total} onChange={handleNewInputChange} />
              </FormGroup>
            </Col>

            {/* Conditional fields for Payments */}
            {newTransaction.transaction_type === 'payments' && (
              <>
                <Col md="3">
                  <FormGroup>
                    <Label>Payment No</Label>
                    <Input type="text" name="payment_no" value={newTransaction.payment_no} onChange={handleNewInputChange} />
                  </FormGroup>
                </Col>
                <Col md="3">
                  <FormGroup>
                    <Label>Payment Date</Label>
                    <Input type="date" name="payment_date" value={newTransaction.payment_date} onChange={handleNewInputChange} />
                  </FormGroup>
                </Col>
                <Col md="3">
                  <FormGroup>
                    <Label>Pay Mode</Label>
                    <Input type="text" name="pay_mode" value={newTransaction.pay_mode} onChange={handleNewInputChange} />
                  </FormGroup>
                </Col>
                <Col md="3">
                  <FormGroup>
                    <Label>GL Name</Label>
                    <Input type="text" name="gl_name" value={newTransaction.gl_name} onChange={handleNewInputChange} />
                  </FormGroup>
                </Col>
                <Col md="3">
                  <FormGroup>
                    <Label>Paid Amount</Label>
                    <Input type="number" name="paid_amount" value={newTransaction.paid_amount} onChange={handleNewInputChange} />
                  </FormGroup>
                </Col>
              </>
            )}
          </Row>
          <Row>
            <Col md="12" className="text-end">
              <Button color="primary" onClick={handleAddTransaction} disabled={loading}>
                Add Transaction
              </Button>
            </Col>
          </Row>
        </ComponentCard>

        {/* Transaction Filter and List */}
        <ComponentCard title="Filter & View Transactions">
          <Row>
            <Col md="3">
              <FormGroup>
                <Label>Transaction Type</Label>
                <Input
                  type="select"
                  onChange={handleFilterTypeChange}
                  value={selectedTransactionType}
                  name="transaction_type_filter"
                >
                  <option value="">Select</option>
                  <option value="purchase_order">Purchase Order</option>
                  <option value="goods_receipt">Goods Receipt</option>
                  <option value="fpc">FPC</option>
                  <option value="purchase_invoice">Purchase Invoice</option>
                  <option value="payments">Payments</option>
                  <option value="goods_return">Goods Return</option>
                  <option value="other">Other</option>
                </Input>
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <Label>From Date</Label>
                <Input type="date" onChange={handleFromDateChange} value={fromDate} name="fromDate" />
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <Label>To Date</Label>
                <Input type="date" onChange={handleToDateChange} value={toDate} name="toDate" />
              </FormGroup>
            </Col>
            <Col md="3">
              <Button color="primary" onClick={handleSearch} className="mt-4" disabled={loading}>
                Search
              </Button>
            </Col>
          </Row>

          {loading && <p>Loading data...</p>}
          {error && <p style={{ color: 'red' }}>Error: {error}</p>}

          {selectedTransactionType && filteredTransactions.length > 0 ? (
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
                      <tr key={tran.transaction_id}>
                        {tableColumns.map((col) => (
                          <td key={col.key}>
                            {col.key.includes('date') ? new Date(tran[col.key]).toLocaleDateString() : tran[col.key]}
                          </td>
                        ))}
                        <td>
                          <Button
                            color="warning"
                            size="sm"
                            className="me-2"
                            onClick={() => setEditingTransaction(tran)}
                            disabled={loading}
                          >
                            Edit
                          </Button>
                          <Button
                            color="danger"
                            size="sm"
                            onClick={() => handleDeleteTransaction(tran.transaction_id)}
                            disabled={loading}
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

          {/* Edit Transaction Form (conditionally rendered) */}
          {editingTransaction && (
            <ComponentCard title="Edit Transaction" className="mt-4">
              <Form onSubmit={handleUpdateTransaction}>
                <Row>
                  <Col md="3">
                    <FormGroup>
                      <Label>Transaction Type<span className="required"> *</span></Label>
                      <Input
                        type="select"
                        name="transaction_type"
                        value={editingTransaction.transaction_type}
                        onChange={handleEditInputChange}
                        required
                      >
                        <option value="purchase_order">Purchase Order</option>
                        <option value="goods_receipt">Goods Receipt</option>
                        <option value="fpc">FPC</option>
                        <option value="purchase_invoice">Purchase Invoice</option>
                        <option value="payments">Payments</option>
                        <option value="goods_return">Goods Return</option>
                        <option value="other">Other</option>
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label>Tran No<span className="required"> *</span></Label>
                      <Input type="text" name="tran_no" value={editingTransaction.tran_no || ''} onChange={handleEditInputChange} required />
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label>Tran Date<span className="required"> *</span></Label>
                      <Input
                        type="date"
                        name="tran_date"
                        value={editingTransaction.tran_date ? new Date(editingTransaction.tran_date).toISOString().slice(0, 10) : ''}
                        onChange={handleEditInputChange}
                        required
                      />
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label>Sub Total</Label>
                      <Input type="number" name="sub_total" value={editingTransaction.sub_total || ''} onChange={handleEditInputChange} />
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label>Tax</Label>
                      <Input type="number" name="tax" value={editingTransaction.tax || ''} onChange={handleEditInputChange} />
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label>Net Total</Label>
                      <Input type="number" name="net_total" value={editingTransaction.net_total || ''} onChange={handleEditInputChange} />
                    </FormGroup>
                  </Col>

                  {/* Conditional fields for Payments in edit form */}
                  {editingTransaction.transaction_type === 'payments' && (
                    <>
                      <Col md="3">
                        <FormGroup>
                          <Label>Payment No</Label>
                          <Input type="text" name="payment_no" value={editingTransaction.payment_no || ''} onChange={handleEditInputChange} />
                        </FormGroup>
                      </Col>
                      <Col md="3">
                        <FormGroup>
                          <Label>Payment Date</Label>
                          <Input
                            type="date"
                            name="payment_date"
                            value={editingTransaction.payment_date ? new Date(editingTransaction.payment_date).toISOString().slice(0, 10) : ''}
                            onChange={handleEditInputChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="3">
                        <FormGroup>
                          <Label>Pay Mode</Label>
                          <Input type="text" name="pay_mode" value={editingTransaction.pay_mode || ''} onChange={handleEditInputChange} />
                        </FormGroup>
                      </Col>
                      <Col md="3">
                        <FormGroup>
                          <Label>GL Name</Label>
                          <Input type="text" name="gl_name" value={editingTransaction.gl_name || ''} onChange={handleEditInputChange} />
                        </FormGroup>
                      </Col>
                      <Col md="3">
                        <FormGroup>
                          <Label>Paid Amount</Label>
                          <Input type="number" name="paid_amount" value={editingTransaction.paid_amount || ''} onChange={handleEditInputChange} />
                        </FormGroup>
                      </Col>
                    </>
                  )}
                </Row>
                <Row className="mt-3">
                  <Col md="12" className="text-end">
                    <Button color="primary" type="submit" disabled={loading}>Update Transaction</Button>
                    <Button color="secondary" className="ms-2" onClick={() => setEditingTransaction(null)} disabled={loading}>Cancel</Button>
                  </Col>
                </Row>
              </Form>
            </ComponentCard>
          )}
        </ComponentCard>
      </FormGroup>
    </Form>
  );
}

CustomerTransactions.propTypes = {
  customerId: PropTypes.any,
};