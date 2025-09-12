import React, { useEffect, useState } from 'react';
import * as Icon from 'react-feather';
import { Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Trash2 } from 'react-feather';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
//import $ from 'jquery';
import 'datatables.net-buttons/js/buttons.colVis';
import 'datatables.net-buttons/js/buttons.flash';
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.print';
import { Link } from 'react-router-dom';
import message from '../../components/Message';
import api from '../../constants/api';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import CommonTable from '../../components/CommonTable';
import PrintPerfoma from '../../components/PDF/PrintPerfoma';

import SalesOrderPrintWithCost from '../../components/PDF/SalesOrderPrintWithCost';
 import PdfPickingList from '../../components/PDF/PdfPick';
import PdfPackingList from '../../components/PDF/PdfPack';
import PdfSalesQuote from '../../components/PDF/PdfSalesOrderQuote';


const Test = () => {
  const [supplier, setSupplier] = useState(null);
  // const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedSalesOrderIds, setSelectedSalesOrderIds] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // Keep for single-select logic elsewhere
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [tranNoFilter, setTranNoFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('Open');

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
          // $('#example').DataTable({
          //   destroy: true,
          //   pagingType: 'full_numbers',
          //   pageLength: 20,
          //   processing: true,
          //   dom: 'Bfrtip',
          //   // buttons: [
          //   //   {
          //   //     extend: 'print',
          //   //     text: 'Print',
          //   //     className: 'shadow-none btn btn-primary',
          //   //   },
          //   // ],
          // });
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

  const generateCodes = async () => {
    try {
      const res = await api
        .post('/commonApi/getCodeValues', { type: 'invoice' });
      return res.data.data;
    } catch (error) {
      message('Failed to generate code', 'error');
      throw error;
    }
  };

  const generateDeliveryCodes = async () => {
    try {
      const res = await api
        .post('/commonApi/getCodeValues', { type: 'delivery' });
      return res.data.data;
    } catch (error) {
      message('Failed to generate code', 'error');
      throw error;
    }
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
        sub_total: selectedOrder.sub_total,
        tax: selectedOrder.tax,
        net_total: selectedOrder.net_total,
        invoice_code: invoiceCode,
        tran_date: selectedOrder.tran_date,
        invoice_type: 'Sales Order Invoice',
      };
      const response = await api.post('/salesOrder/generateInvoiceFromSalesOrder', payload);
      message(response.data.message, 'success');
        setTimeout(() => {
            window.location.reload();
          }, 400);
    } catch (error) {
      message(error.response?.data?.message || 'Failed to generate invoice', 'error');
    }
  };

  const generateDeliveryOrder = async () => {
    if (!selectedOrder) {
      message('Please select a sales order first', 'error');
      return;
    }
    try {
      const deliveryCode = await generateDeliveryCodes();
      const payload = {
        sales_order_id: selectedOrder.sales_order_id,
        company_id: selectedOrder.company_id,
        sub_total: selectedOrder.sub_total,
        tax: selectedOrder.tax,
        net_total: selectedOrder.net_total,
        delivery_code: deliveryCode,
        tran_date: selectedOrder.tran_date,
        delivery_type: 'Sales Order Delivery',
      };
      const response = await api.post('/salesOrder/generateDeliveryFromDeliveryOrder', payload);
      message(response.data.message, 'success');
      setTimeout(() => {
        window.location.reload();
      }, 400);
    } catch (error) {
      message(error.response?.data?.message || 'Failed to generate delivery order', 'error');
    }
  };


  const repeatSalesOrder = async () => {
    if (!selectedOrder) {
      message('Please select a sales order first', 'error');
      return;
    }
    try {
      // Get new delivery code from your API
      const codeRes = await api.post('/commonApi/getCodeValues', { type: 'salesorder' });
      const deliveryCode = codeRes.data.data;

      // Call repeatSalesOrder API with delivery_code
      const response = await api.post('/salesOrder/repeatSalesOrder', {
        sales_order_id: selectedOrder.sales_order_id,
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

  // Add delete handler
  const handleDeleteOrders = async () => {
    if (selectedSalesOrderIds.length === 0) {
      message('Please select at least one sales order to delete', 'error');
      return;
    }
    if (!window.confirm('Are you sure you want to delete the selected sales orders?')) return;
    try {
      await api.post('/salesOrder/deleteSalesOrder', { sales_order_id: selectedSalesOrderIds.join(',') });
      message('Selected sales orders deleted successfully', 'success');
      setSelectedSalesOrderIds([]);
      setSelectedOrder(null);
      getSupplier();
    } catch (error) {
      message(error.response?.data?.message || 'Failed to delete sales orders', 'error');
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
          <Button
            color="danger"
            className="ms-2"
            disabled={selectedSalesOrderIds.length === 0}
            onClick={handleDeleteOrders}
            data-testid="delete-button"
          >
            <Trash2 size={16} />
          </Button>
        </div>

        <CommonTable
          loading={loading}
          title="Sales Order List"
          Button={
            <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
              <DropdownToggle color="primary" caret className="shadow-none">
                <Button color="primary" tag={Link} to="/SalesOrderDetails?tab=1" className="shadow-none">
                  New Transaction
                </Button>
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={generateInvoice}>Convert To Sales Invoice</DropdownItem>
                <DropdownItem onClick={generateDeliveryOrder}>Convert To Delivery Order</DropdownItem>
                <DropdownItem onClick={repeatSalesOrder}>Repeat Sales Order</DropdownItem>
                <DropdownItem>
                  <PdfPickingList
                    salesOrderIds={selectedSalesOrderIds}
                  />
                 
                </DropdownItem>
                <DropdownItem>
                  <PdfPackingList
                    selectedOrderIds={selectedSalesOrderIds}
                    settingdetails={null}
                    lineItem={null}
                  />
                
                </DropdownItem>
                <DropdownItem>
                  <PdfSalesQuote
                    id={selectedOrder?.sales_order_id || ''}
                    settingdetails={null}
                    lineItem={null}
                  />
               
                </DropdownItem>
                <DropdownItem onClick={() => { /* TODO: Add tracking images logic */ }}>Tracking Images</DropdownItem>
                <DropdownItem>
                  <SalesOrderPrintWithCost
                    id={selectedOrder?.sales_order_id || ''}
                    settingdetails={null}
                    lineItem={null}
                  />
                 
                </DropdownItem>
                <DropdownItem onClick={() => { /* TODO: Add updated weight info logic */ }}>Updated Weight Info</DropdownItem>
                <DropdownItem>
                  <PrintPerfoma
                    id={selectedOrder?.sales_order_id || ''}
                    settingdetails={null}
                    lineItem={null}
                  />
                
                </DropdownItem>
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
                      checked={selectedSalesOrderIds.includes(element.sales_order_id)}
                      onChange={() => {
                        setSelectedSalesOrderIds((prev) =>
                          prev.includes(element.sales_order_id)
                            ? prev.filter((ids) => ids !== element.sales_order_id)
                            : [...prev, element.sales_order_id]
                        );
                        // For single-select logic elsewhere
                        setSelectedOrder(element);
                      }}
                    />
                  </td>
                  <td>{index + 1}</td>
                 <td>
  {element.status !== 'Closed' ? (
    <Link to={`/salesorderEdit/${element.sales_order_id}?tab=1`}>
      <Icon.Edit2 />
    </Link>
  ) : (
    ''
  )}
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
