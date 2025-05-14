// import React, { useState, useEffect } from 'react';
// import { Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
// import { ToastContainer } from 'react-toastify';
// import { useNavigate, useParams } from 'react-router-dom';
// import moment from 'moment';
// import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
// import ComponentCard from '../../components/ComponentCard';
// import api from '../../constants/api';
// import message from '../../components/Message';

// const PurchaseOrderDetails = () => {
//   //All state variables
//   const [supplier, setSupplier] = useState();
//   const [purchaseForms, setPurchaseForms] = useState({
//     supplier_id: '',
//     company_name: '',
//   });

//   //Navigation and Parameters
//   const { id } = useParams();
//   const navigate = useNavigate();
//   // Gettind data from Job By Id
//   const editPurchaseById = () => {
//     api
//       .get('/purchaseorder/getSupplier')
//       .then((res) => {
//         setSupplier(res.data.data);
//       })
//       .catch(() => {});
//   };
//   //PurchaseOrder data in PurchaseOrderDetails
//   const handleInputs = (e) => {
//     setPurchaseForms({ ...purchaseForms, [e.target.name]: e.target.value });
//   };
//   //inserting data of Purchase Order
//   const insertPurchaseOrder = () => {
//     purchaseForms.purchase_order_date = moment();

//     if (purchaseForms.supplier_id !== '') {
//       api
//         .post('/purchaseorder/insertPurchaseOrder', purchaseForms)
//         .then((res) => {
//           const insertedDataId = res.data.data.insertId;
//           message('Purchase Order inserted successfully.', 'success');
//           setTimeout(() => {
//             navigate(`/PurchaseOrderEdit/${insertedDataId}`);
//           }, 300);
//         })
//         .catch(() => {
//           message('Unable to edit record.', 'error');
//         });
//     } else {
//       message('Please fill all required fields.', 'warning');
//     }
//   };
//   useEffect(() => {
//     editPurchaseById();
//   }, [id]);
//   return (
//     <div>
//       <BreadCrumbs />
//       <Row>
//         <ToastContainer></ToastContainer>
//         <Col md="6">
//           <ComponentCard title="Key Details">
//             <Form>
//               <FormGroup>
//                 <Row>
//                   <Label>supplier Name </Label>
//                   <Input
//                     type="select"
//                     name="supplier_id"
//                     onChange={(e) => {
//                       handleInputs(e);
//                     }}
//                   >
//                     <option value="" selected>
//                       Please Select
//                     </option>
//                     {supplier &&
//                       supplier.map((ele) => {
//                         return (
//                           <option key={ele.supplier_id} value={ele.supplier_id}>
//                             {ele.company_name}
//                           </option>
//                         );
//                       })}
//                   </Input>
//                 </Row>

//                 <FormGroup>
//                   <Row>
//                     <div className="pt-3 mt-3 d-flex align-items-center gap-2">
//                       <Button
//                         color="primary"
//                         type="button"
//                         className="btn mr-2 shadow-none"
//                         onClick={() => {
//                           insertPurchaseOrder();
//                         }}
//                       >
//                         Save & Continue
//                       </Button>
//                       <Button
//                         onClick={() => {
//                           navigate('/PurchaseOrderEdit');
//                         }}
//                         type="button"
//                         className="btn btn-dark shadow-none"
//                       >
//                        Go to List
//                       </Button>
//                     </div>
//                   </Row>
//                 </FormGroup>
//               </FormGroup>
//             </Form>
//           </ComponentCard>
//         </Col>
//       </Row>
//     </div>
//   );
// };
// export default PurchaseOrderDetails;

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
import message from '../../components/Message';
import { FaTrashAlt, FaPlusCircle } from "react-icons/fa";
import api from "../../constants/api";

const PurchaseOrderPage = () => {
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
    request_delivery_date: "",
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
    });
  }, []);

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
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

  // Handle form submit (example API call structure)
  const handleSubmit = async () => {
    api
    .post('/purchaseorder/insertPurchaseOrder', formData)
    .then((res) => {
      const insertedDataId = res.data.data.insertId;
      rows?.forEach((el)=>{
        el.purchase_order_id=insertedDataId;
        api
      .post('/purchaseorder/insertPoProducts', el) 
      .then(() => {
        console.log(insertedDataId,'insertedDataId');})})
      message('enquiry inserted successfully.', 'success');
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
        updatedRows[index].total_price = 0;
      } else {
        updatedRows[index].product_name = "";
        updatedRows[index].carton_price = 0;
      }
    }
  
    if (["carton_qty", "carton_price", "loose_qty", "discount"].includes(field)) {
      const cartonTotal = updatedRows[index].carton_qty * updatedRows[index].carton_price;
      const looseTotal = updatedRows[index].loose_qty * (updatedRows[index].carton_price / 12);
      const grossTotal = cartonTotal + looseTotal;
      const finalTotal = grossTotal - updatedRows[index].discount;
  
      updatedRows[index].qty = updatedRows[index].carton_qty + updatedRows[index].loose_qty;
      updatedRows[index].total_price = parseFloat(finalTotal.toFixed(2));
    }
  
    setRows(updatedRows);
    console.log('rows',updatedRows);
  };
  

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
            <Input
              type="text"
              placeholder="Country / Postal code"
              name="country"
              value={formData.country}
              onChange={handleChange}
            
            />
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
              name="request_delivery_date"
              value={formData.request_delivery_date}
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
                  <Input type="text" placeholder="Enter supplier code" value={supplierData.currencyCode || ""} readOnly />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <label>Currency Name</label>
                  <Input type="select">
                    <option value="">Select Supplier</option>
                    {supplierOptions.map((supplier, index) => (
                      <option key={index} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <label>Contact Rate</label>
                  <Input type="text" placeholder="Enter contact person" value={supplierData.currency_rate || ""} readOnly />
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
            <th>Discount</th>
            <th>Total Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <Input
                  type="text"
                  value={row.product_code}
                  onChange={(e) => handleRowChange(index, "product_code", e.target.value)}
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
              <td>{row.qty}</td>
              <td>
                <Input
                  type="number"
                  value={row.carton_price}
                  onChange={(e) => handleRowChange(index, "carton_price", parseFloat(e.target.value) || 0)}
                />
              </td>
              <td>{row.price}</td>
              <td>
                <Input
                  type="number"
                  value={row.discount}
                  onChange={(e) => handleRowChange(index, "discount", parseFloat(e.target.value) || 0)}
                />
              </td>
              <td>{row.total_price.toFixed(2)}</td>
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
      </Table>

      <div className="mt-4">
        <h5>Summary:</h5>
        <p>Total Products: {rows.length}</p>
        <p>Total Amount: ${rows.reduce((sum, row) => sum + row.total_price, 0).toFixed(2)}</p>
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