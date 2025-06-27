import React, { useState, useEffect, useContext } from 'react';
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
import Swal from 'sweetalert2';
import * as Icon from 'react-feather';
import { FileUploader } from 'react-drag-drop-files';
import message from '../../components/Message';
import api from '../../constants/api';
import AppContext from '../../context/AppContext';

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
  const [file, setFile] = useState([]);
           const [ handleValue, setHandleValue ] = useState();
   
           const handleFileChange = (fiels) => {
             
               const arrayOfObj = Object.entries(fiels).map((e) => ( e[1]  ));
   
               setFile(fiels);
               setHandleValue(arrayOfObj);
               console.log(fiels)
           };
  const tableStyle = {};
  
    const [getFile, setGetFile] = useState(null);
  
    const getFiles = () => {
      api.post('/file/getListOfFiles', { record_id: id, room_name: 'departmentcli' }).then((res) => {
        setGetFile(res.data);
      });
    };
  
        const { loggedInuser } = useContext(AppContext);
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
          api
            .post('/file/deleteFile', { media_id: fileId })
            .then((res) => {
              console.log(res);
              Swal.fire('Deleted!', 'Media has been deleted.', 'success');
              //setViewLineModal(false)
  
              window.location.reload();
            })
            .catch(() => {
              message('Unable to Delete Media', 'info');
            });
        }
      });
    };
  
    useEffect(() => {
      getFiles();
    }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setForm({ ...form, [name]: checked?1:0 });
    } else if (type === 'file') {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      form.updated_by=loggedInuser.first_name;
      await api.post(`/departmentcli/update_departments_cli`, form);
        if(file){

          
                const data = new FormData() 
                const arrayOfObj = Object.entries(file).map((el) => (  el[1] ));

                arrayOfObj.forEach((ele) => {
                    data.append(`files`, ele);
                  });
                //data.append('file', file)
                data.append('record_id', id)
                data.append('room_name', 'brandcli')
                data.append('alt_tag_data', 'brandcli')
                data.append('description', 'brandcli')

                api.post('/file/uploadFiles',data).then(()=>{
     
                    message('Files Uploaded Successfully','success')
                    
                }).catch(()=>{
                   
                    message('Unable to upload File','error')
                   
                })
            }
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
  
        <table style={tableStyle}>
                                        {/* <thead>
                                          <tr style={tableStyle}>
                                            <th style={tableStyle}>
                                             File Name
                                            </th>
                                            <th width="5%"></th>
                                          </tr>
                                        </thead> */}
                                        <tbody>
                                        {getFile ? (
                                          getFile.map((res) => {
                                            return (
                                                <tr key={res.media_id}>
                                                  <td style={tableStyle}>
                                                      {/* <a
                                                        href={`http://ampro.zaitunsoftsolutions.com/storage/uploads/${res.name}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                      >
                                                        {res.name}
                                                      </a> */}
                                                       <img
                                      src={`http://amproadmin.zaitunsoftsolutions.com/storage/uploads/${res.name}`}
                                      alt="Department Preview"
                                      style={{ height: 80, width: 80, marginTop: '10px', border: '1px solid #ccc' }}
                                    />
                                                  </td>
                                                  <td style={tableStyle}>
                                                    <button
                                                      type="button"
                                                      className="btn shadow-none"
                                                      onClick={() => {
                                                        deleteFile(res.media_id);
                                                      }}
                                                    >
                                                      <Icon.Trash2 />{' '}
                                                    </button>
                                                  </td>
                                                </tr>
                                            );
                                          })
                                        ) : (
                                          <>
                                  <Input type="file" name="sub_category_image" accept="image/*" onChange={handleChange} />
                                  <FormText color="muted">Upload image (80x80)</FormText> <FormGroup>
                                                    
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
                                  </>
                                        )}
                                        </tbody>
                                        
                                      </table>
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
