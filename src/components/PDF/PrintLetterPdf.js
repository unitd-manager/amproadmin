import React, { useState, useEffect } from 'react';
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
// import { Button } from 'reactstrap';
import PropTypes from 'prop-types';
//import moment from 'moment';
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
  
console.log(gTotal)
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
         { text: 'FOC Qty', style: 'tableHead' },
        { text: 'Carton Price', style: 'tableHead' },
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
        { text: `${item.foc_qty || ''}`, style: 'tableBody' },
        { text: `${item.carton_price || ''}`, style: 'tableBody' },
        { text: `${item.total || ''}`, style: 'tableBody' },
      ]);
    });

    // const gst = gTotal * 0.07;
    // const totalWithGst = gTotal + gst;


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
                  widths: ['*'],
                      body: [
                         [
                      {
                        text: [
                          settingdetails.company_name || '', '\n',
                          settingdetails.address_street || '', '\n',
                          settingdetails.address_down || '', '\n',
                          settingdetails.address_country || '', '\n',
                          settingdetails.address_po_code || '', '\n',
                          'TEL: 6789098765', '\n', '\n','\n',
                        ],
                        margin: [8, 4, 0, 4],
                        layout: {
                          // Full borders for the Customer Address row
                          hLineWidth: (i, node) => (i === 0 || i === node.table.body.length ? 0.5 : 0), // Border on top and bottom
                          vLineWidth: (i, node) => (i === 0 || i === node.table.widths.length ? 0.5 : 0), // Border on left and right
                          hLineColor: () => '#000000',
                          vLineColor: () => '#000000',
                        }
                      }
                    ],
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
                  widths: ['*'],
                    body: [
                        {
                        text: [
                          settingdetails.invoice_code || '', '\n',
                          settingdetails.invoice_date || '', '\n',
                        
                          
                        ],
                        margin: [8, 4, 0, 4],
                        layout: {
                          // Full borders for the Customer Address row
                          hLineWidth: (i, node) => (i === 0 || i === node.table.body.length ? 0.5 : 0), // Border on top and bottom
                          vLineWidth: (i, node) => (i === 0 || i === node.table.widths.length ? 0.5 : 0), // Border on left and right
                          hLineColor: () => '#000000',
                          vLineColor: () => '#000000',
                        }
                      }
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
                { text:settingdetails.sub_total || 0('en-IN', { minimumFractionDigits: 2 }),fontSize: 9, alignment: 'right' },
              ],
              [
                { text: 'GST %', alignment: 'right', bold: true, fontSize: 9 },
                { text: settingdetails.tax || 0('en-IN', { minimumFractionDigits: 2 }),fontSize: 9 , alignment: 'right' },
              ],
              [
                { text: 'Total', alignment: 'right', bold: true, fontSize: 9 },
                { text: settingdetails.invoice_amount || 0('en-IN', { minimumFractionDigits: 2 }), fontSize: 9, alignment: 'right' },
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
      <a  onClick={GetPdf}>
        Print Letter Format
      </a>
    </>
  );
};

export default SalesInvoicePickingListPdf;
