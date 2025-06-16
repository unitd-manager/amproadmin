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

const EditCategory = () => {
  const { id } = useParams(); // category_cli_id
  const navigate = useNavigate();

  const [form, setForm] = useState({
    category_name: '',
    department_cli_id: '',
    sort_order: '',
    product_prefix: '',
    category_image: null,
    show_on_ecommerce: true,
    show_on_eprocurement: true,
    show_on_pos: true,
    read_weight_from_scale: false,
    is_active: true,
  });

  const [departments, setDepartments] = useState([]);

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
    formData.append('category_cli_id', id); // for backend update reference

    try {
      await api.post('/categorycli/update_category_cli', formData);
      alert('Category updated successfully');
      navigate('/Categories');
    } catch (err) {
      console.error('Update failed:', err);
      alert('Update failed. Please try again.');
    }
  };

  const fetchDepartments = async () => {
    const res = await api.get('/departmentcli/getalldepartments');
    setDepartments(res.data);
  };

  const fetchCategoryDetails = async () => {
    try {
      const res = await api.post('/categorycli/get_category_cli', { category_cli_id: id });
      if (res.data && res.data.length > 0) {
        setForm(res.data[0]);
      }
    } catch (error) {
      console.error('Error fetching category:', error);
    }
  };

  const onCancel = () => {
    navigate('/Categories');
  };

  useEffect(() => {
    fetchDepartments();
    fetchCategoryDetails();
  }, [id]);

  return (
    <Form onSubmit={handleSubmit} style={{ maxWidth: 700, margin: 'auto' }}>
      <h4 className="mb-4">Edit Category</h4>

      <FormGroup row>
        <Label for="category_name" sm={4}>Category Name *</Label>
        <Col sm={8}>
          <Input type="text" name="category_name" value={form.category_name} onChange={handleChange} required />
        </Col>
      </FormGroup>

      <FormGroup row>
        <Label for="department_cli_id" sm={4}>Department Name</Label>
        <Col sm={8}>
          <Input type="select" name="department_cli_id" value={form.department_cli_id} onChange={handleChange}>
            <option value="">Select an option</option>
            {departments.map((dept) => (
              <option key={dept.department_cli_id} value={dept.department_cli_id}>
                {dept.department_name}
              </option>
            ))}
          </Input>
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
          ].map((item) => (
            <FormGroup check key={item.name}>
              <Label check>
                <Input
                  type="checkbox"
                  name={item.name}
                  checked={form[item.name]}
                  onChange={handleChange}
                />{' '}
                {item.label}
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

export default EditCategory;
