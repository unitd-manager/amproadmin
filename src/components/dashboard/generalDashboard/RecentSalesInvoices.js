import PropTypes from 'prop-types';
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Table,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { FaChartBar, FaMoneyBillWave, FaFilter } from "react-icons/fa";
import api from "../../../constants/api";

const getTodayISO = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const RecentSalesInvoices = ({ initialFilters = null, customers: initialCustomers = null }) => {
// PropTypes validation
RecentSalesInvoices.propTypes = {
  initialFilters: PropTypes.object,
  customers: PropTypes.array,
};
  const [invoices, setInvoices] = useState([]);
  const [totals, setTotals] = useState({ totalSales: 0, totalOutstanding: 0 });
  const [showFilters, setShowFilters] = useState(false);
  const [customers, setCustomers] = useState(initialCustomers || []);
  const [filters, setFilters] = useState(
    initialFilters || {
      fromDate: getTodayISO(),
      toDate: getTodayISO(),
      customerId: "",
    }
  );

  // fetch customers if not provided
  useEffect(() => {
    if (!initialCustomers) {
      api.get("/company/getCompany")
        .then((res) => {
          if (res.data && res.data.data) setCustomers(res.data.data);
        })
        .catch((err) => console.error("Error fetching customers:", err));
    }
  }, [initialCustomers]);

  // fetch invoices
  const fetchInvoices = (params) => {
    api.post("/invoice/getFilteredInvoices", params)
      .then((res) => {
        if (res.data && res.data.data) setInvoices(res.data.data);
        else setInvoices([]);
      })
      .catch((err) => {
        console.error("Error fetching invoices:", err);
        setInvoices([]);
      });
  };

  // fetch totals (use same params so totals reflect filter)
  const fetchTotals = (params) => {
    // Backend earlier used getSalesTotalOutstanding without params; this code sends params.
    api.post("/invoice/getSalesTotalOutstanding", params)
      .then((res) => {
        // support both array result or object
        const payload = res.data && res.data.data ? res.data.data : [];
        if (Array.isArray(payload) && payload.length > 0) {
          setTotals(payload[0]);
        } else if (typeof payload === "object") {
          setTotals(payload);
        } else {
          setTotals({ totalSales: 0, totalOutstanding: 0 });
        }
      })
      .catch((err) => {
        console.error("Error fetching totals:", err);
        setTotals({ totalSales: 0, totalOutstanding: 0 });
      });
  };

  // when filters change -> auto fetch (debounced)
  useEffect(() => {
    const t = setTimeout(() => {
      fetchInvoices(filters);
      fetchTotals(filters);
    }, 250);
    return () => clearTimeout(t);
  }, [filters]);

  // initial load
  useEffect(() => {
    fetchInvoices(filters);
    fetchTotals(filters);
  }, []);

  const onFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((p) => ({ ...p, [name]: value }));
  };

  const clearFilters = () => {
    const cleared = { fromDate: getTodayISO(), toDate: getTodayISO(), customerId: "" };
    setFilters(cleared);
  };

  return (
    <Card className="shadow-sm mb-4">
      <CardHeader className="bg-white">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Recent Sales Invoices</h5>
          <div className="d-flex align-items-center">
            <Button
              color="light"
              size="sm"
              className="me-2"
              onClick={() => setShowFilters((s) => !s)}
              title="Toggle Filters"
            >
              <FaFilter />
            </Button>
          </div>
        </div>

        <Row className="mt-2 align-items-center">
          <Col>
            <div className="d-flex align-items-center">
              <FaChartBar size={24} className="me-2" />
              <div>
                <strong>Total Sales: </strong>${(totals.totalSales || 0).toFixed(2)}
              </div>
            </div>
          </Col>
          <Col>
            <div className="d-flex align-items-center">
              <FaMoneyBillWave size={24} className="me-2" />
              <div>
                <strong>Total Outstanding: </strong>${(totals.totalOutstanding || 0).toFixed(2)}
              </div>
            </div>
          </Col>
        </Row>
      </CardHeader>

      {showFilters && (
        <div className="p-3 border-bottom">
          <Form>
            <Row>
              <Col md="4">
                <FormGroup>
                  <Label>From Date</Label>
                  <Input type="date" name="fromDate" value={filters.fromDate} onChange={onFilterChange} />
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label>To Date</Label>
                  <Input type="date" name="toDate" value={filters.toDate} onChange={onFilterChange} />
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label>Customer</Label>
                  <Input type="select" name="customerId" value={filters.customerId} onChange={onFilterChange}>
                    <option value="">All Customers</option>
                    {customers.map((c) => (
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

      <CardBody style={{ maxHeight: "300px", overflowY: "auto" }}>
        <Table bordered responsive>
          <thead className="table-light">
            <tr>
              <th>Invoice No</th>
              <th>Date</th>
              <th>Customer</th>
              <th className="text-end">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length > 0 ? (
              invoices.map((inv) => (
                <tr key={inv.invoice_id}>
                  <td>{inv.invoice_code}</td>
                  <td>{inv.invoice_date}</td>
                  <td>{inv.customer}</td>
                  <td className="text-end">{Number(inv.invoice_amount || 0).toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No invoices found for the selected criteria.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default RecentSalesInvoices;
