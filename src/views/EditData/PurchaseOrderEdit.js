// import React, { useEffect, useState,useContext } from 'react';
// //import * as Icon from 'react-feather';
// import { Row, Col, Button, TabContent, TabPane } from 'reactstrap';
// import { ToastContainer } from 'react-toastify';
// import Swal from 'sweetalert2';
// import { useNavigate, useParams } from 'react-router-dom';
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// import '../form-editor/editor.scss';
// //import moment from 'moment';
// import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
// import AddNote from '../../components/Tender/AddNote';
// import ViewNote from '../../components/Tender/ViewNote';
// import ComponentCard from '../../components/ComponentCard';
// import message from '../../components/Message';
// import api from '../../constants/api';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import AddPoModal from '../../components/PurchaseOrder/AddPoModal';
// import AttachmentTab from '../../components/PurchaseOrder/AttachmentTab';
// import PurchaseOrderlineItemEdit from '../../components/PurchaseOrder/PurchaseOrderLineItem';
// //import PurchaseOrderButtons from '../../components/PurchaseOrder/PurchaseOrderButtons';
// import ViewHistoryModal from '../../components/PurchaseOrder/ViewHistoryModal';
// import DeliveryOrderEditModal from '../../components/PurchaseOrder/DeliveryOrderEditModal';
// import PurchaseOrderDetailsPart from '../../components/PurchaseOrder/PurchaseOrderDetailsPart';
// import ProductLinkedTable from '../../components/PurchaseOrder/ProductLinkedTable';
// //import PdfDeliveryOrderPO from '../../components/PDF/PdfDeliveryOrderPO';
// import PdfPurchaseOrder from '../../components/PDF/PdfPurchaseOrder';
// import PdfPurchaseOrderPrice from '../../components/PDF/PdfPurchaseOrderPrice';
// import ComponentCardV2 from '../../components/ComponentCardV2';
// import Tab from '../../components/project/Tab';
// import ApiButton from '../../components/ApiButton';
// import AppContext from '../../context/AppContext';

// const PurchaseOrderEdit = () => {
//   //All state variable
//   const [purchaseDetails, setPurchaseDetails] = useState();
//   const [supplier, setSupplier] = useState([]);
//   const [product, setProduct] = useState();
//   const [historyProduct, setHistoryProduct] = useState();
//   const [addPurchaseOrderModal, setAddPurchaseOrderModal] = useState();
//   const [products, setProducts] = useState();
//   const [editModal, setEditModal] = useState(false);
//   const [attachmentModal, setAttachmentModal] = useState(false);
//   const [attachmentData, setDataForAttachment] = useState({
//     modelType: '',
//   });
//   const [pictureData, setDataForPicture] = useState({
//     modelType: '',
//   });
//   const [activeTab, setActiveTab] = useState('1');
//   const [viewHistoryModal, setViewHistoryModal] = useState(false);
//   const [deliveryOrderEditModal, setDeliveryOrderEditModal] = useState(false);
//   const [selectedPoProducts, setSelectedPoProducts] = useState([]);
//   const [selectedPoDelivers, setSelectedPoDelivers] = useState([]);
//   const [deliveryOrderId, setDeliveryOrderId] = useState();
//   const [deliveryOrders, setDeliveryOrders] = useState([]);
//   const [supplierId, setSupplierId] = useState();
//   const [gTotal, setGtotal] = useState(0);
//   const [grTotal, setGrTotal] = useState(0);
//   //navigation and parameters
//   const { id } = useParams();
//   const navigate = useNavigate();

//   //const applyChanges = () => {};
//   const backToList = () => {
//     navigate('/PurchaseOrder');
//   };
//   //puchaseOrder data in purchaseDetails
//   const handleInputs = (e) => {
//     setPurchaseDetails({ ...purchaseDetails, [e.target.name]: e.target.value });
//   };
//   //getting data from purchaseOrder by Id
//   const getPurchaseOrderId = () => {
//     api.post('/Purchaseorder/getPurchaseOrderById', { purchase_order_id: id }).then((res) => {
//       setPurchaseDetails(res.data.data[0]);
//       setSupplierId(res.data.data[0].supplier_id);
//       console.log("created_by",res.data.data[0].creation_date)

