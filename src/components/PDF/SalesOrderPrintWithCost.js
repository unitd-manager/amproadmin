import React, { useState, useEffect } from 'react';
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';
import moment from 'moment';
import { AlignCenter } from 'react-feather';
import api from '../../constants/api';
import message from '../Message';
import PdfFooter from './PdfFooter';
import PdfHeader from './PdfHeader';


const PrintPerfoma = ({ id }) => {
  PrintPerfoma.propTypes = {
    id: PropTypes.any,
  };

  const [salesOrder, setSalesOrder] = useState({});
  const [lineItems, setLineItems] = useState();
  const [hfdata, setHeaderFooterData] = useState();
  const [gTotal, setGtotal] = useState(0);

  useEffect(() => {
    api.get('/setting/getSettingsForCompany').then((res) => {
      setHeaderFooterData(res.data.data);
    });
  }, []);

  const findCompany = (key) => {
    const filteredResult = hfdata?.find((e) => e.key_text === key);
    return filteredResult?.value || '';
  };

  const fetchSalesOrderData = () => {
    api
      .post('/salesorder/getSalesorderById', { sales_order_id: id })
      .then((res) => {
        setSalesOrder(res.data.data[0] || {});
      })
      .catch(() => {
        message('Sales Order Data Not Found', 'info');
      });

    api
      .post('/salesOrder/getQuoteLineItemsById', { sales_order_id: id })
      .then((res) => {
        setLineItems(res.data.data);
        let grandTotal = 0;
        res.data.data.forEach((elem) => {
          grandTotal += elem.total;
        });
        setGtotal(grandTotal);
      })
      .catch(() => {
        message('Sales Order Line Items Not Found', 'info');
      });
  };

  useEffect(() => {
    if (id) {
      fetchSalesOrderData();
    }
  }, [id]);

  const GetPdf = () => {
    const productItems = [
      [
        { text: 'No', style: 'tableHead' },
        { text: 'Product Code', style: 'tableHead' },
        { text: 'Description', style: 'tableHead' },
        { text: 'QTY', style: 'tableHead' },
        { text: 'Unit Price', style: 'tableHead' },
        { text: 'Amount', style: 'tableHead' },
      ],
    ];

    lineItems?.forEach((item, index) => {
      productItems.push([
        { text: `${index + 1}`, style: 'tableBody' },
        { text: `${item.product_code || ''}`, style: 'tableBody' },
        { text: `${item.product_name || ''}`, style: 'tableBody' },
        { text: `${item.quantity || ''}`, style: 'tableBody' },
        { text: `${item.wholesale_price || ''}`, style: 'tableBody' },
        { text: `${item.total || ''}`, style: 'tableBody' },
      ]);
    });

    const gst = gTotal * 0.07;
    const totalWithGst = gTotal + gst;

    const dd = {
      pageSize: 'A4',
      pageMargins: [40, 150, 40, 80],
      header: PdfHeader({ findCompany }),
      footer: PdfFooter,
      content: [
        {
          text: findCompany('company_name') || 'AMPRO PTE LTD',
          style: 'header',
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        {
          columns: [
            {
              width: '60%',
              stack: [
                { text: 'Bill To:', bold: true },
                { text: '', margin: [8, 0, 0, 0] },
                { text: salesOrder.company_name || '', bold: true, margin: [8, 0, 0, 0] },
                { text: salesOrder.address_street || '', margin: [8, 0, 0, 0] },
                { text: salesOrder.address_down || '', margin: [8, 0, 0, 0] },
                { text: salesOrder.address_country || '', margin: [8, 0, 0, 0] },
                { text: salesOrder.address_po_code || '', margin: [8, 0, 0, 0] },
                { text: '', margin: [8, 0, 0, 0] },
                { text: 'TEL: 6789098765', margin: [8, 5, 0, 0] },
              ],
            },
            {
              width: '40%',
              stack: [
                { text: 'Sales Order', style: 'subheader', margin: [0, 0, 0, 5] }, // heading
                {
                  table: {
                    widths: ['30%', '5%', '65%'],
                    body: [
                      ['Sales Order No', ':', salesOrder.tran_no || ''],
                      ['Date', ':', salesOrder.tran_date ? moment(salesOrder.tran_date).format('DD-MM-YYYY') : ''],
                      ['Terms', ':', salesOrder.terms || ''],
                      ['Order No', ':', '1 of 1'],
                      ['GST Reg No', ':', salesOrder.agent_name || ''],
                    ],
                  },
                  layout: 'noBorders',
                  style: 'textSize',
                },
              ],
            },
          ],
          columnGap: 10,
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
          table: {
            widths: ['*', 'auto'],
            body: [
              [
                { text: 'Subtotal', alignment: 'right', bold: true, fontSize: 10 },
                { text: gTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 }), alignment: 'right' },
              ],
              [
                { text: 'GST (7%)', alignment: 'right', bold: true, fontSize: 10 },
                { text: gst.toLocaleString('en-IN', { minimumFractionDigits: 2 }), alignment: 'right' },
              ],
              [
                { text: 'Total', alignment: 'right', bold: true, fontSize: 10 },
                { text: totalWithGst.toLocaleString('en-IN', { minimumFractionDigits: 2 }), alignment: 'right' },
              ],
            ],
          },
          layout: 'noBorders',
          margin: [0, 10, 0, 0],
        },
       
        {
          margin: [0, 80, 0, 0], // space from totals
          columns: [
            {
              width: '70%',
              stack: [
                { text: 'Received By:', bold: true, margin: [0, 0, 0, 10] },
                { text: '___________________________', margin: [0, 0, 0, 10] },
                { text: 'Company Stamp and Signature', italics: true },
              ],
              style: 'textSize',
            },
            {
              width: '30%',
              alignment: 'left',
              stack: [
                { text: 'AMPRO PTE LTD', bold: true, AlignCenter },
                { text: '___________________________', margin: [0, 0, 0, 10] },
                { text: '(Authorised Signature)', italics: true },
                { text: 'Name:', margin: [0, 10, 0, 0] },
              ],
              style: 'textSize',
            },
          ],
        }
        
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
        subheader: {
          fontSize: 14,
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
      },
    };

    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.createPdf(dd, null, null, pdfFonts.pdfMake.vfs).open();
  };

  return (
    <>
      <Button type="button" className="btn btn-dark mr-2" onClick={GetPdf}>
        Print Picking List
      </Button>
    </>
  );
};

export default PrintPerfoma;
