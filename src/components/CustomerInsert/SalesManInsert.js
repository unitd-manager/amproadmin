import React, { useState, useEffect } from 'react';
import { Row, Col, FormGroup, Label, Input, Button, Table } from 'reactstrap';
import PropTypes from 'prop-types';
import api from '../../constants/api';
import message from '../Message'; // Adjust path if necessary

export default function CustomerSalesmenInsert({  setSalesmenData }) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [availableSalesmen, setAvailableSalesmen] = useState([]);
  const [customerSalesmenList, setCustomerSalesmenList] = useState([]); // This holds salesmen selected by the user

  // Fetch all available salesmen (employees) for the dropdown
  useEffect(() => {
    api.get('/customer/getAllSalesmen')
      .then((res) => {
        if (res.data && Array.isArray(res.data.data)) {
          setAvailableSalesmen(res.data.data);
        }
      })
      .catch((err) => {
        console.error('Error fetching available salesmen:', err);
        message('Failed to load salesmen list.', 'error');
      });
  }, []);

  // Use useEffect to send the current customerSalesmenList array to the parent whenever it changes
  useEffect(() => {
    setSalesmenData(customerSalesmenList);
  }, [customerSalesmenList, setSalesmenData]); // Depend on customerSalesmenList and the setter function

  const handleSelectSalesman = (e) => {
    setSelectedEmployeeId(e.target.value);
  };

  const addSalesman = () => {
    if (!selectedEmployeeId) {
      message('Please select a salesman to add.', 'warning');
      return;
    }

    const salesmanToAdd = availableSalesmen.find(
      (salesman) => String(salesman.employee_id) === String(selectedEmployeeId)
    );

    if (salesmanToAdd) {
      // Prevent adding the same salesman multiple times
      if (customerSalesmenList.some((s) => String(s.employee_id) === String(salesmanToAdd.employee_id))) {
        message('This salesman is already associated.', 'warning');
        return;
      }

      setCustomerSalesmenList((prevList) => [...prevList, salesmanToAdd]);
      setSelectedEmployeeId(''); // Clear dropdown selection
      message('Salesman added to list.', 'success');
    } else {
      message('Invalid salesman selected.', 'error');
    }
  };

  const deleteSalesman = (employeeIdToDelete) => {
    setCustomerSalesmenList((prevList) =>
      prevList.filter((s) => String(s.employee_id) !== String(employeeIdToDelete))
    );
    message('Salesman removed from list.', 'success');
  };

  return (
    <div>
      <Row className="mb-4 align-items-end">
        <Col md="6">
          <FormGroup>
            <Label for="salesmanSelect">Salesman Name</Label>
            <Input
              type="select"
              name="salesmanSelect"
              id="salesmanSelect"
              value={selectedEmployeeId}
              onChange={handleSelectSalesman}
            >
              <option value="">Please Select</option>
              {availableSalesmen.map((salesman) => (
                <option key={salesman.employee_id} value={salesman.employee_id}>
                  {salesman.employee_name}
                </option>
              ))}
            </Input>
          </FormGroup>
        </Col>
        <Col md="6" className="d-flex align-items-center">
          <Button color="success" onClick={addSalesman} className="me-2">
            <i className="fa fa-plus"></i> Add Salesman
          </Button>
        </Col>
      </Row>

      <hr />

      <h4>Associated Salesmen (To be saved with customer)</h4>
      {customerSalesmenList.length > 0 ? (
        <Table responsive bordered>
          <thead>
            <tr>
              <th>#</th>
              <th>Salesman Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customerSalesmenList.map((salesman, index) => (
              <tr key={salesman.employee_id}>
                <td>{index + 1}</td>
                <td>{salesman.employee_name}</td>
                <td>
                  <Button color="danger" size="sm" onClick={() => deleteSalesman(salesman.employee_id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No salesmen selected for association yet.</p>
      )}
    </div>
  );
}

CustomerSalesmenInsert.propTypes = {
  // contactId: PropTypes.number, // contactId is null for new customer, number for edit
  setSalesmenData: PropTypes.func.isRequired,
};