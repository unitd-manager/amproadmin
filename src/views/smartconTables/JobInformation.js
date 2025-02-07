import React, { useEffect, useState } from 'react';
import * as Icon from 'react-feather';
import { Badge, Button, Card } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import $ from 'jquery';
import moment from 'moment';
import 'datatables.net-buttons/js/buttons.colVis';
import 'datatables.net-buttons/js/buttons.flash';
// import 'datatables.net-buttons/js/buttons.html5';
// import 'datatables.net-buttons/js/buttons.print';
import { Link } from 'react-router-dom';
import api from '../../constants/api';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import CommonTable from '../../components/CommonTable';

const JobInformation = () => {
  //All state variable
  const [jobInformation, setJobInformation] = useState(null);
  const [empWithoutJobInfo, setEmpWithoutJobInfo] = useState([]);
  const [loading, setLoading] = useState(false);

 //getting employee list not having jobinformation record
 const getEmployeesWithoutJobInformation = () => {
  api
    .get('/payrollmanagement/getEmployeeWithoutJobinfo')
    .then((res) => {
      setEmpWithoutJobInfo(res.data.data);
    
    })
    .catch(() => {
      
    });
};

  //getting data from jobinformation
  const getJobInformation = () => {
    api
      .get('/jobinformation/getjobinformationforList')
      .then((res) => {
        setJobInformation(res.data.data);
        $('#example').DataTable({
          pagingType: 'full_numbers',
          pageLength: 20,
          processing: true,
          dom: 'Bfrtip',
          // buttons: [
          //   {
          //     extend: 'print',
          //     text: 'Print',
          //     className: 'shadow-none btn btn-primary',
          //   },
          // ],
        });
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    getJobInformation();
    getEmployeesWithoutJobInformation();
  }, []);
  //structure of jobinformation list view
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
      name: 'EMP code',
      selector: 'emp_code',
      sortable: true,
      grow: 0,
    },
    {
      name: 'Full Name',
      selector: 'employee_name',
      sortable: true,
      grow: 0,
      wrap: true,
    },
    // {
    //   name: 'Department',
    //   selector: 'department',
    //   sortable: true,
    //   grow: 2,
    //   wrap: true,
    // },
    {
      name: 'S Pass No',
      selector: 'spass_no',
      sortable: true,
      grow: 0,
    },
    {
      name: 'FIN No',
      selector: 'fin_no',
      sortable: true,
      grow: 0,
      wrap: true,
    },
    {
      name: 'NRIC No',
      selector: 'nric_no',
      sortable: true,
      grow: 0,
      wrap: true,
    },
    {
      name: 'DOB',
      selector: 'date_of_birth',
      sortable: true,
      grow: 0,
      wrap: true,
    },
    {
      name: 'Basic Pay',
      selector: 'basic_pay',
      sortable: true,
      grow: 0,
      wrap: true,
    },
    {
      name: 'Pass Type',
      selector: 'citizen',
      sortable: true,
      grow: 0,
      wrap: true,
    },
    {
      name: 'id',
      selector: 'job_information_id',
      grow: 0,
      wrap: true,
      width: '4%',
    },
  ];

  return (
    <div className="MainDiv">
      <div className=" pt-xs-25">
        <BreadCrumbs />
        <Card style={{padding:'10px'}}>
          <div>
            <h5>Please create Job information records for the below employees to make them appear in payroll.</h5>
          {
            empWithoutJobInfo.map((el)=>{
              return(
                <span style={{marginRight:'5px'}}><Badge> {el.employee_name}</Badge></span>
              )
            })
          }
          </div>
        </Card>
        <CommonTable
          loading={loading}
          title="Job Information List"
          Button={
            <Link to="/JobInformationDetails">
              <Button color="primary" className="shadow-none add">
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
            {jobInformation &&
              jobInformation.map(
                (element, index) =>
                  element.status !== 'archive' &&
                  element.status !== 'cancel' && (
                    <tr key={element.job_information_id}>
                      <td>{index + 1}</td>
                      <td>
                        <Link to={`/JobInformationEdit/${element.job_information_id}?tab=1`}>
                          <Icon.Edit2 />
                        </Link>
                      </td>
                      <td>{element.emp_code}</td>
                      <td>{element.employee_name}</td>
                      {/* <td>{element.department}</td> */}
                      <td>{element.passport}</td>
                      <td>{element.fin_no}</td>
                      <td>{element.nric_no}</td>
                      <td>{element.date_of_birth ? moment(element.date_of_birth).format('DD-MM-YYYY') : ''}</td>
                      <td>{element.basic_pay}</td>
                      <td>{element.citizen}</td>
                      <td>{element.job_information_id}</td>
                    </tr>
                  ),
              )}
          </tbody>
        </CommonTable>
      </div>
    </div>
  );
};

export default JobInformation;
