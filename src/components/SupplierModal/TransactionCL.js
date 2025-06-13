import React, { useState } from 'react';
import {
  Card, CardBody, Row, Col, FormGroup, Label, Input, Button, Table,
} from 'reactstrap';
import { ToastContainer } from 'react-toastify';
import moment from 'moment';
import PropTypes from 'prop-types';
import api from '../../constants/api';
import message from '../Message';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';


export default function SupplierTransactionReport({  SupplierId
}) {
  SupplierTransactionReport.propTypes = {
    SupplierId: PropTypes.object
  };
  const [module, setModule] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [transactions, setTransactions] = useState([]);

  const moduleOptions = [
    'Purchase Order',
    'Purchase Invoice',
    'Goods Receipt',
    'Payments',
    'Goods Return',
  ];

  const getApiEndpoint = (selectedModule) => {
    switch (selectedModule) {
      case 'Purchase Order':
        return '/supplier/getSupplierTransactionReport';
      case 'Purchase Invoice':
        return '/supplier/getPurchaseInvoiceReport';
      case 'Goods Receipt':
        return '/supplier/getGoodsReceiptReport';
      case 'Payments':
        return '/supplier/getPaymentsReport';
      case 'Goods Return':
        return '/supplier/getGoodsReturnReport';
      default:
        return null;
    }
  };

  const getColumnConfig = (selectedModule) => {
    switch (selectedModule.toLowerCase().replace(' ', '_')) {
      case 'purchase_order':
      case 'goods_receipt':
      case 'purchase_invoice':
      case 'goods_return':
        return [
          { label: 'Tran No', key: 'tran_no' },
          { label: 'Tran Date', key: 'tran_date' },
          { label: 'Sub Total', key: 'sub_total' },
          { label: 'Tax', key: 'gst' },
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

  const fetchTransactions = () => {
    if (!module || !fromDate || !toDate) {
      message('Please fill all filters', 'warning');
      return;
    }

    const endpoint = getApiEndpoint(module);
    if (!endpoint) {
      message('Invalid module selected', 'error');
      return;
    }

    api.post(endpoint, {
      supplier_id: SupplierId,
  fromDate,
  toDate,
    })
      .then((res) => {
        setTransactions(res.data.data);
        if (res.data.data.length === 0) {
          message('No transactions found', 'info');
        }
      })
      .catch(() => {
        message('Failed to fetch transactions', 'error');
      });
  };

  const columns = getColumnConfig(module);

  return (
    <>
      <BreadCrumbs />
      <ToastContainer />
      <Card>
        <CardBody>
          <Row>
            <Col md="3">
              <FormGroup>
                <Label>Module</Label>
                <Input
                  type="select"
                  value={module}
                  onChange={(e) => setModule(e.target.value)}
                >
                  <option value="">Select Module</option>
                  {moduleOptions.map((mod) => (
                    <option key={mod} value={mod}>
                      {mod}
                    </option>
                  ))}
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
            <Col md="2" className="mt-4">
              <Button color="primary" onClick={fetchTransactions}>
                Search
              </Button>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Table bordered responsive>
            <thead>
              <tr>
                <th>#</th>
                {columns.map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((txn, index) => (
                  <tr key={SupplierId}>
                    <td>{index + 1}</td>
                    {columns.map((col) => (
                      <td key={col.key}>
                        {col.key.includes('date') && txn[col.key]
                          ? moment(txn[col.key]).format('DD-MM-YYYY')
                          : txn[col.key]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + 1} className="text-center">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </>
  );
};

