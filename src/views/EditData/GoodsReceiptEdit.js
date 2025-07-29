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

/*eslint-disable*/
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Form,
  FormGroup,
  Input,
  Table,
  Button,
} from "reactstrap";
import classnames from "classnames";
import { useParams } from "react-router-dom";
import Select from "react-select";
import message from '../../components/Message';
import { FaTrashAlt, FaPlusCircle } from "react-icons/fa";
import api from "../../constants/api";

const PurchaseOrderPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("1");
  const [supplierData, setSupplierData] = useState({});
  const [products, setProducts] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [formData, setFormData] = useState({
    tran_no: "",
    tran_date: "",
    supplier_code: "",
    supplier_id: "",
    contact_person: "",
    contact_address1: "",
    contact_address2: "",
    contact_address3: "",
    country: "",
    remarks: "",
    req_delivery_date: "",
    postal_code: "",
    sub_total:"",
    net_total:"",
     tax_percent:"",
      tax_amount:"",
      invoice_date:"",
      invoice_no:"",
      delivery_date:"",
      do_no:""
  });
 const [currency, setCurrency] = useState({
    currency_code: "",
    currency_rate: "",
    currency_name: "",
  });
  const [supplierOptions, setSupplierOptions] = useState([]);
  const [rows, setRows] = useState([
    {
      product_code: "",
      product_name: "",
      carton_qty: 0,
      loose_qty: 0,
      carton_price: 0,
      qty: 0,
      price: 0,
      total: 0,
      discount: 0,
      total_price: 0,
    },
  ]);

  useEffect(() => {
    // Fetch supplier form data
    api.get("/api/supplier-info").then((response) => {
      setSupplierData(response.data);
    });

    // Fetch table data
    api.get("/api/supplier-products").then((response) => {
      setTableData(response.data);
    });

    // Fetch supplier options for dropdown
    api.get("/supplier/getSupplier").then((response) => {
      setSupplierOptions(response.data.data);
    });
    api.get("/product/getProducts").then((response) => {
      setProducts(response.data.data);
      console.log('productselects',response.data.data)
    });
    
    // Fetch table data
    api.post("/purchaseorder/getcsproductLineItemById",{goods_receipt_id:id}).then((response) => { 
      setRows(response.data.data);
      setTableData(response.data.data);
    });

    // Fetch supplier options for dropdown
    api.post("/purchaseorder/getGoodsReceiptById",{goods_receipt_id:id}).then((response) => {
      setFormData(response.data.data);
    });
  
    api.post("/currency/getCuerrencyByGoodsReceiptId",{goods_receipt_id:id}).then((response) => {
      setCurrency(response.data.data[0]);
    });

  }, []);

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };
// Function to calculate total for a row
const calculateRowTotal = (row) => {
  const total = row.carton_qty * row.carton_price + row.loose_qty * row.price;
  const total_price = total - (total * (row.discount / 100));
  return { ...row, total, total_price };
};

