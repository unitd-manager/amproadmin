// src/views/smartconTables/StockRequest.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { Button, Input, Row, Col, Spinner } from "reactstrap";
import { Edit2, Trash2 } from "react-feather";
import api from '../../constants/api';

const StockRequest = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [stockRequests, setStockRequests] = useState([]);
  const [selectedRequests, setSelectedRequests] = useState([]);

  // Filters
  const [stockReqNoFilter, setStockReqNoFilter] = useState("");
  const [fromLocationFilter, setFromLocationFilter] = useState("");
  const [toLocationFilter, setToLocationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Fetch Stock Requests
  const getStockRequests = () => {
    setLoading(true);
    api
      .get("/stockRequest/getstockrequest", {
        stock_req_no: stockReqNoFilter,
        from_location: fromLocationFilter,
        to_location: toLocationFilter,
        status: statusFilter,
      })
      .then((res) => {
        setStockRequests(res.data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    getStockRequests();
  }, []);

  // Delete Selected
  const deleteSelected = async () => {
    if (!selectedRequests.length) return;
    if (!window.confirm("Are you sure you want to delete selected Stock Requests?")) return;
    setLoading(true);
    try {
      await api.post("/stockRequest/deleteStockRequest", {
        stock_request_id: selectedRequests,
      });
      getStockRequests();
    } catch {
      setLoading(false);
    }
  };

  // Table Columns
  const columns = [
    {
      name: "",
      cell: (row) => (
        <input
          type="checkbox"
          checked={selectedRequests.includes(row.stock_request_id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRequests([...selectedRequests, row.stock_request_id]);
            } else {
              setSelectedRequests(selectedRequests.filter((id) => id !== row.stock_request_id));
            }
          }}
        />
      ),
      grow: 0,
      width: "3%",
    },
    { name: "#", selector: (row) => row.stock_request_id, width: "4%" },
    {
      name: "Edit",
      cell: (row) => (
        <Link to={`/StockRequestEdit/${row.stock_request_id}`}>
          <Edit2 size={16} />
        </Link>
      ),
      grow: 0,
      button: true,
      sortable: false,
    },
    { name: "Stock Req No", selector: (row) => row.stock_req_no, sortable: true },
    { name: "From Location", selector: (row) => row.from_location, sortable: true },
    { name: "To Location", selector: (row) => row.to_location, sortable: true },
    { name: "Status", selector: (row) => row.status, sortable: true },
    { name: "Stock Req Date", selector: (row) => row.stock_req_date, format: (row) => (row.stock_req_date ? new Date(row.stock_req_date).toLocaleDateString() : ''), sortable: true },
    { name: "Creation Date", selector: (row) => row.creation_date, format: (row) => (row.creation_date ? new Date(row.creation_date).toLocaleDateString() : ''), sortable: true },
    { name: "Remarks", selector: (row) => row.remarks, sortable: true },
  ];

  return (
    <div>
      <h4>Stock Requests</h4>

      {/* Filters */}
      <Row className="mb-2">
        <Col md="3">
          <Input
            placeholder="Stock Req No"
            value={stockReqNoFilter}
            onChange={(e) => setStockReqNoFilter(e.target.value)}
          />
        </Col>
        <Col md="3">
          <Input
            placeholder="From Location"
            value={fromLocationFilter}
            onChange={(e) => setFromLocationFilter(e.target.value)}
          />
        </Col>
        <Col md="3">
          <Input
            placeholder="To Location"
            value={toLocationFilter}
            onChange={(e) => setToLocationFilter(e.target.value)}
          />
        </Col>
        <Col md="3">
          <Input
            placeholder="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </Col>
      </Row>

      <Row className="mb-2">
        <Col>
          <Button color="success" onClick={() => navigate("/StockRequestDetails")}>
            + New Transaction
          </Button>{" "}
          <Button color="primary" onClick={getStockRequests}>
            Search
          </Button>{" "}
          <Button color="danger" onClick={deleteSelected} disabled={!selectedRequests.length}>
            <Trash2 size={14} /> Delete
          </Button>
        </Col>
      </Row>

      {/* Data Table */}
      {loading ? (
        <Spinner color="primary" />
      ) : (
        <DataTable
          columns={columns}
          data={stockRequests}
          highlightOnHover
          pagination
          responsive
          dense
        />
      )}
    </div>
  );
};

export default StockRequest;
