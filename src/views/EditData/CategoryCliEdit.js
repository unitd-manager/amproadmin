
import React, { useState, useEffect, useContext } from 'react';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Col,
  Row,
} from 'reactstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as Icon from 'react-feather';
import { FileUploader } from 'react-drag-drop-files';
import message from '../../components/Message';
import api from '../../constants/api';
import AppContext from '../../context/AppContext';

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    category_cli_id: id,
    category_name: '',
    department_cli_id: '',
    sort_order: '',
    product_prefix: '',
    show_on_ecommerce: 1,
    show_on_eprocurement: 1,
    show_on_pos: 1,
    read_weight_from_scale: 0,
    is_active: 1,
  });

  const [departments, setDepartments] = useState([]);
  const [getFile, setGetFile] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);

  const fetchDepartments = async () => {
    const res = await api.get('/departmentcli/getalldepartments');
    setDepartments(res.data.data);
  };
  const [file, setFile] = useState([]);
         const [handleValue, setHandleValue] = useState();

         const handleFileChange = (selectedFiles) => {
           const newFiles = Array.from(selectedFiles);
           setFile(newFiles);
           setHandleValue(newFiles);
   
           const previews = newFiles.map(f => URL.createObjectURL(f));
           setImagePreviews(previews);
         };
  const fetchCategoryDetails = async () => {
    try {
      const res = await api.get(`/categorycli/get_category_cli/${id}`);
      if (res.data && res.data.data) {
        setForm(prev => ({
          ...prev,
          ...res.data.data,
          category_image: null // reset file input
        }));
      }
    } catch (error) {
      console.error('Error fetching category:', error);
    }
  };

      const { loggedInuser } = useContext(AppContext);
  const getFiles = async () => {
    const res = await api.post('/file/getListOfFiles', { record_id: id, room_name: 'categorycli' });
    setGetFile(res.data);
  };

  const deleteFile = (fileId) => {
    Swal.fire({
      title: `Are you sure?`,
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        api.post('/file/deleteFile', { media_id: fileId })
          .then(() => {
            Swal.fire('Deleted!', 'Media has been deleted.', 'success');
            getFiles();
          })
          .catch(() => {
            message('Unable to Delete Media', 'info');
          });
      }
    });
  };

  useEffect(() => {
    fetchDepartments();
    fetchCategoryDetails();
    getFiles();

    return () => {
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [id, imagePreviews]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setForm({ ...form, [name]: checked ? 1 : 0 });
    } else if (type === 'file') {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Update category with JSON data (no FormData needed unless uploading files)
      // const {formDataToSend } = form;
      console.log('formdatatosend',form);
form.updated_by=loggedInuser.first_name;
      await api.post(`/categorycli/update_category_cli`, form);
        if(file){

          
                const data = new FormData() 
                const arrayOfObj = Object.entries(file).map((el) => (  el[1] ));

                arrayOfObj.forEach((ele) => {
                    data.append(`files`, ele);
                  });
                //data.append('file', file)
                data.append('record_id', id)
                data.append('room_name', 'categorycli')
                data.append('alt_tag_data', 'categorycli')
                data.append('description', 'categorycli')

                api.post('/file/uploadFiles',data).then(()=>{
     
                    message('Files Uploaded Successfully','success')
                    
                }).catch(()=>{
                   
                    message('Unable to upload File','error')
                   
                })
            }
      alert('Category updated successfully');

      navigate('/Categories');
    } catch (err) {
      console.error('Update failed:', err);
      alert('Update failed. Please try again.');
    }
  };

  const onCancel = () => {
    navigate('/Categories');
  };

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
          {getFile && getFile.length > 0 ? (
            getFile.map((res) => (
              <div key={res.media_id} style={{ display: 'flex', alignItems: 'center' }}>
                <img
                  src={`http://amproadmin.zaitunsoftsolutions.com/storage/uploads/${res.name}`}
                  alt="Category"
                  style={{ height: 80, width: 80, marginRight: 10, border: '1px solid #ccc' }}
                />
                <Button color="danger" size="sm" onClick={() => deleteFile(res.media_id)}>
                  <Icon.Trash2 />
                </Button>
              </div>
            ))
          ) : (
            <>
               <FormGroup>
                  
                <FileUploader
                        multiple
                        handleChange={handleFileChange}
                        name="file"
                       // types={fileTypes}
                    />
                    
                    {imagePreviews.length > 0 && (
                      imagePreviews.map((preview) => (
                        <div key={preview} style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                          <img
                            src={preview}
                            alt="Preview"
                            style={{ height: 80, width: 80, marginRight: 10, border: '1px solid #ccc' }}
                          />
                        </div>
                      ))
                    )}

                     {handleValue && handleValue.length > 0 ? (
                        handleValue.map((e) => (
                        <div key={e.name + e.lastModified}>
                            <span> Name: {e.name} </span>
                        </div>
                        ))
                    ) : (
                        <span>No file selected</span>
                    )}

                </FormGroup>
            </>
          )}
        </Col>
      </FormGroup>

      <Row className="mb-3">
        <Col sm={{ size: 8, offset: 4 }}>
          {['show_on_ecommerce', 'show_on_eprocurement', 'show_on_pos', 'read_weight_from_scale', 'is_active'].map((field) => (
            <FormGroup check key={field}>
              <Label check>
                <Input
                  type="checkbox"
                  name={field}
                  checked={form[field] === 1}
                  onChange={handleChange}
                />{' '}
                {field.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
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
 