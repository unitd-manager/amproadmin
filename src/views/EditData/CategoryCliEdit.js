// import React, { useState, useEffect } from 'react';
// import {
//   Button,
//   Form,
//   FormGroup,
//   Label,
//   Input,
//   Col,
//   Row,
// } from 'reactstrap';
// import { useNavigate, useParams } from 'react-router-dom';
// import Swal from 'sweetalert2';
// import * as Icon from 'react-feather';
// import message from '../../components/Message';
// import api from '../../constants/api';

// const EditCategory = () => {
//   const { id } = useParams(); // category_cli_id
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     category_cli_id:id,
//     category_name: '',
//     department_cli_id: '',
//     sort_order: '',
//     product_prefix: '',
//     show_on_ecommerce: 1,
//     show_on_eprocurement: 1,
//     show_on_pos: 1,
//     read_weight_from_scale: 0,
//     is_active: 1,
//   });
// const tableStyle = {};

//   const [getFile, setGetFile] = useState(null);

//   const getFiles = () => {
//     api.post('/file/getListOfFiles', { record_id: id, room_name: 'categorycli' }).then((res) => {
//       setGetFile(res.data);
//     });
//   };

//   const deleteFile = (fileId) => {
//     Swal.fire({
//       title: `Are you sure?`,
//       text: "You won't be able to revert this!",
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Yes, delete it!',
//     }).then((result) => {
//       if (result.isConfirmed) {
//         api
//           .post('/file/deleteFile', { media_id: fileId })
//           .then((res) => {
//             console.log(res);
//             Swal.fire('Deleted!', 'Media has been deleted.', 'success');
//             //setViewLineModal(false)

//             window.location.reload();
//           })
//           .catch(() => {
//             message('Unable to Delete Media', 'info');
//           });
//       }
//     });
//   };

//   useEffect(() => {
//     getFiles();
//   }, []);
//   const [departments, setDepartments] = useState([]);

//   const handleChange = (e) => {
//     const { name, value, type, checked, files } = e.target;
//     if (type === 'checkbox') {
//       setForm({ ...form, [name]: checked ? 1 :0 });
//     } else if (type === 'file') {
//       setForm({ ...form, [name]: files[0] });
//     } else {
//       setForm({ ...form, [name]: value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     Object.entries(form).forEach(([key, value]) => {
//       formData.append(key, value);
//     });
//     formData.append('category_cli_id', id); // for backend update reference

//     try {
//       await api.post('/categorycli/update_category_cli', formData);
//       alert('Category updated successfully');
//       navigate('/Categories');
//     } catch (err) {
//       console.error('Update failed:', err);
//       alert('Update failed. Please try again.');
//     }
//   };

//   const fetchDepartments = async () => {
//     const res = await api.get('/departmentcli/getalldepartments');
//     setDepartments(res.data.data);
//   };

//   const fetchCategoryDetails = async () => {
//     try {
//       const res = await api.get(`/categorycli/get_category_cli/${id}`, { category_cli_id: id });
//       if (res.data ) {
//         setForm(res.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching category:', error);
//     }
//   };

//   const onCancel = () => {
//     navigate('/Categories');
//   };

//   useEffect(() => {
//     fetchDepartments();
//     fetchCategoryDetails();
//   }, [id]);

//   return (
//     <Form onSubmit={handleSubmit} style={{ maxWidth: 700, margin: 'auto' }}>
//       <h4 className="mb-4">Edit Category</h4>

//       <FormGroup row>
//         <Label for="category_name" sm={4}>Category Name *</Label>
//         <Col sm={8}>
//           <Input type="text" name="category_name" value={form.category_name} onChange={handleChange} required />
//         </Col>
//       </FormGroup>

//       <FormGroup row>
//         <Label for="department_cli_id" sm={4}>Department Name</Label>
//         <Col sm={8}>
//           <Input type="select" name="department_cli_id" value={form.department_cli_id} onChange={handleChange}>
//             <option value="">Select an option</option>
//             {departments?.map((dept) => (
//               <option key={dept.department_cli_id} value={dept.department_cli_id}>
//                 {dept.department_name}
//               </option>
//             ))}
//           </Input>
//         </Col>
//       </FormGroup>

//       <FormGroup row>
//         <Label for="sort_order" sm={4}>Sort Order</Label>
//         <Col sm={8}>
//           <Input type="number" name="sort_order" value={form.sort_order} onChange={handleChange} />
//         </Col>
//       </FormGroup>

