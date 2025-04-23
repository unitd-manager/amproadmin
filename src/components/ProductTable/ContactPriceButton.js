import React, { useState, useEffect,useContext } from 'react';
import {
  Row,
  Col,
  FormGroup,
  Input,
  Button,
  Modal,
  ModalFooter,
  ModalBody,
  NavItem, NavLink, Nav, TabPane, TabContent
  
} from 'reactstrap';
import PropTypes from 'prop-types';
import random from 'random';
import Select from 'react-select';
import message from '../Message';
import api from '../../constants/api';
import ComponentCard from '../ComponentCard';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import AppContext from '../../context/AppContext';
import creationdatetime from '../../constants/creationdatetime';

export default function ContactPriceButton ({  addPurchaseOrderModal, setAddPurchaseOrderModal, ProductId, productDetails }){
  ContactPriceButton.propTypes = {
    addPurchaseOrderModal: PropTypes.bool,
    setAddPurchaseOrderModal: PropTypes.func,
    ProductId: PropTypes.bool,
    productDetails: PropTypes.any
  };

  const [activeTab, setActiveTab] = useState('1');
  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  //const [ItemCode, setItemcode] = useState();
  const [getProductValue, setProductValue] = useState();
  const [getsupplier, setSupplier] = useState();
  const [addMoreItem, setMoreItem] = useState([
    {
      id: random.int(1, 99).toString(),
      itemId: '',
      unit: '',
      qty: '',
      price: '',
      mrp: '',
      gst: 0,
      description: '',
    },
    {
      id: random.int(0, 9999).toString(),
      itemId: '',
      unit: '',
      qty: '',
      price: '',
      mrp: '',
      gst: 0,
      description: '',
    },
    {
      id: random.int(0, 9999).toString(),
      itemId: '',
      unit: '',
      qty: '',
      price: '',
      mrp: '',
      gst: 0,
      description: '',
    },
  ]);



  const AddNewLineItem = () => {
    setMoreItem([
      ...addMoreItem,
      {
        id: random.int(0, 9999).toString(),
        itemId: '',
        unit: '',
        qty: '',
        price: '',
        mrp: '',
        gst: 0,
        description: '',
      },
    ]);
  };

  
  
  //getting maximum of itemcode
  // const getMaxItemcode = () => {
  //   api.get('/product/getMaxItemCode').then((res) => {
  //     setItemcode(res.data.data[0].itemc);
  //   });
  // };

  //   Get Products
  const getCustomer = () => {
    api.get('/contact/getContact').then((res) => {
      const items = res.data.data;
      const finaldat = [];
      items.forEach((item) => {
        finaldat.push({ value: item.contact_id, label: item.contact_id });
      });
      setProductValue(finaldat);
    });
  };

  // Get supplier

 const getSupplier = () => {
    api.get('/contact/getContact').then((res) => {
      const items = res.data.data;
      const finalsubdat = []; 
      items.forEach((item) => {
        finalsubdat.push({ value: item.contact_id, label: item.contact_id });
      });
      setSupplier(finalsubdat);
    });
  };

  

  

  // const insertPurchaseOrder = () => {
  //   purchaseDetails.project_id = projectId;
  //   api.post('/purchaseorder/insertPurchaseOrder', purchaseDetails).then((res) => {
  //     poProduct(res.data.data.insertId);
  //     getProduct();
  //     message('Purchase Order Added!', 'success');
  //     setAddPurchaseOrderModal(false);
  //   });
  // };

  function updateState(index, property, e) {
    const copyDeliverOrderProducts = [...addMoreItem];
    const updatedObject = { ...copyDeliverOrderProducts[index], [property]: e.target.value };
    copyDeliverOrderProducts[index] = updatedObject;
    setMoreItem(copyDeliverOrderProducts);
  }
  const ProductLineItemById = () => {
    api
      .post('/product/getCSProductByProductId', { product_id: ProductId })
      .then((res) => {
        const existingItems = res.data.data.map((item) => ({
          ...item,
          newItem: false, // mark existing records
        }));
        setMoreItem(existingItems);
      })
      .catch(() => {
        message('Order Data Not Found', 'info');
      });
  };

//Api call for Insert Vehicle Insurance Data
const EditCSProductLineItems = () => {
  
  addMoreItem.forEach((item) => {
  api
    .post('/product/EditCSProductLineItems', item)
    .then(() => {
      message('Line Item Edited Successfully', 'sucess');
    })
    .catch(() => {
      message('Cannot Edit Line Items', 'error');
    });
  }) 
};

const [purchaserequesteditdetails, setPurchaseRequestEditDetails] = useState();
    // get staff details
   const { loggedInuser } = useContext(AppContext);

  
    function updateSupplierState(index, property, e) {
    const copyDeliverOrderProducts = [...purchaserequesteditdetails];
    const updatedObject = { ...copyDeliverOrderProducts[index], [property]: e.target.value };
    
//   const quantity = parseFloat(updatedObject.goods_received_qty) || 0;
//   const unitPrice = parseFloat(updatedObject.unit_price) || 0;
  // const totalCost = parseFloat(updatedObject.total_cost);
//   updatedObject.total_cost = quantity * unitPrice;
  updatedObject.modification_date = creationdatetime;
  updatedObject.modified_by = loggedInuser.first_name;
  copyDeliverOrderProducts[index] = updatedObject;
    setPurchaseRequestEditDetails(copyDeliverOrderProducts);
  }

  

  //Api call for getting Vehicle Insurance Data By ID
  const PurchaseRequestLineItemById = () => {
      api
        .post('/product/getCSSupplierProductByProductId', {product_id: ProductId})
        .then((res) => {
          setPurchaseRequestEditDetails(res.data.data);
        })
        .catch(() => {
          message('Order Data Not Found', 'info');
        });
    };

  //Api call for Insert Vehicle Insurance Data
  const editPurchaseRequestItems = () => {
    
    purchaserequesteditdetails.forEach((item) => {
    api
      .post('/product/EditCSProductLineItemsBYSupplierID', item)
      .then(() => {
        message('Line Item Edited Successfully', 'sucess');
      })
      .catch(() => {
        message('Cannot Edit Line Items', 'error');
      });
    }) 
  };

  // const AddNewCustomerLineItem = () => {
  //   setPurchaseRequestEditDetails([
  //     ...purchaserequesteditdetails,
  //     {
  //       id: random.int(0, 9999).toString(),
  //       itemId: '',
  //       unit: '',
  //       qty: '',
  //       price: '',
  //       mrp: '',
  //       gst: 0,
  //       description: '',
  //     },
  //   ]);
  // };

   const AddNewCustomerLineItem = () => {

        api
          .post('/content/insertContent', purchaserequesteditdetails)
          .then(() => {
            setPurchaseRequestEditDetails([
              ...purchaserequesteditdetails,
              {
                id: random.int(0, 9999).toString(),
                itemId: '',
                unit: '',
                qty: '',
                price: '',
                mrp: '',
                gst: 0,
                description: '',
              },
            ]);
          })
          .catch(() => {
            message('Network connection error.', 'error');
          });
      };
  

  // useEffect for Vehicle Insurance
  useEffect(() => {
    PurchaseRequestLineItemById();
  }, [ProductId]);


  //Insert Product Data
  


  useEffect(() => {
    getCustomer();
    getSupplier();
    ProductLineItemById();
    //getMaxItemcode();
  }, []);
  useEffect(() => {
    setMoreItem([
      {
        id: random.int(1, 99).toString(),
        itemId: '',
        unit: '',
        qty: '',
        price: '',
        mrp: '',
        gst: '',
        description: '',
      },
      {
        id: random.int(0, 9999).toString(),
        itemId: '',
        unit: '',
        qty: '',
        price: '',
        mrp: '',
        gst: '',
        description: '',
      },
      {
        id: random.int(0, 9999).toString(),
        itemId: '',
        unit: '',
        qty: '',
        price: '',
        mrp: '',
        gst: '',
        description: '',
      },
    ]);
  }, [addPurchaseOrderModal]);

  const onchangeItem = (str, itemId) => {
    const element = addMoreItem.find((el) => el.id === itemId);
    element.Item = str.label;
    element.itemId = str.value;
    setMoreItem(addMoreItem);
  };

  // Clear row value
  const ClearValue = (ind) => {
    setMoreItem((current) =>
      current.filter((obj) => {
        return obj.id !== ind.id;
      }),
    );
  };
  return (
    <>
      <Modal size="xl" isOpen={addPurchaseOrderModal}>
           
            <ComponentCard>
                  <Nav tabs>
                    <NavItem>
                      <NavLink
                        className={activeTab === '1' ? 'active' : ''}
                        onClick={() => {
                          toggle('1');
                        }}
                      >
                        Customer
                      </NavLink>
                    </NavItem>
                   <NavItem>
                      <NavLink
                        className={activeTab === '2' ? 'active' : ''}
                        onClick={() => {
                          toggle('2');
                        }}
                      >
                       Supplier
                      </NavLink>
                    </NavItem>
                     {/* <NavItem>
                      <NavLink
                        className={activeTab === '3' ? 'active' : ''}
                        onClick={() => {
                          toggle('3');
                        }}
                      >
                        Product Size
                      </NavLink>
                    </NavItem> */}
                    <NavItem>
                      <NavLink
                        className={activeTab === '3' ? 'active' : ''}
                        onClick={() => {
                          toggle('3');
                        }}
                      >
                        Product Group
                      </NavLink>
                    </NavItem>
                  </Nav>
              
                  <TabContent activeTab={activeTab}>
              
                {/* Delivery address Form */}
                <TabPane tabId="1">

                  <BreadCrumbs heading={productDetails && productDetails.title} />
               
               
          <FormGroup>
            <Row>
              <Col md="12" className="mb-4">
                <Row>
                  <Col md="2">
                    <Button
                      color="primary"
                      className="shadow-none"
                      onClick={() => {
                        AddNewLineItem();
                      }}
                    >
                      Add Item
                    </Button>
                  </Col>
                  
                </Row>
                <br />
                {/* <Row>
                  <FormGroup className="mt-3">
                    {' '}
                    Total Amount : {getTotalOfPurchase() || 0}{' '}
                  </FormGroup>
                </Row> */}
              </Col>
            </Row>

            <table className="lineitem">
              <thead>
                <tr>
                  <th scope="col">Code <span className="required"> *</span></th>
                  <th scope="col">Name</th>
                  <th scope="col">WholeSale Price</th>
                  <th scope="col">Carton Price</th>
                  <th scope="col">Fixed Price</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {addMoreItem.map((el, index) => {
                  return (
                    <tr key={el.id}>
                      <td data-label="title">
                        <Select
                          key={el.id}
                          defaultValue={{ value: el.product_id, label: el.title }}
                          onChange={(e) => {
                            onchangeItem(e, el.id);
                          }}
                          options={getProductValue}
                        />
                        <Input
                          value={el.product_id}
                          type="hidden"
                          name="product_id"
                          onChange={(e) => updateState(index, 'product_id', e)}
                        ></Input>
                        <Input
                          value={el.title}
                          type="hidden"
                          name="title"
                          onChange={(e) => updateState(index, 'title', e)}
                        ></Input>
                      </td>
                      {/* <td data-label="ProductName"><Input type="text" name="item_title" value={el.item_title}  onChange={(e)=>updateState(index,"item_title",e)}/></td> */}
                      <td data-label="UoM">
                        <Input
                          type="text"
                          name="unit"
                          value={el.unit}
                          onChange={(e) => updateState(index, 'unit', e)}
                        />
                      </td>
                      <td data-label="Qty">
                        <Input
                          type="text"
                          name="qty"
                          value={el.qty}
                          onChange={(e) => updateState(index, 'qty', e)}
                        />
                      </td>
                      <td data-label="Unit Price">
                        <Input
                          type="text"
                          name="cost_price"
                          value={el.cost_price}
                          onChange={(e) => updateState(index, 'cost_price', e)}
                        />
                      </td>
                      <td data-label="Total Price">
                        {el.cost_price * el.qty || 0}</td>
                      <td data-label="Action">
                        <div className="anchor">
                          <span
                            onClick={() => {
                              ClearValue(el);
                            }}
                          >
                            Clear
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {/* {[...Array(addMoreItem)].map((elem,index) => {
                        return (
                        <tr key={addMoreItem}>
                            <td data-label="ProductName"><Input type="text" name="item_title" value={elem.item_title} onChange={(e)=>updateNewItemState(index,"item_title",e)}/></td>
                            <td data-label="UoM"><Input type="text" name="uom" value={elem.unit} onChange={(e)=>updateNewItemState(index,"unit",e)} /></td>
                            <td data-label="Qty"><Input type="text" name="qty"  value={elem.qty}  onChange={(e)=>updateNewItemState(index,"qty",e)} /></td>
                            <td data-label="Unit Price"><Input type="text" name="cost_price" value={elem.cost_price} onChange={(e)=>updateNewItemState(index,"cost_price",e)} /></td>
                            <td data-label="Total Price">{elem.cost_price*elem.qty}</td>
                            <td data-label="Remarks"><Input type="textarea"  name="description"  value={elem.description}  onChange={(e)=>updateNewItemState(index,"description",e)}/></td>
                            <td data-label="Action"><Link to=""><span>Clear</span></Link></td>
                        </tr>
                        );
                    })} */}
              </tbody>
            </table>
          </FormGroup>
      
        <ModalFooter>
          <Button
            color="primary"
            className="shadow-none"
            onClick={() => {
             
              // insertlineItem(res.data.data.insertId);
            
               getCustomer();
               EditCSProductLineItems();
               
             
    
            }}
          >
            Submit
          </Button>
          <Button
            color="secondary"
            className="shadow-none"
            onClick={() => {
              setAddPurchaseOrderModal(false);
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
        
                      
                </TabPane>
        
                <TabPane tabId="2">

                <ModalBody>
          
          <FormGroup>
            <Row>
              <Col md="12" className="mb-4">
                <Row>
                  <Col md="2">
                    <Button
                      color="primary"
                      className="shadow-none"
                      onClick={() => {
                        AddNewCustomerLineItem();
                      }}
                    >
                      Add Item
                    </Button>
                  </Col>
                  
                </Row>
                <br />
                {/* <Row>
                  <FormGroup className="mt-3">
                    {' '}
                    Total Amount : {getTotalOfPurchase() || 0}{' '}
                  </FormGroup>
                </Row> */}
              </Col>
            </Row>

           
            <table className="lineitem">
              <thead>
                <tr>
                  <th scope="col">Code <span className="required"> *</span></th>
                  <th scope="col">Name</th>
                  <th scope="col">WholeSale Price</th>
                  <th scope="col">Carton Price</th>
                  <th scope="col">Fixed Price</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody> 
                {purchaserequesteditdetails &&
                  purchaserequesteditdetails.map((item, index)  => {
                    return (
                      <tr key={item.id}>  
                       <td data-label="Title">
                      <Select
                          key={item.contact_id}
                          defaultValue={{ value: item.contact_id, label: item.contact_id }}
                          onChange={(e) => {
                            onchangeItem(e, item.contact_id);
                          }}
                          options={getsupplier}
                        />
                        <Input
                          value={item.contact_id}
                          type="hidden"
                          name="contact_id"
                          onChange={(e) => updateState(index, 'contact_id', e)}
                        ></Input>  
                        </td>                 
                        <td data-label="Title">
                          <Input
                            defaultValue={item.contact_id}
                            type="text"
                            name="contact_id"
                            onChange={(e) => updateSupplierState(index, 'contact_id', e)}
                            
                          />
                        </td>
                        <td data-label="Unit">
                          <Input
                            defaultValue={item.name}
                            type="text"
                            name="name"
                            onChange={(e) => updateSupplierState(index, 'name', e)}
                           
                          />
                        </td>
                        <td data-label="wholesale_price">
                          <Input
                            defaultValue={item.wholesale_price}
                            type="number"
                            name="wholesale_price"
                            onChange={(e) => updateSupplierState(index, 'wholesale_price', e)}
                          />
                        </td> 
                        <td data-label="carton_price">
                          <Input
                            defaultValue={item.carton_price}
                            type="number"
                            name="carton_price"
                            onChange={(e) => updateSupplierState(index, 'carton_price', e)}
                          />
                        </td>
                        <td data-label="carton_price">
                          <Input
                            defaultValue={item.fixed_price}
                            type="number"
                            name="fixed_price"
                            onChange={(e) => updateSupplierState(index, 'fixed_price', e)}
                          />
                        </td>  
                        <td data-label="carton_price">
                          <Input
                            defaultValue={item.fixed_price}
                            type="number"
                            name="fixed_price"
                            onChange={(e) => updateSupplierState(index, 'fixed_price', e)}
                          />
                        </td>                  
                      </tr>
                    );
                  })}
              </tbody>
              </table>
            
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            type="button"
            onClick={() => {
              editPurchaseRequestItems();
              
              // setTimeout(() => {
              //   window.location.reload()
              // }, 100);
            }}
          >
            Submit
          </Button>
          <Button
            color="secondary"
            onClick={() => {
              setMoreItem(false);
            }}
          >
            ancel
          </Button>
        </ModalFooter>
                
                
                </TabPane>
        
                {/* Customer Details Form */}
                {/* <TabPane tabId="2">
                  <ComponentCard title="Product Color">
                  <ProductColor
                   projectId={id}
                  ></ProductColor>
                  </ComponentCard>
                </TabPane>
                <TabPane tabId="3">
                  <ComponentCard title="Product Size">
                  <ProductSize
                    projectId={id}
                  ></ProductSize>
                  </ComponentCard>
                </TabPane> */}
                <TabPane tabId="3">
               

                 
                </TabPane>
                </TabContent>
                </ComponentCard>
        
      </Modal>
      


     
    </>
  );
};

