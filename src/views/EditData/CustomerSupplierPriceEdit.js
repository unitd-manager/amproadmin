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
import { useParams, useNavigate } from "react-router-dom";
import api from "../../constants/api";
import AppContext from "../../context/AppContext";

const ProductContactPriceEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loggedInuser } = useContext(AppContext);

  const [contacts, setContacts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedContactId, setSelectedContactId] = useState("");
  const [contactDetails, setContactDetails] = useState({
    contact_code: "",
    contact_name: "",
    customer: 0,
    supplier: 0,
    contact_id: "",
    product_count:0,
  });

  const [products, setProducts] = useState([]);

  // Load contact list and product list
  useEffect(() => {
    api.get("/customersupplierprice/getContactclis").then((res) => {
      if (res.data?.data) setContacts(res.data.data);
    });

    api.get("/customersupplierprice/getProductclis").then((res) => {
      if (res.data?.data) setAllProducts(res.data.data);
    });
  }, []);

  // Load contact details and assigned products when both allProducts and id are ready
  useEffect(() => {
    if (id && allProducts.length > 0) {
      api.get(`/customersupplierprice/getCustomerSupplierPriceById/${id}`).then((res) => {
        if (res.data?.data?.length > 0) {
          const contact = res.data.data[0];
          setSelectedContactId(contact.contact_id);
          setContactDetails({
            contact_code: contact.contact_code || "",
            contact_name: contact.contact_name || "",
            customer: contact.customer || 0,
            supplier: contact.supplier || 0,
            contact_id: contact.contact_id || "",
          });
        }
      });

      api.get(`/customersupplierprice/getCsProductByCSPId/${id}`).then((res) => {
        if (res.data?.data?.length > 0) {
          const enrichedProducts = res.data.data.map((p) => {
            const matched = allProducts.find((prod) => prod.product_id === p.product_id);
            return {
              ...p,
              product_code: matched?.product_code || p.product_code || "",
              title: matched?.title || p.title || "",
            };
          });
          setProducts(enrichedProducts);
        }
      });
    }
  }, [id, allProducts]);

  // Update contact details when selection changes
  useEffect(() => {
    if (selectedContactId && contacts.length > 0) {
      const selected = contacts.find(c => c.contact_cli_id === parseInt(selectedContactId));
      if (selected) {
        setContactDetails({
          contact_code: selected.contact_code,
          contact_name: selected.contact_name,
          customer: selected.customer,
          supplier: selected.supplier,
        });
      }
    }
  }, [selectedContactId, contacts]);

  const handleInputChange = (index, field, value) => {
    setProducts(prev =>
      prev.map((prod, i) =>
        i === index ? { ...prod, [field]: value } : prod
      )
    );
  };

  const handleProductCodeChange = (index, selectedCode) => {
    const selectedProduct = allProducts.find(p => p.product_code === selectedCode);
    setProducts(prev =>
      prev.map((prod, i) =>
        i === index
          ? {
              ...prod,
              product_code: selectedCode,
              product_id: selectedProduct?.product_id || "",
              title: selectedProduct?.title || "",
            }
          : prod
      )
    );
  };

  const handleDeleteProduct = async (index, prodid) => {
    if (prodid) {
      await api.delete(`/customersupplierprice/deleteCsProduct/${prodid}`);
    }
    setProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      await api.post(`/customersupplierprice/updateCustomerSupplierPrice`, {
        customer_supplier_price_id: Number(id),
        contact_id: Number(selectedContactId),
        customer: Number(contactDetails.customer),
        supplier: Number(contactDetails.supplier),
        updated_by: loggedInuser.first_name,
        product_count: products.length,
      });

      for (const product of products) {
        await api.post("/customersupplierprice/updateCsProduct", {
          cs_product_id: product.cs_product_id,
          customer_supplier_price_id: Number(id),
          product_code: product.product_code,
          product_id: product.product_id,
          purchase_unit_cost: product.purchase_unit_cost,
          pcs_per_carton: product.pcs_per_carton,
          wholesale_price: product.wholesale_price,
          carton_price: product.carton_price,
          margin_perc: product.margin_perc,
          updated_by: loggedInuser.first_name,
        });
      }

      alert("Updated successfully!");
      navigate("/CustomerSupplierPrice");
    } catch (err) {
      console.error("Error saving:", err);
      alert("Update failed");
    }
  };

  const handleCancel = () => {
    navigate("/CustomerSupplierPrice");
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
              <Input
                type="select"
                value={selectedContactId}
                onChange={(e) => setSelectedContactId(e.target.value)}
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
                <th>Title</th>
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
                  <td>{index + 1}</td>
                  <td>
                    <Input
                      type="select"
                      value={product.product_code}
                      onChange={(e) => handleProductCodeChange(index, e.target.value)}
                    >
                      <option value="">Select Product</option>
                      {allProducts.map((p) => (
                        <option key={p.product_id} value={p.product_code}>
                          {p.product_code}
                        </option>
                      ))}
                    </Input>
                  </td>
                  <td>
                    <Input type="text" value={product.title || ""} readOnly />
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
                      onClick={() => handleDeleteProduct(index, product.cs_product_id)}
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
          <Button color="secondary" className="mt-3 ms-2" onClick={handleCancel}>
            Cancel
          </Button>
        </CardBody>
      </Card>
    </Container>
  );
};

export default ProductContactPriceEditPage;
