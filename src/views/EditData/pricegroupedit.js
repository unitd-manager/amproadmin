// pages/PriceGroup/PriceGroupEdit.js

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, FormGroup, Label, Input, Button, Spinner } from 'reactstrap';
import api from '../../constants/api';
import message from '../../components/Message';

const PriceGroupEdit = () => {
  const { id } = useParams();
  const [groupData, setGroupData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchGroup = () => {
    setLoading(true);
    api
      .post('/pricegroup/getPriceGroupById', { price_group_id: id })
      .then((res) => {
        const group = res.data?.data?.[0];
        if (group) {
          // Ensure price_group_id is present
          setGroupData({ ...group, price_group_id: id });
        } else {
          message('Group not found', 'error');
        }
      })
      .catch(() => {
        message('Unable to fetch group', 'error');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchGroup();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGroupData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value,
    }));
  };

  const handleSubmit = () => {
    if (!groupData.price_group_name) {
      message('Group name is required', 'warning');
      return;
    }

    // Ensure price_group_id is part of payload
    const payload = {
      ...groupData,
      price_group_id: id,
    };

    api
      .post('/pricegroup/update', payload)
      .then(() => {
        message('Updated successfully', 'success');
        navigate('/PriceGroup');
      })
      .catch(() => message('Update failed', 'error'));
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner color="primary" />
        <div>Loading group data...</div>
      </div>
    );
  }

  return (
    <Form>
      <h3>Edit Price Group</h3>
      <FormGroup>
        <Label>Group Name *</Label>
        <Input
          name="price_group_name"
          onChange={handleChange}
          value={groupData?.price_group_name || ''}
        />
      </FormGroup>
      <FormGroup check>
        <Label check>
          <Input
            type="checkbox"
            name="is_active"
            checked={!!groupData?.is_active}
            onChange={handleChange}
          />{' '}
          Is Active
        </Label>
      </FormGroup>
      <div className="mt-3">
        <Button color="primary" onClick={handleSubmit}>
          Save
        </Button>{' '}
        <Button color="danger" onClick={() => navigate('/PriceGroup')}>
          Cancel
        </Button>
      </div>
    </Form>
  );
};

export default PriceGroupEdit;
