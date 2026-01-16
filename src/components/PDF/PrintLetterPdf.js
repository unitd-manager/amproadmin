import React, { useState, useEffect } from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import PropTypes from 'prop-types';
import moment from 'moment';
import api from '../../constants/api';
import message from '../Message';
//import PdfFooter from './PdfFooter';
//mport PdfHeader from './PdfHeader';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

// const PdfHeader = (invoiceData, salesOrder) => {
//   return function PdfHeaderFunction(currentPage, pageCount) {
//     return {
//       margin: [40, 20, 40, 10],
//       columns: [
//         {
//           width: '60%',
//           text:
//             `${salesOrder.company_name || ''}\n` +
//             `${salesOrder.address1 || ''}\n` +
//             `${salesOrder.address2 || ''}\n` +
//             `${salesOrder.address_street || ''}\n` +
//             `${salesOrder.address_country || ''} ${salesOrder.address_po_code || ''}\n` +
//             `Tel : ${salesOrder.phone || ''}`,
//           fontSize: 10,
//         },
//         {
//           width: '40%',
//           alignment: 'right',
//           fontSize: 10,
//           text:
//             `${invoiceData.invoice_code || ''}\n\n` +
//             `${invoiceData.invoice_date
//               ? moment(invoiceData.invoice_date).format('DD/MM/YYYY dddd')
//               : ''}\n\n` +
//             `${currentPage} / ${pageCount}\n\n` +   // ✅ 1/5, 2/5
//             `${salesOrder.payment_terms || 'COD'}\n\n` +
//             `${salesOrder.salesman_name || ''} ${salesOrder.salesman_phone || ''}`,
//         },
//       ],
//       columnGap: 20,
//     };
//   };
// };



