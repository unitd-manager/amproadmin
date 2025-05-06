import React, { useEffect, useState } from 'react';
import * as Icon from 'react-feather';
import { Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
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

const Test = () => {
  const [supplier, setSupplier] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [tranNoFilter, setTranNoFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  const getSupplier = () => {
    setLoading(true);
    api
      .post('/salesOrder/getsalesorder', {
        tran_no: tranNoFilter,
        from_date: fromDate,
        to_date: toDate,
        customer: customerFilter,
        status: statusFilter,
      })
      .then((res) => {
        setSupplier(res.data.data);
        setTimeout(() => {
          $('#example').DataTable({
            destroy: true,
            pagingType: 'full_numbers',
            pageLength: 20,
            processing: true,
            dom: 'Bfrtip',
            buttons: [
              {
                extend: 'print',
                text: 'Print',
                className: 'shadow-none btn btn-primary',
              },
            ],
          });
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

  const columns = [
    { name: '', selector: 'checkbox', cell: () => <input type="checkbox" />, grow: 0, width: '3%' },
    { name: '#', selector: 'sales_order_id', grow: 0, wrap: true, width: '4%' },
    { name: 'Edit', selector: 'edit', cell: () => <Icon.Edit2 />, grow: 0, width: 'auto', button: true, sortable: false },
    { name: 'Tran NO', selector: 'tran_no', sortable: true, grow: 0, wrap: true },
    { name: 'Tran Date', selector: 'tran_date', sortable: true, grow: 0, wrap: true },
    { name: 'Customer', selector: 'company_name', sortable: true, grow: 0, wrap: true },
    { name: 'Status', selector: 'status', sortable: true, grow: 0, wrap: true },
    { name: 'Printed', selector: 'printed', sortable: true, grow: 0, wrap: true },
    { name: 'Sub Total', selector: 'sub_total', sortable: true, grow: 0, wrap: true },
    { name: 'Tax', selector: 'tax', sortable: true, grow: 0, wrap: true },
    { name: 'Net Total', selector: 'net_total', sortable: true, grow: 0, wrap: true },
    { name: 'Created By', selector: 'created_by', sortable: true, grow: 0, wrap: true },
  ];

  const generateCodes = () => {
    return api
      .post('/commonApi/getCodeValues', { type: 'invoice' })
      .then((res) => res.data.data)
      .catch((error) => {
        message('Failed to generate code', 'error');
        throw error;
      });
  };

  const generateInvoice = async () => {
    if (!selectedOrder) {
      message('Please select a sales order first', 'error');
      return;
    }
    try {
      const invoiceCode = await generateCodes();
      const payload = {
        sales_order_id: selectedOrder.sales_order_id,
        company_id: selectedOrder.company_id,
        invoice_code: invoiceCode,
      };
      const response = await api.post('/salesOrder/generateInvoiceFromSalesOrder', payload);
      message(response.data.message, 'success');
    } catch (error) {
      message(error.response?.data?.message || 'Failed to generate invoice', 'error');
    }
  };

  const generateDelivery = async () => {
    if (!selectedOrder) {
      message('Please select a sales order first', 'error');
      return;
    }
    try {
      const deliveryCode = await api.post('/commonApi/getCodeValues', { type: 'delivery' }).then((res) => res.data.data);
      const payload = {
        sales_order_id: selectedOrder.sales_order_id,
        company_id: selectedOrder.company_id,
        delivery_code: deliveryCode,
      };
      const response = await api.post('/salesOrder/generateDeliveryFromSalesOrder', payload);
      message(response.data.message, 'success');
    } catch (error) {
      message(error.response?.data?.message || 'Failed to generate invoice', 'error');
    }
  };

  const repeatSalesOrder = async () => {
    if (!selectedOrder) {
      message('Please select a sales order first', 'error');
      return;
    }
    try {
      const newSalesOrderCode = await api.post('/commonApi/getCodeValues', { type: 'salesorder' }).then((res) => res.data.data);
      const todayDate = new Date().toISOString().split('T')[0];
      const payload = {
        ...selectedOrder,
        original_sales_order_id: selectedOrder.sales_order_id,
        tran_no: newSalesOrderCode,
        tran_date: todayDate,
      };
      delete payload.sales_order_id;
      delete payload.created_by;
      const response = await api.post('/salesOrder/insertSalesOrder', payload);
      message(response.data.message || 'Sales order repeated successfully', 'success');
      getSupplier();
    } catch (error) {
      message(error.response?.data?.message || 'Failed to repeat sales order', 'error');
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
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </select>
          <Button color="primary" onClick={getSupplier}>Search</Button>
        </div>

        <CommonTable
          loading={loading}
          title="Sales Order List"
          Button={
            <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
              <DropdownToggle color="primary" caret className="shadow-none">
                <Button color="primary" tag={Link} to="/SalesOrderDetails" className="shadow-none">
                  New Transaction
                </Button>
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={generateInvoice}>Convert To Sales Invoice</DropdownItem>
                <DropdownItem onClick={generateDelivery}>Convert To Delivery Order</DropdownItem>
                <DropdownItem onClick={repeatSalesOrder}>Repeat Sales Order</DropdownItem>
                <DropdownItem>Print Pick List</DropdownItem>
                <DropdownItem>Print Packing</DropdownItem>
                <DropdownItem>Print Quotation</DropdownItem>
                <DropdownItem>Tracking Images</DropdownItem>
                <DropdownItem>Print With Cost</DropdownItem>
                <DropdownItem>Updated Weight Info</DropdownItem>
                <DropdownItem>Print Performa</DropdownItem>
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
                <tr key={element.sales_order_id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedOrder?.sales_order_id === element.sales_order_id}
                      onChange={() => setSelectedOrder(element)}
                    />
                  </td>
                  <td>{index + 1}</td>
                  <td>
                    <Link to={`/salesorderEdit/${element.sales_order_id}`}>
                      <Icon.Edit2 />
                    </Link>
                  </td>
                  <td>{element.tran_no}</td>
                  <td>{element.tran_date}</td>
                  <td>{element.company_name}</td>
                  <td>{element.status}</td>
                  <td>{element.printed || 'No'}</td>
                  <td>{element.sub_total || ''}</td>
                  <td>{element.tax || ''}</td>
                  <td>{element.net_total || ''}</td>
                  <td>{element.created_by || ''}</td>
                </tr>
              ))}
          </tbody>
        </CommonTable>
      </div>
    </div>
  );
};

export default Test;
