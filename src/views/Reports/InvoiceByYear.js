import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import 'datatables.net-buttons/js/buttons.colVis';
import 'datatables.net-buttons/js/buttons.flash';
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.print';
import { ToastContainer } from 'react-toastify';
import { Button, Card, CardBody, Col, FormGroup, Input, Label, Row, Table } from 'reactstrap';
import ReactPaginate from 'react-paginate';
import api from '../../constants/api';
import message from '../../components/Message';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ExportReport from '../../components/Report/ExportReport';

const InvoiceBYYear = () => {
  const [invoiceReport, setInvoiceReport] = useState([]);
  const [userSearchData, setUserSearchData] = useState([]);
  const [companyName, setCompanyName] = useState('');
  const [company, setCompany] = useState([]);
  const [page, setPage] = useState(0);

  const employeesPerPage = 20;
  const numberOfEmployeesVisited = page * employeesPerPage;

  const displayEmployees = userSearchData.slice(
    numberOfEmployeesVisited,
    numberOfEmployeesVisited + employeesPerPage
  );
  const totalPages = Math.ceil(userSearchData.length / employeesPerPage);

  const changePage = ({ selected }) => {
    setPage(selected);
  };

  const thisYear = new Date().getFullYear();
console.log('thisyear',thisYear)
console.log('invoiceReport',invoiceReport)


  // Fetch company list for dropdown
  const getCompany = () => {
    api.get('/reports/getCompany').then((res) => {
      setCompany(res.data.data);
    });
  };

  // Fetch invoice data, optionally filtered by company
  const getProject = (companyId = '') => {
    const url = companyId
      ? `/reports/getInvoiceByYearReport?recordType=${companyId}`
      : '/reports/getInvoiceByYearReport';

    api
      .get(url)
      .then((res) => {
        setInvoiceReport(res.data.data);
        setUserSearchData(res.data.data);
      })
      .catch(() => {
        message('Invoice data not found', 'info');
      });
  };

  const handleSearch = () => {
    getProject(companyName);
  };

  // Convert company_id to name for display
  const getCompanyName = (id) => {
    const found = company.find((c) => c.company_id === id);
    return found ? found.company_name : id;
  };

  const columns = [
    {
      name: 'SN',
      selector: 's_no',
    },
    {
      name: 'Year',
      selector: 'invoice_year',
    },
    {
      name: 'Amount',
      selector: 'invoice_amount_yearly',
    },
    {
      name: 'Company',
      selector: 'company_id',
    },
  ];

  useEffect(() => {
    getCompany();
    getProject(); // Load all by default
  }, []);

  return (
    <>
      <BreadCrumbs />
      <ToastContainer />
      <Card>
        <CardBody>
          <Row>
            <Col>
              {/* Optional export */}
              {/* <ExportReport columns={columns} data={userSearchData} /> */}
            </Col>
            <Col>
              <FormGroup>
                <Label>Select Company</Label>
                <Input
                  type="select"
                  name="record_type"
                  onChange={(e) => setCompanyName(e.target.value)}
                >
                  <option value="">Please Select</option>
                  {company &&
                    company.map((ele) => (
                      <option key={ele.company_id} value={ele.company_id}>
                        {ele.company_name}
                      </option>
                    ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md="1">
              <Button color="primary" className="shadow-none" onClick={handleSearch}>
                Go
              </Button>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Row>
            <Col md="4">
              <Label>
                <b>Selected Company:</b>{' '}
                {companyName ? getCompanyName(companyName) : 'All Companies'}
              </Label>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Row>
            <Col>
              <ExportReport columns={columns} data={userSearchData} />
            </Col>
          </Row>
        </CardBody>
        <CardBody>
          <Table striped bordered hover>
            <thead>
              <tr>
                {columns.map((cell) => (
                  <th key={cell.name}>{cell.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayEmployees &&
                displayEmployees.map((element, index) => (
                  <tr key={element.invoice_id}>
                    <td>{index + 1 + numberOfEmployeesVisited}</td>
                    <td>{element.invoice_year}</td>
                    <td>{element.invoice_amount_yearly}</td>
                    <td>{getCompanyName(element.company_id)}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
          <ReactPaginate
            previousLabel="Previous"
            nextLabel="Next"
            pageCount={totalPages}
            onPageChange={changePage}
            containerClassName="navigationButtons"
            previousLinkClassName="previousButton"
            nextLinkClassName="nextButton"
            disabledClassName="navigationDisabled"
            activeClassName="navigationActive"
          />
        </CardBody>
      </Card>
    </>
  );
};

export default InvoiceBYYear;
