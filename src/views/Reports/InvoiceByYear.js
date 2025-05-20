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

  console.log('invoiceReport', invoiceReport);

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

  // Fetch company list
  const getCompany = () => {
    api.get('/reports/getCompany').then((res) => {
      setCompany(res.data.data);
    });
  };


  // Fetch invoice data
  const getProject = (companyId = '') => {
    const url = companyId
      ? `/reports/getInvoiceByYearReport?company_id=${companyId}`
      : '/reports/getInvoiceByYearReport';

    api
      .get(url)
      .then((res) => {
        const sortedData = res.data.data.sort(
          (a, b) => Number(b.invoice_year) - Number(a.invoice_year)
        );
        setInvoiceReport(sortedData);
        setUserSearchData(sortedData);
      })
      .catch(() => {
        message('Invoice data not found', 'info');
      });
  };

  const handleSearch = () => {
    getProject(companyName);
  };

  const getCompanyName = (id) => {
    const found = company.find((c) => c.company_id === id);
    return found ? found.company_name : id;
  };
  const totalAmount = userSearchData.reduce(
  (total, item) => total + Number(item.invoice_amount_yearly),
  0
);

  const columns = [
    {
      name: 'SN',
      selector: 's_no',
    },
     {
      name: 'Company',
      selector: 'company_id',
    },
    {
      name: 'Year',
      selector: 'invoice_year',
    },
    {
      name: 'Amount',
      selector: 'invoice_amount_yearly',
    },
  ];

  useEffect(() => {
    getCompany();
    getProject();
  }, []);

  return (
    <>
      <BreadCrumbs />
      <ToastContainer />
      <Card>
        <CardBody>
          <Row>
            <Col>
              {/* Optional: Export report */}
              {/* <ExportReport columns={columns} data={userSearchData} /> */}
            </Col>
            <Col>
              <FormGroup>
                <Label>Select Company</Label>
                <Input
                  type="select"
                  name="company_id"
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

      {/* <Card>
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
      </Card> */}

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
      <tr key={`${element.invoice_year}-${element.company_id}`}>
        <td>{index + 1 + numberOfEmployeesVisited}</td>
         <td>{getCompanyName(element.company_id)}</td>
        <td>{element.invoice_year}</td>
        <td>{Number(element.invoice_amount_yearly).toLocaleString('en-IN')}</td>
      </tr>
    ))}

  {/* Total Row */}
  <tr style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>
    <td></td>
    <td></td>
    <td >Total</td>
    <td className="fw-bold">{totalAmount.toLocaleString('en-IN')}</td>
  </tr>
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
