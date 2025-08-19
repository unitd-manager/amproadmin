import React, { useState, useContext } from 'react';
import { Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ComponentCard from '../../components/ComponentCard';
import api from '../../constants/api';
import message from '../../components/Message';
import creationdatetime from '../../constants/creationdatetime';
import AppContext from '../../context/AppContext';

const StockRequestDetails = () => {
  const { loggedInuser } = useContext(AppContext);
  const navigate = useNavigate();
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [stockRequest, setStockRequest] = useState({
    from_location: '',
    to_location: '',
    stock_req_date: '',
    remarks: '',
  });

  const handleInputs = (e) => {
    setStockRequest({ ...stockRequest, [e.target.name]: e.target.value });
  };

  const insertStockRequest = (code) => {
    if (stockRequest.from_location && stockRequest.to_location && stockRequest.stock_req_date) {
      stockRequest.stock_req_no = code;
      stockRequest.creation_date = creationdatetime;
      stockRequest.created_by = loggedInuser.first_name;
      stockRequest.status = 'Pending';

      api.post('/stockRequest/insertStockRequest', stockRequest)
        .then((res) => {
          const insertedId = res.data.data.insertId;
          message('Stock Request inserted successfully.', 'success');
          setTimeout(() => {
            navigate(`/StockRequestEdit/${insertedId}?tab=1`);
          }, 300);
        })
        .catch(() => {
          message('Network connection error.', 'error');
        });
    } else {
      setFormSubmitted(true);
      message('Please fill all required fields', 'warning');
    }
  };

  const generateCode = () => {
    api.post('/commonApi/getCodeValues', { type: 'stockrequest' })
      .then((res) => {
        insertStockRequest(res.data.data);
      })
      .catch(() => {
        insertStockRequest('');
      });
  };

  return (
    <div>
      <BreadCrumbs />
      <Row>
        <ToastContainer />
        <Col md="6" xs="12">
          <ComponentCard title="New Stock Request">
            <Form>
              <FormGroup>
                <Label>From Location <span className="required">*</span></Label>
                <Input
                  type="text"
                  name="from_location"
                  value={stockRequest.from_location}
                  onChange={handleInputs}
                  className={formSubmitted && !stockRequest.from_location ? 'highlight' : ''}
                />
              </FormGroup>

              <FormGroup>
                <Label>To Location <span className="required">*</span></Label>
                <Input
                  type="text"
                  name="to_location"
                  value={stockRequest.to_location}
                  onChange={handleInputs}
                  className={formSubmitted && !stockRequest.to_location ? 'highlight' : ''}
                />
              </FormGroup>

              <FormGroup>
                <Label>Stock Request Date <span className="required">*</span></Label>
                <Input
                  type="date"
                  name="stock_req_date"
                  value={stockRequest.stock_req_date}
                  onChange={handleInputs}
                  className={formSubmitted && !stockRequest.stock_req_date ? 'highlight' : ''}
                />
              </FormGroup>

              <FormGroup>
                <Label>Remarks</Label>
                <Input
                  type="textarea"
                  name="remarks"
                  value={stockRequest.remarks}
                  onChange={handleInputs}
                />
              </FormGroup>

              <Row>
                <div className="pt-3 mt-3 d-flex align-items-center gap-2">
                  <Button
                    type="button"
                    color="primary"
                    className="btn mr-2 shadow-none"
                    onClick={generateCode}
                  >
                    Save & Continue
                  </Button>
                  <Button
                    className="shadow-none"
                    color="dark"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to cancel?\nYou will lose any changes made.')) {
                        navigate(-1);
                      }
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </Row>
            </Form>
          </ComponentCard>
        </Col>
      </Row>
    </div>
  );
};

export default StockRequestDetails;
