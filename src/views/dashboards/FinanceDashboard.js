import React from 'react';
import { Row, Col, } from 'reactstrap';
import RecentReceipts from '../../components/dashboard/finance/RecentReceipts';
import RecentPayments from '../../components/dashboard/finance/RecentPayments';

const FinanceDashboard = () => { 
  

  return (
    <div>
   
      <Row>
        <Col md="6">
          <RecentReceipts />
        </Col>
        <Col md="6">
          <RecentPayments />
        </Col>
      </Row>
    </div>
  );
};

export default FinanceDashboard;


