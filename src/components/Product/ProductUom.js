import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button, Input, Table } from 'reactstrap';
import api from '../../constants/api';
import message from '../Message';

const ProductUOM = ({ productId }) => {
  const [uomList, setUomList] = useState([]);
  const [uom, setUom] = useState({
    barcode: '',
    description: '',
    pcs_per_carton: '',
    retail_price: '',
    carton_price: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    setUom({ ...uom, [e.target.name]: e.target.value });
  };

  const clearFields = () => {
    setUom({
      barcode: '',
      description: '',
      pcs_per_carton: '',
      retail_price: '',
      carton_price: '',
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const fetchUomList = () => {
    api
      .post('/product/getProductUOM', { product_id: productId })
      .then((res) => {
        setUomList(res.data.data);
      })
      .catch(() => message('Failed to load UOM data', 'error'));
  };

  const addUom = () => {
    if (uom.barcode && uom.description) {
      api
        .post('/product/addProductUOM', { ...uom, product_id: productId })
        .then(() => {
          message('UOM added successfully', 'success');
          clearFields();
          fetchUomList();
        })
        .catch(() => message('Failed to add UOM', 'error'));
    } else {
      message('Please fill required fields', 'warning');
    }
  };

  const editUom = (item) => {
    setUom({
      barcode: item.barcode,
      description: item.description,
      pcs_per_carton: item.pcs_per_carton,
      retail_price: item.retail_price,
      carton_price: item.carton_price,
    });
    setIsEditing(true);
    setEditingId(item.uom_id);
  };

  const updateUom = () => {
    if (editingId && uom.barcode && uom.description) {
      api
        .post('/product/updateProductUOM', { ...uom, uom_id: editingId })
        .then(() => {
          message('UOM updated successfully', 'success');
          clearFields();
          fetchUomList();
        })
        .catch(() => message('Failed to update UOM', 'error'));
    } else {
      message('Please fill required fields', 'warning');
    }
  };

  const deleteUom = (uomId) => {
    if (window.confirm('Are you sure you want to delete this UOM?')) {
      api
        .post('/product/deleteProductUOM', { uom_id: uomId })
        .then(() => {
          message('UOM deleted successfully', 'success');
          fetchUomList();
        })
        .catch(() => message('Failed to delete UOM', 'error'));
    }
  };

  useEffect(() => {
    if (productId) fetchUomList();
  }, [productId]);

  return (
    <>
      <Row className="mb-3">
        <Col md="2">
          <Input name="barcode" value={uom.barcode} onChange={handleChange} placeholder="Bar Code" />
        </Col>
        <Col md="3">
          <Input name="description" value={uom.description} onChange={handleChange} placeholder="Description" />
        </Col>
        <Col md="2">
          <Input name="pcs_per_carton" value={uom.pcs_per_carton} onChange={handleChange} placeholder="Pcs/Carton" />
        </Col>
        <Col md="2">
          <Input name="retail_price" value={uom.retail_price} onChange={handleChange} placeholder="Retail Price" />
        </Col>
        <Col md="2">
          <Input name="carton_price" value={uom.carton_price} onChange={handleChange} placeholder="Carton Price" />
        </Col>
        <Col md="1" className="d-flex gap-1 flex-column">
          <Button color={isEditing ? 'success' : 'primary'} onClick={isEditing ? updateUom : addUom}>
            {isEditing ? 'Update' : 'Add'}
          </Button>
          <Button color="secondary" onClick={clearFields}>Clear</Button>
        </Col>
      </Row>

      <Table bordered>
        <thead>
          <tr>
            <th>Barcode</th>
            <th>Description</th>
            <th>Pcs/Carton</th>
            <th>Retail Price</th>
            <th>Carton Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {uomList.map((item) => (
            <tr key={item.uom_id || item.barcode}>
              <td>{item.barcode}</td>
              <td>{item.description}</td>
              <td>{item.pcs_per_carton}</td>
              <td>{item.retail_price}</td>
              <td>{item.carton_price}</td>
              <td>
                <Button size="sm" color="info" onClick={() => editUom(item)} className="me-1">
                  Edit
                </Button>
                <Button size="sm" color="danger" onClick={() => deleteUom(item.uom_id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

ProductUOM.propTypes = {
  productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default ProductUOM;
