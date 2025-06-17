import React, { useState } from 'react';
import {
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Button,
  Table,
} from 'reactstrap';
// import PropTypes from 'prop-types';

export default function CustomerProductDetails() {
  // State for a new product being added
  const [newProduct, setNewProduct] = useState({
    product_code: '',
    product_name: '',
    wholesale_price: '',
    fixed_price: '', // New field for Fixed Price
  });

  // State to hold the list of products associated with this customer
  const [customerProductList, setCustomerProductList] = useState([]);

  // Synchronize internal state with prop data when contentDetails.products changes
//   useEffect(() => {
//     // Using optional chaining for contentDetails?.products for safety
//     if (contentDetails?.products && Array.isArray(contentDetails.products)) {
//       setCustomerProductList(contentDetails.products);
//     } else {
//       setCustomerProductList([]); // Ensure it's an empty array if data isn't available
//     }
//   }, [contentDetails.products]);

  const handleNewProductInputs = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value,
    });
  };

  const addProduct = () => {
    if (newProduct.product_code && newProduct.product_name) {
      setCustomerProductList([
        ...customerProductList,
        { ...newProduct, id: Date.now() + Math.random() }, // Add a unique ID
      ]);
      // Clear the form fields after adding
      setNewProduct({
        product_code: '',
        product_name: '',
        wholesale_price: '',
        fixed_price: '',
      });
      // IMPORTANT: You'll need to pass this updated list to the parent (ContentUpdate)
      // e.g., via a prop like onProductsChange(updatedList)
    } else {
      alert('Please fill at least Product Code and Product Name.');
    }
  };

  // Function to handle changes directly in the table (e.g., Fixed Price)
  const handleTableInputChange = (id, fieldName, value) => {
    setCustomerProductList(
      customerProductList.map((product) =>
        product.id === id ? { ...product, [fieldName]: value } : product
      )
    );
  };

  const handleTickAction = (id) => {
    // This action typically means saving or confirming the edit for a specific row.
    // In a real app, you might trigger an API call to update this specific product.
    console.log(`Tick action for product ID: ${id}`);
    alert(`Product ID ${id} marked as 'Fixed' or saved.`);
    // You might also want to update the fixed_price in contentDetails or save to backend here
    // based on how you implement editing.
  };

  const handleDeleteAction = (id) => {
    setCustomerProductList(customerProductList.filter((product) => product.id !== id));
    // IMPORTANT: Pass updated list to parent if you want changes to persist on save
  };

  return (
    <div>
      <Row className="mb-4 align-items-end">
        <Col md="4">
          <FormGroup>
            <Label>Product Code</Label>
            <Input
              type="text"
              onChange={handleNewProductInputs}
              value={newProduct.product_code}
              name="product_code"
            />
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
            />
          </FormGroup>
        </Col>
        <Col md="4">
          <FormGroup>
            <Label>Wholesale Price</Label>
            <Input
              type="number" // Use type="number" for prices
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
                  <Button color="success" size="sm" onClick={() => handleTickAction(product.id)} className="me-2">
                    <i className="fa fa-check"></i> {/* Tick Icon */}
                  </Button>
                  <Button color="danger" size="sm" onClick={() => handleDeleteAction(product.id)}>
                    <i className="fa fa-trash"></i> {/* Delete Icon */}
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

// CustomerProductDetails.propTypes = {
//   contentDetails: PropTypes.object,
// };