import React, { useState, useEffect } from 'react';
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';
import moment from 'moment';
import api from '../../constants/api';
import message from '../Message';
import PdfFooter from './PdfFooter'; // Assuming you have a footer component
import PdfHeader from './PdfHeader'; // Assuming you have a header component

const PrintPerfoma = ({ id }) => {
    PrintPerfoma.propTypes = {
    id: PropTypes.any,
  };

  const [salesOrder, setSalesOrder] = useState({});
  const [lineItems, setLineItems] = useState();
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
      .post('/salesOrder/getQuoteLineItemsById', { sales_order_id: id })
      .then((res) => {
        setLineItems(res.data.data);
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
        { text: `${item.quantity || ''}`, style: 'tableBody' },
        { text: `${item.wholesale_price || ''}`, style: 'tableBody' },
        { text: `${item.quantity || ''}`, style: 'tableBody' },
        { text: `${item.total || ''}`, style: 'tableBody' },
        { text: `${item.quantity || ''}`, style: 'tableBody' },
        { text: `${item.quantity || ''}`, style: 'tableBody' },
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
          text: findCompany('company_name') || 'AMPRO PTE LTD', // Fallback if not found
          style: 'header',
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        {
          text: 'Sole Distributors : Danish Food,Dekko Food,Pran Food',
          style: 'subheader',
          alignment: 'center',
          margin: [0, 0, 0, 20],
        },
        {
            columns: [
              {
                width: '50%',
                stack: [
                  { text: 'Customer Address:', bold: true },
                  { text: '', margin: [8, 0, 0, 0] },
                  { text: salesOrder.company_name || '', margin: [8, 0, 0, 0] },
                  { text: salesOrder.address_street || '', margin: [8, 0, 0, 0] },
                  { text: salesOrder.address_down || '', margin: [8, 0, 0, 0] },
                  { text: salesOrder.address_country || '', margin: [8, 0, 0, 0] },
                  { text: salesOrder.address_po_code || '', margin: [8, 0, 0, 0] },
                  { text: '', margin: [8, 0, 0, 0] },
                  { text: 'TEL: 6789098765', margin: [8, 5, 0, 0] },
                ],
                layout: 'Borders',
              style: 'textSize',
              },
              
              {
                width: '50%',
                stack: [
                  {
                    table: {
                      widths: ['30%', '5%', '65%'],
                      body: [
                        ['TRAN NO', ':', salesOrder.tran_no || ''],
                        ['TRAN DATE', ':', salesOrder.tran_date ? moment(salesOrder.tran_date).format('DD-MM-YYYY') : ''],
                        ['TERMS', ':', salesOrder.terms || ''],
                        ['PAGE', ':',salesOrder.order_no || '' ],
                        ['AGENT NAME', ':', salesOrder.gst_reg_no || ''],
                      ],
                    },
                    layout: 'Borders',
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
            widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'], // Adjust column widths
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