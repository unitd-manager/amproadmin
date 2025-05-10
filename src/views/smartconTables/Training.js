import React, { useEffect, useState } from 'react';
import * as Icon from 'react-feather';
import { Button } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import $ from 'jquery';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import api from '../../constants/api';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import CommonTable from '../../components/CommonTable';

const Training = () => {
  const [training, setTraining] = useState(null);
  const [loading, setLoading] = useState(false);

  const getSelectedLocationFromLocalStorage = () => {
    const locations = localStorage.getItem('selectedLocation');
    const loc = JSON.parse(locations);
    return locations ? Number(loc) : null;
  };

  const selectedLocation = getSelectedLocationFromLocalStorage();

  const getTraining = () => {
    api
      .post('/training/getTrainingFromLocation', { site_id: selectedLocation })
      .then((res) => {
        setTraining(res.data.data);
        $('#example').DataTable({
          pagingType: 'full_numbers',
          pageLength: 20,
          processing: true,
          dom: 'Bfrtip',
        });
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getTraining();
  }, []);

  const columns = [
    {
      name: 'ID',
      grow: 0,
      wrap: true,
      width: '4%',
    },
    {
      name: 'Edit',
      selector: 'edit',
      cell: () => (
        <Link to="/">
          <Icon.Edit3 />
        </Link>
      ),
      grow: 0,
      width: 'auto',
      button: true,
      sortable: false,
    },
    {
      name: 'Title',
      selector: 'title',
      grow: 0,
      wrap: true,
      width: '4%',
    },
    {
      name: 'Trainer',
      selector: 'trainer',
      sortable: true,
      grow: 0,
      wrap: true,
    },
    {
      name: 'Date',
      selector: 'from_date',
      sortable: true,
      grow: 0,
    },
  ];

  return (
    <div className="container pt-xs-25">
      <BreadCrumbs />
      <ToastContainer />
      <CommonTable
        loading={loading}
        title="Training List"
        module="Training"
        Button={
          <Link to="/TrainingDetails">
            <Button color="primary" className="shadow-none mr-2">
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
          {training &&
            training.map((element, index) => (
              <tr key={element.training_id}>
                <td>{index + 1}</td>
                <td>
                  <Link to={`/TrainingEdit/${element.training_id}`}>
                    <Icon.Edit2 />
                  </Link>
                </td>
                <td>{element.title}</td>
                <td>{element.trainer}</td>
                <td>{element.from_date ? moment(element.from_date).format('YYYY-MM-DD') : ''}</td>
              </tr>
            ))}
        </tbody>
      </CommonTable>
    </div>
  );
};

export default Training;
