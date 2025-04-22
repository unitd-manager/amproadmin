import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button, Input, Table } from 'reactstrap';
import api from '../../constants/api';
import message from '../Message';

const ProductVariation = ({ productId }) => {
  const [variationList, setVariationList] = useState([]);
  const [variation, setVariation] = useState({
    child_product_code: '',
    child_product_name: '',
    variation_name: '',
    qty: '',
    variation_price: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [selectedVariationId, setSelectedVariationId] = useState(null);

  const handleChange = (e) => {
    setVariation({ ...variation, [e.target.name]: e.target.value });
  };

  const clearForm = () => {
    setEditMode(false);
    setSelectedVariationId(null);
    setVariation({
      child_product_code: '',
      child_product_name: '',
      variation_name: '',
      qty: '',
      variation_price: '',
    });
  };

  const fetchVariationList = () => {
    api
      .post('/product/getProductVariations', { product_id: productId })
      .then((res) => {
        setVariationList(res.data.data);
      })
      .catch(() => message('Failed to load variations', 'error'));
  };

  const addVariation = () => {
    if (variation.child_product_code && variation.variation_name) {
      api
        .post('/product/addProductVariation', { ...variation, product_id: productId })
        .then(() => {
          message('Variation added successfully', 'success');
          clearForm();
          fetchVariationList();
        })
        .catch(() => message('Failed to add variation', 'error'));
    } else {
      message('Please fill required fields', 'warning');
    }
  };

  const updateVariation = () => {
    api
      .post('/product/updateProductVariation', {
        variation_id: selectedVariationId, // eslint-disable-line camelcase
        ...variation,
      })
      .then(() => {
        message('Variation updated successfully', 'success');
        clearForm();
        fetchVariationList();
      })
      .catch(() => message('Failed to update variation', 'error'));
  };

  const deleteVariation = (variation_id) => { // eslint-disable-line camelcase
    api
      .post('/product/deleteProductVariation', { variation_id }) // eslint-disable-line camelcase
      .then(() => {
        message('Variation deleted successfully', 'success');
        fetchVariationList();
      })
      .catch(() => message('Failed to delete variation', 'error'));
  };

  const editVariation = (item) => {
    setEditMode(true);
    setSelectedVariationId(item.variation_id); // eslint-disable-line camelcase
    setVariation({
      child_product_code: item.child_product_code,
      child_product_name: item.child_product_name,
      variation_name: item.variation_name,
      qty: item.qty,
      variation_price: item.variation_price,
    });
  };

  useEffect(() => {
    if (productId) fetchVariationList();
  }, [productId]);

  return (
    <>
      <Row className="mb-3">
        <Col md="2">
          <Input name="child_product_code" value={variation.child_product_code} onChange={handleChange} placeholder="Child Product Code" />
        </Col>
        <Col md="2">
          <Input name="child_product_name" value={variation.child_product_name} onChange={handleChange} placeholder="Child Product Name" />
        </Col>
        <Col md="2">
          <Input name="variation_name" value={variation.variation_name} onChange={handleChange} placeholder="Variation Name" />
        </Col>
        <Col md="2">
          <Input name="qty" value={variation.qty} onChange={handleChange} placeholder="Qty" />
        </Col>
        <Col md="2">
          <Input name="variation_price" value={variation.variation_price} onChange={handleChange} placeholder="Variation Price" />
        </Col>
        <Col md="1">
          <Button color="primary" onClick={editMode ? updateVariation : addVariation}>
            {editMode ? 'Update' : 'Add'}
          </Button>
        </Col>
        <Col md="1">
          <Button color="secondary" onClick={clearForm}>Clear</Button>
        </Col>
      </Row>

      <Table bordered>
        <thead>
          <tr>
            <th>Child Product Code</th>
            <th>Child Product Name</th>
            <th>Variation Name</th>
            <th>Qty</th>
            <th>Variation Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {variationList.map((item) => (
            <tr key={item.variation_id}> {/* eslint-disable-line camelcase */}
              <td>{item.child_product_code}</td>
              <td>{item.child_product_name}</td>
              <td>{item.variation_name}</td>
              <td>{item.qty}</td>
              <td>{item.variation_price}</td>
              <td>
                <Button size="sm" color="info" onClick={() => editVariation(item)}>Edit</Button>{' '}
                <Button size="sm" color="danger" onClick={() => deleteVariation(item.variation_id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

ProductVariation.propTypes = {
  productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default ProductVariation;
