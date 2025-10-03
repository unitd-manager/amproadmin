/*eslint-disable*/
import React, { useState,useEffect} from "react";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Table,
  Button,
  Card,
  CardBody,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import classnames from "classnames";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import Select from "react-select";
import message from '../../components/Message';
import { FaTrashAlt, FaPlusCircle } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faPlus, faPrint } from '@fortawesome/free-solid-svg-icons';
import api from "../../constants/api";
import ProductInfoModal from "../../components/PurchaseOrder/ProductInfoModal";


const PurchaseInvoiceDetails = () => {

  const [productInfoModal, setProductInfoModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSNo, setSelectedSNo] = useState(null);
  const [selectedUOM, setSelectedUOM] = useState('');


  const handleSNoClick = (sNo, product) => {
    setSelectedSNo(sNo);
    setSelectedProduct(product);
    setSelectedUOM(product.UOM || ''); // Assuming UOM is a property of the product object
  };

  const toggleProductInfoModal = () => setProductInfoModal(!productInfoModal);

  const handleViewProductInfo = (product) => {
    setSelectedProduct(product);
    toggleProductInfoModal();
  };


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
  const [rows, setRows] = useState([
    {
      pi_product_id: 1,
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
      discount_percentage: 0,
      discount_amount: 0,
      grossTotal: 0,
    },
    {
      pi_product_id: 2,
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
      discount_percentage: 0,
      discount_amount: 0,
      grossTotal: 0,
    },
  ]);
  const handleAddExtraFields = (id) => {
    setRows(rows.map(p =>
      p.pi_product_id === id ? { ...p, showExtraFields: !p.showExtraFields, remarks: p.remarks || '', foc_qty: p.foc_qty || 0 } : p
    ));
  };
// Utility function to handle Enter key focus shift
const handleKeyDown = (e) => {
  if (e.key === "Enter") {
    e.preventDefault(); // prevent form submission
    const form = e.target.form;
    const index = Array.prototype.indexOf.call(form, e.target);
    form.elements[index + 1]?.focus(); // focus next element if exists
  }
};

  const addNewRow = () => {
    setRows((prevRows) => [
      ...prevRows,
      {
        pi_product_id: prevRows.length > 0 ? Math.max(...prevRows.map(r => r.pi_product_id)) + 1 : 1,
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
        discount_percentage: 0,
        discount_amount: 0,
        grossTotal: 0,
      },
    ]);
  };


  const subtotal = rows?.reduce((acc, p) => acc + (p.total || 0), 0);
  const tax = subtotal * 0.09;
  const finalTotal = subtotal + tax;
  // Calculate totals
  const summary = rows?.reduce(
    (acc, p) => {
      const total = p.qty * p.price;
      const grossTotal = total - (p.discount_amount || 0);
      acc.carton_qty += p.carton_qty;
      acc.loose_qty  += p.loose_qty;
      acc.qty += p.qty;
      acc.carton_price +=p.carton_price;
      acc.price += p.price;
      acc.total += total;
      acc.grossTotal = subtotal;
      return acc;
    },
    {
      cartonQty: 0,
      looseQty: 0,
      qty: 0,
      cartonPrice: 0,
      price: 0,
      total: 0,
      grossTotal: 0,
    }
  );


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
  const handleCurrency = (e) => {
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
    console.log('handleChange - name:', name, 'value:', value);

    setFormData((prev) => {
      const updatedFormData = {
        ...prev,
        [name]: value,
      };

      if (name === "supplier_id") {
        console.log('handleChange - supplierOptions:', supplierOptions);
        const selectedSupplier = supplierOptions.find(
          (supplier) => String(supplier.supplier_id) === String(value)
        );
        console.log('handleChange - selectedSupplier:', selectedSupplier);
        if (selectedSupplier) {
          updatedFormData.company_name = selectedSupplier.company_name;
          updatedFormData.contact_person = selectedSupplier.contact_person;
          updatedFormData.contact_address1 = selectedSupplier.address_flat;
          updatedFormData.contact_address2 = selectedSupplier.address_street;
          updatedFormData.contact_address3 = selectedSupplier.address_state;
          // updatedFormData.state = selectedSupplier.address_state;
          updatedFormData.country = selectedSupplier.address_country;
          updatedFormData.postal_code = selectedSupplier.address_po_code;
        }
      }
      console.log('handleChange - updatedFormData:', updatedFormData);
      return updatedFormData;
    });
  };
  const getColumnSum = (key) => {
    return rows.reduce((sum, row) => sum + (parseFloat(row[key]) || 0), 0);
  };
  
  
    // Handle product selection
    const handleProductSelect = (index, selectedProduct) => {
      console.log("Selected Product:", selectedProduct);
      const updatedRows = [...rows];
      updatedRows[index].product_id = selectedProduct.value;
      updatedRows[index].product_code = selectedProduct.label;
      updatedRows[index].product_name = selectedProduct.product_name;
      setRows(updatedRows);
      console.log("Updated Rows:", updatedRows);
    };
  // Handle form submit (example API call structure)
  const handleSubmit = async () => {
    formData.sub_total = rows.reduce((sum, row) => sum + row.total_price, 0).toFixed(2);
    formData.tax_amount = parseFloat((formData.sub_total * 0.09).toFixed(2));
    formData.net_total = (
      Number(formData.sub_total) + Number(formData.tax_amount)
    ).toFixed(2);
    formData.sub_total = Number(formData.sub_total);
    formData.tax_amount = Number(formData.tax_amount);
    formData.net_total = Number(formData.net_total);
    formData.grand_total = Number(formData.net_total);

    if (!currency.currency_code) {
      message('Please Enter currency code.', 'error');
      return;
    }

    try {
      const res = await api.post('/purchaseorder/insertPurchaseInvoice', formData);
      const insertedDataId = res.data.data.insertId;
      currency.purchase_invoice_id = insertedDataId;

      await api.post('/currency/insertPurchaseInvoiceCurrency', currency);
 
      // Fire all product inserts in parallel
      await Promise.all(
        rows.map(el => {
          el.purchase_invoice_id = insertedDataId;
          el.gross_total = el.total_price;
          if(el.product_id){
          return api.post('/purchaseorder/insertPiProduct', el);
          }
        })
      );

      message('PurchaseInvoice has been Created successfully.', 'success');
      setTimeout(() => navigate(`/PurchaseInvoiceEdit/${insertedDataId}`), 300);
    } catch {
      message('Network connection error.', 'error');
    }
  };

  const handleRowChange = (id, field, value) => {
    setRows(prevRows => {
      // Simple guard: skip any numeric-field update if supplier not chosen
      const needsSupplier = !["product_code", "product_name", "product_id"].includes(field);
      if (!formData.supplier_id && needsSupplier) {
        message("Please select a supplier first.", "warning");
        return prevRows; // leave rows unchanged
      }
      return prevRows.map(row => {
        if (row.pi_product_id === id) {
          const updatedRow = { ...row, [field]: value };

          if (field === "product_code") {
            const product = products.find(item => item.product_code === value);
            if (product) {
              updatedRow.product_name = product.product_name;
              updatedRow.carton_price = product.unit_price;
              updatedRow.price = product.unit_price;
              updatedRow.qty = 0;
              updatedRow.loose_qty = 0;
              updatedRow.carton_qty = 0;
              updatedRow.discount = 0;
              updatedRow.total = 0;
              updatedRow.total_price = 0;
            } else {
              updatedRow.product_name = "";
              updatedRow.carton_price = 0;
              updatedRow.price = 0;
            }
          }

          // Recalculate discount_amount if discount_percentage changes
          if (field === "discount_percentage") {
            const qty = Number(updatedRow.qty || 0);
            const price = Number(updatedRow.price || 0);
            const discountPercentage = Number(value || 0);
            updatedRow.discount_amount = ((qty * price * discountPercentage) / 100).toFixed(2);
          }

          // Recalculate totals if relevant fields change
          if (["carton_qty", "carton_price", "qty", "loose_qty", "price", "discount", "discount_percentage", "discount_amount"].includes(field)) {
            const cartonQty = Number(updatedRow.carton_qty || 0);
            const cartonPrice = Number(updatedRow.carton_price || 0);
            const looseQty = Number(updatedRow.loose_qty || 0);
            const qty = Number(updatedRow.qty || 0);
            const price = Number(updatedRow.price || 0);
            const discountAmount = Number(updatedRow.discount_amount || 0);

            const cartonTotal = cartonQty * cartonPrice;
            const looseTotal = looseQty * (cartonPrice / 12);
            const total = qty * price;
            const preDiscountGrossTotal = cartonTotal + looseTotal + total;
            const grossTotal = preDiscountGrossTotal - discountAmount;

            updatedRow.qty = cartonQty + looseQty;
            updatedRow.total = parseFloat(preDiscountGrossTotal.toFixed(2)); // This is the total before discount
            updatedRow.grossTotal = parseFloat(grossTotal.toFixed(2)); // This is the total after discount
            updatedRow.total_price = parseFloat(grossTotal.toFixed(2)); // Assuming total_price is the final gross total
          }

          return updatedRow;
        }
        return row;
      });
    });
  };
 // Handle product code selection
  const handleProductChange = (index, productId) => {
    const selectedProduct = products.find(
      (prod) => prod.product_id === parseInt(productId)
    );

    const updatedInvoiceProducts = [...rows];
    updatedInvoiceProducts[index].product_id = productId;
    updatedInvoiceProducts[index].product_code = selectedProduct?.product_code || "";
    updatedInvoiceProducts[index].product_name = selectedProduct?.title || "";

    setRows(updatedInvoiceProducts);
  };
  console.log('rows',rows);
  console.log('formdata',formData);
  const deleteRow = (index, id) => {
    // Since this is a create page, no API call needed
    if (rows.length > 2) {
      setRows(rows.filter((_, i) => i !== index));
    } else {
      // Clear row data if 2 or fewer rows remain
      const clearedRows = rows.map((row, i) =>
        i === index
          ? {
              pi_product_id: row.pi_product_id,
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
              discount_percentage: 0,
              discount_amount: 0,
              grossTotal: 0,
            }
          : row
      );
      setRows(clearedRows);
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
    <div style={{ fontSize: "12px" }}>
       <ToastContainer />
      <Container fluid className="p-1 mb-5">
        {/* <Card className="shadow-sm">
          <CardBody className="p-3"> */}
            {/* Header */}
            <h6 className="mb-2">Add/Edit Purchase Invoice</h6>

            <Form>
              {/* Tran No & Date */}
               <Row>
    {/* Supplier Code & Contact Address1 */}
    <Col md="6">
      <Row className="mb-1">
        <Col md="4">
          <Label className="small mb-1">Tran no</Label>
        </Col>
        <Col md="8">
          <Input bsSize="sm" className="py-0 px-1" name="tran_no" value={formData?.tran_no}  
              onChange={handleChange}  onKeyDown={handleKeyDown}/>
        </Col>
      </Row>
    </Col>
    <Col md="6">
      <Row className="mb-1">
        <Col md="4">
          <Label className="small mb-1">Tran Date</Label>
        </Col>
        <Col md="8">
          <Input bsSize="sm" type='date' className="py-0 px-1" name="tran_date" value={formData?.tran_date}  
              onChange={handleChange}  onKeyDown={handleKeyDown}/>
        </Col>
      </Row>
    </Col>
  </Row>

              {/* Tabs */}
              <Nav tabs className="mb-2">
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

              <TabContent activeTab={activeTab} style={{ maxHeight: 'calc(100vh - 400px)'}}>
                {/* Supplier Tab */}
               {/* Supplier Tab */}
<TabPane tabId="1">
  <Row>
    {/* Supplier Code & Contact Address1 */}
       {/* Supplier Name & Contact Address2 */}
    <Col md="6">
      <Row className="mb-1">
        <Col md="4">
          <Label className="small mb-1">Supplier Code</Label>
        </Col>
       <Col md="8">
          <FormGroup>
           
            <Input
            bsSize="sm" className="py-0 px-1"  
          
              type="select"
              name="supplier_id"
              value={formData?.supplier_id}
              onChange={handleChange}
             onKeyDown={handleKeyDown}>
              <option value="">Select Supplier</option>
              {supplierOptions.map((supplier, index) => (
                <option key={index} value={supplier.supplier_id}>
                  {supplier.supplier_code}
                </option>
              ))}
            </Input>
          </FormGroup>
        </Col>
      </Row>
    </Col>
   
    <Col md="6">
      <Row className="mb-1">
        <Col md="4">
          <Label className="small mb-1">Contact Address1</Label>
        </Col>
        <Col md="8">
          <Input bsSize="sm" className="py-0 px-1"  name="contact_address1"
              value={formData?.contact_address1}
              onChange={handleChange}  onKeyDown={handleKeyDown}/>
        </Col>
      </Row>
    </Col>
  </Row>

  <Row>
    {/* Supplier Name & Contact Address2 */}
    <Col md="6">
      <Row className="mb-1">
        <Col md="4">
          <Label className="small mb-1">Supplier Name</Label>
        </Col>
        <Col md="8">
          <Input bsSize="sm" className="py-0 px-1"  name="company_name"
              value={formData?.company_name}
              onChange={handleChange}  onKeyDown={handleKeyDown} readOnly/>
        </Col>
      </Row>
    </Col>
    <Col md="6">
      <Row className="mb-1">
        <Col md="4">
          <Label className="small mb-1">Contact Address2</Label>
        </Col>
        <Col md="8">
          <Input bsSize="sm" className="py-0 px-1"  name="contact_address2"
              value={formData?.contact_address2}
              onChange={handleChange} onKeyDown={handleKeyDown}/>
        </Col>
      </Row>
    </Col>
  </Row>

  <Row>
    {/* Contact Person & Contact Address3 */}
    <Col md="6">
      <Row className="mb-1">
        <Col md="4">
          <Label className="small mb-1">Contact Person</Label>
        </Col>
        <Col md="8">
          <Input bsSize="sm" className="py-0 px-1" 
           name="contact_person"
              value={formData.contact_person}
              onChange={handleChange}
           onKeyDown={handleKeyDown}/>
        </Col>
      </Row>
    </Col>
    <Col md="6">
      <Row className="mb-1">
        <Col md="4">
          <Label className="small mb-1">Contact Address3</Label>
        </Col>
        <Col md="8">
          <Input bsSize="sm" className="py-0 px-1"  name="contact_address3"
              value={formData?.contact_address3}
              onChange={handleChange}  onKeyDown={handleKeyDown}/>
        </Col>
      </Row>
    </Col>
  </Row>

  <Row>
    {/* Remarks & Country/Postal */}
    <Col md="6">
      <Row className="mb-1">
        <Col md="4">
          <Label className="small mb-1">Remarks</Label>
        </Col>
        <Col md="8">
          <Input bsSize="sm" className="py-0 px-1"  name="remarks"
              value={formData?.remarks}
              onChange={handleChange}  onKeyDown={handleKeyDown}/>
        </Col>
      </Row>
    </Col>
    <Col md="6">
      <Row className="mb-1">
        <Col md="4">
          <Label className="small mb-1">Country/Postal</Label>
        </Col>
        <Col md="5">
          <Input bsSize="sm" className="py-0 px-1"  name="country"
              value={formData?.country}
              onChange={handleChange}  onKeyDown={handleKeyDown}/>
        </Col>
        <Col md="3">
          <Input bsSize="sm" className="py-0 px-1"  name="postal_code"
              value={formData?.postal_code}
              onChange={handleChange}  onKeyDown={handleKeyDown}/>
        </Col>
      </Row>
    </Col>
  </Row>

  <Row>
    {/* Invoice Date & Invoice No */}
    <Col md="6">
      <Row className="mb-1">
        <Col md="4">
          <Label className="small mb-1">Invoice Date</Label>
        </Col>
        <Col md="8">
          <Input bsSize="sm" className="py-0 px-1" type="date"  name="invoice_date"
              value={formData?.invoice_date}
              onChange={handleChange}  onKeyDown={handleKeyDown}/>
        </Col>
      </Row>
    </Col>
    <Col md="6">
      <Row className="mb-1">
        <Col md="4">
          <Label className="small mb-1">Invoice No</Label>
        </Col>
        <Col md="8">
          <Input bsSize="sm" className="py-0 px-1"  name="invoice_no"
              value={formData?.invoice_no}
              onChange={handleChange}  onKeyDown={handleKeyDown}/>
        </Col>
      </Row>
    </Col>
  </Row>

  <Row>
    {/* Delivery Date & DO No */}
    <Col md="6">
      <Row className="mb-1">
        <Col md="4">
          <Label className="small mb-1">Delivery Date</Label>
        </Col>
        <Col md="8">
          <Input bsSize="sm" className="py-0 px-1" type="date" name="delivery_date"
              value={formData?.delivery_date}
              onChange={handleChange}  onKeyDown={handleKeyDown}/>
        </Col>
      </Row>
    </Col>
    <Col md="6">
      <Row className="mb-1">
        <Col md="4">
          <Label className="small mb-1">DO No</Label>
        </Col>
        <Col md="8">
          <Input
            bsSize="sm"
            className="py-0 px-1"
            name="do_no"
            value={formData?.do_no}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                // Focus the first product code Select in the table
                const firstProductSelect = document.querySelector(
                  'tbody tr:first-child td:nth-child(2) [class*="css-"] input'
                );
                if (firstProductSelect) firstProductSelect.focus();
              } else {
                handleKeyDown(e);
              }
            }}
          />
        </Col>
      </Row>
    </Col>
  </Row>
