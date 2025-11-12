import React, { useContext, useState } from 'react';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Col,
  Row,
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { FileUploader } from 'react-drag-drop-files';
import message from '../../components/Message';
import api from '../../constants/api';
import AppContext from '../../context/AppContext';

const AddBrand = () => {
  const [form, setForm] = useState({
    brand_name: '',
    // department_cli_id: '',
    sort_order: '',
    product_prefix: '',
    brand_image: null,
    show_on_ecommerce: 1,
    show_on_eprocurement: 1,
    show_on_pos: 1,
    read_weight_from_scale: 0,
    is_active: 1,
  });

//   const [departments, setDepartments] = useState([]);
const navigate=useNavigate();
const onCancel=()=>{
navigate('/Brand')
}
const onSave=(id)=>{
navigate(`/BrandEdit/${id}`)
}
 const [file, setFile] = useState([]);
         const [ handleValue, setHandleValue ] = useState();
 
         const handleFileChange = (fiels) => {
           
             const arrayOfObj = Object.entries(fiels).map((e) => ( e[1]  ));
 
             setFile(fiels);
             setHandleValue(arrayOfObj);
             console.log(fiels)
         };
//   const fetchDepartments = async () => {
//     const res = await api.get('/departmentcli/getalldepartments');
//     setDepartments(res.data);
//   };

  const { loggedInuser } = useContext(AppContext);
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
formData.append('created_by', loggedInuser.first_name);
    try{
    const response =await api.post('/brandcli/insert_brand_cli', formData);
    const { insertId } = response.data.data;

    if(file){

          
                const data = new FormData() 
                const arrayOfObj = Object.entries(file).map((el) => (  el[1] ));

                arrayOfObj.forEach((ele) => {
                    data.append(`files`, ele);
                  });
                //data.append('file', file)
                data.append('record_id', insertId)
                data.append('room_name', 'brandcli')
                data.append('alt_tag_data', 'brandcli')
                data.append('description', 'brandcli')

                api.post('/file/uploadFiles',data).then(()=>{
     
                    message('Files Uploaded Successfully','success')
                    
                }).catch(()=>{
                   
                    message('Unable to upload File','error')
                   
                })
            }
    onSave(insertId);

  } catch (err) {
    console.error("Error submitting form: ", err);
    alert("There was an error saving the brand .");
  }
  };

  return (
    <Form onSubmit={handleSubmit} style={{ maxWidth: 700, margin: 'auto' }}>
      <h4 className="mb-4">Add Brand</h4>
      <FormGroup row>
        <Label for="category_name" sm={4}>
          Brand Name *
        </Label>
        <Col sm={8}>
          <Input type="text" name="brand_name" value={form.brand_name} onChange={handleChange} required />
        </Col>
      </FormGroup>
      {/* <FormGroup row>
        <Label for="department_cli_id" sm={4}>
          Department Name
        </Label>
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
      </FormGroup> */}
      <FormGroup row>
        <Label for="sort_order" sm={4}>
          Sort Order
        </Label>
        <Col sm={8}>
          <Input type="number" name="sort_order" value={form.sort_order} onChange={handleChange} />
        </Col>
      </FormGroup>
      {/* <FormGroup row>
        <Label for="product_prefix" sm={4}>
          Product Prefix
        </Label>
        <Col sm={8}>
          <Input type="text" name="product_prefix" value={form.product_prefix} onChange={handleChange} />
        </Col>
      </FormGroup> */}
      <FormGroup row>
        <Label for="brand_image" sm={4}>
          Brand Image (80x80)
        </Label>
        <Col sm={8}>
          {/* <Input type="file" name="brand_image" accept="image/*" onChange={handleChange} />
          <FormText color="muted">Upload image (80x80)</FormText> */}
          <FormGroup>
                  
                <FileUploader
                        multiple
                        handleChange={handleFileChange}
                        name="file"
                       // types={fileTypes}
                    />
                    

                    {handleValue ? (
                        handleValue.map((e) => (
                        <div>
                            <span> Name: {e.name} </span>
                        </div>
                        ))
                    ) : (
                        <span>No file selected</span>
                    )}

                </FormGroup>
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
          {/* <FormGroup check>
            <Label check>
              <Input type="checkbox" name="show_on_pos" checked={form.show_on_pos === 1} onChange={handleChange} /> Show On POS
            </Label>
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input type="checkbox" name="read_weight_from_scale" checked={form.read_weight_from_scale === 1} onChange={handleChange} /> Read Weight From Scale
            </Label>
          </FormGroup> */}
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

export default AddBrand;
