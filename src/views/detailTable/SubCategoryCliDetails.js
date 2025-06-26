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
import { useNavigate } from 'react-router-dom';
import api from '../../constants/api';

const AddSubCategory = () => {
  const [form, setForm] = useState({
    sub_category_name: '',
    category_cli_id: '',
    sort_order: '',
    product_prefix: '',
    sub_category_image: null,
    show_on_ecommerce: 1,
    show_on_eprocurement: 1,
    show_on_pos: 1,
    read_weight_from_scale: 0,
    is_active: 1,
  });

  const [departments, setDepartments] = useState([]);
const navigate=useNavigate();
const onCancel=()=>{
navigate('/SubCategories')
}
const onSave=(id)=>{
navigate(`/SubCategoriesEdit/${id}`)
}
 
  

  const fetchDepartments = async () => {
    const res = await api.get('/categorycli/getallcategories');
    setDepartments(res.data);
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setForm({ ...form, [name]: checked ? 1 : 0  });
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
    
     const response =await api.post('/subcategorycli/insert_sub_category_cli', formData);
    const {insertId} = response.data; 
      if (form?.sub_category_image) {
        const data = new FormData() 
                

               
                    data.append(`files`, form.sub_category_image);
                 
                data.append('file', form.sub_category_image)
                data.append('record_id', insertId)
                data.append('room_name', 'subcategorycli')
                data.append('alt_tag_data', 'subcategorycli')
                data.append('description', 'subcategorycli')

                api.post('/file/uploadFiles',data).then(()=>{
     
                }).catch(()=>{
                   
                })
    }
    onSave(insertId);
  };
useEffect(() => {
    fetchDepartments();
  }, []);
  return (
    <Form onSubmit={handleSubmit} style={{ maxWidth: 700, margin: 'auto' }}>
      <h4 className="mb-4">Add Category</h4>
      <FormGroup row>
        <Label for="sub_category_name" sm={4}>
          SubCategory Name *
        </Label>
        <Col sm={8}>
          <Input type="text" name="sub_category_name" value={form.sub_category_name} onChange={handleChange} required />
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label for="category_cli_id" sm={4}>
          Category Name
        </Label>
        <Col sm={8}>
          <Input type="select" name="category_cli_id" value={form.category_cli_id} onChange={handleChange}>
            <option value="">Select an option</option>
            {departments.map((dept) => (
              <option key={dept.category_cli_id} value={dept.category_cli_id}>
                {dept.category_name}
              </option>
            ))}
          </Input>
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label for="sort_order" sm={4}>
          Sort Order
        </Label>
        <Col sm={8}>
          <Input type="number" name="sort_order" value={form.sort_order} onChange={handleChange} />
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label for="product_prefix" sm={4}>
          Product Prefix
        </Label>
        <Col sm={8}>
          <Input type="text" name="product_prefix" value={form.product_prefix} onChange={handleChange} />
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label for="sub_category_image" sm={4}>
          SubCategory Image (80x80)
        </Label>
        <Col sm={8}>
          <Input type="file" name="sub_category_image" accept="image/*" onChange={handleChange} />
          <FormText color="muted">Upload image (80x80)</FormText>
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
          <Button color="primary" type="submit">Save</Button>{' '}
          <Button color="danger" type="button" onClick={onCancel}>Cancel</Button>
        </Col>
      </Row>
    </Form>
  );
};

export default AddSubCategory;
