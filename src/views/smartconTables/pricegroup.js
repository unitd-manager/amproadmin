// pages/PriceGroup/PriceGroupList.js

import React, { useEffect, useState } from 'react';
import { Table, Button, Input, InputGroup, InputGroupText } from 'reactstrap';
import * as Icon from 'react-feather';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../constants/api';
import message from '../../components/Message';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';

const PriceGroupList = () => {
  const [priceGroups, setPriceGroups] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 15;
  const navigate = useNavigate();

  const getPriceGroups = () => {
    api
      .get('/pricegroup/getAll')
      .then((res) => {
        setPriceGroups(res.data.data);
      })
      .catch(() => {
        message('Unable to fetch Price Groups', 'error');
      });
  };

  const deletePriceGroup = (id) => {
    api
      .post('/pricegroup/delete', { price_group_id:id })
      .then(() => {
        message('Deleted successfully', 'success');
        getPriceGroups();
      })
      .catch(() => message('Delete failed', 'error'));
  };

  useEffect(() => {
    getPriceGroups();
  }, []);

  const filteredPriceGroups = priceGroups.filter((pg) =>
    (pg.price_group_name || '').toLowerCase().includes(search)
  );
  const totalPages = Math.max(1, Math.ceil(filteredPriceGroups.length / recordsPerPage));
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredPriceGroups.slice(indexOfFirstRecord, indexOfLastRecord);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, priceGroups.length]);

  return (
    <div className="MainDiv">
      <div className="container-fluid">
        <BreadCrumbs />
        <h4 className="mb-4">Contact Group Management</h4>
        <div className="row">
          <div className="col-12">
            <div className="card" style={{ border: '1px solid #efefef' }}>
              <div className="card-body d-flex justify-content-between align-items-center" style={{ padding: '15px' }}>
                <Button 
                  color="primary" 
                  onClick={() => navigate('/pricegroupDetails')} 
                  style={{ 
                    backgroundColor: '#244a59', 
                    color: 'white',
                    borderRadius: '5px',
                    padding: '8px 16px',
                    border: 'none'
                  }}
                >
                  Add New(+)
                </Button>
                <div style={{ width: '300px' }}>
                  <InputGroup>
                    <Input
                      placeholder="Search Contact Group..."
                      onChange={(e) => setSearch(e.target.value.toLowerCase())}
                    />
                    <InputGroupText style={{ backgroundColor: '#244a59', color: 'white' }}>
                      <Icon.Search size={16} />
                    </InputGroupText>
                  </InputGroup>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-12">
            <div className="card" style={{ border: '1px solid #efefef' }}>
              <div className="card-body" style={{ padding: '0px' }}>
                <Table bordered responsive style={{ marginBottom: '0' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={{ width: '10%', padding: '12px 8px', textAlign: 'center' }}>Action</th>
            <th style={{ width: '30%', padding: '12px 8px' }}>Group Name</th>
            <th style={{ width: '30%', padding: '12px 8px' }}>Status</th>
              <th style={{ width: '30%', padding: '12px 8px' }}>Created On</th>
            <th style={{ width: '30%', padding: '12px 8px' }}>Modified On</th>
          </tr>
        </thead>
        <tbody>
          {filteredPriceGroups.length > 0 ? (
            currentRecords.map((pg) => (
                <tr key={pg.id} style={{ borderBottom: '1px solid #efefef' }}>
                  <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                    <Button 
                      size="sm" 
                      style={{ 
                        backgroundColor: '#244a59', 
                        border: 'none',
                        borderRadius: '4px',
                        padding: '5px 10px'
                      }} 
                      onClick={() => deletePriceGroup(pg.price_group_id)}
                    >
                      <Icon.Trash2 size={14} />
                    </Button>
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <Link to={`/PriceGroupEdit/${pg.price_group_id}`} style={{ color: '#244a59' }}>
                      {pg.price_group_name}
                    </Link>
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <span style={{ color: pg.status === 1 ? 'green' : 'red', fontWeight: 'bold' }}>
                      {pg.status ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 8px' }}>{pg.creation_date ? pg.creation_date.split('T')[0] : 'N/A'}</td>
                  <td style={{ padding: '12px 8px' }}>{pg.modification_date ? pg.modification_date.split('T')[0] : 'N/A'}</td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                No data available in table
              </td>
            </tr>
          )}
        </tbody>
      </Table>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-12 d-flex justify-content-between align-items-center">
            <div>
              <span>Total Records: {filteredPriceGroups.length}</span>
            </div>
            <div>
              <Button 
                style={{ 
                  marginRight: '10px', 
                  backgroundColor: 'white', 
                  color: '#244a59',
                  border: '1px solid #ced4da',
                  borderRadius: '5px'
                }}
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                PREVIOUS
              </Button>
              <Button 
                style={{ 
                  backgroundColor: '#6c757d', 
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '35px',
                  height: '35px',
                  padding: '0',
                  margin: '0 5px'
                }}
              >
                {currentPage}
              </Button>
              <Button 
                style={{ 
                  marginLeft: '10px', 
                  backgroundColor: 'white', 
                  color: '#244a59',
                  border: '1px solid #ced4da',
                  borderRadius: '5px'
                }}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                NEXT
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceGroupList;
