/*eslint-disable*/
import React, { useContext, useEffect, useState, useRef } from 'react';
import { Row, Col, Button, Table, Input, Alert } from 'reactstrap';
import PropTypes from 'prop-types';
import * as Icon from 'react-feather';
import { useNavigate } from 'react-router-dom';

import Select from 'react-select';
import api from '../../constants/api';
import ComponentCard from '../ComponentCard';
import EditLineItemModal from './EditLineItemModal';
import QuoteLineItem from './QuoteLineItem';
import AppContext from '../../context/AppContext';



const SalesOrderProducts = ({
  lineItem: initialLineItem,
  getLineItem,
  deleteRecord,
  id,
}) => {
  const { loggedInuser } = useContext(AppContext);
  const [lineItems, setLineItems] = useState(Array.isArray(initialLineItem) ? initialLineItem.map(item => ({...item, product_id: item.product_id || '', pcs_per_carton: item.pcs_per_carton || ''})) : []);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editLineModal, setEditLineModal] = useState(false);
  const [addLineItemModal, setAddLineItemModal] = useState(false);
  const [ setViewLineModal] = useState(false);
  const [productValue, setProductValue] = useState([]);
  const navigate = useNavigate();


    // Track which row is active (clicked for editing)
    const [activeRow, setActiveRow] = useState(null);
  const tableRef = useRef(null);
  // Arrays of refs for each input type, indexed by row
  const cartonQtyRefs = useRef([]);
  const looseQtyRefs = useRef([]);
  const quantityRefs = useRef([]);
  const cartonPriceRefs = useRef([]);
  const wholesalePriceRefs = useRef([]);
  const totalRefs = useRef([]);
  const discountRefs = useRef([]);
  const grossTotalRefs = useRef([]);

  const getProduct = () => {
    api.get('/product/getProducts').then((res) => {
      const items = res.data.data;
      const finaldat = items.map((item) => ({
        value: item.product_id,
        label: item.product_name,
        product_code: item.product_code,
        carton_price: item.carton_price,
        wholesale_price: item.wholesale_price,
        pcs_per_carton: item.pcs_per_carton,
        unit: item.unit,
        purchase_unit_cost: item.purchase_unit_cost,
        whole_price: item.wholesale_price,
        Cprice: item.carton_price,
        Cqty: item.carton_quantity,
        quantity: item.quantity,
      }));
      setProductValue(finaldat);
    });
  };

  useEffect(() => {
    setLineItems(Array.isArray(initialLineItem) ? initialLineItem.map(item => ({...item, product_id: item.product_id || '', pcs_per_carton: item.pcs_per_carton || ''})) : []);
    getProduct();
  }, [initialLineItem]);

  // Add new empty row
  const handleAddRow = () => {
    setLineItems([
      ...lineItems,
      {
        id: new Date().getTime().toString(),
        product_id: '',
        product_name: '',
        product_code: '',
        carton_qty: '',
        loose_qty: '',
        quantity: '',
        carton_price: '',
        wholesale_price: '',
        pcs_per_carton: '',
        total: '',
        discount_value: '',
        gross_total: '',
      },
    ]);
    setActiveRow(lineItems.length); // Make new row active
  };
  // Deactivate row when clicking outside the table
  useEffect(() => {
    function handleClickOutside(event) {
      if (tableRef.current && !tableRef.current.contains(event.target)) {
        setActiveRow(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle field change
  const handleFieldChange = (idx, field, value) => {
    setLineItems(prev => prev.map((item, i) => {
      if (i !== idx) return item;
      let updated = { ...item, [field]: value };
      if (field === 'carton_qty' || field === 'loose_qty' || field === 'carton_price' || field === 'wholesale_price' || field === 'discount_value' || field === 'pcs_per_carton') {
        const cartonQty = parseFloat(updated.carton_qty) || 0;
        const looseQty = parseFloat(updated.loose_qty) || 0;
        const pcsPerCarton = parseFloat(updated.pcs_per_carton) || 0;
        const cartonPrice = parseFloat(updated.carton_price) || 0;
        const wholesalePrice = parseFloat(updated.wholesale_price) || 0;
        const discount = parseFloat(updated.discount_value) || 0;
        const quantity = cartonQty * pcsPerCarton + looseQty;
        const cartonTotal = cartonQty * cartonPrice;
        const looseTotal = looseQty * wholesalePrice;
        const total = cartonTotal + looseTotal;
        const grossTotal = total - discount;
        updated = {
          ...updated,
          quantity,
          total: total.toFixed(2),
          gross_total: grossTotal.toFixed(2),
        };
      }
      return updated;
    }));
  };

  // Delete row
  const handleDeleteRow = (idx, item) => {
    if (item.sales_order_item_id) {
      deleteRecord(item.sales_order_item_id);
    }
    setLineItems(prev => prev.filter((_, i) => i !== idx));
  };

  // Save all items (example API call, adjust as needed)
  const handleSave = async () => {
    const validItems = lineItems.filter(item => item.product_name && item.product_code);
    await Promise.all(validItems.map(item => {
      const obj = {
        ...item,
        creation_date: new Date().toISOString(),
        created_by: loggedInuser?.first_name || '',
        sales_order_id: id,
      };
      if (item.sales_order_item_id) {
        // If sales_order_item_id exists, it's an existing record, so update it
        return api.post('/salesOrder/edit-TabQuoteLine', obj);
      }
      // Otherwise, it's a new record, so insert it
      return api.post('/salesOrder/insertQuoteItems', obj);
    }));
    if (getLineItem) getLineItem(id);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000); // Hide after 3 seconds
  };

  const summary = {
    carton_qty: 0,
    loose_qty: 0,
    quantity: 0,
    carton_price: 0,
    wholesale_price: 0,
    total: 0,
    discount_value: 0,
    gross_total: 0,
  };
  
  if (Array.isArray(lineItems)) {
    lineItems.forEach((item) => {
      summary.carton_qty += parseFloat(item.carton_qty || 0);
      summary.loose_qty += parseFloat(item.loose_qty || 0);
      summary.quantity += parseFloat(item.quantity || 0);
      summary.carton_price += parseFloat(item.carton_price || 0);
      summary.wholesale_price += parseFloat(item.wholesale_price || 0);
      summary.total += parseFloat(item.total || 0);
      summary.discount_value += parseFloat(item.discount_value || 0);
      summary.gross_total += parseFloat(item.gross_total || 0);
    });
  }
  const [backOrderQtyMap, setBackOrderQtyMap] = React.useState({});
  
  const fetchBackOrderQty = async (productId) => {
    try {
      const response = await api.post('/salesOrder/getBackOrderQtyByProductId', {
        product_id: productId,
      });

      return response.data.data.back_order_qty || 0;
    } catch (error) {
      console.error('Error fetching back order quantity:', error);
      return 0;
    }
  };

  React.useEffect(() => {
    const getAllBackOrderQty = async () => {
      const productIds = [...new Set(lineItems.map(item => item.product_id))];
      const results = await Promise.all(
        productIds.map(async ids => {
          const qty = await fetchBackOrderQty(ids);
          return { ids, qty };
        })
      );
      const qtyMap = results.reduce((acc, { ids, qty }) => {
        acc[ids] = qty;
        return acc;
      }, {});
      setBackOrderQtyMap(qtyMap);
    };
  
    if (Array.isArray(lineItems) && lineItems.length > 0) {
      getAllBackOrderQty();
    }
  }, [lineItems]);
  
  const [billDiscount, setBillDiscount] = React.useState(0);
 // const [isInitialLoad, setIsInitialLoad] = React.useState(true);
  
 // 1. Only fetch the value on load
 const [taxType] = React.useState('');
 const [taxRate] = React.useState(0.09); // Set default tax rate to 9%
 
 React.useEffect(() => {
  const fetchBillDiscount = async () => {
    try {
      const response = await api.post('/salesOrder/getSalesorderById', {
        sales_order_id: id,
      });

      const data = response.data.data[0];
      const discount = parseFloat(data?.bill_discount) || 0;
      setBillDiscount(discount);

      // No longer fetching tax type or rate from backend
      // const type = data?.tax_type || '';
      // setTaxType(type);

      // const taxResponse = await api.post('/valuelist/getValueListByKeyText', {
      //   value: type, // use this instead of taxType
      // });

      // const taxCode = parseFloat(taxResponse.data.data[0]?.code) || 0;
      // setTaxRate(taxCode / 100);
    } catch (error) {
      console.error('Failed to fetch bill discount:', error);
    }
  };

  if (id) {
    fetchBillDiscount();
  }
}, [id]);

 

console.log("Bill discount loaded:", billDiscount,taxRate, taxType);
// 2. Save function - not triggered automatically
const saveBillDiscount = async (value) => {
  try {
    await api.post('/salesOrder/updateBillDiscount', {
      sales_order_id: id,
      bill_discount: value,
    });
  } catch (error) {
    console.error('Failed to update bill discount:', error);
  }
};

  
const saveSalesOrderSummary = async (subTotal, Tax, netTotal) => {
  try {
    await api.post('/salesOrder/updateSalesOrderSummary', {
      sales_order_id: id,
      sub_total: subTotal,
      tax: Tax,
      net_total: netTotal,
    });
  } catch (error) {
    console.error('Failed to update sales order summary:', error);
  }
};

React.useEffect(() => {
  if (id && summary.gross_total != null && taxRate != null) {
    const subTotal = summary.gross_total - billDiscount;
    const tax = subTotal * taxRate;
    const netTotal = subTotal + tax;

    // Save to backend
    saveSalesOrderSummary(subTotal.toFixed(2), tax.toFixed(2), netTotal.toFixed(2));
  }
}, [summary.gross_total, billDiscount, taxRate, id]);


  return (
    <ComponentCard title="Products">
      <Row>
        <Col md="6">
          <Button color="primary" onClick={handleAddRow}>
            Add Sale Items
          </Button>
        </Col>
        <Col md="6" className="text-end">
          <Button color="success" onClick={handleSave}>
            Save
          </Button>
        </Col>
      </Row>
      {showSuccess && <Alert color="success">Items saved successfully!</Alert>}
      <br />
  <Table id="example" className="display border border-secondary rounded" style={{ borderSpacing: '0 5px', borderCollapse: 'separate' }} ref={tableRef}>
        <thead>
          <tr>
            <td style={{ width: '30px' }}>#</td>
            <td style={{ width: '350px' }}>Product Name</td>
            <td style={{ width: '120px' }}>Product Code</td>
            <td style={{ width: '80px' }}>Carton Qty</td>
            <td style={{ width: '80px' }}>Loose Qty</td>
            <td style={{ width: '90px' }}>Qty</td>
            <td style={{ width: '120px' }}>Carton Price</td>
            <td style={{ width: '120px' }}>Price</td>
            <td style={{ width: '120px' }}>Total</td>
            <td style={{ width: '120px' }}>Discount</td>
            <td style={{ width: '130px' }}>Gross Total</td>
            <td style={{ width: '50px' }}>Action</td>
          </tr>
        </thead>
        <tbody>
          {lineItems.map((item, idx) => {
            const isActive = activeRow === idx;
            return (
              <tr
                key={item.id || idx}
                style={{fontSize: '12px', height: '46px', background: isActive ? '#eaf6ff' : '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderRadius: '8px' }}
              >
                <td style={{ width: '30px', padding: '16px' }}>{idx + 1}</td>
                <td
                  style={{
                    width: '250px',
                    padding: '16px',
                    background: isActive ? '#eaf6ff' : undefined,
                    transition: 'background 0.2s',
                  }}
                >
                  {isActive ? (
                    <Select
                      name="product_id"
                      options={productValue}
                      value={productValue.find(option => option.value === item.product_id) || null}
                      onChange={(selectedOption) => {
                        // Set all calculation-relevant fields on product select
                        handleFieldChange(idx, 'product_id', selectedOption ? selectedOption.value : '');
                        handleFieldChange(idx, 'product_name', selectedOption ? selectedOption.label : '');
                        handleFieldChange(idx, 'product_code', selectedOption ? selectedOption.product_code : '');
                        handleFieldChange(idx, 'carton_price', selectedOption ? selectedOption.carton_price : '');
                        handleFieldChange(idx, 'wholesale_price', selectedOption ? selectedOption.wholesale_price : '');
                        handleFieldChange(idx, 'pcs_per_carton', selectedOption ? selectedOption.pcs_per_carton : '');
                        handleFieldChange(idx, 'unit', selectedOption ? selectedOption.unit : '');
                        handleFieldChange(idx, 'purchase_unit_cost', selectedOption ? selectedOption.purchase_unit_cost : '');
                        handleFieldChange(idx, 'whole_price', selectedOption ? selectedOption.whole_price : '');
                        handleFieldChange(idx, 'Cprice', selectedOption ? selectedOption.Cprice : '');
                        handleFieldChange(idx, 'Cqty', selectedOption ? selectedOption.Cqty : '');
                        handleFieldChange(idx, 'quantity', ''); // Reset quantity so calculation is triggered
                        setSelectedProduct(selectedOption);
                        setTimeout(() => {
                          if (cartonQtyRefs.current[idx]) cartonQtyRefs.current[idx].focus();
                        }, 100);
                      }}
                      styles={{ control: (base) => ({ ...base, width: '110%',fontSize: '12px', }) }}
                    />
                  ) : (
                    <span
                      style={{ cursor: 'pointer', display: 'inline-block', width: '130px', padding: '10px' }}
                      onClick={() => {
                        setActiveRow(idx);
                        // Set selectedProduct to the full product object for this row
                        const prod = productValue.find(option => option.value === item.product_id);
                        if (prod) {
                          setSelectedProduct({
                            ...prod,
                            ...item // Merge item fields for accurate display
                          });
                        } else {
                          setSelectedProduct(item);
                        }
                      }}
                      onKeyDown={e => { if (e.key === 'Enter') setActiveRow(idx); }}
                      tabIndex={0}
                      role="button"
                    >
                      {item.product_name}
                    
                    </span>
                  )}
                </td>
                <td style={{ width: '100px', padding: '16px' }}>
                  {isActive ? (
                    <Input
                      value={item.product_code || ''}
                      type="text"
                      onChange={e => handleFieldChange(idx, 'product_code', e.target.value)}
                      style={{ minWidth: 120, fontSize: 16, padding: '8px 12px' }}
                    />
                  ) : (
                    <span>{item.product_code}</span>
                  )}
                </td>
                <td style={{ width: '90px', padding: '16px' }}>
                  {isActive ? (
                    <Input
                      value={item.carton_qty || ''}
                      type="number"
                      onChange={e => handleFieldChange(idx, 'carton_qty', e.target.value)}
                      style={{ minWidth: 80, fontSize: 16, padding: '8px 12px' }}
                      innerRef={el => { cartonQtyRefs.current[idx] = el; }}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && looseQtyRefs.current[idx]) looseQtyRefs.current[idx].focus();
                      }}
                    />
                  ) : (
                    <span>{item.carton_qty}</span>
                  )}
                </td>
                <td style={{ width: '80px', padding: '16px' }}>
                  {isActive ? (
                    <Input
                      value={item.loose_qty || ''}
                      type="number"
                      onChange={e => handleFieldChange(idx, 'loose_qty', e.target.value)}
                      style={{ minWidth: 80, fontSize: 16, padding: '8px 12px' }}
                      innerRef={el => { looseQtyRefs.current[idx] = el; }}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && cartonPriceRefs.current[idx]) cartonPriceRefs.current[idx].focus();
                      }}
                    />
                  ) : (
                    <span>{item.loose_qty}</span>
                  )}
                </td>
                <td style={{ width: '80px', padding: '16px' }}>
                  {isActive ? (
                    <Input
                      value={item.quantity || ''}
                      type="number"
                      readOnly
                      style={{ minWidth: 80, fontSize: 16, padding: '8px 12px', background: '#f5f5f5' }}
                      innerRef={el => { quantityRefs.current[idx] = el; }}
                    />
                  ) : (
                    <span>{item.quantity}</span>
                  )}
                </td>
                <td style={{ width: '100px', padding: '16px' }}>
                  {isActive ? (
                    <Input
                      value={item.carton_price || ''}
                      type="number"
                      onChange={e => handleFieldChange(idx, 'carton_price', e.target.value)}
                      style={{ minWidth: 100, fontSize: 16, padding: '8px 12px' }}
                      innerRef={el => { cartonPriceRefs.current[idx] = el; }}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && wholesalePriceRefs.current[idx]) wholesalePriceRefs.current[idx].focus();
                      }}
                    />
                  ) : (
                    <span>{item.carton_price}</span>
                  )}
                </td>
                <td style={{ width: '80px', padding: '16px' }}>
                  {isActive ? (
                    <Input
                      value={item.wholesale_price || ''}
                      type="number"
                      onChange={e => handleFieldChange(idx, 'wholesale_price', e.target.value)}
                      style={{ minWidth: 100, fontSize: 16, padding: '8px 12px' }}
                      innerRef={el => { wholesalePriceRefs.current[idx] = el; }}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && totalRefs.current[idx]) totalRefs.current[idx].focus();
                      }}
                    />
                  ) : (
                    <span>{item.wholesale_price}</span>
                  )}
                </td>
                <td style={{ width: '80px', padding: '16px' }}>
                  {isActive ? (
                    <Input
                      value={item.total || ''}
                      type="number"
                      readOnly
                      style={{ minWidth: 100, fontSize: 16, padding: '8px 12px', background: '#f5f5f5' }}
                      innerRef={el => { totalRefs.current[idx] = el; }}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && discountRefs.current[idx]) discountRefs.current[idx].focus();
                      }}
                    />
                  ) : (
                    <span>{item.total}</span>
                  )}
                </td>
                <td style={{ width: '80px', padding: '16px' }}>
                  {isActive ? (
                    <Input
                      value={item.discount_value || ''}
                      type="number"
                      onChange={e => handleFieldChange(idx, 'discount_value', e.target.value)}
                      style={{ minWidth: 100, fontSize: 16, padding: '8px 12px' }}
                      innerRef={el => { discountRefs.current[idx] = el; }}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && grossTotalRefs.current[idx]) grossTotalRefs.current[idx].focus();
                      }}
                    />
                  ) : (
                    <span>{item.discount_value}</span>
                  )}
                </td>
                <td style={{ width: '100px', padding: '16px' }}>
                  {isActive ? (
                    <Input
                      value={item.gross_total || ''}
                      type="number"
                      readOnly
                      style={{ minWidth: 100, fontSize: 16, padding: '8px 12px', background: '#f5f5f5' }}
                      innerRef={el => { grossTotalRefs.current[idx] = el; }}
                    />
                  ) : (
                    <span>{item.gross_total}</span>
                  )}
                </td>
                <td style={{ width: '50px', padding: '16px' }}>
                  <span className="addline" onClick={() => handleDeleteRow(idx, item)}>
                    <Icon.Trash2 />
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr style={{ fontWeight: 'bold', background: '#f1f1f1' }}>
            <td colSpan="3" className="text-end">Summary:</td>
            <td>{summary.carton_qty.toFixed(2)}</td>
            <td>{summary.loose_qty.toFixed(2)}</td>
            <td>{summary.quantity.toFixed(2)}</td>
            <td>{summary.carton_price.toFixed(2)}</td>
            <td>{summary.wholesale_price.toFixed(2)}</td>
            <td>{summary.total.toFixed(2)}</td>
            <td>{summary.discount_value.toFixed(2)}</td>
            <td>{summary.gross_total.toFixed(2)}</td>
            <td></td>
          </tr>
        </tfoot>
      </Table>
