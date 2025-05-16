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
import { ToastContainer } from 'react-toastify';
import api from '../../constants/api';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import CommonTable from '../../components/CommonTable';
import Flag from '../../components/Flag';
import message from '../../components/Message';

const Clients = () => {
  //Const Variables
  const [clients, setClients] = useState(null);
  const [loading, setLoading] = useState(false);

  // get Clients
  const getClients = () => {
    api
      .get('/clients/getClients')
      .then((res) => {
        setClients(res.data.data);
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

  /* eslint-disable */

  // update publish
  const updateFlag = (obj) => {
    obj.flag = !obj.flag;
    api
      .post('/clients/update-flag', obj)
      .then(() => {
        getClients();
        message('Flag updated successfully', 'success');
      })
      .catch(() => {
        message('Unable to edit record.', 'error');
      });
  };

  useEffect(() => {
    getClients();
  }, []);
  //  stucture of client list view
  const columns = [
    {
      name: 'id',
      selector: 'company_id',
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
      name: 'Flag',
      selector: 'flag',
      cell: () => <Icon.Flag />,
      grow: 0,
      width: 'auto',
      button: true,
      sortable: false,
    },
    {
      name: 'Name',
      selector: 'company_name',
      sortable: true,
      grow: 0,
      wrap: true,
    },
    {
      name: 'Email',
      selector: 'email',
      sortable: true,
      grow: 2,
      wrap: true,
    },
    {
      name: 'Status',
      selector: 'status',
      sortable: true,
      grow: 0,
    },
    {
      name: 'Phone',
      selector: 'phone',
      sortable: true,
      width: 'auto',
      grow: 3,
    },
  ];

  return (
    <div className="MainDiv">
      <div className=" pt-xs-25">
        <BreadCrumbs />
        {/* ClientDetailsn Add Button */}
        <ToastContainer></ToastContainer>
        <CommonTable
          loading={loading}
          title="Client List"
          Button={
            <Link to="/ClientDetails">
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
            {clients &&
              clients.map((element, i) => {
                return (
                  <tr key={element.company_id}>
                    <td>{i + 1}</td>
                    <td>
                      <Link to={`/ClientEdit/${element.company_id}?tab=1`}>
                        <Icon.Edit2 />
                      </Link>
                    </td>
                    <td>
                      <span
                        onClick={() => {
                          updateFlag(element);
                        }}
                      >
                        <Flag value={element.flag ? 1 : 0} />
                      </span>
                    </td>
                    <td>{element.company_name}</td>
                    <td>{element.email}</td>
                    <td>{element.status}</td>
                    <td>{element.phone}</td>
                  </tr>
                );
              })}
          </tbody>
        </CommonTable>
      </div>
    </div>
  );
};

export default Clients;
