import React, { useEffect, useState } from 'react';
import * as Icon from 'react-feather';
import { Button } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import moment from 'moment';
import { Link } from 'react-router-dom';
import api from '../../constants/api';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import CommonTable from '../../components/CommonTable';

const Leaves = () => {
  const [leaves, setLeaves] = useState(null);
  const [loading, setLoading] = useState(false);

  const getSelectedLocationFromLocalStorage = () => {
    const locations = localStorage.getItem('selectedLocation');
    const loc = JSON.parse(locations);
    return locations ? Number(loc) : null;
  };

  const selectedLocation = getSelectedLocationFromLocalStorage();

  const getLeave = () => {
    api
      .post('/leave/getLeaveFromLocation', { site_id: selectedLocation })
      .then((res) => {
        setLeaves(res.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    getLeave();
  }, [selectedLocation]);

  // Table column configuration (static English labels)
  const columns = [
    { name: 'ID', selector: 'leave_id', grow: 0, wrap: true, width: '4%' },
    {
      name: 'Edit',
      selector: 'edit',
      cell: () => <Icon.Edit2 />,
      grow: 0,
      width: 'auto',
      button: true,
      sortable: false,
    },
    { name: 'Employee Name', selector: 'employee_name', sortable: true, grow: 0, wrap: true },
    { name: 'Designation', selector: 'designation', sortable: true, grow: 2, wrap: true },
    { name: 'Status', selector: 'status', sortable: true, grow: 0 },
    { name: 'From Date', selector: 'from_date', sortable: true, width: 'auto', grow: 3 },
    { name: 'To Date', selector: 'to_date', sortable: true, grow: 2, width: 'auto' },
    { name: 'No of Days (Current Month)', selector: 'no_of_days', sortable: true, grow: 2, wrap: true },
    { name: 'No of Days (Next Month)', selector: 'no_of_days_next_month', sortable: true, width: 'auto' },
    { name: 'Leave Type', selector: 'leave_type', sortable: true, width: 'auto' },
  ];

  return (
    <div className="MainDiv">
      <div className="pt-xs-25">
        <BreadCrumbs />
        <CommonTable
          loading={loading}
          title="Leave List"
          module="Leave"
          Button={
            <Link to="/LeaveDetails">
              <Button color="primary" className="shadow-none mr-2">Add New</Button>
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
            {leaves &&
              leaves.map((element, i) => (
                <tr key={element.leave_id}>
                  <td>{i + 1}</td>
                  <td>
                    <Link className="editlink" to={`/LeavesEdit/${element.leave_id}?tab=1`}>
                      <Icon.Edit2 />
                    </Link>
                  </td>
                  <td>{element.employee_name}</td>
                  <td>{element.position}</td>
                  <td>{element.status}</td>
                  <td>{element.from_date ? moment(element.from_date).format('DD-MM-YYYY') : ''}</td>
                  <td>{element.to_date ? moment(element.to_date).format('DD-MM-YYYY') : ''}</td>
                  <td>{element.no_of_days}</td>
                  <td>{element.no_of_days_next_month}</td>
                  <td>{element.leave_type}</td>
                </tr>
              ))}
          </tbody>
        </CommonTable>
      </div>
    </div>
  );
};

export default Leaves;
