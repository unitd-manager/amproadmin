/*eslint-disable*/
import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Table,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
} from "reactstrap";
import { FaChartBar, FaMoneyBillWave, FaFilter } from "react-icons/fa";
import api from "../../constants/api"; // ✅ adjust path if needed

// helper for current date in yyyy-mm-dd
const getTodayISO = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const PurchaseInvoiceFilterCard = () => {
  // your existing data states
  const [recentPurchaseInvoices, setRecentPurchaseInvoices] = useState([]);
  const [purchaseTotalValue, setPurchaseTotalValue] = useState({
    totalPurchase: 0,
    totalOutstanding: 0,
  });

  // filter-related states
  const [showFilters, setShowFilters] = useState(false);
  const [customersForFilter, setCustomersForFilter] = useState([]);
  const [filters, setFilters] = useState({
    fromDate: getTodayISO(),
    toDate: getTodayISO(),
    customerId: "",
  });

  // fetch filtered invoices
  const fetchFilteredPurchaseInvoices = (params) => {
    api
      .post("/getFilteredPurchaseInvoices", params)
      .then((res) => {
        if (res.data && res.data.data) {
          const invoices = res.data.data;
          setRecentPurchaseInvoices(invoices);

          // calculate totals
          const totalPurchase = invoices.reduce(
            (sum, i) => sum + Number(i.invoice_amount || 0),
            0
          );
          const totalOutstanding = invoices.reduce(
            (sum, i) => sum + Number(i.outstanding_amount || 0),
            0
          );
          setPurchaseTotalValue({ totalPurchase, totalOutstanding });
        } else {
          setRecentPurchaseInvoices([]);
          setPurchaseTotalValue({ totalPurchase: 0, totalOutstanding: 0 });
        }
      })
      .catch((err) => {
        console.error("Error fetching filtered invoices:", err);
        setRecentPurchaseInvoices([]);
        setPurchaseTotalValue({ totalPurchase: 0, totalOutstanding: 0 });
      });
  };

  const onFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ fromDate: getTodayISO(), toDate: getTodayISO(), customerId: "" });
  };

  // fetch customer list
  useEffect(() => {
    api
      .get("/company/getCompany")
      .then((res) => {
        if (res.data && res.data.data) setCustomersForFilter(res.data.data);
      })
      .catch((err) => console.error("Error fetching customers:", err));
  }, []);

  // fetch invoices when filters change
  useEffect(() => {
    fetchFilteredPurchaseInvoices(filters);
  }, [filters]);

  return (
    <Col md="6">
      <Card className="shadow-sm mb-4 h-100">
        <CardHeader className="bg-white d-flex flex-column justify-content-between">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Recent Purchase Invoices</h5>
            <Button
              color="light"
              size="sm"
              onClick={() => setShowFilters((s) => !s)}
              title="Toggle Filters"
            >
              <FaFilter />
            </Button>
          </div>

          <div className="d-flex align-items-center mt-2">
            <FaChartBar size={24} color="#007bff" className="me-2" />
            <div>
              <strong>Total Purchase: </strong>${purchaseTotalValue.totalPurchase}
            </div>
          </div>
          <div className="d-flex align-items-center mt-2">
            <FaMoneyBillWave size={24} color="#28a745" className="me-2" />
            <div>
              <strong>Total Outstanding: </strong>${purchaseTotalValue.totalOutstanding}
            </div>
          </div>
        </CardHeader>

        {/* Filter Section */}
        {showFilters && (
          <div className="p-3 border-bottom">
            <Form>
              <Row>
                <Col md="4">
                  <FormGroup>
                    <Label>From Date</Label>
                    <Input
                      type="date"
                      name="fromDate"
                      value={filters.fromDate}
                      onChange={onFilterChange}
                    />
                  </FormGroup>
                </Col>
                <Col md="4">
                  <FormGroup>
                    <Label>To Date</Label>
                    <Input
                      type="date"
                      name="toDate"
                      value={filters.toDate}
                      onChange={onFilterChange}
                    />
                  </FormGroup>
                </Col>
                <Col md="4">
                  <FormGroup>
                    <Label>Customer</Label>
                    <Input
                      type="select"
                      name="customerId"
                      value={filters.customerId}
                      onChange={onFilterChange}
                    >
                      <option value="">All Customers</option>
                      {customersForFilter.map((c) => (
                        <option key={c.company_id} value={c.company_id}>
                          {c.company_name}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col className="d-flex justify-content-end">
                  <Button color="secondary" size="sm" onClick={clearFilters}>
                    Clear
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
        )}

        <CardBody>
          <Table bordered responsive>
            <thead className="table-light">
              <tr>
                <th>Date</th>
                <th>Invoice No</th>
                <th>Customer</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentPurchaseInvoices.length > 0 ? (
                recentPurchaseInvoices.map((inv) => (
                  <tr key={inv.purchase_invoice_id}>
                    <td>{inv.invoice_date}</td>
                    <td>{inv.invoice_code}</td>
                    <td>{inv.company_name}</td>
                    <td>{inv.invoice_amount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No purchase invoices found for selected filters.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </Col>
  );
};

export default PurchaseInvoiceFilterCard;
