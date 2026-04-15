import React, { useState, useEffect } from 'react';
import * as Icon from 'react-feather';
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
//import { Button } from 'reactstrap';
import PropTypes from 'prop-types';
import moment from 'moment';
import api from '../../constants/api';
import message from '../Message';
import PdfFooter from './PdfFooter'; // Assuming you have a footer component
import PdfHeader from './PdfHeader'; // Assuming you have a header component

const PdfGoodsReturnList = ({ id }) => {
  PdfGoodsReturnList.propTypes = {
    id: PropTypes.arrayOf(PropTypes.any).isRequired,
  };
  console.log(id, "wsed");
  const [salesOrders, setSalesOrders] = useState([]);
  const [lineItems, setLineItems] = useState([]);
  const [hfdata, setHeaderFooterData] = useState();
  const [ setGtotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/setting/getSettingsForCompany').then((res) => {
      setHeaderFooterData(res.data.data);
    });
  }, []);

  const findCompany = (key) => {
    const filteredResult = hfdata?.find((e) => e.key_text === key);
    return filteredResult?.value || '';
  };
 
  const fetchSalesOrderData = async () => {
    try {
      setLoading(true);
      // Fetch sales order data for all IDs
      const salesOrderPromises = id.map(orderId =>
        api.post('/purchaseorder/getGoodsReturnById', { goods_return_id: orderId })
      );
      const lineItemPromises = id.map(orderId =>
        api.post('/purchaseorder/getGoodsReturnProductsByGoodsReturnId', { goods_return_id: orderId })
      );

      const salesOrderResponses = await Promise.all(salesOrderPromises);
      const lineItemResponses = await Promise.all(lineItemPromises);

      const allSalesOrders = salesOrderResponses.flatMap(res => res.data.data.map(item => ({ ...item, goods_return_id: String(item.goods_return_id) })) || []);
      const allLineItems = lineItemResponses.map((res, index) => {
        // Add the invoice information to each line item for grouping
        const items = res.data.data || [];
        return items.map(item => ({
          ...item,
          goods_return_id: id[index],
          invoice_code: allSalesOrders[index]?.invoice_code || '',
          invoice_date: allSalesOrders[index]?.invoice_date || ''
        }));
      }).flat();

      setSalesOrders(allSalesOrders);
      setLineItems(allLineItems);

      let grandTotal = 0;
      allLineItems.forEach((elem) => {
        grandTotal += Number(elem.total || 0);
      });
      setGtotal(grandTotal);
      setLoading(false);
    } catch (error) {
     // message('Error fetching sales order data', 'error');
      setLoading(false);
    }
  };

  const [taxRate] = React.useState(0.09); // Set default tax rate to 9%

  useEffect(() => {
    if (id) {
      fetchSalesOrderData();
    }
  }, [id]);

  const GetPdf = () => {
    if (!lineItems || lineItems.length === 0) {
      message('No line items found', 'warning');
      return;
    }

    // Group line items by invoice
    const invoiceGroups = {};
   lineItems.forEach(item => {

  const header = salesOrders.find(
    s => String(s.goods_return_id) === String(item.goods_return_id)
  );

  if (!invoiceGroups[item.goods_return_id]) {
    invoiceGroups[item.goods_return_id] = {
      items: [],
      invoice_code: header?.tran_no || '',
      invoice_date: header?.tran_date || '',
      headerData: header || {}
    };
  }

  invoiceGroups[item.goods_return_id].items.push(item);
});
    // Create content for each invoice
    const allContent = [];
    const invoiceIds = Object.keys(invoiceGroups);

    // For each invoice, create a separate section in the PDF
    invoiceIds.forEach((invoiceId, index) => {
      const invoiceData = invoiceGroups[invoiceId];
      const invoiceItems = invoiceData.items;
      const currentSalesOrder = salesOrders.find(order => String(order.goods_return_id) === invoiceId) || salesOrders[0] || {};
      
      // Calculate subtotal for this invoice
     const invoiceSubtotal = invoiceItems.reduce(
  (sum, item) => sum + Number(item.total || 0),
  0
);

const invoiceGst = Number((invoiceSubtotal * taxRate).toFixed(2));
const invoiceTotalWithGst = Number((invoiceSubtotal + invoiceGst).toFixed(2));
      // Create table rows for this invoice's items
      const productItems = [
        [
          { text: 'No', style: 'tableHead' },
          { text: 'Description', style: 'tableHead' },
          { text: 'Uom', style: 'tableHead' },
          { text: 'CTN', style: 'tableHead' },
          { text: 'PCS', style: 'tableHead' },
          { text: 'F.O.C', style: 'tableHead' },
          { text: 'C/PRI', style: 'tableHead' },
          { text: 'U/PRI', style: 'tableHead' },
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
          { text: `${item.wholesale_price || ''}`, style: 'tableBody' },
          { text: Number(item.total || 0).toFixed(2), style: 'tableBody' },
        ]);
      });

      // Add page break between invoices, except for the first one
      if (index > 0) {
        allContent.push({ text: '', pageBreak: 'before' });
      }

      // Add invoice header and content
      allContent.push(
        {
          columns: [
            { width: '*', text: '' }, // left spacer
            {
              width: 'auto',
              table: {
                widths: ['auto'],
                body: [
                  [
                    {
                      text: 'Sole Distributors : Danish Food, Dekko Food, Pran Food',
                      style: 'textSize',
                      alignment: 'center',
                      margin: [5, 5, 5, 5],
                      bold: true,
                    },
                  ],
                ],
              },
              layout: {
                hLineWidth: () => 0.5,
                vLineWidth: () => 0.5,
                hLineColor: () => '#000000',
                vLineColor: () => '#000000',
              },
            },
            { width: '*', text: '' } // right spacer
          ],
          margin: [0, 0, 0, 15]
        },
        
        {
          columns: [
            {
              width: '50%',
              table: {
                widths: ['*'],
                body: [
                  [
                    { text: 'Customer Address:', bold: true }
                  ],
                  [
                    {
                      text: [
  invoiceData.headerData.company_name ||
  invoiceData.headerData.supplier_name ||
  '', '\n',
  invoiceData.headerData.contact_address1 ||
  invoiceData.headerData.address_street ||
  '', '\n',
  invoiceData.headerData.contact_address2 ||
  invoiceData.headerData.address_down ||
  '', '\n',
  invoiceData.headerData.country ||
  invoiceData.headerData.address_country ||
  '', '\n',
  invoiceData.headerData.postal_code ||
  invoiceData.headerData.address_po_code ||
  '', '\n',
],
                      margin: [8, 4, 0, 4],
                    }
                  ]
                ]
              },
              layout: {
                hLineWidth: (i, node) => (i === 0 || i === node.table.body.length ? 1 : 1),
                vLineWidth: (i, node) => (i === 0 || i === node.table.widths.length ? 0.5 : 0),
                hLineColor: () => '#000000',
                vLineColor: () => '#000000'
              },
              style: 'textSize'
            },
            
            {
              width: '50%',
              stack: [
                {
                  table: {
                    widths: ['30%', '65%'],
                    body: [
                      [
                        { text: 'TRAN NO', margin: [5, 3, 5, 3] },
                        { text: invoiceData.invoice_code || '', margin: [5, 3, 5, 3] }
                      ],
                      [
                        { text: 'TRAN DATE', margin: [5, 3, 5, 3] },
                        { text: invoiceData.invoice_date ? moment(invoiceData.invoice_date).format('DD-MM-YYYY') : '', margin: [5, 3, 5, 3] }
                      ],
                     [
  { text: 'TERMS', margin: [5, 3, 5, 3] },
  { text: invoiceData.headerData.delivery_terms || currentSalesOrder.terms || '', margin: [5, 3, 5, 3] }
],
[
  { text: 'PAGE', margin: [5, 3, 5, 3] },
  { text: `${index + 1} of ${invoiceIds.length}`, margin: [5, 3, 5, 3] }
],
[
  { text: 'AGENT NAME', margin: [5, 3, 5, 3] },
  { text: invoiceData.headerData.company_name || invoiceData.headerData.salesman_name || currentSalesOrder.agent_name || '', margin: [5, 3, 5, 3] }
],
                    ]
                  },
                  layout: {
                    hLineWidth(i, node) {
                      return i === 0 || i === node.table.body.length ? 0.5 : 0;
                    },
                    vLineWidth(i, node) {
                      return i === 0 || i === node.table.widths.length ? 0.5 : 1;
                    },
                    hLineColor() {
                      return '#000000';
                    },
                    vLineColor() {
                      return '#000000';
                    }
                  },
                  style: 'textSize',
                }
              ]
            },
          ],
          columnGap: 10,
          margin: [0, 0, 0, 15],
        },
        
        {
          layout: {
            hLineWidth: (i) => (i === 0 || i === 1) ? 1 : 0,
            vLineWidth: () => 1,
            hLineColor: () => '#000',
            vLineColor: () => '#000',
            fillColor: (rowIndex) => {
              return rowIndex === 0 ? '#f2f2f2' : null; // light gray header
            },
          },
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'], // Adjust column widths
            body: productItems,
          },
        },
        {
          table: {
            widths: ['60%', '20%', '20%'],
            body: [
              [
                {
                  text: 'Remarks:\n',
                  bold: true,
                  colSpan: 1,
                  rowSpan: 3,
                  margin: [5, 5, 5, 5],
                },
                { text: 'Subtotal   :', bold: true, alignment: 'center', margin: [5, 5, 5, 5] },
                { text: invoiceSubtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 }), alignment: 'right', margin: [5, 5, 5, 5] }
              ],
              [
                {}, // empty cell due to rowspan
                { text: 'GST  :', bold: true, alignment: 'center', margin: [5, 5, 5, 5] },
                { text: invoiceGst.toLocaleString('en-IN', { minimumFractionDigits: 2 }), alignment: 'right', margin: [5, 5, 5, 5] }
              ],
              [
                {}, // empty cell due to rowspan
                { text: 'Net Total  :', bold: true, alignment: 'center', margin: [5, 5, 5, 5] },
                { text: invoiceTotalWithGst.toLocaleString('en-IN', { minimumFractionDigits: 2 }), alignment: 'right', margin: [5, 5, 5, 5] }
              ]
            ]
          },
          layout: {
            hLineWidth: (i, node) => (i === 0 || i === node.table.body.length ? 0.5 : 0),
            vLineWidth: (i, node) => (i === 0 || i === node.table.widths.length ? 0.5 : 0),
            hLineColor: () => '#000000',
            vLineColor: () => '#000000',
          },
          style: 'textSize',
          margin: [0, 0, 0, 10],
        },
        {
          text: 'E. & O. E.',
          alignment: 'center', // or 'right' or 'center' as needed
          margin: [0, 5, 0, 0],
          style: 'textSize'
        },
        {
          margin: [0, 80, 0, 0], // space from totals
          columns: [
            {
              width: '50%',
              stack: [
                { text: '________________________________________________', margin: [0, 0, 0, 10]},
                { text: 'Good Received in Good condition', italics: true, alignment: 'center',fontSize: 8 },
                { text: 'Customer Authorised Signature and' , italics: true, alignment: 'center', fontSize: 8},
                { text: 'company stamp', italics: true, alignment: 'center', fontSize: 8 },
              ],
              style: 'textSize',
            },
            {
              width: '50%',
              alignment: 'left',
              stack: [
                { text: '________________________________________________', margin: [0, 0, 0, 10]},
                { text: 'for AMPRO PTE LTD', alignment: 'center', fontSize: 8  },
              ],
              style: 'textSize',
            },
          ],
        }
      );
    });

    const dd = {
      pageSize: 'A4',
      pageMargins: [40, 150, 40, 80], // Adjust margins as needed
      header: PdfHeader({ findCompany }), // Assuming your header needs company info
      footer: PdfFooter, // Assuming you have a standard footer
      content: allContent,
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
    
    // Create the PDF document
   pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.createPdf(dd, null, null, pdfFonts.pdfMake.vfs).open();
  };
  
  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <button type="button" onClick={GetPdf}><Icon.Printer size={16} /></button>
        </div>
      )}
    </div>
  );
};

export default PdfGoodsReturnList;