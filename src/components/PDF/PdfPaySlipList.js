import React from 'react';
import { Link } from 'react-router-dom';
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import moment from 'moment';
import PropTypes from 'prop-types';
import api from '../../constants/api';
import PdfFooter from './PdfFooter';
import PdfHeader from './PdfHeader';

const PdfPaySlipList = ({ payroll }) => {
  PdfPaySlipList.propTypes = {
    payroll: PropTypes.any,
  };
  // const { id } = useParams();
  //   const [hfdata, setHeaderFooterData] = React.useState();
  // const [payroll, setPayroll] = React.useState();
  const [hfdata, setHeaderFooterData] = React.useState();
  console.log('payroll', payroll);
  React.useEffect(() => {
    api.get('/setting/getSettingsForCompany').then((res) => {
      setHeaderFooterData(res.data.data);
      console.log(res.data);
    });
  }, []);

  const findCompany = (key) => {
    const filteredResult = hfdata.find((e) => e.key_text === key);
    return filteredResult.value;
  };

  //   const findCompany = (key) => {
  //     const filteredResult = hfdata.find((e) => e.key_text === key);
  //     return filteredResult.value;
  //   };
  // Gettind data from Job By Id
  // const getPayslip = () => {
  //   api
  //     .post('/PayrollManagement/getpayrollmanagementById', { payroll_management_id: id })
  //     .then((res) => {
  //       setPayroll(res.data.data[0]);
  //     })
  //     .catch(() => {
  //       message('payroll Data Not Found', 'info');
  //     });
  // };

  // React.useEffect(() => {
  //   getPayslip();
  // }, []);

  const GetPdf = () => {
    const dd = {
      pageSize: 'A4',
      header: PdfHeader({ findCompany }),
      pageMargins: [40, 150, 40, 80],
      footer: PdfFooter,
      content: [
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
                  text: `${
                    payroll.basic_pay
                      ? payroll.basic_pay.toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                        })
                      : 0.0
                  }`,
                  fillColor: '#f5f5f5',
                  style: 'tableBody',
                  alignment: 'right',
                  margin: [0, 0, 170, 0],
                },
              ],

              [
                {
                  text: 'Gross Pay ',
                  border: [false, false, false, true],
                  style: 'tableBody',
                },

                {
                  text: `${
                    payroll.total_basic_pay_for_month
                      ? payroll.total_basic_pay_for_month.toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                        })
                      : 0.0
                  }                                                             `,
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  style: 'tableBody',
                  alignment: 'right',
                  margin: [0, 0, 170, 0],
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
                    payroll.total_allowance
                      ? payroll.total_allowance.toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                        })
                      : 0.0
                  }                                                              `,
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  style: 'tableBody',
                  alignment: 'right',
                  margin: [0, 0, 170, 0],
                },
              ],
              [
                {
                  text: 'Transport',
                  border: [false, false, false, true],
                  style: 'tableBody',
                },

                {
                  text: `${
                    payroll.allowance1
                      ? payroll.allowance1.toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                        })
                      : 0.0
                  }`,
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  style: 'tableBody',
                  alignment: 'right',
                  margin: [0, 0, 170, 0],
                },
              ],
              [
                {
                  text: 'Entertainment',
                  border: [false, false, false, true],
                  style: 'tableBody',
                },

                {
                  text: `${
                    payroll.allowance2
                      ? payroll.allowance2.toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                        })
                      : 0.0
                  }`,
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  style: 'tableBody',
                  alignment: 'right',
                  margin: [0, 0, 170, 0],
                },
              ],

              [
                {
                  text: 'Food',
                  border: [false, false, false, true],
                  style: 'tableBody',
                },

                {
                  text: `${
                    payroll.allowance3
                      ? payroll.allowance3.toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                        })
                      : 0.0
                  }`,
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  style: 'tableBody',
                  alignment: 'right',
                  margin: [0, 0, 170, 0],
                },
              ],
              [
                {
                  text: 'Shift Allowance',
                  border: [false, false, false, true],
                  style: 'tableBody',
                },

                {
                  text: `${
                    payroll.allowance4
                      ? payroll.allowance4.toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                        })
                      : 0.0
                  }`,
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  style: 'tableBody',
                  alignment: 'right',
                  margin: [0, 0, 170, 0],
                },
              ],
              [
                {
                  text: 'Others',
                  border: [false, false, false, true],
                  style: 'tableBody',
                },

                {
                  text: `${
                    payroll.allowance5
                      ? payroll.allowance5.toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                        })
                      : 0.0
                  }`,
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  style: 'tableBody',
                  alignment: 'right',
                  margin: [0, 0, 170, 0],
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
                    payroll.total_deductions
                      ? payroll.total_deductions.toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                        })
                      : 0.0
                  }                                                            `,
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  style: 'tableBody',
                  alignment: 'right',
                  margin: [0, 0, 170, 0],
                },
              ],
              [
                {
                  text: 'Employees CPF deduction',
                  border: [false, false, false, true],
                  style: 'tableBody',
                },

                {
                  text: `${
                    payroll.cpf_employee
                      ? payroll.cpf_employee.toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                        })
                      : 0.0
                  }`,
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  style: 'tableBody',
                  alignment: 'right',
                  margin: [0, 0, 170, 0],
                },
              ],
              [
                {
                  text: 'SDL',
                  border: [false, false, false, true],
                  style: 'tableBody',
                },

                {
                  text: `${
                    payroll.sdl
                      ? payroll.sdl.toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                        })
                      : 0.0
                  }`,
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  style: 'tableBody',
                  alignment: 'right',
                  margin: [0, 0, 170, 0],
                },
              ],
              [
                {
                  text: 'Advance/Loan',
                  border: [false, false, false, true],
                  style: 'tableBody',
                },

                {
                  text: `${
                    payroll.loan_amount
                      ? payroll.loan_amount.toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                        })
                      : 0.0
                  }`,
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  style: 'tableBody',
                  alignment: 'right',
                  margin: [0, 0, 170, 0],
                },
              ],
              [
                {
                  text: 'Housing',
                  border: [false, false, false, true],
                  style: 'tableBody',
                },

                {
                  text: `${
                    payroll.deduction1
                      ? payroll.deduction1.toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                        })
                      : 0.0
                  }`,
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  style: 'tableBody',
                  alignment: 'right',
                  margin: [0, 0, 170, 0],
                },
              ],
              [
                {
                  text: 'Transportation',
                  border: [false, false, false, true],
                  style: 'tableBody',
                },

                {
                  text: `${
                    payroll.deduction2
                      ? payroll.deduction2.toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                        })
                      : 0.0
                  }`,
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  style: 'tableBody',
                  alignment: 'right',
                  margin: [0, 0, 170, 0],
                },
              ],
              [
                {
                  text: 'Others',
                  border: [false, false, false, true],
                  style: 'tableBody',
                },

                {
                  text: `${
                    payroll.deduction3
                      ? payroll.deduction3.toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                        })
                      : 0.0
                  }`,
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  style: 'tableBody',
                  alignment: 'right',
                  margin: [0, 0, 170, 0],
                },
              ],
              [
                {
                  text: 'Food',
                  border: [false, false, false, true],
                  style: 'tableBody',
                },

                {
                  text: `${
                    payroll.deduction4
                      ? payroll.deduction4.toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                        })
                      : 0.0
                  }`,
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  style: 'tableBody',
                  alignment: 'right',
                  margin: [0, 0, 170, 0],
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
                  text: ` ${
                    payroll.ot_hours
                      ? payroll.ot_hours.toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                        })
                      : 0.0
                  }`,
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  style: 'tableBody',
                  alignment: 'right',
                  margin: [0, 0, 170, 0],
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
                    payroll.ot_amount
                      ? payroll.ot_amount.toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                        })
                      : 0.0
                  }                                                     `,
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  style: 'tableBody',
                  alignment: 'right',
                  margin: [0, 0, 170, 0],
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
                  alignment: 'center',
                  margin: [0, 0, 150, 0],
                },
              ],
              [
                {
                  text: `Other Additional Payment(Breakdown Shown below)
                  \n Reimbursement  \n\n Director Fees `,
                  border: [false, false, false, true],
                  style: 'tableBody',
                },

                {
                  text: ` \n\n ${
                    payroll.reimbursement
                      ? payroll.reimbursement.toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                        })
                      : 0.0
                  } \n\n  ${
                    payroll.director_fee
                      ? payroll.director_fee.toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                        })
                      : 0.0
                  } `,
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  style: 'tableBody',
                  alignment: 'right',
                  margin: [0, 0, 170, 0],
                },
              ],

              [
                {
                  text: 'NetPay(A+B-C+D+E)',
                  border: [false, false, false, true],
                  style: 'tableBody',
                },

                {
                  text: ` ${
                    payroll.net_total
                      ? payroll.net_total.toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                        })
                      : 0.0
                  }`,
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  style: 'tableBody',
                  alignment: 'right',
                  margin: [0, 0, 170, 0],
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
                  text: `${
                    payroll.cpf_employer
                      ? payroll.cpf_employer.toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                        })
                      : 0.0
                  }`,
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  style: 'tableBody',
                  alignment: 'right',
                  margin: [0, 0, 170, 0],
                },
              ],
              [
                {
                  text: 'Employee Contribution',
                  border: [false, false, false, true],
                  style: 'tableBody',
                },

                {
                  text: `${
                    payroll.cpf_employee
                      ? payroll.cpf_employee.toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                        })
                      : 0.0
                  }`,
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  style: 'tableBody',
                  alignment: 'right',
                  margin: [0, 0, 170, 0],
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
          text: 'PAYSLIP CREATED',
          bold: true,
          margin: [0, 10, 0, 10],
          fontSize: 12,
        },
      ],
      margin: [0, 50, 50, 50],

      styles: {
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
    pdfMake.createPdf(dd, null, null, pdfFonts.pdfMake.vfs).open();
  };

  return (
    <>
      <Link to="" onClick={GetPdf}>
        Print PaySlip
      </Link>
    </>
  );
};

export default PdfPaySlipList;
