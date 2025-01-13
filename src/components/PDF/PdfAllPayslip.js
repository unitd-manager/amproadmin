import React, { useState, useEffect } from 'react';
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Button } from 'reactstrap';
import moment from 'moment';
import PropTypes from 'prop-types';
import api from '../../constants/api';
import PdfFooter from './PdfFooter';
import PdfHeader from './PdfHeader';

const PdfPaySlip = ({ payrollsYear, payrollsMonth }) => {
  PdfPaySlip.propTypes = {
    payrollsYear: PropTypes.any,
    payrollsMonth: PropTypes.any,
  };
  const [hfdata, setHeaderFooterData] = useState();
  const [payrollss, setPayrolls] = useState([]);

  useEffect(() => {
    api.get('/setting/getSettingsForCompany').then((res) => {
      setHeaderFooterData(res.data.data);
    });
  }, []);

  const findCompany = (key) => {
    const filteredResult = hfdata.find((e) => e.key_text === key);
    return filteredResult.value;
  };
  // console.log('payrollsYear',payrollsYear)
  //  console.log('payrollsMonth',payrollsMonth)
  const getPayslip = () => {
    api
      .post('/PayrollManagement/getpayrollmanagementFilterYearMonth', {
        month: payrollsMonth,
        year: payrollsYear,
      })
      .then((res) => {
        setPayrolls(res.data.data);
      })
      .catch(() => {
        // Handle error
      });
  };

  useEffect(() => {
    getPayslip();
  }, []);

  const generatePayslipPdf = (payrolls) => {
    const contents = [];
    payrolls.forEach((payroll) => {
      contents.push(
        [{
          layout: {
            defaultBorder: false,
            hLineWidth: () => {
              return 1;
            },
            vLineWidth: () => {
              return 1;
            },
            hLineColor: (i) => {
              if (i === 1 || i === 0) {
                return '#bfdde8';
              }
              return '#eaeaea';
            },
            vLineColor: () => {
              return '#eaeaea';
            },
            hLineStyle: () => {
              return null;
            },
            paddingLeft: () => {
              return 10;
            },
            paddingRight: () => {
              return 10;
            },
            paddingTop: () => {
              return 2;
            },
            paddingBottom: () => {
              return 2;
            },
            fillColor: () => {
              return '#fff';
            },
          },
          table: {
            headerRows: 1,
            widths: ['101%'],

            body: [
              [
                {
                  text: `~PAY SLIP~`,
                  alignment: 'center',
                  style: 'tableHead',
                },
              ],
            ],
          },
        },
        '\n\n\n',

        {
          layout: {
            defaultBorder: false,
            hLineWidth: () => {
              return 1;
            },
            vLineWidth: () => {
              return 1;
            },
            hLineColor: (i) => {
              if (i === 1 || i === 0) {
                return '#bfdde8';
              }
              return '#eaeaea';
            },
            vLineColor: () => {
              return '#eaeaea';
            },
            hLineStyle: () => {
              return null;
            },
            paddingLeft: () => {
              return 10;
            },
            paddingRight: () => {
              return 10;
            },
            paddingTop: () => {
              return 2;
            },
            paddingBottom: () => {
              return 2;
            },
            fillColor: () => {
              return '#fff';
            },
          },
          table: {
            headerRows: 1,
            widths: ['105%', '51%'],

            body: [
              [
                {
                  text: 'Name of the Employee',
                  alignment: 'left',
                  style: 'tableHead',
                },
              ],
              [
                {
                  text: `${payroll.employee_name ? payroll.employee_name : ''}`,
                  alignment: 'left',
                  style: 'tableBody',
                },
              ],
            ],
          },
        },

        {
          layout: {
            defaultBorder: false,
            hLineWidth: () => {
              return 1;
            },
            vLineWidth: () => {
              return 1;
            },
            hLineColor: (i) => {
              if (i === 1 || i === 0) {
                return '#bfdde8';
              }
              return '#eaeaea';
            },
            vLineColor: () => {
              return '#eaeaea';
            },
            hLineStyle: () => {
              return null;
            },
            paddingLeft: () => {
              return 10;
            },
            paddingRight: () => {
              return 10;
            },
            paddingTop: () => {
              return 2;
            },
            paddingBottom: () => {
              return 2;
            },
            fillColor: () => {
              return '#fff';
            },
          },
          table: {
            headerRows: 1,
            widths: ['105%', '51%'],

            body: [
              [
                {
                  text: 'NRIC No',
                  alignment: 'left',
                  style: 'tableHead',
                },
              ],
              [
                {
                  text: `${payroll.nric_no ? payroll.nric_no : ''}`,
                  alignment: 'left',
                  style: 'tableBody',
                },
              ],
            ],
          },
        },

        {
          layout: {
            defaultBorder: false,
            hLineWidth: () => {
              return 1;
            },
            vLineWidth: () => {
              return 1;
            },
            hLineColor: (i) => {
              if (i === 1 || i === 0) {
                return '#bfdde8';
              }
              return '#eaeaea';
            },
            vLineColor: () => {
              return '#eaeaea';
            },
            hLineStyle: () => {
              return null;
            },
            paddingLeft: () => {
              return 10;
            },
            paddingRight: () => {
              return 10;
            },
            paddingTop: () => {
              return 2;
            },
            paddingBottom: () => {
              return 2;
            },
            fillColor: () => {
              return '#fff';
            },
          },
          table: {
            headerRows: 1,
            widths: ['51%', '50%'],

            body: [
              [
                {
                  text: 'Item',
                  style: 'tableHead',
                },

                {
                  text: 'Amount S$',
                  style: 'tableHead',
                },
              ],

              [
                {
                  text: `Basic Pay`,
                  border: [false, false, false, true],
                  style: 'tableBody',
                },
                {
                  border: [false, false, false, true],
                  text: `${payroll.basic_pay?payroll.basic_pay.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                  }):0.00}`,
                  fillColor: '#f5f5f5',
                  style: 'tableBody',
                },
              ],

              [
                {
                  text: 'Gross Pay ',
                  border: [false, false, false, true],
                  style: 'tableBody',
                },

                {
                  text: `${payroll.basic_pay?payroll.basic_pay.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                  }):0.00}                                                             (A)`,
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  style: 'tableBody',
                },
              ],
              [
                {
                  text: 'Total Allowance(Breakdown shown below)',
                  border: [false, false, false, true],
                  style: 'tableBody',
                },

                {
                  text: `${
                    payroll.total_basic_pay_for_month ? payroll.total_basic_pay_for_month : ''
                  }                                                               (B)`,
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  style: 'tableBody',
                },
              ],
              [
                {
                  text: 'Transport',
                  border: [false, false, false, true],
                  style: 'tableBody',
                },

                {
                  text: `${payroll.allowance1?payroll.allowance1.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                  }):0.00}`,
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  style: 'tableBody',
                },
              ],
              [
                {
                  text: 'Entertainment',
                  border: [false, false, false, true],
                  style: 'tableBody',
                },

                {
                  text: `${payroll.allowance2?payroll.allowance2.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                  }):0.00}`,
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  style: 'tableBody',
                },
              ],
              [
                {
                  text: 'Food',
                  border: [false, false, false, true],
                  style: 'tableBody',
                },

                {
                  text: `${payroll.allowance3?payroll.allowance3.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                  }):0.00}`,
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  style: 'tableBody',
                },
              ],
              [
                {
                  text: 'Shift Allowance',
                  border: [false, false, false, true],
                  style: 'tableBody',
                },

                {
                  text: `${payroll.allowance4?payroll.allowance4.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                  }):0.00}`,
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  style: 'tableBody',
                },
              ],
              [
                {
                  text: 'Others',
                  border: [false, false, false, true],
                  style: 'tableBody',
                },

                {
                  text: `${payroll.allowance5?payroll.allowance5.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                  }):0.00 }`,
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  style: 'tableBody',
                },
              ],
              [
                {
                  text: 'Total Deductions(Breakdown shown below)',
                  border: [false, false, false, true],
                  style: 'tableBody',
                },

                {
                  text: `${
                    payroll.total_deductions ? payroll.total_deductions : ''
                  }                                                               (C)`,
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  style: 'tableBody',
                },
              ],
              [
                {
                  text: 'Employees CPF deduction',
                  border: [false, false, false, true],
                  style: 'tableBody',
                },

                {
                  text: `${payroll.cpf_employee?payroll.cpf_employee.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                  }):0.00}`,
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  style: 'tableBody',
                },
              ],
              [
                {
                  text: 'SDL',
                  border: [false, false, false, true],
                  style: 'tableBody',
                },

                {
                  text: `${payroll.sdl?payroll.sdl.toLocaleString('en-IN', { minimumFractionDigits: 2 }):0.00}`,
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  style: 'tableBody',
                },
              ],
              [
                {
                  text: 'Advance/Loan',
                  border: [false, false, false, true],
                  style: 'tableBody',
                },

                {
                  text: `${payroll.loan_deduction ? payroll.loan_deduction : ''}`,
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  style: 'tableBody',
                },
              ],
              [
                {
                  text: 'Housing',
                  border: [false, false, false, true],
                  style: 'tableBody',
                },

                {
                  text: `${payroll.deduction1?payroll.deduction1.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                  }):0.00}`,
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  style: 'tableBody',
                },
              ],
              [
                {
                  text: 'Transportation',
                  border: [false, false, false, true],
                  style: 'tableBody',
                },

                {
                  text: `${payroll.deduction2?payroll.deduction2.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                  }):0.00}`,
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  style: 'tableBody',
                },
              ],
              [
                {
                  text: 'Others',
                  border: [false, false, false, true],
                  style: 'tableBody',
                },

                {
                  text: `${payroll.deduction3?payroll.deduction3.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                  }):0.00}`,
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  style: 'tableBody',
                },
              ],
              [
                {
                  text: 'Food',
                  border: [false, false, false, true],
                  style: 'tableBody',
                },

                {
                  text: `${payroll.deduction4?payroll.deduction4.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                  }):0.00}`,
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  style: 'tableBody',
                },
              ],
            ],
          },
        },

        {
          layout: {
            defaultBorder: false,
            hLineWidth: () => {
              return 1;
            },

            hLineColor: (i) => {
              if (i === 1 || i === 0) {
                return '#bfdde8';
              }
              return '#eaeaea';
            },

            hLineStyle: () => {
              return null;
            },
            paddingLeft: () => {
              return 10;
            },
            paddingRight: () => {
              return 10;
            },
            paddingTop: () => {
              return 2;
            },
            paddingBottom: () => {
              return 2;
            },
            fillColor: () => {
              return '#fff';
            },
          },
          table: {
            headerRows: 1,
            widths: ['105%', '41%'],

            body: [
              [
                {
                  text: 'Date of Payment',
                  alignment: 'left',
                  style: 'tableHead',
                },
              ],
            ],
          },
        },
        '\n',
        {
          columns: [
            {
              text: ` Date:  ${
                moment(payroll.generated_date).format('DD-MM-YYYY')
                  ? moment(payroll.generated_date).format('DD-MM-YYYY')
                  : ''
              } `,
              margin: [10, 0, 0, 0],
              style: ['notesText', 'textSize'],
            },
          ],
        },
        '\n',
        {
          layout: {
            defaultBorder: false,
            hLineWidth: () => {
              return 1;
            },
            vLineWidth: () => {
              return 1;
            },
            hLineColor: (i) => {
              if (i === 1 || i === 0) {
                return '#bfdde8';
              }
              return '#eaeaea';
            },
            vLineColor: () => {
              return '#eaeaea';
            },
            hLineStyle: () => {
              return null;
            },
            paddingLeft: () => {
              return 10;
            },
            paddingRight: () => {
              return 10;
            },
            paddingTop: () => {
              return 2;
            },
            paddingBottom: () => {
              return 2;
            },
            fillColor: () => {
              return '#fff';
            },
          },
          table: {
            headerRows: 1,
            widths: ['105%', '51%'],

            body: [
              [
                {
                  text: 'Mode of Payment',
                  alignment: 'left',
                  style: 'tableHead',
                },
              ],
              [
                {
                  text: `${payroll.mode_of_payment ? payroll.mode_of_payment : ''}`,
                  alignment: 'left',
                  style: 'tableBody',
                  border: [false, false, false, true],
                },
              ],
            ],
          },
        },
        {
          layout: {
            defaultBorder: false,
            hLineWidth: () => {
              return 1;
            },
            vLineWidth: () => {
              return 1;
            },
            hLineColor: (i) => {
              if (i === 1 || i === 0) {
                return '#bfdde8';
              }
              return '#eaeaea';
            },
            vLineColor: () => {
              return '#eaeaea';
            },
            hLineStyle: () => {
              return null;
            },
            paddingLeft: () => {
              return 10;
            },
            paddingRight: () => {
              return 10;
            },
            paddingTop: () => {
              return 2;
            },
            paddingBottom: () => {
              return 2;
            },
            fillColor: () => {
              return '#fff';
            },
          },
          table: {
            headerRows: 1,
            widths: ['51%', '50%'],

            body: [
              [
                {
                  text: 'Overtime Details*',
                  style: 'tableHead',
                },
                {
                  text: '',
                  style: 'tableHead',
                },
              ],
              [
                {
                  text: 'Overtime Payment Period(s)',
                  border: [false, false, false, true],
                  style: 'tableBody',
                },
                {
                  text: `  ${
                    moment(payroll.payslip_start_date).format('DD-MM-YYYY')
                      ? moment(payroll.payslip_start_date).format('DD-MM-YYYY')
                      : ''
                  }   TO   ${
                    moment(payroll.payslip_end_date).format('DD-MM-YYYY')
                      ? moment(payroll.payslip_end_date).format('DD-MM-YYYY')
                      : ''
                  } `,

                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  style: 'tableBody',
                },
              ],
              [
                {
                  text: 'Overtime Hours Worked',
                  border: [false, false, false, true],
                  style: 'tableBody',
                },
                {
                  text: ` ${payroll.ot_hours ? payroll.ot_hours : ''}`,
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  style: 'tableBody',
                },
              ],
              [
                {
                  text: 'Total Overtime Pay',
                  border: [false, false, false, true],
                  style: 'tableBody',
                },
                {
                  text: ` ${
                    payroll.ot_amount ? payroll.ot_amount : ''
                  }                                                     (D)`,
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  style: 'tableBody',
                },
              ],
            ],
          },
        },
        {
          layout: {
            defaultBorder: false,
            hLineWidth: () => {
              return 1;
            },
            vLineWidth: () => {
              return 1;
            },
            hLineColor: (i) => {
              if (i === 1 || i === 0) {
                return '#bfdde8';
              }
              return '#eaeaea';
            },
            vLineColor: () => {
              return '#eaeaea';
            },
            hLineStyle: () => {
              return null;
            },
            paddingLeft: () => {
              return 10;
            },
            paddingRight: () => {
              return 10;
            },
            paddingTop: () => {
              return 2;
            },
            paddingBottom: () => {
              return 2;
            },
            fillColor: () => {
              return '#fff';
            },
          },
          table: {
            headerRows: 1,
            widths: ['51%', '50%'],

            body: [
              [
                {
                  text: 'Item',
                  style: 'tableHead',
                },

                {
                  text: 'Amount S$',
                  style: 'tableHead',
                },
              ],
              [
                {
                  text: `Other Additional Payment(Breakdown Shown below)
                    Reimbursement  \n Director Fees `,
                  border: [false, false, false, true],
                  style: 'tableBody',
                },

                {
                  text: ` \n ${payroll.reimbursement ? payroll.reimbursement : ''} \n  ${
                    payroll.director_fee ? payroll.director_fee : ''
                  } `,
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  style: 'tableBody',
                },
              ],

              [
                {
                  text: 'NetPay(A+B-C+D+E)',
                  border: [false, false, false, true],
                  style: 'tableBody',
                },

                {
                  text: ` ${payroll.net_total ? payroll.net_total : ''}`,
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  style: 'tableBody',
                },
              ],
            ],
          },
        },
        {
          layout: {
            defaultBorder: false,
            hLineWidth: () => {
              return 1;
            },
            vLineWidth: () => {
              return 1;
            },
            hLineColor: (i) => {
              if (i === 1 || i === 0) {
                return '#bfdde8';
              }
              return '#eaeaea';
            },
            vLineColor: () => {
              return '#eaeaea';
            },
            hLineStyle: () => {
              return null;
            },
            paddingLeft: () => {
              return 10;
            },
            paddingRight: () => {
              return 10;
            },
            paddingTop: () => {
              return 2;
            },
            paddingBottom: () => {
              return 2;
            },
            fillColor: () => {
              return '#fff';
            },
          },
          table: {
            headerRows: 1,
            widths: ['51%', '50%'],

            body: [
              [
                {
                  text: 'CPF Details',
                  style: 'tableHead',
                },
                {
                  text: '',
                  style: 'tableHead',
                },
              ],
              [
                {
                  text: 'Employers Contribution',
                  border: [false, false, false, true],
                  style: 'tableBody',
                },

                {
                  text: `${payroll.cpf_employer ? payroll.cpf_employer : ''}`,
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  style: 'tableBody',
                },
              ],
              [
                {
                  text: 'Employee Contribution',
                  border: [false, false, false, true],
                  style: 'tableBody',
                },

                {
                  text: `${payroll.cpf_employee ? payroll.cpf_employee : ''}`,
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  style: 'tableBody',
                },
              ],
            ],
          },
        },
        '\n',
        '\n',
        {
          stack: [
            '\n\n',

            {
              canvas: [
                {
                  type: 'line',
                  margin: [0, 50, -150, 0],
                  x1: 0,
                  y1: 0,
                  x2: 150,
                  y2: 0,
                  lineWidth: 1,
                },
              ],
            },
            '\n',
            {
              text: `Signature of Employee`,
              fontSize: 10,
              style: ['textSize'],
              margin: [0, 0, 0, 0],
            },
          ],
        },
        '\n',
        '\n',
        {
          width: '100%',
          alignment: 'center',
          text: '',
          bold: true,
          margin: [0, 10, 0, 10],
          fontSize: 12,
        },
     ],) }
    
);
    const dd = {
      pageSize: 'A4',
      header: PdfHeader({ findCompany }),
      pageMargins: [40, 180, 40, 80],
      footer: PdfFooter,
      content: contents,

      margin: [0, 50, 50, 50],

      styles:  {
        logo: {
          margin: [-20, 20, 0, 0],
        },
        address: {
          margin: [-10, 20, 0, 0],
        },
        invoice: {
          margin: [0, 30, 0, 10],
          alignment: 'right',
        },
        invoiceAdd: {
          alignment: 'right',
        },
        textSize: {
          fontSize: 10,
        },
        notesTitle: {
          bold: true,
          margin: [0, 50, 0, 3],
        },
        tableHead: {
          border: [false, true, false, true],
          fillColor: '#eaf2f5',
          margin: [0, 5, 0, 5],
          fontSize: 10,
          bold: 'true',
        },
        tableBody: {
          border: [false, false, false, true],
          margin: [0, 5, 0, 5],
          alignment: 'left',
          fontSize: 10,
        },
        tableBody1: {
          border: [false, false, false, true],
          margin: [20, 5, 0, 5],
          alignment: 'left',
          fontSize: 10,
        },
      },
      defaultStyle: {
        columnGap: 20,
      },
    };
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    const pdfDocGenerator = pdfMake.createPdf(dd, null, null, pdfFonts.pdfMake.vfs);

    pdfDocGenerator.getDataUrl((dataUrl) => {
      const downloadLink = document.createElement('a');
      downloadLink.href = dataUrl;
      downloadLink.download = `pdf-Allpayslip.pdf`;
      downloadLink.click();
    });
  };

  const handleGenerateAllPdfs = () => {
    generatePayslipPdf(payrollss);
  };

  return (
    <>
      <Button type="button" className="btn btn-primary mr-2" onClick={handleGenerateAllPdfs}>
        Generate PDFs
      </Button>
    </>
  );
};
export default PdfPaySlip;
