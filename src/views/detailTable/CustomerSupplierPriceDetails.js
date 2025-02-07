import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Input,
  Card,
  CardBody,
  CardTitle,
} from "reactstrap";
import { FaTrash } from "react-icons/fa";

const ProductContactPricePage = () => {
  const [products, setProducts] = useState([
    { SNo: 1, ProductCode: "", ProductName: "", PurchaseUnitCost: "", PcsPerCarton: "", WholeSalePrice: "", CartonPrice: "", MarginPerc: "" },
  ]);

  const handleInputChange = (index, field, value) => {
    const updatedProducts = products.map((product, i) =>
      i === index ? { ...product, [field]: value } : product
    );
    setProducts(updatedProducts);
  };

  const handleAddProduct = () => {
    setProducts([
      ...products,
      { SNo: products.length + 1, ProductCode: "", ProductName: "", PurchaseUnitCost: "", PcsPerCarton: "", WholeSalePrice: "", CartonPrice: "", MarginPerc: "" },
    ]);
  };

  const handleDeleteProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  return (
    <Container fluid>
      <Card className="p-3 mb-4">
        <CardBody>
          <CardTitle className="text-center" tag="h4">
            Add/Edit Product Contact Price
          </CardTitle>
          <Row className="mb-3">
            <Col md="6">
              <label>Contact Code</label>
              <Input type="text" placeholder="Enter contact code" />
            </Col>
            <Col md="6">
              <label>Contact Name</label>
              <Input type="text" placeholder="Enter contact name" />
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h5 className="mb-3">Products</h5>
          <Table bordered responsive>
            <thead>
              <tr>
                <th>SNo</th>
                <th>Product Code</th>
                <th>Product Name</th>
                <th>Purchase Unit Cost</th>
                <th>Pcs Per Carton</th>
                <th>Whole Sale Price</th>
                <th>Carton Price</th>
                <th>Margin %</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index}>
                  <td>{product.SNo}</td>
                  <td>
                    <Input
                      type="text"
                      value={product.ProductCode}
                      onChange={(e) => handleInputChange(index, "ProductCode", e.target.value)}
                    />
                  </td>
                  <td>
                    <Input
                      type="text"
                      value={product.ProductName}
                      onChange={(e) => handleInputChange(index, "ProductName", e.target.value)}
                    />
                  </td>
                  <td>
                    <Input
                      type="number"
                      value={product.PurchaseUnitCost}
                      onChange={(e) => handleInputChange(index, "PurchaseUnitCost", e.target.value)}
                    />
                  </td>
                  <td>
                    <Input
                      type="number"
                      value={product.PcsPerCarton}
                      onChange={(e) => handleInputChange(index, "PcsPerCarton", e.target.value)}
                    />
                  </td>
                  <td>
                    <Input
                      type="number"
                      value={product.WholeSalePrice}
                      onChange={(e) => handleInputChange(index, "WholeSalePrice", e.target.value)}
                    />
                  </td>
                  <td>
                    <Input
                      type="number"
                      value={product.CartonPrice}
                      onChange={(e) => handleInputChange(index, "CartonPrice", e.target.value)}
                    />
                  </td>
                  <td>
                    <Input
                      type="number"
                      value={product.MarginPerc}
                      onChange={(e) => handleInputChange(index, "MarginPerc", e.target.value)}
                    />
                  </td>
                  <td>
                    <Button
                      color="danger"
                      size="sm"
                      onClick={() => handleDeleteProduct(index)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button color="primary" className="mt-3" onClick={handleAddProduct}>
            + Add Product
          </Button>
        </CardBody>
      </Card>
    </Container>
  );
};

export default ProductContactPricePage;
