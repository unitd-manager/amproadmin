import React, { useState, useEffect } from 'react';
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
import message from '../Message';

export default function SupplierShippingDetail({ contactId }) {
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
    <div className="container-fluid">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Shipping Details</h5>
        </div>
        <div className="card-body">
          <Row>
            <Col sm={6}>
              <Row className="mb-3">
                <Col sm={4} className="d-flex align-items-center">
                  <Label className="mb-0 fw-bold">Delivery Name</Label>
                </Col>
                <Col sm={8}>
                  <Input
                    type="text"
                    className="form-control-sm"
                    onChange={handleNewShippingInputs}
                    value={newShippingDetail.delivery_name}
                    name="delivery_name"
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4} className="d-flex align-items-center">
                  <Label className="mb-0 fw-bold">Delivery Address1</Label>
                </Col>
                <Col sm={8}>
                  <Input
                    type="text"
                    className="form-control-sm"
                    onChange={handleNewShippingInputs}
                    value={newShippingDetail.delivery_address1}
                    name="delivery_address1"
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4} className="d-flex align-items-center">
                  <Label className="mb-0 fw-bold">Delivery Address2</Label>
                </Col>
                <Col sm={8}>
                  <Input
                    type="text"
                    className="form-control-sm"
                    onChange={handleNewShippingInputs}
                    value={newShippingDetail.delivery_address2}
                    name="delivery_address2"
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4} className="d-flex align-items-center">
                  <Label className="mb-0 fw-bold">Delivery Address3</Label>
                </Col>
                <Col sm={8}>
                  <Input
                    type="text"
                    className="form-control-sm"
                    onChange={handleNewShippingInputs}
                    value={newShippingDetail.delivery_address3}
                    name="delivery_address3"
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4} className="d-flex align-items-center">
                  <Label className="mb-0 fw-bold">Phone No</Label>
                </Col>
                <Col sm={8}>
                  <Input
                    type="text"
                    className="form-control-sm"
                    onChange={handleNewShippingInputs}
                    value={newShippingDetail.phone_no}
                    name="phone_no"
                  />
                </Col>
              </Row>
            </Col>

            <Col sm={6}>
              <Row className="mb-3">
                <Col sm={4} className="d-flex align-items-center">
                  <Label className="mb-0 fw-bold">Fax No</Label>
                </Col>
                <Col sm={8}>
                  <Input
                    type="text"
                    className="form-control-sm"
                    onChange={handleNewShippingInputs}
                    value={newShippingDetail.fax_no}
                    name="fax_no"
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4} className="d-flex align-items-center">
                  <Label className="mb-0 fw-bold">Email</Label>
                </Col>
                <Col sm={8}>
                  <Input
                    type="text"
                    className="form-control-sm"
                    onChange={handleNewShippingInputs}
                    value={newShippingDetail.email}
                    name="email"
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4} className="d-flex align-items-center">
                  <Label className="mb-0 fw-bold">HandPhone No</Label>
                </Col>
                <Col sm={8}>
                  <Input
                    type="text"
                    className="form-control-sm"
                    onChange={handleNewShippingInputs}
                    value={newShippingDetail.handphone_no}
                    name="handphone_no"
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4} className="d-flex align-items-center">
                  <Label className="mb-0 fw-bold">Country/Postal</Label>
                </Col>
                <Col sm={8}>
                  <Input
                    type="text"
                    className="form-control-sm"
                    onChange={handleNewShippingInputs}
                    value={newShippingDetail.country_postal}
                    name="country_postal"
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4} className="d-flex align-items-center">
                  <Label className="mb-0 fw-bold">Attention</Label>
                </Col>
                <Col sm={8}>
                  <Input
                    type="text"
                    className="form-control-sm"
                    onChange={handleNewShippingInputs}
                    value={newShippingDetail.attention}
                    name="attention"
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={8} className="offset-sm-4">
                  <div className="form-check">
                    <Input
                      type="checkbox"
                      className="form-check-input"
                      id="defaultLoadOnInvoice"
                      onChange={handleNewShippingInputs}
                      name="default_load_on_invoice"
                      checked={newShippingDetail.default_load_on_invoice === 1}
                    />
                    <Label className="form-check-label fw-bold" check for="defaultLoadOnInvoice">
                      Default Load On Invoice
                    </Label>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>

          <div className="d-flex justify-content-end mt-3">
            <Button color="primary" size="sm" onClick={addShippingDetail}>
              Add Shipping
            </Button>
          </div>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Existing Shipping Details</h5>
        </div>
        <div className="card-body">
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
        <div className="text-center p-3">No shipping details added yet.</div>
      )}
        </div>
      </div>
    </div>
  );
}

SupplierShippingDetail.propTypes = {
  contactId: PropTypes.string.isRequired,
};
