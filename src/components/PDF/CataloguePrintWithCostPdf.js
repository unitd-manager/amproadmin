import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import api from '../../constants/api'; // Ensure this is correctly set

const CataloguePrintWithCostPdf = ({ catalogueId, printOption }) => {
  const [products, setProducts] = useState([]);
  const baseURL = 'https://amproadmin.zaitunsoftsolutions.com'; // Moved here for scope

  CataloguePrintWithCostPdf.propTypes = {
    catalogueId: PropTypes.number.isRequired,
    printOption: PropTypes.string.isRequired,
  };

  // Fetch products
  useEffect(() => {
    if (catalogueId) {
      api
        .get(`/catalogue/getCatalogueProduct/${catalogueId}`)
        .then((res) => {
          const data = res.data.data || [];
          setProducts(data);
        })
        .catch((error) => {
          console.error('Failed to fetch catalogue products:', error);
        });
    }
  }, [catalogueId]);

  // Convert image URL to base64
  const loadImageToBase64 = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous'; // important for CORS
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => {
        console.error('Image load failed (workaround)');
        resolve(null);
      };
      img.src = url;
    });
  };


  // Generate PDF
  const generatePdf = async () => {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    const productContent = await Promise.all(
      products.map(async (item) => {
        // Use the backend proxy to fetch images and avoid CORS issues
        const imageUrl = item.file_name
          ? `https://amproadmin.zaitunsoftsolutions.com:2002/image-proxy?url=${encodeURIComponent(`${baseURL}/storage/uploads/${item.file_name}`)}`
          : null;
        const imageBase64 = imageUrl ? await loadImageToBase64(imageUrl) : null;

        const priceDetails = [];

        if (["Print With Price", "Print With Retail Price", "Print With Stock"].includes(printOption)) {
          priceDetails.push({ text: `RPrice : $${typeof item.rprice === 'number' ? item.rprice.toFixed(2) : Number(item.rprice) ? Number(item.rprice).toFixed(2) : '0.00'}`, style: 'priceText' });
        }
        if (["Print With Price", "Print With Stock"].includes(printOption)) {
          priceDetails.push({ text: `CPrice : $${typeof item.cprice === 'number' ? item.cprice.toFixed(2) : Number(item.cprice) ? Number(item.cprice).toFixed(2) : '0.00'}`, style: 'priceText' });
          priceDetails.push({ text: `WPrice : $${typeof item.wprice === 'number' ? item.wprice.toFixed(2) : Number(item.wprice) ? Number(item.wprice).toFixed(2) : '0.00'}`, style: 'priceText' });
        }
        if (printOption === 'Print With Stock') {
          priceDetails.push({ text: `Stock : ${item.stock || 'N/A'}`, style: 'priceText' });
        }

        return {
          width: '33%',
          margin: [5, 5, 5, 5],
          stack: [
            { text: item.title || '', style: 'productName', alignment: 'center', margin: [0, 5, 0, 5] },
            {
              columns: [
                {
                  width: 'auto',
                  ...(imageBase64
                    ? { image: imageBase64, fit: [80, 80] }
                    : { text: 'No Image', color: 'gray', italics: true, fontSize: 8 }),
                  alignment: 'center',
                },
                {
                  width: '*',
                  stack: [
                    { text: `Product Code: ${item.product_code || ''}`, style: 'productDetail' },
                    { text: `UOM : ${item.unit || 'N/A'}`, style: 'productDetail' },
                    ...priceDetails,
                  ],
                },
              ],
              columnGap: 10,
            },
          ],
        };
      })
    );

    // Split into rows of 3 columns
    const rows = [];
    for (let i = 0; i < productContent.length; i += 3) {
      rows.push({
        columns: productContent.slice(i, i + 3),
        columnGap: 10,
        margin: [0, 0, 0, 10],
      });
    }

    const docDefinition = {
      pageSize: 'A4',
      pageMargins: [20, 80, 20, 40],

      header(currentPage, pageCount) {
        return {
          columns: [
            { text: 'AMPRO PTE LTD\nBLOCK B #02-01, 31 PENJURU LANE\nSINGAPORE 609198', fontSize: 10, margin: [20, 20, 0, 0] },
            { text: `Page: ${currentPage}/${pageCount}\nDate: ${new Date().toLocaleDateString('en-GB')}`, alignment: 'right', fontSize: 10, margin: [0, 20, 20, 0] },
          ],
        };
      },

      content: [
        { text: `Catalogue: ${catalogueId}`, style: 'header', alignment: 'center', margin: [0, 0, 0, 10] },
        ...rows,
      ],

      styles: {
        header: { fontSize: 14, bold: true },
        productName: { fontSize: 10, bold: true, margin: [0, 2, 0, 2] },
        productDetail: { fontSize: 9, margin: [0, 1, 0, 1] },
        priceText: { fontSize: 9, margin: [0, 1, 0, 1], color: 'green' },
      },

      defaultStyle: {
        columnGap: 10,
      },
    };


    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.createPdf(docDefinition, null, null, pdfFonts.pdfMake.vfs).open();
  };

  // Trigger PDF generation once products are loaded
  useEffect(() => {
    if (products.length > 0) {
      generatePdf();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, printOption]);

  return null;
};

export default CataloguePrintWithCostPdf;
