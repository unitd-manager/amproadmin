import React, { useState } from 'react';
import { Row, Col, Form, FormGroup, Label, Input, Button, Table } from 'reactstrap';
import PropTypes from 'prop-types';
import ComponentCard from '../ComponentCard';
import message from '../Message';
import api from '../../constants/api';

export default function SupplierTransactions({ supplierId }) {
  const [selectedTransactionType, setSelectedTransactionType] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [loading, setLoading] = useState(false);

  // Modified fetchTransactions to include transaction type and date range
  const fetchTransactions = () => {
    if (!supplierId || !selectedTransactionType) {
      message('Please select a transaction type', 'warning');
      return;
    }

    setLoading(true);
    
    const payload = {
      supplier_id: supplierId.toString(),
      transaction_type: selectedTransactionType,
      from_date: fromDate || '',
      to_date: toDate || ''
    };

    console.log('Sending request with payload:', payload);

    api.post('/Transaction/getTransactionsBySupplierId', payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('Received response:', response);
      
      if (response && response.data && response.data.status === 'success') {
        setTransactions(response.data.data || []);
      } else {
        throw new Error(response.data?.message || 'Failed to fetch transactions');
      }
    })
    .catch(err => {
      console.error('Detailed error:', err);
      message(err.message || 'An error occurred while fetching transactions.', 'danger');
      setTransactions([]);
    })
    .finally(() => {
      setLoading(false);
    });
  };

  // Handle filter changes
  const handleFilterTypeChange = (e) => {
    setSelectedTransactionType(e.target.value);
    setTransactions([]); // Clear previous results
  };

  // Add date validation to handleSearch
  const handleSearch = () => {
    if (!selectedTransactionType) {
      message('Please select a transaction type.', 'warning');
      return;
    }

    // Validate dates if either is provided
    if ((fromDate && !toDate) || (!fromDate && toDate)) {
      message('Please provide both From and To dates.', 'warning');
      return;
    }

    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);
      if (from > to) {
        message('From date cannot be later than To date.', 'warning');
        return;
      }
    }

    fetchTransactions();
  };

  // Define table columns based on transaction type
  const getTableColumns = () => {
    const commonColumns = [
      { label: 'Tran No', key: 'tran_no' },
      { 
        label: 'Date', 
        key: selectedTransactionType === 'sales_order' ? 'tran_date' :
             selectedTransactionType === 'delivery_order' ? 'delivery_order_date' :
             selectedTransactionType === 'invoice' ? 'invoice_date' :
             selectedTransactionType === 'sales_return' ? 'sales_return_date' :
             'receipt_date'
      },
      { label: 'Sub Total', key: 'sub_total' },
      { label: 'Tax', key: 'tax' },
      { label: 'Net Total', key: 'net_total' },
      { label: 'Status', key: 'status' }
    ];
    return commonColumns;
  };

  return (
    <Form>
      <FormGroup>
        <ComponentCard title="Filter & View Transactions">
          <Row>
            <Col md="3">
              <FormGroup>
                <Label>Transaction Type</Label>
                <Input
                  type="select"
                  onChange={handleFilterTypeChange}
                  value={selectedTransactionType}
                >
                  <option value="">Select</option>
                  <option value="sales_order">Sales Order</option>
                  <option value="delivery_order">Delivery Order</option>
                  <option value="invoice">Invoice</option>
                  <option value="sales_return">Sales Return</option>
                  <option value="receipt">Receipts</option>
                </Input>
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <Label>From Date</Label>
                <Input 
                  type="date" 
                  value={fromDate} 
                  onChange={(e) => setFromDate(e.target.value)} 
                />
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <Label>To Date</Label>
                <Input 
                  type="date" 
                  value={toDate} 
                  onChange={(e) => setToDate(e.target.value)} 
                />
              </FormGroup>
            </Col>
            <Col md="3">
              <Button 
                color="primary" 
                onClick={handleSearch} 
                className="mt-4" 
                disabled={loading}
              >
                Search
              </Button>
            </Col>
          </Row>

          {selectedTransactionType && transactions.length > 0 ? (
            <Row className="mt-4">
              <Col md="12">
                <Table bordered responsive>
                  <thead>
                    <tr>
                      {getTableColumns().map((col) => (
                        <th key={col.key}>{col.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tran) => (
                      <tr key={tran.transaction_id}>
                        {getTableColumns().map((col) => (
                          <td key={col.key}>
                            {(col.key === 'tran_date' || 
                              col.key === 'delivery_order_date' || 
                              col.key === 'invoice_date' || 
                              col.key === 'sales_return_date' || 
                              col.key === 'receipt_date') 
                              ? new Date(tran[col.key]).toLocaleDateString() 
                              : tran[col.key]}
                          </td>
                        ))}
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

SupplierTransactions.propTypes = {
  supplierId: PropTypes.any,
};