<div className="footer-info border-top" style={{ 
 
  bottom: 0,
  left: 0,
  right: 0,
  background: '#f9f9f9',
  padding: '8px',
  fontSize: '12px',
  zIndex: 1000
}}>
  <Row className="g-2">
    <Col md="12">
      {selectedProduct ? (
        <div className="d-flex flex-wrap gap-2 align-items-center">
          <span><strong>Uom:</strong> {selectedProduct.unit || '0.00'}</span>
          <span><strong>Pieces/Carton:</strong> {selectedProduct.pcs_per_carton || '0.00'}</span>
          <span><strong>Purchase UnitCost:</strong> {selectedProduct.purchase_unit_cost || '0.00'}</span>
          <span>
            <strong>Profit%:</strong>{' '}
            {selectedProduct?.purchase_unit_cost > 0
              ? (((parseFloat(selectedProduct.whole_price || 0) - parseFloat(selectedProduct.purchase_unit_cost || 0)) / parseFloat(selectedProduct.purchase_unit_cost || 1)) * 100).toFixed(2)
              : '0.00'}%
          </span>
          <span><strong>Wholesale Price:</strong> {selectedProduct.whole_price || '0.00'}</span>
          <span><strong>Carton Price:</strong> {selectedProduct.Cprice || '0.00'}</span>
          <span><strong>CQty:</strong> {selectedProduct.Cqty || '0.00'}</span>
          <span><strong>Qty On Hand:</strong> {selectedProduct.quantity || '0.00'}</span>
          <span><strong>Back Order Qty:</strong> {backOrderQtyMap[selectedProduct?.product_id] || '0.00'}</span>
          <span>
            <strong>Actual Qty:</strong>{' '}
            {((parseFloat(selectedProduct.quantity || 0) - parseFloat(backOrderQtyMap[selectedProduct.product_id] || 0))).toFixed(2)}
          </span>
        </div>
      ) : (
        <div className="d-flex flex-wrap gap-2 align-items-center">
          <span><strong>Uom:</strong> 0.00</span>
          <span><strong>Pieces/Carton:</strong> 0.00</span>
          <span><strong>Purchase UnitCost:</strong> 0.00</span>
          <span><strong>Profit%:</strong> 0.00</span>
          <span><strong>Wholesale Price:</strong> 0.00</span>
          <span><strong>Carton Price:</strong> 0.00</span>
          <span><strong>CQty:</strong> 0.00</span>
          <span><strong>Qty On Hand:</strong> 0.00</span>
          <span><strong>Back Order Qty:</strong> 0.00</span>
          <span><strong>Actual Qty:</strong> 0.00</span>
        </div>
      )}
      </Col>
      </Row>
      </div>
          {/* Fixed Footer Section */}
            <div style={{ 
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#2c3e50',
        borderTop: '1px solid #dee2e6',
        padding: '4px 8px',
        color: '#ffffff',
        zIndex: 1000
      }}>
        <Row className="align-items-center">
       


