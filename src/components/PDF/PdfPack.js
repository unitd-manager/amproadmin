import React, { useState, useEffect } from 'react';
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';
import api from '../../constants/api';
import message from '../Message';
import PdfFooter from './PdfFooter'; // Assuming you have a footer component
import PdfHeader from './PdfHeader'; // Assuming you have a header component
import moment from 'moment';

const PdfInvoiceSummary = ({ id }) => {
  PdfInvoiceSummary.propTypes = {
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
      .post('/salesorder/getSalesOrderById', { sales_order_id: id })
      .then((res) => {
        setSalesOrder(res.data.data[0] || {});
      })
      .catch(() => {
        message('Sales Order Data Not Found', 'info');
      });

    api
      .post('/salesorder/getSalesOrderLineItems', { sales_order_id: id })
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
        { text: 'LQty', style: 'tableHead' },
        { text: 'FocQty', style: 'tableHead' },
        { text: 'CQty', style: 'tableHead' },
      ],
    ];

    lineItems.forEach((item, index) => {
      productItems.push([
        { text: `${index + 1}`, style: 'tableBody' },
        { text: `${item.title || ''}`, style: 'tableBody' },
        { text: `${item.uom || ''}`, style: 'tableBody' },
        { text: `${item.l_qty || ''}`, style: 'tableBody' },
        { text: `${item.foc_qty || ''}`, style: 'tableBody' },
        { text: `${item.quantity || ''}`, style: 'tableBody' },
      ]);
    });

    const dd = {
      pageSize: 'A4',
      pageMargins: [40, 150, 40, 80], // Adjust margins as needed
      header: PdfHeader({ findCompany }), // Assuming your header needs company info
      footer: PdfFooter, // Assuming you have a standard footer
      content: [
        {
          text: findCompany('company_name') || 'Ampro PTE LTD', // Fallback if not found
          style: 'header',
          alignment: 'center',
        },
        {
          columns: [
            {
              text: `Date: ${moment().format('DD-MM-YYYY')}`,
              style: 'textSize',
            },
            {
              text: `Sales Order Code: ${salesOrder.tran_no || ''}`,
              style: 'textSize',
              alignment: 'right',
            },
          ],
          margin: [0, 0, 0, 5],
        },
        {
          columns: [
            {
              text: `Customer Code: ${salesOrder.customer_code || ''}`,
              style: 'textSize',
            },
            {
              text: `Customer Name: ${salesOrder.customer_name || ''}`,
              style: 'textSize',
              alignment: 'right',
            },
          ],
          margin: [0, 0, 0, 15],
        },
        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto'], // Adjust column widths
            body: productItems,
          },
        },
        {
          columns: [
            {
              text: `Total for Invoice No: ${salesOrder.invoice_code || salesOrder.sales_order_code || ''}`, // Assuming invoice_code or using sales_order_code as fallback
              style: 'boldText',
              alignment: 'right',
              margin: [0, 10, 10, 0],
            },
            {
              text: `Total: ${salesOrder.total_amount || ''}`, // Adjust field name for total amount
              style: 'boldText',
              alignment: 'right',
              margin: [10, 10, 0, 0],
            },
          ],
        },
      ],
      styles: {
        header: {
          fontSize: 18,
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
        boldText: {
          fontSize: 10,
          bold: true,
        },
      },
    };

    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.createPdf(dd, null, null, pdfFonts.pdfMake.vfs).open();
  };

  return (
    <>
      <Button type="button" className="btn btn-dark mr-2" onClick={GetPdf}>
        Print Invoice Summary
      </Button>
    </>
  );
};

export default PdfInvoiceSummary;