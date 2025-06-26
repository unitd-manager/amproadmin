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

const EditBrand = () => {
  const { id } = useParams(); // brand_cli_id
  const navigate = useNavigate();

  const [form, setForm] = useState({
    brand_name: '',
    sort_order: '',
    product_prefix: '',
    brand_image: null,
    show_on_ecommerce: true,
    show_on_eprocurement: true,
    show_on_pos: true,
    read_weight_from_scale: false,
    is_active: true,
  });

  const [existingImage, setExistingImage] = useState(null); // for preview

  const onCancel = () => {
    navigate('/Brand');
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

  const fetchBrandDetails = async () => {
    try {
      const res = await api.post('/brandcli/get_brand_cli', { brand_cli_id: id });
      if (res.data ) {
        const brand = res.data.data[0];
        setForm({ ...brand });
        setExistingImage(brand.brand_image); // assumes backend returns image filename
      }
    } catch (err) {
      console.error('Failed to fetch brand details', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append('brand_cli_id', id);

    try {
      await api.post('/brandcli/update_brand_cli', formData);
      alert('Brand updated successfully');
      navigate('/Brand');
    } catch (err) {
      console.error('Update failed:', err);
      alert('Update failed. Please try again.');
    }
  };

  useEffect(() => {
    fetchBrandDetails();
  }, [id]);

  return (
    <Form onSubmit={handleSubmit} style={{ maxWidth: 700, margin: 'auto' }}>
      <h4 className="mb-4">Edit Brand</h4>

      <FormGroup row>
        <Label for="brand_name" sm={4}>Brand Name *</Label>
        <Col sm={8}>
          <Input type="text" name="brand_name" value={form.brand_name} onChange={handleChange} required />
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
        <Label for="brand_image" sm={4}>Brand Image (80x80)</Label>
        <Col sm={8}>
          <Input type="file" name="brand_image" accept="image/*" onChange={handleChange} />
          <FormText color="muted">Upload image (80x80)</FormText>
          {existingImage && (
            <img
              src={`http://ampro.zaitunsoftsolutions.com/storage/uploads/${form.brand_image}`}
              alt="Brand Preview"
              style={{ height: 80, width: 80, marginTop: '10px', border: '1px solid #ccc' }}
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

export default EditBrand;
