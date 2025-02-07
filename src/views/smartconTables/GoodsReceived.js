import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Input,
  Table,
  Button,
  Pagination,
  PaginationItem,
  PaginationLink,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
} from "reactstrap";
import { FaSearch, FaPrint, FaTrash } from "react-icons/fa";

const GoodsReceiveManagement = () => {
  const [filters, setFilters] = useState({
    tranNo: "",
    fromDate: "",
    toDate: "",
    supplier: "",
    status: "Open",
    invoiceNo: "",
  });

  const [transactions, setTransactions] = useState([
    {
      tranNo: "GRA202502-000024",
      tranDate: "05/02/2025",
      supplier: "ALIN FOOD PRODUCT LIMITED",
      status: "Open",
      invoiceNo: "1",
      subTotal: "30161.41",
      tax: "0.00",
      netTotal: "30161.41",
    },
  ]);

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  return (
    <Container fluid>
      <h4 className="mt-4 mb-3 text-center">Goods Receive Management</h4>
      <Row className="mb-3">
        <Col md="2">
          <Input
            type="text"
            placeholder="Tran No"
            value={filters.tranNo}
            onChange={(e) => handleFilterChange("tranNo", e.target.value)}
          />
        </Col>
        <Col md="2">
          <Input
            type="date"
            value={filters.fromDate}
            onChange={(e) => handleFilterChange("fromDate", e.target.value)}
          />
        </Col>
        <Col md="2">
          <Input
            type="date"
            value={filters.toDate}
            onChange={(e) => handleFilterChange("toDate", e.target.value)}
          />
        </Col>
        <Col md="2">
          <Input
            type="select"
            value={filters.supplier}
            onChange={(e) => handleFilterChange("supplier", e.target.value)}
          >
            <option>Select All Supplier</option>
            <option>ALIN FOOD PRODUCT LIMITED</option>
            <option>Supplier B</option>
          </Input>
        </Col>
        <Col md="2">
          <Input
            type="select"
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <option>Open</option>
            <option>Closed</option>
            <option>Pending</option>
          </Input>
        </Col>
        <Col md="2">
          <Input
            type="text"
            placeholder="Invoice No"
            value={filters.invoiceNo}
            onChange={(e) => handleFilterChange("invoiceNo", e.target.value)}
          />
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <Button color="primary">
            <FaSearch /> Search
          </Button>{" "}
          <Button color="dark">
            <FaPrint /> Print
          </Button>{" "}
          <Button color="danger">
            <FaTrash /> Delete
          </Button>{" "}
          <UncontrolledDropdown>
            <DropdownToggle caret color="info">
              New Transaction
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem>Create New</DropdownItem>
              <DropdownItem>Upload Transaction</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Col>
      </Row>

      <Table bordered responsive>
        <thead>
          <tr>
            <th></th>
            <th>Tran No</th>
            <th>Tran Date</th>
            <th>Supplier</th>
            <th>Status</th>
            <th>Invoice No</th>
            <th>Sub Total</th>
            <th>Tax</th>
            <th>Net Total</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index}>
              <td>
                <Input type="checkbox" />
              </td>
              <td>{transaction.tranNo}</td>
              <td>{transaction.tranDate}</td>
              <td>{transaction.supplier}</td>
              <td>{transaction.status}</td>
              <td>{transaction.invoiceNo}</td>
              <td>{transaction.subTotal}</td>
              <td>{transaction.tax}</td>
              <td>{transaction.netTotal}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Row>
        <Col className="d-flex justify-content-end">
          <Pagination>
            <PaginationItem disabled>
              <PaginationLink previous />
            </PaginationItem>
            <PaginationItem active>
              <PaginationLink>1</PaginationLink>
            </PaginationItem>
            <PaginationItem disabled>
              <PaginationLink next />
            </PaginationItem>
          </Pagination>
        </Col>
      </Row>
    </Container>
  );
};

export default GoodsReceiveManagement;