</TabPane>
                {/* Currency Tab */}
                <TabPane tabId="2">
                 <>
    {/* Supplier Code & Contact Address1 */}
  
                 <Row>
    {/* Supplier Name & Contact Address2 */}
    <Col md="6">
      <Row className="mb-1">
        <Col md="4">
          <Label className="small mb-1">Currency Code</Label>
        </Col>
        <Col md="8">
          <Input bsSize="sm" className="py-0 px-1" name="currency_code"
              value={currency?.currency_code}
              onChange={handleCurrency}  onKeyDown={handleKeyDown}/>
        </Col>
      </Row>
    </Col>
    <Col md="6">
      <Row className="mb-1">
        <Col md="4">
          <Label className="small mb-1">Currency Name</Label>
        </Col>
        <Col md="8">
          <Input bsSize="sm" className="py-0 px-1" name="currency_name"
              value={currency?.currency_name} 
              onChange={handleCurrency}  onKeyDown={handleKeyDown}/>
        </Col>
      </Row>
    </Col>
      <Col md="6">
      <Row className="mb-1">
        <Col md="4">
          <Label className="small mb-1">Currency Rate</Label>
        </Col>
        <Col md="8">
          <Input bsSize="sm" className="py-0 px-1" name="currency_rate"
              value={currency?.currency_rate}
              onChange={handleCurrency}  onKeyDown={handleKeyDown}/>
        </Col>
      </Row>
    </Col>
  </Row>

    
      </>
                </TabPane>
              </TabContent>

              {/* Table */}
               <Table bordered responsive size="sm" className="mt-3 mb-1" style={{ fontSize: '0.75rem' }}>
        
        <colgroup>
            <col style={{ width: "1rem" }} /> 
    <col style={{ width: "10rem" }} /> {/* Product Code */}
    <col style={{ width: "14rem" }} /> {/* Product Name */}
    <col style={{ width: "4rem" }} />  {/* Qty */}
    <col style={{ width: "4rem" }} />  {/* Price */}
    <col style={{ width: "4rem" }} />  {/* Qty */}
    <col style={{ width: "4rem" }} />  {/* Price */}
    <col style={{ width: "4rem" }} />  {/* Qty */}
    <col style={{ width: "4rem" }} />  {/* Price */}
    <col style={{ width: "8rem" }} />  {/* Discount (bigger for 2 inputs) */}
    <col style={{ width: "4rem" }} />  {/* Tax */}
    <col style={{ width: "8rem" }} />  {/* Total */}
  </colgroup>
        <thead style={{ background: "#f5f5f5" }}>
          <tr>
            <th style={{ padding: '0.3rem' }}>S No</th>
            <th style={{ width: ".1rem" }}>Product Code</th>
            <th style={{ width: ".2rem" }}>Product Name</th>
            <th style={{ padding: '0.3rem' }}>Carton Qty</th>
            <th style={{ padding: '0.3rem' }}>Loose Qty</th>
            <th style={{ padding: '0.3rem' }}>Qty</th>
            <th style={{ padding: '0.3rem' }}>Carton Price</th>
            <th style={{ padding: '0.3rem' }}>Price</th>
            <th style={{ padding: '0.3rem' }}>Total</th>
            <th style={{ padding: '0.3rem', minWidth: "60px", textAlign: "center" }}>% Discount $</th>
            <th style={{ padding: '0.3rem' }}>Gross Total</th>
            <th style={{ padding: '0.3rem' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows?.map((p, idx) => (
            <React.Fragment key={p.pi_product_id}>
              <tr key={p.pi_product_id}>
                <td
                  style={{
                    padding: '0.3rem',
                    cursor: 'pointer',
                    backgroundColor: selectedSNo === idx + 1 ? '#e0e0e0' : 'transparent',
                  }}
                  onClick={() => handleSNoClick(idx + 1, p)}
                >
                  {idx + 1}
                </td>
         <td style={{ padding: "0.3rem", minWidth: "200px" }}>
  <Select
    options={products.map((pr) => ({
      value: pr.product_id,
      label: `${pr.product_code} - ${pr.product_name}`,
      product_code: pr.product_code,
      product_name: pr.product_name,
    }))}
    value={
      p.product_id
        ? {
            value: p.product_id,
            label: `${p.product_code} - ${p.product_name}`,
          }
        : null
    }
    onChange={(selectedOption) => handleProductSelect(idx, selectedOption)}
    placeholder="Select Product"
    onKeyDown={(e) => handleKeyDown(e, idx, 'product_code')}
    filterOption={(candidate, input) => {
      if (!input) return true;
      const lowerInput = input.toLowerCase();
      return (
        candidate.data.product_code.toLowerCase().includes(lowerInput) ||
        candidate.data.product_name.toLowerCase().includes(lowerInput)
      );
    }}
  />
</td>


            {/* Product Name (auto updated) */}
            <td style={{ padding: "0.3rem" }}>
              <input
                type="text"
                className="form-control form-control-sm"
                value={p.product_name || ""}
                readOnly
              />
            </td>
                {/* <td style={{ padding: '0.3rem' }}>{p.carton_qty}</td>
                <td style={{ padding: '0.3rem' }}>{p.loose_qty}</td>
                <td style={{ padding: '0.3rem' }}>{p.qty}</td> */}
                 <td style={{ padding: '0.3rem' }}>
                  <Input
                    type="text"
                    bsSize="sm"
                    value={p?.carton_qty === 0 ? '' : p?.carton_qty}
                    onBlur={(e) => {
                      const val = e.target.value;
                      const num = val === '' ? 0 : parseFloat(val);
                      handleRowChange(p.pi_product_id, 'carton_qty', num);
                    }}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^\d*\.?\d{0,2}$/.test(val)) {
                        handleRowChange(p.pi_product_id, 'carton_qty', val);
                      }
                    }}
                    onFocus={(e) => e.target.select()}
                    style={{ width: '80px', textAlign: 'right' }}
                  onKeyDown={handleKeyDown} />
                </td>
                 <td style={{ padding: '0.3rem' }}>
                  <Input
                    type="text"
                    bsSize="sm"
                    value={p?.loose_qty === 0 ? '' : p?.loose_qty}
                    onBlur={(e) => {
                      const val = e.target.value;
                      const num = val === '' ? 0 : parseFloat(val);
                      handleRowChange(p.pi_product_id, 'loose_qty', num);
                    }}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^\d*\.?\d{0,2}$/.test(val)) {
                        handleRowChange(p.pi_product_id, 'loose_qty', val);
                      }
                    }}
                    onFocus={(e) => e.target.select()}
                    style={{ width: '80px', textAlign: 'right' }}
                   onKeyDown={handleKeyDown}/>
                </td>
                 <td style={{ padding: '0.3rem' }}>
                  <Input
                    type="text"
                    bsSize="sm"
                    value={p?.qty === 0 ? '' : p?.qty}
                    onBlur={(e) => {
                      const val = e.target.value;
                      const num = val === '' ? 0 : parseFloat(val);
                      handleRowChange(p.pi_product_id, 'qty', num);
                    }}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^\d*\.?\d{0,2}$/.test(val)) {
                        handleRowChange(p.pi_product_id, 'qty', val);
                      }
                    }}
                    onFocus={(e) => e.target.select()}
                    style={{ width: '80px', textAlign: 'right' }}
                   onKeyDown={handleKeyDown}/>
                </td>
                <td style={{ padding: '0.3rem' }}>
                  <Input
                    type="text"
                    bsSize="sm"
                    value={p?.carton_price === 0 ? '' : p?.carton_price}
                    onBlur={(e) => {
                      const val = e.target.value;
                      const num = val === '' ? 0 : parseFloat(val);
                      handleRowChange(p.pi_product_id, 'carton_price', num);
                    }}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^\d*\.?\d{0,2}$/.test(val)) {
                        handleRowChange(p.pi_product_id, 'carton_price', val);
                      }
                    }}
                    onFocus={(e) => e.target.select()}
                    style={{ width: '80px', textAlign: 'right' }}
                  onKeyDown={handleKeyDown} />
                </td>
                <td style={{ padding: '0.3rem' }}>
                  <Input
                    type="text"
                    bsSize="sm"
                    value={p?.price === 0 ? '' : p?.price}
                    onBlur={(e) => {
                      const val = e.target.value;
                      const num = val === '' ? 0 : parseFloat(val);
                      handleRowChange(p.pi_product_id, 'price', num);
                    }}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^\d*\.?\d{0,2}$/.test(val)) {
                        handleRowChange(p.pi_product_id, 'price', val);
                      }
                    }}
                    onFocus={(e) => e.target.select()}
                    style={{ width: '80px', textAlign: 'right' }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const currentRowIndex = rows.findIndex(r => r.pi_product_id === p.pi_product_id);
                        const nextRowIndex = currentRowIndex + 1;
                        const nextRow = rows[nextRowIndex];
                        if (nextRow) {
                          const nextProductCodeInput = document.querySelector(
                            `input[name="product_code_${nextRow.pi_product_id}"]`
                          );
                          if (nextProductCodeInput) nextProductCodeInput.focus();
                        } else {
                          // If no next row, focus the first product code input of a new row
                          addNewRow();
                          setTimeout(() => {
                            const newRow = rows[rows.length - 1];
                            const newProductCodeInput = document.querySelector(
                              `input[name="product_code_${newRow.pi_product_id}"]`
                            );
                            if (newProductCodeInput) newProductCodeInput.focus();
                          }, 100);
                        }
                      }
                    }}
                  />
                </td>
                <td style={{ padding: '0.3rem' }}>
                  <Input
                    type="text"
                    bsSize="sm"
                    value={Number(p.qty * p.price).toFixed(2)}
                    readOnly
                    style={{ width: '80px', textAlign: 'right' }}
                    name={`total_${p.pi_product_id}`}
                  />
                </td>
                <td style={{ padding: '0.3rem', minWidth: "60px", textAlign: "center" }}>
                  <div className="d-flex" >
                    <Input
                      type="text"
                      bsSize="sm"
                      value={p?.discount_percentage === 0 ? '' : p?.discount_percentage}
                      onBlur={(e) => {
                        const val = e.target.value;
                        const num = val === '' ? 0 : parseFloat(val);
                        handleRowChange(p.pi_product_id, 'discount_percentage', num);
                      }}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d*\.?\d{0,2}$/.test(val)) {
                          handleRowChange(p.pi_product_id, 'discount_percentage', val);
                        }
                      }}
                      onFocus={(e) => e.target.select()}
                      style={{ width: '50%', marginRight: '2px', textAlign: 'right' }}
                      name={`discount_percentage_${p.pi_product_id}`}
                  />
                    <Input
                      type="text"
                      bsSize="sm"
                      value={p?.discount_amount === 0 ? '' : p?.discount_amount}
                      onBlur={(e) => {
                        const val = e.target.value;
                        const num = val === '' ? 0 : parseFloat(val);
                        handleRowChange(p.pi_product_id, 'discount_amount', num);
                      }}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d*\.?\d{0,2}$/.test(val)) {
                          handleRowChange(p.pi_product_id, 'discount_amount', val);
                        }
                      }}
                      onFocus={(e) => e.target.select()}
                      style={{ width: '50%', textAlign: 'right' }}
                      name={`discount_amount_${p.pi_product_id}`}
                    />
                  </div>
                </td>
                <td style={{ padding: '0.3rem' }}>
                  <Input
                    type="text"
                    bsSize="sm"
                    value={Number(p.grossTotal).toFixed(2)}
                    readOnly
                    style={{ width: '80px', textAlign: 'right' }}
                    name={`gross_total_${p.pi_product_id}`}
                   />
                </td>
                <td style={{ padding: '0.3rem', whiteSpace: 'nowrap' }}>
                  <Button
                    size="sm"
                    color="danger"
                    className="me-1"
                    onClick={() => deleteRow(idx,p.pi_product_id)}
                    style={{ padding: '0.1rem 0.3rem', fontSize: '0.7rem' }}
                  >
                    🗑
                  </Button>
                   <Button
                    size="sm"
                    color="success"
                    className="me-1"
                    onClick={() => handleAddExtraFields(p.pi_product_id)}
                    style={{ padding: '0.1rem 0.3rem', fontSize: '0.7rem' }}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </Button>
                  <Button size="sm" color="info" onClick={() => handleViewProductInfo(p)} style={{ padding: '0.1rem 0.3rem', fontSize: '0.7rem' }}>
                    ℹ
                  </Button>
                </td>
              </tr>
              {p.showExtraFields && (
                <tr>
                  <td style={{ padding: '0.3rem' }}></td> {/* Empty for S No */}
                  <td colSpan={1} style={{ padding: '0.3rem' }}>
                    <Label className="small mb-1">Remarks</Label>
                    <Input
                      type="text"
                      placeholder="Remarks"
                      style={{ fontSize: '0.75rem', padding: '0.1rem' }}
                      value={p.remarks}
                      onChange={(e) => handleRowChange(p.pi_product_id, 'remarks', e.target.value)}
                    />
                  </td>
                  <td style={{ padding: '0.3rem' }}></td> {/* Empty for Product Name */}
                  <td colSpan={1} style={{ padding: '0.3rem' }}>
                    <Label className="small mb-1">Foc Qty</Label>
                    <Input
                      type="number"
                      placeholder="Foc Qty"
                      style={{ fontSize: '0.75rem', padding: '0.1rem' }}
                      value={p.foc_qty}
                      onChange={(e) => handleRowChange(p.pi_product_id, 'foc_qty', e.target.value)}
                    />
                  </td>
                  <td style={{ padding: '0.3rem' }}></td> {/* Empty for Loose Qty */}
                  <td colSpan={1} style={{ padding: '0.3rem' }}>
                    <Label className="small mb-1">Uom</Label>
                    <Input
                      type="select"
                      style={{ fontSize: '0.75rem', padding: '0.1rem', width: '100%' }}
                      value={p.UOM || ''}
                      onChange={(e) => handleRowChange(p.pi_product_id, 'UOM', e.target.value)}
                    >
                      <option>Uom</option>
                      {/* You might want to populate these options dynamically based on your product data */}
                      <option value="Pcs">Pcs</option>
                      <option value="Kg">Kg</option>
                    </Input>
                  </td>
                  <td colSpan={1} style={{ padding: '0.3rem' }}>
                    <Label className="small mb-1">Kilo Price</Label>
                    <Input
                      type="text"
                      placeholder="Kilo Price"
                      style={{ fontSize: '0.75rem', padding: '0.1rem' }}
                      value={p.kilo_price || ''}
                      onChange={(e) => handleRowChange(p.pi_product_id, 'kilo_price', e.target.value)}
                    />
                  </td>
                  <td colSpan={1} style={{ padding: '0.3rem' }}>
                    <Label className="small mb-1">Standard Rate</Label>
                    <Input
                      type="select"
                      name="standard_rate"
                      style={{ fontSize: '0.75rem', padding: '0.1rem' }}
                      value={p.standard_rate || ''}
                      onChange={(e) => handleRowChange(p.pi_product_id, 'standard_rate', e.target.value)}
                    >
                      <option>Standard Rate</option>
                      {/* You might want to populate these options dynamically based on your product data */}
                      <option value="rate1">Rate 1</option>
                      <option value="rate2">Rate 2</option>
                    </Input>
                  </td>
                  <td style={{ padding: '0.3rem' }}></td> {/* Empty for Gross Total */}
                  <td style={{ padding: '0.3rem' }}></td> {/* Empty for Actions */}
                </tr>
              )}
            </React.Fragment>
            ))})
          {/* Summary Row */}
          <tr style={{ fontWeight: "bold", color: "#007bff", fontSize: '0.75rem' }}>
            <td style={{ padding: '0.3rem' }}>
              <Button
                size="sm"
                color="success"
                onClick={addNewRow}
                style={{ padding: '0.1rem 0.3rem', fontSize: '0.7rem' }}
              >
                <FontAwesomeIcon icon={faPlus} />
              </Button>
            </td>
            <td colSpan={1} style={{ textAlign: "right", padding: '0.3rem' }}>
              Summary:
            </td>
            <td style={{ padding: '0.3rem' }}></td> {/* Empty for Product Name */}
            <td style={{ padding: '0.3rem' }}>{summary.cartonQty.toFixed(2)}</td>
            <td style={{ padding: '0.3rem' }}>{summary.looseQty.toFixed(2)}</td>
            <td style={{ padding: '0.3rem' }}>{summary.qty.toFixed(2)}</td>
            <td style={{ padding: '0.3rem' }}>{summary.cartonPrice.toFixed(2)}</td>
            <td style={{ padding: '0.3rem' }}>{summary.price}</td>
            <td style={{ padding: '0.3rem' }}>{summary.total}</td>
            <td style={{ padding: '0.3rem' }}></td>
            <td style={{ padding: '0.3rem' }}>{summary.grossTotal}</td>
            <td style={{ padding: '0.3rem' }}></td>
          </tr>
        </tbody>
      </Table>
            </Form>
          {/* </CardBody>
        </Card> */}
      </Container>

      {/* Fixed Footer */}
    <div
  className="border-top p-2"
  style={{
    background: "linear-gradient(to right, #fafafa, #f0f0f0)",
    fontSize: "13px",
    position: "sticky",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1050,
  }}
