import React from 'react';
import { Row, Col, Button, Table } from 'reactstrap';
import PropTypes from 'prop-types';
import * as Icon from 'react-feather';
//import api from '../../constants/api';
import ComponentCard from '../ComponentCard';
import EditLineItemModal from './EditLineItemModal';
import StockRequestLineItem from './StockRequestLineItem';

const StockRequestProducts = ({
  addLineItemModal,
  setAddLineItemModal,
  lineItem,
  setEditLineModelItem,
  setEditLineModal,
  editLineModal,
  editLineModelItem,
  getLineItem,
  deleteRecord,
  id,
  setViewLineModal,
}) => {
  const columns = [
    { name: '#' },
    { name: 'Product Name' },
    { name: 'Product Code' },
    { name: 'Carton Qty' },
    { name: 'Loose Qty' },
    { name: 'Qty' },
    { name: 'Action' },
  ];

  const addStockItemsToggle = () => {
    setAddLineItemModal(!addLineItemModal);
  };

  const summary = {
    carton_qty: 0,
    loose_qty: 0,
    quantity: 0,
  };

  if (Array.isArray(lineItem)) {
    lineItem.forEach((item) => {
      summary.carton_qty += parseFloat(item.carton_qty || 0);
      summary.loose_qty += parseFloat(item.loose_qty || 0);
      summary.quantity += parseFloat(item.quantity || 0);
    });
  }

  const [selectedProduct, setSelectedProduct] = React.useState(null);
  console.log(selectedProduct);

  return (
    <ComponentCard title="Stock Request Products">
      <Row>
        <Col md="6">
          <Button color="primary" onClick={addStockItemsToggle}>
            Add Stock Items
          </Button>
        </Col>
      </Row>
      <br />
      <Table id="example" className="display border border-secondary rounded">
        <thead>
          <tr>
            {columns.map((cell) => (
              <td key={cell.name}>{cell.name}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          {lineItem &&
            lineItem.map((e, index) => (
              <tr key={e.stock_request_item_id}>
                <td>
                  <span
                    role="button"
                    tabIndex={0}
                    style={{
                      cursor: 'pointer',
                      color: 'blue',
                      textDecoration: 'underline',
                    }}
                    onClick={() => setSelectedProduct(e)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        setSelectedProduct(e);
                      }
                    }}
                  >
                    {index + 1}
                  </span>
                </td>

                <td>{e.product_name}</td>
                <td>{e.product_code}</td>
                <td>{e.carton_qty}</td>
                <td>{e.loose_qty}</td>
                <td>{e.quantity}</td>
                <td>
                  <span
                    className="addline"
                    onClick={() => {
                      setEditLineModelItem(e);
                      setEditLineModal(true);
                    }}
                  >
                    <Icon.Edit2 />
                  </span>
                  <span
                    className="addline"
                    onClick={() => deleteRecord(e.stock_request_item_id)}
                  >
                    <Icon.Trash2 />
                  </span>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>

      <EditLineItemModal
        editLineModal={editLineModal}
        setEditLineModal={setEditLineModal}
        FetchLineItemData={editLineModelItem}
        getLineItem={getLineItem}
        setViewLineModal={setViewLineModal}
      />

      {addLineItemModal && (
        <StockRequestLineItem
          addLineItemModal={addLineItemModal}
          setAddLineItemModal={setAddLineItemModal}
          stockRequestId={id}
          getLineItem={getLineItem}
        />
      )}
    </ComponentCard>
  );
};

StockRequestProducts.propTypes = {
  addLineItemModal: PropTypes.bool.isRequired,
  setAddLineItemModal: PropTypes.func.isRequired,
  lineItem: PropTypes.array.isRequired,
  setEditLineModelItem: PropTypes.func.isRequired,
  setEditLineModal: PropTypes.func.isRequired,
  editLineModal: PropTypes.bool.isRequired,
  editLineModelItem: PropTypes.object,
  getLineItem: PropTypes.func.isRequired,
  deleteRecord: PropTypes.func.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  setViewLineModal: PropTypes.func.isRequired,
};

export default StockRequestProducts;
