import React, { useContext, useState, useEffect } from 'react';
import { Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ComponentCard from '../../components/ComponentCard';
import message from '../../components/Message';
import api from '../../constants/api';
import creationdatetime from '../../constants/creationdatetime';
import AppContext from '../../context/AppContext';

const ProductCLDetails = () => {
  //All const variables
  const navigate = useNavigate();
  const [productDetails, setProductDetails] = useState({
    title: '',
    creation_date: moment(),
  });
  //setting data in ProductDetails
  const handleInputs = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };
  //get staff details
  const { loggedInuser } = useContext(AppContext);
  //Insert Product Data
  const insertProductData = (ProductCode) => {
    if (productDetails.title.trim() !== '') {
      productDetails.product_code = ProductCode;
      productDetails.creation_date = creationdatetime;
      productDetails.created_by = loggedInuser.first_name;
      
      // Insert product
      api.post('/product/insertProduct', productDetails)
        .then((res) => {
          const insertedDataId = res.data.data.insertId;
          message('Product inserted successfully.', 'success');
  
          // Fetch inventory code and insert inventory

          api
          .post('/commonApi/getCodeValues', { type: 'inventory' })
          .then((resp) => {
              const InventoryCode = resp.data.data;
              message('Fetched Inventory code successfully.', 'success');
              api.post('/inventory/insertinventory', {
                product_id: insertedDataId,
                inventory_code: InventoryCode,
                created_by: loggedInuser.first_name, 
                creation_date: creationdatetime, 
              })
              .then(() => {
                message('Inventory created successfully.', 'success');
              })
              .catch((inventoryError) => {
                console.error('Error creating inventory:', inventoryError);
                message('Unable to create inventory.', 'error');
              });
  
            })
            .catch((codeError) => {
              console.error('Error fetching Inventory code:', codeError);
              message('Unable to fetch Inventory code.', 'error');
            });
  
          setTimeout(() => {
            navigate(`/ProductCLEdit/${insertedDataId}?tab=1`);
          }, 300);
        })
        .catch((productError) => {
          console.error('Error inserting product:', productError);
          message('Unable to insert product.', 'error');
        });
    } else {
      message('Please fill all required fields.', 'warning');
    }
  };
  

  //Auto generation code
  const generateCode = () => {
    api
      .post('/commonApi/getCodeValues', { type: 'product' })
      .then((res) => {
        const ProductCode = res.data.data;
       console.log('ProductCode',ProductCode)
          insertProductData(ProductCode);
      })
      .catch(() => {
        insertProductData('');
      });
  };

  //useeffect
  useEffect(() => {}, []);

  return (
    <div style={{ background: '#f5f7fa', minHeight: '100vh', padding: '32px 0' }}>
      <BreadCrumbs />
      <ToastContainer />
      <Row className="justify-content-center">
        <Col md="8">
          <div style={{ background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: 32, border: '1px solid #e0e0e0' }}>
            <ComponentCard title="New/Edit Product">
              <Form>
                <FormGroup>
                  <Row>
                    <Col md="12">
                      <Label>
                        Product Name <span className="required"> *</span>{' '}
                      </Label>
                      <Input
                        type="text"
                        onChange={handleInputs}
                        value={productDetails && productDetails.title}
                        name="title"
                      />
                    </Col>
                  </Row>
                </FormGroup>
                <FormGroup>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16, marginTop: 32, background: '#f5f7fa', padding: '18px 24px', borderRadius: 8 }}>
                    <button
                      type="button"
                      style={{ background: '#fff', color: '#1a355e', border: '1px solid #bfc8d6', borderRadius: 6, padding: '8px 32px', fontWeight: 500, fontSize: 18, minWidth: 100, marginRight: 8 }}
                      onClick={() => navigate('/ProductCL')}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      style={{ background: '#fff', color: '#1a355e', border: '1px solid #bfc8d6', borderRadius: 6, padding: '8px 32px', fontWeight: 500, fontSize: 18, minWidth: 100, marginRight: 8 }}
                      onClick={() => setProductDetails({ title: '', creation_date: moment() })}
                    >
                      Clear
                    </button>
                    <button type="button" style={{ background: '#1a355e', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 32px', fontWeight: 500, fontSize: 18, minWidth: 100 }} onClick={generateCode}>Save</button>
                  </div>
                </FormGroup>
              </Form>
            </ComponentCard>
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default ProductCLDetails;
