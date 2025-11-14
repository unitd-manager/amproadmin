import React, { useState, useEffect } from 'react';
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

const EditLineItemModal = ({ editLineModal, setEditLineModal, FetchLineItemData, getLineItem }) => {
  EditLineItemModal.propTypes = {
    editLineModal: PropTypes.bool,
    setEditLineModal: PropTypes.func,
    FetchLineItemData: PropTypes.object,
    getLineItem: PropTypes.any,
  };

  const { id } = useParams();
  const [lineItemData, setLineItemData] = useState({});
  const [productOptions, setProductOptions] = useState([]);

  // Load product list
  useEffect(() => {
    api.get('/product/getProducts').then((res) => {
      const items = res.data.data.map((item) => ({
        value: item.product_id,
        label: item.product_name,
        product_code: item.product_code,
        pcs_per_carton: item.pcs_per_carton,
      }));
      setProductOptions(items);
    });
  }, []);

  // Load existing line item
  useEffect(() => {
    if (FetchLineItemData) setLineItemData(FetchLineItemData);
  }, [FetchLineItemData]);

  // Recalculate Qty
  const recalculate = (data) => {
    const cartonQty = parseFloat(data.carton_qty) || 0;
    const looseQty = parseFloat(data.loose_qty) || 0;
    const pcsPerCarton = parseFloat(data.pcs_per_carton) || 0;

    const quantity = cartonQty * pcsPerCarton + looseQty;

    setLineItemData((prev) => ({
      ...prev,
      quantity,
    }));
  };

  const handleProductChange = (selected) => {
    const updated = {
      ...lineItemData,
      product_id: selected.value,
      product_name: selected.label,
      product_code: selected.product_code,
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
      stock_request_id: id,
      modification_date: creationdatetime,
    };

    api
      .post('/stockRequest/edit-TabQuoteLine', updatedData)
      .then(() => {
        message('Stock Request Line Item Updated Successfully.', 'success');
        setEditLineModal(false);
        getLineItem();
      })
      .catch(() => {
       
      });
  };

  return (
    <Modal isOpen={editLineModal} size="lg">
      <ModalHeader>Edit Stock Request Item</ModalHeader>
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
