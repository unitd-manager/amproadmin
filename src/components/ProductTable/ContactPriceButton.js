import React, { useState, useEffect, useContext } from 'react';
import {
  Input,
  Button,
  Modal,
  ModalFooter,
  NavItem,
  NavLink,
  Nav,
  TabPane,
  TabContent
} from 'reactstrap';
import PropTypes from 'prop-types';
import random from 'random';
import Select from 'react-select';
import message from '../Message';
import api from '../../constants/api';
import ComponentCard from '../ComponentCard';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import AppContext from '../../context/AppContext';
import creationdatetime from '../../constants/creationdatetime';

export default function ContactPriceButton({
  addPurchaseOrderModal,
  setAddPurchaseOrderModal,
  ProductId,
  productDetails
}) {
  ContactPriceButton.propTypes = {
    addPurchaseOrderModal: PropTypes.bool,
    setAddPurchaseOrderModal: PropTypes.func,
    ProductId: PropTypes.any,
    productDetails: PropTypes.any
  };

  const [activeTab, setActiveTab] = useState('1');
  const [getProductValue, setProductValue] = useState([]);
  const [getsupplier, setSupplier] = useState([]);
  const [addMoreItem, setMoreItem] = useState([]);
  const [purchaserequesteditdetails, setPurchaseRequestEditDetails] = useState([]);
  const { loggedInuser } = useContext(AppContext);

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const AddNewLineItem = () => {
    setMoreItem([
      ...addMoreItem,
      {
        id: random.int(0, 9999).toString(),
        itemId: '',
        unit: '',
        qty: '',
        price: '',
        mrp: '',
        gst: '',
        description: '',
        code: '',
        title: ''
      }
    ]);
  };

  const getCustomer = () => {
    api.get('/product/getContact').then((res) => {
      const items = res.data.data;
      const formatted = items.map((item) => ({
        contact_id: item.contact_id,
        company_name: item.company_name,
        customer_code: item.customer_code,
        wholesale_price: item.wholesale_price,
        carton_price: item.carton_price
      }));
      setProductValue(formatted);
    });
  };

  const getSupplier = () => {
    api.get('/product/getSupplier').then((res) => {
      const items = res.data.data;
      const formatted = items.map((item) => ({
        value: item.contact_id,
        label: item.contact_id,
        company_name: item.company_name
      }));
      setSupplier(formatted);
    });
  };

  const ProductLineItemById = () => {
    api
      .post('/product/getCSProductByProductId', { product_id: ProductId })
      .then((res) => setMoreItem(res.data.data))
      .catch(() => message('Order Data Not Found', 'info'));
  };

  const EditCSProductLineItems = () => {
    addMoreItem.forEach((item) => {
      api
        .post('/product/EditCSProductLineItems', item)
        .then(() => message('Line Item Edited Successfully', 'success'))
        .catch(() => message('Cannot Edit Line Items', 'error'));
    });
  };

  const updateState = (index, property, e) => {
    const copy = [...addMoreItem];
    copy[index] = { ...copy[index], [property]: e.target.value };
    setMoreItem(copy);
  };

  const onchangeItem = (selectedOption, itemId) => {
    console.log('onchangeItem selectedOption:', selectedOption, 'itemId:', itemId);
    const updated = addMoreItem.map((el) =>
      el.id === itemId
        ? {
            ...el,
            itemId: selectedOption.contact_id,
            code: selectedOption.customer_code,
            title: selectedOption.company_name,
            price: selectedOption.wholesale_price || '',
            mrp: selectedOption.carton_price || ''
          }
        : el
    );
    setMoreItem(updated);
  };

  const ClearValue = (item) => {
    setMoreItem((current) => current.filter((obj) => obj.id !== item.id));
  };

  const PurchaseRequestLineItemById = () => {
    api
      .post('/product/getCSSupplierProductByProductId', { product_id: ProductId })
      .then((res) => setPurchaseRequestEditDetails(res.data.data))
      .catch(() => message('Order Data Not Found', 'info'));
  };

  const updateSupplierState = (index, property, e) => {
    const copy = [...purchaserequesteditdetails];
    copy[index] = {
      ...copy[index],
      [property]: e.target.value,
      modification_date: creationdatetime,
      modified_by: loggedInuser.first_name
    };
    setPurchaseRequestEditDetails(copy);
  };

  const editPurchaseRequestItems = () => {
    purchaserequesteditdetails.forEach((item) => {
      api
        .post('/product/EditCSProductLineItemsBYSupplierID', item)
        .then(() => message('Line Item Edited Successfully', 'success'))
        .catch(() => message('Cannot Edit Line Items', 'error'));
    });
  };

  const AddNewCustomerLineItem = () => {
    setPurchaseRequestEditDetails([
      ...purchaserequesteditdetails,
      {
        id: random.int(0, 9999).toString(),
        contact_id: '',
        name: '',
        wholesale_price: 0,
        carton_price: 0,
        fixed_price: 0
      }
    ]);
  };

  useEffect(() => {
    getCustomer();
    getSupplier();
    ProductLineItemById();
    PurchaseRequestLineItemById();
  }, [ProductId]);

  useEffect(() => {
    if (addPurchaseOrderModal) {
      setMoreItem([
        {
          id: random.int(1, 99).toString(),
          itemId: '',
          unit: '',
          qty: '',
          price: '',
          mrp: '',
          gst: '',
          description: ''
        }
      ]);
    }
  }, [addPurchaseOrderModal]);

  return (
    <Modal size="xl" isOpen={addPurchaseOrderModal}>
      <ComponentCard>
        <Nav tabs>
          <NavItem>
            <NavLink className={activeTab === '1' ? 'active' : ''} onClick={() => toggle('1')}>
              Customer
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={activeTab === '2' ? 'active' : ''} onClick={() => toggle('2')}>
              Supplier
            </NavLink>
          </NavItem>
        </Nav>

        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            <BreadCrumbs heading={productDetails?.title} />
            <Button color="primary" onClick={AddNewLineItem}>
              Add Item
            </Button>
            <table className="lineitem">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Wholesale Price</th>
                  <th>Carton Price</th>
                  <th>Fixed Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {addMoreItem.map((el, index) => {
                  const selectedCompany = getProductValue.find((x) => x.contact_id === el.itemId) || null;
                  const showCode = el.code && el.code !== '';
                  console.log('RENDER ROW', { el, selectedCompany });
                  return (
                    <tr key={el.id}>
                      <td>
                        {showCode ? (
                          <Input value={el.code} readOnly />
                        ) : (
                          <Select
                            options={getProductValue}
                            value={selectedCompany}
                            onChange={(e) => onchangeItem(e, el.id)}
                            getOptionLabel={(option) => option.company_name}
                            getOptionValue={(option) => option.value}
                            placeholder="Select Company"
                          />
                        )}
                      </td>
                      <td>
                        <Input value={showCode ? (selectedCompany ? selectedCompany.company_name : el.title) : ''} readOnly />
                      </td>
                      <td><Input value={el.price} onChange={(e) => updateState(index, 'price', e)} /></td>
                      <td><Input value={el.mrp} onChange={(e) => updateState(index, 'mrp', e)} /></td>
                      <td><Input value={el.gst} onChange={(e) => updateState(index, 'gst', e)} /></td>
                      <td><Button color="link" onClick={() => ClearValue(el)}>Clear</Button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <ModalFooter>
              <Button color="primary" onClick={EditCSProductLineItems}>
                Submit
              </Button>
              <Button color="secondary" onClick={() => setAddPurchaseOrderModal(false)}>
                Cancel
              </Button>
            </ModalFooter>
          </TabPane>

          <TabPane tabId="2">
            <Button color="primary" onClick={AddNewCustomerLineItem}>
              Add Item
            </Button>
            <table className="lineitem">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Wholesale Price</th>
                  <th>Carton Price</th>
                  <th>Fixed Price</th>
                </tr>
              </thead>
              <tbody>
                {purchaserequesteditdetails.map((item, index) => (
                  <tr key={item.id}>
                    <td>
                      <Select
                        options={getsupplier}
                        onChange={(e) =>
                          updateSupplierState(index, 'contact_id', { target: { value: e.value } })
                        }
                      />
                    </td>
                    <td>
                      <Input value={item.name} onChange={(e) => updateSupplierState(index, 'name', e)} />
                    </td>
                    <td>
                      <Input
                        value={item.wholesale_price}
                        onChange={(e) => updateSupplierState(index, 'wholesale_price', e)}
                      />
                    </td>
                    <td>
                      <Input
                        value={item.carton_price}
                        onChange={(e) => updateSupplierState(index, 'carton_price', e)}
                      />
                    </td>
                    <td>
                      <Input
                        value={item.fixed_price}
                        onChange={(e) => updateSupplierState(index, 'fixed_price', e)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ModalFooter>
              <Button color="primary" onClick={editPurchaseRequestItems}>
                Submit
              </Button>
              <Button color="secondary" onClick={() => setAddPurchaseOrderModal(false)}>
                Cancel
              </Button>
            </ModalFooter>
          </TabPane>
        </TabContent>
      </ComponentCard>
    </Modal>
  );
}
