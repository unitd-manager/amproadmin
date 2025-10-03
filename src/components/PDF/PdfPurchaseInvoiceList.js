import React, { useState, useEffect } from 'react';
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import PropTypes from 'prop-types';
import moment from 'moment';
import api from '../../constants/api';
import message from '../Message';
import PdfFooter from './PdfFooter';

const PdfPurchaseInvoiceList = ({ ids }) => {
     PdfPurchaseInvoiceList.propTypes = {
    ids: PropTypes.array,
  };
  // ✅ Change: receive multiple invoice IDs
  const [invoices, setInvoices] = useState([]);

  const fetchInvoicesData = () => {
    // Assuming your backend API can accept multiple IDs
    api
      .post('/purchaseorder/getPurchaseInvoicesByIds', { purchase_invoice_ids: ids })
      .then((res) => {
        setInvoices(res.data.data || []); // Each invoice object includes supplier + lineItems
    console.log('res.data',res.data);
    })
      .catch(() => {
        message('Invoices Not Found', 'info');
      });
  };

  useEffect(() => {
    if (ids && ids.length) {
      fetchInvoicesData();
    }
  }, [ids]);

  const GetPdf = () => {
    const allContent = [];

    invoices?.forEach((inv, idx) => {
      // Prepare lineItems
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

      inv.lineItems?.forEach((item, index) => {
        productItems?.push([
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

      // Push this invoice’s content
      allContent.push(
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
        {
          columns: [
            {
              stack: [
                { text: 'SUPPLIER :', bold: true },
                { text: inv?.supplier?.company_name || '', style: 'boldText' },
                { text: inv?.supplier?.address || '' },
                { text: `Tel : ${inv?.supplier?.phone || ''}` },
              ],
              style: 'box',
            },
            {
              stack: [
                { text: `TRAN NO : ${inv?.tran_no || ''}` },
                { text: `TRAN DATE : ${moment(inv?.tran_date).format('DD/MM/YYYY')}` },
                { text: `TERMS : ${inv?.carry_days || ''}` },
                { text: `PAGE : 1/1` },
                { text: `AGENT NAME : ${inv?.created_by || ''}` },
              ],
              style: 'box',
            },
          ],
        },
        {
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: productItems,
          },
          layout: 'lightHorizontalLines',
          margin: [0, 10, 0, 10],
        },
        {
          columns: [
            { text: 'Remarks :', bold: true },
            {
              stack: [
                { text: `Sub Total : ${inv?.sub_total || ''}`, alignment: 'right' },
                { text: `GST : ${inv?.gst || ''}`, alignment: 'right' },
                { text: `Net Total : ${inv?.net_total || ''}`, alignment: 'right', bold: true },
                { text: `Paid Amount : ${inv?.paid_amount || ''}`, alignment: 'right' },
                { text: `Balance Amount : ${inv?.balance_amount || ''}`, alignment: 'right' },
              ],
              width: 'auto',
            },
          ],
        },
        // Page break between invoices
        idx < invoices.length - 1 ? { text: '', pageBreak: 'after' } : {}
      );
    });

    const dd = {
      pageSize: 'A4',
      pageMargins: [20, 160, 20, 60],
      footer: PdfFooter,
      content: allContent,
      styles: {
        header: { fontSize: 16, bold: true },
        headerRight: { fontSize: 14, bold: true },
        smallText: { fontSize: 9 },
        box: { fontSize: 10, margin: [0, 5, 0, 5] },
        tableHead: {
          bold: true,
          fontSize: 9,
          color: 'white',
          fillColor: 'black',
          alignment: 'center',
        },
        tableBody: { fontSize: 9, margin: [0, 2, 0, 2] },
        boldText: { fontSize: 10, bold: true },
      },
    };

    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.createPdf(dd).open();
  };

  return (
    <>
      <a onClick={GetPdf}>Print</a>
    </>
  );
};

export default PdfPurchaseInvoiceList;
