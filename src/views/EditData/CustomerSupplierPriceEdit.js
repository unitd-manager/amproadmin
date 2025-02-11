/*eslint-disable*/
import React, { useState, useEffect } from "react";
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
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import classnames from "classnames";
import { FaTrash } from "react-icons/fa";
import { useParams } from 'react-router-dom';
import api from "../../constants/api";

const ProductContactPricePage = () => {
      const { id } = useParams();
  const [activeTab, setActiveTab] = useState("1");
  const [productData, setProductData] = useState([]);
  const [contactDetails, setContactDetails] = useState({
    ContactCode: "",
    ContactName: "",
  });

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  // Fetch product data
  useEffect(() => {
    api
      .post("/customersupplier/getPriceproducts",{customer_supplier_price_id:id}) // Replace with your API endpoint
      .then((response) => {
        setProductData(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
      });

    api
      .post("/customersupplier/getCustomerContact",{customer_supplier_price_id:id}) // Replace with your API endpoint
      .then((response) => {
        setContactDetails(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching contact details:", error);
      });
  }, []);

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
              <Input type="text" value={contactDetails.ContactCode} readOnly />
            </Col>
            <Col md="6">
              <label>Contact Name</label>
              <Input type="text" value={contactDetails.ContactName} readOnly />
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "1" })}
                onClick={() => toggleTab("1")}
              >
                Product
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
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
                  {productData.map((product, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
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
            </TabPane>
          </TabContent>
        </CardBody>
      </Card>
    </Container>
  );
};

export default ProductContactPricePage;