// Update totals on initial render and when rows change
useEffect(() => {
  setRows((prevRows) => prevRows.map(calculateRowTotal));
}, []);
  const handleCurrencyChange = (e) => {
    const { name, value } = e.target;
    setCurrency((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log(currency,'currency');
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log(formData,'formdata');
  };
  const getColumnSum = (key) => {
    return rows.reduce((sum, row) => sum + (parseFloat(row[key]) || 0), 0);
  };
  
  
    // Handle product selection
    const handleProductSelect = (index, selectedProduct) => {
      const updatedRows = [...rows];
      updatedRows[index].product_id = selectedProduct.product_id;
      updatedRows[index].product_code = selectedProduct.product_code;
      updatedRows[index].product_name = selectedProduct.product_name;
      setRows(updatedRows);
    };
  // Handle form submit (example API call structure)
  const handleSubmit = async () => {
    formData.sub_total=rows.reduce((sum, row) => sum + row.total_price, 0).toFixed(2);
    formData.tax_amount=parseFloat(sub_total *0.09.toFixed(2));
    
    formData.net_total=(
      Number(rows.reduce((sum, row) => sum + row.total_price, 0)) +
      Number((rows.reduce((sum, row) => sum + row.total_price, 0) * 0.09).toFixed(2))
    ).toFixed(2);
    api
    .post('/purchaseorder/editGoodsReceipt', formData)
    .then(() => {
      api
      .post('/currency/editGoodsCurrency', currency) 
      .then(() => {})
      
      rows?.forEach((el)=>{
       
        api
      .post('/purchaseorder/editGrProduct', el) 
      .then(() => {
        message('Record edited successfully.', 'success'); })})
     
      setTimeout(() => {
        // navigate(`/EnquiryEdit/${insertedDataId}`);
      }, 300);
    })
    .catch(() => {
      message('Network connection error.', 'error');
    });
  };

  const handleRowChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    // if (field === "discount_percentage") {
    //   updatedRows[index]["discount_amount"] = ((updatedRows[index].total * value) / 100).toFixed(2);
    // }
  
    if (field === "product_code") {
      // Find the product by code from the fetched product data
      const product = tableData.find(item => item.product_code === value);
      if (product) {
        updatedRows[index].product_name = product.product_name;
        updatedRows[index].carton_price = product.carton_price;
        updatedRows[index].qty = 0;
        updatedRows[index].loose_qty = 0;
        updatedRows[index].carton_qty = 0;
        updatedRows[index].discount = 0;
        updatedRows[index].total = 0;
        updatedRows[index].total_price = 0;
      } else {
        updatedRows[index].product_name = "";
        updatedRows[index].carton_price = 0;
      }
    }
  
    if (["carton_qty", "carton_price", "qty","loose_qty", "price","discount"].includes(field)) {
      const cartonTotal = updatedRows[index].carton_qty * updatedRows[index].carton_price;
      const looseTotal = updatedRows[index].loose_qty * (updatedRows[index].carton_price / 12);
      const Total = updatedRows[index].qty * updatedRows[index].price;
      const grossTotal = cartonTotal + looseTotal + Total;
      const finalTotal = grossTotal - (updatedRows[index].discount ||0);
  
      updatedRows[index].qty = updatedRows[index].carton_qty + updatedRows[index].loose_qty;
      updatedRows[index].total = parseFloat(grossTotal.toFixed(2));
      updatedRows[index].total_price = parseFloat(finalTotal.toFixed(2));
    }
  
    setRows(updatedRows);
    console.log('rows',updatedRows);
  };
  
  console.log('rows',rows);
  console.log('formdata',formData);
  const deleteRow = (index) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, i) => i !== index));
    }
  };

  const addRow = () => {
    setRows([
      ...rows,
      {
        product_code: "",
        product_name: "",
        carton_qty: 0,
        loose_qty: 0,
        carton_price: 0,
        qty: 0,
        price: 0,
        discount: 0,
        total_price: 0,
      },
    ]);
  };
  return (
    <Container className="mt-4">
      <h2>Add/Edit Goods Receipt</h2>
      <Row>
      <Col md="6">
          <FormGroup>
            <label>Tran No</label>
            <Input
              type="text"
              placeholder="Enter Tran No"
              name="tran_no"
              value={formData.tran_no}
              onChange={handleChange}
              
            />
          </FormGroup>
        </Col>
        <Col md="6">
          <FormGroup>
            <label>Tran Date</label>
            <Input
              type="date"
              
              name="tran_date"
              value={formData.tran_date}
              onChange={handleChange}
              
            />
            
          </FormGroup>
        </Col>
        </Row>
      <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "1" })}
            onClick={() => toggleTab("1")}
          >
            Supplier
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "2" })}
            onClick={() => toggleTab("2")}
          >
            Currency
          </NavLink>
        </NavItem>
      </Nav>

      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
        <Form className="mt-3">
      <Row>
        <Col md="6">
          <FormGroup>
            <label>Supplier Code</label>
            <Input
              type="text"
              placeholder="Enter supplier code"
              name="supplier_code"
              value={formData.supplier_code}
              onChange={handleChange}
              
            />
          </FormGroup>
        </Col>
        <Col md="6">
          <FormGroup>
            <label>Supplier Name</label>
            <Input
              type="select"
              name="supplier_id"
              value={formData.supplier_id}
              onChange={handleChange}
            >
              <option value="">Select Supplier</option>
              {supplierOptions.map((supplier, index) => (
                <option key={index} value={supplier.supplier_id}>
                  {supplier.company_name}
                </option>
              ))}
            </Input>
          </FormGroup>
        </Col>
        <Col md="6">
          <FormGroup>
            <label>Contact Person</label>
            <Input
              type="text"
              placeholder="Enter contact person"
              name="contact_person"
              value={formData.contact_person}
              onChange={handleChange}
              
            />
          </FormGroup>
        </Col>
        <Col md="6">
          <FormGroup>
            <label>Contact Address1</label>
            <Input
              type="text"
              placeholder="Enter contact address"
              name="contact_address1"
              value={formData.contact_address1}
              onChange={handleChange}
              
            />
          </FormGroup>
        </Col>
        <Col md="6">
          <FormGroup>
            <label>Contact Address2</label>
            <Input
              type="text"
              placeholder="Enter contact address"
              name="contact_address2"
              value={formData.contact_address2}
              onChange={handleChange}
              
            />
          </FormGroup>
        </Col>
        <Col md="6">
          <FormGroup>
            <label>Contact Address3</label>
            <Input
              type="text"
              placeholder="Enter contact address"
              name="contact_address3"
              value={formData.contact_address3}
              onChange={handleChange}
              
            />
          </FormGroup>
        </Col>
        <Col md="6">
          <FormGroup>
            <label>Country/Postal Code</label>
            <Row>
            <Col md="5">
            <Input
              type="text"
              placeholder="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
            
            /></Col>
              <Col md="5">
            <Input
              type="text"
              placeholder="Postal code"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleChange}
            
            /></Col>
            </Row>
          </FormGroup>
        </Col>
        <Col md="6">
          <FormGroup>
            <label>Remarks</label>
            <Input
              type="textarea"
              name="remarks"
              placeholder="Remarks"
              value={formData.remarks}
              onChange={handleChange}
            />
          </FormGroup>
        </Col>
        <Col md="6">
          <FormGroup>
            <label>Delivery Date</label>
            <Input
              type="date"
              name="delivery_date"
              value={formData.delivery_date}
              onChange={handleChange}
            />
          </FormGroup>
        </Col>
        <Col md="6">
          <FormGroup>
            <label>Invoice Date</label>
            <Input
              type="date"
              placeholder=""
              name="invoice_date"
              value={formData.invoice_date}
              onChange={handleChange}
              
            />
          </FormGroup>
        </Col>
        <Col md="6">
          <FormGroup>
            <label>Invoice No</label>
           
            <Input
              type="text"
              placeholder="invoice_no"
              name="invoice_no"
              value={formData.invoice_no}
              onChange={handleChange}
            
            />
              
           
          </FormGroup>
        </Col>
        <Col md="6">
          <FormGroup>
            <label>Delivery Date</label>
            <Input
              type="date"
              name="delivery_date"
              placeholder="delivery_date"
              value={formData.delivery_date}
              onChange={handleChange}
            />
          </FormGroup>
        </Col>
        <Col md="6">
          <FormGroup>
            <label> Delivery No</label>
            <Input
              type="text"
              name="do_no"
              value={formData.do_no}
              onChange={handleChange}
            />
          </FormGroup>
        </Col>
      </Row>
     
    </Form>
        </TabPane>

        <TabPane tabId="2">
      
            <Form className="mt-3">
                      <Row>
                        <Col md="6">
                          <FormGroup>
                            <label>Currency Code</label>
                            <Input type="text" placeholder="Enter Currency code" name="currency_code" value={currency?.currency_code || ""}  onChange={handleCurrencyChange}/>
                          </FormGroup>
                        </Col>
                        <Col md="6">
                          <FormGroup>
                            <label>Currency Name</label>
                            <Input type="text" name="currency_name" value={currency?.currency_name || ""} onChange={handleCurrencyChange}>
                            
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col md="6">
                          <FormGroup>
                            <label>Currency Rate</label>
                            <Input type="text" placeholder="Enter Currency Rate " name="currency_rate" value={currency?.currency_rate || ""} 
                            onChange={handleCurrencyChange}/>
                          </FormGroup>
                        </Col> 
                       
                      </Row>
                    </Form>
        
        </TabPane>
      </TabContent>

      <h4 className="mt-4">Products</h4>
      <Table bordered>
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
            <th>Discount</th>
            <th>Gross Total </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
              <Select
                options={products.map((p) => ({
                  value: p.product_id,
                  label: `${p.product_code} - ${p.product_name}`,
                  ...p,
                }))}
                value={products.find((p) => p.product_id === row.product_id) || null} 
                onChange={(selectedOption) => handleProductSelect(index, selectedOption)}
                placeholder="Select Product"
              />
              </td>
              <td>
                <Input
                  type="text"
                  value={row.product_name}
                  onChange={(e) => handleRowChange(index, "product_name", e.target.value)}
                />
              </td>
              <td>
                <Input
                  type="number"
                  value={row.carton_qty}
                  onChange={(e) => handleRowChange(index, "carton_qty", parseInt(e.target.value) || 0)}
                />
              </td>
              <td>
                <Input
                  type="number"
                  value={row.loose_qty}
                  onChange={(e) => handleRowChange(index, "loose_qty", parseInt(e.target.value) || 0)}
                />
              </td>
              <td>
              <Input
                  type="number"
                  value={row.qty}
                  onChange={(e) => handleRowChange(index, "qty", parseInt(e.target.value) || 0)}
                />
              </td>
              <td>
                <Input
                  type="number"
                  value={row.carton_price}
                  onChange={(e) => handleRowChange(index, "carton_price", parseFloat(e.target.value) || 0)}
                />
              </td>
              <td>
              <Input
                  type="number"
                  value={row.price}
                  onChange={(e) => handleRowChange(index, "price", parseFloat(e.target.value) || 0)}
                />
              </td>
              <td>{row.total?.toFixed(2)}</td>
              <td>
                <Input
                  type="number"
                  value={row.discount}
                  onChange={(e) => handleRowChange(index, "discount", parseFloat(e.target.value) || 0)}
                />
                 {/* <Input
    type="number"
    value={row.discount_percentage || ""}
    onChange={(e) => handleRowChange(index, "discount_percentage", parseFloat(e.target.value) || 0)}
    placeholder="%"
  />

  <Input
    type="number"
    value={((row.total_price * (row.discount_amount || 0)) / 100).toFixed(2)}
    readOnly
    placeholder="Discount Amount"
  /> */}
              </td>
              <td>{row.total_price?.toFixed(2)}</td>
              <td>
                <FaTrashAlt
                  style={{ color: "red", cursor: "pointer", marginRight: "10px" }}
                  onClick={() => deleteRow(index)}
                />
                <FaPlusCircle
                  style={{ color: "green", cursor: "pointer" }}
                  onClick={addRow}
                />
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
  <tr>
    <td colSpan={3} style={{ fontWeight: "bold" }}>Summary:</td>
    <td>{getColumnSum("carton_qty")}</td>
    <td>{getColumnSum("loose_qty")}</td>
    <td>{getColumnSum("qty")}</td>
    <td>{getColumnSum("carton_price").toFixed(2)}</td>
    <td>{getColumnSum("price").toFixed(2)}</td>
    <td>{getColumnSum("discount").toFixed(2)}</td>
    <td>{getColumnSum("total_price").toFixed(2)}</td>
    <td></td> {/* Empty cell for actions */}
  </tr>
