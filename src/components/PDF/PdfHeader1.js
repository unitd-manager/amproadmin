import moment from 'moment';

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
          text: 'Sales Order Packing List',
          fontSize: 11,
          bold: true,
        },
         {
          text: `Page No : ${currentPage} / ${pageCount}`,
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

export default PdfHeader;
