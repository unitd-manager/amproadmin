import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Input,
  Row,
  Col,
  Label,
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../constants/api';

const Paymode = () => {
  const [paymodes, setPaymodes] = useState([]);
  const [filteredPaymodes, setFilteredPaymodes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const navigate = useNavigate();

  // Fetch all paymodes
  useEffect(() => {
    api.get('/paymode/list')
      .then((res) => {
        setPaymodes(res.data);
        setFilteredPaymodes(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  // Auto-filter on searchTerm or statusFilter change
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    let filtered = paymodes.filter((item) =>
      item.paymode_name.toLowerCase().includes(term)
    );

    if (statusFilter !== '') {
      filtered = filtered.filter((item) =>
        item.status?.toString() === statusFilter
      );
    }

    setFilteredPaymodes(filtered);
    
    setCurrentPage(1);
  }, [searchTerm, statusFilter, paymodes]);
const handleDelete = (id) => {
  if (window.confirm('Are you sure you want to delete this paymode?')) {
    api
      .delete(`/paymode/delete/${id}`)
      .then(() => {
        // Refresh data after deletion
        const updated = paymodes.filter((item) => item.paymode_id !== id);
        setPaymodes(updated);
        setFilteredPaymodes(updated);
      })
      .catch((err) => console.error('Delete error:', err));
  }
};

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredPaymodes.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.max(1, Math.ceil(filteredPaymodes.length / recordsPerPage));

  return (
    <div className="container">
      <Row className="align-items-center mb-3">
        <Col xs="6">
          <h4>Paymode Management</h4>
        </Col>
        <Col xs="6" className="text-end">
          <Button color="primary" onClick={() => navigate('/PaymodeDetailsCL')}>
            Add New(+)
          </Button>
        </Col>
      </Row>

      <Row className="mb-3 align-items-center">
        <Col xs="3">
          <Label className="mb-1">Filter (Active/Inactive):</Label>
          <Input
            type="select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </Input>
        </Col>
        <Col xs="6">
          <Label className="mb-1">Search Paymode:</Label>
          <Input
            type="text"
            placeholder="Type to search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col xs="2">
          <Label className="invisible d-block">Search Button</Label>
        </Col>
      </Row>

      <Table bordered responsive>
        <thead>
          <tr>
            <th>Action</th>
            <th>Paymode Name</th>
            <th>Sort Order</th>
            <th>Remarks</th>
            <th>Created User</th>
            <th>Modified On</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((item) => (
            <tr key={item.paymode_id}>
              <td>
                <Button
  color="danger"
  size="sm"
  onClick={() => handleDelete(item.paymode_id)}
>
  🗑️
</Button>

              </td>
              <td>
                <span
                  role="button"
                  tabIndex={0}
                  style={{ color: 'blue', cursor: 'pointer' }}
                  onClick={() => navigate(`/PaymodeEditCL/${item.paymode_id}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      navigate(`/PaymodeEditCL/${item.paymode_id}`);
                    }
                  }}
                >
                  {item.paymode_name}
                </span>
              </td>
              <td>{item.sort_order}</td>
              <td>{item.remarks}</td>
              <td>{item.created_by}</td>
              <td>{item.modification_date?.split('T')[0]}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-between align-items-center">
        <div>
          <strong>Total Records: {filteredPaymodes.length}</strong>
        </div>
        <div>
          <Button
            color="light"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </Button>
          <span className="mx-2">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            color="light"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Paymode;
