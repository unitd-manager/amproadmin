import React, { useState, useContext, useEffect } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  Input,
  Button,
  Label,
} from 'reactstrap';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { useParams } from 'react-router-dom';
import api from '../../constants/api';
import message from '../Message';
import creationdatetime from '../../constants/creationdatetime';
import AppContext from '../../context/AppContext';


const EditLineItemModal = ({ editLineModal, setEditLineModal, FetchLineItemData, insertquote }) => {
  EditLineItemModal.propTypes = {
    editLineModal: PropTypes.bool,
    setEditLineModal: PropTypes.func,
    FetchLineItemData: PropTypes.object,
    insertquote: PropTypes.func,
  };

  const { id } = useParams();
  const { loggedInuser } = useContext(AppContext);
  const [lineItemData, setLineItemData] = useState({});
  const [productOptions, setProductOptions] = useState([]);

  useEffect(() => {
    api.get('/product/getProducts').then((res) => {
      const items = res.data.data.map((item) => ({
        value: item.product_id,
        label: item.product_name,
        product_code: item.product_code,
        carton_price: item.carton_price,
        wholesale_price: item.wholesale_price,
        pcs_per_carton: item.pcs_per_carton,
      }));
      setProductOptions(items);
    });
  }, []);

  useEffect(() => {
    if (FetchLineItemData) setLineItemData(FetchLineItemData);
  }, [FetchLineItemData]);

  
  const recalculate = (data) => {
    const cartonQty = parseFloat(data.carton_qty) || 0;
    const looseQty = parseFloat(data.loose_qty) || 0;
    const pcsPerCarton = parseFloat(data.pcs_per_carton) || 0;
    const cartonPrice = parseFloat(data.carton_price) || 0;
    const wholesalePrice = parseFloat(data.wholesale_price) || 0;
    const discount = parseFloat(data.discount_value) || 0;

    const quantity = cartonQty * pcsPerCarton + looseQty;
    const cartonTotal = cartonQty * cartonPrice;
    const looseTotal = looseQty * wholesalePrice;
    const total = cartonTotal + looseTotal;
    const grossTotal = total - discount;

    setLineItemData((prev) => ({
      ...prev,
      quantity,
      total: total.toFixed(2),
      gross_total: grossTotal.toFixed(2),
    }));
  };

  const handleProductChange = (selected) => {
    const updated = {
      ...lineItemData,
      title: selected.Label,
      product_id: selected.value,
      product_name: selected.label,
      product_code: selected.product_code,
      carton_price: selected.carton_price,
      wholesale_price: selected.wholesale_price,
      pcs_per_carton: selected.pcs_per_carton || 0,
    };
    setLineItemData(updated);
    recalculate(updated);
  };

  const handleChange = (e) => {
    const updated = { ...lineItemData, [e.target.name]: e.target.value };
    setLineItemData(updated);
    recalculate(updated);
  };


  const UpdateData = () => {
    const updatedData = {
      ...lineItemData,
      quote_id: id,
      modification_date: creationdatetime,
      modified_by: loggedInuser.first_name,
    };

    api
      .post('/salesOrder/edit-TabQuoteLine', updatedData)
      .then(() => {
        message('Edit Line Item Updated Successfully.', 'success');
        window.location.reload();
        insertquote();
      })
      .catch(() => {
        message('Update Failed', 'error');
      });
  };

  return (
    <Modal isOpen={editLineModal} size="lg">
      <ModalHeader>Edit Sales Item</ModalHeader>
      <ModalBody>
        <Row className="mb-3">
          <Col md="6">
            <Label>Product</Label>
            <Select
              value={
                lineItemData.product_id
                  ? {
                      value: lineItemData.product_id,
                      label: lineItemData.product_name,
                    }
                  : null
              }
              options={productOptions}
              onChange={handleProductChange}
            />
          </Col>
          <Col md="6">
            <Label>Product Code</Label>
            <Input
              type="text"
              name="product_code"
              value={lineItemData.product_code || ''}
              onChange={handleChange}
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md="4">
            <Label>Carton Qty</Label>
            <Input
              type="number"
              name="carton_qty"
              value={lineItemData.carton_qty || ''}
              onChange={handleChange}
            />
          </Col>
          <Col md="4">
            <Label>Loose Qty</Label>
            <Input
              type="number"
              name="loose_qty"
              value={lineItemData.loose_qty || ''}
              onChange={handleChange}
            />
          </Col>
          <Col md="4">
            <Label>Total Qty</Label>
            <Input
              type="number"
              name="quantity"
              value={lineItemData.quantity || ''}
              disabled
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md="4">
            <Label>Carton Price</Label>
            <Input
              type="number"
              name="carton_price"
              value={lineItemData.carton_price || ''}
              onChange={handleChange}
            />
          </Col>
          <Col md="4">
            <Label>Loose Price</Label>
            <Input
              type="number"
              name="wholesale_price"
              value={lineItemData.wholesale_price || ''}
              onChange={handleChange}
            />
          </Col>
          <Col md="4">
            <Label>Total</Label>
            <Input
              type="number"
              name="total"
              value={lineItemData.total || ''}
              disabled
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md="6">
            <Label>Discount</Label>
            <Input
              type="number"
              name="discount_value"
              value={lineItemData.discount_value || ''}
              onChange={handleChange}
            />
          </Col>
          <Col md="6">
            <Label>Gross Total</Label>
            <Input
              type="number"
              name="gross_total"
              value={lineItemData.gross_total || ''}
              disabled
            />
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={UpdateData}>
          Save & Continue
        </Button>
        <Button color="secondary" onClick={() => setEditLineModal(false)}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditLineItemModal;
