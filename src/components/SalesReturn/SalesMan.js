import React, { useState, useEffect } from 'react';
import { Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import PropTypes from 'prop-types';
import api from '../../constants/api';

export default function SalesManComponent({  salesOrderId, onSavePendingSalesmen }) {
  SalesManComponent.propTypes = {
   
    salesOrderId: PropTypes.any,
    onSavePendingSalesmen: PropTypes.func,
  };

  const [company, setCompany] = useState([]);
  const [selectedSalesman, setSelectedSalesman] = useState('');
  const [salesmanList, setSalesmanList] = useState([]);

  // Fetch company data (Salesmen)
  const getCompany = () => {
    api.get('/employee/getSalesMan').then((res) => {
      setCompany(res.data.data);
    });
  };

  // Fetch existing salesmen for this sales order
  const getSalesmenList = () => {
    if (salesOrderId) {
      api.post('/employee/getSalesReturnSalesmen', { sales_return_id: salesOrderId })
        .then((res) => {
          const data = res.data && res.data.data ? res.data.data : [];
          setSalesmanList(data);
        })
        .catch((err) => {
          console.error('Failed to fetch salesmen:', err);
        });
    }
  };

  useEffect(() => {
    getCompany();
    getSalesmenList();
  }, [salesOrderId]);

  // Expose a method to save pending salesmen when sales order ID is generated
  useEffect(() => {
    if (onSavePendingSalesmen) {
      onSavePendingSalesmen(salesmanList);
    }
  }, [salesmanList, onSavePendingSalesmen]);

  const handleSelectSalesman = (e) => {
    setSelectedSalesman(e.target.value);
  };
 
  const addSalesman = () => {
    if (selectedSalesman) {
      const salesmanToAdd = company.find(
        (emp) => String(emp.sales_id_dup) === selectedSalesman
      );

      // Check if salesman is already added to prevent duplicates
      if (
        salesmanToAdd &&
        !salesmanList.some((s) => String(s.sales_id_dup) === selectedSalesman)
      ) {
        const data = {
          sales_return_id: salesOrderId,
          sales_id: salesmanToAdd.sales_id_dup,
          salesman_name: salesmanToAdd.salesman_name,
        };

        api.post('/employee/addSalesReturnSalesman', data)
          .then(() => {
            
              const updatedList = [...salesmanList, salesmanToAdd];
              setSalesmanList(updatedList);
              setSelectedSalesman('');
          
          })
          .catch((err) => {
            console.error('Error adding salesman:', err);
            alert('Error adding salesman. Please try again.');
          });
      } else if (salesmanToAdd) {
        alert('This salesman is already added.');
      } else {
        alert('Please select a valid salesman to add.');
      }
    } else {
      alert('Please select a salesman from the dropdown.');
    }
  };

  const deleteSalesman = (salesId) => {
    if (!window.confirm('Are you sure you want to delete this salesman?')) {
      return;
    }

    // Validate that we have both required values
    if (!salesId || !salesOrderId) {
      console.error('Missing required data:', { salesId, salesOrderId });
      alert('Error: Missing sales ID or sales order ID');
      return;
    }

    console.log('Deleting salesman with data:', { sales_id: salesId, sales_return_id: salesOrderId });

    api.post('/employee/removeSalesReturnSalesman', {
      sales_return_id: salesOrderId,
      sales_id: salesId,
    })
      .then((res) => {
        if (res.data && res.data.msg === 'Success') {
          const updatedList = salesmanList.filter((s) => String(s.sales_id) !== String(salesId));
          setSalesmanList(updatedList);
        } else {
          alert('Failed to delete salesman. Please try again.');
        }
      })
      .catch((err) => {
        console.error('Error deleting salesman:', err);
        alert('Error deleting salesman. Please try again.');
      });
  };

  return (
    <Form>
      <FormGroup>
        <div style={{ padding: '12px', backgroundColor: '#e9e9e9', borderRadius: '4px', marginBottom: '8px' }}>
          <h6 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>Salesman Details</h6>
          
          <Row className="mb-3">
            <Col md="4">
              <FormGroup>
                <Label style={{ fontSize: '12px', fontWeight: '500', marginBottom: '4px' }}>
                  Select Sales Man
                </Label>
                <Input
                  type="select"
                  value={selectedSalesman}
                  onChange={handleSelectSalesman}
                  style={{ fontSize: '12px', padding: '4px 6px', height: '28px' }}
                >
                  <option value="">Please Select</option>
                  {company.map((ele) => (
                    <option key={ele.sales_id_dup} value={String(ele.sales_id_dup)}>
                      {ele.salesman_name}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md="2" className="d-flex align-items-end">
              <Button 
                color="primary" 
                size="sm" 
                onClick={addSalesman}
                style={{ fontSize: '12px', padding: '4px 12px', height: '28px' }}
              >
                Add
              </Button>
            </Col>
          </Row>

          {/* Display selected salesmen */}
          {salesmanList.length > 0 && (
            <Row>
              <Col md="12">
                <Label style={{ fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
                  Selected Salesmen:
                </Label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                  {salesmanList.map((salesman) => (
                    <div
                      key={salesman.sales_id_dup}
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '12px',
                      }}
                    >
                      <span>- {salesman.salesman_name}</span>
                      <Button
                        close
                        size="sm"
                        onClick={() => deleteSalesman(salesman.sales_id)}
                        style={{ padding: '0', fontSize: '14px' }}
                      />
                    </div>
                  ))}
                </div>
              </Col>
            </Row>
          )}
        </div>
      </FormGroup>
    </Form>
  );
}
