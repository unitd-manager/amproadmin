import React, {  useState } from 'react';
import * as Icon from 'react-feather';
import { Button } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
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
  const [supplier, setSupplier] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);

  const [tranNoFilter, setTranNoFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('Not Delivered');

  // ✅ Checkbox handler
  const handleCheckboxChange = (orderId) => {
    setSelectedOrders((prevSelected) =>
      prevSelected.includes(orderId)
        ? prevSelected.filter((id) => id !== orderId)
        : [...prevSelected, orderId]
    );
  };

  // ✅ Fetch Delivery Verification records
  const getDeliveryVerifi = () => {
    setLoading(true);
    api
      .post('/salesreturn/getDeliveryVerification', {
        delivery_verification_code: tranNoFilter,
        from_date: fromDate,
        to_date: toDate,
        company_name: customerFilter,
        delivery_status: statusFilter,
      })
      .then((res) => {
        setSupplier(res.data.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  // ✅ Generate new delivery codes
  const generateDeliveryCodes = async () => {
    try {
      const res = await api.post('/commonApi/getCodeValues', { type: 'delivery' });
      return res.data.data;
    } catch (error) {
      message('Failed to generate code', 'error');
      throw error;
    }
  };

  // ✅ Confirm Delivery for selected orders
const generateDeliveryOrder = async () => {
  if (selectedOrders.length === 0) {
    message('Please select at least one order', 'warning');
    return;
  }

  try {
    // filter selected orders
    const selectedData = supplier.filter((item) =>
      selectedOrders.includes(item.delivery_verification_id)
    );

    // process all in parallel
    await Promise.all(
      selectedData.map(async (order) => {
        const deliveryCode = await generateDeliveryCodes();

        const payload = {
          delivery_verification_id: order.delivery_verification_id,
          company_id: order.company_id,
          sub_total: order.sub_total,
          tax: order.tax,
          net_total: order.net_total,
          delivery_code: deliveryCode,
          tran_date: order.delivery_verification_date,
          delivery_type: 'Delivery Verification Delivery',
        };

        const response = await api.post(
          '/salesOrder/generateDeliveryVerificationFromDeliveryOrder',
          payload
        );
        message(response.data.message, 'success');
      })
    );

    // ✅ Refresh after all done
    setTimeout(() => {
      window.location.reload();
    }, 500);
  } catch (error) {
    message(
      error.response?.data?.message || 'Failed to generate delivery order',
      'error'
    );
  }
};


  // ✅ Table column definitions
  const columns = [
    { name: '', selector: 'checkbox', grow: 0, width: '3%' },
    { name: '#', selector: 'delivery_verification_id', grow: 0, wrap: true, width: '4%' },
    { name: 'Edit', selector: 'edit', grow: 0, width: 'auto', button: true, sortable: false },
    { name: 'Tran NO', selector: 'delivery_verification_code', sortable: true, grow: 0, wrap: true },
    { name: 'Tran Date', selector: 'delivery_verification_date', sortable: true, grow: 0, wrap: true },
    { name: 'Customer', selector: 'company_name', sortable: true, grow: 0, wrap: true },
    { name: 'Delivery Status', selector: 'status', sortable: true, grow: 0, wrap: true },
    { name: 'Sub Total', selector: 'sub_total', sortable: true, grow: 0, wrap: true },
    { name: 'Tax', selector: 'tax', sortable: true, grow: 0, wrap: true },
    { name: 'Net Total', selector: 'net_total', sortable: true, grow: 0, wrap: true },
    { name: 'Paid Amount', selector: 'paid_amount', sortable: true, grow: 0, wrap: true },
    { name: 'Balance Amount', selector: 'balance_amount', sortable: true, grow: 0, wrap: true },
  ];

  return (
    <div className="MainDiv">
      <div className="pt-xs-25">
        <BreadCrumbs />

        {/* 🔍 Search Filters */}
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
            className="form-select"
            style={{ width: '15%' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="Delivered">Delivered</option>
            <option value="Not Delivered">Not Delivered</option>
          </select>
          <Button color="primary" onClick={getDeliveryVerifi}>
            Search
          </Button>
        </div>

        {/* 📋 Table */}
        <CommonTable
          loading={loading}
          title="Delivery Verification List"
          Button={
            <div className="d-flex">
              <Button
                color="primary"
                className="shadow-none mr-2"
                onClick={generateDeliveryOrder}
              >
                Confirm Delivery
              </Button>
            </div>
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
              supplier.map((element) => (
                <tr key={element.delivery_verification_id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(element.delivery_verification_id)}
                      onChange={() =>
                        handleCheckboxChange(element.delivery_verification_id)
                      }
                    />
                  </td>
                  <td>{element.delivery_verification_id}</td>
                  <td>
                    <Link to={`/salesorderedit/${element.delivery_verification_id}`}>
                      <Icon.Edit2 />
                    </Link>
                  </td>
                  <td>{element.delivery_verification_code}</td>
                  <td>{element.delivery_verification_date}</td>
                  <td>{element.company_name}</td>
                  <td>{element.status}</td>
                  <td>{element.sub_total}</td>
                  <td>{element.tax}</td>
                  <td>{element.net_total}</td>
                  <td>{element.paid_amount}</td>
                  <td>{element.balance_amount}</td>
                </tr>
              ))}
          </tbody>
        </CommonTable>
      </div>
    </div>
  );
};

export default Test;
