import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Col,
  Input,
  Button,
  Table,
  Spinner,
} from "reactstrap";
import PropTypes from 'prop-types';
import api from "../../constants/api";

const ProductInfoModal = ({ isOpen, toggle, selectedProduct }) => {
     ProductInfoModal.propTypes = {
    selectedProduct: PropTypes.object,
    toggle: PropTypes.func,
        isOpen: PropTypes.bool,
  };
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPurchaseHistory = async () => {
    if (!selectedProduct) return;
    setLoading(true);
    try {
     const response = await api.post(
    `/purchaseorder/getGoodsReciptsByProductId`,
    {
      product_id: selectedProduct?.product_id,   // make sure you pass product_id
      from_date: fromDate || undefined,
      to_date: toDate || undefined,
    }
  );
      setHistory(response.data.data || []);
    } catch (error) {
      console.error("Error fetching purchase history:", error);
    } finally {
      setLoading(false);
    }
  };

  // fetch purchase history when modal opens or selectedProduct changes
  useEffect(() => {
    if (isOpen && selectedProduct) {
      fetchPurchaseHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, selectedProduct]);

  
  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}>Product Information Details</ModalHeader>
      <ModalBody>
        {selectedProduct && (
          <div>
            {/* Product Info */}
            <Row className="mb-3">
              <Col md="6" className="d-flex align-items-center">
                <strong className="me-2" style={{ width: "120px" }}>
                  Product Code
                </strong>{" "}
                : {selectedProduct.product_code}
              </Col>
              <Col md="6" className="d-flex align-items-center">
                <strong className="me-2" style={{ width: "120px" }}>
                  Product Name
                </strong>{" "}
                : {selectedProduct.product_name}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md="6" className="d-flex align-items-center">
                <strong className="me-2" style={{ width: "120px" }}>
                  Product UOM
                </strong>{" "}
                : {selectedProduct.uom}
              </Col>
              <Col md="6" className="d-flex align-items-center">
                <strong className="me-2" style={{ width: "120px" }}>
                  Product Price
                </strong>{" "}
                : {selectedProduct?.price}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md="6" className="d-flex align-items-center">
                <strong className="me-2" style={{ width: "120px" }}>
                  Retail Price
                </strong>{" "}
                : {selectedProduct?.retail_price}
              </Col>
              <Col md="6" className="d-flex align-items-center">
                <strong className="me-2" style={{ width: "120px" }}>
                  Wholesale Price
                </strong>{" "}
                : {selectedProduct?.wholesale_Price}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md="6" className="d-flex align-items-center">
                <strong className="me-2" style={{ width: "120px" }}>
                  Stock Qty
                </strong>{" "}
                : {selectedProduct?.qty}
              </Col>
              <Col md="6" className="d-flex align-items-center">
                <strong className="me-2" style={{ width: "120px" }}>
                  Product Weight
                </strong>{" "}
                : {selectedProduct?.product_weight}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md="6" className="d-flex align-items-center">
                <strong className="me-2" style={{ width: "120px" }}>
                  Stock WQty
                </strong>{" "}
                : {selectedProduct?.stock_wqty}
              </Col>
            </Row>

            {/* Date Filters */}
            <Row className="mb-3 align-items-center">
              <Col md="3">
                <strong className="me-2">From Date</strong>
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </Col>
              <Col md="3">
                <strong className="me-2">To Date</strong>
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </Col>
              <Col md="2">
                <Button
                  color="primary"
                  className="mt-4"
                  onClick={fetchPurchaseHistory}
                  disabled={loading}
                >
                  {loading ? <Spinner size="sm" /> : "Search"}
                </Button>
              </Col>
            </Row>

            {/* Purchase History Table */}
            <h6>Purchase History</h6>
            <Table bordered size="sm" responsive>
              <thead>
                <tr>
                  <th>Invoice No</th>
                  <th>Invoice Date</th>
                  <th>Description</th>
                  <th>Supplier</th>
                  <th>UOM</th>
                  <th>Qty</th>
                  <th>NetPrice</th>
                </tr>
              </thead>
              <tbody>
                {history.length > 0 ? (
                  history.map((item) => (
                    <tr key={item.purchase_invoice_id}>
                      <td>{item.invoice_no}</td>
                      <td>{item.invoice_date}</td>
                      <td>{item.title}</td>
                      <td>{item.company_name}</td>
                      <td>{item.uom}</td>
                      <td>{item.qty}</td>
                      <td>{item.total}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      {loading ? "Loading..." : "No records found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        )}
      </ModalBody>
    </Modal>
  );
};

export default ProductInfoModal;
