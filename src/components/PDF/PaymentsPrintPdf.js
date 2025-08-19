import { useEffect, useState } from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import PropTypes from 'prop-types';
import moment from 'moment';
import api from '../../constants/api';
import message from '../Message';
import PdfHeader from './PdfHeader';
import PdfFooter from './PdfFooter';


const PaymentsPrintPdf = ({ paymentId, onClose }) => {
      pdfMake.vfs = pdfFonts.pdfMake.vfs;

  PaymentsPrintPdf.propTypes = {
    paymentId: PropTypes.any,
    onClose: PropTypes.func,
  };

  const [hfdata, setHeaderFooterData] = useState([]);
  const [supplier, setSupplier] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [payments, setPayments] = useState([]);

  // --- Fetch header/footer company settings ---
  useEffect(() => {
    if (!paymentId) return;
    console.log("🔍 Fetching company settings...");
    api.get('/setting/getSettingsForCompany')
      .then((res) => {
        setHeaderFooterData(res.data.data || []);
        console.log("✅ Company settings:", res.data.data);
      })
      .catch((err) => {
        console.error("❌ Error fetching company settings:", err);
        message('Company settings not found', 'info');
      });
  }, [paymentId]);

  const findCompany = (key) => {
    const found = hfdata.find((e) => e.key_text === key);
    return found ? found.value : '';
  };

  // --- Fetch supplier ---
  useEffect(() => {
    if (!paymentId) return;
    console.log("🔍 Fetching supplier for paymentId:", paymentId);
    api.post('/payments/getSupplierData', { payments_id: paymentId })
      .then((res) => {
        setSupplier(res.data.data?.[0] || {});
        console.log("✅ Supplier:", res.data.data);
      })
      .catch((err) => {
        console.error("❌ Error fetching supplier:", err);
        message('Supplier data not found', 'info');
      });
  }, [paymentId]);

  // --- Fetch invoice transactions ---
  useEffect(() => {
    if (!paymentId) return;
    console.log("🔍 Fetching invoice transactions...");
    api.post('/payments/getInvoiceData', { payments_id: paymentId })
      .then((res) => {
        setTransactions(res.data.data || []);
        console.log("✅ Transactions:", res.data.data);
      })
      .catch((err) => {
        console.error("❌ Error fetching transactions:", err);
        message('Invoice data not found', 'info');
      });
  }, [paymentId]);

  // --- Fetch payment details ---
  useEffect(() => {
    if (!paymentId) return;
    console.log("🔍 Fetching payments...");
    api.post('/payments/getPaymentsData', { payments_id: paymentId })
      .then((res) => {
        setPayments(res.data.data || []);
        console.log("✅ Payments:", res.data.data);
      })
      .catch((err) => {
        console.error("❌ Error fetching payments:", err);
        message('Payments data not found', 'info');
      });
  }, [paymentId]);

  // --- Generate PDF ---
  useEffect(() => {
    if (!paymentId || !supplier.company_name || !hfdata.length) {
      console.warn("⚠️ Missing data, skipping PDF generation", { paymentId, supplier, hfdata });
      return;
    }

    try {
      console.log("📄 Generating PDF...");

      // Build transaction table
      const transactionTable = [
        [
          { text: 'Tran Type', style: 'tableHead' },
          { text: 'Invoice No', style: 'tableHead' },
          { text: 'Invoice Date', style: 'tableHead' },
          { text: 'Total Amount', style: 'tableHead', alignment: 'right' },
        ],
      ];
      transactions.forEach((t) => {
        transactionTable.push([
          { text: t.tran_type || '', style: 'tableBody' },
          { text: t.tran_no || '', style: 'tableBody' },
          { text: t.tran_date ? moment(t.tran_date).format('DD/MM/YYYY') : '', style: 'tableBody' },
          { text: (t.net_total || 0).toFixed(2), style: 'tableBody', alignment: 'right' },
        ]);
      });

      // Build payments table
      const paymentTable = [
        [
          { text: 'Paymode Name', style: 'tableHead' },
          { text: 'Paid Amount', style: 'tableHead', alignment: 'right' },
          { text: 'Cheque Date', style: 'tableHead' },
          { text: 'Cheque No', style: 'tableHead' },
          { text: 'Bank Name', style: 'tableHead' },
        ],
      ];
      payments.forEach((p) => {
        paymentTable.push([
          { text: p.paymode_id || '', style: 'tableBody' },
          { text: (p.paid_amount || 0).toFixed(2), style: 'tableBody', alignment: 'right' },
          { text: p.cheque_date ? moment(p.cheque_date).format('DD/MM/YYYY') : '', style: 'tableBody' },
          { text: p.payment_no || '', style: 'tableBody' },
          { text: p.gl_name || '', style: 'tableBody' },
        ]);
      });

      // Use first payment for header info
      const mainPayment = payments[0] || {};

      // PDF definition
      const dd = {
        pageSize: 'A4',
        header: PdfHeader({ findCompany }),
        footer: PdfFooter,
        pageMargins: [40, 120, 40, 80],
        content: [
          {
            columns: [
              {
                width: '*',
                text: `${findCompany('company_name')}
${findCompany('company_address')}
Website: ${findCompany('company_website')} | Email: ${findCompany('company_email')}
Tel: ${findCompany('company_phone')}`,
                fontSize: 10,
              },
              {
                width: 'auto',
                stack: [
                  { text: 'Payment Voucher', bold: true, fontSize: 14, alignment: 'right' },
                  { text: `Payment No: ${mainPayment.payment_no || ''}`, fontSize: 10, alignment: 'right' },
                  { text: `Payment Date: ${mainPayment.payment_date ? moment(mainPayment.payment_date).format('DD/MM/YYYY') : ''}`, fontSize: 10, alignment: 'right' },
                ],
              },
            ],
          },
          '\n',
          {
            text: `${supplier.company_name || ''}
${supplier.address_flat || ''}
${supplier.address_street || ''}
${supplier.address_po_code || ''}
${supplier.address_country || ''}`,
            fontSize: 10,
          },
          '\n',
          { table: { headerRows: 1, widths: ['25%', '25%', '25%', '25%'], body: transactionTable } },
          '\n',
          { table: { headerRows: 1, widths: ['20%', '20%', '20%', '20%', '20%'], body: paymentTable } },
        ],
        styles: {
          tableHead: { fillColor: '#eaf2f5', bold: true, fontSize: 10 },
          tableBody: { fontSize: 10 },
        },
      };

      // ✅ Open in a new tab
     pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.createPdf(dd, null, null, pdfFonts.pdfMake.vfs).open();

      if (onClose) {
        console.log("🔒 Closing after PDF generation...");
        onClose();
      }
    } catch (err) {
      console.error("❌ Error generating PDF:", err);
    }
  }, [paymentId, supplier, transactions, payments, hfdata, onClose]);

   return (
    <a  onClick={PaymentsPrintPdf} >
      Print Packing List
    </a>
  );
};

export default PaymentsPrintPdf;
