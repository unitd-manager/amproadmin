/* eslint-disable */
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
import { useParams } from "react-router-dom";
import api from "../../constants/api";

const ProductContactPricePage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("1");
  const [productData, setProductData] = useState([]);
  const [contactDetails, setContactDetails] = useState({
    contact_code: "",
    contact_name: "",
  });

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  useEffect(() => {
    if (id) {
      api
        .post("/customersupplier/getPriceproducts", { customer_supplier_price_id: id })
        .then((res) => {
          if (res.data && res.data.data) setProductData(res.data.data);
        })
        .catch((err) => console.error("Error fetching product data:", err));

      api
        .post("/customersupplier/getCustomerContact", { customer_supplier_price_id: id })
        .then((res) => {
          if (res.data && res.data.data) setContactDetails(res.data.data);
        })
        .catch((err) => console.error("Error fetching contact details:", err));
    }
  }, [id]);

  const handleProductChange = (index, field, value) => {
    const updated = productData.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setProductData(updated);
  };

  const handleDeleteProduct = (index) => {
    const updated = productData.filter((_, i) => i !== index);
    setProductData(updated);
  };

  const handleSave = async () => {
    try {
      // Update Customer Supplier Price (if needed - create API if you don't have)
      await api.post("/customersupplier/updateCustomerSupplierPrice", {
        customer_supplier_price_id: id,
        contact_id: contactDetails.contact_id, // Assuming contact_id is part of contactDetails
      });

      // Update products one by one (or create bulk update API)
      for (const product of productData) {
        await api.post("/customersupplier/updateCsProduct", {
          cs_product_id: product.cs_product_id,
          product_code: product.product_code,
          product_id: product.product_id,
          purchase_unit_cost: product.purchase_unit_cost,
          pcs_per_carton: product.pcs_per_carton,
          wholesale_price: product.wholesale_price,
          carton_price: product.carton_price,
          margin_perc: product.margin_perc,
        });
      }

      alert("Updated successfully!");
    } catch (err) {
      console.error("Error updating:", err);
      alert("Update failed!");
    }
  };

  return (
    <Container fluid>
      <Card className="p-3 mb-4">
        <CardBody>
          <CardTitle className="text-center" tag="h4">
            Edit Product Contact Price
          </CardTitle>
          <Row className="mb-3">
            <Col md="6">
              <label>Contact Code</label>
              <Input type="text" value={contactDetails.contact_code} readOnly />
            </Col>
            <Col md="6">
              <label>Contact Name</label>
              <Input type="text" value={contactDetails.contact_name} readOnly />
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
                    <th>Product ID</th>
                    <th>Purchase Unit Cost</th>
                    <th>Pcs Per Carton</th>
                    <th>Wholesale Price</th>
                    <th>Carton Price</th>
                    <th>Margin %</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {productData.map((product, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <Input
                          type="text"
                          value={product.product_code}
                          onChange={(e) =>
                            handleProductChange(index, "product_code", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <Input
                          type="text"
                          value={product.product_id}
                          onChange={(e) =>
                            handleProductChange(index, "product_id", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <Input
                          type="number"
                          value={product.purchase_unit_cost}
                          onChange={(e) =>
                            handleProductChange(index, "purchase_unit_cost", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <Input
                          type="number"
                          value={product.pcs_per_carton}
                          onChange={(e) =>
                            handleProductChange(index, "pcs_per_carton", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <Input
                          type="number"
                          value={product.wholesale_price}
                          onChange={(e) =>
                            handleProductChange(index, "wholesale_price", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <Input
                          type="number"
                          value={product.carton_price}
                          onChange={(e) =>
                            handleProductChange(index, "carton_price", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <Input
                          type="number"
                          value={product.margin_perc}
                          onChange={(e) =>
                            handleProductChange(index, "margin_perc", e.target.value)
                          }
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
              <Button color="success" className="mt-3" onClick={handleSave}>
                Save Changes
              </Button>
            </TabPane>
          </TabContent>
        </CardBody>
      </Card>
    </Container>
  );
};

export default ProductContactPricePage;
