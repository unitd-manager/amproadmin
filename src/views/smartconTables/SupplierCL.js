import React, { useEffect, useState } from 'react';
import * as Icon from 'react-feather';
import { Button } from 'reactstrap';
import { Link, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import $ from 'jquery';
import 'datatables.net-buttons/js/buttons.colVis';
import 'datatables.net-buttons/js/buttons.flash';
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.print';
import api from '../../constants/api';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import CommonTable from '../../components/CommonTable';

const SupplierCL = () => {
  //Const Variables
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(false);
  

  // Navigation and Parameter Constants
  const { id } = useParams();

  // get supplier
  const getSupplier = () => {
    api
      .get('/supplier/getSupplier')
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
  }, [id]);
  //  stucture of Section list view
  const columns = [
    {
      name: '#',
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
      name: 'Supplier Code',
      selector: 'supplier_code',
      sortable: true,
      grow: 0,
      wrap: true,
    },
    {
      name: 'Supplier name',
      selector: 'company_name',
      sortable: true,
      grow: 2,
      wrap: true,
    },
    {
      name: 'Address',
      selector: 'address_street',
      sortable: true,
      grow: 0,
    },
    {
      name: 'Phone No',
      selector: 'phone',
      sortable: true,
      width: 'auto',
      grow: 3,
    },
    {
      name: 'Email',
      selector: 'email',
      sortable: true,
      grow: 2,
      width: 'auto',
    },
  ];

  return (
    <div className="MainDiv">
      <div className=" pt-xs-25">
        <BreadCrumbs />
        {/* Supplier Add new button */}

        <CommonTable
          loading={loading}
          title="Supplier List"
          Button={
            <Link to="/SupplierCLDetails">
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
                  <tr key={element.supplier_id}>
                    <td>{index + 1}</td>
                    <td>
                      <Link to={`/SupplierCLEdit/${element.supplier_id}/?tab=1`}>
                        <Icon.Edit2 />
                      </Link>
                    </td>
                    <td>
  <Link to={`/SupplierCLEdit/${element.supplier_id}/?tab=1`}>
    {element.supplier_code}
  </Link>
</td>
<td>
  <Link to={`/SupplierCLEdit/${element.supplier_id}/?tab=1`}>
    {element.company_name}
  </Link>
</td>
                    <td>{element.address_flat}{element.address_street}{element.address_state}</td>
                    <td>{element.phone}</td>
                    <td>{element.email}</td>
                  </tr>
                );
              })}
          </tbody>
        </CommonTable>
        {/* setion table */}
      </div>
    </div>
  );
};

export default SupplierCL;