//       <FormGroup row>
//         <Label for="product_prefix" sm={4}>Product Prefix</Label>
//         <Col sm={8}>
//           <Input type="text" name="product_prefix" value={form.product_prefix} onChange={handleChange} />
//         </Col>
//       </FormGroup>

//       <FormGroup row>
//         <Label for="category_image" sm={4}>Category Image (80x80)</Label>
//         <Col sm={8}>
//         <table style={tableStyle}>
//                 {/* <thead>
//                   <tr style={tableStyle}>
//                     <th style={tableStyle}>
//                      File Name
//                     </th>
//                     <th width="5%"></th>
//                   </tr>
//                 </thead> */}
//                 <tbody>
//                 {getFile ? (
//                   getFile.map((res) => {
//                     return (
//                         <tr key={res.media_id}>
//                           <td style={tableStyle}>
//                               {/* <a
//                                 href={`http://ampro.zaitunsoftsolutions.com/storage/uploads/${res.name}`}
//                                 target="_blank"
//                                 rel="noreferrer"
//                               >
//                                 {res.name}
//                               </a> */}
//                                <img
//               src={`http://ampro.zaitunsoftsolutions.com/storage/uploads/${res.name}`}
//               alt="Brand Preview"
//               style={{ height: 80, width: 80, marginTop: '10px', border: '1px solid #ccc' }}
//             />
//                           </td>
//                           <td style={tableStyle}>
//                             <button
//                               type="button"
//                               className="btn shadow-none"
//                               onClick={() => {
//                                 deleteFile(res.media_id);
//                               }}
//                             >
//                               <Icon.Trash2 />{' '}
//                             </button>
//                           </td>
//                         </tr>
//                     );
//                   })
//                 ) : (
//                   <>
//           {/* <Input type="file" name="category_image" accept="image/*" onChange={handleChange} />
//           <FormText color="muted">Upload image (80x80)</FormText> */}
//           </>
//                 )}
//                 </tbody>
                
//               </table>
        
//         </Col>
//       </FormGroup>

     
//   <Row className="mb-3">
//         <Col sm={{ size: 8, offset: 4 }}>
//           <FormGroup check>
//             <Label check>
//               <Input type="checkbox" name="show_on_ecommerce" checked={form.show_on_ecommerce === 1}
//  onChange={handleChange} /> Show On ECommerce
//             </Label>
//           </FormGroup>
//           <FormGroup check>
//             <Label check>
//               <Input type="checkbox" name="show_on_eprocurement" checked={form.show_on_eprocurement === 1} onChange={handleChange} /> Show On EProcurement
//             </Label>
//           </FormGroup>
//           <FormGroup check>
//             <Label check>
//               <Input type="checkbox" name="show_on_pos" checked={form.show_on_pos === 1} onChange={handleChange} /> Show On POS
//             </Label>
//           </FormGroup>
//           <FormGroup check>
//             <Label check>
//               <Input type="checkbox" name="read_weight_from_scale" checked={form.read_weight_from_scale === 1} onChange={handleChange} /> Read Weight From Scale
//             </Label>
//           </FormGroup>
//           <FormGroup check>
//             <Label check>
//               <Input type="checkbox" name="is_active" checked={form.is_active === 1} onChange={handleChange} /> IsActive
//             </Label>
//           </FormGroup>
//         </Col>
//       </Row>
//       <Row className="mt-4">
//         <Col sm={{ size: 8, offset: 4 }}>
//           <Button color="primary" type="submit">Update</Button>{' '}
//           <Button color="danger" type="button" onClick={onCancel}>Cancel</Button>
//         </Col>
//       </Row>
//     </Form>
//   );
// };

// export default EditCategory;
import React, { useState, useEffect } from 'react';
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
import message from '../../components/Message';
import api from '../../constants/api';

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

  const fetchDepartments = async () => {
    const res = await api.get('/departmentcli/getalldepartments');
    setDepartments(res.data.data);
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
  }, [id]);

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
      await api.post(`/categorycli/update_category_cli`, form);
      alert('Category updated successfully');

      // Handle file upload if a new file was selected
      // if (category_image instanceof File) {
      //   const fileData = new FormData();
      //   fileData.append('file', category_image);
      //   fileData.append('record_id', id);
      //   fileData.append('room_name', 'categorycli');
      //   fileData.append('alt_tag_data', 'categorycli');
      //   fileData.append('description', 'categorycli');

      //   await api.post('/file/uploadFiles', fileData);
      //   alert('Image uploaded successfully');
      // }

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
                  src={`http://ampro.zaitunsoftsolutions.com/storage/uploads/${res.name}`}
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
              <Input type="file" name="category_image" accept="image/*" onChange={handleChange} />
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
 