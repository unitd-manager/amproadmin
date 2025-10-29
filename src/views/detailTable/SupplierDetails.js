// import React, { useState, useEffect, useContext} from 'react';
// import { Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
// import { ToastContainer } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
// import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
// import ComponentCard from '../../components/ComponentCard';
// import api from '../../constants/api';
// import message from '../../components/Message';
// import creationdatetime from '../../constants/creationdatetime';
// import AppContext from '../../context/AppContext';

// const SupplierDetails = () => {
//   //all state variables
//   const [supplierForms, setSupplierForms] = useState({
//     company_name: '',
//   });
//   //navigation and params
//   const navigate = useNavigate();
//   const { loggedInuser } = useContext(AppContext);
//   //supplierData in supplier details
//   const handleInputsSupplierForms = (e) => {
//     setSupplierForms({ ...supplierForms, [e.target.name]: e.target.value });
//   };
//   //inserting supplier data
 

//   const insertSupplier = (code) => {
//     if (supplierForms.company_name !== '') {
//       supplierForms.supplier_code = code;
//       supplierForms.creation_date = creationdatetime
//       supplierForms.created_by = loggedInuser.first_name;
//       api
//         .post('/supplier/insert-Supplier', supplierForms)
//         .then((res) => {
//           const insertedDataId = res.data.data.insertId;
//           message('Supplier inserted successfully.', 'success');
//           setTimeout(() => {
//             navigate(`/SupplierEdit/${insertedDataId}?tab=1`);
//           }, 300);
//         })
//         .catch(() => {
//           message('Network connection error.', 'error');
//         });
//     } else {
//       message('Please fill all required fields', 'warning');
//     }
//   };

//   const generateCode = () => {
//     api
//       .post('/commonApi/getCodeValues', { type: 'SupplierCode' })
//       .then((res) => {
//         insertSupplier(res.data.data);
//       })
//       .catch(() => {
//         insertSupplier('');
//       });
//   };


//   useEffect(() => {}, []);
//   return (
//     <div>
//        <BreadCrumbs />
//       <ToastContainer />
//       <Row>
//         <Col md="6" xs="12">
//           {/* Key Details */}
//           <ComponentCard title="Supplier Name">
//           <Form>
//               <FormGroup>
//                 <Row>
//                   <Col md="12">
//                     <Label>
//                       {' '}
//                       Supplier Name <span className="required"> *</span>{' '}
//                     </Label>
//                     <Input type="text" name="company_name" onChange={handleInputsSupplierForms} />
//                     </Col>
//                 </Row>
//               </FormGroup>
//               <FormGroup>
//                 <Row>
//           <div className="pt-3 mt-3 d-flex align-items-center gap-2">
//             <Button color="primary"
//               onClick={() => {
//                 generateCode();
//                 // setTimeout(() => {
//                 //   navigate('/SupplierEdit');
//                 // }, 800);
//               }}
//               type="button"
//               className="btn mr-2 shadow-none"  >
//               Save & Continue
//             </Button>
//             <Button
//               onClick={() => {
//                 navigate('/Supplier')
//               }}
//               type="button"
//               className="btn btn-dark shadow-none" >
//               Go to List
//             </Button>
//             </div>
//                 </Row>
//               </FormGroup>
//             </Form>
//           </ComponentCard>
//         </Col>
//       </Row>
//     </div>
//   );
// };

// export default SupplierDetails;

/*eslint-disable*/
import React, { useState,useEffect, useRef, createRef} from "react";
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


