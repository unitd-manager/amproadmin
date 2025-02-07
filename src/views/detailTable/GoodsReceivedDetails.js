import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Input,
  Table,
  Button,
  Form,
  Label,
} from "reactstrap";

const GoodsReceiveForm = () => {
  const [products, setProducts] = useState([
    { productCode: "", productName: "", cartonQty: 0, looseQty: 0, discount: 0 },
  ]);

  const addProductRow = () => {
    setProducts([
      ...products,
      { productCode: "", productName: "", cartonQty: 0, looseQty: 0, discount: 0 },
    ]);
  };

  const handleInputChange = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] = value;
    setProducts(newProducts);
  };

  return (
    <Container fluid>
      <h4 className="my-3 text-center">Add/Edit Goods Receive</h4>

      {/* Supplier and Transaction Details */}
      <Row className="mb-3">
        <Col md="3">
          <Label>Tran No</Label>
          <Input type="text" placeholder="Tran No" />
        </Col>
        <Col md="3">
          <Label>Tran Date</Label>
          <Input type="date" />
        </Col>
        <Col md="3">
          <Label>Supplier Code</Label>
          <Input type="text" placeholder="Supplier Code" />
        </Col>
        <Col md="3">
          <Label>Invoice No</Label>
          <Input type="text" placeholder="Invoice No" />
        </Col>
      </Row>

      {/* Product Table */}
      <Table bordered>
        <thead>
          <tr>
            <th>S No</th>
            <th>Product Code</th>
            <th>Product Name</th>
            <th>Carton Qty</th>
            <th>Loose Qty</th>
            <th>% Discount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <Input
                  type="text"
                  value={product.productCode}
                  onChange={(e) => handleInputChange(index, "productCode", e.target.value)}
                />
              </td>
              <td>
                <Input
                  type="text"
                  value={product.productName}
                  onChange={(e) => handleInputChange(index, "productName", e.target.value)}
                />
              </td>
              <td>
                <Input
                  type="number"
                  value={product.cartonQty}
                  onChange={(e) => handleInputChange(index, "cartonQty", e.target.value)}
                />
              </td>
              <td>
                <Input
                  type="number"
                  value={product.looseQty}
                  onChange={(e) => handleInputChange(index, "looseQty", e.target.value)}
                />
              </td>
              <td>
                <Input
                  type="number"
                  value={product.discount}
                  onChange={(e) => handleInputChange(index, "discount", e.target.value)}
                />
              </td>
              <td>
                <Button color="danger" size="sm" onClick={() => {
                  setProducts(products.filter((_, i) => i !== index));
                }}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Actions */}
      <Button color="primary" onClick={addProductRow}>
        Add Product
      </Button>

      {/* Summary */}
      <Row className="mt-3">
        <Col md="3">
          <Label>Sub Total</Label>
          <Input type="text" disabled value="0.00" />
        </Col>
        <Col md="3">
          <Label>Tax</Label>
          <Input type="text" disabled value="0.00" />
        </Col>
        <Col md="3">
          <Label>Net Total</Label>
          <Input type="text" disabled value="0.00" />
        </Col>
      </Row>

      {/* Save/Cancel Buttons */}
      <Row className="mt-4">
        <Col>
          <Button color="success">Save</Button> <Button color="secondary">Cancel</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default GoodsReceiveForm;
