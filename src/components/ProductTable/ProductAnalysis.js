import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button, Input, Table, Label, Form, FormGroup } from 'reactstrap';
import api from '../../constants/api';
import message from '../Message';

const ProductAnalysis = ({ productId }) => {
  const [purchaseFilters, setPurchaseFilters] = useState({
    fromDate: '',
    toDate: '',
    location: 'Head Office',
    module: 'GRA',
  });

  const [salesFilters, setSalesFilters] = useState({
    fromDate: '',
    toDate: '',
    location: 'Head Office',
  });

  const [purchaseRecords, setPurchaseRecords] = useState([]);
  const [salesRecords, setSalesRecords] = useState([]);

  const locationOptions = ['Head Office', 'Branch A', 'Branch B'];
  const moduleOptions = ['GRA', 'AI'];

  const handlePurchaseFilterChange = (e) => {
    setPurchaseFilters({ ...purchaseFilters, [e.target.name]: e.target.value });
  };

  const handleSalesFilterChange = (e) => {
    setSalesFilters({ ...salesFilters, [e.target.name]: e.target.value });
  };

  

  const fetchFilteredPurchase = () => {
    api
      .post('product/getPurchasedProduct', {
        product_id: productId,
        fromDate: purchaseFilters.fromDate,
        toDate: purchaseFilters.toDate,
        location: purchaseFilters.location,
        module: purchaseFilters.module,
      })
      .then((res) => {
        const data = res?.data?.data || [];
        setPurchaseRecords(data);
      })
      .catch(() => message('Failed to load filtered purchase records', 'error'));
  };

  const fetchFilteredSales = () => {
    // You can similarly move this to backend filtering later
    api
      .post('product/getSoldProduct', {
        product_id: productId,
        fromDate: salesFilters.fromDate,
        toDate: salesFilters.toDate,
        location: salesFilters.location,
      })
      .then((res) => {
        const data = res?.data?.data || [];
        setSalesRecords(data); // Can add frontend filtering if needed
      })
      .catch(() => message('Failed to load sales records', 'error'));
  };

  const calculateTotal = (records) => {
    return records.reduce((sum, rec) => sum + Number(rec.total || 0), 0);
  };

  useEffect(() => {
    if (productId) {
      fetchFilteredPurchase(); // load with filters (initially blank)
      fetchFilteredSales();    // still using frontend filter
    }
  }, [productId]);

  return (
    <Row>
      {/* Purchase Section */}
      <Col md="6">
        <h5 className="mb-3">Purchase</h5>
        <Form>
          <Row>
            <Col md="6">
              <FormGroup>
                <Label>From Date</Label>
                <Input
                  type="date"
                  name="fromDate"
                  value={purchaseFilters.fromDate}
                  onChange={handlePurchaseFilterChange}
                />
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label>To Date</Label>
                <Input
                  type="date"
                  name="toDate"
                  value={purchaseFilters.toDate}
                  onChange={handlePurchaseFilterChange}
                />
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label>Location</Label>
                <Input
                  type="select"
                  name="location"
                  value={purchaseFilters.location}
                  onChange={handlePurchaseFilterChange}
                >
                  {locationOptions.map((loc) => (
                    <option key={loc}>{loc}</option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label>Module</Label>
                <Input
                  type="select"
                  name="module"
                  value={purchaseFilters.module}
                  onChange={handlePurchaseFilterChange}
                >
                  {moduleOptions.map((mod) => (
                    <option key={mod}>{mod}</option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md="12" className="text-end mb-3">
              <Button color="primary" onClick={fetchFilteredPurchase}>
                Search
              </Button>
            </Col>
          </Row>
        </Form>

        <Table bordered size="sm">
          <thead>
            <tr>
              <th>Tran No</th>
              <th>Supplier</th>
              <th>CQty</th>
              <th>Qty</th>
              <th>C.Price</th>
              <th>UnitPrice</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {purchaseRecords.length > 0 ? (
              purchaseRecords.map((rec) => (
                <tr key={rec.tran_no}>
                  <td>{rec.tran_no}</td>
                  <td>{rec.company_name}</td>
                  <td>{rec.carton_qty ?? '-'}</td>
                  <td>{rec.qty ?? rec.quantity ?? '-'}</td>
                  <td>{rec.carton_price ?? '-'}</td>
                  <td>{rec.unit_price ?? '-'}</td>
                  <td>{rec.total ?? '-'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No records
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="6" className="text-end">
                <strong>Total</strong>
              </td>
              <td>
                <strong>{calculateTotal(purchaseRecords).toFixed(2)}</strong>
              </td>
            </tr>
          </tfoot>
        </Table>
      </Col>

      {/* Sales Section */}
      <Col md="6">
        <h5 className="mb-3">Sales</h5>
        <Form>
          <Row>
            <Col md="6">
              <FormGroup>
                <Label>From Date</Label>
                <Input
                  type="date"
                  name="fromDate"
                  value={salesFilters.fromDate}
                  onChange={handleSalesFilterChange}
                />
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label>To Date</Label>
                <Input
                  type="date"
                  name="toDate"
                  value={salesFilters.toDate}
                  onChange={handleSalesFilterChange}
                />
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label>Location</Label>
                <Input
                  type="select"
                  name="location"
                  value={salesFilters.location}
                  onChange={handleSalesFilterChange}
                >
                  {locationOptions.map((loc) => (
                    <option key={loc}>{loc}</option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md="12" className="text-end mb-3">
              <Button color="primary" onClick={fetchFilteredSales}>
                Search
              </Button>
            </Col>
          </Row>
        </Form>

        <Table bordered size="sm">
          <thead>
            <tr>
              <th>Tran No</th>
              <th>Customer</th>
              <th>CQty</th>
              <th>Qty</th>
              <th>C.Price</th>
              <th>UnitPrice</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {salesRecords.length > 0 ? (
              salesRecords.map((rec) => (
                <tr key={rec.tran_no}>
                  <td>{rec.tran_no}</td>
                  <td>{rec.company_name}</td>
                  <td>{rec.carton_qty ?? '-'}</td>
                  <td>{rec.qty ?? rec.quantity ?? '-'}</td>
                  <td>{rec.carton_price ?? '-'}</td>
                  <td>{rec.unit_price ?? '-'}</td>
                  <td>{rec.total ?? '-'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No records
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="6" className="text-end">
                <strong>Total</strong>
              </td>
              <td>
                <strong>{calculateTotal(salesRecords).toFixed(2)}</strong>
              </td>
            </tr>
          </tfoot>
        </Table>
      </Col>
    </Row>
  );
};

ProductAnalysis.propTypes = {
  productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default ProductAnalysis;
