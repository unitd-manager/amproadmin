import React, { useState, useEffect } from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import PropTypes from 'prop-types';
import moment from 'moment';
import api from '../../constants/api';
import message from '../Message';
import PdfFooter from './PdfFooter';
import PdfHeader from './PdfHeader2'; 

/* ============================
   ✅ REGISTER FONTS ONCE
============================ */


const PdfPackingList = ({ selectedOrderIds }) => {

  PdfPackingList.propTypes = {
    selectedOrderIds: PropTypes.array,
  };

  const [allSalesOrders, setAllSalesOrders] = useState([]);
  const [allLineItems, setAllLineItems] = useState([]);
  const [hfdata, setHeaderFooterData] = useState([]);

  /* ---------------- COMPANY SETTINGS ---------------- */
  useEffect(() => {
    api.get('/setting/getSettingsForCompany')
      .then(res => setHeaderFooterData(res.data?.data || []))
      .catch(() => setHeaderFooterData([]));
  }, []);

  const findCompany = (key) => {
    const item = hfdata.find(e => e.key_text === key);
    return item?.value || '';
  };

  /* ---------------- FETCH DATA ---------------- */
  const fetchAllSalesOrderData = async () => {
    try {
      const results = await Promise.all(
        selectedOrderIds.map(async (orderId) => {
          try {
            const soRes = await api.post('/invoice/getSalesOrderById', {
              invoice_id: orderId,
            });
            const liRes = await api.post('/invoice/getQuoteLineItemsById', {
              invoice_id: orderId,
            });

            return {
              salesOrder: soRes.data?.data?.[0] || {},
              lineItems: {
                orderId,
                items: liRes.data?.data || [],
              },
            };
          } catch {
            message(`Data not found for Order ID ${orderId}`, 'warning');
            return null;
          }
        })
      );

      const valid = results.filter(Boolean);
      setAllSalesOrders(valid.map(v => v.salesOrder));
      setAllLineItems(valid.map(v => v.lineItems));
    } catch {
      message('Network error while fetching data', 'error');
    }
  };

  useEffect(() => {
    if (selectedOrderIds?.length) {
      fetchAllSalesOrderData();
    }
  }, [selectedOrderIds]);

  /* ---------------- PDF ---------------- */
  const GetPdf = () => {

    if (!allSalesOrders.length || !allLineItems.length) {
      message('No data available to generate PDF', 'warning');
      return;
    }

    const allContent = [];
    let grandTotalQty = 0;

    allSalesOrders.forEach((salesOrder, index) => {
      const items =
        allLineItems.find(i => i.orderId === salesOrder.invoice_id)?.items || [];

      let totalLoose = 0;
      let totalFoc = 0;
      let totalCarton = 0;

      const tableBody = [[
        { text: 'S.No', style: 'tableHead', alignment: 'center' },
        { text: 'Product Name', style: 'tableHead' },
        { text: 'UOM', style: 'tableHead', alignment: 'center' },
        { text: 'LQty', style: 'tableHead', alignment: 'right' },
        { text: 'FocQty', style: 'tableHead', alignment: 'right' },
        { text: 'CQty', style: 'tableHead', alignment: 'right' },
      ]];

      items.forEach((item, idx) => {
        const l = Number(item.loose_qty || 0);
        const f = Number(item.foc_qty || 0);
        const c = Number(item.carton_qty || 0);

        totalLoose += l;
        totalFoc += f;
        totalCarton += c;

        tableBody.push([
          { text: idx + 1, style: 'tableBody', alignment: 'center' },
          { text: item.product_name || '', style: 'tableBody' },
          { text: item.unit || '', style: 'tableBody', alignment: 'center' },
          { text: l.toString(), style: 'tableBody', alignment: 'right' },
          { text: f.toString(), style: 'tableBody', alignment: 'right' },
          { text: c.toString(), style: 'tableBody', alignment: 'right' },
        ]);
      });

      tableBody.push([
        '',
        { text: 'Total', style: 'boldText', alignment: 'right' },
        '',
        { text: totalLoose.toString(), style: 'boldText', alignment: 'right' },
        { text: totalFoc.toString(), style: 'boldText', alignment: 'right' },
        { text: totalCarton.toString(), style: 'boldText', alignment: 'right' },
      ]);

      grandTotalQty += totalCarton;

      allContent.push(
        {
          text: findCompany('company_name'),
          style: 'header',
          alignment: 'center',
          margin: [0, index === 0 ? 0 : 20, 0, 5],
        },
        {
          columns: [
              {
                width: '15%',
                text: `${moment().format('DD-MM-YYYY')}`,
                style: 'textSize',
              },
              {
                width: '20%',
                text: `${salesOrder.tran_no || ''}`,
                style: 'textSize',
              },
              {
                width: '20%',
                text: `${salesOrder.customer_code || ''}`,
                style: 'textSize',
              },
              {
                width: '45%',
                text: `${salesOrder.company_name || ''}`,
                style: 'textSize',
                alignment: 'right',
              },
            ],
          style: 'textSize',
          margin: [0, 0, 0, 10],
        },
        {
          table: {
            headerRows: 1,
            widths: [30, '*', 40, 50, 50, 50],
            body: tableBody,
          },
          layout: 'lightHorizontalLines',
        },  {
    table: {
      widths: ['*', 50, 50],
      body: [
        [
          {
            text: `Total For InvoiceNo : ${
  salesOrder.tran_no ||
  salesOrder.invoice_no ||
  salesOrder.invoice_number ||
  salesOrder.sales_invoice_no ||
  ''
}`,

            bold: true,
            alignment: 'center',
          },
          {
            text: totalFoc.toString(),
            bold: true,
            alignment: 'right',
          },
          {
            text: totalCarton.toString(),
            bold: true,
            alignment: 'right',
          },
        ],
      ],
    },
    layout: {
      hLineWidth: () => 1,
      vLineWidth: () => 0,
      hLineColor: () => 'black',
    },
    margin: [0, 5, 0, 15],
  }

      );
    });

   allContent.push(
  // ===== TOP DOUBLE LINE =====
  {
    canvas: [
      { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 },
      { type: 'line', x1: 0, y1: 3, x2: 515, y2: 3, lineWidth: 1 },
    ],
    margin: [0, 10, 0, 5],
  },

  // ===== GRAND TOTAL ROW =====
  {
    table: {
      widths: ['*', 50, 50],
      body: [
        [
          {
            text: 'Grand Total',
            alignment: 'right',
            bold: true,
            fontSize: 10,
          },
          {
            text: grandTotalQty.toString(),
            alignment: 'right',
            bold: true,
            fontSize: 10,
          },
          {
            text: '', // if you later add Foc/LQty you can use this
          },
        ],
      ],
    },
    layout: 'noBorders',
    margin: [0, 5, 0, 5],
  },

  // ===== BOTTOM DOUBLE LINE =====
  {
    canvas: [
      { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 },
      { type: 'line', x1: 0, y1: 3, x2: 515, y2: 3, lineWidth: 1 },
    ],
    margin: [0, 5, 0, 0],
  }
);

    const dd = {
      pageSize: 'A4',
      pageMargins: [40, 65, 40, 60],
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
     <a onClick={GetPdf}>
        Print Packing
      </a>
  );
};

export default PdfPackingList;
