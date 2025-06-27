import React, { useState, useContext, useEffect } from 'react';
import {
  Row,
  Col,
  Input,
  Button,
  FormGroup,
  Label,
} from 'reactstrap';
import PropTypes from 'prop-types';
import { ToastContainer } from 'react-toastify';
import ComponentCard from '../ComponentCard';
import api from '../../constants/api';
import message from '../Message';
import creationdatetime from '../../constants/creationdatetime';
import AppContext from '../../context/AppContext';

const Stock = ({ ProductId, getProductById, productDetails }) => {
  const { loggedInuser } = useContext(AppContext);

  const [stockForm, setStockForm] = useState({
    product_code: '',
    product_name: '',
    location_code: 'HQ',
    carton_qty: 0,
    loose_qty: 0,
    qty: 0,
    purchase_unit_cost: '',
    retail_price: '',
    wholesale_price: '',
    carton_price: '',
    operation_cost: '',
    minimum_qty: '',
    reorder_qty: '',
    open_po_qty: '',
    last_stock_take_date: new Date().toISOString().slice(0, 16),
  });

  const handleChange = (e) => {
    setStockForm({ ...stockForm, [e.target.name]: e.target.value });
  };
console.log('ProductId passed to API:', ProductId);
//  const getLatestStockByProductId = () => {
//   api
//     .post('/product/getLatestByProductId', { product_id: ProductId })
//     .then((res) => {
     
//       } else {
//         message('No stock records found for this product.', 'warning');
//       }
//     })
//     .catch((err) => {
//       console.error('Stock fetch failed:', err);
//       message('Failed to fetch latest stock record', 'error');
//     });
// };

const getLatestStockByProductId = () => {
  api
    .post('/product/getLatestByProductId', { product_id: ProductId })
    .then((res) => {
      const latestStock = res.data?.data;
      if (latestStock) {
        setStockForm((prev) => ({
          ...prev,
          ...latestStock,
        }));
      } else {
        message('No stock record found for this product.', 'warning');
      }
    })
    .catch((err) => {
      console.error('Stock fetch error:', err);
      message('Failed to fetch latest stock record', 'warning');
    });
};
  

  const saveStock = () => {
    const payload = {
      ...stockForm,
      created_by: loggedInuser.first_name,
      creation_date: creationdatetime,
      product_id: productDetails.product_id,
      last_stock_take_date: new Date().toISOString().slice(0, 16),
    };

    api
      .post('/product/insertProdutStock', payload)
      .then(() => {
        message('New Product Stock record inserted successfully.', 'success');
        getLatestStockByProductId();
      })
      .catch(() => {
        message('Network connection error.', 'error');
      });
  };

 

  useEffect(() => {
    getProductById();
    getLatestStockByProductId();

  }, [ProductId]);

  return (
    <div>
      <ToastContainer />
      <Row>
        <Col md="12">
          <ComponentCard title="Stock">
            <FormGroup>
              <Row>
                <Col md="6">
                  <Label>Product Code</Label>
                  <Input type="text" value={productDetails?.product_code || ''} disabled />
                </Col>
                <Col md="6">
                  <Label>Product Name</Label>
                  <Input type="text" value={productDetails?.title || ''} disabled />
                </Col>
              </Row>
            </FormGroup>

            <Row className="mb-2">
              <Col md="2">
                <Label>Minimum Qty</Label>
                <Input
                  type="text"
                  name="minimum_qty"
                  value={stockForm.minimum_qty}
                  onChange={handleChange}
                />
              </Col>
              <Col md="2">
                <Label>Reorder Qty</Label>
                <Input
                  type="text"
                  name="reorder_qty"
                  value={stockForm.reorder_qty}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            <div style={{ overflowX: 'auto' }}>
              <table className="table table-bordered table-striped table-sm" style={{ minWidth: '1500px' }}>
                <thead className="thead-dark">
                  <tr>
                    <th>Location Code</th>
                    <th>CQty</th>
                    <th>LQty</th>
                    <th>Qty</th>
                    <th>Purchase Unit Cost</th>
                    <th>Retail Price</th>
                    <th>Wholesale Price</th>
                    <th>Carton Price</th>
                    <th>Operation Cost</th>
                    <th>Minimum Qty</th>
                    <th>ReOrder Qty</th>
                    <th>Open POQty</th>
                    <th>Last StockTake Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><Input type="text" name="location_code" value={stockForm.location_code} onChange={handleChange} disabled /></td>
                    <td><Input type="text" name="carton_qty" value={stockForm.carton_qty} onChange={handleChange} disabled /></td>
                    <td><Input type="text" name="loose_qty" value={stockForm.loose_qty} onChange={handleChange} disabled /></td>
                    <td><Input type="text" name="qty" value={stockForm.qty} onChange={handleChange}disabled /></td>
                    <td><Input type="text" name="purchase_unit_cost" value={stockForm.purchase_unit_cost} onChange={handleChange} /></td>
                    <td><Input type="text" name="retail_price" value={stockForm.retail_price} onChange={handleChange} /></td>
                    <td><Input type="text" name="wholesale_price" value={stockForm.wholesale_price} onChange={handleChange} /></td>
                    <td><Input type="text" name="carton_price" value={stockForm.carton_price} onChange={handleChange} /></td>
                    <td><Input type="text" name="operation_cost" value={stockForm.operation_cost} onChange={handleChange} /></td>
                    <td><Input type="text" name="minimum_qty" value={stockForm.minimum_qty} onChange={handleChange} /></td>
                    <td><Input type="text" name="reorder_qty" value={stockForm.reorder_qty} onChange={handleChange} /></td>
                    <td><Input type="text" name="open_po_qty" value={stockForm.open_po_qty} onChange={handleChange} /></td>
                    <td><Input type="datetime-local" name="last_stock_take_date" value={stockForm.last_stock_take_date} onChange={handleChange} disabled /></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="d-flex gap-2 pt-3">
              <Button color="primary" onClick={saveStock}>Save</Button>
            </div>
          </ComponentCard>
        </Col>
      </Row>
    </div>
  );
};

Stock.propTypes = {
  ProductId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  getProductById: PropTypes.func.isRequired,
  productDetails: PropTypes.any,
};

export default Stock;