>
  <Container fluid>
    {/* === Top Row === */}
    <Row className="align-items-center mb-1 text-muted small">
        <Col><strong>UOM:</strong> {selectedProduct ? Number(selectedProduct.uom): ''}</Col>
      <Col>Pieces/Carton: <span className="text-primary">{selectedProduct ? Number(selectedProduct.carton_qty).toFixed(2) : '0.00'}</span></Col>
      <Col>Purchase UnitCost: <span className="text-primary">{selectedProduct ? Number(selectedProduct.price).toFixed(2) : '0.00'}</span></Col>
      <Col>Wholesale Price: <span className="text-primary">{selectedProduct ? Number(selectedProduct.price).toFixed(2) : '0.00'}</span></Col>
      <Col>Carton Price: <span className="text-primary">{selectedProduct ? Number(selectedProduct.carton_price).toFixed(2) : '0.00'}</span></Col>
      <Col>CQty: <span className="text-primary">{selectedProduct ? Number(selectedProduct.carton_qty).toFixed(2) : '0.00'}</span></Col>
      <Col>Qty On Hand: <span className="text-primary">{selectedProduct ? Number(selectedProduct.qty).toFixed(2) : '0.00'}</span></Col>
    </Row>

    {/* === Middle Row === */}
    <Row className="align-items-start">
      {/* Left column */}
      <Col md="3">
        <FormGroup className="mb-1">
          <Label className="small mb-1">Bill Discount : $</Label>
          <Input bsSize="sm" value="0" />
        </FormGroup>
        <div>Total Product: <strong>{rows?.length}</strong></div>
      </Col>

      {/* Center column (center aligned) */}
      <Col md="6" className="text-center">
        <div className="text-muted small">
          Additional Charges <span className="text-primary">0.00</span>
        </div>
        <div className="text-muted small">
          Additional Discount <span className="text-primary">0.00</span>
        </div>
        <div className="fw-bold mt-1">
          Final Total : <span>{Number(finalTotal)?.toFixed(2)}</span>
        </div>
      </Col>

      {/* Right column */}
      <Col md="3">
        <div className="d-flex justify-content-between small">
          <strong>➤ Sub Total:</strong>
          <span className="text-primary">${Number(subtotal).toFixed(2)}</span>
        </div>
        <div className="d-flex justify-content-between small">
          <strong>➤ Tax:</strong>
          <span className="text-primary">${Number(tax).toFixed(2)}</span>
        </div>
        <div className="d-flex justify-content-between fw-bold">
          <span>Net Total:</span>
          <span className="text-primary">${Number(finalTotal).toFixed(2)}</span>
        </div>
      </Col>
    </Row>

    {/* === Footer Buttons === */}
  <Row className="mt-2" style={{ backgroundColor: '#212529', padding: '8px' }}>
  {/* Cancel on left */}
  <Col className="d-flex justify-content-start">
    <Button size="sm" style={{ backgroundColor: '#6c757d', borderColor: '#6c757d', color: '#fff' }} className="me-2"  onClick={()=>navigate('/PurchaseInvoice')}>
      Cancel
    </Button>
  </Col>

  {/* Print + Save on right */}
  <Col className="d-flex justify-content-end">
    {/* <Button size="sm" style={{ backgroundColor: '#6c757d', borderColor: '#6c757d', color: '#fff' }} className="me-2">
      <FontAwesomeIcon icon={faPrint} className="me-1" />
    <PdfPurchaseInvoice id={id} />
    </Button> */}
    <div className="btn-group">
      <Button size="sm" style={{ backgroundColor: '#213042', borderColor: '#213042', color: '#fff' }} onClick={()=>handleSubmit()}>
        Save
      </Button>
      <Button
        size="sm"
        style={{ backgroundColor: '#213042', borderColor: '#213042', color: '#fff' }}
        className="dropdown-toggle dropdown-toggle-split"
        data-bs-toggle="dropdown"
      >
        <span className="visually-hidden">Toggle Dropdown</span>
      </Button>
      <div className="dropdown-menu dropdown-menu-end">
        <button className="dropdown-item">Save & New</button>
        <button className="dropdown-item">Save & Close</button>
      </div>
    </div>
  </Col>
</Row>
  </Container>
</div>
 {productInfoModal && <ProductInfoModal
        isOpen={productInfoModal}
        toggle={toggleProductInfoModal}
        selectedProduct={selectedProduct}
      />}

   
    </div>
  );
};

export default PurchaseInvoiceDetails;
