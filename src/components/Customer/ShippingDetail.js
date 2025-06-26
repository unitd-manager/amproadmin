import React, { useState } from 'react';
import {
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Button,
  Table, // Import Table for displaying shipping details
} from 'reactstrap';
// import PropTypes from 'prop-types';

export default function CustomerShippingDetail( ) {
  // State for a new shipping detail being added
  const [newShippingDetail, setNewShippingDetail] = useState({
    delivery_name: '',
    delivery_address1: '',
    delivery_address2: '',
    delivery_address3: '',
    phone_no: '',
    handphone_no: '', // This will hold the value of the handphone
    fax_no: '',
    email: '',
    country_postal: '',
    attention: '',
    default_load_on_invoice: 0, // 0 for false, 1 for true
  });

  // State to manage the list of shipping details for this customer
  const [shippingDetailList, setShippingDetailList] = useState([]);

  // State to manage if HandPhone No input is enabled/visible
  const [isHandPhoneEnabled, setIsHandPhoneEnabled] = useState(false);

  // Synchronize internal state with prop data when contentDetails.shipping_details changes
//   useEffect(() => {
//     if (contentDetails?.shipping_details && Array.isArray(contentDetails.shipping_details)) {
//       setShippingDetailList(contentDetails.shipping_details);
//     } else {
//       setShippingDetailList([]); // Ensure it's an empty array if data isn't available
//     }
//   }, [contentDetails.shipping_details]);

  const handleNewShippingInputs = (e) => {
    const { name, value, type, checked } = e.target;
    setNewShippingDetail({
      ...newShippingDetail,
      [name]: type === 'checkbox' || type === 'switch' ? (checked ? 1 : 0) : value,
    });
  };

  const addShippingDetail = () => {
    if (newShippingDetail.delivery_name && newShippingDetail.delivery_address1) {
      setShippingDetailList([
        ...shippingDetailList,
        { ...newShippingDetail, id: Date.now() + Math.random() }, // Add a unique ID
      ]);
      // Clear the form fields after adding
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
      });
      setIsHandPhoneEnabled(false); // Reset checkbox for HandPhone
      // IMPORTANT: You'll need to pass this updated shippingDetailList to the parent
      // e.g., via a prop like onShippingDetailsChange(updatedList)
    } else {
      alert('Please fill at least Delivery Name and Delivery Address1.');
    }
  };

  const deleteShippingDetail = (id) => {
    setShippingDetailList(shippingDetailList.filter((detail) => detail.id !== id));
    // IMPORTANT: Pass updated list to parent if you want changes to persist on save
  };

  return (
    <div>
      <Row className="mb-4">
        {/* Left Column */}
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
          <FormGroup check className="d-flex align-items-center pt-3">
            <Input
              type="checkbox"
              id="handphone_enable_checkbox"
              onChange={() => setIsHandPhoneEnabled(!isHandPhoneEnabled)}
              checked={isHandPhoneEnabled}
            />{' '}
            <Label check for="handphone_enable_checkbox" className="mb-0 ms-2">
              Default Load OnInvoice
            </Label>
            {isHandPhoneEnabled && (
              <Input
                type="text"
                onChange={handleNewShippingInputs}
                value={newShippingDetail.default_load_on_invoice}
                name="default_load_on_invoice"
                className="ms-3"
                style={{ flex: 1 }} // Take remaining space
              />
            )}
          </FormGroup>
        </Col>

        {/* Right Column */}
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
              value={newShippingDetail.country}
              name="country"
            />
                        <Input
              type="text"
              onChange={handleNewShippingInputs}
              value={newShippingDetail.postal_code}
              name="postal_code"
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
          {/* <FormGroup switch className="pt-3">
            <Label check for="default_load_on_invoice_toggle">
              Default Load On Invoice
            </Label>
            <Input
              type="switch"
              id="default_load_on_invoice_toggle"
              onChange={handleNewShippingInputs}
              checked={newShippingDetail.default_load_on_invoice === 1}
              name="default_load_on_invoice"
              role="switch"
            />
          </FormGroup> */}
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
              <tr key={detail.id}>
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
                <td>{detail.default_load_on_invoice }</td>
                <td>
                  <Button color="danger" size="sm" onClick={() => deleteShippingDetail(detail.id)}>
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

// CustomerShippingDetail.propTypes = {
//   contentDetails: PropTypes.object,
  // handleInputs is not passed to this component directly, as it manages its own list.
  // You'd typically have a separate prop like onShippingDetailsChange to update the parent.
