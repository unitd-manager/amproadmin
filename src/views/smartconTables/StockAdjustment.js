// src/views/smartconTables/StockAdjustment.js
/*eslint-disable*/
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Table,
  Pagination,
  PaginationItem,
  PaginationLink,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import axios from "axios";
import api from "../../constants/api";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useNavigate } from "react-router-dom";
import message from "../../components/Message";
const StockAdjustment = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    stock_adjustment_no: "",
    fromDate: "",
    toDate: "",
    location_id: "",
  });

  const [stockAdjustmentData, setStockAdjustmentData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [itemsPerPage] = useState(10);
  const [selectedItems, setSelectedItems] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Fetch stock adjustment data
  const fetchStockAdjustments = async () => {
    try {
      setLoading(true);
const response = await api.get('/stockRequest/getFilteredStockAdjustment', {
  params: {
    stock_adjustment_no: filters.stock_adjustment_no,
    from_date: filters.fromDate,
    to_date: filters.toDate,
    location_id: filters.location_id,
  },
});
      if (response.data.msg ==="Success") {
        setStockAdjustmentData(response.data.data);
        setTotalRecords(response.data.total);
        setTotalPages(Math.ceil(response.data.total / itemsPerPage));
      }
    } catch (error) {
      message('Error fetching stock adjustments', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch locations
  const fetchLocations = async () => {
    try {
      const response = await api.get('/stockRequest/getAllLocations');
      if (response.data.msg ==="Success") {
        setLocations(response.data.data);
      }
    } catch (error) {
      message('Error fetching locations', 'error');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    fetchStockAdjustments();
  }, [page, filters]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1); // Reset to first page when filters change
  };

  const handleSearch = () => {
    fetchStockAdjustments();
  };

  const handleNewTransaction = () => {
    navigate('/StockAdjustmentDetails');
  };

  const handlePrintSelected = () => {
    if (selectedItems.length === 0) {
      message('Please select at least one record to print', 'warning');
      return;
    }
    handlePrint();
  };

  const handlePrintAll = () => {
    // Select all items first
    const allIds = stockAdjustmentData.map(item => item.stock_adjustment_id);
    setSelectedItems(allIds);
    // Generate PDF with all items
    setTimeout(() => {
      handlePrint();
    }, 100);
  };

  // Handle select all checkbox
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const currentPageIds = getCurrentPageData().map(item => item.id);
      setSelectedItems(currentPageIds);
    } else {
      setSelectedItems([]);
    }
  };

  // Handle individual item selection
  const handleSelectItem = (id) => {
    setSelectedItems(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Get current page data
  const getCurrentPageData = () => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return stockAdjustmentData.slice(startIndex, endIndex);
  };

  // Generate PDF for selected records
  const generatePDF = (records) => {
    const doc = new jsPDF();
    
    // Company header
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('AMPRO PTE LTD', 20, 20);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('BLOCK B #02-01,31 PENJURU LANE', 20, 30);
    doc.text('Singapore 609198', 20, 35);
    
    // Page info
    doc.text(`Page No : 1/1`, 150, 20);
    doc.text(`Print Date : ${new Date().toLocaleDateString('en-GB')}`, 150, 30);
    
    // Title
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Stock Adjustment Report', 20, 50);
    
    let yPosition = 70;
    
    records.forEach((record, index) => {
      if (index > 0) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Record header info
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Location : ${record.locationCode || 'N/A'}`, 20, yPosition);
      doc.text(`Stock Adjustment No : ${record.stockAdjustmentNo || 'N/A'}`, 120, yPosition);
      yPosition += 10;
      doc.text(`Remarks : ${record.remarks || ''}`, 20, yPosition);
      doc.text(`Stock Adjustment Date : ${record.date || 'N/A'}`, 120, yPosition);
      yPosition += 20;
      
      // Table for products
      if (record.products && record.products.length > 0) {
        const tableData = record.products.map((product, idx) => [
          idx + 1,
          product.productCode || '',
          product.productName || '',
          product.stockAdjustmentType || '',
          Number(product.beforeAdjustmentQty || 0).toFixed(2),
          Number(product.adjustmentQty || 0).toFixed(2),
          Number(product.newQty || 0).toFixed(2)
        ]);
        
        doc.autoTable({
          startY: yPosition,
          head: [['S.No', 'Product Code', 'Product Name', 'Stock Adjustment Type', 'Before Adjustment Qty', 'Adjustment Qty', 'New Qty']],
          body: tableData,
          theme: 'grid',
          headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255], fontSize: 8 },
          bodyStyles: { fontSize: 8 },
          columnStyles: {
            0: { cellWidth: 15 },
            1: { cellWidth: 25 },
            2: { cellWidth: 40 },
            3: { cellWidth: 30 },
            4: { cellWidth: 25 },
            5: { cellWidth: 25 },
            6: { cellWidth: 25 }
          }
        });
      }
    });
    
    doc.save('stock-adjustment-report.pdf');
    message('PDF generated successfully', 'success');
  };

  // Render pagination
  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // Previous button
    pages.push(
      <PaginationItem key="prev" disabled={page === 1}>
        <PaginationLink previous onClick={() => setPage(page - 1)} />
      </PaginationItem>
    );
    
    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i} active={i === page}>
          <PaginationLink onClick={() => setPage(i)}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Next button
    pages.push(
      <PaginationItem key="next" disabled={page === totalPages}>
        <PaginationLink next onClick={() => setPage(page + 1)} />
      </PaginationItem>
    );
    
    return pages;
  };

  // Get stock adjustment details for PDF
  const getStockAdjustmentDetails = async (id) => {
    try {
      const response = await api.get(`/stockRequest/getStockAdjustmentDetails/${id}`);
      return response.data.success ? response.data.data : null;
    } catch (error) {
      message('Error fetching adjustment details', 'error');
      console.error(error);
      return null;
    }
  };

  const handlePrint = async () => {
    if (selectedItems.length === 0) {
      message("Please select at least one record", "warning");
      return;
    }

    try {
      setLoading(true);
      const selectedRecords = [];
      
      // Fetch details for each selected item
      for (const id of selectedItems) {
        const details = await getStockAdjustmentDetails(id);
        if (details) selectedRecords.push(details);
      }

      generatePDF(selectedRecords);
    } catch (error) {
      message('Error generating PDF', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Rest of the component remains largely the same, just update the data source
  // to use the API data instead of hardcoded data

  return (
    <Container fluid className="p-4">
      {/* Header */}
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="mb-0" style={{ color: '#2c3e50', fontWeight: '600' }}>
            Stock Adjustment Management
          </h2>
        </Col>
        <Col className="text-right">
           <ButtonDropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
            <Button color="primary" onClick={handleNewTransaction}>
              New Transaction
            </Button>
            <DropdownToggle caret color="primary" />
            {/* <DropdownMenu end>
              <DropdownItem onClick={() => handleConvertToPurchaseInvoice}>Convert to Purchase Invoice</DropdownItem>
              <DropdownItem onClick={() => handleRepeatGoodsReceipt}>Repeat Goods Receipt </DropdownItem>
            </DropdownMenu> */}
          </ButtonDropdown>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="mb-4">
        <CardBody>
          <Form>
            <Row>
              <Col md={3}>
                <FormGroup>
                  <Label>Stock AdjNo</Label>
                  <Input
                    type="text"
                    name="stock_adjustment_no"
                    value={filters.stock_adjustment_no}
                    onChange={handleChange}
                    placeholder="Enter Stock Adjustment No"
                  />
                </FormGroup>
              </Col>
              <Col md={3}>
                <FormGroup>
                  <Label>From Date</Label>
                  <Input
                    type="date"
                    name="fromDate"
                    value={filters.fromDate}
                    onChange={handleChange}
                  />
                </FormGroup>
              </Col>
              <Col md={3}>
                <FormGroup>
                  <Label>To Date</Label>
                  <Input
                    type="date"
                    name="toDate"
                    value={filters.toDate}
                    onChange={handleChange}
                  />
                </FormGroup>
              </Col>
              <Col md={3}>
                <FormGroup>
                  <Label>Location</Label>
                  <Input
                    type="select"
                    name="location_id"
                    value={filters.location_id}
                    onChange={handleChange}
                  >
                    <option value="">All Locations</option>
                    {locations.map(loc => (
                      <option key={loc.location_id} value={loc.location_code}>
                        {loc.location_name}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col className="d-flex justify-content-end">
                <Button
                  color="primary"
                  onClick={handleSearch}
                  className="mr-2"
                  disabled={loading}
                >
                  {loading ? 'Searching...' : '🔍 Search'}
                </Button>
                <Button
                  color="secondary"
                  onClick={handlePrint}
                  disabled={loading}
                >
                  {loading ? 'Generating...' : '🖨️ Print'}
                </Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>

      {/* Data Table */}
      <Card>
        <CardBody className="p-0">
          <div className="table-responsive">
            <Table className="mb-0">
              <thead>
                <tr>
                  <th>
                    <Input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedItems.length === getCurrentPageData().length && getCurrentPageData().length > 0}
                    />
                  </th>
                  <th>StockAdjustment No</th>
                  <th>Date</th>
                  <th>Location Code</th>
                  <th>Remarks</th>
                  <th>Create User</th>
                  <th>Create Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      Loading...
                    </td>
                  </tr>
                ) : getCurrentPageData().length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No data available
                    </td>
                  </tr>
                ) : (
                  getCurrentPageData().map((item) => (
                    <tr key={item.stock_adjustment_id}>
                      <td>
                        <Input
                          type="checkbox"
                          checked={selectedItems.includes(item.stock_adjustment_id)}
                          onChange={() => handleSelectItem(item.stock_adjustment_id)}
                        />
                      </td>
                      <td>{item.stock_adjustment_no}</td>
                      <td>{item.stock_adjustment_date ? new Date(item.stock_adjustment_date).toLocaleDateString('en-GB'):''}</td>
                      <td>{item.location_code}</td>
                      <td>{item.remarks || '-'}</td>
                      <td>{item.created_by}</td>
                      <td>{item.created_at ? new Date(item.created_at).toLocaleDateString('en-GB'):''}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </CardBody>
      </Card>

      {/* Pagination */}
      <Row className="mt-3">
        <Col md={6}>
          <div>
            Showing {((page - 1) * itemsPerPage) + 1} to {Math.min(page * itemsPerPage, totalRecords)} of {totalRecords} entries
          </div>
        </Col>
        <Col md={6} className="d-flex justify-content-end">
          <Pagination>
            {renderPagination()}
          </Pagination>
        </Col>
      </Row>
    </Container>
  );
};

export default StockAdjustment;