//     });
//   };
//   // Gettind data from Job By Id
//   const getPoProduct = () => {
//     api
//       .post('/Purchaseorder/TabPurchaseOrderLineItemById', { purchase_order_id: id })
//       .then((res) => {
//         setProducts(res.data.data);
//         //grand total
//         let grandTotal = 0;
//         let grand = 0;
//         res.data.data.forEach((elem) => {
//           grandTotal += elem.po_value;
//           grand += elem.actual_value;
//         });
//         setGtotal(grandTotal);
//         setGrTotal(grand);
//       })
//       .catch(() => {
//         message('Products Data Not Found', 'info');
//       });
//   };
//   // Gettind data from Job By Id
//   const getSupplier = () => {
//     api
//       .get('/Purchaseorder/getSupplier')
//       .then((res) => {
//         setSupplier(res.data.data);
//       })
//       .catch(() => {
//         message('Supplier Data Not Found', 'info');
//       });
//   };

//   const handlePOInputs = (e) => {
//     setProduct({ ...product, [e.target.name]: e.target.value });
//   };

//   //Add to stocks
//   const addQtytoStocks = () => {
//     if (selectedPoProducts && selectedPoProducts.length > 0) { 
//       selectedPoProducts.forEach((elem) => {
//         if (elem.status !== 'Closed') {
//           elem.status = 'Closed';
//           elem.qty_updated = elem.qty_delivered;
//           elem.qty_in_stock += parseFloat(elem.qty_delivered);

//           api
//             .post('/inventory/editInventoryStock', elem)
//             .then(() => {
            
//               message('Quantity added successfully.', 'success');
//                setTimeout(() => {
//           window.location.reload();
//         }, 800);
//             })
//             .catch(() => {
//               message('unable to add quantity.', 'danger');
//             });
//         } else {
//           message('This product is already added', 'danger');
//         }
//       });
//     } else {
//       Swal.fire('Please select atleast one product!');
//     }
//   };

//   //Delivery order


// // const deliverOrder = () => {
// //   if (selectedPoDelivers && selectedPoDelivers.length > 0) {
// //     const confirmDelivery = window.confirm("Do you want to create a delivery order?");
    
// //     if (confirmDelivery) {
// //       api.post('/Purchaseorder/insertDeliveryOrder', { purchase_order_id: id }).then((res) => {
// //         selectedPoDelivers.forEach((elem) => {
// //           elem.delivery_order_id = res.data.data.insertId;
// //           elem.purchase_order_id = id;

// //           api
// //             .post('/Purchaseorder/insertDeliveryOrderHistory', elem)
// //             .then(() => {
// //               message('Inserted successfully.', 'success');
// //               setTimeout(() => {
// //                 window.location.reload();
// //               }, 300);
// //             })
// //             .catch(() => {
// //               message('unable to deliver.', 'danger');
// //             });
// //         });
// //       });
// //     }
// //   } else {
// //     alert('Please select at least one product');
// //   }
// // };

// console.log("purchaseDetails",setDeliveryOrderId,deliveryOrders)


//   // get delivery orders

//   const getDeliveryOrders = () => {
//     api
//       .post('/Purchaseorder/getDeliveryOrder', { purchase_order_id: id })
//       .then((res) => {
//         setDeliveryOrders(res.data.data);
//       })
//       .catch(() => {
//         message('DeliveryOrder Data Not Found', 'info');
//       });
//   };
//   const { loggedInuser } = useContext(AppContext);
//   //Update Setting
//   const editPurchaseData = () => {
//     purchaseDetails.modified_by = loggedInuser.first_name;
//     api
//       .post('/purchaseorder/editTabPurchaseOrder', purchaseDetails)
//       .then(() => {
//         message('Record editted successfully', 'success');
//         setTimeout(() => {
//           window.location.reload();
//         }, 300);
//       })
//       .catch(() => {
//         message('Unable to edit record.', 'error');
//       });
//   };
//   const editPoProductData = () => {
//     // Check if the quantity to be added to stock is valid
  
//     if (product.qty_delivered > 0 && product.status && product.status !== 'Please Select') {
//       // Proceed with the API call
//       api
//         .post('/Purchaseorder/editTabPurchaseOrderLineItem', product)
//         .then(() => {
//           message('Product edited successfully.', 'success');
//            setTimeout(() => {
//                 window.location.reload();
//               }, 300);
//         })
//         .catch(() => {
//           message('Unable to edit product.', 'danger');
//         });
//     } else {
//       // Show an error message for invalid quantity
//       message('Please Fill All Required Field', 'danger');
//     }
//   };

