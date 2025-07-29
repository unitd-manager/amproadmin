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
  const [getProductValue, setProductValue] = useState([]); // For customers
  const [getsupplier, setSupplier] = useState([]); // For suppliers
  const [addMoreItem, setMoreItem] = useState([]); // For customer pricing line items
  const [purchaserequesteditdetails, setPurchaseRequestEditDetails] = useState([]); // For supplier pricing line items
  const { loggedInuser } = useContext(AppContext);

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const AddNewLineItem = () => {
    setMoreItem([
      ...addMoreItem,
      {
        id: random.int(0, 9999).toString(), // Unique ID for React key
        itemId: '', // contact_id for customer
        unit: '',
        qty: '',
        price: '', // wholesale_price
        mrp: '', // carton_price
        gst: '', // fixed_price (renamed from gst for clarity in UI/backend mapping)
        description: '',
        code: '', // customer_code
        title: '', // company_name
        cs_product_id: null // Initialize cs_product_id for new items
      }
    ]);
    console.log('AddNewLineItem: Current addMoreItem after adding new row:', [...addMoreItem, { id: 'new' }]);
  };

  const AddNewSupplierLineItem = () => {
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
      console.log('getCustomer: Fetched customers:', formatted);
    }).catch((err) => {
      console.error('getCustomer: Failed to fetch customers', err);
      message('Failed to fetch customers', 'error');
    });
  };

  const getSupplier = () => {
    api.get('/product/getSupplier').then((res) => {
      const items = res.data.data;
      const formatted = items.map((item) => ({
        value: item.contact_id,
        label: item.company_name,
        company_name: item.company_name,
        supplier_code: item.supplier_code
      }));
      setSupplier(formatted);
      console.log('getSupplier: Fetched suppliers:', formatted);
    }).catch((err) => {
      console.error('getSupplier: Failed to fetch suppliers', err);
      message('Failed to fetch suppliers', 'error');
    });
  };

  const ProductLineItemById = () => {
    api
      .post('/product/getCSProductByProductId', { product_id: ProductId })
      .then((res) => {
        setMoreItem(res.data.data);
        console.log('ProductLineItemById: Fetched existing customer product prices:', res.data.data);
      })
      .catch((err) => {
        console.error('ProductLineItemById: Customer Product Data Not Found or Error', err);
        message('Customer Product Data Not Found', 'info');
      });
  };

  const PurchaseRequestLineItemById = () => {
    api
      .post('/product/getCSSupplierProductByProductId', { product_id: ProductId })
      .then((res) => {
        const dataWithIds = res.data.data.map(item => ({
          ...item,
          id: item.cs_product_id ? item.cs_product_id.toString() : random.int(0, 9999).toString()
        }));
        setPurchaseRequestEditDetails(dataWithIds);
        console.log('PurchaseRequestLineItemById: Fetched existing supplier product prices:', dataWithIds);
      })
      .catch((err) => {
        console.error('PurchaseRequestLineItemById: Supplier Product Data Not Found or Error', err);
        message('Supplier Product Data Not Found', 'info');
      });
  };

  const EditCSProductLineItems = async () => {
    const processItems = addMoreItem.filter(item => item.itemId && item.price);

    if (processItems.length === 0) {
      message('No valid items to submit. Please select a customer and enter a wholesale price.', 'warning');
      return;
    }

    const promises = processItems.map(async (item) => {
      console.log(`EditCSProductLineItems: Processing item (id: ${item.id}, itemId: ${item.itemId}, cs_product_id: ${item.cs_product_id})`);
      try {
        if (item.cs_product_id) {
          console.log(`EditCSProductLineItems: Updating existing record for cs_product_id: ${item.cs_product_id}`);
          await api.post('/product/updateCSProductCustomerPrice', {
            cs_product_id: item.cs_product_id,
            wholesale_price: item.price,
            carton_price: item.mrp,
            fixed_price: item.gst || 0,
            modified_by: loggedInuser.first_name,
            modification_date: creationdatetime,
          });
          message(`Customer product price for ${item.title} updated successfully`, 'success');
        } else {
          console.log(`EditCSProductLineItems: Creating new record for itemId: ${item.itemId}`);
          const checkCustomerPriceRes = await api.post('/product/checkCustomerSupplierPrice', {
            contact_id: item.itemId,
            customer: 1,
            supplier: 0,
          });

          const { exists, customer_supplier_price_id: customerSupplierPriceId } = checkCustomerPriceRes.data;
          let currentCustomerSupplierPriceId = customerSupplierPriceId;

          if (!exists) {
            console.log(`EditCSProductLineItems: Customer_supplier_price entry not found, creating new one for contact_id: ${item.itemId}`);
            const insertPriceRes = await api.post('/product/addCustomerSupplierPrice', {
              contact_id: item.itemId,
              customer: 1,
              supplier: 0,
              created_by: loggedInuser.first_name,
              creation_date: creationdatetime,
            });
            currentCustomerSupplierPriceId = insertPriceRes.data.customer_supplier_price_id;
            console.log(`EditCSProductLineItems: New customer_supplier_price_id created: ${currentCustomerSupplierPriceId}`);
          }

          console.log(`EditCSProductLineItems: Adding new cs_product history for customer_supplier_price_id: ${currentCustomerSupplierPriceId}`);
          await api.post('/product/addCSProductHistory', {
            customer_supplier_price_id: currentCustomerSupplierPriceId,
            product_id: ProductId,
            contact_id: item.itemId,
            wholesale_price: item.price,
            carton_price: item.mrp,
            fixed_price: item.gst || 0,
            created_by: loggedInuser.first_name,
            creation_date: creationdatetime,
          });
          message(`New price history added for customer ${item.title}`, 'success');
        }
      } catch (error) {
        console.error(`Error processing customer price item for ${item.title}:`, error);
        message(`Failed to process customer price for ${item.title}`, 'error');
      }
    });

    await Promise.all(promises);
    console.log('EditCSProductLineItems: All items processed.');
  };


  const updateState = (index, property, e) => {
    const copy = [...addMoreItem];
    copy[index] = { ...copy[index], [property]: e.target.value };
    setMoreItem(copy);
    console.log(`updateState: Item ${copy[index].id} updated. Property: ${property}, Value: ${e.target.value}`);
  };

  const onchangeItem = async (selectedOption, itemId) => {
    console.log('onchangeItem: Selected Option:', selectedOption, 'for Item ID:', itemId);

    const currentItemIndex = addMoreItem.findIndex(el => el.id === itemId);
    if (currentItemIndex === -1) return;

    let updatedItem = { ...addMoreItem[currentItemIndex] };

    if (!selectedOption) {
      updatedItem = {
        ...updatedItem,
        itemId: '',
        code: '',
        title: '',
        price: '',
        mrp: '',
        gst: '',
        cs_product_id: null
      };
      console.log('onchangeItem: Selection cleared. Updated item:', updatedItem);
    } else {
      updatedItem.itemId = selectedOption.contact_id;
      updatedItem.code = selectedOption.customer_code;
      updatedItem.title = selectedOption.company_name;
      updatedItem.price = '';
      updatedItem.mrp = '';
      updatedItem.gst = '';
      updatedItem.cs_product_id = null;

      console.log('onchangeItem: Basic info updated. Checking for existing price...');

      try {
        const response = await api.post('/product/checkCustomerProductPrice', {
          contact_id: selectedOption.contact_id,
          product_id: ProductId,
          customer: 1,
          supplier: 0,
        });
        console.log('onchangeItem: checkCustomerProductPrice API response:', response.data);

        if (response.data.cs_product_exists && response.data.cs_product_data) {
          const existingData = response.data.cs_product_data;
          message(`Price for ${selectedOption.company_name} and product ${productDetails?.title} already exists. It will be updated.`, 'warning');

          updatedItem.price = existingData.wholesale_price || '';
          updatedItem.mrp = existingData.carton_price || '';
          updatedItem.gst = existingData.fixed_price || '';
          updatedItem.cs_product_id = existingData.cs_product_id;
          console.log('onchangeItem: Existing price found. Pre-filling data. cs_product_id:', updatedItem.cs_product_id);
        } else {
          console.log('onchangeItem: No existing price found for this customer and product.');
        }
      } catch (error) {
        console.error('onchangeItem: Error checking existing customer product price:', error);
        message('Error checking existing price. Please try again.', 'error');
      }
    }

    const updatedAddMoreItem = addMoreItem.map((el, idx) =>
      idx === currentItemIndex ? updatedItem : el
    );
    setMoreItem(updatedAddMoreItem);
    console.log('onchangeItem: Final addMoreItem state update:', updatedAddMoreItem);
  };

  const ClearValue = (item) => {
    setMoreItem((current) => current.filter((obj) => obj.id !== item.id));
    console.log('ClearValue: Item removed:', item.id);
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
    console.log(`updateSupplierState: Item ${copy[index].id} updated. Property: ${property}, Value: ${e.target.value}`);
  };

  const editPurchaseRequestItems = () => {
    purchaserequesteditdetails.forEach((item) => {
      console.log(`editPurchaseRequestItems: Processing supplier item (id: ${item.id}, cs_product_id: ${item.cs_product_id})`);
      if (!item.cs_product_id) {
        message('Cannot update item without a valid product ID for supplier.', 'error');
        console.warn('editPurchaseRequestItems: Missing cs_product_id for supplier item:', item);
        return;
      }
      api
        .post('/product/EditCSProductLineItemsBYSupplierID', {
          cs_product_id: item.cs_product_id,
          wholesale_price: item.wholesale_price,
          carton_price: item.carton_price,
          fixed_price: item.fixed_price,
          modification_date: creationdatetime,
          modified_by: loggedInuser.first_name
        })
        .then(() => message('Supplier Line Item Edited Successfully', 'success'))
        .catch((err) => {
          console.error('editPurchaseRequestItems: Cannot Edit Supplier Line Items', err);
          message('Cannot Edit Supplier Line Items', 'error');
        });
    });
    console.log('editPurchaseRequestItems: All supplier items processed.');
  };

  useEffect(() => {
    console.log('useEffect (ProductId change): Fetching initial data...');
    getCustomer();
    getSupplier();
    ProductLineItemById();
    PurchaseRequestLineItemById();
  }, [ProductId]);

  useEffect(() => {
    if (addPurchaseOrderModal) {
      console.log('useEffect (addPurchaseOrderModal change): Modal opened, resetting customer line items and re-fetching data.');
      setMoreItem([
        {
          id: random.int(1, 99).toString(),
          itemId: '',
          unit: '',
          qty: '',
          price: '',
          mrp: '',
          gst: '',
          description: '',
          code: '',
          title: '',
          cs_product_id: null
        }
      ]);
      ProductLineItemById();
      PurchaseRequestLineItemById();
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
                  return (
                    <tr key={el.id}>
                      <td>
                        {showCode && el.itemId ? (
                          <Input value={el.code} readOnly />
                        ) : (
                          <Select
                            options={getProductValue}
                            value={selectedCompany}
                            onChange={(e) => onchangeItem(e, el.id)}
                            getOptionLabel={(option) => option.company_name}
                            getOptionValue={(option) => option.contact_id}
                            placeholder="Select Company"
                          />
                        )}
                      </td>
                      <td>
                        <Input value={showCode && el.itemId ? (selectedCompany ? selectedCompany.company_name : el.title) : (selectedCompany ? selectedCompany.company_name : '')} readOnly />
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
            <Button color="primary" onClick={AddNewSupplierLineItem}>
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
                {purchaserequesteditdetails.map((item, index) => {
                  const selectedSupplier = getsupplier.find((x) => x.value === item.contact_id) || null;
                  return (
                    <tr key={item.id}>
                      <td>
                        {item.code ? (
                          <Input value={item.code} readOnly />
                        ) : (
                          <Select
                            options={getsupplier}
                            value={selectedSupplier}
                            onChange={(e) =>
                              updateSupplierState(index, 'contact_id', { target: { value: e.value, name: e.label } })
                            }
                            getOptionLabel={(option) => option.label}
                            getOptionValue={(option) => option.value}
                            placeholder="Select Supplier"
                          />
                        )}
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
                  );
                })}
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
