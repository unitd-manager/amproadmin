import PropTypes from 'prop-types';
import moment from 'moment';

const GetPageinPdf = (invoiceCode) => (currentPage, pageCount) => {
  return {
    columns: [
      {
        text: `Print date: ${moment().format('DD-MM-YYYY hh:mm A')} | Page ${currentPage} / ${pageCount}`,
        alignment: 'left',
        fontSize: 9,
      },
      {
        text: `Invoice: ${invoiceCode || 'N/A'}`,
        alignment: 'right',
        fontSize: 9,
      },
    ],
    margin: [40, 10, 40, 0], // left, top, right, bottom
  };
};

GetPageinPdf.propTypes = {
  invoiceCode: PropTypes.string,
};

export default GetPageinPdf;
