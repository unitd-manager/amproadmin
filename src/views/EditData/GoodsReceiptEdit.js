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
  const [billDiscount, setBillDiscount] = useState(0);
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
    api.post("/purchaseorder/getGrProductByGrId",{goods_receipt_id:id}).then((response) => { 
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
    formData.tax_amount=parseFloat(formData.sub_total *0.09.toFixed(2));
    
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

  const deleteRow = (index, id) => {
    if(id){
    api
      .post('/purchaseorder/deleteGrProduct', { gr_product_id:id })
      .then(() => {
        message('Record deleted successfully.', 'success');
      })
      .catch(() => {
        message('Unable to delete record.', 'error');
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
    <Container fluid className="p-2" style={{fontSize: '0.85rem'}}>
      <h4 className="mb-2">Add/Edit Goods Receipt</h4>
      <Row className="mb-2">
      <Col md="6">
          <FormGroup className="mb-2">
            <label className="mb-1" style={{fontSize: '0.8rem'}}>Tran No</label>
            <Input
              type="text"
              placeholder="Enter Tran No"
              name="tran_no"
              value={formData.tran_no}
              onChange={handleChange}
              size="sm"
            />
          </FormGroup>
        </Col>
        <Col md="6">
          <FormGroup className="mb-2">
            <label className="mb-1" style={{fontSize: '0.8rem'}}>Tran Date</label>
            <Input
              type="date"
              name="tran_date"
              value={formData.tran_date}
              onChange={handleChange}
              size="sm"
            />
          </FormGroup>
        </Col>
        </Row>
      <Nav tabs className="mb-2">
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "1" })}
            onClick={() => toggleTab("1")}
            style={{fontSize: '0.85rem', padding: '0.5rem 1rem'}}
          >
            Supplier
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "2" })}
            onClick={() => toggleTab("2")}
            style={{fontSize: '0.85rem', padding: '0.5rem 1rem'}}
          >
            Currency
          </NavLink>
        </NavItem>
      </Nav>

      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
        <Form className="mt-2">
      <Row>
        <Col md="4">
          <FormGroup className="mb-2">
            <label className="mb-1" style={{fontSize: '0.8rem'}}>Supplier Code</label>
            <Input
              type="text"
              placeholder="Enter supplier code"
              name="supplier_code"
              value={formData.supplier_code}
              disabled
              size="sm"
            />
          </FormGroup>
        </Col>
        <Col md="4">
          <FormGroup className="mb-2">
            <label className="mb-1" style={{fontSize: '0.8rem'}}>Supplier Name</label>
            <Input
              type="select"
              name="supplier_id"
              value={formData.supplier_id}
              onChange={handleChange}
              size="sm"
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
          <FormGroup className="mb-2">
            <label className="mb-1" style={{fontSize: '0.8rem'}}>Contact Person</label>
            <Input
              type="text"
              placeholder="Enter contact person"
              name="contact_person"
              value={formData.contact_person}
              onChange={handleChange}
              size="sm"
            />
          </FormGroup>
        </Col>
        </Row>
        <Row>
        <Col md="3">
          <FormGroup className="mb-2">
            <label className="mb-1" style={{fontSize: '0.8rem'}}>Address 1</label>
            <Input
              type="text"
              placeholder="Address 1"
              name="contact_address1"
              value={formData.contact_address1}
              onChange={handleChange}
              size="sm"
            />
          </FormGroup>
        </Col>
        <Col md="3">
          <FormGroup className="mb-2">
            <label className="mb-1" style={{fontSize: '0.8rem'}}>Address 2</label>
            <Input
              type="text"
              placeholder="Address 2"
              name="contact_address2"
              value={formData.contact_address2}
              onChange={handleChange}
              size="sm"
            />
          </FormGroup>
        </Col>
        <Col md="3">
          <FormGroup className="mb-2">
            <label className="mb-1" style={{fontSize: '0.8rem'}}>Address 3</label>
            <Input
              type="text"
              placeholder="Address 3"
              name="contact_address3"
              value={formData.contact_address3}
              onChange={handleChange}
              size="sm"
            />
          </FormGroup>
        </Col>
        <Col md="3">
          <FormGroup className="mb-2">
            <label className="mb-1" style={{fontSize: '0.8rem'}}>Remarks</label>
            <Input
              type="text"
              name="remarks"
              placeholder="Remarks"
              value={formData.remarks}
              onChange={handleChange}
              size="sm"
            />
          </FormGroup>
        </Col>
        </Row>
        <Row>
        <Col md="2">
          <FormGroup className="mb-2">
            <label className="mb-1" style={{fontSize: '0.8rem'}}>Country</label>
            <Input
              type="text"
              placeholder="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              size="sm"
            />
          </FormGroup>
        </Col>
        <Col md="2">
          <FormGroup className="mb-2">
            <label className="mb-1" style={{fontSize: '0.8rem'}}>Postal Code</label>
            <Input
              type="text"
              placeholder="Postal code"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleChange}
              size="sm"
            />
          </FormGroup>
        </Col>
        <Col md="2">
          <FormGroup className="mb-2">
            <label className="mb-1" style={{fontSize: '0.8rem'}}>Invoice Date</label>
            <Input
              type="date"
              name="invoice_date"
              value={formData.invoice_date}
              onChange={handleChange}
              size="sm"
            />
          </FormGroup>
        </Col>
        <Col md="2">
          <FormGroup className="mb-2">
            <label className="mb-1" style={{fontSize: '0.8rem'}}>Invoice No</label>
            <Input
              type="text"
              placeholder="Invoice No"
              name="invoice_no"
              value={formData.invoice_no}
              onChange={handleChange}
              size="sm"
            />
          </FormGroup>
        </Col>
        <Col md="2">
          <FormGroup className="mb-2">
            <label className="mb-1" style={{fontSize: '0.8rem'}}>Delivery Date</label>
            <Input
              type="date"
              name="delivery_date"
              value={formData.delivery_date}
              onChange={handleChange}
              size="sm"
            />
          </FormGroup>
        </Col>
        <Col md="2">
          <FormGroup className="mb-2">
            <label className="mb-1" style={{fontSize: '0.8rem'}}>Delivery No</label>
            <Input
              type="text"
              name="do_no"
              value={formData.do_no}
              onChange={handleChange}
              size="sm"
            />
          </FormGroup>
        </Col>
      </Row>
     
    </Form>
        </TabPane>

        <TabPane tabId="2">
            <Form className="mt-2">
                      <Row>
                        <Col md="4">
                          <FormGroup className="mb-2">
                            <label className="mb-1" style={{fontSize: '0.8rem'}}>Currency Code</label>
                            <Input type="text" placeholder="Enter Currency code" name="currency_code" value={currency?.currency_code || ""}  onChange={handleCurrencyChange} size="sm"/>
                          </FormGroup>
                        </Col>
                        <Col md="4">
                          <FormGroup className="mb-2">
                            <label className="mb-1" style={{fontSize: '0.8rem'}}>Currency Name</label>
                            <Input type="text" name="currency_name" value={currency?.currency_name || ""} onChange={handleCurrencyChange} size="sm">
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col md="4">
                          <FormGroup className="mb-2">
                            <label className="mb-1" style={{fontSize: '0.8rem'}}>Currency Rate</label>
                            <Input type="text" placeholder="Enter Currency Rate " name="currency_rate" value={currency?.currency_rate || ""} 
                            onChange={handleCurrencyChange} size="sm"/>
                          </FormGroup>
                        </Col> 
                      </Row>
                    </Form>
        
        </TabPane>
      </TabContent>

      <h5 className="mt-2 mb-2">Products</h5>
      <div style={{maxHeight: '300px', overflowY: 'auto'}}>
      <Table bordered size="sm" style={{fontSize: '0.75rem'}}>
        <thead>
          <tr style={{fontSize: '0.7rem'}}>
            <th style={{padding: '0.25rem'}}>S No</th>
            <th style={{padding: '0.25rem'}}>Product</th>
            <th style={{padding: '0.25rem'}}>Name</th>
            <th style={{padding: '0.25rem'}}>C.Qty</th>
            <th style={{padding: '0.25rem'}}>L.Qty</th>
            <th style={{padding: '0.25rem'}}>Qty</th>
            <th style={{padding: '0.25rem'}}>C.Price</th>
            <th style={{padding: '0.25rem'}}>Price</th>
            <th style={{padding: '0.25rem'}}>Total</th>
            <th style={{padding: '0.25rem'}}>Disc</th>
            <th style={{padding: '0.25rem'}}>G.Total</th>
            <th style={{padding: '0.25rem'}}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows?.map((row, index) => (
            <tr key={index} style={{fontSize: '0.7rem'}}>
              <td style={{padding: '0.25rem'}}>{index + 1}</td>
              <td style={{padding: '0.25rem', minWidth: '150px'}}>
              <Select
                options={products.map((p) => ({
                  value: p.product_id,
                  label: `${p.product_code}`,
                  ...p,
                }))}
                value={products.find((p) => p.product_id === row.product_id) || null} 
                onChange={(selectedOption) => handleProductSelect(index, selectedOption)}
                placeholder="Select"
                styles={{
                  control: (base) => ({ ...base, minHeight: '25px', fontSize: '0.7rem' }),
                  option: (base) => ({ ...base, fontSize: '0.7rem' })
                }}
              />
              </td>
              <td style={{padding: '0.25rem', maxWidth: '100px'}}>
                <Input
                  type="text"
                  value={row.product_name}
                  onChange={(e) => handleRowChange(index, "product_name", e.target.value)}
                  size="sm"
                  style={{fontSize: '0.7rem'}}
                />
              </td>
              <td style={{padding: '0.25rem'}}>
                <Input
                  type="number"
                  value={row.carton_qty}
                  onChange={(e) => handleRowChange(index, "carton_qty", parseInt(e.target.value) || 0)}
                  size="sm"
                  style={{fontSize: '0.7rem', width: '60px'}}
                />
              </td>
              <td style={{padding: '0.25rem'}}>
                <Input
                  type="number"
                  value={row.loose_qty}
                  onChange={(e) => handleRowChange(index, "loose_qty", parseInt(e.target.value) || 0)}
                  size="sm"
                  style={{fontSize: '0.7rem', width: '60px'}}
                />
              </td>
              <td style={{padding: '0.25rem'}}>
              <Input
                  type="number"
                  value={row.qty}
                  onChange={(e) => handleRowChange(index, "qty", parseInt(e.target.value) || 0)}
                  size="sm"
                  style={{fontSize: '0.7rem', width: '60px'}}
                />
              </td>
              <td style={{padding: '0.25rem'}}>
                <Input
                  type="number"
                  value={row.carton_price}
                  onChange={(e) => handleRowChange(index, "carton_price", parseFloat(e.target.value) || 0)}
                  size="sm"
                  style={{fontSize: '0.7rem', width: '70px'}}
                />
              </td>
              <td style={{padding: '0.25rem'}}>
              <Input
                  type="number"
                  value={row.price}
                  onChange={(e) => handleRowChange(index, "price", parseFloat(e.target.value) || 0)}
                  size="sm"
                  style={{fontSize: '0.7rem', width: '70px'}}
                />
              </td>
              <td style={{padding: '0.25rem', fontSize: '0.7rem'}}>{Number(row.total)?.toFixed(2)}</td>
              <td style={{padding: '0.25rem'}}>
                <Input
                  type="number"
                  value={row.discount}
                  onChange={(e) => handleRowChange(index, "discount", parseFloat(e.target.value) || 0)}
                  size="sm"
                  style={{fontSize: '0.7rem', width: '60px'}}
                />
              </td>
              <td style={{padding: '0.25rem', fontSize: '0.7rem'}}>{row.total_price?.toFixed(2)}</td>
              <td style={{padding: '0.25rem'}}>
                <FaTrashAlt
                  style={{ color: "red", cursor: "pointer", marginRight: "5px", fontSize: '0.8rem' }}
                  onClick={() => deleteRow(index,row.gr_product_id)}
                />
                <FaPlusCircle
                  style={{ color: "green", cursor: "pointer", fontSize: '0.8rem' }}
                  onClick={addRow}
                />
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
  <tr style={{fontSize: '0.7rem', fontWeight: 'bold'}}>
    <td colSpan={3} style={{ fontWeight: "bold", padding: '0.25rem' }}>Summary:</td>
    <td style={{padding: '0.25rem'}}>{getColumnSum("carton_qty")}</td>
    <td style={{padding: '0.25rem'}}>{getColumnSum("loose_qty")}</td>
    <td style={{padding: '0.25rem'}}>{getColumnSum("qty")}</td>
    <td style={{padding: '0.25rem'}}>{getColumnSum("carton_price").toFixed(2)}</td>
    <td style={{padding: '0.25rem'}}>{getColumnSum("price").toFixed(2)}</td>
    <td style={{padding: '0.25rem'}}>{getColumnSum("total").toFixed(2)}</td>
    <td style={{padding: '0.25rem'}}>{getColumnSum("discount").toFixed(2)}</td>
    <td style={{padding: '0.25rem'}}>{getColumnSum("total_price").toFixed(2)}</td>
    <td style={{padding: '0.25rem'}}></td>
  </tr>
</tfoot>

      </Table>
      </div>
      <Row className="p-1 border bg-light" style={{fontSize: '0.75rem'}}>
        <Col sm="2"><strong>UOM:</strong> {rows.length > 0 ? rows[0].uom || "-" : "-"}</Col>
        <Col sm="2"><strong>Pieces/Carton:</strong> {rows.length > 0 ? rows[0]?.pieces_per_carton || 0 : "0"}</Col>
        <Col sm="2"><strong>Unit Cost:</strong> {rows.length > 0 ? rows[0]?.purchase_unit_cost?.toFixed(2) || "0.00" : "0.00"}</Col>
        <Col sm="2"><strong>Wholesale:</strong> {rows.length > 0 ? rows[0]?.wholesale_price?.toFixed(2) || "0.00" : "0.00"}</Col>
        <Col sm="2"><strong>CQty:</strong> {rows.length > 0 ? rows[0]?.carton_qty || "0" : "0"}</Col>
        <Col sm="2"><strong>On Hand:</strong> {rows.length > 0 ? rows[0]?.qty_on_hand || 0 : "0"}</Col>
      </Row>

      <Row className="p-1 mt-1 border" style={{fontSize: '0.75rem'}}>
        <Col sm="2"><strong>Products:</strong> {rows.length}</Col>
        <Col sm="3"><strong>Sub Total:</strong> ${rows.reduce((sum, row) => sum + row.total_price, 0).toFixed(2)}</Col>
        <Col sm="2"><strong>Tax:</strong> ${ (rows.reduce((sum, row) => sum + row.total_price, 0) * 0.09).toFixed(2) }</Col>
        <Col sm="3"><strong>Net Total:</strong> $
  {(
    Number(rows.reduce((sum, row) => sum + row.total_price, 0)) +
    Number((rows.reduce((sum, row) => sum + row.total_price, 0) * 0.09).toFixed(2))
  ).toFixed(2)}</Col>
        <Col sm="2">
           <strong>Discount:</strong>
           <Input
             type="number"
             value={billDiscount}
             onChange={(e) => setBillDiscount(parseFloat(e.target.value) || 0)}
             size="sm"
             style={{ width: "60px", display: "inline-block", marginLeft: "5px" }}
           />
         </Col>
      </Row>

      <div className="mt-2">
        <Button color="success" size="sm" onClick={handleSubmit} >Save</Button>
        <Button color="danger" size="sm" className="ms-2" onClick={() => navigate('/GoodsReceipt')}>
          Cancel
        </Button>
      </div>
    </Container>
  );
};

export default PurchaseOrderPage;
