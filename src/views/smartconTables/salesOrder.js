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
  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  const getSupplier = () => {
    setLoading(true);
    api
      .get('/salesorder/getsalesorder')
      .then((res) => {
        setSupplier(res.data.data);
        setTimeout(() => {
          $('#example').DataTable({
            destroy: true, // destroy if already initialized
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
    {
      name: '',
      selector: 'checkbox',
      cell: () => <input type="checkbox" />,
      grow: 0,
      width: '3%',
    },
    {
      name: '#',
      selector: 'sales_order_id',
      grow: 0,
      wrap: true,
      width: '4%',
    },
    {
      name: 'Edit',
      selector: 'edit',
      cell: () => <Icon.Edit2 />,
      grow: 0,
      width: 'auto',
      button: true,
      sortable: false,
    },
    {
      name: 'Tran NO',
      selector: 'tran_no',
      sortable: true,
      grow: 0,
      wrap: true,
    },
    {
      name: 'Tran Date',
      selector: 'tran_date',
      sortable: true,
      grow: 0,
      wrap: true,
    },
    {
      name: 'Customer',
      selector: 'company_name',
      sortable: true,
      grow: 0,
      wrap: true,
    },
    {
      name: 'Status',
      selector: 'status',
      sortable: true,
      grow: 0,
      wrap: true,
    },
    {
      name: 'Printed',
      selector: 'printed',
      sortable: true,
      grow: 0,
      wrap: true,
    },
    {
      name: 'Sub Total',
      selector: 'sub_total',
      sortable: true,
      grow: 0,
      wrap: true,
    },
    {
      name: 'Tax',
      selector: 'tax',
      sortable: true,
      grow: 0,
      wrap: true,
    },
    {
      name: 'Net Total',
      selector: 'net_total',
      sortable: true,
      grow: 0,
      wrap: true,
    },
    {
      name: 'Created By',
      selector: 'created_by',
      sortable: true,
      grow: 0,
      wrap: true,
    },
  ];


  const generateCodes = () => {
    return api
      .post('/commonApi/getCodeValues', { type: 'invoice' })
      .then((res) => {
        console.log('Generated Code:', res.data.data); // Debugging line
        return res.data.data;
      })
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
      console.log('Generated Invoice ID:', response.data.invoice_id);
    } catch (error) {
      message(error.response?.data?.message || 'Failed to generate invoice', 'error');
    }
  };
  
  const generateDeliveryCodes = async () => {
    try {
      const res = await api
        .post('/commonApi/getCodeValues', { type: 'delivery' });
      console.log('Generated Code:', res.data.data); // Debugging line
      return res.data.data;
    } catch (error) {
      message('Failed to generate code', 'error');
      throw error;
    }
  };
  
  const generateDelivery = async () => {
    if (!selectedOrder) {
      message('Please select a sales order first', 'error');
      return;
    }
    try {
      const deliveryCode = await generateDeliveryCodes(); // Generate the code
      console.log('Delivery Code:', deliveryCode); // Debugging line
      const payload = {
        sales_order_id: selectedOrder.sales_order_id,
        company_id: selectedOrder.company_id,
        delivery_code: deliveryCode, // Generated invoice code
      };
      console.log('Payload:', payload); // Debugging line
  
      const response = await api.post('/salesOrder/generateDeliveryFromSalesOrder', payload);
      message(response.data.message, 'success');
      console.log('Generated Delivery ID:', response.data.delivery_id);
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
      // Generate new sales order code
      const newSalesOrderCode = await api
        .post('/commonApi/getCodeValues', { type: 'salesorder' })
        .then((res) => res.data.data);
  
      const todayDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
  
      const payload = {
        ...selectedOrder,
        original_sales_order_id: selectedOrder.sales_order_id,
        tran_no: newSalesOrderCode,      // Insert new code
        tran_date: todayDate,            // Insert today date
      };
  
      // Remove fields that shouldn't be duplicated
      delete payload.sales_order_id;
      delete payload.created_by;
  
      const response = await api.post('/salesOrder/insertSalesOrder', payload);
      message(response.data.message || 'Sales order repeated successfully', 'success');
      getSupplier(); // Refresh list
    } catch (error) {
      message(error.response?.data?.message || 'Failed to repeat sales order', 'error');
    }
  };
  
  return (
    <div className="MainDiv">
      <div className="pt-xs-25">
        <BreadCrumbs />
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
                <DropdownItem onClick={() => { generateInvoice();}}>Convert To Sales Invoice</DropdownItem>
                <DropdownItem onClick={() => { generateDelivery();}}>Convert To Delivery Order</DropdownItem>
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
