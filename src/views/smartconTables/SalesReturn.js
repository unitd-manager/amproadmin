import React, { useEffect, useState } from 'react';
import * as Icon from 'react-feather';
// import { Trash2 } from 'react-feather';
import { Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
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
import PrintPerfoma from '../../components/PDF/PrintSalesReturn';

import api from '../../constants/api';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import CommonTable from '../../components/CommonTable';
import './salesOrderTable.css';

const Test = () => {
  const [supplier, setSupplier] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedSalesReturnIds, setSelectedSalesReturnIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  const [tranNoFilter, setTranNoFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  const getSupplier = () => {
    setLoading(true);
    api
      .post('/salesreturn/getMainInvoiceSearch', {
        sales_return_code: tranNoFilter,
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
      setSelectAll(selectedSalesReturnIds.length === supplier.length);
    }
  }, [selectedSalesReturnIds, supplier]);

  const handleDeleteOrders = async () => {
    if (selectedSalesReturnIds.length === 0) {
      message('Please select at least one sales return to delete', 'error');
      return;
    }
    if (!window.confirm('Are you sure you want to delete the selected sales returns?')) return;
    try {
      await api.post('/salesreturn/deleteSalesReturn', { sales_return_id: selectedSalesReturnIds.join(',') });
      message('Selected sales returns deleted successfully', 'success');
      setSelectedSalesReturnIds([]);
      setSelectedOrder(null);
      getSupplier();
    } catch (error) {
      message(error.response?.data?.message || 'Failed to delete sales returns', 'error');
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
              selectedSalesReturnIds.length > 0 &&
              selectedSalesReturnIds.length < (supplier?.length || 0);
          }
        }}
        onChange={() => {
          if (selectAll) {
            setSelectedSalesReturnIds([]); // deselect all
          } else {
            setSelectedSalesReturnIds(supplier.map((s) => s.sales_return_id)); // select all
          }
          setSelectAll(!selectAll);
        }}
      />
    ),
    selector: 'checkbox',
    cell: (row) => (
      <input
        type="checkbox"
        checked={selectedSalesReturnIds.includes(row.sales_return_id)}
        onChange={() => {
          setSelectedSalesReturnIds((prev) =>
            prev.includes(row.sales_return_id)
              ? prev.filter((id) => id !== row.sales_return_id)
              : [...prev, row.sales_return_id]
          );
          setSelectedOrder(row);
        }}
      />
    ),
    grow: 0,
    width: '3%'
    },
    { name: '#', selector: 'sales_return_id', grow: 0, wrap: true, width: '4%' },
    { name: 'Edit', selector: 'edit', cell: () => <Icon.Edit2 />, grow: 0, width: 'auto', button: true, sortable: false },
    { name: 'Tran NO', selector: 'sales_return_code', sortable: true, grow: 0, wrap: true },
    { name: 'Tran Date', selector: 'sales_return_date', sortable: true, grow: 0, wrap: true },
    { name: 'Customer', selector: 'company_name', sortable: true, grow: 0, wrap: true },
    { name: 'Sub Total', selector: 'sub_total', sortable: true, grow: 0, wrap: true },
    { name: 'Tax', selector: 'tax', sortable: true, grow: 0, wrap: true },
    { name: 'Net Total', selector: 'net_total', sortable: true, grow: 0, wrap: true },

  ];

    const generateCodes = async () => {
    try {
      const res = await api
        .post('/commonApi/getCodeValues', { type: 'creditNote' });
      return res.data.data;
    } catch (error) {
      message('Failed to generate code', 'error');
      throw error;
    }
  };


 const generateCreditNote = async () => {
    if (!selectedOrder) {
      message('Please select a sales order first', 'error');
      return;
    }
    try {
      const invoiceCode = await generateCodes();
      const payload = {
        sales_return_id: selectedOrder.sales_return_id,
        company_id: selectedOrder.company_id,
        sub_total: selectedOrder.sub_total,
        tax: selectedOrder.tax,
        net_total: selectedOrder.net_total,
        credit_note_code: invoiceCode,
        tran_date: selectedOrder.sales_return_date,
        credit_note_type: 'Sales Return Credit Note',
      };
      const response = await api.post('/salesOrder/generateSalesReturnFromCreditNote', payload);
      message(response.data.message, 'success');
        setTimeout(() => {
            window.location.reload();
          }, 400);
    } catch (error) {
      message(error.response?.data?.message || 'Failed to generate invoice', 'error');
    }
  };

  const repeatSalesReturn = async () => {
    if (!selectedOrder) {
      message('Please select a sales return first', 'error');
      return;
    }
    try {
      // Get new delivery code from your API
      const codeRes = await api.post('/commonApi/getCodeValues', { type: 'salesreturn' });
      const deliveryCode = codeRes.data.data;

      // Call repeatSalesOrder API with delivery_code
      const response = await api.post('/salesOrder/repeatSalesOrder', {
        sales_return_id: selectedOrder.sales_return_id,
        delivery_code: deliveryCode,
      });
      message(response.data.msg, 'success');
      setTimeout(() => {
        window.location.reload();
      }, 400);
    } catch (error) {
      message(error.response?.data?.msg || 'Failed to repeat sales order', 'error');
    }
  };



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
            <option value="Paid">Paid</option>
            <option value="Not Paid">Not Paid</option>
          </select>
          <Button color="primary" onClick={getSupplier}>
            <Icon.Search size={16} /> Search
          </Button>
          <Button
            color="danger"
            className="ms-2"
            disabled={selectedSalesReturnIds.length === 0}
            onClick={handleDeleteOrders}
            data-testid="delete-button"
          >
            <Icon.Trash2 size={16} />
          </Button>
          <Button
            color="secondary"
            className="ms-2"
             onClick={() => {
      if (selectedSalesReturnIds.length !== 1) {
        message('Please Select Only One Transaction to Print', 'warning');
      }
    }}
          >
            <PrintPerfoma
                    id={selectedSalesReturnIds.length === 1 ? selectedSalesReturnIds : []}

              settingdetails={null}
              lineItem={null}
            />
          </Button>
        </div>
