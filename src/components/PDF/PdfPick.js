import React, { useState, useEffect } from 'react';
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';
import moment from 'moment';
import api from '../../constants/api';
import message from '../Message';
import PdfFooter from './PdfFooter'; // Assuming you have a footer component

const PdfPickingList = ({ id }) => {
  PdfPickingList.propTypes = {
    id: PropTypes.any,
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
      .post('/salesorder/getQuoteLineItemsById', { sales_order_id: id })
      .then((res) => {
        setLineItems(res.data.data || []);
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
      ],
    ];
  
    lineItems.forEach((item, index) => {
      const cQty = parseFloat(item.carton_qty || 0);
      productItems.push([
        { text: `${index + 1}`, style: 'tableBody' },
        { text: `${item.product_name || ''}`, style: 'tableBody' },
        { text: `${item.quantity || ''}`, style: 'tableBody' },
        { text: cQty.toFixed(2), style: 'tableBody' },
      ]);
    });
  
    const dd = {
      pageSize: 'A4',
      pageMargins: [40, 150, 40, 80], // Adjust margins as needed
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
          text: `Selected Sales Order: ${salesOrder.tran_no || ''}`,
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
      <Button type="button" className="btn btn-dark mr-2" onClick={GetPdf}>
        Print Picking List
      </Button>
    </>
  );
};

export default PdfPickingList;
