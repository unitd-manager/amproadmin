import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Label, Input, Col, Row } from 'reactstrap';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../constants/api';

const EditBin = () => {
  const { id } = useParams(); // Get bin_cli_id from URL
  const navigate = useNavigate();

  const [form, setForm] = useState({
    bin_name: '',
    floor_level: '',
    rack_no: '',
    rack_level: '',
    max_occupancy: '',
    read_weight_from_scale: '',
    sort_order: '',
    is_active: true,
  });

  

  const fetchBinDetails = async () => {
    try {
      const response = await api.post('/bincli/get_bin_cli', { bin_cli_id: id });
      if (response.data && response.data.length > 0) {
        setForm(response.data[0]);
      }
    } catch (err) {
      console.error('Error fetching bin:', err);
      alert('Failed to fetch bin details');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setForm({ ...form, [name]: checked });
    } else if (type === 'file') {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append('bin_cli_id', id); // Required for update

    try {
      await api.post('/bincli/update_bin_cli', formData);
      alert('Bin updated successfully');
      navigate('/bin-list'); // Redirect to bin list
    } catch (err) {
      console.error('Update failed:', err);
      alert('Error updating bin');
    }
  };
useEffect(() => {
    if (id) {
      fetchBinDetails();
    }
  }, [id]);
  return (
    <Form onSubmit={handleSubmit} style={{ maxWidth: 700, margin: 'auto' }}>
      <h4 className="mb-4">Edit Bin</h4>

      <FormGroup row>
        <Label for="bin_name" sm={4}>Bin Name *</Label>
        <Col sm={8}>
          <Input type="text" name="bin_name" value={form.bin_name} onChange={handleChange} required />
        </Col>
      </FormGroup>

      <FormGroup row>
        <Label for="floor_level" sm={4}>Floor Level *</Label>
        <Col sm={8}>
          <Input type="text" name="floor_level" value={form.floor_level} onChange={handleChange} required />
        </Col>
      </FormGroup>

      <FormGroup row>
        <Label for="rack_no" sm={4}>Rack No *</Label>
        <Col sm={8}>
          <Input type="text" name="rack_no" value={form.rack_no} onChange={handleChange} required />
        </Col>
      </FormGroup>

      <FormGroup row>
        <Label for="rack_level" sm={4}>Rack Level *</Label>
        <Col sm={8}>
          <Input type="text" name="rack_level" value={form.rack_level} onChange={handleChange} required />
        </Col>
      </FormGroup>

      <FormGroup row>
        <Label for="max_occupancy" sm={4}>Max Occupancy *</Label>
        <Col sm={8}>
          <Input type="text" name="max_occupancy" value={form.max_occupancy} onChange={handleChange} required />
        </Col>
      </FormGroup>

      <FormGroup row>
        <Label for="sort_order" sm={4}>Sort Order</Label>
        <Col sm={8}>
          <Input type="number" name="sort_order" value={form.sort_order} onChange={handleChange} />
        </Col>
      </FormGroup>

      <Row className="mb-3">
        <Col sm={{ size: 8, offset: 4 }}>
          <FormGroup check>
            <Label check>
              <Input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} /> IsActive
            </Label>
          </FormGroup>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col sm={{ size: 8, offset: 4 }}>
          <Button color="primary" type="submit">Update</Button>
        </Col>
      </Row>
    </Form>
  );
};

export default EditBin;
