import React, { useState,useContext } from 'react';
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import PropTypes from 'prop-types';
import Select from 'react-select';
import * as $ from 'jquery';
import random from 'random';
import api from '../../constants/api';
import message from '../Message';
import creationdatetime from '../../constants/creationdatetime';
import AppContext from '../../context/AppContext';


const QuoteLineItem = ({
  addLineItemModal,
  setAddLineItemModal,
  quoteLine,
  tenderDetails,
  getLineItem,

}) => {
  QuoteLineItem.propTypes = {
    addLineItemModal: PropTypes.bool,
    setAddLineItemModal: PropTypes.func,
    quoteLine: PropTypes.any,
    tenderDetails: PropTypes.any,
    getLineItem: PropTypes.any,

  };
  const [totalAmount, setTotalAmount] = useState(0);
  const [addLineItem, setAddLineItem] = useState([
    {
      id: random.int(1, 99),
      unit: '',
      quantity: '',
      unit_price: '',
      amount: '',
      remarks: '',
      title: '',
      description: '',
    },
  ]);
    //get staff details
    const { loggedInuser } = useContext(AppContext);
    const [getProductValue, setProductValue] = useState();
    const getProduct = () => {
      api.get('/product/getProducts').then((res) => {
        const items = res.data.data;
        const finaldat = items.map((item) => ({
          value: item.product_id,
          label: item.product_name,
          product_code: item.product_code,
          carton_price: item.carton_price,
          wholesale_price: item.wholesale_price,
          pcs_per_carton: item.pcs_per_carton,
        }));
        setProductValue(finaldat);
      });
    };
    

  //Add new line item
  const AddNewLineItem = () => {
    setAddLineItem([
      ...addLineItem,
      {
        id: new Date().getTime().toString(),
        unit: '',
        quantity: '',
        unit_price: '',
        remarks: '',
        amount: '',
        title: '',
        description: '',
      },
    ]);
  };
  //Insert Invoice Item
  const addLineItemApi = (obj) => {
    obj.creation_date = creationdatetime;
    obj.created_by = loggedInuser.first_name;
    //obj.opportunity_id = projectInfo;
    obj.invoice_id = quoteLine;
    api
      .post('/invoice/insertQuoteItems', obj)
      .then(() => {
        message('Line Item Added Successfully', 'sucess');
        window.location.reload();
        getLineItem(tenderDetails.sales_order_id);
        
      })
      .catch(() => {
       // message('Cannot Add Line Items', 'error');
      });
  };
  //Invoice item values
  const getAllValues = () => {
    const result = [];
    let isValid = true; // Initialize a validation flag
    $('.lineitem tbody tr').each(function input() {
      const allValues = {};
      $(this)
        .find('input')
        .each(function output() {
          const fieldName = $(this).attr('name');
          const fieldValue = $(this).val();
          allValues[fieldName] = fieldValue;

          // Check if Amount, Title, and Description are empty
          if (fieldName === 'amount' || fieldName === 'title' || fieldName === 'description') {
            if (!fieldValue) {
              isValid = false; // Set the flag to false if any of these fields are empty
            }
          }
        });
      result.push(allValues);
    });
    if (!isValid) {
      alert('Please fill in Amount, Title, and Description for all line items.');
      return; // Prevent further processing if validation fails
    }
    setTotalAmount(0);
    console.log(result);
    result.forEach((element) => {
      addLineItemApi(element);
    });
    console.log(result);
  };

  const [unitdetails, setUnitDetails] = useState();
  // Fetch data from API
    const getUnit = () => {
      api.get('/salesOrder/getUnitFromValueList', unitdetails)
        .then((res) => {
          const items = res.data.data
          const finaldat = []
          items.forEach(item => {
            finaldat.push({ value: item.value, label: item.value })
          })
          setUnitDetails(finaldat)
        })
    }
  
    const onchangeItem1 = (selected, itemId) => {
      setAddLineItem((prevItems) =>
        prevItems.map((el) =>
          el.id === itemId
            ? {
                ...el,
                title: selected.label,
                item_title: selected.label,
                product_id: selected.value.toString(),
                product_name: selected.label,
                product_code: selected.product_code,
                carton_price: selected.carton_price,
                wholesale_price: selected.wholesale_price,
                pcs_per_carton: selected.pcs_per_carton || 0,
              }
            : el
        )
      );
    };
    
 
  // Clear row value
  const ClearValue = (ind) => {
    setAddLineItem((current) =>
      current.filter((obj) => {
        return obj.id !== ind.id;
      }),
    );
    if (ind.amount) {
      const finalTotal = totalAmount - parseFloat(ind.amount);
      setTotalAmount(finalTotal);
    }
  };
  React.useEffect(() => {
    getUnit();
    getProduct();
  }, []);
  return (
    <>
      <Modal size="xl" isOpen={addLineItemModal}>
        <ModalHeader>
         Add Sales Items
          <Button
            className="shadow-none"
            color="secondary"
            onClick={() => {
              setAddLineItemModal(false);
            }}
          >
            X
          </Button>
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col md="12">
              <Form>
                <Row>
                  <Row>
                    <Col md="3">
                      <Button
                        className="shadow-none"
                        color="primary"
                        type="button"
                        onClick={() => {
                          AddNewLineItem();
                        }}
                      >
                        Add Line Item
                      </Button>
                    </Col>
                  </Row>
                  {/* Invoice Item */}
                  
                    <table className="lineitem">
                      <thead>
                        <tr>
                          <th scope="col">Product Name </th>
                          <th scope="col">Product Code</th>
                          <th scope="col">Carton Qty</th>
                          <th scope="col">Loose Qty</th>
                          <th scope="col">Qty</th>
                          <th scope="col">Carton Price</th>
                          <th scope="col">Price</th>
                          <th scope="col">Total</th>
                          <th scope="col">Discount</th>
                          <th scope="col">Gross Total</th>
                          <th scope="col"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {addLineItem &&
                          addLineItem.map((item) => {
                            return (
                              <tr key={item.id}>
                                  <td data-label="title">
                        <Select
                          key={item.id}
                          defaultValue={{ value: item.product_id, label: item.product_name }}
                          onChange={(e) => {
                            onchangeItem1(e, item.id);
                          }}
                          options={getProductValue}
                        />
                        <Input value={item.product_id} type="hidden" name="product_id"></Input>
                        <Input value={item.product_name} type="hidden" name="title"></Input>
                        
                      </td>
                                <td data-label="Product Name">
                                  <Input value={item.product_code} type="text" name="product_code" />
                                </td>
                                <Input
  type="number"
  name="carton_qty"
  value={item.carton_qty}
  onChange={(e) => {
    const cartonQty = parseFloat(e.target.value) || 0;
    const pcsPerCarton = item.pcs_per_carton || 0;
    const cartonPrice = parseFloat(item.carton_price) || 0;
    const discount = parseFloat(item.discount) || 0;

    const quantity = cartonQty * pcsPerCarton;
    const total = cartonQty * cartonPrice;
    const grosstotal = total - discount;

    setAddLineItem((prevItems) =>
      prevItems.map((el) =>
        el.id === item.id
          ? {
              ...el,
              carton_qty: cartonQty,
              quantity,
              total: total.toFixed(2),
              gross_total: grosstotal.toFixed(2),
            }
          : el
      )
    );
  }}
/>



<td data-label="Loose Qty">
  <Input
    type="number"
    name="loose_qty"
    value={item.loose_qty}
    onChange={(e) => {
      const looseQty = parseFloat(e.target.value) || 0;
      const cartonQty = parseFloat(item.carton_qty) || 0;
      const pcsPerCarton = parseFloat(item.pcs_per_carton) || 0;
      const cartonPrice = parseFloat(item.carton_price) || 0;
      const wholesalePrice = parseFloat(item.wholesale_price) || 0;
      const discount = parseFloat(item.discount) || 0;

      const quantity = cartonQty * pcsPerCarton + looseQty;
      const cartonTotal = cartonQty * cartonPrice;
      const looseTotal = looseQty * wholesalePrice;
      const total = cartonTotal + looseTotal;
      const grossTotal = total - discount;

      setAddLineItem((prevItems) =>
        prevItems.map((el) =>
          el.id === item.id
            ? {
                ...el,
                loose_qty: looseQty,
                quantity,
                total: total.toFixed(2),
                gross_total: grossTotal.toFixed(2),
              }
            : el
        )
      );
    }}
  />
</td>

                                <td data-label="Quantity">
                                  <Input
                                    value={item.quantity}
                                  
                                    type="number"
                                    name="quantity"
                                  />
                                </td>
                                <td data-label="Carton Price">
                                  <Input value={item.carton_price} type="text" name="carton_price" />
                                </td>
                                <td data-label="wholesale price">
                                  <Input value={item.wholesale_price} type="text" name="wholesale_price" />
                                </td>
                                <td data-label="total">
                                  <Input value={item.total} type="text" name="total" />
                                </td>
                                <Input
  value={item.discount}
  type="number"
  name="discount_value"
  onChange={(e) => {
    const discount = parseFloat(e.target.value) || 0;
    const total = parseFloat(item.total) || 0;
    const grosstotal = total - discount;

    setAddLineItem((prevItems) =>
      prevItems.map((el) =>
        el.id === item.id
          ? {
              ...el,
              discount,
              gross_total: grosstotal.toFixed(2),
            }
          : el
      )
    );
  }}
/>

                                <td data-label="gross_total">
                                  <Input Value={item.gross_total} type="text" name="gross_total" />
                                </td>
                                <td data-label="Action">
                                  <Input type="hidden" name="id" Value={item.id}></Input>
                                  <span
                                    className="addline"
                                    onClick={() => {
                                      ClearValue(item);
                                    }}
                                  >
                                    Clear
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  
                  <ModalFooter>
                    <Button
                      className="shadow-none"
                      color="primary"
                      onClick={() => {
                        getAllValues();
                        //setAddLineItemModal(false);
                      }}
                    >
                      {' '}
                      Submit{' '}
                    </Button>
                    <Button
                      className="shadow-none"
                      color="secondary"
                      onClick={() => {
                        setAddLineItemModal(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </ModalFooter>
                </Row>
              </Form>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </>
  );
};
export default QuoteLineItem;
