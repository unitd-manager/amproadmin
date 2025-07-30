// pages/PriceGroup/PriceGroupAdd.js

import React, { useState } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../constants/api';
import message from '../../components/Message';

const PriceGroupAdd = () => {
  const [groupData, setGroupData] = useState({ price_group_name: '', is_active: 1 });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGroupData({
      ...groupData,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value,
    });
  };

  const handleSubmit = () => {
    if (!groupData.price_group_name) {
      message('Group name is required', 'warning');
      return;
    }

    api
      .post('/pricegroup/insertPriceGroup', groupData)
      .then(() => {
        message('Group added successfully', 'success');
        navigate('/PriceGroup');
      })
      .catch(() => message('Add failed', 'error'));
  };

  return (
    <Form>
      <h3>Add/Edit Price Group</h3>
      <FormGroup>
        <Label>Group Name *</Label>
        <Input name="price_group_name" onChange={handleChange} value={groupData.price_group_name} />
      </FormGroup>
      <FormGroup check>
        <Label check>
          <Input type="checkbox" name="is_active" checked={!!groupData.is_active} onChange={handleChange} /> Is Active
        </Label>
      </FormGroup>
      <div className="mt-3">
        <Button color="primary" onClick={handleSubmit}>Save</Button>{' '}
        <Button color="danger" onClick={() => navigate('/PriceGroup')}>Cancel</Button>
      </div>
    </Form>
  );
};

export default PriceGroupAdd;