const PrintPerfomaInvList = ({ id }) => {
  PrintPerfomaInvList.propTypes = {
    id: PropTypes.arrayOf(PropTypes.any).isRequired,
  };

  const [salesOrders, setSalesOrders] = useState([]);
  const [lineItems, setLineItems] = useState([]);
  // const [hfdata, setHeaderFooterData] = useState([]);
  const [setGtotal] = useState(0);
  const [taxRate] = useState(0.09);
  // const headerInvoice = salesOrders[0] || {};
  // const headerInvoiceData = lineItems[0] || {};


  // useEffect(() => {
  //   api.get('/setting/getSettingsForCompany')
  //     .then((res) => setHeaderFooterData(res.data.data))
  //     .catch(() => message('Error fetching company settings', 'error'));
  // }, []);

  // const findCompany = (key) => {
  //   const filteredResult = hfdata?.find((e) => e.key_text === key);
  //   return filteredResult?.value || '';
  // };

  const fetchSalesOrderData = async () => {
    try {
      const salesOrderPromises = id.map(orderId =>
        api.post('/invoice/getSalesorderById', { invoice_id: orderId })
      );
      const lineItemPromises = id.map(orderId =>
        api.post('/invoice/getQuoteLineItemsById', { invoice_id: orderId })
      );

      const salesOrderResponses = await Promise.all(salesOrderPromises);
      const lineItemResponses = await Promise.all(lineItemPromises);

      const allSalesOrders = salesOrderResponses.flatMap(res => res.data.data.map(item => ({ ...item, invoice_id: String(item.invoice_id) })) || []);
      const allLineItems = lineItemResponses.map((res, index) => {
        const items = res.data.data || [];
        return items.map(item => ({
          ...item,
          invoice_id: id[index],
          invoice_code: allSalesOrders[index]?.invoice_code || '',
          invoice_date: allSalesOrders[index]?.invoice_date || ''
        }));
      }).flat();

      setSalesOrders(allSalesOrders);
      setLineItems(allLineItems);

      let grandTotal = 0;
      allLineItems.forEach((elem) => {
        grandTotal += elem.total || 0;
      });
      setGtotal(grandTotal);
    } catch (error) {
      message('Error fetching sales order data', 'error');
    }
  };

  useEffect(() => {
    if (id && id.length > 0) {
      fetchSalesOrderData();
    }
  }, [id]);

  const GetPdf = () => {
    if (!lineItems || lineItems.length === 0) {
      message('No line items found', 'warning');
      return;
    }

    const invoiceGroups = {};
    lineItems.forEach(item => {
      if (!invoiceGroups[item.invoice_id]) {
        invoiceGroups[item.invoice_id] = {
          items: [],
          invoice_code: item.invoice_code,
          invoice_date: item.invoice_date
        };
      }
      invoiceGroups[item.invoice_id].items.push(item);
    });

    const allContent = [];
    const invoiceIds = Object.keys(invoiceGroups);

    invoiceIds.forEach((invoiceId) => {
      const invoiceData = invoiceGroups[invoiceId];
      const invoiceItems = invoiceData.items;
      // Find the correct sales order for this invoice
      const currentSalesOrder = salesOrders.find(order => String(order.invoice_id) === String(invoiceId)) || {};
      const currentInvoiceData = invoiceItems[0] || {};

      let invoiceSubtotal = 0;
      invoiceItems.forEach(item => {
        invoiceSubtotal += item.total || 0;
      });
      const invoiceGst = invoiceSubtotal * taxRate;
      const invoiceTotalWithGst = invoiceSubtotal + invoiceGst;

      const productItems = [];

      invoiceItems.forEach((item, itemIndex) => {
        productItems.push([
          { text: `${itemIndex + 1}`, style: 'tableBody', margin: [0, 0, 20, 0] },
          { text: `${item.product_name || ''}`, style: 'tableBody', margin: [0, 0, 20, 0] },
          { text: `${item.unit || ''}`, style: 'tableBody', margin: [0, 0, 20, 0] },
          { text: `${item.carton_qty || ''}`, style: 'tableBody', margin: [0, 0, 20, 0] },
          { text: `${item.loose_qty || ''}`, style: 'tableBody', margin: [0, 0, 20, 0] },
          { text: `${item.foc || ''}`, style: 'tableBody', margin: [0, 0, 20, 0] },
          { text: `${item.carton_price || ''}`, style: 'tableBody', margin: [0, 0, 20, 0] },
          { text: `${item.wholesale_price || ''}`, style: 'tableBody', margin: [0, 0, 20, 0] },
          { text: `${item.total || ''}`, style: 'tableBody', margin: [0, 0, 20, 0] },
        ]);
      });

      for (let i = 0; i < 10; i++) {
        productItems.push([
          { text: '', style: 'tableBody', margin: [0, 0, 20, 0] },
          { text: '', style: 'tableBody', margin: [0, 0, 20, 0] },
          { text: '', style: 'tableBody', margin: [0, 0, 20, 0] },
          { text: '', style: 'tableBody', margin: [0, 0, 20, 0] },
          { text: '', style: 'tableBody', margin: [0, 0, 20, 0] },
          { text: '', style: 'tableBody', margin: [0, 0, 20, 0] },
          { text: '', style: 'tableBody', margin: [0, 0, 20, 0] },
          { text: '', style: 'tableBody', margin: [0, 0, 20, 0] },
          { text: '', style: 'tableBody', margin: [0, 0, 20, 0] },
        ]);
      }

      // Add pageBreak: 'before' for all but the first invoice, and group header, table, and total in a stack
      const stackContent = [
        {
          margin: [40, 20, 40, 10],
          columns: [
            {
              width: '60%',
              text:
                `${currentSalesOrder.company_name || ''}\n` +
                `${currentSalesOrder.address1 || ''}\n` +
                `${currentSalesOrder.address2 || ''}\n` +
                `${currentSalesOrder.address_street || ''}\n` +
                `${currentSalesOrder.address_country || ''} ${currentSalesOrder.address_po_code || ''}\n` +
                `Tel : ${currentSalesOrder.phone || ''}`,
              fontSize: 10,
            },
            {
              width: '40%',
              alignment: 'right',
              fontSize: 10,
              text:
                `${currentInvoiceData.invoice_code || ''}\n\n` +
                `${currentInvoiceData.invoice_date
                  ? moment(currentInvoiceData.invoice_date).format('DD/MM/YYYY dddd')
                  : ''}\n\n` +
                `${currentSalesOrder.payment_terms || 'COD'}\n\n` +
                `${currentSalesOrder.salesman_name || ''} ${currentSalesOrder.salesman_phone || ''}`,
            },
          ],
          columnGap: 20,
        },
        {
          layout: 'noBorders',
          table: {
            headerRows: 0,
            widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: productItems,
          },
          margin: [0, 0, 0, 120], // More space below the table
        },
        {
          absolutePosition: {x: 400, y: 650},
          table: {
            widths: ['*', 'auto'],
            body: [
              ['', invoiceSubtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })],
              ['', invoiceGst.toLocaleString('en-IN', { minimumFractionDigits: 2 })],
              ['', invoiceTotalWithGst.toLocaleString('en-IN', { minimumFractionDigits: 2 })],
            ],
          },
          layout: 'noBorders',
          style: 'textSize',
        }
      ];
      const stackObj = allContent.length > 0
        ? { pageBreak: 'before', stack: stackContent }
        : { stack: stackContent };
      allContent.push(stackObj);
    });

    const dd = {
      pageSize: 'A4',
      pageMargins: [40, 70, 40, 80],
      footer: '',
      content: allContent,
      styles: {
        tableHead: { bold: true, fontSize: 10, color: 'black' },
        tableBody: { fontSize: 9 },
        textSize: { fontSize: 10 },
      },
    };

      
    pdfMake.createPdf(dd, null, null, pdfFonts.pdfMake.vfs).open();
  };

  return (
    <a onClick={GetPdf} >
      Print Letter Format
    </a>
  );
};

export default PrintPerfomaInvList;
