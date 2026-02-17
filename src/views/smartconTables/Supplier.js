import React, { useEffect, useState, useRef } from 'react';
import * as Icon from 'react-feather';
import { Button, Card, CardBody, Input, Row, Col, Label, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
//import $ from 'jquery';
import { Link } from 'react-router-dom';
import message from '../../components/Message';
import api from '../../constants/api';
import CommonTable from '../../components/CommonTable';
import './Customer.scss';

const Supplier = () => {
  const [supplier, setSupplier] = useState([]);
  const [loading, setLoading] = useState(false);
  const [supplierNameFilter, setSupplierNameFilter] = useState('');
  const [mobileFilter, setMobileFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const filterRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowStatusFilter(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getCustomer = async () => {
    setLoading(true);
    try {
      const params = {
        company_name: supplierNameFilter,
        mobile: mobileFilter,
      };
      
      if (statusFilter !== 'all') {
        params.is_active = statusFilter === 'active' ? 1 : 0;
      }

      const res = await api.get('/supplier/getSupplierss', { params });
  
      const formattedCustomers = res.data.data.map(item => ({
        ...item,
        formattedStatus: item.is_active === 1 ? 'Active' : 'Inactive',
      }));
  
      setSupplier(formattedCustomers || []);
    } catch (error) {
      message('Cannot get Supplier Data', 'error');
      console.error("Error fetching supplier data:", error);
      setSupplier([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSupplier = async (contactId) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await api.post('/supplier/deleteSupplier', { supplier_id: contactId });
        message('Supplier deleted successfully', 'success');
        getCustomer();
      } catch (error) {
        message('Error deleting supplier', 'error');
        console.error('Error deleting supplier:', error);
      }
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    getCustomer();
  }, [supplierNameFilter, mobileFilter, statusFilter]);

  useEffect(() => {
    const totalPages = Math.ceil((supplier?.length || 0) / pageSize) || 1;
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [supplier, pageSize]);

  


  return (
    <div className="MainDiv">
      <Card className="mb-4">
        <CardBody className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="mb-0">Supplier List</h5>
            <Link to="/SupplierDetails">
              <Button color="primary" size="sm" className="d-flex align-items-center">
                <Icon.Plus size={14} className="me-1" /> Add New
              </Button>
            </Link>
          </div>
          
          <Row className="mb-3">
            <Col md={4}>
              <div className="form-group mb-3 mb-md-0">
                <Input
                  type="text"
                  className="form-control-sm"
                  placeholder="Search Supplier.."
                  value={supplierNameFilter}
                  onChange={(e) => setSupplierNameFilter(e.target.value)}
                />
              </div>
            </Col>
            <Col md={4}>
              <div className="form-group mb-3 mb-md-0">
                <Input
                  type="text"
                  className="form-control-sm"
                  placeholder="Search Phone No"
                  value={mobileFilter}
                  onChange={(e) => setMobileFilter(e.target.value)}
                />
              </div>
            </Col>
            <Col md={4} className="d-flex align-items-center gap-2">
              <div className="position-relative d-flex align-items-center" ref={filterRef}>
                <Button 
                  color="light" 
                  size="sm" 
                  className="d-flex align-items-center"
                  onClick={() => setShowStatusFilter(!showStatusFilter)}
                >
                  <Icon.Filter size={14} className="me-1" />
                </Button>
                {showStatusFilter && (
                  <div 
                    className="bg-white border rounded shadow p-2 position-absolute" 
                    style={{
                      width: '160px',
                      top: '100%',
                      left: 0,
                      zIndex: 1000,
                      marginTop: '5px'
                    }}
                  >
                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        id="allStatus"
                        name="statusFilter"
                        checked={statusFilter === 'all'}
                        onChange={() => {
                          setStatusFilter('all');
                          setShowStatusFilter(false);
                          getCustomer();
                        }}
                      />
                      <Label className="form-check-label" htmlFor="allStatus">
                        All Status
                      </Label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        id="activeStatus"
                        name="statusFilter"
                        checked={statusFilter === 'active'}
                        onChange={() => {
                          setStatusFilter('active');
                          setShowStatusFilter(false);
                          getCustomer();
                        }}
                      />
                      <Label className="form-check-label" htmlFor="activeStatus">
                        Active
                      </Label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        id="inactiveStatus"
                        name="statusFilter"
                        checked={statusFilter === 'inactive'}
                        onChange={() => {
                          setStatusFilter('inactive');
                          setShowStatusFilter(false);
                          getCustomer();
                        }}
                      />
                      <Label className="form-check-label" htmlFor="inactiveStatus">
                        Inactive
                      </Label>
                    </div>
                  </div>
                )}
              </div>
              <Button 
                color="primary" 
                size="sm" 
                className="d-flex align-items-center"
                onClick={getCustomer}
              >
                <Icon.Search size={14} className="me-1" /> Search
              </Button>
            </Col>
          </Row>

          <div className="table-responsive">
            <CommonTable loading={loading}>
              <thead>
                <tr>
                  <th style={{ width: '50px' }}></th>
                  <th style={{ width: '50px' }}></th>
                  <th>Supplier Code</th>
                  <th>Supplier Name</th>
                  <th>Address</th>
                  <th>Phone No</th>
                  <th>Email</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {supplier
                  .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                  .map((element) => (
                  <tr key={element.supplier_id}>
                    <td>
                      <button 
                        type="button"
                        className="btn btn-sm btn-icon p-0"
                        onClick={() => handleDeleteSupplier(element.supplier_id)}
                        title="Delete"
                      >
                        <Icon.Trash2 size={16} className="text-danger" />
                      </button>
                    </td>
                    <td>
                      <input 
                        type="checkbox" 
                        className="form-check-input"
                        onChange={() => {}}
                      />
                    </td>
                    <td>
                      <Link to={`/SupplierEdit/${element.supplier_id}`} className="text-primary text-decoration-none">
                        {element.supplier_code || ''}
                      </Link>
                    </td>
                    <td>
                      <Link to={`/SupplierEdit/${element.supplier_id}`} className="text-primary text-decoration-none">
                        {element.supplier_name || element.company_name || ''}
                      </Link>
                    </td>
                 <td className="text-truncate" style={{ maxWidth: '200px' }}>
  <div>
    <div>{element.address1 || ''}</div>
    {element.address2 && (
      <div style={{ fontSize: '0.85em', color: '#6c757d' }}>
        {element.address2}
      </div>
    )}
  </div>
</td>
                    <td>{element.mobile || ''}</td>
                    <td>{element.email || ''}</td>
                    <td>
                      <span className={`badge ${((element.is_active === 1 || element.is_active === true) || String(element.status || '').toLowerCase() === 'active') ? 'bg-success' : 'bg-danger'}`}>
                        {((element.is_active === 1 || element.is_active === true) || String(element.status || '').toLowerCase() === 'active') ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </CommonTable>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-3">
            <span>Total Records : {supplier?.length || 0}</span>
            <div className="d-flex align-items-center gap-2">
              <span className="me-2">Rows per page</span>
              <Input
                type="select"
                bsSize="sm"
                style={{ width: 80 }}
                value={pageSize}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10) || 20;
                  setPageSize(val);
                  setCurrentPage(1);
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </Input>
            </div>
            <Pagination className="mb-0">
              <PaginationItem disabled={currentPage === 1}>
                <PaginationLink previous onClick={() => setCurrentPage(currentPage - 1)} />
              </PaginationItem>
              {Array.from({ length: Math.ceil((supplier?.length || 0) / pageSize) || 1 }, (_, i) => i + 1)
                .slice(0, 5)
                .map((page) => (
                  <PaginationItem active={page === currentPage} key={page}>
                    <PaginationLink onClick={() => setCurrentPage(page)}>{page}</PaginationLink>
                  </PaginationItem>
                ))}
              {Math.ceil((supplier?.length || 0) / pageSize) > 5 && (
                <>
                  <PaginationItem disabled>
                    <PaginationLink>...</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink onClick={() => setCurrentPage(Math.ceil((supplier?.length || 0) / pageSize))}>
                      {Math.ceil((supplier?.length || 0) / pageSize)}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}
              <PaginationItem disabled={currentPage === (Math.ceil((supplier?.length || 0) / pageSize) || 1)}>
                <PaginationLink next onClick={() => setCurrentPage(currentPage + 1)} />
              </PaginationItem>
            </Pagination>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Supplier;
