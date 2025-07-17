import React, { useState, useEffect } from 'react';
import {
  Row, Col, Form, Button, Input, Table, Card, CardBody
} from 'reactstrap';
import { FaSearch, FaTrash } from 'react-icons/fa';
import api from '../../constants/api';
import message from '../../components/Message'; // If you use a message/toast system

const UnapprovedModules = () => {
  const [filters, setFilters] = useState({
    moduleNo: '',
    fromDate: '',
    toDate: '',
    user: '',
  });
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const fetchModules = () => {
    setLoading(true);
    // Always include status: 'UnApproved' in the filter
    api.post('/salesOrder/getsalesorder', { ...filters, status: 'UnApproved' })
      .then((res) => {
        setModules(res.data.data || []);
        setLoading(false);
      })
      .catch(() => {
        setModules([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchModules();
    // eslint-disable-next-line
  }, []);

  // Handle checkbox change
  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  // Handle delete
  const handleDelete = () => {
    if (selectedIds.length === 0) {
      message('Please select at least one record to delete.', 'warning');
      return;
    }
    api
      .post('/salesOrder/deleteSalesOrder', { sales_order_id: selectedIds })
      .then(() => {
        message('Deleted successfully', 'success');
        setSelectedIds([]);
        fetchModules(); // Refresh list
      })
      .catch(() => {
        message('Delete failed', 'error');
      });
  };

  // Approve handler
  const handleApprove = async () => {
    if (selectedIds.length === 0) {
      message('Please select at least one record to approve.', 'warning');
      return;
    }
    try {
      // Approve each selected sales order
      await Promise.all(
        selectedIds.map((id) =>
          api.post('/salesOrder/UpdateSalesOrderStatus', { sales_order_id: id })
        )
      );
      message('Approved successfully', 'success');
      setSelectedIds([]);
      fetchModules(); // Refresh list
    } catch (err) {
      message('Approve failed', 'error');
    }
  };

  return (
    <Card>
      <CardBody>
        <h4>Unapproved Modules Management</h4>
        <Form>
          <Row form className="mb-3">
            <Col md={3}>
              <Input
                type="text"
                name="tran_no"
                placeholder="Tran No"
                value={filters.tran_no}
                onChange={handleInputChange}
              />
            </Col>
            <Col md={3}>
              <Input
                type="date"
                name="tran_date"
                placeholder="Tran Date"
                value={filters.tran_date}
                onChange={handleInputChange}
              />
            </Col>
            <Col md={3}>
              <Input
                type="date"
                name="tran_date"
                placeholder="Tran Date"
                value={filters.tran_date}
                onChange={handleInputChange}
              />
            </Col>
            <Col md={2}>
              <Input
                type="text"
                name="company_name"
                placeholder="Customer"
                value={filters.company_name}
                onChange={handleInputChange}
              />
            </Col>
            <Col md={1}>
              <Button color="primary" onClick={fetchModules} type="button">
                <FaSearch />
              </Button>
            </Col>
            <Col md={1}>
              <Button color="danger" type="button" onClick={handleDelete}>
                <FaTrash />
              </Button>
            </Col>
          </Row>
        </Form>
        <Button color="primary" className="mb-3 float-end" onClick={handleApprove}>
          Approve
        </Button>
        {/* <Button color="danger" className="mb-3 float-end me-2" onClick={handleDelete}>
          <FaTrash />
        </Button> */}
        <Table bordered>
          <thead>
            <tr>
              <th></th>
              <th>Tran No</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Net Total</th>
              <th>Created By</th>
              <th>Status</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center">Loading...</td>
              </tr>
            ) : modules.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center">No data available in table</td>
              </tr>
            ) : (
              modules.map((mod, idx) => (
                <tr key={mod.sales_order_id || idx}>
                  <td>
                    <Input
                      type="checkbox"
                      checked={selectedIds.includes(mod.sales_order_id)}
                      onChange={() => handleCheckboxChange(mod.sales_order_id)}
                    />
                  </td>
                  <td>{mod.tran_no}</td>
                  <td>{mod.tran_date}</td>
                  <td>{mod.company_name}</td>
                  <td>{mod.net_total}</td>
                  <td>{mod.created_by}</td>
                  <td>{mod.status}</td>
                  <td>{mod.remarks}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
        <div>Total Records: {modules.length}</div>
      </CardBody>
    </Card>
  );
};

export default UnapprovedModules; 