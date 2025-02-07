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

const Test = () => {
  //All state variable
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(false);

  //getting data from supplier
  const getSupplier = () => {
    setLoading(true);
    api
      .get('/salesorder/getsalesorder')
      .then((res) => {
        setSupplier(res.data.data);
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
    getSupplier();
  }, []);
  //structure of supplier list view
  const columns = [
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
      selector: 'traan_no',
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
      
      sortable: true,
      grow: 0,
      wrap: true,
    },
    {
      name: 'Printed',
      
      sortable: true,
      grow: 0,
      wrap: true,
    },
    {
      name: 'Sub Total',
      
      sortable: true,
      grow: 0,
      wrap: true,
    },
    {
      name: 'Tax',
      
      sortable: true,
      grow: 0,
      wrap: true,
    },

    {
      name: 'Net Total',
      
      sortable: true,
      grow: 0,
      wrap: true,
    },

    {
      name: 'Created By',
      selector: 'company_name',
      sortable: true,
      grow: 0,
      wrap: true,
    },
   
  ];

  return (
    <div className="MainDiv">
      <div className=" pt-xs-25">
        <BreadCrumbs />

        <CommonTable
          loading={loading}
          title="Sales Order List"
          Button={
            <Link to="/SalesOrderDetails">
              <Button color="primary" className="shadow-none">
                Add New
              </Button>
            </Link>
          }
        >
          <thead>
            <tr>
              {columns.map((cell) => {
                return <td key={cell.name}>{cell.name}</td>;
              })}
            </tr>
          </thead>
          <tbody>
            {supplier &&
              supplier.map((element, index) => {
                return (
                  <tr key={element.sales_order_id}>
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
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>

                  </tr>
                );
              })}
          </tbody>
        </CommonTable>
      </div>
    </div>
  );
};

export default Test;
