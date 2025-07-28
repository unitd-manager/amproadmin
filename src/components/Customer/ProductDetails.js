import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Button,
  Table,
} from 'reactstrap';
import PropTypes from 'prop-types';
import api from '../../constants/api';

export default function CustomerProductDetails({ customerId }) {
  const [newProduct, setNewProduct] = useState({
    product_code: '',
    product_name: '',
    wholesale_price: '',
    fixed_price: '',
      existing_id: null  // Add this line

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
    setNewProduct({
      ...newProduct,
      [name]: value,
    });

    if (name === 'product_code') {
      const selectedProduct = allProducts.find(p => p.product_code === value);
      if (selectedProduct) {
        setNewProduct(prev => ({
          ...prev,
          product_id: selectedProduct.product_id,
          product_name: selectedProduct.product_name,
          wholesale_price: selectedProduct.wholesale_price,
        }));
      }
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
          fixed_price: '',
          existing_id: null
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

  const handleTableInputChange = (id, fieldName, value) => {
    setCustomerProductList(
      customerProductList.map((product) =>
        product.id === id ? { ...product, [fieldName]: value } : product
      )
    );
  };

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
    <div>
      <Row className="mb-4 align-items-end">
        <Col md="4">
          <FormGroup>
            <Label>Product Code</Label>
            <Input
              type="select"
              onChange={handleNewProductInputs}
              value={newProduct.product_code}
              name="product_code"
            >
              <option value="">Select Product</option>
              {allProducts.map((p) => (
                <option key={p.product_id} value={p.product_code}>
                  {p.product_code}
                </option>
              ))}
            </Input>
          </FormGroup>
        </Col>
        <Col md="4">
          <FormGroup>
            <Label>Product Name</Label>
            <Input
              type="text"
              onChange={handleNewProductInputs}
              value={newProduct.product_name}
              name="product_name"
              readOnly
            />
          </FormGroup>
        </Col>
        <Col md="4">
          <FormGroup>
            <Label>Wholesale Price</Label>
            <Input
              type="number"
              onChange={handleNewProductInputs}
              value={newProduct.wholesale_price}
              name="wholesale_price"
            
            />
          </FormGroup>
        </Col>
        <Col md="12" className="text-right mt-3">
          <Button color="success" onClick={addProduct}>
            Add Product
          </Button>
        </Col>
      </Row>

      <hr />

      <h4>Product List</h4>
      {customerProductList.length > 0 ? (
        <Table responsive bordered>
          <thead>
            <tr>
              <th>#</th>
              <th>Product Code</th>
              <th>Product Name</th>
              <th>Wholesale Price</th>
              <th>Fixed Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {customerProductList.map((product, index) => (
              <tr key={product.id}>
                <td>{index + 1}</td>
                <td>{product.product_code}</td>
                <td>{product.product_name}</td>
                <td>{product.wholesale_price}</td>
                <td>
                  <Input
                    type="number"
                    value={product.fixed_price}
                    onChange={(e) => handleTableInputChange(product.id, 'fixed_price', e.target.value)}
                    placeholder="Enter Fixed Price"
                  />
                </td>
                <td>
                  <Button color="success" size="sm" onClick={() => handleTickAction(product.product_company_id)} className="me-2">
                    <i className="fa fa-check"></i>
                  </Button>
                  <Button color="danger" size="sm" onClick={() => handleDeleteAction(product.product_company_id)}>
                    <i className="fa fa-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No products added yet.</p>
      )}
    </div>
  );
}

CustomerProductDetails.propTypes = {
  customerId: PropTypes.any,
};