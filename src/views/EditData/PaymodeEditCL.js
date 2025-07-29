import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Form,
  Input,
  Label,
  Button,
  FormGroup,
} from 'reactstrap';
import api from '../../constants/api';

const PaymodeEdit = () => {
  const { id } = useParams();
  const [paymode, setPaymode] = useState({});
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    // Load paymode details
    api.get(`/paymode/get/${id}`).then((res) => {
      setPaymode(res.data[0]);
    });

    // Load payment types
    api.get('/paymode/getPaymentTypeFromValuelist').then((res) => {
      setPaymentTypes(res.data.data);
    });

    // Load location list
    api.get('/paymode/getLocationFromValuelist').then((res) => {
      setLocations(res.data.data);
    });
  }, [id]);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setPaymode({ ...paymode, [name]: newValue });
  };

  const handleLocationChange = (locationId) => {
    let updatedLocations = paymode.location_ids || [];
    if (updatedLocations.includes(locationId)) {
      updatedLocations = updatedLocations.filter((filterid) => filterid !== locationId);
    } else {
      updatedLocations.push(locationId);
    }
    setPaymode({ ...paymode, location_ids: updatedLocations });
  };

  const handleUnselectAll = () => {
    setPaymode({ ...paymode, location_ids: [] });
  };

  const saveData = () => {
    api.post('/paymode/update', paymode).then(() => alert('Saved successfully'));
  };

  return (
    <div className="container">
      <h4>Edit Paymode</h4>
      <Form>
        <FormGroup>
          <Label>Paymode Name</Label>
          <Input name="paymode_name" value={paymode.paymode_name || ''} onChange={handleChange} />
        </FormGroup>

        <FormGroup>
          <Label>Sort Order</Label>
          <Input name="sort_order" value={paymode.sort_order || ''} onChange={handleChange} />
        </FormGroup>

        <FormGroup>
          <Label>Remarks</Label>
          <Input name="remarks" value={paymode.remarks || ''} onChange={handleChange} />
        </FormGroup>

        <FormGroup>
          <Label>Payment Type</Label>
          <Input type="select" name="payment_type" value={paymode.payment_type || ''} onChange={handleChange}>
            <option value="">-- Select Payment Type --</option>
            {paymentTypes.map((pt) => (
              <option key={pt.value} value={pt.value}>
                {pt.value}
              </option>
            ))}
          </Input>
        </FormGroup>

        {/* Additional fields for specific payment types */}
        {paymode.payment_type === 'PAYPAL' && (
          <FormGroup>
            <Label>PayPal Email</Label>
            <Input name="paypal_email" value={paymode.paypal_email || ''} onChange={handleChange} />
          </FormGroup>
        )}
        {paymode.payment_type === 'BRAINTREE' && (
          <>
            <FormGroup>
              <Label>Merchant ID</Label>
              <Input name="merchant_id" value={paymode.merchant_id || ''} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label>Public Key</Label>
              <Input name="public_key" value={paymode.public_key || ''} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label>Private Key</Label>
              <Input name="private_key" value={paymode.private_key || ''} onChange={handleChange} />
            </FormGroup>
          </>
        )}

        {/* Checkboxes */}
        <FormGroup check>
          <Label check>
            <Input type="checkbox" name="show_back_office" checked={paymode.show_back_office || false} onChange={handleChange} />
            Show On Back Office
          </Label>
        </FormGroup>
        <FormGroup check>
          <Label check>
            <Input type="checkbox" name="show_pos" checked={paymode.show_pos || false} onChange={handleChange} />
            Show On POS
          </Label>
        </FormGroup>
        <FormGroup check>
          <Label check>
            <Input type="checkbox" name="show_ecommerce" checked={paymode.show_ecommerce || false} onChange={handleChange} />
            Show On eCommerce
          </Label>
        </FormGroup>
        <FormGroup check>
          <Label check>
            <Input type="checkbox" name="open_cash_drawer" checked={paymode.open_cash_drawer || false} onChange={handleChange} />
            Open Cash Drawer On POS
          </Label>
        </FormGroup>
        <FormGroup check>
          <Label check>
            <Input type="checkbox" name="need_reference_no" checked={paymode.need_reference_no || false} onChange={handleChange} />
            Need Reference No
          </Label>
        </FormGroup>
        <FormGroup check>
          <Label check>
            <Input type="checkbox" name="is_active" checked={paymode.is_active || false} onChange={handleChange} />
            IsActive
          </Label>
        </FormGroup>

        {/* Location Multi-select */}
        <FormGroup>
          <Label>Location</Label>
          <div style={{ border: '1px solid #ccc', padding: '10px', maxHeight: '150px', overflowY: 'auto' }}>
            <div>
              <Input type="checkbox" onChange={handleUnselectAll} />
              {' '}UnSelect All
            </div>
            {locations.map((loc) => (
              <div key={loc.location_id}>
                <Input
                  type="checkbox"
                  checked={paymode.location_ids?.includes(loc.location_id)}
                  onChange={() => handleLocationChange(loc.location_id)}
                />{' '}
                {loc.location_name}
              </div>
            ))}
          </div>
        </FormGroup>

        {/* Buttons */}
        <Button color="primary" onClick={saveData}>Save</Button>{' '}
        <Button color="danger" onClick={() => window.history.back()}>Cancel</Button>
      </Form>
    </div>
  );
};

export default PaymodeEdit;
