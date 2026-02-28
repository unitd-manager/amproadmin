/*eslint-disable*/
import React, { useContext, useEffect, useState, useRef } from 'react';
import { Row, Col, Button, Table, Input, Alert } from 'reactstrap';
import PropTypes from 'prop-types';
import * as Icon from 'react-feather';
import { useNavigate } from 'react-router-dom';

import Select from 'react-select';
import api from '../../constants/api';

import AppContext from '../../context/AppContext';



const SalesOrderProducts = ({
  lineItem: initialLineItem,
  getLineItem,
  deleteRecord,
  saveSalesOrder,
  id,
  onSaveTrigger,
  setOnSaveTrigger,
  billDiscount,
  setBillDiscount,
}) => {
  const { loggedInuser } = useContext(AppContext);
  const [lineItems, setLineItems] = useState(() => {
    if (Array.isArray(initialLineItem) && initialLineItem.length > 0) {
      return initialLineItem.map(item => ({...item, product_id: item.product_id || '', pcs_per_carton: item.pcs_per_carton || ''}));
    } else {
      return [
        {
          id: new Date().getTime().toString(),
          product_id: '', product_name: '', product_code: '', carton_qty: '', loose_qty: '',
          quantity: '',foc:'', carton_price: '', wholesale_price: '', pcs_per_carton: '',
          total: '', discount_value: '', gross_total: '',
        },
        {
          id: new Date().getTime().toString() + '1',
          product_id: '', product_name: '', product_code: '', carton_qty: '', loose_qty: '',
          quantity: '',foc:'', carton_price: '', wholesale_price: '', pcs_per_carton: '',
          total: '', discount_value: '', gross_total: '',
        },
      ];
    }
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
   const [selectedLineItem, setSelectedLineItem] = useState(null);
  const [productValue, setProductValue] = useState([]);
  const navigate = useNavigate();

  const deleteSalesOrder = async () => {
    try {
      await api.post('/invoice/deleteCreditNote', { credit_note_id: String(id) });
      console.log('Sales Order deleted successfully');
    } catch (error) {
      console.error('Failed to delete sales order:', error);
    }
  };

    // Track which row is active (clicked for editing)
    const [activeRow, setActiveRow] = useState(initialLineItem && initialLineItem.length > 0 ? null : 0);
  const tableRef = useRef(null);
  // Arrays of refs for each input type, indexed by row

  const cartonPriceRefs = useRef([]);
  const wholesalePriceRefs = useRef([]);
  const totalRefs = useRef([]);
  const discountRefs = useRef([]);
  const grossTotalRefs = useRef([]);
  const productCodeRefs = useRef([]);
  const cartonQtyRefs = useRef([]);
  const looseQtyRefs = useRef([]);
  const quantityRefs = useRef([]);
  const FOCRefs = useRef([]);
  const totalInputRefs = useRef([]);
  const discountInputRefs = useRef([]);
  const grossTotalInputRefs = useRef([]);

  const getProduct = () => {
    api.get('/product/getProducts').then((res) => {
      const items = res.data.data;
      const finaldat = items.map((item) => ({
        value: item.product_id,
        label: item.product_name,
        product_name: item.product_name,
        product_code: item.product_code,
        carton_price: item.carton_price,
        wholesale_price: item.wholesale_price,
        pcs_per_carton: item.pcs_per_carton,
        unit: item.unit,
        purchase_unit_cost: item.purchase_unit_cost,
        whole_price: item.wholesale_price,
        carton_price: item.carton_price,
        Cqty: item.carton_quantity,
        quantity: item.quantity,
      }));
      setProductValue(finaldat);
    });
  };

  useEffect(() => {
    if (Array.isArray(initialLineItem) && initialLineItem.length > 0) {
      setLineItems(initialLineItem.map(item => ({...item, product_id: item.product_id || '', pcs_per_carton: item.pcs_per_carton || ''})));
    }
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
    if (item.credit_note_item_id) {
      deleteRecord(item.credit_note_item_id);
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
        credit_note_id: id,
      };
      if (item.credit_note_item_id) {
        // If credit_note_item_id exists, it's an existing record, so update it
        return api.post('/invoice/edit-TabCreditLine', obj);
      }
      // Otherwise, it's a new record, so insert it
      return api.post('/invoice/insertCreditItems', obj);
    }));
    if (getLineItem) getLineItem(id);
    // saveSalesOrder();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000); // Hide after 3 seconds
  };

    useEffect(() => {
      if (onSaveTrigger) {
        handleSave();
        setOnSaveTrigger(false);
      }
    }, [onSaveTrigger]);

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
      const response = await api.post('/invoice/getBackOrderQtyByProductId', {
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
  
  // billDiscount and setBillDiscount are now received from parent props
 // const [isInitialLoad, setIsInitialLoad] = React.useState(true);
  
 // 1. Only fetch the value on load
 const [taxRate] = React.useState(0.09); // Set default tax rate to 9%
 

  // Bill discount is now managed by parent, no need to fetch here

 

console.log("Bill discount loaded:", billDiscount,taxRate);
// 2. Save function - not triggered automatically

const saveBillDiscount = async (value) => {
  try {
    await api.post('/invoice/updateBillDiscountCN', {
      credit_note_id: id,
      bill_discount: value,
    });
  } catch (error) {
    console.error('Failed to update bill discount:', error);
  }
};

  
const saveSalesOrderSummary = async (subTotal, Tax, netTotal) => {
  try {
    await api.post('/invoice/updateSalesOrderSummaryCN', {
      credit_note_id: id,
      sub_total: subTotal,
      tax: Tax,
      net_total: netTotal,
      balance_amount: netTotal,
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
   <>
     <div style={{ maxHeight: '720px', overflowY: 'auto' }}>

  {showSuccess && <Alert color="success">Items saved successfully!</Alert>}
 
  {/* Scrollable Table Section */}
 
    <Table id="example" className="display border border-secondary rounded" ref={tableRef}>
      <thead>
        <tr>
          <td style={{ width: '30px' }}>#</td>
          <td style={{ width: '115px' }}>Product Code</td>
          <td style={{ width: '270px' }}>Product Name</td>
          <td style={{ width: '80px' }}>Carton Qty</td>
          <td style={{ width: '80px' }}>Loose Qty</td>
          <td style={{ width: '90px' }}>Qty</td>
           <td style={{ width: '65px' }}>FOC</td>
          <td style={{ width: '120px' }}>Carton Price</td>
          <td style={{ width: '120px' }}>Price</td>
          <td style={{ width: '120px' }}>Total</td>
          <td style={{ width: '110px' }}>Discount</td>
          <td style={{ width: '130px' }}>Gross Total</td>
          <td style={{ width: '50px' }}>Action</td>
        </tr>
      </thead>

      <tbody>
        {lineItems.map((item, idx) => {
          const isActive = activeRow === idx;
          return (
            <tr key={item.id || idx} style={{ fontSize: '13px', height: '20px', background: isActive ? '#eaf6ff' : '#fff' }}>
              {/* Render all cells (as per your existing code) */}
              <td
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setSelectedLineItem(item);
                    setSelectedProduct({
                      unit: item.unit || '0.00',
                      pcs_per_carton: item.pcs_per_carton || '0.00',
                      purchase_unit_cost: item.purchase_unit_cost || '0.00',
                      whole_price: item.whole_price || '0.00',
                      carton_price: item.carton_price || '0.00',
                      Cqty: item.Cqty || '0.00',
                      quantity: item.quantity || '0.00',
                      product_id: item.product_id || '',
                    });
                  }}
                >
                  {idx + 1}
                </td>
              <td>
                {isActive ? (
                  <Select
                    name="product_id"
                    options={productValue}
                    value={productValue.find((option) => option.value === item.product_id) || null}
                    onChange={(selectedOption) => {
                      handleFieldChange(idx, 'product_id', selectedOption ? selectedOption.value : '');
                      handleFieldChange(idx, 'product_name', selectedOption ? selectedOption.product_name : '');
                      handleFieldChange(idx, 'product_code', selectedOption ? selectedOption.product_code : '');
                      handleFieldChange(idx, 'unit', selectedOption ? selectedOption.unit : '');
                      handleFieldChange(idx, 'qty_in_stock', selectedOption ? selectedOption.qty_in_stock : '');
                      handleFieldChange(idx, 'price', selectedOption ? selectedOption.price : '');
                      handleFieldChange(idx, 'wholesale_price', selectedOption ? selectedOption.wholesale_price : '');
                      handleFieldChange(idx, 'pcs_per_carton', selectedOption ? selectedOption.pcs_per_carton : '');
                      handleFieldChange(idx, 'unit', selectedOption ? selectedOption.unit : '');
                      handleFieldChange(idx, 'purchase_unit_cost', selectedOption ? selectedOption.purchase_unit_cost : '');
                      handleFieldChange(idx, 'whole_price', selectedOption ? selectedOption.whole_price : '');
                      handleFieldChange(idx, 'carton_price', selectedOption ? selectedOption.carton_price : '');
                      handleFieldChange(idx, 'Cqty', selectedOption ? selectedOption.Cqty : '');
                      handleFieldChange(idx, 'quantity', ''); // Reset quantity so calculation is triggered
                      setSelectedProduct(selectedOption);
                    if (cartonQtyRefs.current[idx]) {
                      cartonQtyRefs.current[idx].focus();
                    }
                  }}
                      // 👇 tells React Select what to show
  getOptionLabel={(option) => option.product_name || ""}  
  getOptionValue={(option) => option.value}
  formatOptionLabel={(option, { context }) =>
    context === "value" 
      ? option.product_code   // selected value → product code
      : option.product_name   // dropdown menu → product name
  }

                   styles={{
    control: (base) => ({
      ...base,
      fontSize: "12px",
      minHeight: "30px"
     
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
      fontSize: "12px", 
      width: '300px'  // keep it above modal, table, etc.
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999   // just in case
    })
  }}
    menuPortalTarget={document.body}
  ref={(el) => (productCodeRefs.current[idx] = el)}
/>
                ) : (
                  <span
                    style={{ cursor: 'pointer', display: 'inline-block' }}
                    onClick={() => setActiveRow(idx)}
                    tabIndex={0}
                    role="button"
                  >
                    {item.product_code}
                  </span>
                )}
              </td>

              <td>
                {isActive ? (
                  <Input
                    type="text"
                    name="product_name"
                    value={item.product_name}
                    onChange={(e) => handleFieldChange(idx, 'product_name', e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (cartonQtyRefs.current[idx]) {
                          cartonQtyRefs.current[idx].focus();
                        }
                      }
                    }}
                    style={{ width: '100%', fontSize: '12px' }}
                  />
                ) : (
                  <span
                    style={{ cursor: 'pointer', display: 'inline-block' }}
                    onClick={() => setActiveRow(idx)}
                    tabIndex={0}
                    role="button"
                  >
                    {item.product_name}
                  </span>
                )}
              </td>

              <td>
                {isActive ? (
                  <Input
                    type="number"
                    name="carton_qty"
                    value={item.carton_qty}
                    onChange={(e) => handleFieldChange(idx, 'carton_qty', e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (looseQtyRefs.current[idx]) {
                          looseQtyRefs.current[idx].focus();
                        }
                      }
                    }}
                    innerRef={(el) => (cartonQtyRefs.current[idx] = el)}
                    style={{ width: '100%', fontSize: '12px' }}
                  />
                ) : (
                  <span
                    style={{ cursor: 'pointer', display: 'inline-block' }}
                    onClick={() => setActiveRow(idx)}
                    tabIndex={0}
                    role="button"
                  >
                    {item.carton_qty}
                  </span>
                )}
              </td>
              <td>
                {isActive ? (
                  <Input
                    type="number"
                    name="loose_qty"
                    value={item.loose_qty}
                    onChange={(e) => handleFieldChange(idx, 'loose_qty', e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (quantityRefs.current[idx]) {
                          quantityRefs.current[idx].focus();
                        }
                      }
                    }}
                    innerRef={(el) => (looseQtyRefs.current[idx] = el)}
                    style={{ width: '100%', fontSize: '12px' }}
                  />
                ) : (
                  <span
                    style={{ cursor: 'pointer', display: 'inline-block' }}
                    onClick={() => setActiveRow(idx)}
                    tabIndex={0}
                    role="button"
                  >
                    {item.loose_qty}
                  </span>
                )}
              </td>
              <td>
                {isActive ? (
                  <Input
                    type="number"
                    name="quantity"
                    value={item.quantity}
                    onChange={(e) => handleFieldChange(idx, 'quantity', e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (FOCRefs.current[idx]) {
                          FOCRefs.current[idx].focus();
                        }
                      }
                    }}
                    innerRef={(el) => (quantityRefs.current[idx] = el)}
                    style={{ width: '100%', fontSize: '12px' }}
                  />
                ) : (
                  <span
                    style={{ cursor: 'pointer', display: 'inline-block' }}
                    onClick={() => setActiveRow(idx)}
                    tabIndex={0}
                    role="button"
                  >
                    {item.quantity}
                  </span>
                )}
              </td>
              <td>
                {isActive ? (
                  <Input
                    type="text"
                    name="foc"
                    value={item.foc}
                    onChange={(e) => handleFieldChange(idx, 'foc', e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (cartonPriceRefs.current[idx]) {
                          cartonPriceRefs.current[idx].focus();
                        }
                      }
                    }}
                    innerRef={(el) => (FOCRefs.current[idx] = el)}
                    style={{ width: '100%', fontSize: '12px' }}
                  />
                ) : (
                  <span
                    style={{ cursor: 'pointer', display: 'inline-block' }}
                    onClick={() => setActiveRow(idx)}
                    tabIndex={0}
                    role="button"
                  >
                    {item.foc}
                  </span>
                )}
              </td>
              <td>
                {isActive ? (
                  <Input
                    type="number"
                    name="carton_price"
                    value={item.carton_price}
                    onChange={(e) => handleFieldChange(idx, 'carton_price', e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (wholesalePriceRefs.current[idx]) {
                          wholesalePriceRefs.current[idx].focus();
                        }
                      }
                    }}
                    innerRef={(el) => (cartonPriceRefs.current[idx] = el)}
                    style={{ width: '100%', fontSize: '12px' }}
                  />
                ) : (
                  <span
                    style={{ cursor: 'pointer', display: 'inline-block' }}
                    onClick={() => setActiveRow(idx)}
                    tabIndex={0}
                    role="button"
                  >
                    {item.carton_price}
                  </span>
                )}
              </td>
              <td>
                {isActive ? (
                  <Input
                    type="number"
                    name="wholesale_price"
                    value={item.wholesale_price}
                    onChange={(e) => handleFieldChange(idx, 'wholesale_price', e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (totalRefs.current[idx]) {
                          totalRefs.current[idx].focus();
                        }
                      }
                    }}
                    innerRef={(el) => (wholesalePriceRefs.current[idx] = el)}
                    style={{ width: '100%', fontSize: '12px' }}
                  />
                ) : (
                  <span
                    style={{ cursor: 'pointer', display: 'inline-block' }}
                    onClick={() => setActiveRow(idx)}
                    tabIndex={0}
                    role="button"
                  >
                    {item.wholesale_price}
                  </span>
                )}
              </td>
              <td>
                {isActive ? (
                  <Input
                    type="number"
                    name="total"
                    value={item.total}
                    onChange={(e) => handleFieldChange(idx, 'total', e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (discountRefs.current[idx]) {
                          discountRefs.current[idx].focus();
                        }
                      }
                    }}
                    innerRef={(el) => (totalRefs.current[idx] = el)}
                    style={{ width: '100%', fontSize: '12px' }}
                  />
                ) : (
                  <span
                    style={{ cursor: 'pointer', display: 'inline-block' }}
                    onClick={() => setActiveRow(idx)}
                    tabIndex={0}
                    role="button"
                  >
                    {item.total}
                  </span>
                )}
              </td>
              <td>
                {isActive ? (
                  <Input
                    type="number"
                    name="discount_value"
                    value={item.discount_value}
                    onChange={(e) => handleFieldChange(idx, 'discount_value', e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (grossTotalRefs.current[idx]) {
                          grossTotalRefs.current[idx].focus();
                        }
                      }
                    }}
                    innerRef={(el) => (discountRefs.current[idx] = el)}
                    style={{ width: '100%', fontSize: '12px' }}
                  />
                ) : (
                  <span
                    style={{ cursor: 'pointer', display: 'inline-block' }}
                    onClick={() => setActiveRow(idx)}
                    tabIndex={0}
                    role="button"
                  >
                    {item.discount_value}
                  </span>
                )}
              </td>
              <td>
                {isActive ? (
                  <Input
                    type="number"
                    name="gross_total"
                    value={item.gross_total}
                    onChange={(e) => handleFieldChange(idx, 'gross_total', e.target.value)}
                   onKeyDown={(e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    if (lineItems[idx + 1]) {
      // Focus next product_name field
      setActiveRow(idx + 1);
      setTimeout(() => {
        if (productCodeRefs.current[idx + 1]) {
          productCodeRefs.current[idx + 1].focus();
        }
      }, 100);
    } else {
      // Add new empty row and focus its product_name field
      handleAddRow();
      setTimeout(() => {
        if (productCodeRefs.current[lineItems.length]) {
          productCodeRefs.current[lineItems.length].focus();
        }
      }, 100);
    }
  }
}}

                    innerRef={(el) => (grossTotalRefs.current[idx] = el)}
                    style={{ width: '100%', fontSize: '12px' }}
                  />
                ) : (
                  <span
                    style={{ cursor: 'pointer', display: 'inline-block' }}
                    onClick={() => setActiveRow(idx)}
                    tabIndex={0}
                    role="button"
                  >
                    {item.gross_total}
                  </span>
                )}
              </td>
              <td>
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
           <td colSpan="2"> <Button color="primary" onClick={handleAddRow}>
          Add
        </Button></td>
          <td  className="text-end">Summary:</td>
          <td>{summary.carton_qty.toFixed(2)}</td>
          <td>{summary.loose_qty.toFixed(2)}</td>
          <td>{summary.quantity.toFixed(2)}</td>
          <td></td>
          <td>{summary.carton_price.toFixed(2)}</td>
          <td>{summary.wholesale_price.toFixed(2)}</td>
          <td>{summary.total.toFixed(2)}</td>
          <td>{summary.discount_value.toFixed(2)}</td>
          <td>{summary.gross_total.toFixed(2)}</td>
          <td></td>
        </tr>
      </tfoot>
    </Table>
      <Col md="6">
     
      </Col>


