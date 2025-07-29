import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Table
} from 'reactstrap';
import PropTypes from 'prop-types';
import api from '../../constants/api';
import message from '../Message';

const BarcodeManagerModal = ({ isOpen, toggle, productId, productTitle }) => {
  const [barcodes, setBarcodes] = useState([]);
  const [newBarcode, setNewBarcode] = useState('');

  useEffect(() => {
    if (productId) {
      api
        .post('/product/getProductBarcodes', { product_id: productId })
        .then((res) => setBarcodes(res.data.data || []))
        .catch(() => message('Failed to fetch barcodes', 'error'));
    }
  }, [productId]);

  const handleAddBarcode = () => {
    if (!newBarcode) return;

    setBarcodes([...barcodes, { barcode: newBarcode }]);
    setNewBarcode('');
  };

  const handleDelete = (barcodeToDelete) => {
    setBarcodes(barcodes.filter((b) => b.barcode !== barcodeToDelete));
  };

  const handleSave = () => {
    api
      .post('/product/saveBarcodes', {
        product_id: productId,
        barcodes: barcodes.map((b) => b.barcode)
      })
      .then(() => message('Barcodes saved successfully', 'success'))
      .catch(() => message('Failed to save barcodes', 'error'));
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Barcode</ModalHeader>
      <ModalBody>
        <h5 className="mb-3">{productTitle}</h5>
        <Input
          type="text"
          placeholder="Enter Barcode"
          value={newBarcode}
          onChange={(e) => setNewBarcode(e.target.value)}
        />
        <Button color="dark" onClick={handleAddBarcode} className="mt-2 mb-3">
          <i className="fa fa-plus"></i>
        </Button>
        <Table bordered>
          <thead>
            <tr>
              <th>Barcode</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {barcodes.map((item, ) => (
              <tr key={productId}>
                <td>{item.barcode}</td>
                <td>
                  <Button
                    color="danger"
                    size="sm"
                    onClick={() => handleDelete(item.barcode)}
                  >
                    <i className="fa fa-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSave}>Save</Button>
        <Button color="danger" onClick={toggle}>Delete</Button>
      </ModalFooter>
    </Modal>
  );
};

BarcodeManagerModal.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
  productId: PropTypes.string,
  productTitle: PropTypes.string
};

export default BarcodeManagerModal;
