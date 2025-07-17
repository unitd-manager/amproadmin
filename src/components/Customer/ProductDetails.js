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
import api from '../../constants/api';

export default function CustomerProductDetails() {
  const [newProduct, setNewProduct] = useState({
    product_code: '',
    product_name: '',
    wholesale_price: '',
    fixed_price: '',
  });

  const [customerProductList, setCustomerProductList] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    api.get('/product/getProducts').then((res) => {
      setAllProducts(res.data.data);
    });
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
          product_name: selectedProduct.title,
          wholesale_price: selectedProduct.wholesale_price,
        }));
      }
    }
  };

  const addProduct = () => {
    if (newProduct.product_code && newProduct.product_name) {
      setCustomerProductList([
        ...customerProductList,
        { ...newProduct, id: Date.now() + Math.random() },
      ]);
      setNewProduct({
        product_code: '',
        product_name: '',
        wholesale_price: '',
        fixed_price: '',
      });
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

  const handleTickAction = (id) => {
    console.log(`Tick action for product ID: ${id}`);
    alert(`Product ID ${id} marked as 'Fixed' or saved.`);
  };

  const handleDeleteAction = (id) => {
    setCustomerProductList(customerProductList.filter((product) => product.id !== id));
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
              readOnly
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
                  <Button color="success" size="sm" onClick={() => handleTickAction(product.id)} className="me-2">
                    <i className="fa fa-check"></i>
                  </Button>
                  <Button color="danger" size="sm" onClick={() => handleDeleteAction(product.id)}>
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