<div className="sales-order-table">

        <CommonTable
          loading={loading}
          title="Sales Return List"
          Button={
            <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
              <DropdownToggle color="primary" caret className="shadow-none">
                <Button color="primary" tag={Link} to="/SalesReturnDetails?tab=1" className="shadow-none">
                  New Transaction
                </Button>
              </DropdownToggle>
              <DropdownMenu>
            
  <DropdownItem onClick={generateCreditNote}>Convert to Sales Credit</DropdownItem>
  <DropdownItem onClick={repeatSalesReturn}>Repeat Sales Return</DropdownItem>

              </DropdownMenu>
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
                <tr key={element.sales_return_id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedSalesReturnIds.includes(element.sales_return_id)}
                      onChange={() => {
                        setSelectedSalesReturnIds((prev) =>
                          prev.includes(element.sales_return_id)
                            ? prev.filter((id) => id !== element.sales_return_id)
                            : [...prev, element.sales_return_id]
                        );
                        setSelectedOrder(element);
                      }}
                    />
                  </td>
                  <td>{index + 1}</td>
                 <td>
  {element.status === 'Paid' ? (
    <Icon.Edit2 style={{ color: '#ccc', cursor: 'not-allowed' }} />
  ) : (
    <Link to={`/SalesReturnEdit/${element.sales_return_id}?tab=1`}>
      <Icon.Edit2 />
    </Link>
  )}
</td>

                  <td>{element.sales_return_code}</td>
                  <td>{element.sales_return_date}</td>
                  <td>{element.company_name}</td>
                 
                  <td>{element.sub_total || ''}</td>
                  <td>{element.tax || ''}</td>
                  <td>{element.sales_return_amount || ''}</td>
              
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
