import React, { useState, useEffect } from 'react';
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';
import moment from 'moment';
import api from '../../constants/api';
import message from '../Message';
import PdfHeader from './PdfHeader';

const PdfSalesQuote = ({ id }) => {
  PdfSalesQuote.propTypes = {
    id: PropTypes.any,
  };

  const [salesOrder, setSalesOrder] = useState({});
  const [lineItems, setLineItems] = useState([]);
  const [hfdata, setHeaderFooterData] = useState();
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    api
      .post('/salesorder/getSalesorderById', { sales_order_id: id })
      .then((res) => {
        if (res.data && res.data.data && res.data.data.length > 0) {
          setSalesOrder(res.data.data[0]);
        } else {
          setSalesOrder({});
          message('Sales Order Data Not Found', 'info');
        }
      })
      .catch(() => {
        message('Failed to fetch Sales Order Data', 'error');
        setSalesOrder({});
      })
      .finally(() => {
        setLoading(false);
      });

    api
      .post('/salesorder/getQuoteLineItemsById', { sales_order_id: id })
      .then((res) => {
        if (res.data && res.data.data) {
          setLineItems(res.data.data);
        } else {
          setLineItems([]);
          message('Sales Order Line Items Not Found', 'info');
        }
      })
      .catch(() => {
        message('Failed to fetch Sales Order Line Items', 'error');
        setLineItems([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (id) {
      fetchSalesOrderData();
    }
  }, [id]);

  const GetPdf = () => {
    if (lineItems.length === 0) {
      message('No line items to generate PDF.', 'warning');
      return;
    }

    const productItems = [
      [
        { text: 'No', style: 'tableHead' },
        { text: 'DESCRIPTION', style: 'tableHead' },
        { text: 'U.O.M', style: 'tableHead' },
        { text: 'CTN', style: 'tableHead' },
        { text: 'PCS', style: 'tableHead' },
        { text: 'C/PRI', style: 'tableHead' },
        { text: 'U/PRI', style: 'tableHead' },
        { text: 'AMOUNT', style: 'tableHead' },
        { text: 'GROSS TOTAL', style: 'tableHead' },
      ],
    ];

    let subTotal = 0;

    lineItems.forEach((item, index) => {
      const calculatedAmount = (parseFloat(item.carton_price || 0) * parseFloat(item.quantity || 0));
      productItems.push([
        { text: `${index + 1}`, style: 'tableBody' },
        { text: `${item.product_name || ''}`, style: 'tableBody' },
        { text: `${item.quantity || ''}`, style: 'tableBody' },
        { text: `${item.carton_qty || ''}`, style: 'tableBody' },
        { text: `${item.loose_qty || ''}`, style: 'tableBody' },
        { text: `${item.carton_price || ''}`, style: 'tableBody' },
        { text: `${item.wholesale_price || ''}`, style: 'tableBody' },
        { text: calculatedAmount.toFixed(2), style: 'tableBody', alignment: 'right' },
        { text: `${item.gross_total || ''}`, style: 'tableBody' },
      ]);
      subTotal += calculatedAmount;
    });

    const gstRate = parseFloat(salesOrder.gst || 0);
    const gstAmount = (subTotal * gstRate) / 100;
    const netTotal = subTotal + gstAmount;

    const dd = {
      pageSize: 'A4',
      pageMargins: [40, 120, 40, 80], // Increased top margin to create more space after the header
      header: PdfHeader({ findCompany }), // Pass findCompany to PdfHeader
      content: [
        {
          table: {
            widths: ['*'], // Ensure the table takes full width
            body: [
              [
                {
                  text: `Sole Distributors : Danish Food, Dekko Food, Pran Food`,
                  style: 'textSize',
                  alignment: 'center', // Center the text inside the table
                  margin: [10, 10, 10, 5],
                },
              ],
            ],
          },
          layout: {
            hLineWidth() { return 1; },
            vLineWidth() { return 1; },
            hLineColor() { return 'black'; },
            vLineColor() { return 'black'; },
            paddingLeft() { return 0; },
            paddingRight() { return 0; },
            paddingTop() { return 0; },
            paddingBottom() { return 0; },
          },
          alignment: 'center', // Ensure the table itself is centered on the page
          margin: [0, 40, 0, 0], // Move the entire box closer to the top
        },
        // Add more space below Sole Distributors and boxes for Customer and Transaction
        {
          columns: [
            {
              stack: [
                { text: `CUSTOMER : ${salesOrder.first_name || ''}\n`, style: 'headerInfoLeft' },
                { text: `DELIVERY TO: ${salesOrder.delivery_address || ''}`, style: 'headerInfoLeft' }, // Added delivery address
              ],
              width: '50%',
              layout: {
                // Adding borders to this box
                hLineWidth(i) { return i === 0 ? 0.5 : 0.5; },
                vLineWidth(i) { return i === 0 ? 0.5 : 0.5; },
                hLineColor() { return 'black'; },
                vLineColor() { return 'black'; },
                paddingLeft() { return 10; },
                paddingRight() { return 10; },
                paddingTop() { return 5; },
                paddingBottom() { return 5; },
              },
              margin: [0, 20, 0, 0], // Increased margin for space between Sole Distributors and the customer box
            },
            {
              stack: [
                { text: `TRAN NO : ${salesOrder.tran_no || ''}`, style: 'headerInfoRight' },
                { text: `TRAN DATE : ${moment(salesOrder.tran_date).format('DD/MM/YYYY')} ${moment(salesOrder.tran_date).format('dddd')}`, style: 'headerInfoRight' },
                { text: `TERMS COD : ${salesOrder.terms_code || ''}`, style: 'headerInfoRight' },
                { text: `AGENT NAME : ${salesOrder.sales_man || ''}`, style: 'headerInfoRight' },
              ],
              width: '50%',
              layout: {
                // Adding borders to this box
                hLineWidth(i) { return i === 0 ? 0.5 : 0.5; },
                vLineWidth(i) { return i === 0 ? 0.5 : 0.5; },
                hLineColor() { return 'black'; },
                vLineColor() { return 'black'; },
                paddingLeft() { return 10; },
                paddingRight() { return 10; },
                paddingTop() { return 5; },
                paddingBottom() { return 5; },
              },
              alignment: 'right',
              margin: [0, 20, 0, 0], // Increased margin for space between Sole Distributors and the transaction box
            },
          ],
          margin: [40, 0, 40, 10],
        },
        // Table
        {
          layout: {
            hLineWidth: (i, node) => (i === 0 || i === node.table.body.length) ? 0.5 : 0.5,
            vLineWidth: (i) => (i === 0) ? 0.5 : 0.5,
            hLineColor: (i) => (i === 1) ? 'black' : '#aaa',
            vLineColor: '#aaa',
            fillColor: (i) => (i % 2 === 0) ? '#eee' : null,
          },
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: productItems,
          },
          margin: [40, 0, 40, 0],
        },
        // Remarks
        { text: `Remarks : ${salesOrder.remarks || ''}`, style: 'remarks', margin: [40, 10, 0, 0] },
        // Totals
        {
          columns: [
            {},
            {
              stack: [
                { text: `Sub Total : ${subTotal.toFixed(2)}`, style: 'footerRight' },
                { text: `GST (${gstRate}%) : ${gstAmount.toFixed(2)}`, style: 'footerRight' },
                { text: `Net Total : ${netTotal.toFixed(2)}`, style: 'footerRightBold' },
              ],
            },
          ],
          margin: [40, 0, 40, 10],
        },
        { text: '-------------\nfor AMPRO PTE LTD', style: 'footerRightSign', alignment: 'right', margin: [0, 0, 40, 0] },
      ],
      styles: {
        textSize: {
          fontSize: 10,
        },
        headerInfoLeft: {
          fontSize: 10,
        },
        headerInfoRight: {
          fontSize: 10,
          alignment: 'right',
        },
        tableHead: {
          bold: true,
          fontSize: 9,
          color: 'black',
        },
        tableBody: {
          fontSize: 9,
        },
        remarks: {
          fontSize: 9,
          margin: [40, 0, 0, 5],
          alignment: 'left',
        },
        footerLeft: {
          fontSize: 9,
          alignment: 'left',
        },
        footerRight: {
          fontSize: 9,
          alignment: 'right',
          margin: [0, 2, 0, 2],
        },
        footerRightBold: {
          fontSize: 9,
          bold: true,
          alignment: 'right',
          margin: [0, 5, 0, 5],
        },
        footerRightSign: {
          fontSize: 9,
          alignment: 'right',
          margin: [0, 15, 0, 0],
        },
      },
    };
    
    
    

    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.createPdf(dd, null, null, pdfFonts.pdfMake.vfs).open();
  };

  return (
    <>
      <Button type="button" className="btn btn-dark mr-2" onClick={GetPdf} disabled={loading}>
        {loading ? 'Loading...' : 'Print Sales Quote'}
      </Button>
    </>
  );
};

export default PdfSalesQuote;