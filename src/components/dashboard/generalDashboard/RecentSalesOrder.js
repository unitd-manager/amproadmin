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
import { FaFilter } from "react-icons/fa";
import api from "../../../constants/api";

const cardStyle = {
  height: '450px',
  display: 'flex',
  flexDirection: 'column',
};

const cardBodyStyle = {
  flex: '1 1 auto',
  overflowY: 'auto',
};

const getTodayISO = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const RecentSalesOrders = ({ initialFilters = null, customers: initialCustomers = null }) => {
// PropTypes validation
RecentSalesOrders.propTypes = {
  initialFilters: PropTypes.object,
  customers: PropTypes.array,
};
  const [orders, setOrders] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [customers, setCustomers] = useState(initialCustomers || []);
  const [filters, setFilters] = useState(
    initialFilters || {
      fromDate: getTodayISO(),
      toDate: getTodayISO(),
      customerId: "",
    }
  );

  useEffect(() => {
    if (!initialCustomers) {
      api.get("/company/getCompany")
        .then((res) => {
          if (res.data && res.data.data) setCustomers(res.data.data);
        })
        .catch((err) => console.error("Error fetching customers:", err));
    }
  }, [initialCustomers]);

  const fetchOrders = (params) => {
    api.post("/invoice/getFilteredOrders", params)
      .then((res) => {
        if (res.data && res.data.data) setOrders(res.data.data);
        else setOrders([]);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setOrders([]);
      });
  };

  useEffect(() => {
    const t = setTimeout(() => {
      fetchOrders(filters);
    }, 250);
    return () => clearTimeout(t);
  }, [filters]);

  useEffect(() => {
    fetchOrders(filters);
  }, []);

  const onFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((p) => ({ ...p, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ fromDate: getTodayISO(), toDate: getTodayISO(), customerId: "" });
  };

  return (
  <Card className="shadow-sm mb-4" style={cardStyle}>
      <CardHeader className="bg-white">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Recent Sales Orders</h5>
          <div>
            <Button color="light" size="sm" onClick={() => setShowFilters((s) => !s)}>
              <FaFilter />
            </Button>
          </div>
        </div>
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

  <CardBody style={cardBodyStyle}>
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
            {orders.length > 0 ? (
              orders.map((o) => (
                <tr key={o.sales_order_id}>
                  <td>{o.tran_no}</td>
                  <td>{o.tran_date}</td>
                  <td>{o.customer}</td>
                  <td className="text-end">{Number(o.net_total || 0).toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No sales orders found for the selected criteria.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default RecentSalesOrders;
