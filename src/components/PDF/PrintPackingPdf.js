import React, { useEffect, useState } from 'react';
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import PropTypes from 'prop-types';
import moment from 'moment';
import api from '../../constants/api'; 
import message from '../Message';


const PrintPackingPdf = ({ id, settingdetails, lineItem }) => {
  PrintPackingPdf.propTypes = {
    id: PropTypes.any,
    settingdetails: PropTypes.any,
    lineItem: PropTypes.any,
  };

  const [invoice, setInvoice] = useState(settingdetails || {});
  const [items, setItems] = useState(lineItem || []);

  useEffect(() => {
   
      api.post('/invoice/getSalesorderById', { invoice_id: id })
        .then((res) => setInvoice(res.data.data[0] || {}))
        .catch(() => message('Invoice Data Not Found', 'info'));
    
 
      api.post('/invoice/getQuoteLineItemsById', { invoice_id: id })
        .then((res) => setItems(res.data.data))
        .catch(() => message('Line Items Not Found', 'info'));
    
  }, [id]);

  const getGrandTotal = () => {
    let total = 0;
    (items || []).forEach((item) => {
      total += Number(item.carton_qty || 0);
    });
    return total;
  };

  const GetPdf = () => {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    // Table header: merged row for 'Product Name', then actual headers
    const tableBody = [
    //   [
    //     { text: 'Product Name', style: 'tableHead', colSpan: 6, alignment: 'center', margin: [0, 2, 0, 2] }, {}, {}, {}, {}, {}
    //   ],
      [
        { text: 'S.No', style: 'tableHead', alignment: 'center' },
        { text: 'Product Name', style: 'tableHead', alignment: 'center' },
        { text: 'Uom', style: 'tableHead', alignment: 'center' },
        { text: 'LQty', style: 'tableHead', alignment: 'center' },
        { text: 'FocQty', style: 'tableHead', alignment: 'center' },
        { text: 'CQty', style: 'tableHead', alignment: 'center' },
      ],
    ];
    (items || []).forEach((item, idx) => {
      tableBody.push([
        { text: idx + 1, style: 'tableBody', alignment: 'center' },
        { text: item.product_name || '', style: 'tableBody', alignment: 'left' },
        { text: item.unit || '', style: 'tableBody', alignment: 'center' },
        { text: item.loose_qty || '', style: 'tableBody', alignment: 'center' },
        { text: item.foc_qty || '', style: 'tableBody', alignment: 'center' },
        { text: item.carton_qty || '', style: 'tableBody', alignment: 'center' },
      ]);
    });
    const dd = {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 40],
      content: [
        {
          columns: [
            {
              width: '*',
              stack: [
                { text: 'AMPRO PTE LTD', style: 'header', alignment: 'left', margin: [0, 0, 0, 2] },
                { text: 'Sales Invoice PackingList', style: 'subheader', alignment: 'left', margin: [0, 0, 0, 2] }
              ]
            },
            {
              width: 'auto',
              stack: [
                { text: `Print Date : ${moment().format('M/D/YYYY h:mm:ss A')}`, alignment: 'right', style: 'meta', margin: [0, 0, 0, 2] },
                { text: 'Page No : 1/1', alignment: 'right', style: 'meta', margin: [0, 0, 0, 2] }
              ]
            }
          ]
        },
        {
          table: {
            widths: ['*'],
            body: [
              [
                {
                  text: [
                    'S.No   ',
                    moment(invoice.invoice_date).format('DD/MM/YYYY') || '', '   ',
                    invoice.invoice_code || '', '   ',
                    invoice.company_name || ''
                  ],
                  style: 'meta',
                  alignment: 'left',
                  margin: [0, 2, 0, 2]
                }
              ]
            ]
          },
          layout: {
            hLineWidth: (i, node) => (i === 0 || i === node.table.body.length ? 1 : 0),
            vLineWidth: () => 0,
            hLineColor: () => '#000',
            vLineColor: () => '#000'
          },
          margin: [0, 4, 0, 4]
        },
        { text: ' ', margin: [0, 0, 0, 2] },
        {
          table: {
            headerRows: 2,
            widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto'],
            body: tableBody,
          },
          layout: {
            hLineWidth: (i, node) => (i === 2 || i === node.table.body.length ? 1.5 : 1),
            vLineWidth: () => 1,
            hLineColor: () => '#000',
            vLineColor: () => '#000',
            fillColor: (rowIndex) => (rowIndex === 0 ? null : rowIndex === 1 ? '#f2f2f2' : null),
          },
        },
        {
          table: {
            widths: ['*', '*', '*', '*', '*', 'auto'],
            body: [
              [
                { text: `Total For InvoiceNo : ${invoice.invoice_code || ''}`, alignment: 'right', bold: true, margin: [0, 8, 0, 0], colSpan: 5 }, {}, {}, {}, {},
                { text: getGrandTotal(), alignment: 'center', bold: true, margin: [0, 8, 0, 0] }
              ],
              [
                { text: 'Grand Total', alignment: 'right', bold: true, colSpan: 5 }, {}, {}, {}, {},
                { text: getGrandTotal(), alignment: 'center', bold: true }
              ]
            ]
          },
          layout: 'noBorders',
          margin: [0, 8, 0, 0]
        },
      ],
      styles: {
        header: { fontSize: 18, bold: true },
        subheader: { fontSize: 14, bold: true },
        tableHead: { bold: true, fontSize: 10, color: 'black' },
        tableBody: { fontSize: 9 },
        meta: { fontSize: 10 },
      },
    };
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.createPdf(dd, null, null, pdfFonts.pdfMake.vfs).open();
  };

  return (
    <a  onClick={GetPdf} >
      Print Packing List
    </a>
  );
};

export default PrintPackingPdf; 
