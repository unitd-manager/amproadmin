import React, { useState } from 'react';
import {
  Row,
  Col,
  Label,
  Input,
  Button,
  Table,
} from 'reactstrap';
 import PropTypes from 'prop-types';

import api from '../../constants/api';

export default function SalesMan({ customerId }) {
  // State for the selected salesman from the dropdown
  const [selectedSalesman, setSelectedSalesman] = useState('');

  // State for available salesmen fetched from API
  const [availableSalesmen, setAvailableSalesmen] = useState([]);

  // Fetch salesmen from API endpoint on mount
  React.useEffect(() => {
    api.get('/valuelist/getTeam')
      .then((res) => {
        const data = res.data && res.data.data ? res.data.data : [];
        setAvailableSalesmen(data);
      })
      .catch((err) => {
        console.error('Failed to fetch salesmen:', err);
        setAvailableSalesmen([]);
      });
  }, []);
  
  // State to hold the list of salesmen associated with this customer
  const [customerSalesmenList, setCustomerSalesmenList] = useState([]);

  const handleSelectSalesman = (e) => {
    setSelectedSalesman(e.target.value);
  };

  const addSalesman = () => {
    if (selectedSalesman) {
      const salesmanToAdd = availableSalesmen.find(
        (salesman) => String(salesman.valuelist_id) === selectedSalesman
      );

      // Check if salesman is already added to prevent duplicates
      if (
        salesmanToAdd &&
        !customerSalesmenList.some((s) => String(s.valuelist_id) === selectedSalesman)
      ) {
        // Derive a human-readable title for the salesman
        const salesmanTitle = salesmanToAdd.value || salesmanToAdd.code || salesmanToAdd.key_text || salesmanToAdd.name || '';

        // Prepare data for API call (include salesman_title and valuelist_id)
        const data = {
          company_id: customerId,
          valuelist_id: salesmanToAdd.valuelist_id,
          salesman_title: salesmanTitle,
          creation_date: new Date().toISOString(),
          modification_date: new Date().toISOString(),
        };

        // Make API call to save to database
        api.post('/contact/insertToSalesman', data)
          .then((res) => {
            if (res.data && res.data.msg === 'Success') {
              // Add the salesman to local state and include the salesman_title for display
              const entry = { ...salesmanToAdd, salesman_title: salesmanTitle };
              setCustomerSalesmenList([...customerSalesmenList, entry]);
              setSelectedSalesman(''); // Clear selection after adding
            } else {
              alert('Failed to add salesman. Please try again.');
            }
          })
          .catch((err) => {
            console.error('Error adding salesman:', err);
            alert('Failed to add salesman. Please try again.');
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


  React.useEffect(() => {
  if (customerId) {
    
         api
              .post('/contact/getSalesmanByCustomerId', { company_id: customerId })
              .then((res) => {
        const data = res.data && res.data.data ? res.data.data : [];
        setCustomerSalesmenList(data);
      })
      .catch((err) => {
        console.error('Failed to fetch customer salesmen:', err);
        setCustomerSalesmenList([]);
      });
  }
}, [customerId]);


  // const deleteSalesman = (id) => {
  //   setCustomerSalesmenList(customerSalesmenList.filter((salesman) => String(salesman.valuelist_id) !== String(id)));
  //   // IMPORTANT: Pass updated list to parent if you want changes to persist on save
  // };


  const deleteSalesman = (id) => {
  if (!window.confirm('Are you sure you want to delete this salesman?')) {
    return;
  }

  // Make API call to delete from backend
  api
    .post('/contact/deleteSalesMan', { customer_salesmen_id: id})
    .then((res) => {
      if (res.data && res.data.msg === 'Success') {
        // Remove from local state after successful deletion
        setCustomerSalesmenList((prevList) =>
          prevList.filter((salesman) => String(salesman.valuelist_id) !== String(id))
        );
          setTimeout(() => {
            window.location.reload();
          }, 400);
      } else {
        alert('Failed to delete salesman. Please try again.');
      }
    })
    .catch((err) => {
      console.error('Error deleting salesman:', err);
      alert('Failed to delete salesman. Please try again.');
    });
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
                    {availableSalesmen && availableSalesmen.map((t) => (
                      <option
                            key={t.valuelist_id || t.code || t.value}
                            value={String(t.valuelist_id)}
                          >
                            {t.value || t.code || t.key_text}
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
                  <tr key={salesman.valuelist_id}>
                    <td>{index + 1}</td>
                    <td>{salesman.salesman_title || salesman.value || salesman.code || salesman.key_text}</td>
                    <td>
                      <Button 
                        color="danger" 
                        size="sm" 
                        onClick={() => deleteSalesman(salesman.customer_salesmen_id)}
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

SalesMan.propTypes = {

  customerId: PropTypes.any,
};