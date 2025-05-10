import React, { useEffect, useState } from 'react';
import * as Icon from 'react-feather';
import moment from 'moment';
import { Button } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import $ from 'jquery';
import 'datatables.net-buttons/js/buttons.colVis';
import 'datatables.net-buttons/js/buttons.print';
import { Link } from 'react-router-dom';
import api from '../../constants/api';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import CommonTable from '../../components/CommonTable';

const Loan = () => {
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(false);

  const getSelectedLocationFromLocalStorage = () => {
    const locations = localStorage.getItem('selectedLocation');
    const loc = JSON.parse(locations);
    return locations ? Number(loc) : null;
  };
  
  const selectedLocation = getSelectedLocationFromLocalStorage();

  const getLoan = () => {
    setLoading(true);
    api
      .post('/loan/getLoanFromLocation', { site_id: selectedLocation })
      .then((res) => {
        setLoan(res.data.data);
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
    getLoan();
  }, []);

  const columns = [
    { name: '#', selector: '', grow: 0, wrap: true, width: '4%' },
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
    { name: 'Loan Application Date', selector: 'date', sortable: true, grow: 2, wrap: true },
    { name: 'Total Loan Amount', selector: 'amount', sortable: true, grow: 0 },
    { name: 'Amount Payable (per month)', selector: 'month_amount', sortable: true, grow: 3 },
    { name: 'Total Amount Paid', selector: 'total_repaid_amount', sortable: true, grow: 3 },
    { name: 'Amount Payable', selector: 'amount_payable', sortable: true, grow: 3 },
    { name: 'Status', selector: 'status', sortable: true, grow: 3 },
  ];

  return (
    <div className="MainDiv">
      <div className="pt-xs-25">
        <BreadCrumbs />
        <CommonTable
          loading={loading}
          title="Loan List"
          module="Loan"
          Button={
            <Link to="/LoanDetails">
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
            {loan &&
              loan.map((element, index) => (
                <tr key={element.loan_id}>
                  <td>{index + 1}</td>
                  <td>
                    <Link to={`/LoanEdit/${element.loan_id}/${element.employee_id}`}>
                      <Icon.Edit2 />
                    </Link>
                  </td>
                  <td>{element.employee_name}</td>
                  <td>{element.date ? moment(element.date).format('DD-MM-YYYY') : ''}</td>
                  <td>{element.amount}</td>
                  <td>{element.month_amount}</td>
                  <td>{element.total_repaid_amount}</td>
                  <td>{element.amount_payable}</td>
                  <td>{element.status}</td>
                </tr>
              ))}
          </tbody>
        </CommonTable>
      </div>
    </div>
  );
};

export default Loan;
