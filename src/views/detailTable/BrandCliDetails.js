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
import axios from 'axios';

const AddBrand = ({ onCancel, onSave }) => {
  const [form, setForm] = useState({
    name: '',
    departmentId: '',
    sortOrder: '',
    prefix: '',
    image: null,
    showOnEcommerce: true,
    showOnEprocurement: true,
    showOnPOS: true,
    readWeightFromScale: false,
    isActive: true,
  });

  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    const res = await axios.get('/api/departments');
    setDepartments(res.data);
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
    await axios.post('/api/categories', formData);
    onSave();
  };

  return (
    <Form onSubmit={handleSubmit} style={{ maxWidth: 700, margin: 'auto' }}>
      <h4 className="mb-4">Add Category</h4>
      <FormGroup row>
        <Label for="name" sm={4}>
          Category Name *
        </Label>
        <Col sm={8}>
          <Input type="text" name="name" value={form.name} onChange={handleChange} required />
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label for="departmentId" sm={4}>
          Department Name
        </Label>
        <Col sm={8}>
          <Input type="select" name="departmentId" value={form.departmentId} onChange={handleChange}>
            <option value="">Select an option</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </Input>
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label for="sortOrder" sm={4}>
          Sort Order
        </Label>
        <Col sm={8}>
          <Input type="number" name="sortOrder" value={form.sortOrder} onChange={handleChange} />
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label for="prefix" sm={4}>
          Product Prefix
        </Label>
        <Col sm={8}>
          <Input type="text" name="prefix" value={form.prefix} onChange={handleChange} />
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label for="image" sm={4}>
          Category Image (80x80)
        </Label>
        <Col sm={8}>
          <Input type="file" name="image" accept="image/*" onChange={handleChange} />
          <FormText color="muted">Upload image (80x80)</FormText>
        </Col>
      </FormGroup>
      <Row className="mb-3">
        <Col sm={{ size: 8, offset: 4 }}>
          <FormGroup check>
            <Label check>
              <Input type="checkbox" name="showOnEcommerce" checked={form.showOnEcommerce} onChange={handleChange} /> Show On ECommerce
            </Label>
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input type="checkbox" name="showOnEprocurement" checked={form.showOnEprocurement} onChange={handleChange} /> Show On EProcurement
            </Label>
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input type="checkbox" name="showOnPOS" checked={form.showOnPOS} onChange={handleChange} /> Show On POS
            </Label>
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input type="checkbox" name="readWeightFromScale" checked={form.readWeightFromScale} onChange={handleChange} /> Read Weight From Scale
            </Label>
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} /> IsActive
            </Label>
          </FormGroup>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col sm={{ size: 8, offset: 4 }}>
          <Button color="primary" type="submit">Save</Button>{' '}
          <Button color="danger" type="button" onClick={onCancel}>Cancel</Button>
        </Col>
      </Row>
    </Form>
  );
};

export default AddBrand;
