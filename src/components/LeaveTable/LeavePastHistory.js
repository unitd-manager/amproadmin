import React from 'react';
import { Row, Form, Table } from 'reactstrap';
import PropTypes from 'prop-types';
import moment from 'moment';

export default function LeavePastHistory({ PastleavesDetails, leavesDetails }) {
  LeavePastHistory.propTypes = {
    PastleavesDetails: PropTypes.any,
    leavesDetails: PropTypes.object,
  };

  let pastLeaves = [];
  if (PastleavesDetails) {
    pastLeaves = PastleavesDetails.filter((el) => {
      return el.leave_id !== leavesDetails.leave_id && new Date(leavesDetails.date) >= new Date(el.date);
    });
  }

  const columns = ['From Date', 'To Date', 'Leave Type', 'No of Days (Current Month)'];

  return (
    <Form>
      <Row>
        <Table id="example1" className="display border border-secondary rounded">
          <thead>
            <tr>
              {columns.map((col) => (
                <td >{col}</td>
              ))}
            </tr>
             
          </thead>
          <tbody>
            {pastLeaves.map((element) => (
              <tr key={element.employee_id}>
                <td>{moment(element.from_date).format('YYYY-MM-DD')}</td>
                <td>{moment(element.to_date).format('YYYY-MM-DD')}</td>
                <td>{element.leave_type}</td>
                <td>
                  {element.no_of_days
                    ? element.no_of_days_next_month
                      ? parseFloat(element.no_of_days) + parseFloat(element.no_of_days_next_month)
                      : element.no_of_days
                    : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>
    </Form>
  );
}
