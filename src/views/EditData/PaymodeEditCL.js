import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  Label,
  Button,
  FormGroup,
  Row,
  Col
} from 'reactstrap';
import { ToastContainer } from 'react-toastify';
import api from '../../constants/api';
import message from '../../components/Message';
import creationdatetime from '../../constants/creationdatetime';
import AppContext from '../../context/AppContext';

const PaymodeEdit = () => {
  const { id } = useParams();
  const [paymode, setPaymode] = useState({});
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const { loggedInuser } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/paymode/get/${id}`).then((res) => {
      const paymodeData = res.data[0];
      api.get('/paymode/getLocationFromValuelist').then((locRes) => {
        const locData = locRes.data.data;
        setLocations(locData);
        const savedNames = (paymodeData.location || '').split(',').map((s) => s.trim());
        const matchedIds = locData
          .filter((loc) => savedNames.includes(loc.value))
          .map((loc) => loc.valuelist_id);

        setPaymode({ ...paymodeData, location_ids: matchedIds });
      });
    });

    api.get('/paymode/getPaymentTypeFromValuelist').then((res) => {
      setPaymentTypes(res.data.data);
    });
  }, [id]);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setPaymode({ ...paymode, [name]: newValue });
  };

  const handleLocationChange = (locationId) => {
    let updatedIds = paymode.location_ids || [];
    if (updatedIds.includes(locationId)) {
      updatedIds = updatedIds.filter((filteredid) => filteredid !== locationId);
    } else {
      updatedIds.push(locationId);
    }

    const selectedNames = locations
      .filter((loc) => updatedIds.includes(loc.valuelist_id))
      .map((loc) => loc.value)
      .join(', ');

    setPaymode({
      ...paymode,
      location_ids: updatedIds,
      location: selectedNames,
    });
  };

  const handleUnselectAll = () => {
    setPaymode({ ...paymode, location_ids: [] });
  };

  const saveData = () => {
    if (paymode.paymode_name && paymode.paymode_name.trim() !== '' &&
      paymode.payment_type && paymode.payment_type.trim() !== '') {
      paymode.modification_date = creationdatetime;
      paymode.modified_by = loggedInuser.first_name;
      api.post('/paymode/update', paymode)
        .then(() => {
          message('Record edited successfully', 'success');
        })
        .catch(() => {
          message('Unable to edit record.', 'error');
        });
    } else {
      message('Please fill all required fields', 'warning');
    }
  };

  const renderInput = (label, name, type = 'text', extra = null) => (
    <FormGroup>
      <Row>
        <Col md={4}><Label>{label}</Label></Col>
        <Col md={4}><Input type={type} name={name} value={paymode[name] || ''} onChange={handleChange} {...extra} /></Col>
      </Row>
    </FormGroup>
  );

  const renderCheckbox = (label, name) => (
    <FormGroup check>
      <Row>
        <Col md={{ size: 9, offset: 4 }}>
          <Label check>
            <Input type="checkbox" name={name} checked={paymode[name] || false} onChange={handleChange} />
            {` ${label}`}
          </Label>
        </Col>
      </Row>
    </FormGroup>
  );

  return (
    <div className="container">
      <ToastContainer />
      <h4>Edit Paymode</h4>
      <Form>

        {renderInput('Paymode Name*', 'paymode_name')}
        {renderInput('Sort Order', 'sort_order')}
        {renderInput('Remarks', 'remarks')}

        <FormGroup>
          <Row>
            <Col md={4}><Label>Payment Type*</Label></Col>
            <Col md={4}>
              <Input type="select" name="payment_type" value={paymode.payment_type || ''} onChange={handleChange}>
                <option value="">-- Select Payment Type --</option>
                {paymentTypes.map((pt) => (
                  <option key={pt.value} value={pt.value}>
                    {pt.value}
                  </option>
                ))}
              </Input>
            </Col>
          </Row>
        </FormGroup>

        {paymode.payment_type === 'PAYPAL' && renderInput('PayPal Email', 'paypal_email')}
        {paymode.payment_type === 'BRAINTREE' && (
          <>
            {renderInput('Merchant ID', 'merchant_id')}
            {renderInput('Public Key', 'public_key')}
            {renderInput('Private Key', 'private_key')}
          </>
        )}
        {paymode.payment_type === 'PAYNOW' && (
          <>
            {renderInput('Need Reference Image', 'need_reference_image')}
            {renderInput('Payment Reference Number', 'payment_reference_no')}
          </>
        )}
        {paymode.payment_type === 'STRIPE' && (
          <>
            {renderInput('Public Key', 'public_key')}
            {renderInput('Private Key', 'private_key')}
          </>
        )}

        {renderCheckbox('Show On Back Office', 'show_back_office')}
        {renderCheckbox('Show On POS', 'show_pos')}
        {renderCheckbox('Show On eCommerce', 'show_ecommerce')}
        {renderCheckbox('Open Cash Drawer On POS', 'open_cash_drawer')}
        {renderCheckbox('Need Reference No', 'need_reference_no')}
        {renderCheckbox('Is Active', 'is_active')}

        <FormGroup>
          <Row>
            <Col md={4}><Label>Location</Label></Col>
            <Col md={4}>
              <div style={{ border: '1px solid #ccc', padding: '10px', maxHeight: '150px', overflowY: 'auto' }}>
                <div>
                  <Input type="checkbox" onChange={handleUnselectAll} /> Unselect All
                </div>
                {locations.map((loc) => (
                  <div key={loc.valuelist_id}>
                    <Input
                      type="checkbox"
                      checked={paymode.location_ids?.includes(loc.valuelist_id)}
                      onChange={() => handleLocationChange(loc.valuelist_id)}
                    />{' '}
                    {loc.value}
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </FormGroup>

        <Row>
          <Col md={{ size: 9, offset: 3 }}>
            <Button color="primary" onClick={saveData}>Save</Button>{' '}
            <Button color="danger" onClick={() => navigate('/PaymodeCL')}>Cancel</Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default PaymodeEdit;
