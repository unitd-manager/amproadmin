import React, { useEffect, useState } from 'react';
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
import api from '../../constants/api';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import CommonTable from '../../components/CommonTable';

const SalesOrder = () => {
  // State variables
  const [salesorder, setSalesOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetching sales orders
  const getsalesorder = () => {
    setLoading(true);
    api
      .get('/salesorder/getsalesorder')
      .then((res) => {
        setSalesOrder(res.data.data);
        $('#example').DataTable({
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
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getsalesorder();
  }, []);

  // Table columns
  const columns = [
    { name: '#', selector: 'salesorder_id', grow: 0, wrap: true, width: '4%' },
    {
      name: 'Edit',
      selector: 'edit',
      cell: () => <Icon.Edit2 />,
      grow: 0,
      width: 'auto',
      button: true,
      sortable: false,
    },
    { name: 'Tran No', selector: 'company_name', sortable: true, grow: 0, wrap: true },
    { name: 'Tran Date', selector: 'email', sortable: true, grow: 2, wrap: true },
    { name: 'Customer', selector: 'mobile', sortable: true, grow: 0 },
    { name: 'Status', selector: 'mobile', sortable: true, grow: 0 },
    { name: 'Printed', selector: 'mobile', sortable: true, grow: 0 },
    { name: 'Sub Total', selector: 'mobile', sortable: true, grow: 0 },
    { name: 'Net Total', selector: 'mobile', sortable: true, grow: 0 },
    { name: 'Tax', selector: 'mobile', sortable: true, grow: 0 },
    { name: 'Created By', selector: 'mobile', sortable: true, grow: 0 },
  ];

  return (
    <div className="MainDiv">
      <div className=" pt-xs-25">
        <BreadCrumbs />

        <CommonTable
          loading={loading}
          title="Sales Order List"
          Button={
            <Link to="/salesorderDetails">
              <Button color="primary" className="shadow-none">
                Add New
              </Button>
            </Link>
          }
        >
          <thead>
            <tr>
              {columns.map((cell) => (
                <td key={cell.name}>{cell.name}</td>
              ))}
            </tr>
          </thead>
          <tbody>
            {salesorder &&
              salesorder.map((element, index) => (
                <tr key={element.salesorder_id}>
                  <td>{index + 1}</td>
                  <td>
                    <Link to={`/salesorderEdit/${element.salesorder_id}`}>
                      <Icon.Edit2 />
                    </Link>
                  </td>
                  <td>{element.company_name}</td>
                  <td>{element.email}</td>
                  <td>{element.mobile}</td>
                </tr>
              ))}
          </tbody>
        </CommonTable>
      </div>
    </div>
  );
};

export default SalesOrder;
