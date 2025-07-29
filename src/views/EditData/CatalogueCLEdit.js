import React, { useState, useEffect, useContext } from 'react';
import {
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button
} from 'reactstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ComponentCard from '../../components/ComponentCard';
import message from '../../components/Message';
import api from '../../constants/api';
import AppContext from '../../context/AppContext';

const CatalogueDetails = () => {
  const [catalogue, setCatalogue] = useState({
    catalogue_name: '',
    catalogue_code: '',
    remarks: '',
    sort_order: '',
    is_active: 1,
  });

  const navigate = useNavigate();
  const { id } = useParams();
  const { loggedInuser } = useContext(AppContext);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? (checked ? 1 : 0) : value;
    setCatalogue({ ...catalogue, [name]: val });
  };

  const getCatalogueDetails = () => {
    api
      .post('/catalogue/getCatalogueById', { catalogue_id: id })
      .then((res) => {
        if (res.data.data.length > 0) {
          setCatalogue(res.data.data[0]);
        }
      })
      .catch(() => {
        message('Unable to fetch catalogue details', 'error');
      });
  };

  const saveCatalogue = () => {
    if (catalogue.catalogue_name.trim() === '') {
      message('Catalogue Name is required', 'warning');
      return;
    }

    const payload = {
      ...catalogue,
      modified_by: loggedInuser.first_name,
      catalogue_id: id,
    };

    api
      .post('/catalogue/EditCatalogue', payload)
      .then(() => {
        message('Catalogue updated successfully.', 'success');
      })
      .catch(() => {
        message('Unable to update record.', 'error');
      });
  };

  useEffect(() => {
    if (id) getCatalogueDetails();
  }, [id]);

  return (
    <div>
      <BreadCrumbs />
      <ToastContainer />
      <Row>
        <Col md="12">
          <ComponentCard title="Add/Edit Catalogue">
    <Form>

      <FormGroup>
    <Row className="align-items-center">
      <Col md={4}>
        <Label>Catalogue Code</Label>
      </Col>
      <Col md={4}>
        <Input
          type="text"
          name="catalogue_code"
          value={catalogue.catalogue_code}
          onChange={handleInputChange}
          placeholder="Catalogue Code"
          disabled
        />
      </Col>
    </Row>
  </FormGroup>


  <FormGroup>
    <Row className="align-items-center">
      <Col md={4}>
        <Label>
          Catalogue Name <span className="required">*</span>
        </Label>
      </Col>
      <Col md={4}>
        <Input
          type="text"
          name="catalogue_name"
          value={catalogue.catalogue_name}
          onChange={handleInputChange}
          placeholder="Enter Catalogue Name"
        />
      </Col>
    </Row>
  </FormGroup>

  
  <FormGroup>
    <Row className="align-items-center">
      <Col md={4}>
        <Label>Remarks</Label>
      </Col>
      <Col md={4}>
        <Input
          type="text"
          name="remarks"
          value={catalogue.remarks}
          onChange={handleInputChange}
          placeholder="Enter Remarks"
        />
      </Col>
    </Row>
  </FormGroup>

  <FormGroup>
    <Row className="align-items-center">
      <Col md={4}>
        <Label>Sort Order</Label>
      </Col>
      <Col md={4}>
        <Input
          type="text"
          name="sort_order"
          value={catalogue.sort_order}
          onChange={handleInputChange}
          placeholder="Enter Sort Order"
        />
      </Col>
    </Row>
  </FormGroup>

  <FormGroup>
    <Row className="align-items-center">
      <Col md={4}>
        <Label>IsActive</Label>
      </Col>
      <Col md={8}>
        <Input
          type="checkbox"
          name="in_active"
          checked={catalogue.in_active === 1}
          onChange={handleInputChange}
        />
      </Col>
    </Row>
  </FormGroup>

  <div className="d-flex gap-2 pt-2">
    <Button color="primary" onClick={saveCatalogue}>
      Save
    </Button>
    <Button
      color="danger"
      onClick={() =>
        window.confirm('Cancel changes?') && navigate('/CatalogueCL')
      }
    >
      Cancel
    </Button>
  </div>
</Form>
          </ComponentCard>
        </Col>
      </Row>
    </div>
  );    
};

export default CatalogueDetails;
