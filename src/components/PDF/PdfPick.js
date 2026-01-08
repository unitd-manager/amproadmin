import React, { useState, useEffect } from 'react';
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
// import { Button } from 'reactstrap'; 
import PropTypes from 'prop-types';
import moment from 'moment';
import api from '../../constants/api';
import message from '../Message';

const PdfHeader = ({ findCompany }) => {
  return function pdfHeaderContent(currentPage, pageCount) {
    return {
      margin: [40, 20, 40, 10],
      stack: [
        {
          columns: [
            {
              text: findCompany('company_name') || 'AMPRO PTE LTD',
              fontSize: 16,
              bold: true,
            },
            {
              text: `Print Date : ${moment().format('MM/DD/YYYY hh:mm:ss A')}`,
              alignment: 'right',
              fontSize: 9,
            },
          ],
        },
        {
          columns: [
            {
              text: 'Sales Order Picking List',
              fontSize: 11,
              bold: true,
            },
            {
              text: `Page No : ${currentPage} of ${pageCount}`,
              alignment: 'right',
              fontSize: 9,
            },
          ],
          margin: [3, 8, 8, 0],
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 515,
              y2: 0,
              lineWidth: 1,
            },
          ],
        },
      ],
    };
  };
};

const PdfPickingList = ({ salesOrderIds }) => {
  PdfPickingList.propTypes = {
    salesOrderIds: PropTypes.array,
  };

  const [salesOrder, setSalesOrder] = useState({});
  const [lineItems, setLineItems] = useState([]);
  const [hfdata, setHeaderFooterData] = useState();

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
    let allSalesOrders = [];
     let allLineItems = [];

     try {
       const salesOrderPromises = salesOrderIds.map(id => api.post('/salesorder/getSalesorderById', { sales_order_id: id }));
      const lineItemPromises = salesOrderIds.map(id => api.post('/salesorder/getQuoteLineItemsById', { sales_order_id: id }));

      const salesOrderResponses = await Promise.all(salesOrderPromises);
      const lineItemResponses = await Promise.all(lineItemPromises);

      allSalesOrders = salesOrderResponses.map(res => res.data.data[0] || {});
       allLineItems = lineItemResponses.flatMap(res => res.data.data || []);

      setSalesOrder(allSalesOrders);
      setLineItems(allLineItems);
    } catch (error) {
      message('Error fetching sales order data or line items', 'error');
    }

    setSalesOrder(allSalesOrders);
    setLineItems(allLineItems);
  };

  useEffect(() => {
    if (salesOrderIds && salesOrderIds.length > 0) {
      fetchSalesOrderData();
    }
  }, [salesOrderIds]);

  const GetPdf = () => {
    const productItems = [
  [
    { text: 'S.No', style: 'tableHead', alignment: 'center', noWrap: true },
    { text: 'Product Name', style: 'tableHead' },
    { text: 'Uom', style: 'tableHead', alignment: 'center' },
    { text: 'CQty', style: 'tableHead', alignment: 'left'},
  ],
];

  
    const aggregatedItems = {};

    lineItems.forEach((item) => {
      if (aggregatedItems[item.product_id]) {
        aggregatedItems[item.product_id].quantity += parseFloat(item.quantity || 0);
        aggregatedItems[item.product_id].carton_qty += parseFloat(item.carton_qty || 0);
      } else {
        aggregatedItems[item.product_id] = {
          product_name: item.product_name,
          quantity: parseFloat(item.quantity || 0),
          carton_qty: parseFloat(item.carton_qty || 0),
          unit: item.unit, // Assuming unit is consistent for the same product
        };
      }
    });

    Object.values(aggregatedItems)
      .sort((a, b) => parseFloat(b.carton_qty || 0) - parseFloat(a.carton_qty || 0))
      .forEach((item, index) => {
        const cQty = parseFloat(item.carton_qty || 0);
        productItems.push([
  { text: index + 1, alignment: 'center', style: 'tableBody' },
  { text: item.product_name, style: 'tableBody' },
  { text: item.unit, alignment: 'center', style: 'tableBody' },
  { text: cQty % 1 === 0 ? cQty.toString() : cQty.toFixed(2), alignment: 'left', style: 'tableBody' },
]);

      });
  
    const dd = {
      pageSize: 'A4',
      pageMargins: [40, 80, 40, 40], // Adjust margins as needed
      header: PdfHeader({ findCompany }), // ✅ ONLY HEADER USED
      content: [
        {
          text: `Selected Sales Orders: ${salesOrder.map(so => so.tran_no).join(', ') || ''}`,
          style: 'textSize',
          margin: [0, 0, 0, 20],
        },
        {
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 20],
          table: {
            headerRows: 1,
            widths: [40, '*', 70, 60], // Adjust column widths
            body: productItems,
          },
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
          color: 'white',
          fillColor: 'black',
          alignment: 'center',
          padding: 5,
          wordWrap: 'break-word', // Allow wrapping of text in header
        },
        tableBody: {
          fontSize: 9,
          padding: 5,
          wordWrap: 'break-word', // Wrap text in body for long words
        },
        textSize: {
          fontSize: 10,
        },
        boldText: {
          fontSize: 10,
          bold: true,
        },
      },
      layout: {
        hLineWidth: () => 1, // Horizontal line width
        vLineWidth: () => 1, // Vertical line width
        hLineColor: () => '#000000', // Color of horizontal lines
        vLineColor: () => '#000000', // Color of vertical lines
        paddingLeft: () => 5, // Padding for left side
        paddingRight: () => 5, // Padding for right side
        paddingTop: () => 5, // Padding for top side
        paddingBottom: () => 5, // Padding for bottom side
      },
    };
  
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.createPdf(dd, null, null, pdfFonts.pdfMake.vfs).open();
  };
  
  return (
    <>
      <a  onClick={GetPdf}>
        Print Pick List
      </a>
    </>
  );
};

export default PdfPickingList;
