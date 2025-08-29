// src/pages/SalesAnalysis.js
/*eslint-disable*/
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Table,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import axios from "axios";
import api from "../../constants/api";

// Simple InputRowPoQty component
const InputRowPoQty = ({ current, productCode, onSave }) => {
  const [value, setValue] = useState(current);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onSave(value);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setValue(current);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="d-flex">
        <Input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          size="sm"
          style={{ width: '80px', marginRight: '5px' }}
        />
        <Button size="sm" color="success" onClick={handleSave} className="mr-1">
          ✓
        </Button>
        <Button size="sm" color="secondary" onClick={handleCancel}>
          ✗
        </Button>
      </div>
    );
  }

  return (
    <div className="d-flex align-items-center">
      <span className="mr-2">{current}</span>
      <Button size="sm" color="primary" onClick={() => setIsEditing(true)}>
        Edit
      </Button>
    </div>
  );
};

const SalesAnalysis = () => {
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    balanceStock: "",
    department: "",
    category: "",
    subCategory: "",
    supplier: "",
    supplierByPurchase: "",
    salesType: "",
    productCode: "",
    productName: "",
    location: "",
  });

  const [salesData, setSalesData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchSales();
  }, [page, filters]);

  const fetchSales = async () => {
    try {
      const { data } = await api.post('/salesOrder/getsalesorder', {
        params: { ...filters, page, limit: 10 },
      });
      setSalesData(data.results);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching sales data", error);
    }
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };
 const handleSearch = () => fetchSales();

  const handleUpdatePoQty = async (productCode, newQty) => {
    try {
      await axios.put(`/sales/${productCode}/poqty`, { poQty: newQty });
      fetchSales();
    } catch (err) {
      console.error(err);
      alert("Failed to update PO QTY");
    }
  };

  const handlePrint = () => {
    window.print();
  };
  return (
    <Container fluid>
      <Card className="mt-3">
        <CardBody>
          <Row className="mb-4 align-items-center">
            <Col>
              <h3 className="mb-0" style={{ color: '#2c3e50', fontWeight: '600' }}>Sales Analysis</h3>
            </Col>
          </Row>

          <Form>
            {/* Filter Section */}
            <div className="filter-section" style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
              <h5 className="mb-3" style={{ color: '#495057', fontWeight: '500' }}>Filter Options</h5>
              
              {/* First Row - Basic Filters */}
              <Row className="mb-2">
                <Col lg={3} md={4} sm={6} className="mb-1">
                  <FormGroup className="mb-2">
                    <Label style={{ fontWeight: '500', marginBottom: '3px', fontSize: '14px' }}>Location</Label>
                    <Input type="select" name="location" value={filters.location} onChange={handleChange} size="sm">
                      <option value="">All Locations</option>
                      <option value="warehouse1">Warehouse 1</option>
                      <option value="warehouse2">Warehouse 2</option>
                      <option value="store1">Store 1</option>
                      <option value="store2">Store 2</option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col lg={3} md={4} sm={6} className="mb-1">
                  <FormGroup className="mb-2">
                    <Label style={{ fontWeight: '500', marginBottom: '3px', fontSize: '14px' }}>From Date</Label>
                    <Input type="date" name="fromDate" value={filters.fromDate} onChange={handleChange} size="sm" />
                  </FormGroup>
                </Col>
                <Col lg={3} md={4} sm={6} className="mb-1">
                  <FormGroup className="mb-2">
                    <Label style={{ fontWeight: '500', marginBottom: '3px', fontSize: '14px' }}>To Date</Label>
                    <Input type="date" name="toDate" value={filters.toDate} onChange={handleChange} size="sm" />
                  </FormGroup>
                </Col>
                <Col lg={3} md={4} sm={6} className="mb-1">
                  <FormGroup className="mb-2">
                    <Label style={{ fontWeight: '500', marginBottom: '3px', fontSize: '14px' }}>Balance Stock</Label>
                    <Input type="select" name="balanceStock" value={filters.balanceStock} onChange={handleChange} size="sm">
                      <option value="">All Stock Status</option>
                      <option value="inStock">In Stock</option>
                      <option value="outOfStock">Out of Stock</option>
                    </Input>
                  </FormGroup>
                </Col>
              </Row>

              {/* Second Row - Product Filters */}
              <Row className="mb-2">
                <Col lg={3} md={4} sm={6} className="mb-1">
                  <FormGroup className="mb-2">
                    <Label style={{ fontWeight: '500', marginBottom: '3px', fontSize: '14px' }}>Product Code</Label>
                    <Input 
                      type="text" 
                      name="productCode" 
                      value={filters.productCode} 
                      onChange={handleChange} 
                      placeholder="Enter product code" 
                      size="sm"
                    />
                  </FormGroup>
                </Col>
                <Col lg={3} md={4} sm={6} className="mb-1">
                  <FormGroup className="mb-2">
                    <Label style={{ fontWeight: '500', marginBottom: '3px', fontSize: '14px' }}>Product Name</Label>
                    <Input 
                      type="text" 
                      name="productName" 
                      value={filters.productName} 
                      onChange={handleChange} 
                      placeholder="Enter product name" 
                      size="sm"
                    />
                  </FormGroup>
                </Col>
                <Col lg={3} md={4} sm={6} className="mb-1">
                  <FormGroup className="mb-2">
                    <Label style={{ fontWeight: '500', marginBottom: '3px', fontSize: '14px' }}>Department</Label>
                    <Input type="select" name="department" value={filters.department} onChange={handleChange} size="sm">
                      <option value="">All Departments</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Clothing">Clothing</option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col lg={3} md={4} sm={6} className="mb-1">
                  <FormGroup className="mb-2">
                    <Label style={{ fontWeight: '500', marginBottom: '3px', fontSize: '14px' }}>Category</Label>
                    <Input type="select" name="category" value={filters.category} onChange={handleChange} size="sm">
                      <option value="">All Categories</option>
                    </Input>
                  </FormGroup>
                </Col>
              </Row>

              {/* Third Row - Additional Filters */}
              <Row className="mb-2">
                <Col lg={3} md={4} sm={6} className="mb-1">
                  <FormGroup className="mb-2">
                    <Label style={{ fontWeight: '500', marginBottom: '3px', fontSize: '14px' }}>SubCategory</Label>
                    <Input type="select" name="subCategory" value={filters.subCategory} onChange={handleChange} size="sm">
                      <option value="">All SubCategories</option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col lg={3} md={4} sm={6} className="mb-1">
                  <FormGroup className="mb-2">
                    <Label style={{ fontWeight: '500', marginBottom: '3px', fontSize: '14px' }}>Supplier</Label>
                    <Input type="select" name="supplier" value={filters.supplier} onChange={handleChange} size="sm">
                      <option value="">All Suppliers</option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col lg={3} md={4} sm={6} className="mb-1">
                  <FormGroup className="mb-2">
                    <Label style={{ fontWeight: '500', marginBottom: '3px', fontSize: '14px' }}>Supplier By Purchase</Label>
                    <Input type="select" name="supplierByPurchase" value={filters.supplierByPurchase} onChange={handleChange} size="sm">
                      <option value="">All Purchase Suppliers</option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col lg={3} md={4} sm={6} className="mb-1">
                  <FormGroup className="mb-2">
                    <Label style={{ fontWeight: '500', marginBottom: '3px', fontSize: '14px' }}>Sales Type</Label>
                    <Input type="select" name="salesType" value={filters.salesType} onChange={handleChange} size="sm">
                      <option value="">All Sales Types</option>
                      <option value="retail">Retail</option>
                      <option value="wholesale">Wholesale</option>
                    </Input>
                  </FormGroup>
                </Col>
              </Row>
            </div>
            {/* Action Buttons */}
            <Row className="mt-2">
              <Col md={12}>
                <div className="d-flex justify-content-between align-items-center p-2" style={{ backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #dee2e6' }}>
                  <div className="d-flex gap-2">
                    <Button 
                      color="primary" 
                      size="sm"
                      onClick={() => fetchSales()}
                      style={{ minWidth: '90px' }}
                    >
                      <i className="fas fa-search me-1"></i>
                      Search
                    </Button>
                    <Button 
                      color="secondary" 
                      size="sm"
                      onClick={handlePrint}
                      style={{ minWidth: '90px' }}
                    >
                      <i className="fas fa-print me-1"></i>
                      Print
                    </Button>
                  </div>
                  <div>
                    <Button
                      color="success"
                      size="sm"
                      onClick={() => handleUpdatePoQty()}
                      style={{ minWidth: '110px' }}
                    >
                      <i className="fas fa-sync-alt me-1"></i>
                      Update PO QTY
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>

      <Card className="mt-4">
        <CardBody>
          {/* Results Summary */}
          <Row className="mb-3">
            <Col>
              <div className="d-flex justify-content-between align-items-center p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <h5 className="mb-0" style={{ color: '#495057', fontWeight: '500' }}>Sales Analysis Results</h5>
                <span className="badge badge-primary" style={{ fontSize: '14px', padding: '8px 12px' }}>
                  {salesData?.length || 0} Records Found
                </span>
              </div>
            </Col>
          </Row>

          {/* Table */}
          <Row>
            <Col>
              <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #dee2e6' }}>
                <Table bordered responsive hover size="sm" className="mb-0">
                  <thead style={{ backgroundColor: '#495057', color: 'white' }}>
                    <tr>
                      <th style={{ borderColor: '#495057', fontWeight: '600', padding: '12px 8px' }}>Product Code</th>
                      <th style={{ borderColor: '#495057', fontWeight: '600', padding: '12px 8px' }}>Product Name</th>
                      <th style={{ borderColor: '#495057', fontWeight: '600', padding: '12px 8px' }}>Sales Qty</th>
                      <th style={{ borderColor: '#495057', fontWeight: '600', padding: '12px 8px' }}>Sales SubTotal</th>
                      <th style={{ borderColor: '#495057', fontWeight: '600', padding: '12px 8px' }}>Sales TotalCost</th>
                      <th style={{ borderColor: '#495057', fontWeight: '600', padding: '12px 8px' }}>Balance Qty</th>
                      <th style={{ borderColor: '#495057', fontWeight: '600', padding: '12px 8px' }}>Balance Cost</th>
                      <th style={{ borderColor: '#495057', fontWeight: '600', padding: '12px 8px' }}>Profit</th>
                      <th style={{ borderColor: '#495057', fontWeight: '600', padding: '12px 8px' }}>PO Qty</th>
                      <th style={{ borderColor: '#495057', fontWeight: '600', padding: '12px 8px' }}>Supplier</th>
                    </tr>
                  </thead>
                  <tbody>
                    { salesData?.length === 0 ? (
                      <tr>
                        <td colSpan="10" className="text-center" style={{ padding: '40px', color: '#6c757d' }}>
                          <i className="fas fa-search fa-2x mb-3 d-block"></i>
                          No data found. Please adjust your filters and search again.
                        </td>
                      </tr>
                    ) : (
                      salesData?.map((row, index) => (
                        <tr key={row.product_code} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa' }}>
                          <td style={{ padding: '10px 8px', fontWeight: '500' }}>{row.product_code}</td>
                          <td style={{ color: "#2b7bbf", cursor: "pointer", padding: '10px 8px', fontWeight: '500' }}>
                            {row.product_name}
                          </td>
                          <td style={{ padding: '10px 8px', textAlign: 'right' }}>{Number(row.sale_qty || 0).toFixed(2)}</td>
                          <td style={{ padding: '10px 8px', textAlign: 'right' }}>{Number(row.sale_subtotal || 0).toFixed(2)}</td>
                          <td style={{ padding: '10px 8px', textAlign: 'right' }}>{Number(row.sale_totalcost || 0).toFixed(2)}</td>
                          <td style={{ padding: '10px 8px', textAlign: 'right' }}>{Number(row.balance_qty || 0).toFixed(2)}</td>
                          <td style={{ padding: '10px 8px', textAlign: 'right' }}>{Number(row.balance_cost || 0).toFixed(2)}</td>
                          <td style={{ padding: '10px 8px', textAlign: 'right', color: Number(row.profit || 0) >= 0 ? '#28a745' : '#dc3545', fontWeight: '600' }}>
                            {Number(row.profit || 0).toFixed(2)}
                          </td>
                          <td style={{ padding: '10px 8px' }}>
                            <InputRowPoQty
                              current={row.po_qty || 0}
                              productCode={row.product_code}
                              onSave={(newQty) =>
                                handleUpdatePoQty(row.product_code, newQty)
                              }
                            />
                          </td>
                          <td style={{ padding: '10px 8px' }}>
                            <Input value={row.supplier || ""} readOnly size="sm" />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>


          <Pagination>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i} active={i + 1 === page}>
                <PaginationLink onClick={() => setPage(i + 1)}>
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
          </Pagination>
        </CardBody>
      </Card>
    </Container>
  );
};

export default SalesAnalysis;
