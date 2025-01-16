import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Form, FormGroup, Button } from 'reactstrap';
import ComponentCardV2 from '../ComponentCardV2';

export default function LoanButtons({
  editLoanData,
  editLoanStartData,
  editLoanClosingData,
  applyChanges,
  saveChanges,
  backToList,
}) {
  LoanButtons.propTypes = {
    editLoanData: PropTypes.func,
    editLoanStartData: PropTypes.func,
    editLoanClosingData: PropTypes.func,
    applyChanges: PropTypes.func,
    saveChanges: PropTypes.func,
    backToList: PropTypes.func,
  };
  return (
    <Form>
      <FormGroup>
        <ComponentCardV2>
          <Row>
            <Col>
              <Button
                color="primary"
                className="shadow-none"
                onClick={() => {
                  editLoanData();
                  editLoanStartData();
                  editLoanClosingData();
                  saveChanges();
                }}
              >
                Save
              </Button>
            </Col>
            <Col>
              <Button
                color="primary"
                className="shadow-none"
                onClick={() => {
                  editLoanData();
                  editLoanStartData();
                  editLoanClosingData();
                  applyChanges();
                }}
              >
                Apply
              </Button>
            </Col>
            <Col>
              <Button
                color="dark"
                className="shadow-none"
                onClick={() => {
                  backToList();
                }}
              >
                Back to List
              </Button>
            </Col>
          </Row>
        </ComponentCardV2>
      </FormGroup>
    </Form>
  );
}
