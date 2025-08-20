import React, { useState, useContext, useEffect } from 'react';
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
import api from '../../constants/api';
import message from '../Message';
import creationdatetime from '../../constants/creationdatetime';
import AppContext from '../../context/AppContext';

const StockRequestLineItem = ({
  addLineItemModal,
  setAddLineItemModal,
  stockRequestId,
  getLineItem,
}) => {
  StockRequestLineItem.propTypes = {
    addLineItemModal: PropTypes.bool,
    setAddLineItemModal: PropTypes.func,
    stockRequestId: PropTypes.any,
    getLineItem: PropTypes.any,
  };

  const { loggedInuser } = useContext(AppContext);

  const [addLineItem, setAddLineItem] = useState([
    {
      id: new Date().getTime().toString(),
      product_id: '',
      product_name: '',
      product_code: '',
      carton_qty: 0,
      loose_qty: 0,
      quantity: 0,
      pcs_per_carton: 0,
    },
  ]);

  const [productOptions, setProductOptions] = useState([]);

  // Fetch products
  const getProduct = () => {
    api.get('/product/getProducts').then((res) => {
      const items = res.data.data;
      const options = items.map((item) => ({
        value: item.product_id,
        label: item.product_name,
        product_code: item.product_code,
        pcs_per_carton: item.pcs_per_carton || 0,
      }));
      setProductOptions(options);
    });
  };

  // Add new row
  const AddNewLineItem = () => {
    setAddLineItem([
      ...addLineItem,
      {
        id: new Date().getTime().toString(),
        product_id: '',
        product_name: '',
        product_code: '',
        carton_qty: 0,
        loose_qty: 0,
        quantity: 0,
        pcs_per_carton: 0,
      },
    ]);
  };

  // Insert line item API
  const addLineItemApi = (obj) => {
    obj.creation_date = creationdatetime;
    obj.created_by = loggedInuser.employee_id;
    obj.stock_request_id = stockRequestId;

    api
      .post('/stockRequest/insertStockRequestProduct', obj)
      .then(() => {
        message('Line Item Added Successfully', 'success');
        getLineItem(stockRequestId);
      })
      .catch(() => {
        message('Cannot Add Line Items', 'error');
      });
  };

  // Collect all values
  const getAllValues = () => {
    addLineItem.forEach((item) => {
      addLineItemApi(item);
    });
  };

  // Handle product change
  const onChangeProduct = (selected, itemId) => {
    setAddLineItem((prevItems) =>
      prevItems.map((el) =>
        el.id === itemId
          ? {
              ...el,
              product_id: selected.value,
              product_name: selected.label,
              product_code: selected.product_code,
              pcs_per_carton: selected.pcs_per_carton,
            }
          : el
      )
    );
  };

  // Handle carton qty change
  const onChangeCartonQty = (value, item) => {
    const cartonQty = parseFloat(value) || 0;
    const looseQty = parseFloat(item.loose_qty) || 0;
    const pcsPerCarton = item.pcs_per_carton || 0;

    const totalQty = cartonQty * pcsPerCarton + looseQty;

    setAddLineItem((prevItems) =>
      prevItems.map((el) =>
        el.id === item.id
          ? { ...el, carton_qty: cartonQty, quantity: totalQty }
          : el
      )
    );
  };

  // Handle loose qty change
  const onChangeLooseQty = (value, item) => {
    const looseQty = parseFloat(value) || 0;
    const cartonQty = parseFloat(item.carton_qty) || 0;
    const pcsPerCarton = item.pcs_per_carton || 0;

    const totalQty = cartonQty * pcsPerCarton + looseQty;

    setAddLineItem((prevItems) =>
      prevItems.map((el) =>
        el.id === item.id
          ? { ...el, loose_qty: looseQty, quantity: totalQty }
          : el
      )
    );
  };

  // Remove row
  const ClearValue = (ind) => {
    setAddLineItem((current) => current.filter((obj) => obj.id !== ind.id));
  };

  useEffect(() => {
    getProduct();
  }, []);

  return (
    <Modal size="lg" isOpen={addLineItemModal}>
      <ModalHeader>
        Add Stock Request Items
        <Button
          className="shadow-none"
          color="secondary"
          onClick={() => setAddLineItemModal(false)}
        >
          X
        </Button>
      </ModalHeader>
      <ModalBody>
        <Row>
          <Col md="12">
            <Form>
              <Row>
                <Col md="3">
                  <Button
                    className="shadow-none"
                    color="primary"
                    type="button"
                    onClick={AddNewLineItem}
                  >
                    Add Line Item
                  </Button>
                </Col>
              </Row>

              <table className="lineitem">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Product Code</th>
                    <th>Carton Qty</th>
                    <th>Loose Qty</th>
                    <th>Qty</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {addLineItem &&
                    addLineItem.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <Select
                            key={item.id}
                            defaultValue={{
                              value: item.product_id,
                              label: item.product_name,
                            }}
                            onChange={(e) => onChangeProduct(e, item.id)}
                            options={productOptions}
                          />
                          <Input
                            value={item.product_id}
                            type="hidden"
                            name="product_id"
                          />
                          <Input
                            value={item.product_name}
                            type="hidden"
                            name="product_name"
                          />
                        </td>
                        <td>
                          <Input
                            value={item.product_code}
                            type="text"
                            name="product_code"
                            readOnly
                          />
                        </td>
                        <td>
                          <Input
                            type="number"
                            name="carton_qty"
                            value={item.carton_qty}
                            onChange={(e) =>
                              onChangeCartonQty(e.target.value, item)
                            }
                          />
                        </td>
                        <td>
                          <Input
                            type="number"
                            name="loose_qty"
                            value={item.loose_qty}
                            onChange={(e) =>
                              onChangeLooseQty(e.target.value, item)
                            }
                          />
                        </td>
                        <td>
                          <Input
                            value={item.quantity}
                            type="number"
                            name="quantity"
                            readOnly
                          />
                        </td>
                        <td>
                          <span
                            className="addline"
                            onClick={() => ClearValue(item)}
                          >
                            Clear
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              <ModalFooter>
                <Button
                  className="shadow-none"
                  color="primary"
                  onClick={getAllValues}
                >
                  Submit
                </Button>
                <Button
                  className="shadow-none"
                  color="secondary"
                  onClick={() => setAddLineItemModal(false)}
                >
                  Cancel
                </Button>
              </ModalFooter>
            </Form>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
};

export default StockRequestLineItem;
