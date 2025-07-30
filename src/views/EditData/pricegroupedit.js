// pages/PriceGroup/PriceGroupEdit.js

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import api from '../../constants/api';
import message from '../../components/Message';

const PriceGroupEdit = () => {
  const { id } = useParams();
  const [groupData, setGroupData] = useState({});
  const navigate = useNavigate();

  const fetchGroup = () => {
    api
      .post('/pricegroup/getPriceGroupById', { id })
      .then((res) => setGroupData(res.data.data[0]))
      .catch(() => message('Unable to fetch group', 'error'));
  };

  useEffect(() => {
    fetchGroup();
  }, [id]);

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
      .post('/pricegroup/update', groupData)
      .then(() => {
        message('Updated successfully', 'success');
        navigate('/PriceGroup');
      })
      .catch(() => message('Update failed', 'error'));
  };

  return (
    <Form>
      <h3>Edit Price Group</h3>
      <FormGroup>
        <Label>Group Name *</Label>
        <Input name="price_group_name" onChange={handleChange} value={groupData.price_group_name || ''} />
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

export default PriceGroupEdit;
