import React, { useState } from 'react';
import {
  Row,
  Col,
  Label,
  Input,
  Button,
  Table,
} from 'reactstrap';
// import PropTypes from 'prop-types';

export default function SalesMan() {
  // State for the selected salesman from the dropdown
  const [selectedSalesman, setSelectedSalesman] = useState('');

  // Dummy list of available salesmen (replace with API call in real app)
  const availableSalesmen = [
    { id: 'S1', name: 'John Doe' },
    { id: 'S2', name: 'Jane Smith' },
    { id: 'S3', name: 'Peter Jones' },
    { id: 'S4', name: 'Alice Brown' },
  ];
  
  // State to hold the list of salesmen associated with this customer
  const [customerSalesmenList, setCustomerSalesmenList] = useState([]);

  const handleSelectSalesman = (e) => {
    setSelectedSalesman(e.target.value);
  };

  const addSalesman = () => {
    if (selectedSalesman) {
      const salesmanToAdd = availableSalesmen.find(
        (salesman) => salesman.id === selectedSalesman
      );

      // Check if salesman is already added to prevent duplicates
      if (
        salesmanToAdd &&
        !customerSalesmenList.some((s) => s.id === salesmanToAdd.id)
      ) {
        setCustomerSalesmenList([...customerSalesmenList, salesmanToAdd]);
        setSelectedSalesman(''); // Clear selection after adding
        // IMPORTANT: You'll need to pass this updated list to the parent (ContentUpdate)
        // For example, via a prop like onSalesmenChange(updatedList)
      } else if (salesmanToAdd) {
        alert('This salesman is already added.');
      } else {
        alert('Please select a valid salesman to add.');
      }
    } else {
      alert('Please select a salesman from the dropdown.');
    }
  };

  const deleteSalesman = (id) => {
    setCustomerSalesmenList(customerSalesmenList.filter((salesman) => salesman.id !== id));
    // IMPORTANT: Pass updated list to parent if you want changes to persist on save
  };

  return (
    <div className="container-fluid">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Salesman</h5>
        </div>
        <div className="card-body">
          <Row className="mb-4">
            <Col sm={6}>
              <Row>
                <Col sm={4} className="d-flex align-items-center">
                  <Label className="mb-0 fw-bold">Salesman Name</Label>
                </Col>
                <Col sm={8}>
                  <Input
                    type="select"
                    className="form-control-sm"
                    value={selectedSalesman}
                    onChange={handleSelectSalesman}
                  >
                    <option value="">Please Select</option>
                    {availableSalesmen.map((salesman) => (
                      <option key={salesman.id} value={salesman.id}>
                        {salesman.name}
                      </option>
                    ))}
                  </Input>
                </Col>
              </Row>
            </Col>
            <Col sm={6} className="d-flex align-items-center">
              <Button color="primary" size="sm" onClick={addSalesman}>
                Add Salesman
              </Button>
            </Col>
          </Row>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Associated Salesmen</h5>
        </div>
        <div className="card-body">
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
                  <tr key={salesman.id}>
                    <td>{index + 1}</td>
                    <td>{salesman.name}</td>
                    <td>
                      <Button 
                        color="danger" 
                        size="sm" 
                        onClick={() => deleteSalesman(salesman.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center p-3">No salesmen associated yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

// SalesMan.propTypes = {
//   contentDetails: PropTypes.object,
// };