/*eslint-disable*/
import React, { useState, useEffect } from 'react';
import {
  Button, Input, Table, Row, Col, DropdownToggle, DropdownMenu,
  DropdownItem, ButtonDropdown
} from 'reactstrap';
import moment from 'moment';
import { ToastContainer } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../constants/api';
import message from '../../components/Message';
import PdfGoodsReceiptList from '../../components/PDF/PdfGoodsReceiptList';

const GoodsReturnList = () => {
  const [filters, setFilters] = useState({
    tran_no: '',
    from_date: '',
    to_date: '',
    status: '',
    supplier: '',
    invoice_no: ''
  });

  const [goodsReturns, setGoodsReturns] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
const [selectedIds, setSelectedIds] = useState([]);
const [selectAll, setSelectAll] = useState(false);

  const [statusOptions, setStatusOptions] = useState(['Open', 'Closed', 'Returned', 'Repeated', 'Cancelled']);

const [supplierOptions, setSupplierOptions] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
const navigate =useNavigate();
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

const fetchData = async () => {
  try {
    const res = await api.get('/purchaseorder/getFilteredGoodsReceipt', {
      params: {
        tran_no: filters.tran_no || '',
        from_date: filters.from_date || '',
        to_date: filters.to_date || '',
        status: filters.status || '',
        supplier_id: filters.supplier_id || '',
        invoice_no: filters.invoice_no || '',
      }
    });

    setGoodsReturns(res.data.data);
    setTotalRecords(res.data.total);
  } catch (err) {
    console.error(err);
  }
};

const handleSelectAll = (e) => {
  const checked = e.target.checked;
  setSelectAll(checked);
  setSelectedIds(checked ? goodsReturns.map(i => i.goods_receipt_id) : []);
};

  useEffect(() => {
     api.get("/supplier/getSupplier").then((response) => {
      setSupplierOptions(response.data.data);
    });
  }, []);
  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchData();
  };
 const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      alert('Please select at least one record to delete.');
      return;
    }
    if (window.confirm('Are you sure you want to delete the selected records?')) {
      try {
        await Promise.all(selectedIds.map(purchaseInvoiceId =>
          api.post('/purchaseorder/deleteGoodsReceipt', { goods_receipt_id: purchaseInvoiceId })
        ));
        message('Goods Receipt deleted successfully!','success');
         setTimeout(()=>{
          window.location.reload();
        },300)
        fetchData();
      } catch (err) {
        console.error(err);
        alert('Failed to delete selected records.');
      }
    }
  };
  const handlePrev = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage(prev => prev + 1);

  const handleNewTransactionClick = () => {
    console.log('Main "New Transaction" button clicked');
     navigate('/GoodsReceiptDetails'); // Example
    // e.g., navigate to /createGoodsReturn
  };


  const convertToPurchaseInvoice = () => {
    if (selectedIds.length === 0) {
    alert('Please select at least one Goods Return to convert.');
    return;
  }
    api.post("/purchaseorder/ConvertToPurchaseInvoice", { goods_receipt_ids: selectedIds })
      .then(() => {
        message("Converted to Purchase Invoice successfully",'success');
        //   setTimeout(()=>{
        //   window.location.reload();
        // },300)
      })
      .catch(() => message.error("Conversion failed"));
  };

  const repeatGoodsReceipt = () => {
    
    if (selectedIds.length === 0) {
    alert('Please select at least one Goods Return to convert.');
    return;
  }
    api.post("/purchaseorder/repeatGoodsReceipt", { goods_receipt_ids: selectedIds })
      .then(() => {
        message("Goods Receipts repeated successfully",'success');
        //  setTimeout(()=>{
        //   window.location.reload();
        // },300)
      })
      .catch(() => message.error("Repeat failed"));
  };

  return (
    <div className="p-4 bg-light">
      <h4 className="mb-4">Goods Receipt Management</h4>
<ToastContainer/>
      <Row className="mb-3">
        <Col md={2}><Input name="tran_no" placeholder="Tran No" value={filters.tran_no} onChange={handleFilterChange} /></Col>
        <Col md={2}><Input type="date" name="from_date" value={filters.from_date} onChange={handleFilterChange} /></Col>
        <Col md={2}><Input type="date" name="to_date" value={filters.to_date} onChange={handleFilterChange} /></Col>
         <Col md={2}>
                  <Input type="select" name="status" placeholder="Status" value={filters.status} onChange={handleFilterChange}>
                    <option value="">All</option>
                    {statusOptions.map((s, idx) => (
                      <option key={idx} value={s}>{s}</option>
                    ))}
                  </Input>
                </Col>
        <Col md={2}>
        {/* <Input name="supplier" placeholder="Select All Supplier" value={filters.supplier} onChange={handleFilterChange} /> */}
         <Input
                             type="select"
                             name="supplier_id"
                             value={filters.supplier_id}
                             onChange={handleFilterChange}
                           >
                             <option value="">Select Supplier</option>
                             {supplierOptions.map((supplier, index) => (
                               <option key={index} value={supplier.supplier_id}>
                                 {supplier.supplier_name}
                               </option>
                             ))}
                           </Input>
        </Col>
        <Col md={2}><Input name="invoice_no" placeholder="Invoice No" value={filters.invoice_no} onChange={handleFilterChange} /></Col>
      </Row>

      <Row className="mb-3">
        <Col md={10}>
          <Button color="primary" onClick={handleSearch}><i className="fa fa-search" /></Button>{' '}
        <Button color="secondary">{selectedIds.length>0 &&<PdfGoodsReceiptList id={selectedIds}/>}</Button>{' '}
          <Button color="danger" onClick={handleDeleteSelected}><i className="fa fa-trash" /></Button>
        </Col>
        <Col md={2} className="text-right">
          <ButtonDropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
            <Button color="primary" onClick={handleNewTransactionClick}>
              New Transaction
            </Button>
            <DropdownToggle caret color="primary" />
            <DropdownMenu end>
              <DropdownItem onClick={() => convertToPurchaseInvoice()}>Convert to Purchase Invoice</DropdownItem>
              <DropdownItem onClick={() => repeatGoodsReceipt()}>Repeat Goods Receipt </DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
        </Col>
      </Row>

      <Table hover size="sm" className="bg-white">
        <thead>
          <tr>
            <th><Input type="checkbox" checked={selectAll} onChange={handleSelectAll} /></th>
            <th>Tran No</th>
            <th>Tran Date</th>
            <th>Supplier</th>
            <th>Status</th>
            <th>InvoiceNo</th>
            <th>SubTotal</th>
            <th>Tax</th>
            <th>NetTotal</th>
          </tr>
        </thead>
        <tbody>
          {goodsReturns.length > 0 ? goodsReturns.map((item) => (
            <tr key={item.goods_receipt_id}>
             <td>
  <Input
    type="checkbox"
    checked={selectedIds.includes(item.goods_receipt_id)}
    onChange={(e) => {
      const id = item.goods_receipt_id;
      if (e.target.checked) {
        const newSelected = [...selectedIds, id];
        setSelectedIds(newSelected);
        setSelectAll(newSelected.length === goodsReturns.length);
      } else {
        const newSelected = selectedIds.filter(no => no !== id);
        setSelectedIds(newSelected);
        setSelectAll(false);
      }
    }}
  />
</td>

              <td><Link to={`/GoodsReceiptEdit/${item.goods_receipt_id}`}>{item.tran_no}</Link></td>
             <td>
  {item?.tran_date && moment(item.tran_date).isValid()
    ? moment(item.tran_date).format('YYYY-MM-DD')
    : ''}
</td>
              <td>{item.company_name}</td>
              <td>{item.status}</td>
              <td>{item.invoice_no}</td>
              <td>{item.sub_total}</td>
              <td>{item.gst}</td>
              <td>{item.net_total}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan="9" className="text-center">No data available in table</td>
            </tr>
          )}
        </tbody>
      </Table>

      <div className="d-flex justify-content-between px-2">
        <span>Total Records : {totalRecords}</span>
        <div>
          <Button size="sm" disabled={currentPage === 1} onClick={handlePrev}>Previous</Button>{' '}
          <Button size="sm" onClick={handleNext}>Next</Button>
        </div>
      </div>
    </div>
  );
};

export default GoodsReturnList;
