import React, { useState, useEffect } from 'react';
import {
  Container,
  Button,
  Table,
  Input,
  InputGroup,
  InputGroupText,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Col,
} from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus, FaFilter, FaSearch } from 'react-icons/fa';
import moment from 'moment';
import api from '../../constants/api';

const BrandCli = () => {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalRecords, setTotalRecords] = useState(0);
  const [filterStatus, setFilterStatus] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const navigate = useNavigate();

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await api.get('brandcli/get_all_brand_cli', {
        params: {
          page: currentPage,
          search: searchTerm,
          status: filterStatus,
        },
      });
      setCategories(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
      setTotalRecords(response.data.pagination.totalRecords);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Handle search
  const handleSearch = () => {
    setCurrentPage(1);
    fetchCategories();
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await api.delete(`brandcli/delete_brand_cli/${id}`);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [currentPage, searchTerm, filterStatus]);

  return (
    <Container fluid className="p-4" style={{ backgroundColor: '#f0f4fa', minHeight: '100vh' }}>
      <h3 className="mb-4">Brand Management</h3>

      {/* 🔹 Top Bar */}
      <Row className="align-items-center mb-3">
        {/* Left: Add New Button */}
        <Col md="6">
          <Button color="primary" onClick={() => navigate('/BrandDetails')}>
            <FaPlus /> Add New (+)
          </Button>
        </Col>

        {/* Right: Search + Filter */}
        <Col md="6" className="d-flex justify-content-end align-items-center">
          <InputGroup style={{ width: '300px' }}>
            <Input
              placeholder="Search Brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <InputGroupText onClick={handleSearch} style={{ cursor: 'pointer' }}>
              <FaSearch />
            </InputGroupText>
          </InputGroup>

          {/* Funnel icon beside search */}
          <InputGroupText
            onClick={() => setShowFilters(!showFilters)}
            style={{
              cursor: 'pointer',
              backgroundColor: '#fff',
              border: '1px solid #ced4da',
              borderRadius: '5px',
              marginLeft: '8px',
            }}
          >
            <FaFilter />
          </InputGroupText>
        </Col>
      </Row>

      {/* 🔹 Filter Dropdown (only shows when funnel clicked) */}
      {showFilters && (
        <Row className="mb-3 justify-content-end">
          <Col md="3">
            <Input
              type="select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All </option>
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </Input>
          </Col>
        </Row>
      )}

      {/* 🔹 Brand Table */}
      <Table bordered hover responsive>
        <thead className="table-light">
          <tr>
            <th style={{ width: '80px', textAlign: 'center' }}>Action</th>
            <th>Brand Name</th>
            <th>Sort Order</th>
            <th>Status</th>
            <th>Created By</th>
            <th>Modified On</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.brand_cli_id}>
              <td style={{ textAlign: 'center' }}>
                <FaTrash
                  style={{ cursor: 'pointer', color: '#dc3545' }}
                  onClick={() => handleDelete(cat.brand_cli_id)}
                />
              </td>
              <td>
                <Link to={`/BrandEdit/${cat.brand_cli_id}`} style={{ textDecoration: 'none' }}>
                  {cat.brand_name}
                </Link>
              </td>
              <td>{cat.sort_order}</td>
              <td>{cat.is_active ? 'Active' : 'Inactive'}</td>
              <td>{cat.created_by}</td>
              <td>{moment(cat.updated_at).format('DD/MM/YYYY')}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* 🔹 Pagination */}
      <div className="d-flex justify-content-between align-items-center">
        <span>Total Records: {totalRecords}</span>
        <Pagination>
          <PaginationItem disabled={currentPage === 1}>
            <PaginationLink previous onClick={() => setCurrentPage(currentPage - 1)} />
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .slice(0, 5)
            .map((page) => (
              <PaginationItem active={page === currentPage} key={page}>
                <PaginationLink onClick={() => setCurrentPage(page)}>{page}</PaginationLink>
              </PaginationItem>
            ))}

          {totalPages > 5 && (
            <>
              <PaginationItem disabled>
                <PaginationLink>...</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink onClick={() => setCurrentPage(totalPages)}>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          <PaginationItem disabled={currentPage === totalPages}>
            <PaginationLink next onClick={() => setCurrentPage(currentPage + 1)} />
          </PaginationItem>
        </Pagination>
      </div>
    </Container>
  );
};

export default BrandCli;
