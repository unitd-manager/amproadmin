import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import api from '../../constants/api';

const CataloguePrintWithCostPdf = ({ catalogueId, printOption }) => {
  const [products, setProducts] = useState([]);
  const baseURL = 'https://amproadmin.zaitunsoftsolutions.com';

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
      img.crossOrigin = 'Anonymous';
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

  const generatePdf = async () => {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    const productContent = await Promise.all(
      products.map(async (item) => {
        const imageUrl = item.file_name
          ? `https://amproadmin.zaitunsoftsolutions.com:2002/image-proxy?url=${encodeURIComponent(
              `${baseURL}/storage/uploads/${item.file_name}`
            )}`
          : null;
        const imageBase64 = imageUrl ? await loadImageToBase64(imageUrl) : null;

        const priceDetails = [];
       
        if (printOption === 'Print With Stock') {
          priceDetails.push({
            text: `Avl Qty : ${item.quantity || 'N/A'}`,
            style: 'priceText',
          });
        }

        // ✅ Build bordered box using table directly
        const productBox = {
          table: {
            widths: ['*'],
            body: [
              [
                {
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
                            // { text: `Product Code: ${item.product_code || ''}`, style: 'productDetail' },
                            { text: `UOM : ${item.unit || 'N/A'}`, style: 'productDetail' },
                            ...priceDetails,
                          ],
                        },
                      ],
                      columnGap: 10,
                    },
                  ],
                  margin: [5, 5, 5, 5],
                },
              ],
            ],
          },
          layout: {
            hLineWidth: () => 0.5,
            vLineWidth: () => 0.5,
            hLineColor: () => '#999999',
            vLineColor: () => '#999999',
          },
          width: '33%',
        };

        return productBox;
      })
    );

    // Group into rows of 3 columns
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
            {
              text: 'AMPRO PTE LTD\nBLOCK B #02-01, 31 PENJURU LANE\nSINGAPORE 609198',
              fontSize: 10,
              margin: [20, 20, 0, 0],
            },
            {
              text: `Page: ${currentPage}/${pageCount}\nDate: ${new Date().toLocaleDateString('en-GB')}`,
              alignment: 'right',
              fontSize: 10,
              margin: [0, 20, 20, 0],
            },
          ],
        };
      },

      content: [
        // { text: `Catalogue: ${catalogueId}`, style: 'header', alignment: 'center', margin: [0, 0, 0, 10] },
        ...rows,
      ],

      styles: {
        header: { fontSize: 14, bold: true },
        productName: { fontSize: 10, bold: true, margin: [0, 2, 0, 2] },
        productDetail: { fontSize: 9, margin: [0, 1, 0, 1] },
        priceText: { fontSize: 9, margin: [0, 1, 0, 1], color: 'black' },
      },

      defaultStyle: { columnGap: 10 },
    };


    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.createPdf(docDefinition, null, null, pdfFonts.pdfMake.vfs).open();
  };

  useEffect(() => {
    if (products.length > 0) {
      generatePdf();
    }
  }, [products, printOption]);

  return null;
};

export default CataloguePrintWithCostPdf;
