import React from "react";
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
  const productData = [
    {
      SNo: 1,
      ProductCode: "100170",
      ProductName: "AMPRO BRAND MUSTARD OIL 250ML",
      PurchaseUnitCost: "0.9147",
      PcsPerCarton: 24,
      WholeSalePrice: "1.55",
      CartonPrice: 36,
      MarginPerc: "69.454",
    },
    {
      SNo: 2,
      ProductCode: "100172",
      ProductName: "AMPRO BRAND MUSTARD OIL 1LIT",
      PurchaseUnitCost: "4.3839",
      PcsPerCarton: 12,
      WholeSalePrice: "5.40",
      CartonPrice: 63.6,
      MarginPerc: "23.178",
    },
    // Add more product rows as needed
  ];

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
              <Input type="text" value="VINAJURONG" readOnly />
            </Col>
            <Col md="6">
              <label>Contact Name</label>
              <Input type="text" value="VINAYAGA TRADING & SUPERMART PTE LTD" readOnly />
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
              {productData.map((product) => (
                <tr key={product.SNo}>
                  <td>{product.SNo}</td>
                  <td>{product.ProductCode}</td>
                  <td>{product.ProductName}</td>
                  <td>{product.PurchaseUnitCost}</td>
                  <td>{product.PcsPerCarton}</td>
                  <td>{product.WholeSalePrice}</td>
                  <td>{product.CartonPrice}</td>
                  <td>{product.MarginPerc}</td>
                  <td>
                    <Button color="danger" size="sm">
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button color="primary" className="rounded-circle p-2">
            +
          </Button>
        </CardBody>
      </Card>
    </Container>
  );
};

export default ProductContactPricePage;
