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
    category_image: null,
    show_on_ecommerce: true,
    show_on_eprocurement: true,
    show_on_pos: true,
    read_weight_from_scale: false,
    is_active: true,
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
      await api.post('/departmentcli/update_department_cli', formData);
      alert('Department updated successfully');
      navigate('/Department');
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update department');
    }
  };

  const fetchDepartmentDetails = async () => {
    try {
      const res = await api.post('/departmentcli/get_department_cli', { department_cli_id: id });
      if (res.data && res.data.length > 0) {
        setForm(res.data[0]);
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
        <Label for="category_image" sm={4}>Category Image (80x80)</Label>
        <Col sm={8}>
          <Input type="file" name="category_image" accept="image/*" onChange={handleChange} />
          <FormText color="muted">Upload image (80x80)</FormText>
        </Col>
      </FormGroup>

      <Row className="mb-3">
        <Col sm={{ size: 8, offset: 4 }}>
          {[
            { name: 'show_on_ecommerce', label: 'Show On ECommerce' },
            { name: 'show_on_eprocurement', label: 'Show On EProcurement' },
            { name: 'show_on_pos', label: 'Show On POS' },
            { name: 'read_weight_from_scale', label: 'Read Weight From Scale' },
            { name: 'is_active', label: 'IsActive' },
          ].map((checkbox) => (
            <FormGroup check key={checkbox.name}>
              <Label check>
                <Input
                  type="checkbox"
                  name={checkbox.name}
                  checked={form[checkbox.name]}
                  onChange={handleChange}
                />{' '}
                {checkbox.label}
              </Label>
            </FormGroup>
          ))}
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
