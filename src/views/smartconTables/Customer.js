import React, { useEffect, useState, useRef } from 'react';
import * as Icon from 'react-feather';
import { Button } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import $ from 'jquery';
import 'datatables.net-buttons/js/buttons.colVis';
import 'datatables.net-buttons/js/buttons.flash';
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.print';
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
  // KEY CHANGE: Use an array to store multiple selected customer IDs
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);

  const dataTableRef = useRef(null);

  const getCustomer = async () => {
    setLoading(true);
    try {
      const res = await api.get('/contact/getContactss', {
        params: {
          company_name: customerNameFilter,
          mobile: mobileFilter,
          status: statusFilter,
        },
      });
      setCustomer(res.data.data || []);
    } catch (error) {
      message('Cannot get Customer Data', 'error');
      console.error("Error fetching customer data:", error);
      setCustomer([]);
    } finally {
      setLoading(false);
    }
  };

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
          dom: 'Bfrtip',
          buttons: [
            {
              extend: 'print',
              text: 'Print',
              className: 'shadow-none btn btn-primary',
            },
            {
              extend: 'excelHtml5',
              text: 'Excel',
              className: 'shadow-none btn btn-success',
            },
            {
              extend: 'copyHtml5',
              text: 'Copy',
              className: 'shadow-none btn btn-info',
            },
          ],
          columnDefs: [
            { targets: [0, 2], orderable: false },
          ],
        });
      }, 100);
    }

    return () => {
      if (dataTableRef.current && $.fn.DataTable.isDataTable(dataTableRef.current)) {
        $(dataTableRef.current).DataTable().destroy();
      }
    };
  }, [customer]);

  // NEW FUNCTION: Handle checkbox change for multiple selections
  const handleCheckboxChange = (contactId, isChecked) => {
    if (isChecked) {
      // Add ID to the array if checked
      setSelectedCustomerIds((prevIds) => [...prevIds, contactId]);
    } else {
      // Remove ID from the array if unchecked
      setSelectedCustomerIds((prevIds) => prevIds.filter((id) => id !== contactId));
    }
  };

  const Contentcolumns = [
    { name: '', selector: 'checkbox', width: '3%' },
    { name: '#', selector: 's_no', width: '4%' },
    { name: 'Edit', selector: 'edit', width: 'auto' },
    { name: 'ID', selector: 'contact_id', sortable: true, grow: 0.5 },
    { name: 'Customer Code', selector: 'customer_code', sortable: true, grow: 1, wrap: true },
    { name: 'Customer Name', selector: 'company_name', sortable: true, grow: 2, wrap: true },
    { name: 'Contact Person', selector: 'first_name', sortable: true, grow: 1.5, wrap: true },
    { name: 'Address', selector: 'address', sortable: true, grow: 2.5, wrap: true },
    { name: 'Phone No', selector: 'phone_no', sortable: true, grow: 1, wrap: true },
    { name: 'Email', selector: 'email', sortable: true, grow: 1.5 },
    { name: 'Mobile', selector: 'mobile', sortable: true, grow: 1, wrap: true },
    { name: 'Status', selector: 'people_status', sortable: true, grow: 0.8, wrap: true },
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
        <Button color="primary" className="shadow-none" disabled>
          Search (Auto)
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
                {/* Checkbox cell */}
                <td>
                  <input
                    type="checkbox"
                    // Check if the current element's ID is in the selectedCustomerIds array
                    checked={selectedCustomerIds.includes(element.contact_id)}
                    // Pass the ID and the checked status to the handler
                    onChange={(e) => handleCheckboxChange(element.contact_id, e.target.checked)}
                  />
                </td>
                <td>{index + 1}</td>
                <td>
                  <Link to={`/CustomerEdit/${element.contact_id}`}>
                    <Icon.Edit2 />
                  </Link>
                </td>
                <td>{element.contact_id || 'N/A'}</td>
                <td>{element.customer_code || 'N/A'}</td>
                <td>{element.company_name || 'N/A'}</td>
                <td>{element.first_name || 'N/A'}</td>
                <td>{element.address || 'N/A'}</td>
                <td>{element.phone || 'N/A'}</td>
                <td>{element.email || 'N/A'}</td>
                <td>{element.mobile || 'N/A'}</td>
                <td>{element.people_status || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
      </CommonTable>
    </div>
  );
};

export default Customer;