import React, { useState, useEffect } from 'react';
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';
import moment from 'moment';
import api from '../../constants/api';
import message from '../Message';
import PdfFooter from './PdfFooter';
import PdfHeader from './PdfHeader';


const SalesInvoicePickingListPdf = ({ id, settingdetails }) => {
    SalesInvoicePickingListPdf.propTypes = {
    id: PropTypes.any,
    settingdetails: PropTypes.any
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
console.log("SalesOrde", salesOrder)
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
      .post('/invoice/getQuoteLineItemsById', { invoice_id: id })
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
        { text: 'S.No', style: 'tableHead' },
        { text: 'Product Name', style: 'tableHead' },
        { text: 'Uom', style: 'tableHead' },
        { text: 'CQty', style: 'tableHead' },
        { text: 'Loose Qty', style: 'tableHead' },
        { text: 'Carton Price', style: 'tableHead' },
        { text: 'Discount', style: 'tableHead' },
        { text: 'Amount', style: 'tableHead' },
      ],
    ];

    lineItems?.forEach((item, index) => {
      productItems.push([
        { text: `${index + 1}`, style: 'tableBody' },
        { text: `${item.product_name || ''}`, style: 'tableBody' },
        { text: `${item.unit || ''}`, style: 'tableBody' },
        { text: `${item.carton_qty || ''}`, style: 'tableBody' },
        { text: `${item.loose_qty || ''}`, style: 'tableBody' },
        { text: `${item.carton_price || ''}`, style: 'tableBody' },
        { text: `${item.discount_value || ''}`, style: 'tableBody' },
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
                text: 'Picking List',
                style: 'header',
                alignment: 'center',
                margin: [0, 0, 0, 10],
              },
        {
          columns: [
            {
                width: '50%',
                stack: [
                  {
                    table: {
                        widths: ['auto','auto','auto'],
                      body: [
                        ['Selected Invoice', ':', settingdetails.invoice_code || ''],
                      ],
                    },
                    layout: 'noBorders',
                    style: 'textSize',
                  },
                ],
              },
            {
              width: '50%',
              stack: [
                {
                  table: {
                    widths: ['auto','auto','auto'],
                    body: [
                        ['Print date', ':', moment().format('DD-MM-YYYY HH:mm:ss') ],
                        ['Page No', ':',  ''],
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
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#000',
            vLineColor: () => '#000',
            fillColor: (rowIndex) => {
              return rowIndex === 0 ? '#f2f2f2' : null; // light gray header
            },
          },
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
              [
                { text: 'Subtotal', alignment: 'right', bold: true, fontSize: 9 },
                { text: gTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 }),fontSize: 9, alignment: 'right' },
              ],
              [
                { text: 'GST (7%)', alignment: 'right', bold: true, fontSize: 9 },
                { text: gst.toLocaleString('en-IN', { minimumFractionDigits: 2 }),fontSize: 9 , alignment: 'right' },
              ],
              [
                { text: 'Total', alignment: 'right', bold: true, fontSize: 9 },
                { text: totalWithGst.toLocaleString('en-IN', { minimumFractionDigits: 2 }), fontSize: 9, alignment: 'right' },
              ],
            ],
          },
          layout: 'Borders',
          margin: [0, 0, 0, 0],
        },
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

export default SalesInvoicePickingListPdf;
