/* eslint-disable */
import React, { useState, useEffect, useContext } from "react";
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
import api from "../../constants/api";
import { useNavigate } from "react-router-dom";
import AppContext from "../../context/AppContext";

const ProductContactPricePage = () => {
  const [products, setProducts] = useState([
    {
      SNo: 1,
      product_code: "",
      product_id: "",
      purchase_unit_cost: "",
      pcs_per_carton: "",
      wholesale_price: "",
      carton_price: "",
      margin_perc: "",
    },
  ]);

  const [contacts, setContacts] = useState([]);
  const [selectedContactId, setSelectedContactId] = useState("");
  const [contactDetails, setContactDetails] = useState({
    contact_code: "",
    contact_name: "",
    customer: 0,
    supplier: 0,
  });

  const [allProducts, setAllProducts] = useState([]);
const navigate=useNavigate();
  useEffect(() => {
    // Fetch contacts
    api.get("/customersupplierprice/getContactclis")
      .then((res) => {
        if (res.data && res.data.data) {
          setContacts(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching contacts:", err);
      });

    // Fetch products
    api.get("/customersupplierprice/getProductclis")
      .then((res) => {
        if (res.data && res.data.data) {
          setAllProducts(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  }, []);

  const handleInputChange = (index, field, value) => {
    const updatedProducts = products.map((product, i) =>
      i === index ? { ...product, [field]: value } : product
    );
    setProducts(updatedProducts);
  };

  const handleAddProduct = () => {
    setProducts([
      ...products,
      {
        SNo: products.length + 1,
        product_code: "",
        product_id: "",
        purchase_unit_cost: "",
        pcs_per_carton: "",
        wholesale_price: "",
        carton_price: "",
        margin_perc: "",
      },
    ]);
  };


  const { loggedInuser } = useContext(AppContext);
  const handleDeleteProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  const handleSave = async () => {
    if (!selectedContactId) {
      alert("Please select a contact");
      return;
    }

    try {
      const customerVal = contactDetails.customer === 1 ? 1 : 0;
      const supplierVal = contactDetails.supplier === 1 ? 1 : 0;

      const priceRes = await api.post("/customersupplierprice/addCustomerSupplierPrice", {
        contact_id: selectedContactId,
        product_count: products.length,
        customer: customerVal,
        supplier: supplierVal,
        product_code: "",
        price: 0,
        created_user: loggedInuser.first_name,
        created_by:loggedInuser.first_name
      });

      if (priceRes.data && priceRes.data.data.insertId) {
        const insertId = priceRes.data.data.insertId;

        for (const prod of products) {
          await api.post("/customersupplierprice/addCsProduct", {
            customer_supplier_price_id: insertId,
            product_code: prod.product_code,
            product_id: prod.product_id || 0,
            purchase_unit_cost: prod.purchase_unit_cost,
            pcs_per_carton: prod.pcs_per_carton,
            wholesale_price: prod.wholesale_price,
            carton_price: prod.carton_price,
            margin_perc: prod.margin_perc
          });
        }

        alert("Saved successfully!");
        navigate(`/CustomerSupplierPriceEdit/${insertId}`)
      } else {
        alert("Failed to save Customer Supplier Price");
      }
    } catch (err) {
      console.error("Error saving data: ", err);
      alert("Error saving data");
    }
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
              <Input
                type="select"
                value={selectedContactId}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  setSelectedContactId(selectedId);
                  const selected = contacts.find(c => c.contact_cli_id === parseInt(selectedId, 10));
                  setContactDetails({
                    contact_code: selected ? selected.contact_code : "",
                    contact_name: selected ? selected.contact_name : "",
                    customer: selected ? selected.customer : 0,
                    supplier: selected ? selected.supplier : 0
                  });
                }}
              >
                <option value="">Select Contact Code</option>
                {contacts.map((contact) => (
                  <option key={contact.contact_cli_id} value={contact.contact_cli_id}>
                    {contact.contact_code}
                  </option>
                ))}
              </Input>
            </Col>

            <Col md="6">
              <label>Contact Name</label>
              <Input type="text" value={contactDetails.contact_name || ""} readOnly />
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
              {products.map((product, index) => (
                <tr key={index}>
                  <td>{product.SNo}</td>
                  <td>
                    <Input
                      type="select"
                      value={product.product_code}
                      onChange={(e) => {
                        const code = e.target.value;
                        const prod = allProducts.find(p => p.product_code === code);
                        handleInputChange(index, "product_code", code);
                        handleInputChange(index, "product_id", prod ? prod.product_id : "");
                      }}
                    >
                      <option value="">Select Product</option>
                      {allProducts.map(p => (
                        <option key={p.product_id} value={p.product_code}>
                          {p.product_code}
                        </option>
                      ))}
                    </Input>
                  </td>
                  <td>
                    <Input
                      type="text"
                      value={product.product_id}
                      readOnly
                    />
                  </td>
                  <td>
                    <Input
                      type="number"
                      value={product.purchase_unit_cost}
                      onChange={(e) => handleInputChange(index, "purchase_unit_cost", e.target.value)}
                    />
                  </td>
                  <td>
                    <Input
                      type="number"
                      value={product.pcs_per_carton}
                      onChange={(e) => handleInputChange(index, "pcs_per_carton", e.target.value)}
                    />
                  </td>
                  <td>
                    <Input
                      type="number"
                      value={product.wholesale_price}
                      onChange={(e) => handleInputChange(index, "wholesale_price", e.target.value)}
                    />
                  </td>
                  <td>
                    <Input
                      type="number"
                      value={product.carton_price}
                      onChange={(e) => handleInputChange(index, "carton_price", e.target.value)}
                    />
                  </td>
                  <td>
                    <Input
                      type="number"
                      value={product.margin_perc}
                      onChange={(e) => handleInputChange(index, "margin_perc", e.target.value)}
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
          <Button color="success" className="mt-3 ms-2" onClick={handleSave}>
            Save
          </Button>
        </CardBody>
      </Card>
    </Container>
  );
};

export default ProductContactPricePage;