//   const deletePoProduct = (poProductId) => {
//     Swal.fire({
//       title: `Are you sure? `,
//       text: "You won't be able to revert this!",
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Yes, delete it!',
//     }).then((result) => {
//       if (result.isConfirmed) {
//         api
//           .post('purchaseorder/deletePoProduct', { po_product_id: poProductId })
//           .then(() => {
//             Swal.fire('Deleted!', 'PoProduct has been deleted.', 'success');
//             setTimeout(() => {
//               window.location.reload();
//             }, 300);
//           })
//           .catch(() => {
//             message('Unable to Delete PO Product', 'info');
//           });
//       }
//     });
//   };

//   //checked objects
//   const getCheckedPoProducts = (checkboxVal, index, Obj) => {
//     if (checkboxVal.target.checked === true) {
//       setSelectedPoProducts([...selectedPoProducts, Obj]);
//     }
//     if (checkboxVal.target.checked !== true) {
//       const copyselectedPoProducts = [...selectedPoProducts];
//       copyselectedPoProducts.splice(index, 1);
//       setSelectedPoProducts(copyselectedPoProducts);
//     }
//   };
//   //checked Dos
//   const getCheckedDeliverProducts = (checkboxVal, index, Obj) => {
//     if (checkboxVal.target.checked === true) {
//       setSelectedPoDelivers([...selectedPoDelivers, Obj]);
//     }
//     if (checkboxVal.target.checked !== true) {
//       const copyselectedPoDeliveries = [...selectedPoDelivers];
//       copyselectedPoDeliveries.splice(index, 1);
//       setSelectedPoDelivers(copyselectedPoDeliveries);
//     }
//   };

//   // Start for tab refresh navigation #Renuka 1-06-23
//   const tabs = [
//     { id: '1', name: 'Attachments' },
//     { id: '3', name: 'Notes' },
//   ];
//   const toggle = (tab) => {
//     setActiveTab(tab);
//   };
//   // End for tab refresh navigation #Renuka 1-06-23

//   //   //Attachments
//   const dataForAttachment = () => {
//     setDataForAttachment({
//       modelType: 'attachment',
//     });
//   };
//   //Pictures
//   const dataForPicture = () => {
//     setDataForPicture({
//       modelType: 'picture',
//     });
//   };

//   useEffect(() => {
//     getSupplier();
//     getPoProduct();
//     getPurchaseOrderId();
//     getDeliveryOrders();
//   }, [id]);

//   return (
//     <>
//       <BreadCrumbs />
//       <ApiButton
//               editData={editPurchaseData}
//               navigate={navigate}
//               applyChanges={editPurchaseData}
//               backToList={backToList}
//               module="Purchase Order"
//             ></ApiButton>
//       <ToastContainer></ToastContainer>
//       {/* PurchaseorderButtons */}
//       {/* <PurchaseOrderButtons
//         applyChanges={applyChanges}
//         backToList={backToList}
//         editPurchaseData={editPurchaseData}
//         purchaseDetails={purchaseDetails}
//         products={products}
//         product={product}
//         navigate={navigate}
//       /> */}
     
//                       <ComponentCardV2>
//             <Row>
//               <Col>
//                 <PdfPurchaseOrder
//                   products={products}
//                   purchaseDetails={purchaseDetails}
//                 ></PdfPurchaseOrder>
//               </Col>
//               <Col>
//                 <PdfPurchaseOrderPrice
//                   product={product}
//                   purchaseDetails={purchaseDetails}
//                 ></PdfPurchaseOrderPrice>
//               </Col>
//               </Row>
//               </ComponentCardV2>
//       {/* PurchaseOrder Details */}

//       <PurchaseOrderDetailsPart
//         supplier={supplier}
//         handleInputs={handleInputs}
//         purchaseDetails={purchaseDetails}
//       />
      
//       <ComponentCard title="Product Linked">
//         <AddPoModal
//           PurchaseOrderId={id}
//           supplierId={supplierId}
//           addPurchaseOrderModal={addPurchaseOrderModal}
//           setAddPurchaseOrderModal={setAddPurchaseOrderModal}
//         />

