// pages/PriceGroup/PriceGroupEdit.js

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, FormGroup, Label, Input, Button, Spinner, Row, Col } from 'reactstrap';
import api from '../../constants/api';
import message from '../../components/Message';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ComponentCard from '../../components/ComponentCard';

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
    <>
      {/* BreadCrumbs */}
      <BreadCrumbs heading="New/Edit Price Group" />
      
      <div className="d-flex justify-content-end mb-3">
        <Button 
          color="primary" 
          onClick={handleSubmit}
          className="me-2"
        >
          Save
        </Button>
        <Button 
          color="secondary" 
          onClick={() => navigate('/PriceGroup')}
        >
          Cancel
        </Button>
      </div>
      
      <ComponentCard title="Price Group Details">
        <Form>
          <Row>
            <Col md="6">
              <FormGroup>
                <Label>Group Name <span className="text-danger">*</span></Label>
                <Input
                  name="price_group_name"
                  onChange={handleChange}
                  value={groupData?.price_group_name || ''}
                  placeholder="Enter group name"
                />
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup check className="mt-4">
                <div className="d-flex align-items-center">
                  <Label check className="me-2">Is Active</Label>
                  <div className="form-check form-switch">
                    <Input
                      type="switch"
                      name="status"
                      checked={!!groupData?.status}
                      onChange={handleChange}
                      className="form-check-input"
                    />
                  </div>
                </div>
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </ComponentCard>
    </>
  );
};

export default PriceGroupEdit;