const SupplierDetails = () => {

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
      po_product_id: 1,
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
      po_product_id: 2,
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
  const productCodeRefs = useRef([]);

  useEffect(() => {
    productCodeRefs.current = rows.map(
      (row, i) => productCodeRefs.current[i] || createRef()
    );
  }, [rows]);
  const handleAddExtraFields = (id) => {
    setRows(rows.map(p =>
      p.po_product_id === id ? { ...p, showExtraFields: !p.showExtraFields, remarks: p.remarks || '', foc_qty: p.foc_qty || 0 } : p
    ));
  };
// Utility function to handle Enter key focus shift
const handleKeyDown = (e, idx, field) => {
  if (e.key === "Enter") {
    e.preventDefault(); // prevent form submission

    const fieldOrder = [
      'product_code',
      'carton_qty',
      'loose_qty',
      'qty',
      'carton_price',
      'price',
      'discount_percentage',
      'discount_amount',
      'gross_total',
    ];

    const currentPoProductId = rows[idx].po_product_id;

    if (field === 'product_code') {
          requestAnimationFrame(() => {
            const productCodeRef = productCodeRefs.current[idx];
            if (productCodeRef && productCodeRef.current && productCodeRef.current.inputRef) {
              productCodeRef.current.inputRef.focus();
            }
            const nextInputField = document.querySelector(`[name="carton_qty-${currentPoProductId}"]`);
            if (nextInputField) nextInputField.focus();
          });
        } else {
      const currentFieldIndex = fieldOrder.indexOf(field);
      const nextFieldIndex = currentFieldIndex + 1;

      if (nextFieldIndex < fieldOrder.length) {
        // Focus the next field in the current row
        const nextField = fieldOrder[nextFieldIndex];
        const nextInputField = document.querySelector(`[name="${nextField}-${currentPoProductId}"]`);
        if (nextInputField) {
          nextInputField.focus();
        }
      } else {
        // If it's the last field in the current row (gross_total), move to the next row's product_code
        const nextRowIdx = idx + 1; // This is the array index of the next row

        if (rows[nextRowIdx]) { // Check if the next row object exists
          const nextRowPoProductId = rows[nextRowIdx].po_product_id;
            requestAnimationFrame(() => {
              const nextRowProductCodeRef = productCodeRefs.current[nextRowIdx];
            if (nextRowProductCodeRef && nextRowProductCodeRef.current && nextRowProductCodeRef.current.inputRef) {
              nextRowProductCodeRef.current.inputRef.focus();
            }
            });
        } else {
          // If no next row, add a new row and then focus its product_code
          addNewRow((newPoProductId) => {
            const newRowProductCodeInput = document.querySelector(`[name="product_code-${newPoProductId}"]`);
            if (newRowProductCodeInput) {
              newRowProductCodeInput.focus();
            }
          });
        }
      }
    }
  }
};

  const addNewRow = (callback) => {
    let newPoProductId;
    setRows((prevRows) => {
      newPoProductId = prevRows.length > 0 ? Math.max(...prevRows.map(r => r.po_product_id)) + 1 : 1;
      const updatedRows = [
        ...prevRows,
        {
          po_product_id: newPoProductId,
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
      ];
      return updatedRows;
    });
    if (callback && typeof callback === 'function') {
      // Execute callback after state update, ensuring the new row is rendered
      setTimeout(() => callback(newPoProductId), 0);
    }
    return newPoProductId;
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
      const res = await api.post('/purchaseorder/insertPurchaseOrder', formData);
      const insertedDataId = res.data.data.insertId;
      currency.purchase_order_id = insertedDataId;

      await api.post('/currency/insertPurchaseOrderCurrency', currency);
 
      // Fire all product inserts in parallel
      await Promise.all(
        rows.map(el => {
          el.purchase_order_id = insertedDataId;
          el.gross_total = el.total_price;
          if(el.product_id){
          return api.post('/purchaseorder/insertPoProduct', el);
          }
        })
      );

      message('PurchaseOrder has been Created successfully.', 'success');
      setTimeout(() => navigate(`/PurchaseOrderEdit/${insertedDataId}`), 300);
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
        if (row.po_product_id === id) {
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
              po_product_id: row.po_product_id,
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
            <h6 className="mb-2">Add/Edit Purchase Order</h6>

            <Form>
              {/* Tran No & Date */}
               <Row>
    {/* Supplier Code & Contact Address1 */}
    <Col md="6">
      <Row className="mb-1">
        <Col md="4">
          <Label className="small mb-1">Supplier Code</Label>
        </Col>
        <Col md="8">
          <Input bsSize="sm" className="py-0 px-1" name="supplier_code" value={formData?.supplier_code}  
              onChange={handleChange}  onKeyDown={handleKeyDown}/>
        </Col>
      </Row>
    </Col>
    <Col md="6">
      <Row className="mb-1">
        <Col md="4">
          <Label className="small mb-1">Supplier Name</Label>
        </Col>
        <Col md="8">
          <Input bsSize="sm" type='text' className="py-0 px-1" name="supplier_name" value={formData?.tran_date}  
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
                    Additional
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === "2" })}
                    onClick={() => toggleTab("2")}
                  >
                    Supplier Login Info
                  </NavLink>
                </NavItem>
                 <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === "3" })}
                    onClick={() => toggleTab("3")}
                  >
                    Contact
                  </NavLink>
                </NavItem>
                 <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === "4" })}
                    onClick={() => toggleTab("4")}
                  >
                    Transaction
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
          <Label className="small mb-1">Request DeliveryDate</Label>
        </Col>
        <Col md="8">
          <Input bsSize="sm" className="py-0 px-1" type="date"  name="request_delivery_date"
              value={formData?.request_delivery_date}
              onChange={handleChange}  onKeyDown={(e) => {
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
            }}/>
        </Col>
      </Row>
    </Col>
    {/* <Col md="6">
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
    </Col> */}
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
                 <TabPane tabId="3">
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
                 <TabPane tabId="4">
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
   
    

    {/* === Footer Buttons === */}
  <Row className="mt-2" style={{ backgroundColor: '#212529', padding: '8px' }}>
  {/* Cancel on left */}
  <Col className="d-flex justify-content-start">
    <Button size="sm" style={{ backgroundColor: '#6c757d', borderColor: '#6c757d', color: '#fff' }} className="me-2"  onClick={()=>navigate('/PurchaseOrder')}>
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

export default SupplierDetails;
