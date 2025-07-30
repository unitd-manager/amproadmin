import React, { useEffect, useState, useRef } from 'react';
import * as Icon from 'react-feather';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
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
  const [statusFilter, setStatusFilter] = useState('');
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
          is_active: statusFilter === 'Active' ? 1 : statusFilter === 'Inactive' ? 0 : '',
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
  }, [memberTypeFilter, statusFilter]);

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
    { name: 'Action', selector: 'action', width: 'auto' },
    { name: 'Member Type Name', selector: 'member_type_name', sortable: true, grow: 2 },
    { name: 'Status', selector: 'status', sortable: true, grow: 1 },
    { name: 'Modified By', selector: 'modified_by', sortable: true, grow: 1.5 },
    { name: 'Modified On', selector: 'modified_on', sortable: true, grow: 1.5 },
  ];

  return (
    <div className="MainDiv pt-xs-25">
      <BreadCrumbs />
      <div className="d-flex flex-wrap gap-2 mb-3">
        <input
          className="form-control"
          placeholder="Search Member Type"
          value={memberTypeFilter}
          onChange={(e) => setMemberTypeFilter(e.target.value)}
          style={{ width: '20%' }}
        />
        <select
          className="form-select"
          style={{ width: '15%' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <Button color="primary" className="shadow-none" onClick={getMemberTypes}>
          Search
        </Button>
      </div>

      <CommonTable
        loading={loading}
        title="Member Type List"
        Button={
          <Link to="/memberDetails">
            <Button color="primary" className="shadow-none">Add New</Button>
          </Link>
        }
      >
        <thead>
          <tr>
            {Contentcolumns.map((col) => (
              <th key={col.name}>{col.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {memberTypes && memberTypes.length > 0 ? (
            memberTypes.map((item) => (
              <tr key={item.member_type_id}>
                <td>
                  <div className="d-flex gap-1">
                    <Link to={`/MembertypeEdit/${item.member_type_id}`}>
                      <Button color="primary" className="shadow-none btn-sm">
                        <Icon.Edit size={16} />
                      </Button>
                    </Link>
                    {/* {item.is_active !== 1 ? (
                      <Button
                        color="success"
                        className="shadow-none btn-sm"
                        onClick={() => {
                          setSelectedId(item.member_type_id);
                          setModal(true);
                        }}
                      >
                        <Icon.Check size={16} />
                      </Button>
                    ) : (
                      <Button
                        color="danger"
                        className="shadow-none btn-sm"
                        onClick={() => handleDelete(item.member_type_id)}
                      >
                        <Icon.Trash2 size={16} />
                      </Button>
                    )} */}
                  </div>
                </td>
                <td>{item.member_type_name || 'N/A'}</td>
                <td>
                  <span style={{ color: item.status === 'Active' ? 'green' : 'red', fontWeight: 'bold' }}>
                    {item.status}
                  </span>
                </td>
                <td>{item.modified_by || 'N/A'}</td>
                <td>{item.modified_on || 'N/A'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={Contentcolumns.length} className="text-center">
                No records found
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
    </div>
  );
};

export default MemberType;
