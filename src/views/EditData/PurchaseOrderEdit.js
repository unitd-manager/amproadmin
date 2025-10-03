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
import { ToastContainer } from "react-toastify";
import Select from "react-select";
import message from '../../components/Message';
import { FaTrashAlt, FaPlusCircle } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faPlus, faPrint } from '@fortawesome/free-solid-svg-icons';
import api from "../../constants/api";
import ProductInfoModal from "../../components/PurchaseOrder/ProductInfoModal";
import PdfPurchaseInvoice from "../../components/PDF/PdfPurchaseInvoice";

const PurchaseOrderEdit = () => {

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
  const handleAddExtraFields = (id) => {
    setRows(rows.map(p =>
      p.po_product_id === id ? { ...p, showExtraFields: !p.showExtraFields, remarks: p.remarks || '', foc_qty: p.foc_qty || 0 } : p
    ));
  };


  const subtotal = rows.reduce((acc, p) => acc + (Number(p.total) || 0), 0);
  const tax = subtotal * 0.09;
  const finalTotal = subtotal + tax;
  // Calculate totals
  const summary = rows.reduce(
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
    
    // Fetch table data
    api.post("/purchaseorder/getPoProductByPurchaseOrderId",{purchase_order_id:id}).then((response) => { 
      const updatedRows = response.data.data.map(product => ({
        ...product,
        total: Number(product.total) || 0,
        grossTotal: (Number(product.total) || 0) - (Number(product.discount_amount) || 0)
      }));
      setRows(updatedRows);
      setTableData(response.data.data);
    });

    // Fetch supplier options for dropdown
    api.post("/purchaseorder/getPurchaseOrderById",{purchase_order_id:id}).then((response) => {
      setFormData(response.data.data[0]);
    });
  
    api.post("/currency/getCuerrencyByPurchaseOrderId",{purchase_order_id:id}).then((response) => {
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
    const calculatedSubTotal = rows.reduce((sum, row) => sum + Number(row.total_price), 0);
    const calculatedTaxAmount = calculatedSubTotal * 0.09;
    const calculatedNetTotal = calculatedSubTotal + calculatedTaxAmount;

    formData.sub_total = calculatedSubTotal;
    formData.tax_amount = calculatedTaxAmount;
    formData.net_total = calculatedNetTotal;

    api
    .post('/purchaseorder/editPurchaseOrder', formData)
    .then(() => {
      api
      .post('/currency/editCurrency', currency) 
      .then(() => {})
      
      rows?.forEach((el)=>{
       el.gross_total=el.total_price;
        api
      .post('/purchaseorder/editPoProduct', el) 
      .then(() => {})
      })
     
      message('Record edited successfully.', 'success');
      setTimeout(() => {
        window.location.reload();
      }, 300);
    })
    .catch(() => {
      message('Network connection error.', 'error');
    });
  };
  const handleRowChange = (id, field, value) => {
    setRows(prevRows =>
      prevRows.map(row => {
        if (row.po_product_id === id) {
          const updatedRow = { ...row, [field]: value };

          if (field === "product_code") {
            const product = tableData.find(item => item.product_code === value);
            if (product) {
              updatedRow.product_name = product.product_name;
              updatedRow.carton_price = product.carton_price;
              updatedRow.qty = 0;
              updatedRow.loose_qty = 0;
              updatedRow.carton_qty = 0;
              updatedRow.discount = 0;
              updatedRow.total = 0;
              updatedRow.total_price = 0;
            } else {
              updatedRow.product_name = "";
              updatedRow.carton_price = 0;
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
            updatedRow.total = preDiscountGrossTotal; // This is the total before discount
            updatedRow.grossTotal = grossTotal; // This is the total after discount
            updatedRow.total_price = grossTotal; // Assuming total_price is the final gross total
          }

          if (field === 'total' || field === 'discount_amount') {
            updatedRow.grossTotal = (Number(updatedRow.total) || 0) - (Number(updatedRow.discount_amount) || 0);
          }
          return updatedRow;
        }
        return row;
      })
    );
  };

  console.log('rows',rows);
  console.log('formdata',formData);
  const deleteRow = (index,id) => {
    if(id){
      api.post('/purchaseorder/deletePoProduct',{po_product_id:id}).then(() => {
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
    <div style={{ fontSize: "12px" }}>
      <ToastContainer/>
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
              onChange={handleChange} />
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
              onChange={handleChange} />
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
    <Col md="6">
      <Row className="mb-1">
        <Col md="4">
          <Label className="small mb-1">Supplier Code</Label>
        </Col>
        <Col md="8">
        <Input
            bsSize="sm" className="py-0 px-1"  
              type="select"
              name="supplier_id"
              value={formData?.supplier_id}
              onChange={handleChange}
            >
              <option value="">Select Supplier</option>
              {supplierOptions.map((supplier, index) => (
                <option key={index} value={supplier.supplier_id}>
                  {supplier.supplier_code}
                </option>
              ))}
            </Input>
        
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
              onChange={handleChange} />
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
          <FormGroup>
             <Input bsSize="sm" className="py-0 px-1"  name="company_name"
              value={formData?.company_name}
              onChange={handleChange} />
            
          </FormGroup>
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
              onChange={handleChange} />
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
          />
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
              onChange={handleChange} />
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
              onChange={handleChange} />
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
              onChange={handleChange} />
        </Col>
        <Col md="3">
          <Input bsSize="sm" className="py-0 px-1"  name="postal_code"
              value={formData?.postal_code}
              onChange={handleChange} />
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
              onChange={handleChange} />
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
              onChange={handleChange} />
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
              onChange={handleChange} />
        </Col>
      </Row>
    </Col>
    <Col md="6">
      <Row className="mb-1">
        <Col md="4">
          <Label className="small mb-1">DO No</Label>
        </Col>
        <Col md="8">
          <Input bsSize="sm" className="py-0 px-1" name="do_no"
              value={formData?.do_no}
              onChange={handleChange} />
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
              onChange={handleCurrency}/>
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
              onChange={handleCurrency} />
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
              onChange={handleCurrency} />
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
    <col style={{ width: "6rem" }} /> {/* Product Code */}
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
            <th style={{ padding: '0.3rem' }}>Product Code</th>
            <th style={{ padding: '0.3rem' }}>Product Name</th>
            <th style={{ padding: '0.3rem' }}>Carton Qty</th>
            <th style={{ padding: '0.3rem' }}>Loose Qty</th>
            <th style={{ padding: '0.3rem' }}>Qty</th>
            <th style={{ padding: '0.3rem' }}>Carton Price</th>
            <th style={{ padding: '0.3rem' }}>Price</th>
            <th style={{ padding: '0.3rem' }}>Total</th>
            <th style={{ padding: '0.3rem', textAlign: 'center' }}>% Discount $</th>
            <th style={{ padding: '0.3rem' }}>Gross Total</th>
            <th style={{ padding: '0.3rem' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p, idx) => (
            <React.Fragment key={p.po_product_id}>
              <tr key={p.po_product_id}>
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
                <td style={{ padding: '0.3rem' }}>{p.product_code}</td>
                <td style={{ padding: '0.3rem' }}>{p.product_name}</td>
                <td style={{ padding: '0.3rem' }}>{p.carton_qty}</td>
                <td style={{ padding: '0.3rem' }}>{p.loose_qty}</td>
                <td style={{ padding: '0.3rem' }}>{p.qty}</td>
                <td style={{ padding: '0.3rem' }}>
                  <Input
                    type="number"
                    bsSize="sm"
                    value={Number(p?.carton_price).toFixed(2)}
                    onChange={(e) => handleRowChange(p.po_product_id, 'carton_price', e.target.value)}
                    style={{ width: '80px' }}
                  />
                </td>
                <td style={{ padding: '0.3rem' }}>
                  <Input
                    type="number"
                    bsSize="sm"
                    value={Number(p?.price).toFixed(2)}
                    onChange={(e) => handleRowChange(p.po_product_id, 'price', e.target.value)}
                    style={{ width: '80px' }}
                  />
                </td>
                <td style={{ padding: '0.3rem' }}>
                  <Input
                    type="number"
                    bsSize="sm"
                    value={Number(p.qty * p.price).toFixed(2)}
                    onChange={(e) => handleRowChange(p.po_product_id, 'total', e.target.value)}
                    style={{ width: '80px' }}
                    readOnly
                  />
                </td>
                <td style={{ padding: '0.3rem' }}>
                  <div className="d-flex" >
                    <Input
                      type="number"
                      bsSize="sm"
                      value={Number(p?.discount_percentage).toFixed(2)}
                      onChange={(e) => handleRowChange(p.po_product_id, 'discount_percentage', e.target.value)}
                      style={{ width: '50%', marginRight: '2px' }}
                    />
                    <Input
                      type="number"
                      bsSize="sm"
                      value={Number(p?.discount_amount).toFixed(2)}
                      onChange={(e) => handleRowChange(p.po_product_id, 'discount_amount', e.target.value)}
                      style={{ width: '50%' }}
                    />
                  </div>
                </td>
                <td style={{ padding: '0.3rem' }}>
                  <Input
                    type="number"
                    bsSize="sm"
                    value={Number(p.grossTotal).toFixed(2)}
                    onChange={(e) => handleRowChange(p.po_product_id, 'grossTotal',e.target.value)}
                    style={{ width: '80px' }}
                    readOnly
                  />
                </td>
                <td style={{ padding: '0.3rem', whiteSpace: 'nowrap' }}>
                  <Button
                    size="sm"
                    color="danger"
                    className="me-1"
                    onClick={() => handleDelete(p.po_product_id)}
                    style={{ padding: '0.1rem 0.3rem', fontSize: '0.7rem' }}
                  >
                    🗑
                  </Button>
                  <Button
                    size="sm"
                    color="success"
                    className="me-1"
                    onClick={() => handleAddExtraFields(p.po_product_id)}
                    style={{ padding: '0.1rem 0.3rem', fontSize: '0.7rem' }}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </Button>
                  <Button
                    size="sm"
                    color="info"
                    onClick={() => handleViewProductInfo(p)}
                    style={{ padding: '0.1rem 0.3rem', fontSize: '0.7rem' }}
                  >
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
                      onChange={(e) => handleRowChange(p.po_product_id, 'remarks', e.target.value)}
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
                      onChange={(e) => handleRowChange(p.po_product_id, 'foc_qty', e.target.value)}
                    />
                  </td>
                  <td style={{ padding: '0.3rem' }}></td> {/* Empty for Loose Qty */}
                  <td colSpan={1} style={{ padding: '0.3rem' }}>
                    <Label className="small mb-1">Uom</Label>
                    <Input
                      type="select"
                      style={{ fontSize: '0.75rem', padding: '0.1rem', width: '100%' }}
                      value={p.UOM || ''}
                      onChange={(e) => handleRowChange(p.po_product_id, 'UOM', e.target.value)}
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
                      onChange={(e) => handleRowChange(p.po_product_id, 'kilo_price', e.target.value)}
                    />
                  </td>
                  <td colSpan={1} style={{ padding: '0.3rem' }}>
                    <Label className="small mb-1">Standard Rate</Label>
                    <Input
                      type="select"
                      name="standard_rate"
                      style={{ fontSize: '0.75rem', padding: '0.1rem' }}
                      value={p.standard_rate || ''}
                      onChange={(e) => handleRowChange(p.po_product_id, 'standard_rate', e.target.value)}
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
            <td style={{ padding: '0.3rem' }}></td> {/* Empty for S No */}
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
    <Button size="sm" style={{ backgroundColor: '#6c757d', borderColor: '#6c757d', color: '#fff' }} className="me-2">
      <FontAwesomeIcon icon={faPrint} className="me-1" />
    <PdfPurchaseInvoice id={id} />
    </Button>
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

    {/* <Modal isOpen={productInfoModal} toggle={toggleProductInfoModal} size="xl">
      <ModalHeader toggle={toggleProductInfoModal}>Product Information Details</ModalHeader>
      <ModalBody>
        {selectedProduct && (
          <div>
            <Row className="mb-3">
              <Col md="6" className="d-flex align-items-center">
                <strong className="me-2" style={{ width: '120px' }}>Product Code</strong> : {selectedProduct.code}
              </Col>
              <Col md="6" className="d-flex align-items-center">
                <strong className="me-2" style={{ width: '120px' }}>Product Name</strong> : {selectedProduct.name}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md="6" className="d-flex align-items-center">
                <strong className="me-2" style={{ width: '120px' }}>Product UOM</strong> : {selectedProduct.UOM}
              </Col>
              <Col md="6" className="d-flex align-items-center">
                <strong className="me-2" style={{ width: '120px' }}>Product Price</strong> : {selectedProduct['Product Price']}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md="6" className="d-flex align-items-center">
                <strong className="me-2" style={{ width: '120px' }}>Retail Price</strong> : {selectedProduct['Retail Price']}
              </Col>
              <Col md="6" className="d-flex align-items-center">
                <strong className="me-2" style={{ width: '120px' }}>Wholesale Price</strong> : {selectedProduct['Wholesale Price']}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md="6" className="d-flex align-items-center">
                <strong className="me-2" style={{ width: '120px' }}>Stock Qty</strong> : {selectedProduct['Stock Qty']}
              </Col>
              <Col md="6" className="d-flex align-items-center">
                <strong className="me-2" style={{ width: '120px' }}>Product Weight</strong> : {selectedProduct['Product Weight']}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md="6" className="d-flex align-items-center">
                <strong className="me-2" style={{ width: '120px' }}>Stock WQty</strong> : {selectedProduct['Stock WQty']}
              </Col>
            </Row>

            <Row className="mb-3 align-items-center">
              <Col md="3">
                <strong className="me-2">From Date</strong>
                <Input type="date" />
              </Col>
              <Col md="3">
                <strong className="me-2">To Date</strong>
                <Input type="date" />
              </Col>
              <Col md="2">
                <Button color="primary" className="mt-4">Search</Button>
              </Col>
            </Row>

            <h6>Purchase History</h6>
            <Table bordered size="sm">
              <thead>
                <tr>
                  <th>Invoice No</th>
                  <th>Invoice Date</th>
                  <th>Description</th>
                  <th>Supplier</th>
                  <th>UOM</th>
                  <th>Qty</th>
                  <th>NetPrice</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>PI202509-000136</td>
                  <td>20/09/2025</td>
                  <td>AMPRO TRADITIONAL TRIANGLE PATIS COOKIES 1147G</td>
                  <td>INNOVA FOODS SDN BHD</td>
                  <td>1X6</td>
                  <td>30</td>
                  <td>3.70</td>
                </tr>
                <tr>
                  <td>PI202509-000136</td>
                  <td>20/09/2025</td>
                  <td>AMPRO TRADITIONAL TRIANGLE PATIS COOKIES 1147G</td>
                  <td>INNOVA FOODS SDN BHD</td>
                  <td>1X6</td>
                  <td>30</td>
                  <td>3.70</td>
                  <td>5</td>
                  <td>5.20</td>
                </tr>
              </tbody>
            </Table>
          </div>
        )}
      </ModalBody>
    </Modal> */}
    </div>
  );
};

export default PurchaseOrderEdit;
