import React, { useEffect, useState, useRef } from 'react';
import * as Icon from 'react-feather';
import { Button, Card, CardBody, Input, Row, Col,Label } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import message from '../../components/Message';
import api from '../../constants/api';
import CommonTable from '../../components/CommonTable';
import './Customer.scss';

const Customer = () => {
  const [customer, setCustomer] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customerNameFilter, setCustomerNameFilter] = useState('');
  const [mobileFilter, setMobileFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const dataTableRef = useRef(null);
  const filterRef = useRef(null);

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
        company_name: customerNameFilter,
        mobile: mobileFilter,
      };
      
      if (statusFilter !== 'all') {
        params.is_active = statusFilter === 'active' ? 1 : 0;
      }

      const res = await api.get('/contact/getContactss', { params });
  
      const formattedCustomers = res.data.data.map(item => ({
        ...item,
        formattedStatus: item.is_active === 1 ? 'Active' : 'Inactive',
      }));
  
      setCustomer(formattedCustomers || []);
    } catch (error) {
      message('Cannot get Customer Data', 'error');
      console.error("Error fetching customer data:", error);
      setCustomer([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomer = async (contactId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await api.post('/contact/deleteContact', { company_id: contactId });
        message('Customer deleted successfully', 'success');
        getCustomer();
      } catch (error) {
        message('Error deleting customer', 'error');
        console.error('Error deleting customer:', error);
      }
    }
  };

  useEffect(() => {
    getCustomer();
  }, [customerNameFilter, mobileFilter]);

  useEffect(() => {
    if (dataTableRef.current && $.fn.DataTable.isDataTable(dataTableRef.current)) {
      $(dataTableRef.current).DataTable().destroy();
    }

    if (customer && customer.length > 0) {
      setTimeout(() => {
        dataTableRef.current = $('#example').DataTable({
          pagingType: 'full_numbers',
          pageLength: 20,
          processing: true,
          destroy: true,
          dom: 'rtip',
          searching: false,
          buttons: [],
          columnDefs: [{ targets: [0, 2, 3], orderable: false }],
        });
      }, 100);
    }

    return () => {
      if (dataTableRef.current && $.fn.DataTable.isDataTable(dataTableRef.current)) {
        $(dataTableRef.current).DataTable().destroy();
      }
    };
  }, [customer]);


  return (
    <div className="MainDiv">
      <Card className="mb-4">
        <CardBody className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="mb-0">Customer List</h5>
            <Link to="/CustomerDetails">
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
                  placeholder="Search Customer.."
                  value={customerNameFilter}
                  onChange={(e) => setCustomerNameFilter(e.target.value)}
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
                  <th>Customer Code</th>
                  <th>Customer Name</th>
                  <th>Address</th>
                  <th>Phone No</th>
                  <th>Email</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {customer.map((element) => (
                  <tr key={element.company_id}>
                    <td>
                      <button 
                        type="button"
                        className="btn btn-sm btn-icon p-0"
                        onClick={() => handleDeleteCustomer(element.company_id)}
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
                      <Link to={`/CustomerEdit/${element.company_id}`} className="text-primary text-decoration-none">
                        {element.customer_code || 'N/A'}
                      </Link>
                    </td>
                    <td>
                      <Link to={`/CustomerEdit/${element.company_id}`} className="text-primary text-decoration-none">
                        {element.company_name || 'N/A'}
                      </Link>
                    </td>
                    <td className="text-truncate" style={{ maxWidth: '200px' }}>
                      {element.address || 'N/A'}
                    </td>
                    <td>{element.phone || 'N/A'}</td>
                    <td>{element.email || 'N/A'}</td>
                    <td>
                      <span className={`badge ${element.is_active ? 'bg-success' : 'bg-danger'}`}>
                        {element.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </CommonTable>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Customer;
