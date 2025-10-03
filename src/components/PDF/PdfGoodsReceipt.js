import React, { useState, useEffect } from 'react';
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import PropTypes from 'prop-types';
import moment from 'moment';
import api from '../../constants/api';
import message from '../Message';
import PdfFooter from './PdfFooter';

const PdfGoodsReceipt = ({ id }) => {
  PdfGoodsReceipt.propTypes = {
    id: PropTypes.any,
  };

  const [invoice, setInvoice] = useState({});
  const [lineItems, setLineItems] = useState([]);
  const [supplier, setSupplier] = useState({});

  // Fetch invoice + supplier + items
  const fetchInvoiceData = () => {
    api
      .post('/purchaseorder/getGoodsReceiptById', { goods_receipt_id: id })
      .then((res) => {
        setInvoice(res.data.data[0] || {});
        setSupplier(res.data.supplier || {});
      })
      .catch(() => {
        message('Purchase Invoice Not Found', 'info');
      });

    api
      .post('/purchaseorder/getGrProductByGoodsReceiptId', { goods_receipt_id: id })
      .then((res) => {
        setLineItems(res.data.data || []);
      })
      .catch(() => {
        message('Invoice Line Items Not Found', 'info');
      });
  };

  useEffect(() => {
    if (id) {
      fetchInvoiceData();
    }
  }, [id]);

  const GetPdf = () => {
    // Table Header
    const productItems = [
      [
        { text: 'No', style: 'tableHead' },
        { text: 'Description', style: 'tableHead' },
        { text: 'U.O.M', style: 'tableHead' },
        { text: 'CTN', style: 'tableHead' },
        { text: 'PCS', style: 'tableHead' },
        { text: 'F.O.C', style: 'tableHead' },
        { text: 'C/PRI', style: 'tableHead' },
        { text: 'U/PRI', style: 'tableHead' },
        { text: 'Amount', style: 'tableHead' },
      ],
    ];

    // Table Rows
    lineItems.forEach((item, index) => {
      productItems.push([
        { text: `${index + 1}`, style: 'tableBody', alignment: 'center' },
        { text: item.product_name || '', style: 'tableBody' },
        { text: item.uom || '', style: 'tableBody', alignment: 'center' },
        { text: item.ctn || '', style: 'tableBody', alignment: 'center' },
        { text: item.pcs || '', style: 'tableBody', alignment: 'center' },
        { text: item.foc || '', style: 'tableBody', alignment: 'center' },
        { text: item.cpri || '', style: 'tableBody', alignment: 'right' },
        { text: item.upri || '', style: 'tableBody', alignment: 'right' },
        { text: item.amount || '', style: 'tableBody', alignment: 'right' },
      ]);
    });

    // PDF Definition
    const dd = {
      pageSize: 'A4',
      pageMargins: [20, 160, 20, 60],
      footer: PdfFooter,
      content: [
        // Header
        {
          columns: [
            { text: 'AMPRO PTE LTD', style: 'header' },
            { text: 'PURCHASE INVOICE', style: 'headerRight', alignment: 'right' },
          ],
        },
        {
          text:
            'WHOLESALER • IMPORTER • EXPORTER • GENERAL MERCHANTS\n' +
            'BLOCK B #02-01, 31 PENJURU LANE, SINGAPORE 609198\n' +
            'Tel : 93280444   Email : amprop127@gmail.com   Website : www.ampro.sg',
          style: 'smallText',
          alignment: 'center',
          margin: [0, 10, 0, 10],
        },
        // Supplier + Invoice Details
        {
          columns: [
            {
              stack: [
                { text: 'SUPPLIER :', bold: true },
                { text: supplier.supplier_name || '', style: 'boldText' },
                { text: supplier.address || '' },
                { text: `Tel : ${supplier.phone || ''}` },
              ],
              style: 'box',
            },
            {
              stack: [
                { text: `TRAN NO : ${invoice.tran_no || ''}` },
                { text: `TRAN DATE : ${moment(invoice.tran_date).format('DD/MM/YYYY')}` },
                { text: `TERMS : ${invoice.carry_days || ''}` },
                { text: `PAGE : 1/1` },
                { text: `AGENT NAME : ${invoice.created_by || ''}` },
              ],
              style: 'box',
            },
          ],
        },
        // Product Table
        {
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: productItems,
          },
          layout: 'lightHorizontalLines',
          margin: [0, 10, 0, 10],
        },
        // Totals
        {
          columns: [
            { text: 'Remarks :', bold: true },
            {
              stack: [
                { text: `Sub Total : ${invoice.sub_total || ''}`, alignment: 'right' },
                { text: `GST : ${invoice.gst || ''}`, alignment: 'right' },
                { text: `Net Total : ${invoice.net_total || ''}`, alignment: 'right', bold: true },
                { text: `Paid Amount : ${invoice.paid_amount || ''}`, alignment: 'right' },
                { text: `Balance Amount : ${invoice.balance_amount || ''}`, alignment: 'right' },
              ],
              width: 'auto',
            },
          ],
        },
      ],
      styles: {
        header: { fontSize: 16, bold: true },
        headerRight: { fontSize: 14, bold: true },
        smallText: { fontSize: 9 },
        box: {
          fontSize: 10,
          margin: [0, 5, 0, 5],
        },
        tableHead: {
          bold: true,
          fontSize: 9,
          color: 'white',
          fillColor: 'black',
          alignment: 'center',
        },
        tableBody: {
          fontSize: 9,
          margin: [0, 2, 0, 2],
        },
        boldText: { fontSize: 10, bold: true },
      },
    };

    pdfMake.vfs = pdfFonts.pdfMake.vfs;
       pdfMake.createPdf(dd, null, null, pdfFonts.pdfMake.vfs).open();
  };

  return (
    <>
      <a onClick={GetPdf}>Print Goods Receipt</a>
    </>
  );
};

export default PdfGoodsReceipt;
