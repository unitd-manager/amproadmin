import React from 'react';
import { Row, Col, Button, Table } from 'reactstrap';
import PropTypes from 'prop-types';
import * as Icon from 'react-feather';
import api from '../../constants/api';
import ComponentCard from '../ComponentCard';
import EditLineItemModal from './EditLineItemModal';
import QuoteLineItem from './QuoteLineItem';

const SalesOrderProducts = ({
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
  setViewLineModal
}) => {
  const columns1 = [
    { name: '#' },
    { name: 'Product Name' },
    { name: 'Product Code' },
    { name: 'Carton Qty' },
    { name: 'Loose Qty' },
    { name: 'Qty' },
    { name: 'Carton Price' },
    { name: 'Price' },
    { name: 'Total' },
    { name: 'Discount' },
    { name: 'Gross Total' },
    { name: 'Action' },
  ];

  const addQuoteItemsToggle = () => {
    setAddLineItemModal(!addLineItemModal);
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
  
  if (Array.isArray(lineItem)) {
    lineItem.forEach((item) => {
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
  const [selectedProduct, setSelectedProduct] = React.useState(null);

  const [billDiscount, setBillDiscount] = React.useState(0);
 // const [isInitialLoad, setIsInitialLoad] = React.useState(true);
  
 // 1. Only fetch the value on load
 const [taxType, setTaxType] = React.useState('');
 const [taxRate, setTaxRate] = React.useState(0);
 
 React.useEffect(() => {
  const fetchBillDiscountAndTax = async () => {
    try {
      const response = await api.post('/salesreturn/getCreditNoteById', {
        credit_note_id: id,
      });

      const data = response.data.data[0];
      const discount = parseFloat(data?.bill_discount) || 0;
      setBillDiscount(discount);

      const type = data?.tax_type || '';
      setTaxType(type);

      const taxResponse = await api.post('/valuelist/getValueListByKeyText', {
        value: type, // use this instead of taxType
      });

      const taxCode = parseFloat(taxResponse.data.data[0]?.code) || 0;
      setTaxRate(taxCode / 100);
    } catch (error) {
      console.error('Failed to fetch bill discount or tax info:', error);
    }
  };

  if (id) {
    fetchBillDiscountAndTax();
  }
}, [id]);

 

console.log("Bill discount loaded:", billDiscount,taxRate, taxType);
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
    <ComponentCard title="Products">
      <Row>
        <Col md="6">
          <Button color="primary" onClick={addQuoteItemsToggle}>
            Add Credit Note Items
          </Button>
        </Col>
      </Row>
      <br />
      <Table id="example" className="display border border-secondary rounded">
  <thead>
    <tr>
      {columns1.map((cell) => (
        <td key={cell.name}>{cell.name}</td>
      ))}
    </tr>
  </thead>
  <tbody>
    {lineItem &&
      lineItem.map((e, index) => (
        <tr key={e.project_quote_id}>
      <td>
  <span
    role="button"
    tabIndex={0}
    style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
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
          <td>{e.carton_price}</td>
          <td>{e.wholesale_price}</td>
          <td>{e.total}</td>
          <td>{e.discount_value}</td>
          <td>{e.gross_total}</td>
          <td>
            <span className="addline" onClick={() => {
              setEditLineModelItem(e);
              setEditLineModal(true);
            }}>
              <Icon.Edit2 />
            </span>
            <span className="addline" onClick={() => deleteRecord(e.credit_note_item_id)}>
              <Icon.Trash2 />
            </span>
          </td>
        </tr>
      ))}
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
<div className="mt-3 p-3 border border-secondary rounded" style={{ background: '#f9f9f9' }}>
<Row className="mb-2">
<Col md="12">
  {selectedProduct ? (
    <>
      <p>
        <strong>Uom: </strong> {selectedProduct.unit || '0.00'}&nbsp;&nbsp;
        <strong>Pieces/Carton:</strong> {selectedProduct.pcs_per_carton || '0.00'}&nbsp;&nbsp;
        <strong>Purchase UnitCost:</strong> {selectedProduct.purchase_unit_cost || '0.00'}&nbsp;&nbsp;
        <strong>Profit%:</strong>{' '}
{selectedProduct?.purchase_unit_cost > 0
  ? (
      ((parseFloat(selectedProduct.whole_price || 0) -
        parseFloat(selectedProduct.purchase_unit_cost || 0)) /
        parseFloat(selectedProduct.purchase_unit_cost || 1)) *
      100
    ).toFixed(2)
  : '0.00'}
%
        &nbsp;&nbsp;
        <strong>Wholesale Price:</strong> {selectedProduct.whole_price || '0.00'}&nbsp;&nbsp;
        <strong>Carton Price:</strong> {selectedProduct.Cprice || '0.00'}
      </p>
      <p>
  <strong>CQty:</strong> {selectedProduct.Cqty || '0.00'}&nbsp;&nbsp;
  <strong>Qty On Hand:</strong> {selectedProduct.quantity || '0.00'}&nbsp;&nbsp;
 
</p>

    </>
  ) : (
    <>
    <p><strong>Uom: </strong> 0.00&nbsp;&nbsp; <strong>Pieces/Carton:</strong> 0.00&nbsp;&nbsp; <strong>Purchase UnitCost:</strong> 0.00 &nbsp;&nbsp; <strong>Profit%:</strong> 0.00 &nbsp;&nbsp; <strong>Wholesale Price:</strong> 0.00 &nbsp;&nbsp; <strong>Carton Price:</strong> 0.00</p>
      <p><strong>CQty:</strong> 0.00 &nbsp;&nbsp; <strong>Qty On Hand:</strong> 0.00 &nbsp;&nbsp; </p>
    </>
  )}
</Col>

    </Row>
  <Row className="mb-2">
  <Col md="6">
    </Col>
    <Col md="6" className="text-end">
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


      <p><strong>Total Product:</strong> {Array.isArray(lineItem) ? lineItem.length : 0}</p>
      <p><strong>Sub Total:</strong> $ {(summary.gross_total - billDiscount).toFixed(2)}</p>
<p><strong>Tax ({(taxRate * 100).toFixed(2)}%):</strong> $ {((summary.gross_total - billDiscount) * taxRate).toFixed(2)}</p>
<p><strong>Net Total:</strong> $ {((summary.gross_total - billDiscount) * (1 + taxRate)).toFixed(2)}</p>


    </Col>
  </Row>
</div>

      <EditLineItemModal
        editLineModal={editLineModal}
        setEditLineModal={setEditLineModal}
        FetchLineItemData={editLineModelItem}
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
  
export default SalesOrderProducts;
