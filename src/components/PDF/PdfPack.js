import React, { useState, useEffect } from 'react';
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
// import { Button } from 'reactstrap';
import PropTypes from 'prop-types';
import moment from 'moment';
import api from '../../constants/api';
import message from '../Message';
import PdfFooter from './PdfFooter'; // Assuming you have a footer component
import PdfHeader from './PdfHeader1'; // Assuming you have a header component
 
const PdfPackingList = ({ selectedOrderIds }) => {
  PdfPackingList.propTypes = {
    selectedOrderIds: PropTypes.array,
  };

  const [allSalesOrders, setAllSalesOrders] = useState([]);
  const [allLineItems, setAllLineItems] = useState([]);
  const [hfdata, setHeaderFooterData] = useState();

  useEffect(() => {
    api.get('/setting/getSettingsForCompany').then((res) => {
      setHeaderFooterData(res.data.data);
    });
  }, []);

  const findCompany = (key) => {
    const filteredResult = hfdata?.find((e) => e.key_text === key);
    return filteredResult?.value || '';
  };

  // Helper function to format numbers - returns empty string for 0 and NaN
  const formatNumber = (value) => {
    const num = parseFloat(value || 0);
    return (num === 0 || Number.isNaN(num)) ? '' : num.toFixed(2);
  };

  const fetchAllSalesOrderData = async () => {
    const salesOrdersPromises = selectedOrderIds.map(async (orderId) => {
      try {
        const salesOrderRes = await api.post('/salesorder/getSalesOrderById', { sales_order_id: orderId });
        const lineItemsRes = await api.post('/salesorder/getQuoteLineItemsById', { sales_order_id: orderId });
        return {
          salesOrder: salesOrderRes.data.data[0] || {},
          lineItems: { orderId, items: lineItemsRes.data.data || [] },
        };
      } catch (error) {
        message(`Data Not Found for Sales Order ID: ${orderId}`, 'info');
        return null; // Return null for failed fetches
      }
    });

    const results = await Promise.all(salesOrdersPromises);
    const validResults = results.filter(result => result !== null);

    setAllSalesOrders(validResults.map(result => result.salesOrder));
    setAllLineItems(validResults.map(result => result.lineItems));
  };

  useEffect(() => {
    if (selectedOrderIds && selectedOrderIds.length > 0) {
      fetchAllSalesOrderData();
    }
  }, [selectedOrderIds]);

  const GetPdf = () => {
    const allContent = [];
    let grandTotalQuantity = 0;

    allSalesOrders.forEach((salesOrder, salesOrderIndex) => {
      const lineItemsForOrder = allLineItems.find(item => item.orderId === salesOrder.sales_order_id)?.items || [];

      const productItems = [
        [
          { text: 'S.No', style: 'tableHead' },
          { text: 'Product Name', style: 'tableHead' },
          { text: 'Uom', style: 'tableHead' },
          { text: 'LQty', style: 'tableHead' },
          { text: 'FocQty', style: 'tableHead' },
          { text: 'CQty', style: 'tableHead' },
        ],
      ];

      let totalLooseQty = 0;
      let totalFocQty = 0;
      let totalCQty = 0;
      let totalQuantity = 0; // To store the sum of all quantities for current order
      console.log(totalQuantity, 'totalQuantity')


      // Sort line items by CQty (carton_qty) from smallest to largest
      const sortedLineItems = [...lineItemsForOrder].sort((a, b) => {
        const aCQty = parseFloat(a.carton_qty || 0);
        const bCQty = parseFloat(b.carton_qty || 0);
        return aCQty - bCQty;
      });

      sortedLineItems.forEach((item, index) => {
        const lQty = parseFloat(item.loose_qty || 0);
        const fQty = parseFloat(item.foc || 0);
        const cQty = parseFloat(item.carton_qty || 0);
        const quantity = parseFloat(item.quantity || 0); // Assuming 'quantity' represents the base quantity

        productItems.push([
          { text: `${index + 1}`, style: 'tableBody' },
          { text: `${item.product_name || ''}`, style: 'tableBody' },
          { text: `${item.unit || ''}`, style: 'tableBody' },
          { text: formatNumber(lQty), style: 'tableBody' },
          { text: formatNumber(fQty), style: 'tableBody' },
          { text: formatNumber(cQty), style: 'tableBody' },
        ]);
        totalLooseQty += lQty;
        totalFocQty += fQty;
        totalCQty += cQty;
        totalQuantity += quantity; // Accumulate the base quantity
      });

      productItems.push([
        { text: '', style: 'tableBody' },
        { text: 'Total', style: 'boldText', alignment: 'right' },
        { text: '', style: 'tableBody' },
        { text: formatNumber(totalLooseQty), style: 'boldText' },
        { text: formatNumber(totalFocQty), style: 'boldText' },
        { text: formatNumber(totalCQty), style: 'boldText' },
      ]);

      allContent.push(
        {
          text: findCompany('company_name') || '',
          style: 'header',
          alignment: 'center',
          margin: [0, salesOrderIndex === 0 ? 0 : 20, 0, 0], // Add margin between orders
        },
        {
          columns: [
            {
              text: `Date: ${moment().format('DD-MM-YYYY')}`,
              style: 'textSize',
            },
            {
              text: `Sales Order Code: ${salesOrder.tran_no || ''}`,
              style: 'textSize',
              alignment: 'right',
            },
          ],
          margin: [0, 0, 0, 5],
        },
        {
          columns: [
            {
              text: `Customer Code: ${salesOrder.customer_code || ''}`,
              style: 'textSize',
            },
            {
              text: `Customer Name: ${salesOrder.company_name || ''}`,
              style: 'textSize',
              alignment: 'right',
            },
          ],
          margin: [0, 0, 0, 15],
        },
        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto'],
            body: productItems,
          },
        },
        {
          columns: [
            {
              text: `Total for Invoice No: ${salesOrder.invoice_code || salesOrder.tran_no || ''}`,
              style: 'boldText',
              alignment: 'right',
              margin: [0, 10, 10, 0],
            },
            {
              text: `Total Carton Qty: ${formatNumber(totalCQty)}`,
              style: 'boldText',
              alignment: 'right',
              margin: [10, 10, 0, 0],
            },
          ],
        },
      );
      grandTotalQuantity += totalCQty;
    });

    allContent.push(
      { text: '', margin: [0, 20] }, // Spacer
      {
        text: `Grand Total: ${formatNumber(grandTotalQuantity)}`,
        style: 'boldText',
        alignment: 'right',
      },
    );

    const dd = {
      pageSize: 'A4',
      pageMargins: [40, 70, 40, 80],
      header: PdfHeader({ findCompany }),
      footer: PdfFooter,
      content: allContent,
      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
        tableHead: {
          bold: true,
          fontSize: 10,
          color: 'black',
        },
        tableBody: {
          fontSize: 9,
        },
        textSize: {
          fontSize: 10,
        },
        boldText: {
          fontSize: 10,
          bold: true,
        },
      },
    };

    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.createPdf(dd, null, null, pdfFonts.pdfMake.vfs).open();
  };

  return (
    <>
      <a onClick={GetPdf}>
        Print Packing
      </a>
    </>
  );
};

export default PdfPackingList;