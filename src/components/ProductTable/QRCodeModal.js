import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import QRCode from 'react-qr-code';
import { Modal, ModalHeader, ModalBody, Button } from 'reactstrap';
import html2pdf from 'html2pdf.js';

const QRCodeModal = ({ isOpen, toggle, qrData }) => {
  const pdfRef = useRef();
  const qrContent = qrData?.name || 'No Product';

  const handleViewPDF = () => {
    const element = pdfRef.current;
    if (!element) return;

    const opt = {
      margin: 0,
      filename: `${qrContent}_QRCode.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };

    html2pdf().set(opt).from(element).outputPdf('bloburl').then((pdfUrl) => {
      window.open(pdfUrl, '_blank');
    });
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Product QR Code</ModalHeader>
      <ModalBody className="text-center">
        {qrData ? (
          <>
            <div
              ref={pdfRef}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '400px',
              }}
            >
              {/* ✅ Small fixed size QR code */}
              <QRCode value={qrContent} size={120} />
            </div>

            <Button color="primary" onClick={handleViewPDF} className="mt-3">
              Print
            </Button>
          </>
        ) : (
          <p>No Product Selected</p>
        )}

        {/* <Button color="secondary" onClick={toggle} className="mt-2">
          Close
        </Button> */}
      </ModalBody>
    </Modal>
  );
};

QRCodeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  qrData: PropTypes.object,
};

export default QRCodeModal;
