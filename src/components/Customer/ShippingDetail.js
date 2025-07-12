import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Button,
  Table,
} from 'reactstrap';
import PropTypes from 'prop-types';
import api from '../../constants/api';
import message from '../Message';

export default function CustomerShippingDetail({ contactId }) {
  const [newShippingDetail, setNewShippingDetail] = useState({
    delivery_name: '',
    delivery_address1: '',
    delivery_address2: '',
    delivery_address3: '',
    phone_no: '',
    handphone_no: '',
    fax_no: '',
    email: '',
    country_postal: '',
    attention: '',
    default_load_on_invoice: 0,
     company_id: contactId,
  });

  const [shippingDetailList, setShippingDetailList] = useState([]);

  const getShipping = () => {
    api
      .post('/contact/getShippingByContactId', { company_id: contactId })
      .then((res) => {
        setShippingDetailList(res.data.data);
      })
      .catch(() => {
        message('Shipping not found', 'error');
      });
  };

  useEffect(() => {
    if (contactId) {
      getShipping();
    }
  }, [contactId]);

  const handleNewShippingInputs = (e) => {
    const { name, value, type, checked } = e.target;
    setNewShippingDetail({
      ...newShippingDetail,
      [name]: type === 'checkbox' || type === 'switch' ? (checked ? 1 : 0) : value,
    });
  };

  const addShippingDetail = () => {
    if (newShippingDetail.delivery_name && newShippingDetail.delivery_address1) {
      const shippingData = {
        ...newShippingDetail,
        company_id: contactId,
      };
      api
        .post('/contact/insertShipping', shippingData)
        .then(() => {
          message('Shipping added successfully', 'success');
          getShipping(); // Refresh the list
          setNewShippingDetail({
            delivery_name: '',
            delivery_address1: '',
            delivery_address2: '',
            delivery_address3: '',
            phone_no: '',
            handphone_no: '',
            fax_no: '',
            email: '',
            country_postal: '',
            attention: '',
            default_load_on_invoice: 0,
             company_id: contactId,
          });
        })
        .catch(() => {
          message('Failed to add shipping', 'error');
        });
    } else {
      message('Please fill at least Delivery Name and Delivery Address1.', 'warning');
    }
  };

  const deleteShippingDetail = (shippingId) => {
    api
      .post('/contact/deleteShipping', { delivery_address_id: shippingId })
      .then(() => {
        message('Shipping deleted successfully', 'success');
        getShipping(); // Refresh the list
      })
      .catch(() => {
        message('Failed to delete shipping', 'error');
      });
  };

  return (
    <div>
      <Row className="mb-4">
        <Col md="6">
          <FormGroup>
            <Label>Delivery Name</Label>
            <Input
              type="text"
              onChange={handleNewShippingInputs}
              value={newShippingDetail.delivery_name}
              name="delivery_name"
            />
          </FormGroup>
          <FormGroup>
            <Label>Delivery Address1</Label>
            <Input
              type="text"
              onChange={handleNewShippingInputs}
              value={newShippingDetail.delivery_address1}
              name="delivery_address1"
            />
          </FormGroup>
          <FormGroup>
            <Label>Delivery Address2</Label>
            <Input
              type="text"
              onChange={handleNewShippingInputs}
              value={newShippingDetail.delivery_address2}
              name="delivery_address2"
            />
          </FormGroup>
          <FormGroup>
            <Label>Delivery Address3</Label>
            <Input
              type="text"
              onChange={handleNewShippingInputs}
              value={newShippingDetail.delivery_address3}
              name="delivery_address3"
            />
          </FormGroup>
          <FormGroup>
            <Label>Phone No</Label>
            <Input
              type="text"
              onChange={handleNewShippingInputs}
              value={newShippingDetail.phone_no}
              name="phone_no"
            />
          </FormGroup>
          <FormGroup check>
            <Input
              type="checkbox"
              onChange={handleNewShippingInputs}
              name="default_load_on_invoice"
              checked={newShippingDetail.default_load_on_invoice === 1}
            />
            <Label check>Default Load On Invoice</Label>
          </FormGroup>
        </Col>

        <Col md="6">
          <FormGroup>
            <Label>Fax No</Label>
            <Input
              type="text"
              onChange={handleNewShippingInputs}
              value={newShippingDetail.fax_no}
              name="fax_no"
            />
          </FormGroup>
          <FormGroup>
            <Label>Email</Label>
            <Input
              type="text"
              onChange={handleNewShippingInputs}
              value={newShippingDetail.email}
              name="email"
            />
          </FormGroup>
          <FormGroup>
            <Label>Hand Phone No</Label>
            <Input
              type="text"
              onChange={handleNewShippingInputs}
              value={newShippingDetail.handphone_no}
              name="handphone_no"
            />
          </FormGroup>

          <FormGroup>
            <Label>Country/Postal</Label>
            <Input
              type="text"
              onChange={handleNewShippingInputs}
              value={newShippingDetail.country_postal}
              name="country_postal"
            />
          </FormGroup>
          <FormGroup>
            <Label>Attention</Label>
            <Input
              type="text"
              onChange={handleNewShippingInputs}
              value={newShippingDetail.attention}
              name="attention"
            />
          </FormGroup>
        </Col>

        <Col md="12" className="text-right mt-3">
          <Button color="success" onClick={addShippingDetail}>
            Add Shipping Detail
          </Button>
        </Col>
      </Row>

      <hr />

      <h4>Existing Shipping Details</h4>
      {shippingDetailList.length > 0 ? (
        <Table responsive bordered>
          <thead>
            <tr>
              <th>#</th>
              <th>Delivery Name</th>
              <th>Address1</th>
              <th>Address2</th>
              <th>Address3</th>
              <th>Phone No</th>
              <th>HandPhone No</th>
              <th>Fax No</th>
              <th>Email</th>
              <th>Country/Postal</th>
              <th>Attention</th>
              <th>Default Load On Invoice</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {shippingDetailList.map((detail, index) => (
              <tr key={detail.delivery_address_id}>
                <td>{index + 1}</td>
                <td>{detail.delivery_name}</td>
                <td>{detail.delivery_address1}</td>
                <td>{detail.delivery_address2}</td>
                <td>{detail.delivery_address3}</td>
                <td>{detail.phone_no}</td>
                <td>{detail.handphone_no}</td>
                <td>{detail.fax_no}</td>
                <td>{detail.email}</td>
                <td>{detail.country_postal}</td>
                <td>{detail.attention}</td>
                <td>{detail.default_load_on_invoice ? 'Yes' : 'No'}</td>
                <td>
                  <Button
                    color="danger"
                    size="sm"
                    onClick={() => deleteShippingDetail(detail.delivery_address_id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No shipping details added yet.</p>
      )}
    </div>
  );
}

CustomerShippingDetail.propTypes = {
  contactId: PropTypes.string.isRequired,
};
