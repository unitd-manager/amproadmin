import React, { useEffect, useState, useRef } from 'react';
import * as Icon from 'react-feather';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import message from '../../components/Message';
import api from '../../constants/api';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import CommonTable from '../../components/CommonTable';

const MemberType = () => {
  const [memberTypes, setMemberTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [memberTypeFilter, setMemberTypeFilter] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [modal, setModal] = useState(false);
  const dataTableRef = useRef(null);
console.log(setSelectedId);
  const getMemberTypes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/membertype/getAll', {
        params: {
          member_type_name: memberTypeFilter,
        },
      });

      const responseData = res.data.data || [];
      const formatted = responseData.map((item) => ({
        ...item,
        status: item.is_active === 1 ? 'Active' : 'Inactive',
      }));

      setMemberTypes(formatted);
    } catch (error) {
      message('Cannot get Member Type data', 'error');
      console.error('Error fetching Member Types:', error);
      setMemberTypes([]);
    } finally {
      setLoading(false);
    }
  };

  // const handleDelete = async (id) => {
  //   if (window.confirm('Are you sure you want to delete this Member Type?')) {
  //     try {
  //       await api.post('/membertype/delete', { id });
  //       message('Member Type deleted successfully', 'success');
  //       getMemberTypes();
  //     } catch (error) {
  //       message('Error deleting Member Type', 'error');
  //       console.error('Delete error:', error);
  //     }
  //   }
  // };

  const handleActivate = async () => {
    try {
      await api.post('/membertype/updateStatus', {
        id: selectedId,
        is_active: 1,
      });
      message('Member Type activated successfully', 'success');
      getMemberTypes();
      setModal(false);
    } catch (error) {
      message('Error activating Member Type', 'error');
      console.error('Activate error:', error);
    }
  };

  const toggleModal = () => setModal(!modal);

  useEffect(() => {
    getMemberTypes();
  }, [memberTypeFilter]);

  useEffect(() => {
    if (dataTableRef.current && $.fn.DataTable.isDataTable(dataTableRef.current)) {
      $(dataTableRef.current).DataTable().destroy();
    }

    if (memberTypes && memberTypes.length > 0) {
      setTimeout(() => {
        dataTableRef.current = $('#example').DataTable({
          pagingType: 'full_numbers',
          pageLength: 20,
          processing: true,
          destroy: true,
          dom: 'rtip',
          searching: false,
          columnDefs: [{ targets: [0, 1], orderable: false }],
        });
      }, 100);
    }

    return () => {
      if (dataTableRef.current && $.fn.DataTable.isDataTable(dataTableRef.current)) {
        $(dataTableRef.current).DataTable().destroy();
      }
    };
  }, [memberTypes]);

  const Contentcolumns = [
    { name: 'Action', selector: 'action', width: '100px' },
    { name: 'Member Type Name', selector: 'member_type_name', sortable: true, grow: 2 },
    { name: 'Status', selector: 'status', sortable: true, width: '150px' },
    { name: 'Modified By', selector: 'modified_by', sortable: true, width: '150px' },
    { name: 'Modified On', selector: 'modified_on', sortable: true, width: '150px' },
  ];

  return (
    <div className="MainDiv pt-xs-25">
      <BreadCrumbs />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Member Type Management</h2>
        <div className="d-flex align-items-center">
          <div className="me-2" style={{ position: 'relative' }}>
            <Input
              placeholder="Search Member Type..."
              value={memberTypeFilter}
              onChange={(e) => setMemberTypeFilter(e.target.value)}
              style={{ width: '250px', paddingRight: '30px' }}
            />
            <Button 
              color="light" 
              style={{ 
                position: 'absolute', 
                right: '0', 
                top: '0', 
                background: 'transparent',
                border: 'none',
                boxShadow: 'none'
              }} 
              onClick={getMemberTypes}
            >
              <Icon.Search size={16} />
            </Button>
          </div>
          <Button 
            color="light" 
            outline 
            style={{ border: 'none', background: 'transparent' }}
          >
            <Icon.Filter size={16} />
          </Button>
        </div>
      </div>

      <div className="mb-3">
        <Link to="/memberDetails">
          <Button 
            color="primary" 
            className="shadow-none" 
            style={{ 
              borderRadius: '20px', 
              backgroundColor: '#1e4976',
              padding: '5px 15px'
            }}
          >
            Add New(+)
          </Button>
        </Link>
      </div>

      <CommonTable
        loading={loading}
        title=""
        Button={null}
      >
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            {Contentcolumns.map((col) => (
              <th key={col.name} style={{ padding: '10px', borderBottom: '1px solid #dee2e6' }}>{col.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {memberTypes && memberTypes.length > 0 ? (
            memberTypes.map((item) => (
              <tr key={item.member_type_id}>
                <td style={{ padding: '10px', textAlign: 'center' }}>
                  <div className="d-flex justify-content-center">
                    <Link to={`/MembertypeEdit/${item.member_type_id}`}>
                      <Button color="primary" className="shadow-none btn-sm" style={{ backgroundColor: '#1e4976' }}>
                        <Icon.Edit size={16} />
                      </Button>
                    </Link>
                  </div>
                </td>
                <td style={{ padding: '10px' }}>{item.member_type_name || 'N/A'}</td>
                <td style={{ padding: '10px' }}>
                  <span style={{ color: item.status === 'Active' ? 'green' : 'red', fontWeight: 'bold' }}>
                    {item.status}
                  </span>
                </td>
                <td style={{ padding: '10px' }}>{item.modified_by || 'N/A'}</td>
                <td style={{ padding: '10px' }}>{item.modified_on || 'N/A'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={Contentcolumns.length} className="text-center" style={{ padding: '20px' }}>
                No data available in table
              </td>
            </tr>
          )}
        </tbody>
      </CommonTable>

      {/* Modal */}
      <Modal isOpen={modal} toggle={toggleModal} centered>
        <ModalHeader toggle={toggleModal}>Activate Member Type</ModalHeader>
        <ModalBody>Do you want to activate this member type?</ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleActivate}>Activate</Button>
          <Button color="secondary" onClick={toggleModal}>Cancel</Button>
        </ModalFooter>
      </Modal>
      
      <div className="d-flex justify-content-between mt-3">
        <div>
          <Button color="light" outline className="me-2" style={{ border: '1px solid #dee2e6', borderRadius: '4px' }}>PREVIOUS</Button>
          <Button color="light" outline style={{ border: '1px solid #dee2e6', borderRadius: '4px' }}>NEXT</Button>
        </div>
        <div>
          <span>Total Records: {memberTypes.length}</span>
        </div>
      </div>
    </div>
  );
};

export default MemberType;