</tfoot>

      </Table>
      <Row className="p-2 border bg-light">
        <Col><strong>UOM:</strong> {rows.length > 0 ? rows[0].uom || "-" : "-"}</Col>
        <Col><strong>Pieces/Carton:</strong> {rows.length > 0 ? rows[0]?.pieces_per_carton || 0 : "0.00"}</Col>
        <Col><strong>Purchase Unit Cost:</strong> {rows.length > 0 ? rows[0]?.purchase_unit_cost?.toFixed(2) || "0.00" : "0.00"}</Col>
        <Col><strong>Wholesale Price:</strong> {rows.length > 0 ? rows[0]?.wholesale_price?.toFixed(2) || "0.00" : "0.00"}</Col>
        {/* <Col><strong>Carton Price:</strong> {rows.length > 0 ? rows[0]?.carton_price?.toFixed(2) || "0.00" : "0.00"}</Col> */}
        <Col><strong>CQty:</strong> {rows.length > 0 ? rows[0]?.carton_qty || "0" : "0.00"}</Col>
        <Col><strong>Qty On Hand:</strong> {rows.length > 0 ? rows[0]?.qty_on_hand || 0 : "0.00"}</Col>
      </Row>

      <Row className="p-2 mt-3 border">
        <Col>
          <strong>Bill Discount:</strong>
          <Input
            type="number"
            className="ms-2"
            value={rows.billDiscount}
            onChange={(e) => setBillDiscount(parseFloat(e.target.value) || 0)}
            style={{ width: "100px", display: "inline-block" }}
          />
        </Col>
        <Col><strong>Total Products:</strong> {rows.length}</Col>
        <Col><strong>Sub Total (USD):</strong> ${rows.reduce((sum, row) => sum + row.total_price, 0).toFixed(2)}</Col>
        <Col><strong>Tax (USD):</strong> ${ (rows.reduce((sum, row) => sum + row.total_price, 0) * 0.09).toFixed(2) }</Col>
        <Col><strong>Net Total (USD):</strong> $
  {(
    Number(rows.reduce((sum, row) => sum + row.total_price, 0)) +
    Number((rows.reduce((sum, row) => sum + row.total_price, 0) * 0.09).toFixed(2))
  ).toFixed(2)}</Col>
      </Row>

      <div className="mt-4">
        {/* <h5>Summary:</h5>
        <p>Total Products: {rows.length}</p>
        <p>Total Amount: ${rows.reduce((sum, row) => sum + row.total_price, 0).toFixed(2)}</p> */}
        <Button color="success" onClick={handleSubmit} >Save</Button>
        <Button color="secondary" className="ms-2">
          Print
        </Button>
        <Button color="danger" className="ms-2">
          Cancel
        </Button>
      </div>
    </Container>
  );
};

export default PurchaseOrderPage;
