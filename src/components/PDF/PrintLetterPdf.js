import React, { useState, useEffect } from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import PropTypes from 'prop-types';
import moment from 'moment';
import api from '../../constants/api';
import message from '../Message';
import PdfFooter from './PdfFooter';
//mport PdfHeader from './PdfHeader';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const PrintPerfomaInvList = ({ id }) => {
  PrintPerfomaInvList.propTypes = {
    id: PropTypes.arrayOf(PropTypes.any).isRequired,
  };

  const [salesOrders, setSalesOrders] = useState([]);
  const [lineItems, setLineItems] = useState([]);
  // const [hfdata, setHeaderFooterData] = useState([]);
  const [setGtotal] = useState(0);
  const [taxRate] = useState(0.09);

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

    invoiceIds.forEach((invoiceId, index) => {
      const invoiceData = invoiceGroups[invoiceId];
      const invoiceItems = invoiceData.items;
      const currentSalesOrder = salesOrders.find(order => String(order.invoice_id) === invoiceId) || {};

      let invoiceSubtotal = 0;
      invoiceItems.forEach(item => {
        invoiceSubtotal += item.total || 0;
      });
      const invoiceGst = invoiceSubtotal * taxRate;
      const invoiceTotalWithGst = invoiceSubtotal + invoiceGst;

      const productItems = [
        [
          { text: 'No', style: 'tableHead' },
          { text: 'Description', style: 'tableHead' },
          { text: 'UOM', style: 'tableHead' },
          { text: 'CTN', style: 'tableHead' },
          { text: 'PCS', style: 'tableHead' },
          { text: 'F.O.C', style: 'tableHead' },
          { text: 'C/PRI', style: 'tableHead' },
          { text: 'Amount', style: 'tableHead' },
        ],
      ];

      invoiceItems.forEach((item, itemIndex) => {
        productItems.push([
          { text: `${itemIndex + 1}`, style: 'tableBody' },
          { text: `${item.product_name || ''}`, style: 'tableBody' },
          { text: `${item.unit || ''}`, style: 'tableBody' },
          { text: `${item.carton_qty || ''}`, style: 'tableBody' },
          { text: `${item.loose_qty || ''}`, style: 'tableBody' },
          { text: `${item.foc || ''}`, style: 'tableBody' },
          { text: `${item.carton_price || ''}`, style: 'tableBody' },
          { text: `${item.total || ''}`, style: 'tableBody' },
        ]);
      });

       for (let i = 0; i < 10; i++) {
      productItems.push([
        { text: '', style: 'tableBody' },
        { text: '', style: 'tableBody' },
        { text: '', style: 'tableBody' },
        { text: '', style: 'tableBody' },
        { text: '', style: 'tableBody' },
        { text: '', style: 'tableBody' },
        { text: '', style: 'tableBody' },
        { text: '', style: 'tableBody' },
      ]);
    }

      if (index > 0) {
        allContent.push({ text: '', pageBreak: 'before' });
      }

      allContent.push(
     {
  columns: [
    {
      width: '50%',
      text: `${currentSalesOrder.company_name || ''}\n${currentSalesOrder.address1 || ''}\n${currentSalesOrder.address2 || ''}\n${currentSalesOrder.address_street || ''}\n${currentSalesOrder.address_country || ''} - ${currentSalesOrder.address_po_code || ''}\nTEL: ${currentSalesOrder.phone || 'NULL'}\n\n`,

      style: 'textSize',
    },
    {
      width: '50%',
      table: {
        widths: ['50%', '50%'],
        body: [
          [
            { text: ``, bold: true, border: [false, false, false, false] },
            { text: `${invoiceData.invoice_code || ''}`, alignment: 'right', border: [false, false, false, false] },
          ],
          [
            { text: ``, bold: true, border: [false, false, false, false] },
            { 
              text: invoiceData.invoice_date 
                ? moment(invoiceData.invoice_date).format('DD-MM-YYYY') 
                : '', 
              alignment: 'right',
              border: [false, false, false, false],
            },
          ],
        ],
      },
      layout: 'noBorders',
      style: 'textSize',
    },
  ],
  columnGap: 30,
  margin: [0, 0, 0, 15],
},

        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: productItems,
          },
        },
        {
          table: {
            widths: ['*', 'auto'],
            body: [
              ['Subtotal:', invoiceSubtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })],
              ['GST:', invoiceGst.toLocaleString('en-IN', { minimumFractionDigits: 2 })],
              ['Net Total:', invoiceTotalWithGst.toLocaleString('en-IN', { minimumFractionDigits: 2 })],
            ],
          },
          layout: 'noBorders',
          margin: [0, 20, 0, 10],
          style: 'textSize',
        }
      );
    });

    const dd = {
      pageSize: 'A4',
      pageMargins: [40, 150, 40, 80],
      header: '',
      footer: PdfFooter,
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
