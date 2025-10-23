import React, { useEffect, useState } from 'react';
import { FaFilter } from 'react-icons/fa';
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
  const [showFilter, setShowFilter] = useState(false);
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
        (item.is_active !== undefined ? item.is_active.toString() : '') === statusFilter
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
      <h4 className="mb-3">Paymode Management</h4>
      <Row className="align-items-center mb-2">
        <Col xs="6" className="d-flex align-items-center">
          <Button
            color="primary"
            className="custom-btn"
            onClick={() => navigate('/PaymodeDetailsCL')}
            style={{ minWidth: 130, fontWeight: 600 }}
          >
            Add New(+)
          </Button>
        </Col>
        <Col xs="6" className="d-flex justify-content-end align-items-center">
          <Label className="mb-0 me-2">Search Paymode:</Label>
          <Input
            type="text"
            placeholder="Type to search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 180, marginRight: 8 }}
          />
          <Button
            color="primary"
            className="custom-btn me-2"
            onClick={() => setSearchTerm(searchTerm)}
            style={{ minWidth: 80 }}
          >
            Search
          </Button>
          <span style={{ cursor: 'pointer' }} onClick={() => setShowFilter((prev) => !prev)}>
            <FaFilter size={22} color="#0d6efd" title="Filter" />
          </span>
        </Col>
      </Row>
      {showFilter && (
        <Row className="mb-2 align-items-center">
          <Col xs="12" className="d-flex justify-content-end align-items-center">
            <Label className="mb-0 me-2">Filter(Active/Inactive):</Label>
            <Input
              type="select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: 120, display: 'inline-block' }}
            >
              <option value="">All</option>
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </Input>
          </Col>
        </Row>
      )}

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

      <div className="d-flex flex-column align-items-center mt-3">
        <div className="d-flex align-items-center justify-content-center mb-2" style={{ border: '1px solid #0d6efd', borderRadius: 20, padding: '4px 24px', background: '#f8f9fa' }}>
          <Button
            color="primary"
            className="custom-btn"
            style={{ borderRadius: 20, marginRight: 10, minWidth: 90 }}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </Button>
          <span style={{ fontWeight: 600, color: '#0d6efd', margin: '0 12px' }}>
            {currentPage}
          </span>
          <Button
            color="primary"
            className="custom-btn"
            style={{ borderRadius: 20, minWidth: 90 }}
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Next
          </Button>
        </div>
        <div style={{ width: '100%', textAlign: 'left', marginTop: 4 }}>
          <strong>Total Records : {filteredPaymodes.length}</strong>
        </div>
      </div>
      <style>{`
        .custom-btn {
          background-color: #0d6efd !important;
          border-color: #0d6efd !important;
          color: #fff !important;
          transition: background 0.2s, color 0.2s;
        }
        .custom-btn:hover, .custom-btn:focus {
          background-color: #38b6ff !important;
          border-color: #38b6ff !important;
          color: #fff !important;
        }
      `}</style>
    </div>
  );
};

export default Paymode;
