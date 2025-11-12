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
import { FileUploader } from 'react-drag-drop-files';
import { useNavigate } from 'react-router-dom';
import message from '../../components/Message';
import api from '../../constants/api';
import AppContext from '../../context/AppContext';

const AddCategory = () => {
  const [form, setForm] = useState({
    category_name: '',
    department_cli_id: '',
    sort_order: '',
    product_prefix: '',
    category_image: null,
    show_on_ecommerce: 1,
    show_on_eprocurement: 1,
    show_on_pos: 1,
    read_weight_from_scale: 0,
    is_active: 1,
  });

  const [departments, setDepartments] = useState([]);
const navigate=useNavigate();
const onCancel=()=>{
navigate('/Categories')
}
const onSave=(id)=>{
navigate(`/CategoriesEdit/${id}`)
}
 

  const fetchDepartments = async () => {
    const res = await api.get('/departmentcli/getalldepartments');
    setDepartments(res?.data?.data);
  };

  // const handleChange = (e) => {
  //   const { name, value, type, checked, files } = e.target;
  //   if (type === 'checkbox') {
  //     setForm({ ...form, [name]: checked });
  //   } else if (type === 'file') {
  //     setForm({ ...form, [name]: files[0] });
  //   } else {
  //     setForm({ ...form, [name]: value });
  //   }
  // };
  
  
    const { loggedInuser } = useContext(AppContext);

  const [file, setFile] = useState([]);
        const [imagePreviews, setImagePreviews] = useState([]);

        const handleFileChange = (selectedFiles) => {
          
            // const arrayOfObj = Object.entries(selectedFiles).map((e) => ( e[1]  ));

            setFile(selectedFiles);
            console.log(selectedFiles)

            const newImagePreviews = [];
            for (let i = 0; i < selectedFiles.length; i++) {
              const f = selectedFiles[i];
              newImagePreviews.push(URL.createObjectURL(f));
            }
            setImagePreviews(newImagePreviews);
        };

const handleChange = (e) => {
  const { name, value, type, checked, files } = e.target;
  if (type === 'checkbox') {
    setForm({ ...form, [name]: checked ? 1 : 0 });
  } else if (type === 'file') {
    setForm({ ...form, [name]: files[0] });
  } else {
    setForm({ ...form, [name]: value });
  }
  console.log('formchange',form)
};

const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  Object.entries(form).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });
formData.append('created_by', loggedInuser.first_name);
  try {
    const response = await api.post('/categorycli/insert_category_cli', formData);
    const { insertId } = response.data.data;

    if(file){

           
                const data = new FormData() 
                const arrayOfObj = Object.entries(file).map((el) => (  el[1] ));

                arrayOfObj.forEach((ele) => {
                    data.append(`files`, ele);
                  });
                //data.append('file', file)
                data.append('record_id', insertId)
                data.append('room_name', 'categorycli')
                data.append('alt_tag_data', 'categorycli')
                data.append('description', 'categorycli')

                api.post('/file/uploadFiles',data).then(()=>{
     
                    message('Files Uploaded Successfully','success')
                    
                }).catch(()=>{
                   
                    message('Unable to upload File','error')
                   
                })
            }
    onSave(insertId);

  } catch (err) {
    console.error("Error submitting form: ", err);
    alert("There was an error saving the category.");
  }
};

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     Object.entries(form).forEach(([key, value]) => {
//       formData.append(key, value);
//     });
//     const response =await api.post('/categorycli/insert_category_cli', formData);
//       const {insertId} = response.data.data; 
//       console.log('response data',response.data)
//       if (form?.category_image) {
//         const data = new FormData() 
                

               
//                     data.append(`files`, form.category_image);
                 
//                 data.append('file', form.category_image)
//                 data.append('record_id', insertId)
//                 data.append('room_name', 'categorycli')
//                 data.append('alt_tag_data', 'categorycli')
//                 data.append('description', 'categorycli')
// console.log('data',data)
//                 api.post('/file/uploadFiles',data).then(()=>{
     
//                 }).catch(()=>{
                   
//                 })
//     }
//     onSave(insertId);
   
//   };
 

        // const uploadFile = () =>{
            
        //     if(file){

        //        // getFiles();
            
          
        //         const data = new FormData() 
        //         const arrayOfObj = Object.entries(file).map((e) => (  e[1] ));

        //         arrayOfObj.forEach((ele) => {
        //             data.append(`files`, ele);
        //           });
        //         //data.append('file', file)
        //         data.append('record_id', moduleId)
        //         data.append('room_name', roomName)
        //         data.append('alt_tag_data', altTagData)
        //         data.append('description', desc)

        //         api.post('/file/uploadFiles',data,{onUploadProgress:(filedata)=>{
        //             console.log( Math.round((filedata.loaded/filedata.total)*100))
        //             setUploaded( Math.round((filedata.loaded/filedata.total)*100))
                   
        //         }}).then(()=>{
     
        //             // setAttachmentModal(false)
        //             message('Files Uploaded Successfully','success')
                    
        //             setTimeout(() => {
        //                 window.location.reload()
        //             }, 400);
        //         }).catch(()=>{
        //             setAttachmentModal(false)
        //             message('Unable to upload File','error')
        //             // setTimeout(() => {
        //             //     window.location.reload()
        //             // }, 400);
        //         })
        //     }else{
        //         message('No files selected','info')
        //     }
        // }
      
 useEffect(() => {
    fetchDepartments();
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);
  return (
    <Form onSubmit={handleSubmit} style={{ maxWidth: 700, margin: 'auto' }}>
      <h4 className="mb-4">Add Category</h4>
      <FormGroup row>
        <Label for="category_name" sm={4}>
          Category Name *
        </Label>
        <Col sm={8}>
          <Input type="text" name="category_name" value={form.category_name} onChange={handleChange} required />
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label for="department_cli_id" sm={4}>
          Department Name
        </Label>
        <Col sm={8}>
          <Input type="select" name="department_cli_id" value={form.department_cli_id} onChange={handleChange}>
            <option value="">Select an option</option>
            {departments?.map((dept) => (
              <option key={dept.department_cli_id} value={dept.department_cli_id}>
                {dept.department_name}
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
        <Label for="category_image" sm={4}>
          Category Image
        </Label>
        <Col sm={8}>
          <FileUploader handleChange={handleFileChange} name="file" types={["JPG", "PNG", "GIF"]} multiple />
          <div className="d-flex flex-wrap mt-2">
            {imagePreviews.map((preview) => (
              <img key={preview} src={preview} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', margin: '5px' }} />
            ))}
          </div>
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label for="show_on_ecommerce" sm={4}>
          Show on E-commerce
        </Label>
        <Col sm={8}>
          <FormGroup check>
            <Label check>
              <Input type="checkbox" name="show_on_ecommerce" checked={form.show_on_ecommerce === 1} onChange={handleChange} /> Show On ECommerce
            </Label>
          </FormGroup>
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label for="show_on_eprocurement" sm={4}>
          Show On EProcurement
        </Label>
        <Col sm={8}>
          <FormGroup check>
            <Label check>
              <Input type="checkbox" name="show_on_eprocurement" checked={form.show_on_eprocurement === 1} onChange={handleChange} /> Show On EProcurement
            </Label>
          </FormGroup>
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label for="show_on_pos" sm={4}>
          Show On POS
        </Label>
        <Col sm={8}>
          <FormGroup check>
            <Label check>
              <Input type="checkbox" name="show_on_pos" checked={form.show_on_pos === 1} onChange={handleChange} /> Show On POS
            </Label>
          </FormGroup>
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label for="read_weight_from_scale" sm={4}>
          Read Weight From Scale
        </Label>
        <Col sm={8}>
          <FormGroup check>
            <Label check>
              <Input type="checkbox" name="read_weight_from_scale" checked={form.read_weight_from_scale === 1} onChange={handleChange} /> Read Weight From Scale
            </Label>
          </FormGroup>
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label for="is_active" sm={4}>
          IsActive
        </Label>
        <Col sm={8}>
          <FormGroup check>
            <Label check>
              <Input type="checkbox" name="is_active" checked={form.is_active === 1} onChange={handleChange} /> IsActive
            </Label>
          </FormGroup>
        </Col>
      </FormGroup>
  <Row className="mt-4">
    <Col sm={{ size: 8, offset: 4 }}>
      <Button color="primary" type="submit">Save</Button>{' '}
      <Button color="danger" type="button" onClick={onCancel}>Cancel</Button>
    </Col>
  </Row>
</Form>
);
};

export default AddCategory;
