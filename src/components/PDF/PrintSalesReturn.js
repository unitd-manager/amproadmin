import React, { useState, useEffect } from 'react';
import * as Icon from 'react-feather';
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
//import { Button } from 'reactstrap';
import PropTypes from 'prop-types';
import moment from 'moment';
import api from '../../constants/api';
//import message from '../Message';
import PdfFooter from './PdfFooter'; // Assuming you have a footer component
import PdfHeader from './PdfHeader'; // Assuming you have a header component

const PrintPerfomaList = ({ id }) => {
    PrintPerfomaList.propTypes = {
    id: PropTypes.arrayOf(PropTypes.any).isRequired,
  };
console.log(id,"wsed")
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
 
  const fetchSalesOrderData = async () => {
    try {
      // Fetch sales order data for all IDs
      const salesOrderPromises = id.map(orderId =>
        api.post('/salesreturn/getSalesorderById', { sales_return_id: orderId })
      );
      const lineItemPromises = id.map(orderId =>
        api.post('/salesreturn/getQuoteLineItemsById', { sales_return_id: orderId })
      );

      const salesOrderResponses = await Promise.all(salesOrderPromises);
      const lineItemResponses = await Promise.all(lineItemPromises);

      const allSalesOrders = salesOrderResponses.map(res => res.data.data[0] || {});
      const allLineItems = lineItemResponses.map(res => res.data.data).flat();

      setSalesOrder(allSalesOrders[0]); // Keep the first one for header info
      setLineItems(allLineItems);

      let grandTotal = 0;
      allLineItems.forEach((elem) => {
        grandTotal += elem.total || 0;
      });
      setGtotal(grandTotal);
    } catch (error) {
     // message('Error fetching sales order data', 'error');
    }
  };


  //  const [taxType, setTaxType] = React.useState('');
 const [taxRate] = React.useState(0.09); // Set default tax rate to 9%
  //  console.log(taxType)
  //  React.useEffect(() => {
  //   const fetchBillDiscountAndTax = async () => {
  //     try {
  //       const response = await api.post('/salesOrder/getSalesorderById', {
  //         sales_return_id: id,
  //       });
  
  //       const data = response.data.data[0];
       
  
  //       const type = data?.tax_type || '';
  //       setTaxType(type);
  
  //       const taxResponse = await api.post('/valuelist/getValueListByKeyText', {
  //         value: type, // use this instead of taxType
  //       });
  
  //       const taxCode = parseFloat(taxResponse.data.data[0]?.code) || 0;
  //       setTaxRate(taxCode / 100);
  //     } catch (error) {
  //       console.error('Failed to fetch bill discount or tax info:', error);
  //     }
  //   };
  
  //   if (id) {
  //     fetchBillDiscountAndTax();
  //   }
  // }, [id]);
  

  const gst = gTotal * taxRate;
    const totalWithGst = gTotal + gst;

  useEffect(() => {
    if (id) {
      fetchSalesOrderData();
    }
  }, [id]);

  const GetPdf = () => {
    if (!lineItems || lineItems.length === 0) {
     
      return;
    }

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

    lineItems.forEach((item, index) => {
      productItems.push([
        { text: `${index + 1}`, style: 'tableBody' },
        { text: `${item.product_name || ''}`, style: 'tableBody' },
        { text: `${item.unit || ''}`, style: 'tableBody' },
        { text: `${item.carton_qty || ''}`, style: 'tableBody' },
        { text: `${item.loose_qty || ''}`, style: 'tableBody' },
        { text: `${item.foc || ''}`, style: 'tableBody' },
        { text: `${item.carton_price || ''}`, style: 'tableBody' },
        { text: `${item.wholesale_price || ''}`, style: 'tableBody' },
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
        { text: '', style: 'tableBody' },
      ]);
    }

    const dd = {
      pageSize: 'A4',
      pageMargins: [40, 150, 40, 80], // Adjust margins as needed
      header: PdfHeader({ findCompany }), // Assuming your header needs company info
      footer: PdfFooter, // Assuming you have a standard footer
      content: [
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
                      { text: 'Customer:', bold: true }
                    ],
                    [
                      {
                        text: [
                          salesOrder.company_name || '', '\n',
                          salesOrder.address1 || '', '\n',
                          salesOrder.address2 || '', '\n',
                           salesOrder.address_street || '', '\n',
                          salesOrder.address_country || '', ' - ',
                          salesOrder.address_po_code || '', '\n',
                          `TEL:${salesOrder.phone || 'NULL'}`, '\n', '\n','\n',
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
                    ]
                  ]
                },
                layout: {
                  // Outside borders for other rows
                  hLineWidth: (i, node) => (i === 0 || i === node.table.body.length ? 0.5 : 1), // Top and bottom borders
                  vLineWidth: (i, node) => (i === 0 || i === node.table.widths.length ? 0.5 : 0), // Left and right borders
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
                          { text: salesOrder.sales_return_code || '', margin: [5, 3, 5, 3] }
                        ],
                        [
                          { text: 'TRAN DATE', margin: [5, 3, 5, 3] },
                          { text: salesOrder.sales_return_date ? moment(salesOrder.sales_return_date).format('DD-MM-YYYY') : '', margin: [5, 3, 5, 3] }
                        ],
                        [
                          { text: 'TERMS', margin: [5, 3, 5, 3] },
                          { text: salesOrder.terms || '', margin: [5, 3, 5, 3] }
                        ],
                        [
                          { text: 'PAGE', margin: [5, 3, 5, 3] },
                          { text: salesOrder.order_no || '', margin: [5, 3, 5, 3] }
                        ],
                        [
                          { text: 'AGENT NAME', margin: [5, 3, 5, 3] },
                          { text: salesOrder.gst_reg_no || '', margin: [5, 3, 5, 3] }
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
                { text: gTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 }), alignment: 'right', margin: [5, 5, 5, 5] }
              ],
              [
                {}, // empty cell due to rowspan
                { text: 'GST  :', bold: true, alignment: 'center', margin: [5, 5, 5, 5] },
                { text: gst.toLocaleString('en-IN', { minimumFractionDigits: 2 }), alignment: 'right', margin: [5, 5, 5, 5] }
              ],
              [
                {}, // empty cell due to rowspan
                { text: 'Net Total  :', bold: true, alignment: 'center', margin: [5, 5, 5, 5] },
                { text: totalWithGst.toLocaleString('en-IN', { minimumFractionDigits: 2 }), alignment: 'right', margin: [5, 5, 5, 5] }
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
      <a   onClick={GetPdf}>
       <Icon.Printer size={16} />
      </a>
    </>
  );
};

export default PrintPerfomaList;