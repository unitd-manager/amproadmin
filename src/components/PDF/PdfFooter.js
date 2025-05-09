

const PdfFooter = (currentPage, pageCount) => {
  return {
    columns: [
      {
        text: `Page ${currentPage} of ${pageCount}`,
        alignment: 'right',
        fontSize: 9,
        margin: [0, 0, 40, 0],
      },
    ],
    margin: [40, 10],
  };
};

export default PdfFooter;
