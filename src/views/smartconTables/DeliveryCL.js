import React, { useEffect, useState } from 'react';
import * as Icon from 'react-feather';
import { Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import message from '../../components/Message';
import api from '../../constants/api';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import CommonTable from '../../components/CommonTable';

const DeliveryOrderList = () => {
  const navigate = useNavigate();
  const [deliveryOrders, setDeliveryOrders] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [tranNoFilter, setTranNoFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  const getDeliveryOrders = () => {
    setLoading(true);
    api
      .post('/salesOrder/getDeliveryOrders', {
        delivery_code: tranNoFilter,
        from_date: fromDate,
        to_date: toDate,
        company_name: customerFilter,
        delivery_status: statusFilter,
      })
      .then((res) => {
        setDeliveryOrders(res.data.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getDeliveryOrders();
  }, []);
  const columns = [
    { 
      name: '', 
      selector: 'checkbox', 
      cell: (row) => (
        <input
          type="checkbox"
          checked={selectedOrder?.delivery_order_id === row.delivery_order_id}
          onChange={() => setSelectedOrder(row)}
        />
      ), 
      grow: 0, 
      width: '3%' 
    },
        { name: 'Edit', selector: 'edit', cell: () => <Icon.Edit2 />, grow: 0, width: 'auto', button: true, sortable: false },
    
    { name: 'Tran No', selector: 'tran_no', sortable: true, grow: 0, wrap: true },
    { name: 'Tran Date', selector: 'tran_date', sortable: true, grow: 0, wrap: true },
    { name: 'Customer', selector: 'customer_name', sortable: true, grow: 0, wrap: true },
    { name: 'Status', selector: 'delivery_status', sortable: true, grow: 0, wrap: true },
    { name: 'SMS Status', selector: 'sms_status', sortable: true, grow: 0, wrap: true },
    { name: 'SubTotal', selector: 'sub_total', sortable: true, grow: 0, wrap: true },
    { name: 'Tax', selector: 'tax', sortable: true, grow: 0, wrap: true },
    { name: 'NetTotal', selector: 'delivery_amount', sortable: true, grow: 0, wrap: true },
  ];

  const duplicateDeliveryOrder = async (orderToRepeat) => {
    try {
      // Get the next delivery code
      const codeResponse = await api.post('/commonApi/getCodeValues', { type: 'delivery' });
      const newDeliveryCode = codeResponse.data.data;

      // Create new delivery order with copied data
      const payload = {
        ...orderToRepeat,
        delivery_code: newDeliveryCode,
        created_date: new Date().toISOString().split('T')[0],
        delivery_status: 'Open',
        id: null, // Remove the original ID to create new record
      };

      const response = await api.post('/salesOrder/createDeliveryOrder', payload);
      if (response.data.success) {
        message('Delivery order duplicated successfully', 'success');
        getDeliveryOrders(); // Refresh the list
      } else {
        message('Failed to duplicate delivery order', 'error');
      }
    } catch (error) {
      console.error('Error duplicating delivery order:', error);
      message(error.response?.data?.message || 'Failed to duplicate delivery order', 'error');
    }
  };


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
        delivery_order_id: selectedOrder.delivery_order_id,
        company_id: selectedOrder.company_id,
        sub_total: selectedOrder.sub_total,
        tax: selectedOrder.tax,
        net_total: selectedOrder.net_total,
        invoice_code: invoiceCode,
        tran_date: selectedOrder.tran_date,
        invoice_type: 'Delivery Invoice',
      };
      const response = await api.post('/salesOrder/generateInvoiceFromDeliveryOrder', payload);
      message(response.data.message, 'success');
        setTimeout(() => {
            window.location.reload();
          }, 400);
    } catch (error) {
      message(error.response?.data?.message || 'Failed to generate invoice', 'error');
    }
  };
  const handleActionClick = (action) => {
    switch (action) {      case 'convert':
        if (!selectedOrder) {
          message('Please select any one delivery order', 'warning');
        } else {
          generateInvoice(selectedOrder);
        }
        break;case 'bulk':
        // Navigate to bulk delivery order form
        navigate('/BulkDeliveryOrder');
        break;      case 'sms':
        if (!selectedOrder) {
          message('Please select any one delivery order', 'warning');
        } else {
          // Handle Send SMS
        }
        break;
      case 'repeat':
        duplicateDeliveryOrder(selectedOrder);
        break;
      case 'change':
        // Handle Change DO Date
        break;
      case 'track':
        // Handle Tracking Images
        break;
      case 'print':
        // Handle Print Without Price
        break;
      default:
        break;
    }
  };

  return (
    <div className="MainDiv">
      <div className="pt-xs-25">
        <BreadCrumbs />
        <div className="d-flex flex-wrap gap-2 mb-3">
          <input
            className="form-control"
            placeholder="Tran No"
            value={tranNoFilter}
            onChange={(e) => setTranNoFilter(e.target.value)}
          />
          <input
            type="date"
            className="form-control"
            placeholder="From Date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <input
            type="date"
            className="form-control"
            placeholder="To Date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
          <input
            className="form-control"
            placeholder="Customer"
            value={customerFilter}
            onChange={(e) => setCustomerFilter(e.target.value)}
          />
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Select All status</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <Button color="primary" onClick={getDeliveryOrders}>
            <Icon.Search size={16} /> Search
          </Button>
        </div>

        <CommonTable
          loading={loading}
          title="Delivery Order Management"
          Button={
            <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
              <DropdownToggle color="primary" caret>
                New Transaction
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={() => {
                  if (!selectedOrder) {
                    message('Please select a delivery order first by checking the checkbox', 'warning');
                    return;
                  }
                  handleActionClick('convert');
                }}>Convert To Sales Invoice</DropdownItem>                <DropdownItem onClick={() => handleActionClick('bulk')}>Create Bulk DO</DropdownItem>
                <DropdownItem onClick={() => {
                  if (!selectedOrder) {
                    message('Please select a delivery order first by checking the checkbox', 'warning');
                    return;
                  }
                  handleActionClick('sms');
                }}>Send SMS</DropdownItem>
                <DropdownItem onClick={() => {
                  if (!selectedOrder) {
                alert('Please select a delivery order first by checking the checkbox', 'warning');
                    return;
                  }
                  handleActionClick('repeat');
                }}>Repeat Delivery Order</DropdownItem>
                <DropdownItem onClick={() => {
                  if (!selectedOrder) {
                    message('Please select a delivery order first by checking the checkbox', 'warning');
                    return;
                  }
                  handleActionClick('change');
                }}>Change DO Date</DropdownItem>
                <DropdownItem onClick={() => {
                  if (!selectedOrder) {
                    message('Please select a delivery order first by checking the checkbox', 'warning');
                    return;
                  }
                  handleActionClick('track');
                }}>Tracking Images</DropdownItem>
                <DropdownItem onClick={() => {
                  if (!selectedOrder) {
                    message('Please select a delivery order first by checking the checkbox', 'warning');
                    return;
                  }
                  handleActionClick('print');
                }}>Print Without Price</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          }
        >
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.name}>{col.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {deliveryOrders &&
              deliveryOrders.map((element) => (
                <tr key={element.delivery_order_id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedOrder?.delivery_order_id === element.delivery_order_id}
                      onChange={() => setSelectedOrder(element)}
                    />
                  </td>
                   <td>
                    {element.status !== 'Completed' ? (
                      <Link to={`/DeliveryOrderEdit/${element.delivery_order_id}`}>
                        <Icon.Edit2 />
                      </Link>
                    ) : (
                      ''
                    )}
                  </td>
                  <td>{element.delivery_code}</td>
                  <td>{element.tran_date}</td>
                  <td>{element.company_name}</td>
                  <td>{element.delivery_status}</td>
                  <td>{element.sms_status || 'No'}</td>
                  <td>{element.sub_total}</td>
                  <td>{element.tax}</td>
                  <td>{element.delivery_amount}</td>
                </tr>
              ))}
          </tbody>
        </CommonTable>
      </div>
    </div>
  );
};

export default DeliveryOrderList;
