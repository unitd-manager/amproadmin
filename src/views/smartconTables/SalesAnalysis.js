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
            <Row className="mb-3 align-items-center">
        <Col>
          <h3>Sales Analysis</h3>
        </Col>
        <Col className="text-right">
          <Button
            color="primary"
            className="mr-2"
            onClick={() => handleUpdatePoQty()}
          >
            Update POQTY
          </Button>
          <Button color="secondary" className="mr-2" onClick={handlePrint}>
            Print
          </Button>
          <Button color="info" onClick={handleSearch}>
            Search
          </Button>
        </Col>
      </Row>

          <Form>
            <Row>
                 <Col md={2}>
                <FormGroup>
                  <Label>Location</Label>
                  <Input type="select" name="location" value={filters.location} onChange={handleChange}>
                    <option value="">All</option>
                    <option value="warehouse1">Warehouse 1</option>
                    <option value="warehouse2">Warehouse 2</option>
                    <option value="store1">Store 1</option>
                    <option value="store2">Store 2</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md={2}>
                <FormGroup>
                  <Label>From Date</Label>
                  <Input type="date" name="fromDate" value={filters.fromDate} onChange={handleChange} />
                </FormGroup>
              </Col>
              <Col md={2}>
                <FormGroup>
                  <Label>To Date</Label>
                  <Input type="date" name="toDate" value={filters.toDate} onChange={handleChange} />
                </FormGroup>
              </Col>
              <Col md={2}>
                <FormGroup>
                  <Label>Balance Stock</Label>
                  <Input type="select" name="balanceStock" value={filters.balanceStock} onChange={handleChange}>
                    <option value="">All</option>
                    <option value="inStock">In Stock</option>
                    <option value="outOfStock">Out of Stock</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md={2}>
                <FormGroup>
                  <Label>Product Code</Label>
                  <Input type="text" name="productCode" value={filters.productCode} onChange={handleChange} placeholder="Enter product code" />
                </FormGroup>
              </Col>
              <Col md={2}>
                <FormGroup>
                  <Label>Product Name</Label>
                  <Input type="text" name="productName" value={filters.productName} onChange={handleChange} placeholder="Enter product name" />
                </FormGroup>
              </Col>
              <Col md={2}>
                <FormGroup>
                  <Label>Department</Label>
                  <Input type="select" name="department" value={filters.department} onChange={handleChange}>
                    <option value="">All</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md={2}>
                <FormGroup>
                  <Label>Category</Label>
                  <Input type="select" name="category" value={filters.category} onChange={handleChange}>
                    <option value="">All</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md={2}>
                <FormGroup>
                  <Label>SubCategory</Label>
                  <Input type="select" name="subCategory" value={filters.subCategory} onChange={handleChange}>
                    <option value="">All</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={2}>
                <FormGroup>
                  <Label>Supplier</Label>
                  <Input type="select" name="supplier" value={filters.supplier} onChange={handleChange}>
                    <option value="">All</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md={2}>
                <FormGroup>
                  <Label>Supplier By Purchase</Label>
                  <Input type="select" name="supplierByPurchase" value={filters.supplierByPurchase} onChange={handleChange}>
                    <option value="">All</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md={2}>
                <FormGroup>
                  <Label>Sales Type</Label>
                  <Input type="select" name="salesType" value={filters.salesType} onChange={handleChange}>
                    <option value="">All</option>
                    <option value="retail">Retail</option>
                    <option value="wholesale">Wholesale</option>
                  </Input>
                </FormGroup>
              </Col>
              
           
            </Row>
            <Row>
              <Col md={2} className="d-flex align-items-end">
                <Button color="primary" onClick={() => fetchSales()}>
                  Search
                </Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>

      <Card className="mt-3">
        <CardBody>
               {/* Table */}
      <Row>
        <Col>
          <Table bordered responsive hover size="sm">
            <thead className="thead-light">
              <tr>
                <th>Product Code</th>
                <th>Product Name</th>
                <th>Sales Qty</th>
                <th>Sales SubTotal</th>
                <th>Sales TotalCost</th>
                <th>Balance Qty</th>
                <th>Balance Cost</th>
                <th>Profit</th>
                <th>PO Qty</th>
                <th>Supplier</th>
              </tr>
            </thead>
            <tbody>
              { salesData?.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center">
                    No Data
                  </td>
                </tr>
              ) : (
                salesData?.map((row) => (
                  <tr key={row.product_code}>
                    <td>{row.product_code}</td>
                    <td style={{ color: "#2b7bbf", cursor: "pointer" }}>
                      {row.product_name}
                    </td>
                    <td>{Number(row.sale_qty || 0).toFixed(2)}</td>
                    <td>{Number(row.sale_subtotal || 0).toFixed(2)}</td>
                    <td>{Number(row.sale_totalcost || 0).toFixed(2)}</td>
                    <td>{Number(row.balance_qty || 0).toFixed(2)}</td>
                    <td>{Number(row.balance_cost || 0).toFixed(2)}</td>
                    <td>{Number(row.profit || 0).toFixed(2)}</td>
                    <td>
                      <InputRowPoQty
                        current={row.po_qty || 0}
                        productCode={row.product_code}
                        onSave={(newQty) =>
                          handleUpdatePoQty(row.product_code, newQty)
                        }
                      />
                    </td>
                    <td>
                      <Input value={row.supplier || ""} readOnly />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
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
