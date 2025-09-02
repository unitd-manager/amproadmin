// ./src/views/smartconTables/Dashboard.js

import React, { useState, useEffect } from "react";
import classnames from "classnames";
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Table,
} from "reactstrap";
import { FaChartBar, FaMoneyBillWave } from 'react-icons/fa';
import api from "../../constants/api";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [salesData, setSalesData] = useState({});
  const [weeklySales, setWeeklySales] = useState([]);
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [salestotalvalue, setSalesTotalValue] = useState({});

  // Toggle tab
  const toggle = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  // Function to get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // ✅ returns 2025-08-26
  };

  useEffect(() => {
    const today = getCurrentDate();
    console.log("today", today);
    api
      .get("/salesOrder/getSalesAnalysis")
      .then((res) => {
        if (res.data.data && res.data.data.length > 0) {
          setSalesData(res.data.data[0]);
        }
      })
      .catch((err) => console.error(err));

    api
      .get("/salesOrder/getWeeklySalesReport")
      .then((res) => {
        setWeeklySales(res.data.data);
      })
      .catch((err) => console.error(err));

      api
      .get("/salesOrder/getSalesTotalOutstanding")
      .then((res) => {
          setSalesTotalValue(res.data.data[0]);
      })
      .catch((err) => console.error(err));

    api
      .post("/salesOrder/getRecentInvoices", {date: today })
      .then((res) => {
        setRecentInvoices(res.data.data);
      })
      .catch((err) => console.error(err));

    api
      .post("/salesOrder/getRecentOrders", {date: today })
      .then((res) => {
        setRecentOrders(res.data.data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      {/* Tabs and other JSX as before */}
      <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "1" })}
            onClick={() => toggle("1")}
          >
            Dashboard
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "2" })}
            onClick={() => toggle("2")}
          >
            Sales
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "3" })}
            onClick={() => toggle("3")}
          >
            Purchase
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "4" })}
            onClick={() => toggle("4")}
          >
            Finance
          </NavLink>
        </NavItem>
      </Nav>

      <TabContent activeTab={activeTab} className="mt-3">
        {/* Dashboard Tab */}
        <TabPane tabId="1">
          {/* Sales Analysis and Weekly Sales */}
          <Row className="mt-3">
            <Col md="6">
              <Card className="shadow-sm mb-4 h-100">
                <CardHeader className="bg-white">
                  <h5 className="mb-0">Sales Analysis Data</h5>
                </CardHeader>
                <CardBody>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Total Sales:</span>
                    <strong>${salesData.totalSales}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Total Bills:</span>
                    <strong>{salesData.totalBills}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Total Items:</span>
                    <strong>{salesData.totalItems}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Avg/Bill:</span>
                    <strong>${salesData.avgBill}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Avg/Item:</span>
                    <strong>${salesData.avgItem}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Total Cost:</span>
                    <strong>${salesData.totalCost}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Profit:</span>
                    <strong>${salesData.profit}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Margin:</span>
                    <strong>{salesData.margin}%</strong>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col md="6">
              <Card className="shadow-sm mb-4 h-100">
                <CardHeader className="bg-white">
                  <h5 className="mb-0">Weekly Sales Data</h5>
                </CardHeader>
                <CardBody>
                  <Table bordered responsive>
                    <thead className="table-light">
                      <tr>
                        <th>Day</th>
                        <th>Current Week</th>
                        <th>Last Week</th>
                        <th>Previous Week</th>
                      </tr>
                    </thead>
                    <tbody>
                      {weeklySales.map((row) => (
                        <tr key={row.sales_order_id}>
                          <td>{row.day}</td>
                          <td>{row.currentWeek}</td>
                          <td>{row.lastWeek}</td>
                          <td>{row.previousWeek}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            {/* Recent Sales Invoices */}
            <Col md="6">
  <Card className="shadow-sm mb-4 h-100">
    <CardHeader className="bg-white d-flex flex-column justify-content-between">
      <h5 className="mb-0">Recent Sales Invoices</h5>
      <div className="d-flex align-items-center">
        <FaChartBar size={24} color="#007bff" className="me-2" />
        <div>
          <strong>Total Sales: </strong>${salestotalvalue.totalSales}
        </div>
      </div>
      <div className="d-flex align-items-center mt-2">
        <FaMoneyBillWave size={24} color="#28a745" className="me-2" />
        <div>
          <strong>Total Outstanding: </strong>${salestotalvalue.totalOutstanding}
        </div>
      </div>
    </CardHeader>
                <CardBody>
                  <Table bordered responsive>
                    <thead className="table-light">
                      <tr>
                        <th>Date</th>
                        <th>Invoice No</th>
                        <th>Customer</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentInvoices.length > 0 ? (
                        recentInvoices.map((inv) => (
                          <tr key={inv.invoice_id}>
                            <td>{inv.date}</td>
                            <td>{inv.invoiceNo}</td>
                            <td>{inv.customer}</td>
                            <td>{inv.amount}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4">No invoices found for today.</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>

            {/* Recent Sales Orders */}
            <Col md="6">
              <Card className="shadow-sm mb-4 h-100">
                <CardHeader className="bg-white">
                  <h5 className="mb-0">Recent Sales Orders</h5>
                </CardHeader>
                <CardBody>
                  <Table bordered responsive>
                    <thead className="table-light">
                      <tr>
                        <th>Date</th>
                        <th>Invoice No</th>
                        <th>Customer</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.sales_order_id}>
                          <td>{order.date}</td>
                          <td>{order.invoiceNo}</td>
                          <td>{order.customer}</td>
                          <td>{order.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </TabPane>

        {/* Other Tabs */}
        <TabPane tabId="2">
          <h5>Sales Tab Content</h5>
        </TabPane>
        <TabPane tabId="3">
          <h5>Purchase Tab Content</h5>
        </TabPane>
        <TabPane tabId="4">
          <h5>Finance Tab Content</h5>
        </TabPane>
      </TabContent>
    </div>
  );
};

export default Dashboard;