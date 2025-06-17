import React, { useState } from 'react';
import {
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Button,
  Table,
} from 'reactstrap';
// import PropTypes from 'prop-types';

export default function CustomerSalesmen() {
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

  // Synchronize internal state with prop data when contentDetails.salesmen changes
  // Assuming contentDetails will have a 'salesmen' array when loaded from API
//   useEffect(() => {
//     if (contentDetails?.salesmen && Array.isArray(contentDetails.salesmen)) {
//       setCustomerSalesmenList(contentDetails.salesmen);
//     } else {
//       setCustomerSalesmenList([]);
//     }
//   }, [contentDetails.salesmen]);

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
    <div>
      <Row className="mb-4 align-items-end"> {/* align-items-end for better alignment */}
        <Col md="6">
          <FormGroup>
            <Label for="salesmanSelect">Salesman Name</Label>
            <Input
              type="select"
              name="salesmanSelect"
              id="salesmanSelect"
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
          </FormGroup>
        </Col>
        <Col md="6" className="d-flex align-items-center">
          {/* Plus icon/button */}
          <Button color="success" onClick={addSalesman} className="me-2">
            <i className="fa fa-plus"></i> Add Salesman {/* Using Font Awesome icon */}
          </Button>
        </Col>
      </Row>

      <hr />

      <h4>Associated Salesmen</h4>
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
                  <Button color="danger" size="sm" onClick={() => deleteSalesman(salesman.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No salesmen associated yet.</p>
      )}
    </div>
  );
}

// CustomerSalesmen.propTypes = {
//   contentDetails: PropTypes.object,
// };