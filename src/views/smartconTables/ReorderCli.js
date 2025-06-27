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
import moment from 'moment';
import api from '../../constants/api';


const ReorderCli = () => {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalRecords, setTotalRecords] = useState(0);
const [isLoadingPO, setIsLoadingPO] = useState(false);

 const handleLoadPO = async () => {
  try {
    setIsLoadingPO(true);
    const res = await api.get('/reordercli/load_po');

    if (res.data && res.data.length > 0) {
      // Append or replace, based on your logic:
      // Option A: Replace current list
      setCategories(res.data);

      // Option B (if you want to append): 
      // setCategories(prev => [...prev, ...res.data]);
    } else {
      alert('No PO items to load.');
    }
  } catch (err) {
    console.error('Error loading PO:', err);
    alert('Failed to load PO.');
  } finally {
    setIsLoadingPO(false);
  }
};


  const fetchCategories = async () => {
    try {
      const response = await api.get('reordercli/get_all_reorder_cli', {
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
      await api.delete(`reordercli/delete_reorder_cli/${id}`);
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
      <h3 className="mb-4">Reorder Management</h3>
      {/* <Button color="primary" className="mb-3">
        <FaPlus /> Load PO
      </Button> */}
      <Button color="primary" className="mb-3" onClick={handleLoadPO} disabled={isLoadingPO}>
  {isLoadingPO ? 'Loading...' : <><FaPlus /> Load PO</>}
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
            <th>Bin Name</th>
            <th>Floor Level</th>
            <th>Rack No</th>
            <th>Rack Level</th>
            <th>Max Occupancy</th>
            <th>Status</th>
            <th>Modified On</th>
            <th>Modified By</th>
                                
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.reorder_cli_id}>
              <td style={{ textAlign: 'center' }}>
                <FaTrash style={{ cursor: 'pointer' }} onClick={() => handleDelete(cat.reorder_cli_id)} />
              </td>
              <td>{cat.bin_name}</td>
              <td>{cat.floor_level}</td>
              <td>{cat.rack_no}</td>
               <td>{cat.rack_level}</td>
              <td>{cat.max_occupancy}</td>
              <td>{cat.status}</td>
              <td>{moment(cat.updatet_at).format('DD/MM/YYYY')}</td>
              <td>{cat.updatet_by}</td>
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

export default ReorderCli;