<Col md="2" className="text-end">
<p>
<strong>Bill Discount :</strong>
<input
type="number"
name="bill_discount"
value={billDiscount}
onChange={(e) => setBillDiscount(parseFloat(e.target.value) || 0)}
onBlur={(e) => saveBillDiscount(parseFloat(e.target.value) || 0)} // Save only on blur
style={{ width: '100px', marginLeft: '10px' }}
/>
</p>
</Col>
<Col md="2"><p><strong>Total Product:</strong> {Array.isArray(lineItems) ? lineItems.length : 0}</p>
</Col>
  <Col md="2"><p><strong>Sub Total:</strong> $ {(summary.gross_total - billDiscount).toFixed(2)}</p></Col>
  <Col md="2"><p><strong>Tax ({(taxRate * 100).toFixed(2)}%):</strong> $ {((summary.gross_total - billDiscount) * taxRate).toFixed(2)}</p></Col>
  <Col md="2"><p><strong>Net Total:</strong> $ {((summary.gross_total - billDiscount) * (1 + taxRate)).toFixed(2)}</p></Col>

          <Col md="2" className="text-right">
            <Button
              color="secondary"
              size="sm"
              onClick={() => {
                navigate('/salesOrder');
              }}
              style={{ marginRight: '3px', fontSize: '9px', padding: '2px 6px' }}
            >
              Cancel
            </Button>
            <Button
              color="info"
              size="sm"
              onClick={() => {
                editSettingData();
              }}
              style={{ marginRight: '3px', fontSize: '9px', padding: '2px 6px' }}
            >
              Print
            </Button>
            <Button
              color="primary"
              size="sm"
              onClick={() => {
                editSettingData();
                setTimeout(() => {
                  navigate('/salesOrder');
                  window.location.reload();
                }, 1100);
              }}
              style={{ fontSize: '9px', padding: '2px 6px' }}
            >
              Save
            </Button>
          </Col>
        </Row>
    
   
</div>
      <EditLineItemModal
        editLineModal={editLineModal}
        setEditLineModal={setEditLineModal}
       
        getLineItem={getLineItem}
        setViewLineModal={setViewLineModal}
      />

      {addLineItemModal && (
        <QuoteLineItem
          addLineItemModal={addLineItemModal}
          setAddLineItemModal={setAddLineItemModal}
          quoteLine={id}
        />
      )}
    </ComponentCard>
  );
};
SalesOrderProducts.propTypes = {
    lineItem: PropTypes.array.isRequired,
    editSettingData: PropTypes.bool.isRequired,
    getLineItem: PropTypes.func.isRequired,
    deleteRecord: PropTypes.func.isRequired,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  };
  
export default SalesOrderProducts;