</div>
  {/* Fixed Footer Section */}
  <div style={{
    position: 'sticky',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#e9e9e9',
    borderTop: '1px solid #dee2e6',
    padding: '5px 8px',
    color: '#000',
    zIndex: 1000,
  }}>
    <Row className="g-1">
     <Col md="12">
            <div className="d-flex flex-wrap gap-1 align-items-center" style={{ fontSize: '0.9em' }}>
              <span style={{ marginRight: '8px' }}><strong>Uom:</strong> {selectedLineItem?.unit || '0.00'}</span>
              <span style={{ marginRight: '8px' }}><strong>Pieces/Carton:</strong> {selectedLineItem?.pcs_per_carton || '0.00'}</span>
              <span style={{ marginRight: '8px' }}><strong>Purchase UnitCost:</strong> {selectedLineItem?.purchase_unit_cost || '0.00'}</span>
              <span style={{ marginRight: '8px' }}><strong>Profit%:</strong> {selectedLineItem && selectedLineItem.purchase_unit_cost > 0
                  ? (((parseFloat(selectedLineItem.whole_price || 0) - parseFloat(selectedLineItem.purchase_unit_cost || 0)) / parseFloat(selectedLineItem.purchase_unit_cost || 1)) * 100).toFixed(2)
                  : '0.00'}%
              </span>
              <span style={{ marginRight: '8px' }}><strong>Wholesale Price:</strong> {selectedLineItem?.whole_price || '0.00'}</span>
              <span style={{ marginRight: '8px' }}><strong>Carton Price:</strong> {selectedLineItem?.carton_price || '0.00'}</span>
              <span style={{ marginRight: '8px' }}><strong>CQty:</strong> {selectedLineItem?.Cqty || '0.00'}</span>
              <span style={{ marginRight: '8px' }}><strong>Qty On Hand:</strong> {selectedLineItem?.quantity || '0.00'}</span>
              {/* <span style={{ marginRight: '8px' }}><strong>Back Order Qty:</strong> {backOrderQtyMap[selectedLineItem?.product_id] || '0.00'}</span>
              <span><strong>Actual Qty:</strong> {(parseFloat(selectedLineItem?.quantity || 0) - parseFloat(backOrderQtyMap[selectedLineItem?.product_id] || 0)).toFixed(2)}</span> */}
            </div>
          </Col>

      <Col md="6">
        <div className="d-flex align-items-center" style={{ marginBottom: '4px' }}>
          <strong style={{ marginRight: '8px', fontSize: '0.9em' }}>Bill Discount :</strong>
          <Input
            type="number"
            name="bill_discount"
            value={billDiscount}
            onChange={(e) => setBillDiscount(parseFloat(e.target.value) || 0)}
            onBlur={(e) => saveBillDiscount(parseFloat(e.target.value) || 0)}
            style={{ width: '100px', height: '28px' }}
          />
        </div>
        <p style={{ margin: '0', fontSize: '0.9em' }}><strong>Total Product:</strong> {lineItems.length}</p>
      </Col>

      <Col md="6" className="text-end">
        <p style={{ margin: '0 0 2px 0', fontSize: '0.9em' }}><strong>Sub Total:</strong> $ {(summary.gross_total - billDiscount).toFixed(2)}</p>
        <p style={{ margin: '0 0 2px 0', fontSize: '0.9em' }}><strong>Tax ({(taxRate * 100).toFixed(2)}%):</strong> $ {((summary.gross_total - billDiscount) * taxRate).toFixed(2)}</p>
        <p style={{ margin: '0', fontSize: '0.9em' }}><strong>Net Total:</strong> $ {((summary.gross_total - billDiscount) * (1 + taxRate)).toFixed(2)}</p>
      </Col>

      <Col md="12" className="text-end" style={{ marginTop: '4px' }}>
        <Button color="secondary" size="sm" onClick={async () => { await deleteSalesOrder(); navigate('/SalesCredit'); }} style={{ marginRight: '3px', float:'left', padding: '4px 8px' }}>Cancel</Button>
        {/* <Button color="info" size="sm" onClick={(Invoicea()} style={{ marginRight: '3px' }}>Apply</Button> */}
        <Button color="primary" size="sm" onClick={async () => { await saveBillDiscount(billDiscount); await saveSalesOrder(); handleSave();  setTimeout(() => { navigate('/SalesCredit'); window.location.reload(); }, 1100); }}  style={{ padding: '4px 8px' }}>Save</Button>
      </Col>
    </Row>
  </div>
</>

  );
};
SalesOrderProducts.propTypes = {
    lineItem: PropTypes.array.isRequired,
    saveSalesOrdera: PropTypes.bool.isRequired,
    getLineItem: PropTypes.func.isRequired,
    deleteRecord: PropTypes.func.isRequired,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  };
  
export default SalesOrderProducts;