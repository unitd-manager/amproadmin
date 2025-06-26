import React, { useState, useEffect } from 'react';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Col,
  Row,
  FormText,
} from 'reactstrap';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../constants/api';

const EditDepartment = () => {
  const { id } = useParams(); // department_cli_id
  const navigate = useNavigate();

  const [form, setForm] = useState({
    department_name: '',
    sort_order: '',
    product_prefix: '',
    department_image: null,
    show_on_ecommerce: 1,
    show_on_eprocurement: 1,
    show_on_pos: 1,
    read_weight_from_scale: 0,
    is_active: 1,
  });

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
    formData.append('department_cli_id', id); // send ID for update

    try {
      await api.post(`/departmentcli/update_department_cli/${id}`, formData);
      alert('Department updated successfully');
      navigate('/Department');
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update department');
    }
  };

  const fetchDepartmentDetails = async () => {
    try {
      const res = await api.get(`/departmentcli/get_department_cli/${id}`, { department_cli_id: id });
      if (res.data) {
        console.log('data',res.data)
        setForm(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching department:', err);
    }
  };

  const onCancel = () => {
    navigate('/Department');
  };

  useEffect(() => {
    if (id) {
      fetchDepartmentDetails();
    }
  }, [id]);

  return (
    <Form onSubmit={handleSubmit} style={{ maxWidth: 700, margin: 'auto' }}>
      <h4 className="mb-4">Edit Department</h4>
      <FormGroup row>
        <Label for="department_name" sm={4}>Department Name *</Label>
        <Col sm={8}>
          <Input
            type="text"
            name="department_name"
            value={form.department_name}
            onChange={handleChange}
            required
          />
        </Col>
      </FormGroup>

      <FormGroup row>
        <Label for="sort_order" sm={4}>Sort Order</Label>
        <Col sm={8}>
          <Input type="number" name="sort_order" value={form.sort_order} onChange={handleChange} />
        </Col>
      </FormGroup>

      <FormGroup row>
        <Label for="product_prefix" sm={4}>Product Prefix</Label>
        <Col sm={8}>
          <Input type="text" name="product_prefix" value={form.product_prefix} onChange={handleChange} />
        </Col>
      </FormGroup>

      <FormGroup row>
        <Label for="department_image" sm={4}>Department Image (80x80)</Label>
        <Col sm={8}>
          <Input type="file" name="department_image" accept="image/*" onChange={handleChange} />
          <FormText color="muted">Upload image (80x80)</FormText>
            {form.department_image&& (
            <img
              src={`http://ampro.zaitunsoftsolutions.com/storage/uploads/${form.department_image}`}
              alt="Category"
              style={{ height: 80, width: 80, marginTop: 10, border: '1px solid #ccc' }}
            />
          )}
        </Col>
      </FormGroup>
 <Row className="mb-3">
        <Col sm={{ size: 8, offset: 4 }}>
          <FormGroup check>
            <Label check>
              <Input type="checkbox" name="show_on_ecommerce" checked={form.show_on_ecommerce === 1} onChange={handleChange} /> Show On ECommerce
            </Label>
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input type="checkbox" name="show_on_eprocurement" checked={form.show_on_eprocurement === 1} onChange={handleChange} /> Show On EProcurement
            </Label>
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input type="checkbox" name="show_on_pos" checked={form.show_on_pos === 1} onChange={handleChange} /> Show On POS
            </Label>
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input type="checkbox" name="read_weight_from_scale" checked={form.read_weight_from_scale === 1} onChange={handleChange} /> Read Weight From Scale
            </Label>
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input type="checkbox" name="is_active" checked={form.is_active === 1} onChange={handleChange} /> IsActive
            </Label>
          </FormGroup>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col sm={{ size: 8, offset: 4 }}>
          <Button color="primary" type="submit">Update</Button>{' '}
          <Button color="danger" type="button" onClick={onCancel}>Cancel</Button>
        </Col>
      </Row>
    </Form>
  );
};

export default EditDepartment;
