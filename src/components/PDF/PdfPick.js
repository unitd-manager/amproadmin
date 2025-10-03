import React, { useState, useEffect } from 'react';
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
// import { Button } from 'reactstrap'; 
import PropTypes from 'prop-types';
import moment from 'moment';
import api from '../../constants/api';
import message from '../Message';
import PdfFooter from './PdfFooter'; // Assuming you have a footer component
import PdfHeader from './PdfHeader'; // Assuming you have a header component


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
        { text: 'S.No', style: 'tableHead' },
        { text: 'Product Name', style: 'tableHead' },
        { text: 'Uom', style: 'tableHead' },
        { text: 'CQty', style: 'tableHead' },
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

    Object.values(aggregatedItems).forEach((item, index) => {
      const cQty = parseFloat(item.carton_qty || 0);
      productItems.push([
        { text: `${index + 1}`, style: 'tableBody' },
        { text: `${item.product_name || ''}`, style: 'tableBody' },
        { text: `${item.unit || ''}`, style: 'tableBody' }, // Display unit
        { text: cQty.toFixed(2), style: 'tableBody' },
      ]);
    });
  
    const dd = {
      pageSize: 'A4',
      pageMargins: [40, 150, 40, 80], // Adjust margins as needed
            header: PdfHeader({ findCompany }),
      footer: PdfFooter, // Assuming you have a standard footer
      content: [
        {
          text: findCompany('company_name') || 'Ampro PTE LTD', // Fallback if not found
          style: 'header',
          alignment: 'left',
        },
        {
          text: 'Picking List',
          style: 'subheader',
          alignment: 'left',
          margin: [0, 0, 0, 10],
        },
        {
          text: `Selected Sales Orders: ${salesOrder.map(so => so.tran_no).join(', ') || ''}`,
          style: 'textSize',
          margin: [0, 0, 0, 5],
        },
        {
          text: `Print Date: ${moment().format('DD-MM-YYYY HH:mm:ss')}`,
          style: 'textSize',
          alignment: 'right',
          margin: [0, 0, 0, 15],
        },
        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto', 'auto'], // Adjust column widths
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
