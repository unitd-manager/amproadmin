import React, { useEffect, useState } from 'react';
import * as Icon from 'react-feather';
import { Button } from 'reactstrap';
import { Link, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import $ from 'jquery';
import 'datatables.net-buttons/js/buttons.colVis';
import 'datatables.net-buttons/js/buttons.flash';
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.print';
import api from '../../constants/api';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import CommonTable from '../../components/CommonTable';



const SectionDetails = () => {
  //Const Variables
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(false);

  // Navigation and Parameter Constants
  const { id } = useParams();

  // get section
  const getSection = () => {
    api
      .get('/product/getProductAdmin')
      .then((res) => {
        setSection(res.data.data);
    
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    setTimeout(() => {
      $('#example').DataTable({
        pagingType: 'full_numbers',
        pageLength: 20,
        processing: true,
        dom: 'Bfrtip',
        buttons: [
          {
            extend: 'print',
            text: 'Print',
            className: 'shadow-none btn btn-primary',
          },
        ],
      });
    }, 1000);

    getSection();
  }, [id]);

  

  const columns = [
    {
      name: '#',
      selector: 'id',
      grow: 0,
      wrap: true,
      width: 'auto',
    },
    {
      name: 'Edit',
      selector: 'edit',
      cell: () => <Icon.Edit2 />,
      grow: 0,
      width: 'auto',
      button: true,
      sortable: false,
    },
    {
      name: 'Product Code',
      selector: 'product_code',
      sortable: true,
      grow: 1,
      wrap: true,
      width: 'auto',
    },
    {
      name: 'Product Name',
      selector: 'title',
      sortable: true,
      grow: 2,
      wrap: true,
      width: 'auto',
    },
    {
      name: 'Department',
      selector: 'department_name ',
      sortable: true,
      grow: 1,
      width: 'auto',
    },
    {
      name: 'Product Name2',
      selector: 'alternative_product_name ',
      sortable: true,
      grow: 1,
      width: 'auto',
    },
    {
      name: 'UOM',
      selector: 'unit',
      sortable: true,
      width: 'auto',
      grow: 1,
    },
    {
      name: 'Part No',
      selector: 'part_number',
      sortable: true,
      grow: 1,
      width: 'auto',
    },
    {
      name: 'Unit Cost',
      selector: 'purchase_unit_cost ',
      sortable: true,
      grow: 1,
      width: 'auto',
    },
    {
      name: 'Retail Price',
      selector: 'published',
      sortable: true,
      grow: 1,
      width: 'auto',
    },
    {
      name: 'Ecommerce Price',
      selector: 'ecommerce_price',
      sortable: true,
      grow: 1,
      width: 'auto',
    },
    {
      name: 'Wholesale Price',
      selector: 'wholesale_price',
      sortable: true,
      grow: 1,
      width: 'auto',
    },
    {
      name: 'Carton Price',
      selector: 'carton_price',
      sortable: true,
      grow: 1,
      width: 'auto',
    },
    {
      name: 'Carton Qty',
      selector: 'carton_qty',
      sortable: true,
      grow: 1,
      width: 'auto',
    },
    {
      name: 'Loose Qty',
      selector: 'loose_qty',
      sortable: true,
      grow: 1,
      width: 'auto',
    },
    {
      name: 'Quantity',
      selector: 'qty_in_stock',
      sortable: true,
      width: 'auto',
    },
  ];
  
  
  return (
    <div className="MainDiv">
      <div className=" pt-xs-25">
        <BreadCrumbs />
        {/* Section Add new button */}

        <CommonTable
          loading={loading}
          title="Product List"
          Button={
            <Link to="/ProductDetails">
              <Button color="primary" className="shadow-none">
                Add New
              </Button>
            </Link>
          }
        >
          <thead>
            <tr>
              {columns.map((cell) => {
                return <td key={cell.name}>{cell.name}</td>;
              })}
            </tr>
          </thead>
          <tbody>
            {section &&
              section.map((element, index) => {
                return (
                  <tr key={element.product_id}>
                    <td>{index + 1}</td>
                    <td>
                      <Link to={`/ProductEdit/${element.product_id}/?tab=1`}>
                        <Icon.Edit2 />
                      </Link>
                    </td>
                    
                    <td>
                    <Link to={`/ProductEdit/${element.product_id}/?tab=1`}>
                      {element.product_code}
                      </Link>
                    </td>
                    <td>{element.title}</td>
                    <td>{element.department_name}</td>
                    <td>{element.alternative_product_name}</td> 
                    <td>{element.unit}</td>
                    <td>{element.part_number}</td>
                    <td>{element.purchase_unit_cost }</td>
                    <td>{element.retail_price}</td>
                    <td>{element.ecommerce_price}</td> 
                    <td>{element.wholesale_price}</td>
                    <td>{element.carton_price}</td>
                    <td>{element.carton_qty}</td>
                    <td>{element.loose_qty}</td>
                    <td>{element.qty_in_stock}</td> 
                    {/* <td>
                      <Publish
                        idColumn="product_id"
                        tablename="product"
                        idValue={element.product_id.toString()}
                        value={element.published}
                      ></Publish>
                    </td> */}
                    {/* <td>
                      <SortOrder
                        idValue={element.product_id}
                        idColumn="product_id"
                        tablename="section"
                        value={element.sort_order}
                      ></SortOrder>
                    </td> */}
                  </tr>
                );
              })}
          </tbody>
        </CommonTable>
        {/* setion table */}
      </div>
    </div>
  );
};

export default SectionDetails;
// import React, { useState } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   CardBody,
//   Table,
//   Button,
//   Form,
//   FormGroup,
//   Label,
//   Input,
//   Nav,
//   NavItem,
//   NavLink,
//   TabContent,
//   TabPane
// } from "reactstrap";
// import classnames from "classnames";

// const PurchaseOrderPage = () => {
//   const [activeTab, setActiveTab] = useState("1");

//   const toggleTab = (tab) => {
//     if (activeTab !== tab) {
//       setActiveTab(tab);
//     }
//   };

//   return (
//     <Container fluid className="p-4">
//       {/* Page Header */}
//       <Row className="mb-4">
//         <Col md={12} className="text-center">
//           <h3>Add/Edit Purchase Order</h3>
//         </Col>
//       </Row>

//       {/* Transaction Info */}
//       <Row className="mb-3">
//         <Col md={6}>
//           <FormGroup>
//             <Label>Tran No</Label>
//             <Input type="text" value="PO202501-000019" readOnly />
//           </FormGroup>
//         </Col>
//         <Col md={6}>
//           <FormGroup>
//             <Label>Tran Date</Label>
//             <Input type="date" value="2025-01-20" />
//           </FormGroup>
//         </Col>
//       </Row>

//       {/* Tabs for Supplier and Currency Info */}
//       <Nav tabs>
//         <NavItem>
//           <NavLink
//             className={classnames({ active: activeTab === "1" })}
//             onClick={() => toggleTab("1")}
//           >
//             Supplier
//           </NavLink>
//         </NavItem>
//         <NavItem>
//           <NavLink
//             className={classnames({ active: activeTab === "2" })}
//             onClick={() => toggleTab("2")}
//           >
//             Currency
//           </NavLink>
//         </NavItem>
//       </Nav>

//       <TabContent activeTab={activeTab} className="mt-3">
//         <TabPane tabId="1">
//           <Row>
//             <Col md={6}>
//               <Card>
//                 <CardBody>
//                   <h5>Supplier</h5>
//                   <Form>
//                     <FormGroup>
//                       <Label>Supplier Code</Label>
//                       <Input type="text" value="00006" readOnly />
//                     </FormGroup>
//                     <FormGroup>
//                       <Label>Supplier Name</Label>
//                       <Input type="text" value="BOMBAY SWEETS $ CO LTD" readOnly />
//                     </FormGroup>
//                     <FormGroup>
//                       <Label>Contact Person</Label>
//                       <Input type="text" />
//                     </FormGroup>
//                     <FormGroup>
//                       <Label>Remarks</Label>
//                       <Input type="textarea" />
//                     </FormGroup>
//                     <FormGroup>
//                       <Label>Request Delivery Date</Label>
//                       <Input type="date" value="2025-01-19" />
//                     </FormGroup>
//                   </Form>
//                 </CardBody>
//               </Card>
//             </Col>

//             <Col md={6}>
//               <Card>
//                 <CardBody>
//                   <h5>Contact Information</h5>
//                   <Form>
//                     <FormGroup>
//                       <Label>Contact Address 1</Label>
//                       <Input type="text" value="KA-63 KURATTOLI P O & P S KHILKHET" />
//                     </FormGroup>
//                     <FormGroup>
//                       <Label>Contact Address 2</Label>
//                       <Input type="text" />
//                     </FormGroup>
//                     <FormGroup>
//                       <Label>Country/Postal</Label>
//                       <Input type="text" value="BANGLADESH" />
//                     </FormGroup>
//                     <FormGroup>
//                       <Label>Postal Code</Label>
//                       <Input type="text" value="1229" />
//                     </FormGroup>
//                   </Form>
//                   <Button color="primary" className="mt-3">Load Prod</Button>
//                 </CardBody>
//               </Card>
//             </Col>
//           </Row>
//         </TabPane>

//         <TabPane tabId="2">
//           <Card>
//             <CardBody>
//               <h5>Currency Information</h5>
//               <Form>
//                 <FormGroup>
//                   <Label>Currency Type</Label>
//                   <Input type="text" placeholder="Enter Currency Type" />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label>Exchange Rate</Label>
//                   <Input type="text" placeholder="Enter Exchange Rate" />
//                 </FormGroup>
//               </Form>
//             </CardBody>
//           </Card>
//         </TabPane>
//       </TabContent>

//       {/* Products Table */}
//       <Row className="mt-4">
//         <Col>
//           <Table bordered hover>
//             <thead>
//               <tr>
//                 <th>S No</th>
//                 <th>Product Code</th>
//                 <th>Product Name</th>
//                 <th>Carton Qty</th>
//                 <th>Loose Qty</th>
//                 <th>Qty</th>
//                 <th>Carton Price</th>
//                 <th>Price</th>
//                 <th>Total</th>
//                 <th>% Discount</th>
//                 <th>Gross Total</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td>1</td>
//                 <td>550062</td>
//                 <td>BOMBAY SWEETS POTATO CRACKERS 20G</td>
//                 <td>50</td>
//                 <td>0</td>
//                 <td>4000</td>
//                 <td>12.2988</td>
//                 <td>0.1524</td>
//                 <td>614.9400</td>
//                 <td>0</td>
//                 <td>614.9400</td>
//                 <td>
//                   <Button color="danger" size="sm">Delete</Button>
//                 </td>
//               </tr>
//               {/* Additional rows as needed */}
//             </tbody>
//           </Table>
//         </Col>
//       </Row>

//       {/* Summary Section */}
//       <Row className="mt-4">
//         <Col md={4}>
//           <FormGroup>
//             <Label>Bill Discount ($)</Label>
//             <Input type="text" value="0" />
//           </FormGroup>
//         </Col>
//         <Col md={8} className="text-end">
//           <p>Total Product: <strong>7</strong></p>
//           <p>Sub Total (USD): <strong>28341.26</strong></p>
//           <p>Net Total (USD): <strong>20463.00</strong></p>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default PurchaseOrderPage;
