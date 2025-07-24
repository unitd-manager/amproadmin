import React, { useEffect, useState } from 'react';
import * as Icon from 'react-feather';
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
import message from '../../components/Message';
import api from '../../constants/api';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import CommonTable from '../../components/CommonTable';
import SalesInvoicePickingListPdf from '../../components/PDF/SalesInvoicePickingListPdf';
import PrintLetterPdf from '../../components/PDF/PrintLetterPdf';
import PrintPackingPdf from '../../components/PDF/PrintPackingPdf';
import SalesInfoModal from '../../components/SalesInfoModal'; // adjust path as needed


const Test = () => {
  const [supplier, setSupplier] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [tranNoFilter, setTranNoFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('Not Paid');
 
  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  const getSupplier = () => {
    setLoading(true);
    api
      .post('/invoice/getMainInvoiceSearch', {
        invoice_code: tranNoFilter,
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

  const columns = [
    { name: '', selector: 'checkbox', cell: () => <input type="checkbox" />, grow: 0, width: '3%' },
    { name: '#', selector: 'invoice_id', grow: 0, wrap: true, width: '4%' },
    { name: 'Edit', selector: 'edit', cell: () => <Icon.Edit2 />, grow: 0, width: 'auto', button: true, sortable: false },
    { name: 'Tran NO', selector: 'invoice_code', sortable: true, grow: 0, wrap: true },
    { name: 'Tran Date', selector: 'invoice_date', sortable: true, grow: 0, wrap: true },
    { name: 'Customer', selector: 'company_name', sortable: true, grow: 0, wrap: true },
    { name: 'Printed', selector: 'printed', sortable: true, grow: 0, wrap: true },
    { name: 'Sub Total', selector: 'sub_total', sortable: true, grow: 0, wrap: true },
    { name: 'Tax', selector: 'tax', sortable: true, grow: 0, wrap: true },
    { name: 'Net Total', selector: 'net_total', sortable: true, grow: 0, wrap: true },
    { name: 'Paid Amount', selector: 'status', sortable: true, grow: 0, wrap: true },
    { name: 'Balance Amount', selector: 'created_by', sortable: true, grow: 0, wrap: true },
  ];

  const generateCodes = () => {
    return api
      .post('/commonApi/getCodeValues', { type: 'receipt' })
      .then((res) => res.data.data)
      .catch((error) => {
        message('Failed to generate code', 'error');
        throw error;
      });
  };

  const generateReceipt = async () => {
    if (!selectedOrder) {
      message('Please select a receipt first', 'error');
      return;
    }
    try {
      const receiptCode = await generateCodes();
      const payload = {
        invoice_id: selectedOrder.invoice_id,
        company_id: selectedOrder.company_id,
        amount: selectedOrder.invoice_amount,
       receipt_code: receiptCode,
      };
      const response = await api.post('/invoice/generateReceiptFromSalesOrder', payload);
      message(response.data.message, 'success');
       setTimeout(() => {
            window.location.reload();
          }, 400);
    } catch (error) {
      message(error.response?.data?.message || 'Failed to generate receipt', 'error');
    }
  };
    const id = selectedOrder?.invoice_id || '';

    const [settingdetails, setSettingDetails] = useState();

const getSettingById = () => {
  api
    .post('/invoice/getSalesorderById', { invoice_id: id })
    .then((res) => {
      setSettingDetails(res.data.data[0]);
    })
    .catch(() => {
      message('setting Data Not Found', 'info');
    });
};
 // Get Line Item
   const [lineItem, setLineItem] = useState();
  const getLineItem = () => {
    api.post('/invoice/getQuoteLineItemsById', { invoice_id: id }).then((res) => {
      setLineItem(res.data.data);
      //setAddLineItemModal(true);
    });
  };

useEffect(() => {
  getSettingById();
      getLineItem();
}, [id]);


const handleRepeatInvoice = async () => {
  if (!selectedOrder) {
    message('Please select a invoice first', 'error');
    return;
  }
  try {
    // Get new delivery code from your API
    const codeRes = await api.post('/commonApi/getCodeValues', { type: 'invoice' });
    const deliveryCode = codeRes.data.data;

    // Call repeatSalesOrder API with delivery_code
    const response = await api.post('/invoice/repeatInvoice', {
      invoice_id: selectedOrder.invoice_id,
      invoice_code: deliveryCode,
    });
    message(response.data.msg, 'success');
    setTimeout(() => {
      window.location.reload();
    }, 400);
  } catch (error) {
    message(error.response?.data?.msg || 'Failed to repeat sales order', 'error');
  }
};

const handleConvertToSalesReturn = async () => {
  if (!selectedOrder) {
    message('Please select an invoice first', 'error');
    return;
  }
  try {
    const codeRes = await api.post('/commonApi/getCodeValues', { type: 'salesreturn' });
    const deliveryCode = codeRes.data.data;

    const response = await api.post('/invoice/convertToSalesReturn', {
      invoice_id: selectedOrder.invoice_id,
      sales_return_code: deliveryCode,

    });
    message(response.data.msg || 'Converted to Sales Return successfully', 'success');
    // setTimeout(() => {
    //   window.location.reload();
    // }, 400);
  } catch (error) {
    message(error.response?.data?.msg || 'Failed to convert to Sales Return', 'error');
  }
};


const handleConvertToDelivryVerification = async () => {
  if (!selectedOrder) {
    message('Please select an invoice first', 'error');
    return;
  }
  try {
    const response = await api.post('/invoice/convertToDelivryVerification', {
      invoice_id: selectedOrder.invoice_id,
    });
    message(response.data.msg || 'Converted to Sales Return successfully', 'success');
    // setTimeout(() => {
    //   window.location.reload();
    // }, 400);
  } catch (error) {
    message(error.response?.data?.msg || 'Failed to convert to Sales Return', 'error');
  }
};

  const [salesInfoOpen, setSalesInfoOpen] = useState(false);

  const handleSalesInfo = () => {
    if (!selectedOrder || !selectedOrder.sales_order_id) {
      message('Please select an invoice with a sales order', 'error');
      return;
    }
    setSalesInfoOpen(true);
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
          <Button color="primary" onClick={getSupplier}>Search</Button>
        </div>

        <CommonTable
          loading={loading}
          title="Invoice List"
          Button={
            <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
              <DropdownToggle color="primary" caret className="shadow-none">
                <Button color="primary" tag={Link} to="/InvoiceDetails" className="shadow-none">
                  New Transaction
                </Button>
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={generateReceipt}>Receive Payment</DropdownItem>
                <DropdownItem>
    <PrintLetterPdf id={id} settingdetails={settingdetails} lineItem={lineItem} />

  </DropdownItem>
  <DropdownItem>
    <SalesInvoicePickingListPdf id={id} settingdetails={settingdetails} lineItem={lineItem} />
  
  </DropdownItem>
  <DropdownItem>   <PrintPackingPdf
          id={id}
          settingdetails={settingdetails}
          lineItem={lineItem}
          
        /></DropdownItem>
  <DropdownItem>Print Delivery Order</DropdownItem>
  <DropdownItem onClick={handleRepeatInvoice}>Repeat Invoice</DropdownItem>
  <DropdownItem>Recap</DropdownItem>
  <DropdownItem>Tracking Images</DropdownItem>
  <DropdownItem onClick={handleConvertToSalesReturn}>Convert to Sales Return</DropdownItem>
  <DropdownItem onClick={handleConvertToDelivryVerification}>Delivery Verification</DropdownItem>
  <DropdownItem onClick={handleSalesInfo}>Sales Info</DropdownItem>
  <DropdownItem>Send E-Invoice</DropdownItem>
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
                <tr key={element.invoice_id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedOrder?.invoice_id === element.invoice_id}
                      onChange={() => setSelectedOrder(element)}
                    />
                  </td>
                  <td>{index + 1}</td>
                 <td>
  {element.status === 'Paid' ? (
    <Icon.Edit2 style={{ color: '#ccc', cursor: 'not-allowed' }} />
  ) : (
    <Link to={`/InvoiceEdit/${element.invoice_id}`}>
      <Icon.Edit2 />
    </Link>
  )}
</td>

                  <td>{element.invoice_code}</td>
                  <td>{element.invoice_date}</td>
                  <td>{element.company_name}</td>
                  <td>{element.printed || 'No'}</td>
                  <td>{element.sub_total || ''}</td>
                  <td>{element.tax || ''}</td>
                  <td>{element.invoice_amount || ''}</td>
                  <td>{element.paid_amount}</td>
                  <td>{element.balance_amount || ''}</td>
                </tr>
              ))}
          </tbody>
        </CommonTable>
      </div>
      <SalesInfoModal
        isOpen={salesInfoOpen}
        toggle={() => setSalesInfoOpen(false)}
        salesOrderId={selectedOrder?.sales_order_id}
      />
    </div>
  );
};

export default Test;
