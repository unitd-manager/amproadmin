import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Label,
  Input,
  Button,
  Table,
} from 'reactstrap';
import Select from 'react-select';
import PropTypes from 'prop-types';
import api from '../../constants/api';

export default function CustomerProductDetails({ customerId }) {
  const [newProduct, setNewProduct] = useState({
    product_code: '',
    product_name: '',
    wholesale_price: '',
    fixed_price: 0.00,
    existing_id: null,
    product_id: ''
  });

  const [customerProductList, setCustomerProductList] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
//
  

   const fetchCompanyProducts = () => {
    api
      .post('/product/getByCompanyId', { company_id: customerId })
      .then((res) => {
      setCustomerProductList(res.data.data);
      })
      .catch(() => {
        alert('Failed to fetch products for this company');
      });
  };

  useEffect(() => {
   
    
    api.get('/product/getProducts').then((res) => {
      setAllProducts(res.data.data);
    });

    fetchCompanyProducts();
  }, []);

  const handleNewProductInputs = (e) => {
    const { name, value } = e.target;

    if (name === 'product_code') {
      const selectedProduct = allProducts.find(p => p.product_code === value);
      if (selectedProduct) {
        setNewProduct(prev => ({
          ...prev,
          product_code: selectedProduct.product_code,
          product_id: selectedProduct.product_id,
          product_name: selectedProduct.product_name,
          wholesale_price: selectedProduct.wholesale_price,
        }));
      } else {
        // If no product is selected (cleared)
        setNewProduct(prev => ({
          ...prev,
          product_code: '',
          product_id: '',
          product_name: '',
          wholesale_price: '',
        }));
      }
    } else {
      setNewProduct(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleTickAction = async (id) => {
    try {
      // Make sure we find the exact product using product_company_id
      const product = customerProductList.find(p => p.product_company_id === id);
      
      if (!product) {
        throw new Error('Product not found');
      }

      // Populate the form with selected product details
      setNewProduct({
        product_code: product.product_code,
        product_name: product.product_name,
        wholesale_price: product.wholesale_price,
        product_id: product.product_id,
        fixed_price: product.fixed_price,
        existing_id: product.product_company_id  // Use product_company_id instead of id
      });
      
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    }
  };

  const addProduct = async () => {
    if (newProduct.product_code && newProduct.product_name) {
      try {
        // If there's an existing record (from tick action), delete it first
        if (newProduct.existing_id) {
          const deleteResponse = await api.post('/product/deleteProductComp', {
            product_company_id: newProduct.existing_id
          });
          
          if (deleteResponse.data.msg !== 'Success') {
            throw new Error('Failed to delete existing record');
          }
        }

        // Create new record
        const payload = {
          product_id: newProduct.product_id,
          company_id: customerId,
          wholesale_price: newProduct.wholesale_price,
          fixed_price: newProduct.fixed_price
        };

        await api.post('/product/insertProductComp', payload);
        
        // Refresh the list
        fetchCompanyProducts();

        // Clear the form
        setNewProduct({
          product_code: '',
          product_name: '',
          wholesale_price: '',
          fixed_price: 0.00,
          existing_id: null,
          product_id: ''
        });

        alert('Product updated successfully');

      } catch (error) {
        console.error('Error saving product:', error);
        alert('Failed to save product');
      }
    } else {
      alert('Please fill at least Product Code and Product Name.');
    }
  };

  // const handleTableInputChange = (id, fieldName, value) => {
  //   setCustomerProductList(
  //     customerProductList.map((product) =>
  //       product.id === id ? { ...product, [fieldName]: value } : product
  //     )
  //   );
  // };

  // Modify the handleDeleteAction function
const handleDeleteAction = async (id) => {
  try {
    // Send product_company_id in the request body
    const response = await api.post('/product/deleteProductComp', {
      product_company_id: id
    });

    if (response.data.msg === 'Success') {
      // Refresh the list only if delete was successful
      fetchCompanyProducts();
      alert('Product deleted successfully');
    } else {
      alert('Failed to delete product');
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    alert('Failed to delete product');
  }
};

  return (
    <div className="container-fluid">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Product Details</h5>
        </div>
        <div className="card-body">
          <Row className="mb-3">
            <Col sm={6}>
              <Row className="mb-3">
                <Col sm={4} className="d-flex align-items-center">
                  <Label className="mb-0 fw-bold">Product Code</Label>
                </Col>
                <Col sm={8}>
                  <Select
                    className="form-control-sm p-0"
                    name="product_code"
                    options={allProducts.map(p => ({
                      value: p.product_code,
                      label: p.product_name,
                      product_id: p.product_id,
                      product_name: p.product_name,
                      product_code: p.product_code,
                      wholesale_price: p.wholesale_price
                    }))}
                    value={newProduct.product_code ? {
                      value: newProduct.product_code,
                      label: newProduct.product_name,
                      product_id: newProduct.product_id,
                      product_name: newProduct.product_name,
                      product_code: newProduct.product_code,
                      wholesale_price: newProduct.wholesale_price
                    } : null}
                    onChange={(selectedOption) => {
                      if (selectedOption) {
                        setNewProduct({
                          ...newProduct,
                          product_code: selectedOption.product_code,
                          product_id: selectedOption.product_id,
                          product_name: selectedOption.product_name,
                          wholesale_price: selectedOption.wholesale_price
                        });
                      } else {
                        setNewProduct({
                          ...newProduct,
                          product_code: '',
                          product_id: '',
                          product_name: '',
                          wholesale_price: ''
                        });
                      }
                    }}
                    formatOptionLabel={(option, { context }) =>
                      context === "value" 
                        ? option.value  // selected value → product code
                        : option.label  // dropdown menu → product name
                    }
                    styles={{
                      control: (base) => ({
                        ...base,
                        minHeight: '31px',
                        height: '31px',
                        padding: 0
                      }),
                      menu: (base) => ({
                        ...base,
                        zIndex: 9999
                      })
                    }}
                    menuPortalTarget={document.body}
                    isClearable
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4} className="d-flex align-items-center">
                  <Label className="mb-0 fw-bold">Product Name</Label>
                </Col>
                <Col sm={8}>
                  <Input
                    type="text"
                    className="form-control-sm"
                    onChange={handleNewProductInputs}
                    value={newProduct.product_name}
                    name="product_name"
                    readOnly
                  />
                </Col>
              </Row>
            </Col>
            <Col sm={6}>
              <Row className="mb-3">
                <Col sm={4} className="d-flex align-items-center">
                  <Label className="mb-0 fw-bold">Wholesale Price</Label>
                </Col>
                <Col sm={8}>
                  <Input
                    type="number"
                    className="form-control-sm"
                    onChange={handleNewProductInputs}
                    value={newProduct.wholesale_price}
                    name="wholesale_price"
                    readOnly
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4} className="d-flex align-items-center">
                  <Label className="mb-0 fw-bold">Fixed Price</Label>
                </Col>
                <Col sm={8}>
                  <Input
                    type="number"
                    className="form-control-sm"
                    onChange={handleNewProductInputs}
                    value={newProduct.fixed_price || 0.00}
                    name="fixed_price"
                  />
                </Col>
              </Row>
            </Col>
          </Row>

          <div className="d-flex justify-content-end">
            <Button color="primary" size="sm" onClick={addProduct}>
              {newProduct.existing_id ? 'Update' : 'Add Product'}
            </Button>
          </div>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Product List</h5>
        </div>
        <div className="card-body">
          {customerProductList.length > 0 ? (
            <Table responsive bordered>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product Code</th>
                  <th>Product Name</th>
                  <th>Wholesale Price</th>
                  <th>Fixed Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customerProductList.map((product, index) => (
                  <tr key={product.product_company_id || index}>
                    <td>{index + 1}</td>
                    <td>{product.product_code}</td>
                    <td>{product.product_name}</td>
                    <td>{product.wholesale_price}</td>
                    <td>{product.fixed_price}</td>
                    <td>
                      <Button
                        color="info"
                        size="sm"
                        className="me-2"
                        onClick={() => handleTickAction(product.product_company_id)}
                      >
                        <i className="fa fa-edit"></i> Edit
                      </Button>
                      <Button
                        color="danger"
                        size="sm"
                        onClick={() => handleDeleteAction(product.product_company_id)}
                      >
                        <i className="fa fa-trash"></i> Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center p-3">No products added yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

CustomerProductDetails.propTypes = {
  customerId: PropTypes.any,
};