
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
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { ToastContainer } from 'react-toastify';
import message from '../../components/Message';
import { FaTrashAlt, FaPlusCircle } from "react-icons/fa";
import api from "../../constants/api";

const PurchaseInvoiceEdit = () => {
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
      tax_amount:""
  });
 const [currency, setCurrency] = useState({
    currency_code: "",
    currency_rate: "",
    currency_name: "",
  });
  const [supplierOptions, setSupplierOptions] = useState([]);
  const [billDiscount, setBillDiscount] = useState(0);
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
const navigate=useNavigate();
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
    api.post("/purchaseorder/getPiProductByPurchaseInvoiceId",{purchase_invoice_id:id}).then((response) => { 
      setRows(response.data.data);
      setTableData(response.data.data);
    });

    // Fetch supplier options for dropdown
    api.post("/purchaseorder/getPurchaseInvoiceById",{purchase_invoice_id:id}).then((response) => {
      setFormData(response.data.data[0]);
    });
  
    api.post("/currency/getCuerrencyByPurchaseInvoiceId",{purchase_invoice_id:id}).then((response) => {
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
    formData.tax_amount=parseFloat(formData.sub_total *0.09.toFixed(2));
    
    formData.net_total=(
      Number(rows.reduce((sum, row) => sum + row.total_price, 0)) +
      Number((rows.reduce((sum, row) => sum + row.total_price, 0) * 0.09).toFixed(2))
    ).toFixed(2);
    api
    .post('/purchaseorder/editPurchaseInvoice', formData)
    .then(() => {
      api
      .post('/currency/editCurrency', currency) 
      .then(() => {})
      
      rows?.forEach((el)=>{
       
        api
      .post('/purchaseorder/editPiProduct', el) 
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
  const deleteRow = (index,id) => {
    if(id){
      api.post('/purchaseorder/deletePiProduct',{pi_product_id:id}).then(() => {
        message('Record deleted successfully.', 'success');
      }).catch(() => {
        message('Network connection error.', 'error');
      });
    }
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
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: '#f8f9fa'
    }}>
      <ToastContainer />
      
      {/* Fixed Header Section */}
      <div style={{ 
        flexShrink: 0, 
        backgroundColor: '#ffffff', 
        borderBottom: '1px solid #dee2e6', 
        padding: '8px 15px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h5 style={{ margin: '0 0 8px 0', color: '#2c3e50', fontSize: '16px' }}>Add/Edit Purchase Invoice</h5>
        <Row>
          <Col md="6">
            <FormGroup style={{ marginBottom: '5px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Tran No</label>
              <Input
                type="text"
                placeholder="Enter Tran No"
                name="tran_no"
                value={formData?.tran_no}
                onChange={handleChange}
                style={{ height: '32px', fontSize: '13px' }}
              />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup style={{ marginBottom: '10px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Tran Date</label>
              <Input
                type="date"
                name="tran_date"
                value={formData?.tran_date}
                onChange={handleChange}
                style={{ height: '32px', fontSize: '13px' }}
              />
            </FormGroup>
          </Col>
        </Row>
      </div>
      
      {/* Scrollable Middle Section */}
      <div style={{ 
        flex: 1, 
        overflow: 'auto', 
        padding: '8px 15px'
      }}>
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
        <Form className="mt-1">
      <Row className="g-1">
        <Col md="4">
          <FormGroup style={{ marginBottom: '8px' }}>
            <label style={{ fontSize: '11px', marginBottom: '2px' }}>Supplier Code</label>
            <Input
              type="text"
              placeholder="Enter supplier code"
              name="supplier_code"
              value={formData?.supplier_code}
              //onChange={handleChange}
               disabled
               style={{ fontSize: '10px', padding: '4px', height: '28px' }}
            />
          </FormGroup>
        </Col>
        <Col md="4">
          <FormGroup style={{ marginBottom: '8px' }}>
            <label style={{ fontSize: '11px', marginBottom: '2px' }}>Supplier Name</label>
            <Input
              type="select"
              name="supplier_id"
              value={formData?.supplier_id}
              onChange={handleChange}
              style={{ fontSize: '10px', padding: '4px', height: '28px' }}
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
        <Col md="4">
          <FormGroup style={{ marginBottom: '8px' }}>
            <label style={{ fontSize: '11px', marginBottom: '2px' }}>Contact Person</label>
            <Input
              type="text"
              placeholder="Enter contact person"
              name="contact_person"
              value={formData?.contact_person}
              onChange={handleChange}
              style={{ fontSize: '10px', padding: '4px', height: '28px' }}
            />
          </FormGroup>
        </Col>
        <Col md="4">
          <FormGroup style={{ marginBottom: '8px' }}>
            <label style={{ fontSize: '11px', marginBottom: '2px' }}>Contact Address1</label>
            <Input
              type="text"
              placeholder="Enter contact address"
              name="contact_address1"
              value={formData?.contact_address1}
              onChange={handleChange}
              style={{ fontSize: '10px', padding: '4px', height: '28px' }}
            />
          </FormGroup>
        </Col>
        <Col md="4">
          <FormGroup style={{ marginBottom: '8px' }}>
            <label style={{ fontSize: '11px', marginBottom: '2px' }}>Contact Address2</label>
            <Input
              type="text"
              placeholder="Enter contact address"
              name="contact_address2"
              value={formData?.contact_address2}
              onChange={handleChange}
              style={{ fontSize: '10px', padding: '4px', height: '28px' }}
            />
          </FormGroup>
        </Col>
        <Col md="4">
          <FormGroup style={{ marginBottom: '8px' }}>
            <label style={{ fontSize: '11px', marginBottom: '2px' }}>Contact Address3</label>
            <Input
              type="text"
              placeholder="Enter contact address"
              name="contact_address3"
              value={formData?.contact_address3}
              onChange={handleChange}
              style={{ fontSize: '10px', padding: '4px', height: '28px' }}
            />
          </FormGroup>
        </Col>
        <Col md="4">
          <FormGroup style={{ marginBottom: '8px' }}>
            <label style={{ fontSize: '11px', marginBottom: '2px' }}>Country/Postal Code</label>
            <Row>
            <Col md="6">
            <Input
              type="text"
              placeholder="Country"
              name="country"
              value={formData?.country}
              onChange={handleChange}
              style={{ fontSize: '10px', padding: '4px', height: '28px' }}
            /></Col>
              <Col md="6">
            <Input
              type="text"
              placeholder="Postal code"
              name="postal_code"
              value={formData?.postal_code}
              onChange={handleChange}
              style={{ fontSize: '10px', padding: '4px', height: '28px' }}
            /></Col>
            </Row>
          </FormGroup>
        </Col>
        <Col md="4">
          <FormGroup style={{ marginBottom: '8px' }}>
            <label style={{ fontSize: '11px', marginBottom: '2px' }}>Remarks</label>
            <Input
              type="textarea"
              name="remarks"
              placeholder="Remarks"
              value={formData?.remarks}
              onChange={handleChange}
              style={{ fontSize: '10px', padding: '4px', height: '60px' }}
            />
          </FormGroup>
        </Col>
        <Col md="4">
          <FormGroup style={{ marginBottom: '8px' }}>
            <label style={{ fontSize: '11px', marginBottom: '2px' }}>Request Delivery Date</label>
            <Input
              type="date"
              name="req_delivery_date"
              value={formData?.req_delivery_date}
              onChange={handleChange}
              style={{ fontSize: '10px', padding: '4px', height: '28px' }}
            />
          </FormGroup>
        </Col>
      </Row>
     
    </Form>
        </TabPane>

        <TabPane tabId="2">
      
            <Form className="mt-1">
                      <Row className="g-1">
                        <Col md="4">
                          <FormGroup style={{ marginBottom: '8px' }}>
                            <label style={{ fontSize: '11px', marginBottom: '2px' }}>Currency Code</label>
                            <Input type="text" placeholder="Enter Currency code" name="currency_code" value={currency?.currency_code || ""}  onChange={handleCurrencyChange} style={{ fontSize: '10px', padding: '4px', height: '28px' }}/>
                          </FormGroup>
                        </Col>
                        <Col md="4">
                          <FormGroup style={{ marginBottom: '8px' }}>
                            <label style={{ fontSize: '11px', marginBottom: '2px' }}>Currency Name</label>
                            <Input type="text" name="currency_name" value={currency?.currency_name || ""} onChange={handleCurrencyChange} style={{ fontSize: '10px', padding: '4px', height: '28px' }}>
                            
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col md="4">
                          <FormGroup style={{ marginBottom: '8px' }}>
                            <label style={{ fontSize: '11px', marginBottom: '2px' }}>Currency Rate</label>
                            <Input type="text" placeholder="Enter Currency Rate " name="currency_rate" value={currency?.currency_rate || ""} 
                            onChange={handleCurrencyChange} style={{ fontSize: '10px', padding: '4px', height: '28px' }}/>
                          </FormGroup>
                        </Col>
                       
                      </Row>
                    </Form>
        
        </TabPane>
      </TabContent>

        <h5 style={{ margin: '0 0 8px 0', color: '#2c3e50', fontSize: '16px' }}>Products</h5>
        <div style={{ 
          maxHeight: '400px', 
          overflowY: 'auto', 
          border: '1px solid #dee2e6',
          borderRadius: '4px'
        }}>
          <Table bordered style={{ marginBottom: '0' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            <th style={{ padding: '4px', fontSize: '10px', fontWeight: 'bold' }}>S No</th>
            <th style={{ padding: '4px', fontSize: '10px', fontWeight: 'bold' }}>Product Code</th>
            <th style={{ padding: '4px', fontSize: '10px', fontWeight: 'bold' }}>Product Name</th>
            <th style={{ padding: '4px', fontSize: '10px', fontWeight: 'bold' }}>Carton Qty</th>
            <th style={{ padding: '4px', fontSize: '10px', fontWeight: 'bold' }}>Loose Qty</th>
            <th style={{ padding: '4px', fontSize: '10px', fontWeight: 'bold' }}>Qty</th>
            <th style={{ padding: '4px', fontSize: '10px', fontWeight: 'bold' }}>Carton Price</th>
            <th style={{ padding: '4px', fontSize: '10px', fontWeight: 'bold' }}>Price</th>
            <th style={{ padding: '4px', fontSize: '10px', fontWeight: 'bold' }}>Total</th>
            <th style={{ padding: '4px', fontSize: '10px', fontWeight: 'bold' }}>Discount</th>
            <th style={{ padding: '4px', fontSize: '10px', fontWeight: 'bold' }}>Gross Total</th>
            <th style={{ padding: '4px', fontSize: '10px', fontWeight: 'bold' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td style={{ padding: '3px', fontSize: '10px' }}>{index + 1}</td>
              <td style={{ padding: '3px' }}>
              <Select
                options={products.map((p) => ({
                  value: p.product_id,
                  label: `${p.product_code} - ${p.product_name}`,
                  ...p,
                }))}
                value={products.find((p) => p.product_id === row.product_id) || null} 
                onChange={(selectedOption) => handleProductSelect(index, selectedOption)}
                placeholder="Select Product"
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: '24px',
                    fontSize: '9px'
                  })
                }}
              />
              </td>
              <td style={{ padding: '3px' }}>
                <Input
                  type="text"
                  value={row.product_name}
                  onChange={(e) => handleRowChange(index, "product_name", e.target.value)}
                  style={{ fontSize: '9px', padding: '2px', height: '24px' }}
                />
              </td>
              <td style={{ padding: '3px' }}>
                <Input
                  type="number"
                  value={row.carton_qty}
                  onChange={(e) => handleRowChange(index, "carton_qty", parseInt(e.target.value) || 0)}
                  style={{ fontSize: '9px', padding: '2px', height: '24px' }}
                />
              </td>
              <td style={{ padding: '3px' }}>
                <Input
                  type="number"
                  value={row.loose_qty}
                  onChange={(e) => handleRowChange(index, "loose_qty", parseInt(e.target.value) || 0)}
                  style={{ fontSize: '9px', padding: '2px', height: '24px' }}
                />
              </td>
              <td style={{ padding: '3px' }}>
              <Input
                  type="number"
                  value={row.qty}
                  onChange={(e) => handleRowChange(index, "qty", parseInt(e.target.value) || 0)}
                  style={{ fontSize: '9px', padding: '2px', height: '24px' }}
                />
              </td>
              <td style={{ padding: '3px' }}>
                <Input
                  type="number"
                  value={row.carton_price}
                  onChange={(e) => handleRowChange(index, "carton_price", parseFloat(e.target.value) || 0)}
                  style={{ fontSize: '9px', padding: '2px', height: '24px' }}
                />
              </td>
              <td style={{ padding: '3px' }}>
              <Input
                  type="number"
                  value={row.price}
                  onChange={(e) => handleRowChange(index, "price", parseFloat(e.target.value) || 0)}
                  style={{ fontSize: '9px', padding: '2px', height: '24px' }}
                />
              </td>
              <td style={{ padding: '3px', fontSize: '10px' }}>{Number(row.total)?.toFixed(2)}</td>
              <td style={{ padding: '3px' }}>
                <Input
                  type="number"
                  value={row.discount}
                  onChange={(e) => handleRowChange(index, "discount", parseFloat(e.target.value) || 0)}
                  style={{ fontSize: '9px', padding: '1px', width: '50px', height: '20px' }}
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
              <td style={{ padding: '3px', fontSize: '10px' }}>{row.total_price?.toFixed(2)}</td>
              <td style={{ padding: '3px' }}>
                <FaTrashAlt
                  style={{ color: "red", cursor: "pointer", marginRight: "5px", fontSize: '12px' }}
                  onClick={() => deleteRow(index,row.po_product_id)}
                />
                <FaPlusCircle
                  style={{ color: "green", cursor: "pointer", fontSize: '12px' }}
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
        </div>
        
        <Row className="p-1 mt-1 border bg-light" style={{ margin: '4px 0' }}>
          <Col style={{ fontSize: '10px' }}><strong>UOM:</strong> {rows.length > 0 ? rows[0].uom || "-" : "-"}</Col>
           <Col style={{ fontSize: '10px' }}><strong>Pieces/Carton:</strong> {rows.length > 0 ? rows[0]?.pieces_per_carton || 0 : "0.00"}</Col>
           <Col style={{ fontSize: '10px' }}><strong>Purchase Unit Cost:</strong> {rows.length > 0 ? rows[0]?.purchase_unit_cost || 0 : "0.00"}</Col>
           <Col style={{ fontSize: '10px' }}><strong>Wholesale Price:</strong> {rows.length > 0 ? rows[0]?.wholesale_price || 0 : "0.00"}</Col>
           <Col style={{ fontSize: '10px' }}><strong>CQty:</strong> {rows.length > 0 ? rows[0]?.cqty || 0 : "0.00"}</Col>
           <Col style={{ fontSize: '10px' }}><strong>Qty On Hand:</strong> {rows.length > 0 ? rows[0]?.qty_on_hand || 0 : "0.00"}</Col>
        </Row>
      </div>
      
      {/* Fixed Footer Section */}
      <div style={{ 
        flexShrink: 0, 
        backgroundColor: '#2c3e50', 
        borderTop: '1px solid #dee2e6', 
        padding: '5px 10px',
        color: '#ffffff'
      }}>

        <Row className="align-items-center">
           <Col md="2">
              <div style={{ fontSize: '10px', marginBottom: '1px' }}>Bill Discount: $</div>
              <Input 
                type="number" 
                value={billDiscount}
                onChange={(e) => setBillDiscount(parseFloat(e.target.value) || 0)}
                style={{ 
                  height: '20px', 
                  fontSize: '9px', 
                  padding: '1px 4px',
                  width: '70px'
                }} 
              />
           </Col>
           <Col md="2">
             <div style={{ fontSize: '10px', color: '#ffffff' }}>Total Products:</div>
             <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{rows.length}</div>
           </Col>
           <Col md="2">
             <div style={{ fontSize: '10px', color: '#ffffff' }}>Sub Total:</div>
             <div style={{ fontSize: '12px', fontWeight: 'bold' }}>${rows.reduce((sum, row) => sum + row.total_price, 0).toFixed(2)}</div>
           </Col>
           <Col md="2">
             <div style={{ fontSize: '10px', color: '#ffffff' }}>Tax:</div>
             <div style={{ fontSize: '12px', fontWeight: 'bold' }}>${(rows.reduce((sum, row) => sum + row.total_price, 0) * 0.09).toFixed(2)}</div>
           </Col>
           <Col md="2">
             <div style={{ fontSize: '10px', color: '#ffffff' }}>Net Total:</div>
             <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#28a745' }}>${(
               Number(rows.reduce((sum, row) => sum + row.total_price, 0)) +
               Number((rows.reduce((sum, row) => sum + row.total_price, 0) * 0.09).toFixed(2))
             ).toFixed(2)}</div>
           </Col>
           <Col md="2" className="text-right">
             <Button
               color="secondary"
               size="sm"
               onClick={() => {
                 navigate('/PurchaseOrder');
               }}
               style={{ marginRight: '3px', fontSize: '9px', padding: '2px 6px' }}
             >
               Cancel
             </Button>
             <Button
               color="info"
               size="sm"
               onClick={() => {
                 console.log('Print functionality');
               }}
               style={{ marginRight: '3px', fontSize: '9px', padding: '2px 6px' }}
             >
               Print
             </Button>
             <Button
               color="primary"
               size="sm"
               onClick={() => {
                 handleSubmit();
               }}
               style={{ fontSize: '9px', padding: '2px 6px' }}
             >
               Save
             </Button>
           </Col>
         </Row>
      </div>
    </div>
  );
};

export default PurchaseInvoiceEdit;
