import React, { useEffect, useState, useContext } from 'react';
import { Form, Input, Label, Button, FormGroup, Col } from 'reactstrap'; // Added Row, Col
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import message from '../../components/Message';
import api from '../../constants/api';
import creationdatetime from '../../constants/creationdatetime';
import AppContext from '../../context/AppContext';

const PaymodeInsert = () => {
  const [paymode, setPaymode] = useState({
    show_on_back_office: true,
    show_on_pos: false,
    show_on_ecommerce: false,
    open_cash_drawer_on_pos: false,
    need_reference_image: false,
    need_reference_no: false,
    is_active: true,
    location_ids: [], // Initialize as an empty array for multi-select
  });
  const handleLocationChange = (locationId) => {
  let updatedLocations = paymode.location_ids || [];
  if (updatedLocations.includes(locationId)) {
    updatedLocations = updatedLocations.filter((filterid) => filterid !== locationId);
  } else {
    updatedLocations.push(locationId);
  }
  setPaymode({ ...paymode, location_ids: updatedLocations });
};

  const [paymentTypes, setPaymentTypes] = useState([]);
  const [locations, setLocations] = useState([]); // State for locations
  const navigate = useNavigate();
  const { loggedInuser } = useContext(AppContext);

  useEffect(() => {
    // Fetch payment types
    api.get('/paymode/getPaymentTypeFromValuelist').then((res) => {
      // Assuming res.data is an array of objects like [{value: 'STRIPE'}, {value: 'PAYPAL'}]
      setPaymentTypes(res.data.data);
    });

    // Fetch locations (assuming an API endpoint for locations exists)
    api.get('/paymode/getLocationFromValuelist').then((res) => {
      setLocations(res.data.data);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPaymode((prevPaymode) => ({
      ...prevPaymode,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle multi-select for locations
//   const handleLocationChange = (e) => {
//   const selectedOptions = Array.from(e.target.selectedOptions).map(
//     (option) => option.value
//   );
//   setPaymode((prevPaymode) => ({
//     ...prevPaymode,
//     location: selectedOptions, // Store as an array of selected locations
//   }));
// };

 const saveData = () => {
  if (
    paymode.paymode_name?.trim() &&
    paymode.payment_type?.trim()
  ) {
    const dataToInsert = {
      ...paymode,
      created_by: loggedInuser.first_name,
      creation_date: creationdatetime,
      location: (paymode.location_ids || [])
  .map((id) => {
    const match = locations.find((loc) => loc.valuelist_id === id);
    return match?.value;
  })
  .filter(Boolean)
  .join(','),
    };
    

    delete dataToInsert.location_ids; // 👈 Optional: clean unused field

    api.post('/paymode/insertPaymode', dataToInsert)
      .then((res) => {
        const insertedId = res.data.data.insertId;
        message('Paymode inserted successfully.', 'success');
        setTimeout(() => {
          navigate(`/PaymodeEditCL/${insertedId}?tab=1`);
        }, 300);
      })
      .catch((err) => {
        console.error('Insert error:', err);
        message('Unable to insert paymode.', 'error');
      });
  } else {
    message('Please fill all required fields.', 'warning');
  }
};


  return (
    
    <div className="container">
            <ToastContainer></ToastContainer>
      <h4>Add New Paymode</h4>
      <Form>
        {/* Paymode Name */}
        <FormGroup row>
          <Label sm={4} for="paymode_name">
            Paymode Name<span className='required'> *</span>
          </Label>
          <Col sm={4}>
            <Input
              name="paymode_name"
              id="paymode_name"
              value={paymode.paymode_name || ''}
              onChange={handleChange}
              placeholder="Enter Paymode Name"
            />
          </Col>
        </FormGroup>

        {/* Sort Order */}
        <FormGroup row>
          <Label sm={4} for="sort_order">
            Sort Order
          </Label>
          <Col sm={4}>
            <Input
              name="sort_order"
              id="sort_order"
              value={paymode.sort_order || ''}
              onChange={handleChange}
              placeholder="Enter Sort Order"
            />
          </Col>
        </FormGroup>

        {/* Remarks */}
        <FormGroup row>
          <Label sm={4} for="remarks">
            Remarks
          </Label>
          <Col sm={4}>
            <Input
              name="remarks"
              id="remarks"
              value={paymode.remarks || ''}
              onChange={handleChange}
              placeholder="Enter Remarks"
            />
          </Col>
        </FormGroup>

        {/* Payment Type */}
        <FormGroup row>
          <Label sm={4} for="payment_type">
            Payment Type<span className='required'> *</span>
          </Label>
          <Col sm={4}>
            <Input
              type="select"
              name="payment_type"
              id="payment_type"
              value={paymode.payment_type || ''}
              onChange={handleChange}
            >
              <option value="">-- Select Payment Type --</option>
              {paymentTypes.map((pt) => (
                <option key={pt.value} value={pt.value}>
                  {pt.value}
                </option>
              ))}
            </Input>
          </Col>
        </FormGroup>

        {/* Conditional extra fields based on payment type */}
        {paymode.payment_type === 'STRIPE' && (
          <>
            <FormGroup row>
              <Label sm={4} for="public_key">
                Public Key
              </Label>
              <Col sm={4}>
                <Input
                  name="public_key"
                  id="public_key"
                  value={paymode.public_key || ''}
                  onChange={handleChange}
                  placeholder="Enter Public Key"
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label sm={4} for="private_key">
                Private Key
              </Label>
              <Col sm={4}>
                <Input
                  name="private_key"
                  id="private_key"
                  value={paymode.private_key || ''}
                  onChange={handleChange}
                  placeholder="Enter Private Key"
                />
              </Col>
            </FormGroup>
          </>
        )}

        {paymode.payment_type === 'PAYPAL' && (
          <FormGroup row>
            <Label sm={4} for="paypal_email">
              PayPal Email
            </Label>
            <Col sm={4}>
              <Input
                name="paypal_email"
                id="paypal_email"
                value={paymode.paypal_email || ''}
                onChange={handleChange}
                placeholder="Enter PayPal Email"
              />
            </Col>
          </FormGroup>
        )}

        {paymode.payment_type === 'BRAINTREE' && (
          <>
            <FormGroup row>
              <Label sm={4} for="merchant_id">
                Merchant ID
              </Label>
              <Col sm={4}>
                <Input
                  name="merchant_id"
                  id="merchant_id"
                  value={paymode.merchant_id || ''}
                  onChange={handleChange}
                  placeholder="Enter Merchant ID"
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label sm={4} for="public_key">
                Public Key
              </Label>
              <Col sm={4}>
                <Input
                  name="public_key"
                  id="public_key"
                  value={paymode.public_key || ''}
                  onChange={handleChange}
                  placeholder="Enter Public Key"
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label sm={4} for="private_key">
                Private Key
              </Label>
              <Col sm={4}>
                <Input
                  name="private_key"
                  id="private_key"
                  value={paymode.private_key || ''}
                  onChange={handleChange}
                  placeholder="Enter Private Key"
                />
              </Col>
            </FormGroup>
          </>
        )}
        {paymode.payment_type === 'PAYNOW' && (
          <>
            <FormGroup row>
              <Label sm={4} for="need_reference_image">
                Need Reference Image
              </Label>
              <Col sm={4}>
                <Input
                  name="need_reference_image"
                  id="need_reference_image"
                  value={paymode.need_reference_image || ''}
                  onChange={handleChange}
                  placeholder="Enter Need Reference Image"
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label sm={4} for="payment_reference_no">
                 Payment Reference Number
              </Label>
              <Col sm={4}>
                <Input
                  name="payment_reference_no"
                  id="payment_reference_no"
                  value={paymode.payment_reference_no || ''}
                  onChange={handleChange}
                  placeholder="Enter Payment Reference Number"
                />
              </Col>
            </FormGroup>
          </>
        )}

        {/* Checkbox fields - Note: Checkboxes are a bit different in horizontal forms */}
        <FormGroup row className="mb-2">
          <Col sm={{ size: 8, offset: 4 }}> {/* Offset the column for the checkbox */}
            <Input
              type="checkbox"
              id="show_on_back_office"
              name="show_on_back_office"
              checked={paymode.show_on_back_office}
              onChange={handleChange}
            />{' '}
            <Label check for="show_on_back_office">
              Show On Back Office
            </Label>
          </Col>
        </FormGroup>

        <FormGroup row className="mb-2">
          <Col sm={{ size: 8, offset: 4 }}>
            <Input
              type="checkbox"
              id="show_on_pos"
              name="show_on_pos"
              checked={paymode.show_on_pos}
              onChange={handleChange}
            />{' '}
            <Label check for="show_on_pos">
              Show On POS
            </Label>
          </Col>
        </FormGroup>

        <FormGroup row className="mb-2">
          <Col sm={{ size: 8, offset: 4 }}>
            <Input
              type="checkbox"
              id="show_on_ecommerce"
              name="show_on_ecommerce"
              checked={paymode.show_on_ecommerce}
              onChange={handleChange}
            />{' '}
            <Label check for="show_on_ecommerce">
              Show On eCommerce
            </Label>
          </Col>
        </FormGroup>

        <FormGroup row className="mb-2">
          <Col sm={{ size: 8, offset: 4 }}>
            <Input
              type="checkbox"
              id="open_cash_drawer_on_pos"
              name="open_cash_drawer_on_pos"
              checked={paymode.open_cash_drawer_on_pos}
              onChange={handleChange}
            />{' '}
            <Label check for="open_cash_drawer_on_pos">
              Open Cash Drawer On POS
            </Label>
          </Col>
        </FormGroup>

        <FormGroup row className="mb-2">
          <Col sm={{ size: 8, offset: 4 }}>
            <Input
              type="checkbox"
              id="need_reference_no"
              name="need_reference_no"
              checked={paymode.need_reference_no}
              onChange={handleChange}
            />{' '}
            <Label check for="need_reference_no">
              Need Reference No
            </Label>
          </Col>
        </FormGroup>

        <FormGroup row className="mb-4">
          <Col sm={{ size: 8, offset: 4 }}>
            <Input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={paymode.is_active}
              onChange={handleChange}
            />{' '}
            <Label check for="is_active">
              IsActive
            </Label>
          </Col>
        </FormGroup>

        {/* Location Dropdown */}
       {/* <FormGroup row>
          <Label sm={4} for="location">
            Location
          </Label>
          <Col sm={8}>
            <Input
              type="select"
              name="location"
              id="location"
              value={paymode.location || ''}
              onChange={handleLocationChange}
            >
              <option value="">-- Select Payment Type --</option>
              {locations.map((pt) => (
                <option key={pt.value} value={pt.value}>
                  {pt.value}
                </option>
              ))}
            </Input>
          </Col>
        </FormGroup> */}

        {/* Location Multi-select */}
<FormGroup row>
  <Label sm={4}>Location</Label>
  <Col sm={4}>
    <div style={{ border: '1px solid #ccc', padding: '10px', maxHeight: '150px', overflowY: 'auto' }}>
      <div>
  <Input
    type="checkbox"
    checked={paymode.location_ids?.length === 0}
    onChange={() => setPaymode({ ...paymode, location_ids: [] })}
  />{' '}
  Unselect All
</div>

      {locations.map((loc) => (
  <div key={loc.valuelist_id}>
    <Input
      type="checkbox"
      checked={paymode.location_ids?.includes(loc.valuelist_id) || false}
      onChange={() => handleLocationChange(loc.valuelist_id)} // ✅ Use the clean function
    />
    {loc.value}
  </div>
))}

    </div>
  </Col>
</FormGroup>


        {/* Save Button - You can place it within a Col if you want it aligned */}
        <FormGroup row className="mt-4">
          <Col sm={{ size: 8, offset: 4 }}> {/* Align with input fields */}
            <Button color="primary" onClick={saveData}>
              Save & Continue
            </Button>
          </Col>
        </FormGroup>
      </Form>
    </div>
  );
};

export default PaymodeInsert;