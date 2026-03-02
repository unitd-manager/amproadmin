/*eslint-disable*/
import React, { useState,useEffect, useRef} from "react";
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
// import PurchaseOrderProductInfoModal from "../../components/PurchaseOrder/PurchaseOrderProductInfoModal";
import PurchaseOrderProductInfoModal from "../../components/PurchaseOrder/PurchaseOrderProductInfoModal";
// import PdfPurchaseInvoice from "../../components/PDF/PdfPurchaseInvoice";
import Currency from '../../components/PurchaseOrder/Currency';
const GoodsReturnEdit = () => {

  const [productInfoModal, setProductInfoModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSNo, setSelectedSNo] = useState(null);
  const [selectedUOM, setSelectedUOM] = useState('');
  const [openProductSelectForRowIndex, setOpenProductSelectForRowIndex] = useState(null); // newly added row: open Select by default
  const cartonPriceRefs = useRef([]);
  const productCodeRefs = useRef([]); // keeps Select refs
  const cartonQtyRefs = useRef([]);
  const looseQtyRefs = useRef([]);
  const priceRefs = useRef([]);
  const discountPercentageRefs = useRef([]);
  const discountAmountRefs = useRef([]);
  const grossTotalRefs = useRef([]);
  const tableRef = useRef(null);
  const initialFormRef = useRef({});


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
      po_product_id: 'new-0'
    },

  ]);
  
    const [billDiscount, setBillDiscount] = React.useState(0);
  const handleAddExtraFields = (id) => {
    setRows(rows.map(p =>
      p.po_product_id === id ? { ...p, showExtraFields: !p.showExtraFields, remarks: p.remarks || '', foc_qty: p.foc_qty || 0 } : p
    ));
  };


  let subtotal = rows.reduce((acc, p) => acc + (Number(p.total_price) || 0), 0);
  const tax = subtotal * 0.09;
  let finalTotal = subtotal + tax;
  const summary = rows.reduce(
    (acc, p) => {
      acc.cartonQty += Number(p.carton_qty || 0);
      acc.looseQty += Number(p.loose_qty || 0);
      acc.qty += Number(p.qty || 0);
      acc.cartonPrice += Number(p.carton_price || 0);
      acc.price += Number(p.price || 0);
      acc.total += Number(p.qty || 0) * Number(p.price || 0);
      acc.grossTotal += Number(p.total_price || 0);
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
const handleKeyDown = (e) => {
  if (e.key === "Enter") {
    e.preventDefault(); // prevent form submission
    const form = e.target.form;
    const index = Array.prototype.indexOf.call(form, e.target);
    form.elements[index + 1]?.focus(); // focus next element if exists
  }
};

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
    api.post("/purchaseorder/getGoodsReturnProductByGoodsReturnId",{goods_return_id:id}).then((response) => { 
      const data = response.data.data || [];
      const updatedRows = (Array.isArray(data) ? data : []).map(product => {
        const totalVal = Number(product.total) || (Number(product.qty || 0) * Number(product.price || 0));
        const grossVal = totalVal - (Number(product.discount_amount) || 0);
        return {
          ...product,
          total: totalVal,
          total_price: grossVal,
          grossTotal: grossVal
        };
      });
      // Ensure at least one row so user always sees a product row (with "Select Product") and "+ Add" works
      setRows(updatedRows.length > 0 ? updatedRows : [{
        po_product_id: 'new-0',
        product_code: '',
        product_name: '',
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
      }]);
      setTableData(Array.isArray(data) ? data : []);
    });

    // Fetch supplier options for dropdown
    api.post("/purchaseorder/getGoodsReturnById",{goods_return_id:id}).then((response) => {
      const initial = response.data.data[0] || {};
      initialFormRef.current = initial;
      setFormData(initial);
      setBillDiscount(initial?.bill_discount || 0);
    });
  
    api.post("/currency/getCuerrencyByGoodsReturnId",{goods_return_id:id}).then((response) => {
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
const handleDiscountChange=(value)=>{
setBillDiscount(parseFloat(value) || 0);
}
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
          updatedFormData.company_name = selectedSupplier.supplier_name;
          updatedFormData.contact_person = selectedSupplier.contact_person;
          updatedFormData.contact_address1 = selectedSupplier.address_flat;
          updatedFormData.contact_address2 = selectedSupplier.address_street;
          updatedFormData.contact_address3 = selectedSupplier.address_state;
        updatedFormData.supplier_name = selectedSupplier.supplier_name;
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
      console.log('selectedProduct:', selectedProduct);
      const base = products.find(pr => String(pr.product_id) === String(selectedProduct.value));
      const updatedRows = [...rows];
      updatedRows[index].product_id = selectedProduct.value;
      updatedRows[index].product_code = selectedProduct.product_code || base?.product_code || '';
      updatedRows[index].product_name = selectedProduct.product_name || base?.product_name || base?.title || '';
      updatedRows[index].carton_price = base?.carton_price ?? updatedRows[index].carton_price ?? 0;
      updatedRows[index].price = base?.price ?? updatedRows[index].price ?? 0;
      updatedRows[index].uom = base?.uom ?? updatedRows[index].uom ?? '';
      updatedRows[index].carton_qty = base?.carton_qty ?? updatedRows[index].carton_qty ?? 0;
      updatedRows[index].qty = base?.qty ?? updatedRows[index].qty ?? 0;
      
      console.log('updatedRows[index].product_code:', updatedRows[index].product_code);
      setRows(updatedRows);

      if (cartonPriceRefs.current[index]) {
        cartonPriceRefs.current[index].focus();
      }
    };
  // Handle form submit (example API call structure)
  const handleSubmit = async () => {
    // const calculatedSubTotal = rows.reduce((sum, row) => sum + Number(row.total_price), 0);
    // const calculatedTaxAmount = calculatedSubTotal * 0.09;
    // const calculatedNetTotal = calculatedSubTotal + calculatedTaxAmount;

    // formData.sub_total = calculatedSubTotal;
    // formData.tax_amount = calculatedTaxAmount;
    // formData.net_total = calculatedNetTotal;
        const baseSubTotal = rows.reduce((sum, row) => sum + Number(row.total_price || 0), 0);
          const subTotalAfterBill = Number((baseSubTotal - Number(billDiscount || 0)).toFixed(2));
          const taxAmount = Number((subTotalAfterBill * 0.09).toFixed(2));
          const netTotal = Number((subTotalAfterBill + taxAmount).toFixed(2));
      
          const selectedSupplier = supplierOptions.find(s => String(s.supplier_id) === String(formData.supplier_id));
          const initial = initialFormRef.current || {};

          const payloadForm = {
            ...formData,
            contact_address1: (formData.contact_address1 && String(formData.contact_address1).trim()) || initial.contact_address1 || selectedSupplier?.address_flat || '',
            contact_address2: (formData.contact_address2 && String(formData.contact_address2).trim()) || initial.contact_address2 || selectedSupplier?.address_street || '',
            contact_address3: (formData.contact_address3 && String(formData.contact_address3).trim()) || initial.contact_address3 || selectedSupplier?.address_state || '',
            contact_person: (formData.contact_person && String(formData.contact_person).trim()) || initial.contact_person || selectedSupplier?.contact_person || '',
            company_name: (formData.company_name && String(formData.company_name).trim()) || initial.company_name || selectedSupplier?.supplier_name || '',
            supplier_name: (formData.supplier_name && String(formData.supplier_name).trim()) || initial.supplier_name || selectedSupplier?.supplier_name || '',
            bill_discount: billDiscount,
            sub_total: subTotalAfterBill,
            tax_amount: taxAmount,
            net_total: netTotal,
            grand_total: netTotal,
          };
    console.log('Submitting payloadForm (debug):', { formData, initial, selectedSupplier, payloadForm });
          if (!formData.currency_id) {
            message('Please Enter currency Details.', 'error');
            return;
          }
            if (!formData.supplier_id) {
      message('Please Select Supplier.', 'error');
      return;
    }
    const lineItems = rows.filter((el) => el.product_id);
    if (lineItems.length === 0) {
      message('Please create LineItems.', 'error');
      return;
    }
console.log('formdata',payloadForm);
    api
    .post('/purchaseorder/editGoodsReturn', payloadForm)
    .then(() => {
      const purchaseOrderId = id;
      rows?.forEach((el) => {
        if (!el.product_id) return;
        el.gross_total = el.total_price;
        const isNewRow = String(el.po_product_id || '').startsWith('new-');
        if (isNewRow) {
          const insertPayload = { ...el, goods_return_id: purchaseOrderId };
          api.post('/purchaseorder/insertGoodsReturnProduct', insertPayload).then(() => {});
        } else {
          api.post('/purchaseorder/editGoodsReturnProduct', el).then(() => {});
        }
      });
      message('Record edited successfully.', 'success');
       setTimeout(() => {
                      navigate('/GoodsReturn');
                    }, 1100);
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
              updatedRow.product_id = product.product_id;
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

          // Recalculate discount_percentage if discount_amount changes
          if (field === "discount_amount") {
            const qty = Number(updatedRow.qty || 0);
            const price = Number(updatedRow.price || 0);
            const discountAmount = Number(value || 0);
            const lineTotal = qty * price;
            updatedRow.discount_percentage = lineTotal ? ((discountAmount / lineTotal) * 100).toFixed(2) : 0;
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
      api.post('/purchaseorder/deleteGoodsReturnProduct',{po_product_id:id}).then(() => {
        message('Record deleted successfully.', 'success');
      }).catch(() => {
        message('Network connection error.', 'error');
      });
    }
    if (rows.length > 1) {
      setRows(rows.filter((_, i) => i !== index));
    }
  };

  const addRow = (insertAfterIndex) => {
    const safeIndex = Math.max(0, Number(insertAfterIndex) + 1);
    const newRow = {
      po_product_id: `new-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
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
    };
    setRows((prevRows) => {
      const updatedRows = [...prevRows];
      const insertAt = Math.min(safeIndex, updatedRows.length);
      updatedRows.splice(insertAt, 0, newRow);
      return updatedRows;
    });
    const nextIndex = safeIndex;

    // Open product Select for the new row so "Select Product" is visible and user can pick immediately
    setOpenProductSelectForRowIndex(nextIndex);

    // give React a tick to render the new Select, then focus
    setTimeout(() => {
      const ref = productCodeRefs.current[nextIndex];
      try {
        if (ref && typeof ref.focus === 'function') {
          ref.focus();
          return;
        }
        const input = document.querySelector(`#product-select-${nextIndex} input`);
        if (input) input.focus();
      } catch (err) {
        console.warn('could not focus new product select', err);
      }
    }, 80);
  };
  const handleDelete = (index,id) => {
    const updatedRows = rows.filter((row) => row.po_product_id !== id);
    setRows(updatedRows);
    deleteRow(index,id);
  };
  useEffect(() => {
  if (!formData?.supplier_id || supplierOptions.length === 0) return;

  const selectedSupplier = supplierOptions.find(
    (s) => String(s.supplier_id) === String(formData.supplier_id)
  );

  if (selectedSupplier) {
    setFormData((prev) => ({
      ...prev,
      supplier_name: selectedSupplier.supplier_name,
      company_name: selectedSupplier.supplier_name,
      contact_person: selectedSupplier.contact_person,
      contact_address1: selectedSupplier.address_flat,
      contact_address2: selectedSupplier.address_street,
      contact_address3: selectedSupplier.address_state,
      country: selectedSupplier.address_country,
      postal_code: selectedSupplier.address_po_code,
    }));
  }
}, [formData?.supplier_id, supplierOptions]);
  return (
    <div style={{ fontSize: "12px" }}>
      <ToastContainer/>
      <Container fluid className="p-1 mb-5">
            <h6 className="mb-2">Add/Edit Goods Return</h6>

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
              onChange={handleChange} onKeyDown={handleKeyDown} readOnly />
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
              onChange={handleChange} onKeyDown={handleKeyDown}/>
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
<TabPane tabId="1">
  <Row>
    {/* Supplier Code & Contact Address1 */}
    <Col md="6">
      <Row className="mb-1">
        <Col md="4">
          <Label className="small mb-1">Supplier Code</Label>
        </Col>
        <Col md="8">
<Select
  bsSize="sm"
  className="py-0 px-1"
  name="supplier_id"
  value={
    formData?.supplier_id
      ? (() => {
          const s = supplierOptions.find(
            (opt) => String(opt.supplier_id) === String(formData.supplier_id)
          );
          return s
            ? {
                value: s.supplier_id,
                supplier_code: s.supplier_code,
                supplier_name: s.supplier_name,
              }
            : null;
        })()
      : null
  }
  onChange={(selected) =>
    handleChange({
      target: { name: "supplier_id", value: selected?.value || "" },
    })
  }
  onKeyDown={handleKeyDown}
  options={supplierOptions.map((s) => ({
    value: s.supplier_id,
    supplier_code: s.supplier_code,
    supplier_name: s.supplier_name,
  }))}
  placeholder="Select Supplier"
  isClearable
  filterOption={(candidate, input) => {
    if (!input) return true;
    const q = input.toLowerCase();
    const code = String(candidate.data.supplier_code || "").toLowerCase();
    const name = String(candidate.data.supplier_name || "").toLowerCase();
    return code.includes(q) || name.includes(q);
  }}
  formatOptionLabel={(opt, { context }) =>
    context === "menu"
      ? `${opt.supplier_code || ""} - ${opt.supplier_name || ""}`
      : `${opt.supplier_code || ""}`
  }
  getOptionValue={(opt) => String(opt.value)}
  styles={{
    control: (base) => ({ ...base, minHeight: "30px", fontSize: "12px" }),
    menu: (base) => ({ ...base, fontSize: "12px" }),
  }}
/>
        
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
              onChange={handleChange}  onKeyDown={handleKeyDown} />
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
              value={formData?.supplier_name}
              onChange={handleChange}  onKeyDown={handleKeyDown} />
            
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
              onChange={handleChange}  onKeyDown={handleKeyDown} />
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
              value={formData?.contact_person}
              onChange={handleChange}
               onKeyDown={handleKeyDown}
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
              onChange={handleChange}  onKeyDown={handleKeyDown} />
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

 
</TabPane>
                {/* Currency Tab */}
                <TabPane tabId="2">
                 <>
    {/* Supplier Code & Contact Address1 */}
  
                 {/* <Row> */}
    {/* Supplier Name & Contact Address2 */}
    {/* <Col md="6">
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
  </Row> */}
<Currency settingdetails={formData} setSettingDetails={setFormData} handleInputs={handleChange} />
    
      </>
                </TabPane>
              </TabContent>

              {/* Table */}
    <Table id="example" className="display border border-secondary rounded" ref={tableRef}>
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
              <tr key={p.po_product_id} style={{ fontSize: '13px', height: '20px', background:  '#fff' }}>
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
      product_code: pr.product_code,
      product_name: pr.product_name,
    }))}
    value={
      p.product_id
        ? {
            value: p.product_id,
            product_code: p.product_code,
            product_name: p.product_name,
          }
        : null
    }
    placeholder="Select Product"
    menuIsOpen={openProductSelectForRowIndex === idx ? true : undefined}
    onMenuClose={() => setOpenProductSelectForRowIndex(null)}
    onChange={(selectedOption) => {
      setOpenProductSelectForRowIndex(null);
      handleProductSelect(idx, selectedOption);
      if (cartonQtyRefs.current[idx]) {
        cartonQtyRefs.current[idx].focus();
      }
    }}
      styles={{
    control: (base) => ({
      ...base,
      fontSize: "12px",
      minHeight: "30px"
     
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
      fontSize: "12px", 
      width: '300px'  // keep it above modal, table, etc.
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999   // just in case
    })
  }}
    formatOptionLabel={(opt, { context }) =>
      context === 'menu'
        ? `${opt.product_code || ''} - ${opt.product_name || ''}`
        : `${opt.product_code || ''}`
    }
    getOptionValue={(opt) => String(opt.value)}
    filterOption={(candidate, input) => {
      if (!input) return true;
      const lowerInput = input.toLowerCase();
      return (
        candidate.data.product_code.toLowerCase().includes(lowerInput) ||
        candidate.data.product_name.toLowerCase().includes(lowerInput)
      );
    }}
    // assign ref so we can call focus() on the react-select instance
    ref={(el) => (productCodeRefs.current[idx] = el)}
    inputId={`product-select-${idx}`}
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
                <td style={{ padding: '0.3rem' }}>
                  <Input
                    type="number"
                    bsSize="sm"
                    value={p.carton_qty}
                    onChange={(e) => handleRowChange(p.po_product_id, 'carton_qty', e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (looseQtyRefs.current[idx]) {
                          looseQtyRefs.current[idx].focus();
                        }
                      }
                    }}
                    innerRef={(el) => (cartonQtyRefs.current[idx] = el)}
                    style={{ width: '100%', fontSize: '12px' }}
                  />
                </td>
                <td style={{ padding: '0.3rem' }}>
                  <Input
                    type="number"
                    bsSize="sm"
                    value={p?.loose_qty}
                    onChange={(e) => handleRowChange(p.po_product_id, 'loose_qty', e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (cartonPriceRefs.current[idx]) {
                          cartonPriceRefs.current[idx].focus();
                        }
                      }
                    }}
                    innerRef={(el) => (looseQtyRefs.current[idx] = el)}
                    style={{ width: '100%', fontSize: '12px' }}
                  />
                </td>
                <td style={{ padding: '0.3rem' }}>{p.qty}</td>
                <td style={{ padding: '0.3rem' }}>
                  <Input
                    type="number"
                    bsSize="sm"
                    value={Number(p?.carton_price)}
                    onChange={(e) => handleRowChange(p.po_product_id, 'carton_price', e.target.value)}
                    style={{ width: '80px' }}
                    innerRef={(el) => (cartonPriceRefs.current[idx] = el)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (priceRefs.current[idx]) {
                          priceRefs.current[idx].focus();
                        }
                      }
                    }}
                  />
                </td>
                <td style={{ padding: '0.3rem' }}>
                  <Input
                    type="number"
                    bsSize="sm"
                    value={Number(p?.price)}
                    onChange={(e) => handleRowChange(p.po_product_id, 'price', e.target.value)}
                    style={{ width: '80px' }}
                    innerRef={(el) => (priceRefs.current[idx] = el)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (discountPercentageRefs.current[idx]) {
                          discountPercentageRefs.current[idx].focus();
                        }
                      }
                    }}
                  />
                </td>
                <td style={{ padding: '0.3rem' }}>
                  <Input
                    type="number"
                    bsSize="sm"
                    value={Number(p.qty * p.price)}
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
                      value={Number(p?.discount_percentage)}
                      onChange={(e) => handleRowChange(p.po_product_id, 'discount_percentage', e.target.value)}
                      style={{ width: '50%', marginRight: '2px' }}
                      innerRef={(el) => (discountPercentageRefs.current[idx] = el)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (discountAmountRefs.current[idx]) {
                            discountAmountRefs.current[idx].focus();
                          }
                        }
                      }}
                    />
                    <Input
                      type="number"
                      bsSize="sm"
                      value={Number(p?.discount_amount)}
                      onChange={(e) => handleRowChange(p.po_product_id, 'discount_amount', e.target.value)}
                      style={{ width: '50%' }}
                      innerRef={(el) => (discountAmountRefs.current[idx] = el)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (grossTotalRefs.current[idx]) {
                            grossTotalRefs.current[idx].focus();
                          }
                        }
                      }}
                    />
                  </div>
                </td>
                <td style={{ padding: '0.3rem' }}>
                  <Input
                    type="number"
                    bsSize="sm"
                    value={Number(p.grossTotal).toFixed(2)}
                    onChange={(e) => handleRowChange(p.po_product_id, 'grossTotal',e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        // insert a new row *after* current index and focus its product select
                        addRow(idx);
                      }
                    }}
                    style={{ width: '80px' }}
                    innerRef={(el) => (grossTotalRefs.current[idx] = el)}
                  />
                </td>
                <td style={{ padding: '0.3rem', whiteSpace: 'nowrap' }}>
                  <Button
                    size="sm"
                    color="danger"
                    className="me-1"
                    onClick={() => handleDelete(idx,p.po_product_id)}
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
                      <option>ZR - Zero Rate</option>
                      {/* You might want to populate these options dynamically based on your product data */}
                      <option value="rate1">In - Tax Inclusive</option>
                     
                    </Input>
                  </td>
                  <td style={{ padding: '0.3rem' }}></td> {/* Empty for Gross Total */}
                  <td style={{ padding: '0.3rem' }}></td> {/* Empty for Actions */}
                </tr>
              )}
            </React.Fragment>
            ))}
          {/* Summary Row */}
          <tr style={{ fontWeight: "bold", color: "#007bff", fontSize: '0.75rem' }}>
            <td colSpan={2} style={{ padding: '0.3rem' }}>
              <Button
                size="sm"
                color="primary"
                onClick={() => addRow(rows.length - 1)}
                style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', marginRight: '0.5rem' }}
              >
                + Add
              </Button>
              <span style={{ marginLeft: '0.5rem' }}>Summary:</span>
            </td>
            <td style={{ padding: '0.3rem' }}></td> {/* Empty for Product Name */}
            <td style={{ padding: '0.3rem' }}>{summary.cartonQty.toFixed(2)}</td>
            <td style={{ padding: '0.3rem' }}>{summary.looseQty.toFixed(2)}</td>
            <td style={{ padding: '0.3rem' }}>{summary.qty.toFixed(2)}</td>
            <td style={{ padding: '0.3rem' }}>{summary.cartonPrice.toFixed(2)}</td>
            <td style={{ padding: '0.3rem' }}>{summary.price}</td>
            <td style={{ padding: '0.3rem' }}>{summary.total}</td>
            <td style={{ padding: '0.3rem' }}></td>
            <td style={{ padding: '0.3rem' }}>{Number(summary?.grossTotal).toFixed(2)}</td>
            <td style={{ padding: '0.3rem' }}></td>
          </tr>
        </tbody>
      </Table>
            </Form>
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
           <Input
                               type="number"
                               name="bill_discount"
                               value={billDiscount}
                               onChange={(e) => handleDiscountChange(e.target.value)}
                              
                               style={{ width: '100px', height: '28px' }}
                             />
        </FormGroup>
        <div>Total Product: <strong>{rows?.length}</strong></div>
      </Col>

      {/* Center column (center aligned) */}
      <Col md="6" className="text-center">
      </Col>

      {/* Right column */}
      <Col md="3">
        <div className="d-flex justify-content-between small">
          <strong>➤ Sub Total:</strong>
          <span className="text-primary">${Number(subtotal - parseFloat(billDiscount)).toFixed(2)}</span>
        </div>
        <div className="d-flex justify-content-between small">
          <strong>➤ Tax:</strong>
          <span className="text-primary">${Number(((subtotal - Number(billDiscount || 0)) * 0.09)).toFixed(2)}</span>
        </div>
        <div className="d-flex justify-content-between fw-bold">
          <span>Net Total:</span>
          <span className="text-primary">${Number(((subtotal - Number(billDiscount || 0)) * 1.09)).toFixed(2)}</span>
        </div>
      </Col>
    </Row>

    {/* === Footer Buttons === */}
  <Row className="mt-2" style={{ backgroundColor: '#212529', padding: '8px' }}>
  {/* Cancel on left */}
  <Col className="d-flex justify-content-start">
    <Button size="sm" style={{ backgroundColor: '#6c757d', borderColor: '#6c757d', color: '#fff' }} className="me-2"  onClick={()=>navigate('/GoodsReturn')}>
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
      {/* <Button
        size="sm"
        style={{ backgroundColor: '#213042', borderColor: '#213042', color: '#fff' }}
        className="dropdown-toggle dropdown-toggle-split"
        data-bs-toggle="dropdown"
      >
        <span className="visually-hidden">Toggle Dropdown</span>
      </Button> */}
      {/* <div className="dropdown-menu dropdown-menu-end">
        <button className="dropdown-item">Save & New</button>
        <button className="dropdown-item">Save & Close</button>
      </div> */}
    </div>
  </Col>
</Row>
  </Container>
</div>
 {productInfoModal && <PurchaseOrderProductInfoModal
        isOpen={productInfoModal}
        toggle={toggleProductInfoModal}
        selectedProduct={selectedProduct}
      />}

   
    </div>
  );
};

export default GoodsReturnEdit;
