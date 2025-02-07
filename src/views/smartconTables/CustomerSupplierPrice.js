import React, { useState } from "react";
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
import "bootstrap/dist/css/bootstrap.min.css";

const PricingManagement = () => {
  const [activeTab, setActiveTab] = useState("customer");
  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const data = [
    { id: 1, name: "VINAYAGA TRADING & SUPERMART PTE LTD", code: "VINAJURONG", count: 48, user: "sales2", date: "06/02/2025" },
    { id: 2, name: "EVERGREEN TRADING MART", code: "EVERG", count: 51, user: "sales2", date: "06/02/2025" },
    { id: 3, name: "DAKSHNA TRADERS MINIMART", code: "DAKJURON", count: 176, user: "sales2", date: "06/02/2025" },
    { id: 4, name: "BS SUPERMARKET", code: "BSSTUS", count: 121, user: "sales1", date: "06/02/2025" },
    { id: 5, name: "TOH GUAN MINIMART", code: "TOUMI", count: 223, user: "sales2", date: "06/02/2025" },
    { id: 6, name: "POPULAR SUPERMARKET PTE LTD", code: "PAPULARSUP", count: 154, user: "sales2", date: "06/02/2025" },
    { id: 7, name: "BAZAAR", code: "BAZAARTOH", count: 82, user: "sales2", date: "06/02/2025" },
    { id: 8, name: "NAWAS GLOBAL PTE LTD", code: "NAWASTUAS", count: 306, user: "sales2", date: "06/02/2025" },
  ];

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
              {data.map((item) => (
                <tr key={item.id}>
                  <td>
                    <Button color="danger" size="sm">Delete</Button>
                  </td>
                  <td>{item.name}</td>
                  <td>{item.count}</td>
                  <td>{item.user}</td>
                  <td>{item.date}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TabPane>
        <TabPane tabId="supplier">Supplier content here...</TabPane>
        <TabPane tabId="contactGroup">Contact group content here...</TabPane>
      </TabContent>
    </Container>
  );
};

export default PricingManagement;
