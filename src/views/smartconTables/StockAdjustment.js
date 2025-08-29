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
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import axios from "axios";
import api from "../../constants/api";
import jsPDF from "jspdf";
import "jspdf-autotable";

const StockAdjustment = () => {
  const [filters, setFilters] = useState({
    stockAdjNo: "",
    fromDate: "",
    toDate: "",
    location: "Head Office",
  });

  const [stockAdjustmentData, setStockAdjustmentData] = useState([
    {
      id: 1,
      stockAdjustmentNo: "ADJ202508-000031",
      date: "26/08/2025",
      locationCode: "HQ",
      remarks: "",
      createUser: "AMPRO",
      createDate: "26/08/2025",
      products: [
        {
          sno: 1,
          productCode: "400042",
          productName: "RED BULL ENERGY DRINK 250ML",
          stockAdjustmentType: "",
          beforeAdjustmentQty: 6864.00,
          adjustmentQty: -1560.0,
          newQty: 5304.00
        },
        {
          sno: 2,
          productCode: "400045",
          productName: "SPEED CARBONATED CAN BEVERAGE 300ML",
          stockAdjustmentType: "",
          beforeAdjustmentQty: -864.00,
          adjustmentQty: 864.0,
          newQty: 0.00
        }
      ]
    },
    {
      id: 2,
      stockAdjustmentNo: "ADJ202508-000030",
      date: "19/08/2025",
      locationCode: "HQ",
      remarks: "",
      createUser: "AMPRO",
      createDate: "19/08/2025",
    },
    {
      id: 3,
      stockAdjustmentNo: "ADJ202508-000029",
      date: "07/08/2025",
      locationCode: "HQ",
      remarks: "",
      createUser: "AMPRO",
      createDate: "07/08/2025",
    },
    {
      id: 4,
      stockAdjustmentNo: "ADJ202508-000028",
      date: "07/08/2025",
      locationCode: "HQ",
      remarks: "",
      createUser: "AMPRO",
      createDate: "07/08/2025",
    },
    {
      id: 5,
      stockAdjustmentNo: "ADJ202507-000027",
      date: "30/07/2025",
      locationCode: "HQ",
      remarks: "",
      createUser: "AMPRO",
      createDate: "30/07/2025",
    },
    {
      id: 6,
      stockAdjustmentNo: "ADJ202507-000026",
      date: "30/07/2025",
      locationCode: "HQ",
      remarks: "",
      createUser: "AMPRO",
      createDate: "30/07/2025",
    },
    {
      id: 7,
      stockAdjustmentNo: "ADJ202507-000025",
      date: "22/07/2025",
      locationCode: "HQ",
      remarks: "",
      createUser: "AMPRO",
      createDate: "22/07/2025",
    },
    {
      id: 8,
      stockAdjustmentNo: "ADJ202507-000024",
      date: "14/07/2025",
      locationCode: "HQ",
      remarks: "",
      createUser: "AMPRO",
      createDate: "14/07/2025",
    },
    {
      id: 9,
      stockAdjustmentNo: "ADJ202506-000023",
      date: "10/06/2025",
      locationCode: "HQ",
      remarks: "",
      createUser: "AMPRO",
      createDate: "10/06/2025",
    },
    {
      id: 10,
      stockAdjustmentNo: "ADJ202506-000022",
      date: "09/06/2025",
      locationCode: "HQ",
      remarks: "",
      createUser: "AMPRO",
      createDate: "09/06/2025",
    },
  ]);

  const [filteredData, setFilteredData] = useState(stockAdjustmentData);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(299);
  const [itemsPerPage] = useState(10);
  const [selectedItems, setSelectedItems] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    filterData();
  }, [filters, stockAdjustmentData]);

  useEffect(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);
    setTotalPages(Math.ceil(filteredData.length / itemsPerPage));
  }, [filteredData, page, itemsPerPage]);

  const filterData = () => {
    let filtered = stockAdjustmentData;

    if (filters.stockAdjNo) {
      filtered = filtered.filter((item) =>
        item.stockAdjustmentNo.toLowerCase().includes(filters.stockAdjNo.toLowerCase())
      );
    }

    if (filters.fromDate) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.date.split('/').reverse().join('-'));
        const fromDate = new Date(filters.fromDate);
        return itemDate >= fromDate;
      });
    }

    if (filters.toDate) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.date.split('/').reverse().join('-'));
        const toDate = new Date(filters.toDate);
        return itemDate <= toDate;
      });
    }

    setFilteredData(filtered);
    setPage(1);
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    filterData();
  };

  const generatePDF = (selectedRecords) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    
    // Company Header
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("AMPRO PTE LTD", 20, 25);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("BLOCK B #02-01,31 PENJURU LANE", 20, 35);
    doc.text("Singapore 609198", 20, 45);
    
    // Page info (top right)
    doc.text(`Page No : 1/1`, pageWidth - 60, 25);
    doc.text(`Print Date : ${new Date().toLocaleDateString('en-GB')}`, pageWidth - 60, 35);
    
    // Title
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Stock Adjustment Report", 20, 65);
    
    // Process each selected record
    selectedRecords.forEach((record, recordIndex) => {
      const yStart = 85 + (recordIndex * 200); // Space between records
      
      // Record details
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Location    : ${record.locationCode}`, 20, yStart);
      doc.text(`Remarks     :`, 20, yStart + 15);
      
      doc.text(`Stock Adjustment No    : ${record.stockAdjustmentNo}`, pageWidth - 120, yStart);
      doc.text(`Stock Adjustment Date  : ${record.date}`, pageWidth - 120, yStart + 15);
      
      // Products table
      if (record.products && record.products.length > 0) {
        const tableData = record.products.map(product => [
          product.sno,
          product.productCode,
          product.productName,
          product.stockAdjustmentType || "",
          product.beforeAdjustmentQty.toFixed(2),
          product.adjustmentQty.toFixed(1),
          product.newQty.toFixed(2)
        ]);
        
        doc.autoTable({
          startY: yStart + 30,
          head: [[
            'S.No',
            'Product Code',
            'Product Name',
            'Stock Adjustment Type',
            'Before Adjustment Qty',
            'Adjustment Qty',
            'New Qty'
          ]],
          body: tableData,
          theme: 'grid',
          headStyles: {
            fillColor: [0, 0, 0],
            textColor: [255, 255, 255],
            fontSize: 8,
            fontStyle: 'bold'
          },
          bodyStyles: {
            fontSize: 8,
            cellPadding: 3
          },
          columnStyles: {
            0: { cellWidth: 15 },
            1: { cellWidth: 25 },
            2: { cellWidth: 60 },
            3: { cellWidth: 30 },
            4: { cellWidth: 25 },
            5: { cellWidth: 20 },
            6: { cellWidth: 20 }
          },
          margin: { left: 20, right: 20 }
        });
      }
      
      // Add new page if not the last record
      if (recordIndex < selectedRecords.length - 1) {
        doc.addPage();
      }
    });
    
    // Save the PDF
    doc.save(`Stock_Adjustment_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };
  
  const handlePrint = () => {
    if (selectedItems.length === 0) {
      alert("Please select at least one record");
      return;
    }
    
    // Get selected records
    const selectedRecords = stockAdjustmentData.filter(item => 
      selectedItems.includes(item.id)
    );
    
    generatePDF(selectedRecords);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const currentPageData = getCurrentPageData();
      setSelectedItems(currentPageData.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const getCurrentPageData = () => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  };

  const handleNewTransaction = () => {
    // Navigate to new transaction page or open modal
    console.log("New Transaction clicked");
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Previous button
    pages.push(
      <PaginationItem key="prev" disabled={page === 1}>
        <PaginationLink onClick={() => setPage(page - 1)}>PREVIOUS</PaginationLink>
      </PaginationItem>
    );

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i} active={i === page}>
          <PaginationLink onClick={() => setPage(i)}>{i}</PaginationLink>
        </PaginationItem>
      );
    }

    // Show ellipsis and last page if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <PaginationItem key="ellipsis" disabled>
            <PaginationLink>...</PaginationLink>
          </PaginationItem>
        );
      }
      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink onClick={() => setPage(totalPages)}>{totalPages}</PaginationLink>
        </PaginationItem>
      );
    }

    // Next button
    pages.push(
      <PaginationItem key="next" disabled={page === totalPages}>
        <PaginationLink onClick={() => setPage(page + 1)}>NEXT</PaginationLink>
      </PaginationItem>
    );

    return pages;
  };

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
          <Dropdown isOpen={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)}>
            <DropdownToggle 
              caret 
              style={{
                backgroundColor: '#34495e',
                borderColor: '#34495e',
                color: 'white',
                padding: '8px 16px',
                fontSize: '14px'
              }}
            >
              New Transaction
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={handleNewTransaction}>
                Create New Adjustment
              </DropdownItem>
              <DropdownItem>
                Import from Excel
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="mb-4" style={{ border: '1px solid #e9ecef', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <CardBody>
          <Form>
            <Row>
              <Col md={3}>
                <FormGroup>
                  <Label style={{ fontWeight: '500', color: '#495057' }}>Stock AdjNo</Label>
                  <Input
                    type="text"
                    name="stockAdjNo"
                    value={filters.stockAdjNo}
                    onChange={handleChange}
                    placeholder="Enter Stock Adjustment No"
                    style={{ border: '1px solid #ced4da', borderRadius: '4px' }}
                  />
                </FormGroup>
              </Col>
              <Col md={3}>
                <FormGroup>
                  <Label style={{ fontWeight: '500', color: '#495057' }}>From Date</Label>
                  <Input
                    type="date"
                    name="fromDate"
                    value={filters.fromDate}
                    onChange={handleChange}
                    style={{ border: '1px solid #ced4da', borderRadius: '4px' }}
                  />
                </FormGroup>
              </Col>
              <Col md={3}>
                <FormGroup>
                  <Label style={{ fontWeight: '500', color: '#495057' }}>To Date</Label>
                  <Input
                    type="date"
                    name="toDate"
                    value={filters.toDate}
                    onChange={handleChange}
                    style={{ border: '1px solid #ced4da', borderRadius: '4px' }}
                  />
                </FormGroup>
              </Col>
              <Col md={3}>
                <FormGroup>
                  <Label style={{ fontWeight: '500', color: '#495057' }}>Location</Label>
                  <Input
                    type="select"
                    name="location"
                    value={filters.location}
                    onChange={handleChange}
                    style={{ border: '1px solid #ced4da', borderRadius: '4px' }}
                  >
                    <option value="Head Office">Head Office</option>
                    <option value="Warehouse 1">Warehouse 1</option>
                    <option value="Warehouse 2">Warehouse 2</option>
                    <option value="Store 1">Store 1</option>
                    <option value="Store 2">Store 2</option>
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
                  style={{
                    backgroundColor: '#007bff',
                    borderColor: '#007bff',
                    padding: '8px 20px',
                    fontSize: '14px'
                  }}
                >
                  🔍 Search
                </Button>
                <Button
                  color="secondary"
                  onClick={handlePrint}
                  style={{
                    backgroundColor: '#6c757d',
                    borderColor: '#6c757d',
                    padding: '8px 20px',
                    fontSize: '14px'
                  }}
                >
                  🖨️ Print
                </Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>

      {/* Data Table */}
      <Card style={{ border: '1px solid #e9ecef', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <CardBody className="p-0">
          <div className="table-responsive">
            <Table className="mb-0" style={{ fontSize: '14px' }}>
              <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                <tr>
                  <th style={{ padding: '12px 8px', fontWeight: '600', color: '#495057', width: '50px' }}>
                    <Input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedItems.length === getCurrentPageData().length && getCurrentPageData().length > 0}
                    />
                  </th>
                  <th style={{ padding: '12px 8px', fontWeight: '600', color: '#495057', cursor: 'pointer' }}>
                    StockAdjustment No ↕
                  </th>
                  <th style={{ padding: '12px 8px', fontWeight: '600', color: '#495057', cursor: 'pointer' }}>
                    Date ↕
                  </th>
                  <th style={{ padding: '12px 8px', fontWeight: '600', color: '#495057', cursor: 'pointer' }}>
                    Location Code ↕
                  </th>
                  <th style={{ padding: '12px 8px', fontWeight: '600', color: '#495057', cursor: 'pointer' }}>
                    Remarks ↕
                  </th>
                  <th style={{ padding: '12px 8px', fontWeight: '600', color: '#495057', cursor: 'pointer' }}>
                    Create User ↕
                  </th>
                  <th style={{ padding: '12px 8px', fontWeight: '600', color: '#495057', cursor: 'pointer' }}>
                    Create Date ↕
                  </th>
                </tr>
              </thead>
              <tbody>
                {getCurrentPageData().length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center" style={{ padding: '40px' }}>
                      <div style={{ color: '#6c757d' }}>
                        <i className="fas fa-inbox fa-3x mb-3"></i>
                        <p>No data available</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  getCurrentPageData().map((item, index) => (
                    <tr
                      key={item.id}
                      style={{
                        backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa',
                        borderBottom: '1px solid #dee2e6'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#e3f2fd';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f8f9fa';
                      }}
                    >
                      <td style={{ padding: '12px 8px' }}>
                        <Input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                        />
                      </td>
                      <td style={{ padding: '12px 8px', color: '#007bff', fontWeight: '500' }}>
                        {item.stockAdjustmentNo}
                      </td>
                      <td style={{ padding: '12px 8px', color: '#495057' }}>
                        {item.date}
                      </td>
                      <td style={{ padding: '12px 8px', color: '#495057' }}>
                        {item.locationCode}
                      </td>
                      <td style={{ padding: '12px 8px', color: '#495057' }}>
                        {item.remarks || '-'}
                      </td>
                      <td style={{ padding: '12px 8px', color: '#495057' }}>
                        {item.createUser}
                      </td>
                      <td style={{ padding: '12px 8px', color: '#495057' }}>
                        {item.createDate}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </CardBody>
      </Card>

      {/* Footer with pagination and record count */}
      <Row className="mt-3 align-items-center">
        <Col md={6}>
          <div style={{ fontSize: '14px', color: '#6c757d' }}>
            Showing {((page - 1) * itemsPerPage) + 1} to {Math.min(page * itemsPerPage, filteredData.length)} of {filteredData.length} entries
          </div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#495057', marginTop: '5px' }}>
            Total Records: {totalRecords}
          </div>
        </Col>
        <Col md={6} className="d-flex justify-content-end">
          <Pagination className="mb-0">
            {renderPagination()}
          </Pagination>
        </Col>
      </Row>
    </Container>
  );
};

export default StockAdjustment;