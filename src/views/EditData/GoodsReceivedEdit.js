/*eslint-disable*/
// import React, { useState } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Form,
//   FormGroup,
//   Label,
//   Input,
//   Table,
//   Button,
// } from "reactstrap";
// import "bootstrap/dist/css/bootstrap.min.css";

// const GoodsReceivePage = () => {
//   const [products, setProducts] = useState([
//     { productCode: "", productName: "", cartonQty: 0, looseQty: 0, price: 0, discount: 0, grossTotal: 0 },
//   ]);

//   const addProductRow = () => {
//     setProducts([...products, { productCode: "", productName: "", cartonQty: 0, looseQty: 0, price: 0, discount: 0, grossTotal: 0 }]);
//   };

//   const handleProductChange = (index, field, value) => {
//     const updatedProducts = [...products];
//     updatedProducts[index][field] = value;
//     setProducts(updatedProducts);
//   };

//   return (
//     <Container fluid className="p-4">
//       <h4>Add/Edit Goods Receive</h4>
//       <Form>
//         <Row className="mb-4">
//           <Col md={6}>
//             <FormGroup>
//               <Label for="tranNo">Tran No</Label>
//               <Input type="text" id="tranNo" disabled value="GRA202502-000024" />
//             </FormGroup>
//           </Col>
//           <Col md={6}>
//             <FormGroup>
//               <Label for="tranDate">Tran Date</Label>
//               <Input type="date" id="tranDate" value="2025-02-05" />
//             </FormGroup>
//           </Col>
//         </Row>

//         <Row>
//           <Col md={6}>
//             <h5>Supplier</h5>
//             <FormGroup>
//               <Label for="supplierCode">Supplier Code</Label>
//               <Input type="text" id="supplierCode" value="00002" />
//             </FormGroup>
//             <FormGroup>
//               <Label for="supplierName">Supplier Name</Label>
//               <Input type="text" id="supplierName" value="ALIN FOOD PRODUCT LIMITED" />
//             </FormGroup>
//             <FormGroup>
//               <Label for="invoiceDate">Invoice Date</Label>
//               <Input type="date" id="invoiceDate" value="2025-02-04" />
//             </FormGroup>
//             <FormGroup>
//               <Label for="remarks">Remarks</Label>
//               <Input type="textarea" id="remarks" />
//             </FormGroup>
//           </Col>

//           <Col md={6}>
//             <h5>Contact Details</h5>
//             <FormGroup>
//               <Label for="address1">Contact Address 1</Label>
//               <Input type="text" id="address1" value="RAHMANIA INT. COMPLEX (11TH FLOOR)" />
//             </FormGroup>
//             <FormGroup>
//               <Label for="country">Country/Postal</Label>
//               <Row>
//                 <Col md={8}>
//                   <Input type="text" id="country" value="BANGLADESH" />
//                 </Col>
//                 <Col md={4}>
//                   <Input type="text" id="postal" />
//                 </Col>
//               </Row>
//             </FormGroup>
//             <FormGroup>
//               <Label for="invoiceNo">Invoice No</Label>
//               <Input type="text" id="invoiceNo" value="1" />
//             </FormGroup>
//           </Col>
//         </Row>

//         <h5 className="mt-4">Product Details</h5>
//         <Table bordered responsive>
//           <thead>
//             <tr>
//               <th>S No</th>
//               <th>Product Code</th>
//               <th>Product Name</th>
//               <th>Carton Qty</th>
//               <th>Loose Qty</th>
//               <th>Price</th>
//               <th>Total</th>
//               <th>% Discount</th>
//               <th>Gross Total</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {products.map((product, index) => (
//               <tr key={index}>
//                 <td>{index + 1}</td>
//                 <td>
//                   <Input
//                     type="text"
//                     value={product.productCode}
//                     onChange={(e) => handleProductChange(index, "productCode", e.target.value)}
//                   />
//                 </td>
//                 <td>
//                   <Input
//                     type="text"
//                     value={product.productName}
//                     onChange={(e) => handleProductChange(index, "productName", e.target.value)}
//                   />
//                 </td>
//                 <td>
//                   <Input
//                     type="number"
//                     value={product.cartonQty}
//                     onChange={(e) => handleProductChange(index, "cartonQty", e.target.value)}
//                   />
//                 </td>
//                 <td>
//                   <Input
//                     type="number"
//                     value={product.looseQty}
//                     onChange={(e) => handleProductChange(index, "looseQty", e.target.value)}
//                   />
//                 </td>
//                 <td>
//                   <Input
//                     type="number"
//                     value={product.price}
//                     onChange={(e) => handleProductChange(index, "price", e.target.value)}
//                   />
//                 </td>
//                 <td>{product.cartonQty * product.price}</td>
//                 <td>
//                   <Input
//                     type="number"
//                     value={product.discount}
//                     onChange={(e) => handleProductChange(index, "discount", e.target.value)}
//                   />
//                 </td>
//                 <td>{(product.cartonQty * product.price) - product.discount}</td>
//                 <td>
//                   <Button color="danger" size="sm">Delete</Button>
//                 </td>
//               </tr>
//             ))}
//             <tr>
//               <td colSpan="10">
//                 <Button color="primary" size="sm" onClick={addProductRow}>
//                   + Add Product
//                 </Button>
//               </td>
//             </tr>
//           </tbody>
//         </Table>

