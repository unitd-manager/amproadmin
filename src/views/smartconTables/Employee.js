import { Link } from 'react-router-dom';
import { Row, Col, Button } from 'reactstrap';
import $ from 'jquery';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import readXlsxFile from 'read-excel-file';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import 'bootstrap/dist/css/bootstrap.min.css';
import EmployeeCard from '../../components/dashboard/extraDashboard/EmployeeCard';
import api from '../../constants/api';
import message from '../../components/Message';
import CommonTable from '../../components/CommonTable';
import Image from '../../assets/images/users/user1.jpg';

const Cards = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllEmployees = () => {
    setLoading(true);
    api
      .get('/employeeModule/getCurrentEmployee')
      .then((res) => {
        setEmployees(res.data.data);
        setLoading(false);
      })
      .catch(() => {
        //message('Employee Data Not Found', 'info');
        setLoading(false);
      });
  };

  
   // TRIGGER TO IMPORT EXCEL SHEET
   const importExcel = () => {
    $('#import_excel').trigger('click');
  }

  // UPLOAD FILE ON THER SERVER
  const uploadOnServer = (arr) => {
      api.post('/employeeModule/import/excel', {data: JSON.stringify(arr)})
      .then(() => {
        message('File uploaded successfully', 'success');
        $('#upload_file').val(null);
      })
      .catch(() => {
        message('Failed to upload.', 'error');
      });
  }

  // PROCESSING AND FORMATTING THE DATA
  const processData = (rows) => {
    const arr = [];
    rows.shift();

    console.log(rows[0]);
    for ( let x = 0; x < rows.length; x++ ) {
      arr.push(
        {
          Record_No: rows[x][0],
          WorkPermit: rows[x][1],
          NRIC_FIN: rows[x][2],
          WorkPermitValidFromDate: rows[x][3],
          WorkPermitExpiryDate: rows[x][4],
          WelderID: rows[x][5],
          Name: rows[x][6],
          DOB: rows[x][7],
          Gender: rows[x][8],
          Race: rows[x][9],
          Nationality: rows[x][10],
          Citizenship: rows[x][11],
          SkillSet: rows[x][12],
          Occupation: rows[x][13],
          Education: rows[x][14],
          SOCCertNum: rows[x][15],
          SOCRegisDate: rows[x][16],
          CommenceDate: rows[x][17],
          Sponsor: rows[x][18],
          SubContractor: rows[x][19],
          Remarks: rows[x][20]
        }
      )
    }

    uploadOnServer(arr);
  }

  // IMPORTING EXCEL FILE
  const importExcelFile = (e) => {
    console.log(e.target.id)
    message('test1', 'success');
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        readXlsxFile(e.target.files[0])
          .then((rows) => {
            processData(rows);
           // message('Uploading File On The Server', 'info');
          })
          .finally(() => {
            $('#upload_file').val(null);
          }).catch(
            err => console.log('Error Found:', err)
          );
      }
    };
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
  };


  useEffect(() => {
    getAllEmployees();
  }, []);

  return (
    <>
      <div className="pt-xs-25">
        <BreadCrumbs />
        <ToastContainer></ToastContainer>
        <CommonTable
          loading={loading}
          title="Employee    List"
          Button={
            <>
              <Row>
                <Col md="4">
                  <Link to="/EmployeeDetails">
                    <Button color="primary" className="shadow-none">
                      New
                    </Button>
                  </Link>
                </Col>
                <Col md="4">
            {/* <Link to=""> */}
            <Button color="primary" className="shadow-none " onClick={() => importExcel()}>
                Import
              </Button>
            {/* </Link> */}
            <input type='file' style={{display: 'none'}} id="import_excel" onChange={importExcelFile} />
            </Col>
                <Col md="4">
                  <a
                    href="http://43.228.126.245/pyramidapi/storage/excelsheets/Employee.xlsx"
                    download
                  >
                    <Button color="primary" className="shadow-none mr-3">
                      Sample
                    </Button>
                  </a>
                </Col>
              </Row>
            </>
          }
        ></CommonTable>

        <Row className="employee-img">
          {employees.map((blg) => {
            console.log(blg.project_designation)
            return (
              <Col sm="6" lg="6" xl="4" key={blg.employee_id_duplicate}>
                <EmployeeCard
                  onClick={`/EmployeeEdit/${blg.employee_id_duplicate}?tab=1`}
                  image={Image}
                  id={blg.employee_id_duplicate}
                  title={blg.employee_name?.split(' ').shift().toUpperCase()} // before: title={blg.employee_name.charAt(0).toUpperCase() + blg.employee_name.slice(1)}
                  dateOfBirth={blg.date_of_birth}
                  empId={blg.employee_id_duplicate}
                  projectDesignation={blg.project_designation}
                  gender={blg.gender}
                  team={blg.team}
                  empCode={blg.emp_code}
                  email={blg.login_email}
                />
              </Col>
            )
          })}
        </Row>
      </div>
    </>
  );
};

export default Cards;
