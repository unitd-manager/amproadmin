import { Row, Col } from 'reactstrap';
import InvoiceMonthlyChart from '../../components/dashboard/ecommerceDashboard/InvoiceMonthlyChart';

import EmployeeSummary from '../../components/dashboard/ecommerceDashboard/EmployeeSummary';
import PasspotExpirySummary from '../../components/dashboard/PasspotExpirySummary';
import WorkpermitExpirySummary from '../../components/dashboard/WorkpermitExpirySummary';

const Classic = () => {
  return (
    <>
      <Row>
        <Col lg="12">
        <InvoiceMonthlyChart />
          <EmployeeSummary/>
          <PasspotExpirySummary />
          <WorkpermitExpirySummary/>
          {/* <SalesOverview /> */}
        </Col>
      </Row>
    </>
  );
};

export default Classic;