//         <Row className="mt-3">
//           <Col md={6}></Col>
//           <Col md={6} className="text-right">
//             <Button color="primary">Save</Button>
//             <Button color="secondary" className="ml-2">Cancel</Button>
//           </Col>
//         </Row>
//       </Form>
//     </Container>
//   );
// };

// export default GoodsReceivePage;
import React, { useState } from 'react';
import { Row, Col, Card, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, Table, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import classnames from 'classnames';

const GoodsReceivePage = () => {
  const [activeTab, setActiveTab] = useState('1');

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <div className="container mt-4">
      <Card>
        <CardBody>
          <h3>Add/Edit Goods Receive</h3>
          <Form>
            <Row className="mb-3">
              <Col md="6">
                <FormGroup>
                  <Label for="tranNo">Tran No</Label>
                  <Input type="text" id="tranNo" />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="tranDate">Tran Date</Label>
                  <Input type="date" id="tranDate" />
                </FormGroup>
              </Col>
            </Row>
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === '1' })}
                  onClick={() => toggleTab('1')}
                >
                  Supplier
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === '2' })}
                  onClick={() => toggleTab('2')}
                >
                  Currency
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={activeTab} className="mt-3">
              <TabPane tabId="1">
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label for="supplierCode">Supplier Code</Label>
                      <Input type="text" id="supplierCode" />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label for="supplierName">Supplier Name</Label>
                      <Input type="text" id="supplierName" />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label for="contactPerson">Contact Person</Label>
                      <Input type="text" id="contactPerson" />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label for="remarks">Remarks</Label>
                      <Input type="text" id="remarks" />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label for="invoiceDate">Invoice Date</Label>
                      <Input type="date" id="invoiceDate" />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label for="deliveryDate">Delivery Date</Label>
                      <Input type="date" id="deliveryDate" />
                    </FormGroup>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId="2">
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label for="currency">Currency</Label>
                      <Input type="text" id="currency" />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label for="exchangeRate">Exchange Rate</Label>
                      <Input type="number" id="exchangeRate" />
                    </FormGroup>
                  </Col>
                </Row>
              </TabPane>
            </TabContent>

            <h4 className="mt-4">Products</h4>
            <Table bordered responsive>
              <thead>
                <tr>
                  <th>S No</th>
                  <th>Product Code</th>
                  <th>Product Name</th>
                  <th>Carton Qty</th>
                  <th>Loose Qty</th>
                  <th>Qty</th>
                  <th>Carton Price</th>
                  <th>Price</th>
                  <th>Total</th>
                  <th>% Discount</th>
                  <th>Gross Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td><Input type="text" /></td>
                  <td><Input type="text" /></td>
                  <td><Input type="number" /></td>
                  <td><Input type="number" /></td>
                  <td><Input type="number" /></td>
                  <td><Input type="number" /></td>
                  <td><Input type="number" /></td>
                  <td><Input type="number" /></td>
                  <td><Input type="number" /></td>
                  <td><Input type="number" /></td>
                  <td>
                    <Button color="info" size="sm">Info</Button>{' '}
                    <Button color="danger" size="sm">Delete</Button>
                  </td>
                </tr>
              </tbody>
            </Table>

            <h5>Summary</h5>
            <Row className="mt-3">
              <Col md="3">
                <FormGroup>
                  <Label for="uom">Uom</Label>
                  <Input type="text" id="uom" disabled value="Pieces/Carton: 0" />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label for="purchaseUnitCost">Purchase Unit Cost</Label>
                  <Input type="number" id="purchaseUnitCost" disabled value="0.00" />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label for="wholesalePrice">Wholesale Price</Label>
                  <Input type="number" id="wholesalePrice" disabled value="0.00" />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label for="cartonPrice">Carton Price</Label>
                  <Input type="number" id="cartonPrice" disabled value="0.00" />
                </FormGroup>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col md="3">
                <FormGroup>
                  <Label for="billDiscount">Bill Discount ($)</Label>
                  <Input type="number" id="billDiscount" />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label for="totalProduct">Total Product</Label>
                  <Input type="number" id="totalProduct" disabled value="0" />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label for="subTotal">Sub Total ($)</Label>
                  <Input type="number" id="subTotal" disabled value="0" />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label for="netTotal">Net Total ($)</Label>
                  <Input type="number" id="netTotal" disabled value="0" />
                </FormGroup>
              </Col>
            </Row>

            <Button color="secondary" className="me-2 mt-3">Cancel</Button>
            <Button color="primary" className="mt-3">Save</Button>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};

export default GoodsReceivePage;
