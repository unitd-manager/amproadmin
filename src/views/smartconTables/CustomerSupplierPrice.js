import React, { useState,useEffect } from "react";
import {
  Container,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Input,
  Button,
  Table,
  Row,
  Col,
} from "reactstrap";
import { Link } from 'react-router-dom';
import moment from 'moment';
import message from '../../components/Message';
import api from '../../constants/api';
import "bootstrap/dist/css/bootstrap.min.css";

const PricingManagement = () => {
  const [activeTab, setActiveTab] = useState("customer");
  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  const [customer, setCustomer] = useState([]);
  const [supplier, setSupplier] = useState([]);

  //getting data from content
  const getSupplier = () => {
    api
      .get('/customersupplierprice/getSupplierPrice')
      .then((res) => {
        setSupplier(res.data.data);
        console.log(res.data.data)
      })
      .catch(() => {
        message('Cannot get Content Data', 'error');
      });
  };
  //getting data from content
  const getCustomer = () => {
    api
      .get('/customersupplierprice/getCustomerPrice')
      .then((res) => {
        setCustomer(res.data.data);
        console.log(res.data.data)
      })
      .catch(() => {
        message('Cannot get Content Data', 'error');
      });
  };


useEffect(() => {
    
    getSupplier();
    getCustomer();
    setCustomer();
      setSupplier()
  }, []);
  return (
    <Container className="mt-4">
      <h3>Customer / Supplier Pricing Management</h3>
      <Nav tabs className="mt-3">
        <NavItem>
          <NavLink
            className={activeTab === "customer" ? "active" : ""}
            onClick={() => toggleTab("customer")}
          >
            Customer
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={activeTab === "supplier" ? "active" : ""}
            onClick={() => toggleTab("supplier")}
          >
            Supplier
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={activeTab === "contactGroup" ? "active" : ""}
            onClick={() => toggleTab("contactGroup")}
          >
            Contact Group
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab} className="mt-3">
        <TabPane tabId="customer">
          <Row>
            <Col md={6} className="mb-3">
              <Input type="text" placeholder="Search Contact..." />
            </Col>
            <Col md={2}>
              <Button color="primary">Search</Button>
            </Col>
            <Col md={{ size: 3, offset: 1 }}>
            <Link to="/CustomerSupplierPriceDetails">
              <Button color="dark">Add New</Button>
              </Link>
            </Col>
          </Row>

          <Table hover className="mt-3">
            <thead>
              <tr>
                <th>Action</th>
                <th>Contact Name</th>
                <th>Product Count</th>
                <th>Created User</th>
                <th>Created Date</th>
              </tr>
            </thead>
            <tbody>
              {customer?.map((item) => (
                <tr key={item.customer_supplier_price_id}>
                  <td>
                    <Button color="danger" size="sm">Delete</Button>
                  </td>
                  <td>  <Link to={`/CustomerSupplierPriceEdit/${item.customer_supplier_price_id}`}>
                  {item.contact_name}
                                      </Link></td>
                  <td>{item.product_count}</td>
                  <td>{item.created_user}</td>
                  <td>{moment(item.created_at).format('DD/MM/YYYY')}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TabPane>
        <TabPane tabId="supplier">
          <Row>
            <Col md={6} className="mb-3">
              <Input type="text" placeholder="Search Contact..." />
            </Col>
            <Col md={2}>
              <Button color="primary">Search</Button>
            </Col>
            <Col md={{ size: 3, offset: 1 }}>
              <Button color="dark">Add New</Button>
            </Col>
          </Row>

          <Table hover className="mt-3">
            <thead>
              <tr>
                <th>Action</th>
                <th>Contact Name</th>
                <th>Product Count</th>
                <th>Created User</th>
                <th>Created Date</th>
              </tr>
            </thead>
            <tbody>
               {supplier?.map((item) => (
                <tr key={item.customer_supplier_price_id}>
                  <td>
                    <Button color="danger" size="sm">Delete</Button>
                  </td>
                  <td>  <Link to={`/CustomerSupplierPriceEdit/${item.customer_supplier_price_id}`}>
                  {item.contact_name}
                                      </Link></td>
                  <td>{item.product_count}</td>
                  <td>{item.created_user}</td>
                  <td>{moment(item.created_at).format('DD/MM/YYYY')}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TabPane>
        <TabPane tabId="contactGroup">

           <Row>
            <Col md={6} className="mb-3">
              <Input type="text" placeholder="Search Contact..." />
            </Col>
            <Col md={2}>
              <Button color="primary">Search</Button>
            </Col>
            <Col md={{ size: 3, offset: 1 }}>
              <Button color="dark">Add New</Button>
            </Col>
          </Row>

          <Table hover className="mt-3">
            <thead>
              <tr>
                <th>Action</th>
                <th>Contact Name</th>
                <th>Product Count</th>
                <th>Created User</th>
                <th>Created Date</th>
              </tr>
            </thead>
            <tbody>
              {supplier?.map((item) => (
                <tr key={item.customer_supplier_price_id}>
                  <td>
                    <Button color="danger" size="sm">Delete</Button>
                  </td>
                  <td>  <Link to={`/CustomerSupplierPriceEdit/${item.customer_supplier_price_id}`}>
                  {item.contact_name}
                                      </Link></td>
                  <td>{item.product_count}</td>
                  <td>{item.created_user}</td>
                  <td>{moment(item.created_at).format('DD/MM/YYYY')}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TabPane>
      </TabContent>
    </Container>
  );
};

export default PricingManagement;
