import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  FormGroup,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  
} from 'reactstrap';
import PropTypes from 'prop-types';
import random from 'random';
import Select from 'react-select';
import api from '../../constants/api';

export default function ContactPriceButton ({  addPurchaseOrderModal, setAddPurchaseOrderModal }){
  ContactPriceButton.propTypes = {
    addPurchaseOrderModal: PropTypes.bool,
    
    setAddPurchaseOrderModal: PropTypes.func,
  };

 
  
  
  //const [ItemCode, setItemcode] = useState();
  const [getProductValue, setProductValue] = useState();
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
        finaldat.push({ value: item.product_id, label: item.title });
      });
      setProductValue(finaldat);
    });
  };

  // Materials Purchased


  

  

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



  //Insert Product Data
  


  useEffect(() => {
    getCustomer();
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
        <ModalHeader>Add Product</ModalHeader>

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
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            className="shadow-none"
            onClick={() => {
             
              // insertlineItem(res.data.data.insertId);
            
               getCustomer();
               
             
    
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
      </Modal>

     
    </>
  );
};