//         <Row className="mb-4">
//           <Col md="2">
//             <Button
//               color="primary"
//               onClick={() => {
//                 setAddPurchaseOrderModal(true);
//               }}
//             >
//               Add Product
//             </Button>
//           </Col>
//           <Col md="2">
//             <Button
//               color="success"
//               onClick={() => {
//                 addQtytoStocks();
//               }}
//             >
//               Add all Qty to Stock
//             </Button>
//           </Col>
//           {/* <Col md="2">
//             <Button
//               color="primary"
//               onClick={() => {
//                 deliverOrder();
//               }}
//             >
//               Delivery Order
//             </Button>
//           </Col> */}
//           <Col md="3">
//             <b color="primary">Grand Total(for delivered qty):{grTotal}</b>
//           </Col>
//           <Col md="3">
//             <b color="primary">Grand Total:{gTotal}</b>
//           </Col>
//         </Row>
//         <ProductLinkedTable
//           products={products}
//           setProduct={setProduct}
//           getCheckedDeliverProducts={getCheckedDeliverProducts}
//           getCheckedPoProducts={getCheckedPoProducts}
//           setEditModal={setEditModal}
//           setViewHistoryModal={setViewHistoryModal}
//           deletePoProduct={deletePoProduct}
//           setHistoryProduct={setHistoryProduct}
//         />
//       </ComponentCard>
//       {editModal && (
//         <PurchaseOrderlineItemEdit
//           product={product}
//           editModal={editModal}
//           editPoProductData={editPoProductData}
//           setEditModal={setEditModal}
//           handlePOInputs={handlePOInputs}
//         ></PurchaseOrderlineItemEdit>
//       )}
//       {viewHistoryModal && (
//         <ViewHistoryModal
//           viewHistoryModal={viewHistoryModal}
//           setViewHistoryModal={setViewHistoryModal}
//           productId={historyProduct}
//           supplierId={supplierId}
//         />
//       )}

//       {deliveryOrderEditModal && (
//         <DeliveryOrderEditModal
//           deliveryOrderEditModal={deliveryOrderEditModal}
//           setDeliveryOrderEditModal={setDeliveryOrderEditModal}
//           deliveryOrderId={deliveryOrderId}
//         />
//       )}
//       <ComponentCard title="More Details">
//         <Tab toggle={toggle} tabs={tabs} />
//         <TabContent className="p-4" activeTab={activeTab}>
//           {/* <TabPane tabId="1">
           
//             {deliveryOrders &&
//               deliveryOrders.map((element) => {
//                 return (
//                   <Row key={element.delivery_order_id}>
//                     <Col md="6">
//                       <span>{moment(element.date).format('YYYY-MM-DD')}</span>
//                     </Col>
//                     <Col md="6">
//                       <span
//                         color="primary"
//                         className="m-2 color-primary"
//                         onClick={() => {
//                           setDeliveryOrderId(element.delivery_order_id);
//                           setDeliveryOrderEditModal(true);
//                         }}
//                       >
//                         <Icon.Edit />
//                       </span>
//                       <PdfDeliveryOrderPO
//                         id={id}
//                         deliveryOrderId={element.delivery_order_id}
//                         date={element.date}
//                       ></PdfDeliveryOrderPO>
//                     </Col>
//                   </Row>
//                 );
//               })}
//           </TabPane> */}
//           <TabPane tabId="1">
//             <Row>
//               <AttachmentTab
//                 dataForPicture={dataForPicture}
//                 dataForAttachment={dataForAttachment}
//                 id={id}
//                 attachmentModal={attachmentModal}
//                 setAttachmentModal={setAttachmentModal}
//                 pictureData={pictureData}
//                 attachmentData={attachmentData}
//               />
//             </Row>
//           </TabPane>
//           <TabPane tabId="3">
//             <Row>
//               <AddNote recordId={id} roomName="PurchaseOrderEdit" />
//               <ViewNote recordId={id} roomName="PurchaseOrderEdit" />
//             </Row>
//           </TabPane>
//         </TabContent>
//       </ComponentCard>
//     </>
//   );
// };

// export default PurchaseOrderEdit;


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
    api.post("/purchaseorder/TabPurchaseOrderLineItemById",{purchase_order_id:id}).then((response) => { 
      setRows(response.data.data);
      setTableData(response.data.data);
    });

    // Fetch supplier options for dropdown
    api.post("/purchaseorder/getPurchaseOrderById",{purchase_order_id:id}).then((response) => {
      setFormData(response.data.data[0]);
    });
  
    api.post("/currency/getCuerrencyByPurchaseorderId",{purchase_order_id:id}).then((response) => {
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
    .post('/purchaseorder/editTabPurchaseOrder', formData)
    .then(() => {
      api
      .post('/currency/editCurrency', currency) 
      .then(() => {})
      
      rows?.forEach((el)=>{
       
        api
      .post('/purchaseorder/editPoProduct', el) 
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
      <h2>Add/Edit Purchase Order</h2>
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
            <label>Request Delivery Date</label>
            <Input
              type="date"
              name="req_delivery_date"
              value={formData.req_delivery_date}
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
              <td>{Number(row.total)?.toFixed(2)}</td>
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
