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
  PaginationLink
} from 'reactstrap';
import { FaTrash, FaPlus, FaFilter, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../../constants/api';

const DepartmentCli = () => {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalRecords, setTotalRecords] = useState(0);

const navigate=useNavigate();

  const fetchCategories = async () => {
    try {
      const response = await api.get('departmentcli/get_all_department_cli', {
        params: {
          page: currentPage,
          search: searchTerm
        }
      });
      setCategories(response.data.data);
      setTotalPages(response.data.totalPages);
      setTotalRecords(response.data.totalRecords);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchCategories();
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`departmentcli/delete_department_cli/${id}`);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, [currentPage, searchTerm]);
  
  return (
    <Container fluid className="p-4" style={{ backgroundColor: '#f0f4fa', minHeight: '100vh' }}>
      <h3 className="mb-4">Department Management</h3>
      <Button color="primary" className="mb-3" onClick={()=>{
        navigate('/DepartmentDetails')
      }}>
        <FaPlus /> Add New(+)
      </Button>

      <InputGroup className="mb-3" style={{ maxWidth: '400px' }}>
        <Input
          placeholder="Search Category.."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <InputGroupText onClick={handleSearch} style={{ cursor: 'pointer' }}>
          <FaSearch />
        </InputGroupText>
        <InputGroupText style={{ cursor: 'pointer' }}>
          <FaFilter />
        </InputGroupText>
      </InputGroup>

      <Table bordered hover responsive>
        <thead className="table-light">
          <tr>
            <th>Action</th>
            {/* <th>Category Name</th> */}
            <th>Department Name</th>
            <th>SortOrder</th>
            <th>Status</th>
            <th>Modified By</th>
            <th>Modified On</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.department_cli_id}>
              <td style={{ textAlign: 'center' }}>
                <FaTrash style={{ cursor: 'pointer' }} onClick={() => handleDelete(cat.department_cli_id)} />
              </td>
              {/* <td>{cat.category_name}</td> */}
              <td>{cat.department_name}</td>
              <td>{cat.sort_order}</td>
              <td>{cat.is_active ? 'active':'inactive'}</td>
              <td>{cat.updated_by}</td>
              <td>{cat.updated_at}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-between align-items-center">
        <span>Total Records : {totalRecords}</span>
        <Pagination>
          <PaginationItem disabled={currentPage === 1}>
            <PaginationLink previous onClick={() => setCurrentPage(currentPage - 1)} />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map((page) => (
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
                <PaginationLink onClick={() => setCurrentPage(totalPages)}>{totalPages}</PaginationLink>
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

export default DepartmentCli;
