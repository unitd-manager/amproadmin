import React, { useState, useContext } from 'react';
import { Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ComponentCard from '../../components/ComponentCard';
import message from '../../components/Message';
import api from '../../constants/api';
import creationdatetime from '../../constants/creationdatetime';
import AppContext from '../../context/AppContext';

const CatalogueDetails = () => {
  const navigate = useNavigate();
  const { loggedInuser } = useContext(AppContext);

  const [catalogueDetails, setCatalogueDetails] = useState({
    catalogue_name: '',
    remarks: '',
    sort_order: '',
    is_active: true,
  });

  // Handle form inputs
  const handleInputs = (e) => {
    const { name, value, type, checked } = e.target;
    setCatalogueDetails({
      ...catalogueDetails,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Insert catalogue
  const insertCatalogue = () => {
    if (catalogueDetails.catalogue_name !== '') {
      const payload = {
        ...catalogueDetails,
        creation_date: creationdatetime,
        created_by: loggedInuser.first_name,
      };
      api
        .post('/catalogue/insertCatalogue', payload)
        .then((res) => {
          const insertedId = res.data.data.insertId;
          message('Catalogue saved successfully.', 'success');
          setTimeout(() => {
            navigate(`/CatalogueEdit/${insertedId}`);
          }, 500);
        })
        .catch(() => {
          message('Network error.', 'error');
        });
    } else {
      message('Please enter Catalogue Name.', 'warning');
    }
  };

  return (
    <div>
      <BreadCrumbs />
      <ToastContainer />
      <Row>
        <Col md="6">
          <ComponentCard title="Add New Catalogue">
            <Form>
              <FormGroup>
                <Label>Catalogue Name</Label><span className='required'>*</span>
                <Input
                  type="text"
                  name="catalogue_name"
                  value={catalogueDetails.catalogue_name}
                  onChange={handleInputs}
                />
              </FormGroup>
              <FormGroup>
                <Label>Remarks</Label>
                <Input
                  type="text"
                  name="remarks"
                  value={catalogueDetails.remarks}
                  onChange={handleInputs}
                />
              </FormGroup>
              <FormGroup>
                <Label>Sort Order</Label>
                <Input
                  type="number"
                  name="sort_order"
                  value={catalogueDetails.sort_order}
                  onChange={handleInputs}
                />
              </FormGroup>
              <FormGroup>
                <Label>Is Active</Label>
                <Input
                  type="checkbox"
                  name="is_active"
                  checked={catalogueDetails.is_active}
                  onChange={handleInputs}
                />
              </FormGroup>
              <div className="pt-3 mt-3 d-flex align-items-center gap-2">
                <Button color="primary" onClick={insertCatalogue}>Save</Button>
                <Button className="btn btn-dark" onClick={() => navigate(-1)}>Cancel</Button>
              </div>
            </Form>
          </ComponentCard>
        </Col>
      </Row>
    </div>
  );
};

export default CatalogueDetails;
