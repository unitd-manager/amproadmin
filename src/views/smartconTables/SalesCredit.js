import React, { useEffect, useState } from 'react';
import * as Icon from 'react-feather';
import { Button, Dropdown, DropdownToggle } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
//import $ from 'jquery';
import 'datatables.net-buttons/js/buttons.colVis';
import 'datatables.net-buttons/js/buttons.flash';
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.print';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import message from '../../components/Message';
import api from '../../constants/api';
import PrintCreditNoteList from '../../components/PDF/PrintCreditNoteList';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import CommonTable from '../../components/CommonTable';

import './salesOrderTable.css';


const Test = () => {
  const [supplier, setSupplier] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedSalesCreditIds, setSelectedSalesCreditIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  const [tranNoFilter, setTranNoFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('Not Paid');

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
console.log(selectedOrder);
  const getSupplier = () => {
    setLoading(true);
    api
      .post('/salesreturn/getMainCreditNoteSearch', {
        credit_note_code: tranNoFilter,
        from_date: fromDate,
        to_date: toDate,
        customer: customerFilter,
        status: statusFilter,
      })
      .then((res) => {
        setSupplier(res.data.data);
        setTimeout(() => {
        
        }, 500);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getSupplier();
  }, []);

  useEffect(() => {
    if (supplier && supplier.length > 0) {
      setSelectAll(selectedSalesCreditIds.length === supplier.length);
    }
  }, [selectedSalesCreditIds, supplier]);

  // Add delete handler
  const handleDeleteOrders = async () => {
    if (selectedSalesCreditIds.length === 0) {
      message('Please select at least one credit note to delete', 'error');
      return;
    }
    if (!window.confirm('Are you sure you want to delete the selected credit notes?')) return;
    try {
      await api.post('/salesreturn/deleteSalesCredit', { credit_note_id: selectedSalesCreditIds.join(',') });
      message('Selected credit notes deleted successfully', 'success');
      setSelectedSalesCreditIds([]);
      setSelectedOrder(null);
      getSupplier();
    } catch (error) {
      message(error.response?.data?.message || 'Failed to delete credit notes', 'error');
    }
  };

  const columns = [
    { name: (
      <input
        type="checkbox"
        checked={selectAll}
        ref={(input) => {
          if (input) {
            input.indeterminate =
              selectedSalesCreditIds.length > 0 &&
              selectedSalesCreditIds.length < (supplier?.length || 0);
          }
        }}
        onChange={() => {
          if (selectAll) {
            setSelectedSalesCreditIds([]); // deselect all
          } else {
            setSelectedSalesCreditIds(supplier.map((s) => s.credit_note_id)); // select all
          }
          setSelectAll(!selectAll);
        }}
      />
    ),
    selector: 'checkbox',
    cell: (row) => (
      <input
        type="checkbox"
        checked={selectedSalesCreditIds.includes(row.credit_note_id)}
        onChange={() => {
          setSelectedSalesCreditIds((prev) =>
            prev.includes(row.credit_note_id)
              ? prev.filter((id) => id !== row.credit_note_id)
              : [...prev, row.credit_note_id]
          );
          setSelectedOrder(row);
        }}
      />
    ),
    grow: 0,
    width: '3%'
    },
    { name: '#', selector: 'credit_note_id', grow: 0, wrap: true, width: '4%' },
    { name: 'Edit', selector: 'edit', cell: () => <Icon.Edit2 />, grow: 0, width: 'auto', button: true, sortable: false },
    { name: 'Tran NO', selector: 'tran_no', sortable: true, grow: 0, wrap: true },
    { name: 'Tran Date', selector: 'tran_date', sortable: true, grow: 0, wrap: true },
    { name: 'Customer', selector: 'company_name', sortable: true, grow: 0, wrap: true },
    // { name: 'Status', selector: 'status', sortable: true, grow: 0, wrap: true },
    // { name: 'Printed', selector: 'printed', sortable: true, grow: 0, wrap: true },
    { name: 'Sub Total', selector: 'sub_total', sortable: true, grow: 0, wrap: true },
    { name: 'Tax', selector: 'tax', sortable: true, grow: 0, wrap: true },
    { name: 'Net Total', selector: 'net_total', sortable: true, grow: 0, wrap: true },
    { name: 'Balance Amount', selector: 'balance_amount', sortable: true, grow: 0, wrap: true },
  ];


  return (
    <div className="MainDiv">
      <div className="pt-xs-25">
        <BreadCrumbs />
        {/* Search Filters */}
        <div className="d-flex flex-wrap gap-2 mb-3">
          <input className="" placeholder="Tran No" value={tranNoFilter} onChange={(e) => setTranNoFilter(e.target.value)} />
          <input type="date" className="" placeholder="From Date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          <input type="date" className="" placeholder="To Date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          <input className="" placeholder="Customer" value={customerFilter} onChange={(e) => setCustomerFilter(e.target.value)} />
          <select className="form-select"   style={{ width: '15%' }}
           value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All</option>
            <option value="Not Paid">Not Paid</option>
            <option value="Paid">Paid</option>
          </select>
          <Button color="primary" onClick={getSupplier}>Search</Button>
          <Button
            color="danger"
            className="ms-2"
            disabled={selectedSalesCreditIds.length === 0}
            onClick={handleDeleteOrders}
            data-testid="delete-button"
          >
            <Icon.Trash2 size={16} />
          </Button>
          <Button
            color="secondary"
            className="ms-2"
            disabled={selectedSalesCreditIds.length === 0}
          >
            
              <PrintCreditNoteList
                                 id={selectedSalesCreditIds}
      settingdetails={null}
      lineItem={null}
    />
          </Button>
        </div>
<div className="sales-order-table">
        <CommonTable
          loading={loading}
          title="Credit Note List"
          Button={
            <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
              <DropdownToggle color="primary" caret className="shadow-none">
                <Button color="primary" tag={Link} to="/SalesCreditDetails?tab=1" className="shadow-none">
                  New Transaction
                </Button>
              </DropdownToggle>
            
          
            </Dropdown>
          }
        >
          <thead>
            <tr>
              {columns.map((col) => (
                <td key={col.name}>{col.name}</td>
              ))}
            </tr>
          </thead>
          <tbody>
            {supplier &&
              supplier.map((element, index) => (
                <tr key={element.credit_note_id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedSalesCreditIds.includes(element.credit_note_id)}
                      onChange={() => {
                        setSelectedSalesCreditIds((prev) =>
                          prev.includes(element.credit_note_id)
                            ? prev.filter((id) => id !== element.credit_note_id)
                            : [...prev, element.credit_note_id]
                        );
                        setSelectedOrder(element);
                      }}
                    />
                  </td>
                  <td>{index + 1}</td>
                 <td>
  {element.status !== 'Closed' ? (
    <Link to={`/SalesCreditEdit/${element.credit_note_id}?tab=1`}>
      <Icon.Edit2 />
    </Link>
  ) : (
    ''
  )}
</td>

                  <td>{element.credit_note_code}</td>
                  <td>{element.credit_note_date}</td>
                  <td>{element.company_name}</td>
                  <td>{element.sub_total || ''}</td>
                  <td>{element.tax || ''}</td>
                  <td>{element.credit_note_amount || ''}</td>
                  <td>{element.balance_amount || ''}</td>
                </tr>
              ))}
          </tbody>
        </CommonTable>
        </div>
      </div>
    <ToastContainer />
    </div>
  );
};

export default Test;
