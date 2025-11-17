import React, { useEffect, useState } from 'react';
import * as Icon from 'react-feather';
import { Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
 import moment from 'moment';

import message from '../../components/Message';
import api from '../../constants/api';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import CommonTable from '../../components/CommonTable';
//import PrintPerfomaList from '../../components/PDF/PrintDeliveryList';

import PrintPerfoma from '../../components/PDF/PrintDelivery';
import './salesOrderTable.css';

const DeliveryOrderList = () => {
  const navigate = useNavigate();
  const [deliveryOrders, setDeliveryOrders] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedDeliveryOrderIds, setSelectedDeliveryOrderIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  const [tranNoFilter, setTranNoFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

 

  const [isChangeDateModalOpen, setIsChangeDateModalOpen] = useState(false);
const [newDeliveryDate, setNewDeliveryDate] = useState(() => new Date().toISOString().split('T')[0]);

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
  const handleDeleteOrders = async () => {
    if (selectedDeliveryOrderIds.length === 0) {
      message('Please select at least one delivery order to delete', 'error');
      return;
    }
    if (!window.confirm('Are you sure you want to delete the selected delivery orders?')) return;
    try {
      await api.post('/salesOrder/deleteDeliveryOrder', { delivery_order_id: selectedDeliveryOrderIds.join(',') });
      message('Selected delivery orders deleted successfully', 'success');
      setSelectedDeliveryOrderIds([]);
      setSelectedOrder(null);
      getDeliveryOrders();
    } catch (error) {
      message(error.response?.data?.message || 'Failed to delete delivery orders', 'error');
    }
  };

 

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);


  useEffect(() => {
    getDeliveryOrders();
  }, []);

  useEffect(() => {
    if (deliveryOrders && deliveryOrders.length > 0) {
      setSelectAll(selectedDeliveryOrderIds.length === deliveryOrders.length);
    }
  }, [selectedDeliveryOrderIds, deliveryOrders]);

  const columns = [
    {
      name: (
        <input
          type="checkbox"
          checked={selectAll}
          ref={(input) => {
            if (input) {
              input.indeterminate =
                selectedDeliveryOrderIds.length > 0 &&
                selectedDeliveryOrderIds.length < (deliveryOrders?.length || 0);
            }
          }}
          onChange={() => {
            if (selectAll) {
              setSelectedDeliveryOrderIds([]); // deselect all
            } else {
              setSelectedDeliveryOrderIds(deliveryOrders.map((d) => d.delivery_order_id)); // select all
            }
            setSelectAll(!selectAll);
          }}
        />
      ),
      selector: 'checkbox',
      cell: (row) => (
        <input
          type="checkbox"
          checked={selectedDeliveryOrderIds.includes(row.delivery_order_id)}
          onChange={() => {
            setSelectedDeliveryOrderIds((prev) =>
              prev.includes(row.delivery_order_id)
                ? prev.filter((id) => id !== row.delivery_order_id)
                : [...prev, row.delivery_order_id]
            );
            setSelectedOrder(row); // Keep single selection for compatibility
          }}
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
      if (!orderToRepeat || !orderToRepeat.delivery_order_id) {
        message('No delivery order selected to duplicate', 'warning');
        return;
      }

      // Fetch delivery order items for the selected order
      const itemsResponse = await api.post('/invoice/getDeliveryLineItemsById', { delivery_order_id: orderToRepeat.delivery_order_id });
      const deliveryItems = itemsResponse.data.data || [];

      // Get the next delivery code
      const codeResponse = await api.post('/commonApi/getCodeValues', { type: 'delivery' });
      const newDeliveryCode = codeResponse.data.data;

      // Prepare new delivery order payload with duplicated items
      const payload = {
        ...orderToRepeat,
        delivery_code: newDeliveryCode,
        created_date: new Date().toISOString().split('T')[0],
        delivery_status: 'Open',
        companyId: orderToRepeat.company_id,
      
        products: deliveryItems.map(item => ({
          productId: item.product_id,
          quantity: item.quantity,
          price: item.price,
          // Add other relevant fields if needed
        })),
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


  const id = selectedOrder?.delivery_order_id || '';
    const [settingdetails, setSettingDetails] = useState();
  console.log(settingdetails);
  const getSettingById = () => {
    api
      .post('/salesorder/getDeliveryorderById', { delivery_order_id: id })
      .then((res) => {
        setSettingDetails(res.data.data[0]);
      })
      .catch(() => {
        message('setting Data Not Found', 'info');
      });
  };
     const [lineItem, setLineItem] = useState();
   console.log(lineItem);
    const getLineItem = () => {
      api.post('/invoice/getDeliveryLineItemsById', { delivery_order_id: id }).then((res) => {
        setLineItem(res.data.data);
        //setAddLineItemModal(true);
      });
    };

    useEffect(() => {
      getSettingById();
          getLineItem();
    }, [id]);
    const updateDeliveryOrderDate = async () => {
  try {
    const payload = {
      delivery_order_id: selectedOrder.delivery_order_id,
      delivery_date: newDeliveryDate,
    };
    const response = await api.post('/invoice/updateDeliveryDate', payload);
    if (response.data.success) {
      message('Delivery order date updated successfully', 'success');
      setIsChangeDateModalOpen(false);
      getDeliveryOrders(); // Refresh list
         setTimeout(() => {
            window.location.reload();
          }, 400);
    } else {
      message('Failed to update delivery date', 'error');
    }
  } catch (error) {
    console.error('Date update failed:', error);
    message(error.response?.data?.message || 'Date update failed', 'error');
  }
};


 // const [showPrintPerfoma, setShowPrintPerfoma] = useState(false);

  const handleActionClick = (action) => {
    switch (action) {
      case 'convert':
        if (!selectedOrder) {
          message('Please select any one delivery order', 'warning');
        } else {
          generateInvoice(selectedOrder);
        }
        break;
      case 'bulk':
        // Navigate to bulk delivery order form
        navigate('/BulkDeliveryOrder');
        break;
      case 'sms':
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
  if (!selectedOrder) {
    message('Please select any one delivery order', 'warning');
  } else {
    setNewDeliveryDate(new Date().toISOString().split('T')[0]); // default to today
    setIsChangeDateModalOpen(true);
  }
  break;

      case 'track':
        // Handle Tracking Images
        break;
      case 'print':
        if (!selectedOrder) {
          message('Please select any one delivery order', 'warning');
        } 
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
            
            placeholder="Tran No"
            value={tranNoFilter}
            onChange={(e) => setTranNoFilter(e.target.value)}
          />
          <input
            type="date"
            
            placeholder="From Date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <input
            type="date"
            
            placeholder="To Date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
          <input
            
            placeholder="Customer"
            value={customerFilter}
            onChange={(e) => setCustomerFilter(e.target.value)}
          />
          <select
            className="form-select"  style={{ width: '15%' }}
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
          <Button
            color="danger"
            className="ms-2"
            disabled={selectedDeliveryOrderIds.length === 0}
            onClick={handleDeleteOrders}
            data-testid="delete-button"
          >
            <Icon.Trash2 size={16} />
          </Button>
          <Button
            color="secondary"
            className="ms-2"
            disabled={selectedDeliveryOrderIds.length === 0}
          >
            <PrintPerfoma
      id={selectedDeliveryOrderIds}
      settingdetails={null}
      lineItem={null}
    />
          </Button>
        </div>
<div className="sales-order-table">
        <CommonTable
          loading={loading}
          title="Delivery Order Management"
          Button={
            <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
              <DropdownToggle color="primary" caret>
               <Button color="primary" tag={Link} to="/DeliveryOrderDetails?tab=1" className="shadow-none">
                                New Transaction
                              </Button>
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
                {/* <DropdownItem onClick={() => {
                  if (!selectedOrder) {
                    message('Please select a delivery order first by checking the checkbox', 'warning');
                    return;
                  }
                  handleActionClick('print');
                }}>
          <PrintPerfoma
            id={id}
            settingdetails={settingdetails}
            lineItem={lineItem}
          />
      </DropdownItem> */}
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
                      checked={selectedDeliveryOrderIds.includes(element.delivery_order_id)}
                      onChange={() => {
                        setSelectedDeliveryOrderIds((prev) =>
                          prev.includes(element.delivery_order_id)
                            ? prev.filter((ids) => ids !== element.delivery_order_id)
                            : [...prev, element.delivery_order_id]
                        );
                        setSelectedOrder(element); // Keep single selection for compatibility
                      }}
                    />
                  </td>
                   <td>
                    {element.status !== 'Completed' ? (
                      <Link to={`/DeliveryOrderEdit/${element.delivery_order_id}?tab=1`}>
                        <Icon.Edit2 />
                      </Link>
                    ) : (
                      ''
                    )}
                  </td>
                  <td>{element.delivery_code}</td>
                  <td>{element.tran_date? moment(element.tran_date).format('DD-MM-YYYY'):''}</td>
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
      {isChangeDateModalOpen && (
  <div className="modal show d-block" tabIndex="-1" role="dialog">
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Change Delivery Order Date</h5>
          <button type="button" className="btn-close" onClick={() => setIsChangeDateModalOpen(false)} />
        </div>
        <div className="modal-body">
          <input
            type="date"
            
            value={newDeliveryDate}
            onChange={(e) => setNewDeliveryDate(e.target.value)}
          />
        </div>
        <div className="modal-footer">
          <Button color="primary" onClick={updateDeliveryOrderDate}>Save</Button>
          <Button color="secondary" onClick={() => setIsChangeDateModalOpen(false)}>Cancel</Button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default DeliveryOrderList;
