import React, { useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalBody, Nav, NavItem, NavLink, TabContent, TabPane, Table } from 'reactstrap';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import moment from 'moment';
import api from '../constants/api';


const SalesInfoModal = ({ isOpen, toggle, salesOrderId }) => {
  const [activeTab, setActiveTab] = useState('info');
  const [salesOrder, setSalesOrder] = useState(null);
  const [salesOrderItems, setSalesOrderItems] = useState([]);

  useEffect(() => {
    if (isOpen && salesOrderId) {
      api.post('/salesorder/getSalesorderById', { sales_order_id: salesOrderId })
        .then(res => setSalesOrder(res.data.data[0]))
        .catch(() => setSalesOrder(null));

      api.post('/salesorder/getQuoteLineItemsById', { sales_order_id: salesOrderId })
        .then(res => setSalesOrderItems(res.data.data))
        .catch(() => setSalesOrderItems([]));
    }
  }, [isOpen, salesOrderId]);

  const toggleTab = tab => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>
        Sales Info : {salesOrder?.sales_order_code}
      </ModalHeader>
      <ModalBody>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === 'info' })}
              onClick={() => toggleTab('info')}
              style={{ cursor: 'pointer' }}
            >
              Info
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === 'log' })}
              onClick={() => toggleTab('log')}
              style={{ cursor: 'pointer' }}
            >
              Log
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab} className="mt-3">
          <TabPane tabId="info">
            {salesOrder ? (
              <Table>
                <tbody>
                  <tr>
                    <th>Created By</th>
                    <td>{salesOrder.created_by}</td>
                    <th>Created Date</th>
                    <td>{salesOrder.creation_date ? moment(salesOrder.creation_date).format('DD-MM-YYYY') : ''}</td>

                  </tr>
                  <tr>
                    <th>Modified By</th>
                    <td>{salesOrder.modified_by}</td>
                    <th>Modified Date</th>
                    <td>{salesOrder.modification_date ? moment(salesOrder.modification_date).format('DD-MM-YYYY') : ''}</td>

                  </tr>
                  <tr>
                    <th>Sales Order No</th>
                    <td>{salesOrder.tran_no}</td>
                  </tr>
                  {/* Add more fields as needed */}
                </tbody>
              </Table>
            ) : (
              <div>No data found.<br/>Please select an invoice with a sales order</div>
            )}
          </TabPane>
          <TabPane tabId="log">
            <Table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product Code</th>
                  <th>Product Name</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                  {/* Add more columns as needed */}
                </tr>
              </thead>
              <tbody>
                {salesOrderItems.length > 0 ? (
                  salesOrderItems.map((item, idx) => (
                    <tr key={item.item_id || idx}>
                      <td>{idx + 1}</td>
                      <td>{item.product_code}</td>
                      <td>{item.product_name}</td>
                      <td>{item.quantity}</td>
                      <td>{item.wholesale_price}</td>
                      <td>{item.total}</td>
                      {/* Add more fields as needed */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No items found.</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </TabPane>
        </TabContent>
      </ModalBody>
    </Modal>
  );
};

SalesInfoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  salesOrderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default SalesInfoModal;
