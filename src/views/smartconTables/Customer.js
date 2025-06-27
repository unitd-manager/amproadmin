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

const Customer = () => {
  const [customer, setCustomer] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customerNameFilter, setCustomerNameFilter] = useState('');
  const [mobileFilter, setMobileFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [modal, setModal] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const dataTableRef = useRef(null);

  const getCustomer = async () => {
    setLoading(true);
    try {
      const res = await api.get('/contact/getContactss', {
        params: {
          company_name: customerNameFilter,
          mobile: mobileFilter,
          is_active: statusFilter === 'Active' ? 1 : statusFilter === 'Inactive' ? 0 : '',
        },
      });
  
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
        await api.post('/contact/deleteContact', { contact_id: contactId });
        message('Customer deleted successfully', 'success');
        getCustomer();
      } catch (error) {
        message('Error deleting customer', 'error');
        console.error('Error deleting customer:', error);
      }
    }
  };

  const handleActivateClick = (contactId) => {
    setSelectedCustomerId(contactId);
    setModal(true);
  };

  const handleActivateCustomer = async () => {
    try {
      await api.post('/contact/updateContactStatus', {
        contact_id: selectedCustomerId,
        is_active: 1,
      });
      message('Customer activated successfully', 'success');
      getCustomer();
      setModal(false);
    } catch (error) {
      message('Error activating customer', 'error');
      console.error('Error activating customer:', error);
    }
  };

  const toggleModal = () => setModal(!modal);

  useEffect(() => {
    getCustomer();
  }, [customerNameFilter, mobileFilter, statusFilter]);

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

  const handleCheckboxChange = (contactId, isChecked) => {
    if (isChecked) {
      setSelectedCustomerIds((prevIds) => [...prevIds, contactId]);
    } else {
      setSelectedCustomerIds((prevIds) => prevIds.filter((id) => id !== contactId));
    }
  };

  const Contentcolumns = [
    { name: '', selector: 'checkbox', width: '3%' },
    { name: '#', selector: 's_no', width: '4%' },
    { name: 'Edit', selector: 'edit', width: 'auto' },
    { name: 'Action', selector: 'action', width: 'auto' },
    { name: 'Customer Code', selector: 'customer_code', sortable: true, grow: 1, wrap: true },
    { name: 'Customer Name', selector: 'company_name', sortable: true, grow: 2, wrap: true },
    { name: 'Address', selector: 'address', sortable: true, grow: 2.5, wrap: true },
    { name: 'Phone No', selector: 'phone', sortable: true, grow: 1, wrap: true },
    { name: 'Email', selector: 'email', sortable: true, grow: 1.5 },
    { name: 'Mobile', selector: 'mobile', sortable: true, grow: 1, wrap: true },
    { name: 'Status', selector: 'formattedStatus', sortable: true, grow: 0.8, wrap: true },
  ];

  return (
    <div className="MainDiv pt-xs-25">
      <BreadCrumbs />
      <div className="d-flex flex-wrap gap-2 mb-3">
        <input
          className="form-control"
          placeholder="Customer Name"
          value={customerNameFilter}
          onChange={(e) => setCustomerNameFilter(e.target.value)}
          style={{ width: '15%' }}
        />
        <input
          className="form-control"
          placeholder="Mobile No."
          value={mobileFilter}
          onChange={(e) => setMobileFilter(e.target.value)}
          style={{ width: '15%' }}
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
        <Button color="primary" className="shadow-none">
          Search
        </Button>
      </div>

      <CommonTable
        loading={loading}
        title="Customer List"
        Button={
          <Link to="/CustomerDetails">
            <Button color="primary" className="shadow-none">
              Add New
            </Button>
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
          {customer.map((element, index) => (
            <tr key={element.contact_id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedCustomerIds.includes(element.contact_id)}
                  onChange={(e) => handleCheckboxChange(element.contact_id, e.target.checked)}
                />
              </td>
              <td>{index + 1}</td>
              <td>
                <Link to={`/CustomerEdit/${element.contact_id}`}>
                  <Icon.Edit2 />
                </Link>
              </td>
              <td>
                {element.is_active !== 1 ? (
                  <Button
                    color="success"
                    className="shadow-none btn-sm"
                    onClick={() => handleActivateClick(element.contact_id)}
                    style={{ padding: '0.25rem 0.5rem', lineHeight: 1 }}
                  >
                    <Icon.Check size={16} />
                  </Button>
                ) : (
                  <Button
                    color="danger"
                    className="shadow-none btn-sm"
                    onClick={() => handleDeleteCustomer(element.contact_id)}
                    style={{ padding: '0.25rem 0.5rem', lineHeight: 1 }}
                  >
                    <Icon.Trash2 size={16} />
                  </Button>
                )}
              </td>
              <td>{element.customer_code || 'N/A'}</td>
              <td>{element.company_name || 'N/A'}</td>
              <td>
                <span style={{ color: 'black' }}>{element.address || ''}</span>
                {element.address && element.address2 && <br />}
                <span style={{ color: 'grey' }}>{element.address2 || ''}</span>
                {!element.address && !element.address2 && 'N/A'}
              </td>
              <td>{element.phone || 'N/A'}</td>
              <td>{element.email || 'N/A'}</td>
              <td>{element.mobile || 'N/A'}</td>
              <td>
                <span
                  style={{
                    color: element.is_active === 1 ? 'green' : 'red',
                    fontWeight: 'bold',
                  }}
                >
                  {element.formattedStatus || 'N/A'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </CommonTable>

      {/* Activation Modal */}
      <Modal isOpen={modal} toggle={toggleModal} centered>
        <ModalHeader toggle={toggleModal}>Activate Customer</ModalHeader>
        <ModalBody>Do you want to activate this customer?</ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleActivateCustomer}>
            Activate
          </Button>
          <Button color="secondary" onClick={toggleModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Customer;
