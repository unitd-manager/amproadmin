/*eslint-disable*/
import React, { useState, useEffect } from 'react';
import {
  Button, Input, Table, Row, Col, DropdownToggle, DropdownMenu,
  DropdownItem, ButtonDropdown
} from 'reactstrap';
import moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../constants/api';

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
const [selectedTranNos, setSelectedTranNos] = useState([]);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  console.log('selected trans nos:', selectedTranNos);
  const navigate=useNavigate();
  
  const fetchData = async () => {
    try {
      const res = await api.get('/purchaseorder/getFilteredGoodsReturn', {
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

  const handlePrev = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage(prev => prev + 1);

  const handleNewTransactionClick = () => {
    console.log('Main "New Transaction" button clicked');
    navigate('/GoodsReturnDetails');
    // e.g., navigate to /createGoodsReturn
  };

const handleConvertToDebitNote = async () => {
  console.log('selected trans nos:', selectedTranNos);
  if (selectedTranNos.length === 0) {
    alert('Please select at least one Goods Return to convert.');
    return;
  }

  try {
    await api.post('purchaseorder/convertToDebitNote', {
      tran_nos: selectedTranNos
    });
    alert('Successfully converted to debit note!');
    fetchData(); // Refresh the table
  } catch (err) {
    console.error('Error converting:', err);
    alert('Failed to convert to debit note.');
  }
};

const handleRepeatGoodsReturn = async () => {
  
  console.log('selected trans nos:', selectedTranNos);
  if (selectedTranNos.length !== 1) {
    alert('Please select one Goods Return to repeat.');
    return;
  }

  try {
     await api.post('purchaseorder/repeatGoodsReturn', {
      tran_no: selectedTranNos[0]
    });
    alert('Goods Return repeated successfully.');
    fetchData();
  } catch (err) {
    console.error('Error repeating:', err);
    alert('Failed to repeat Goods Return.');
  }
};


  return (
    <div className="p-4 bg-light">
      <h4 className="mb-4">Goods Return Management</h4>

      <Row className="mb-3">
        <Col md={2}><Input name="tran_no" placeholder="Tran No" value={filters.tran_no} onChange={handleFilterChange} /></Col>
        <Col md={2}><Input type="date" name="from_date" value={filters.from_date} onChange={handleFilterChange} /></Col>
        <Col md={2}><Input type="date" name="to_date" value={filters.to_date} onChange={handleFilterChange} /></Col>
        <Col md={2}>
          <Input type="select" name="status" value={filters.status} onChange={handleFilterChange}>
          <option></option>
            <option>Open</option>
            <option>Closed</option>
            <option>Cancelled</option>
          </Input>
        </Col>
        <Col md={2}><Input name="supplier" placeholder="Select All Supplier" value={filters.supplier} onChange={handleFilterChange} /></Col>
        <Col md={2}><Input name="invoice_no" placeholder="Invoice No" value={filters.invoice_no} onChange={handleFilterChange} /></Col>
      </Row>

      <Row className="mb-3">
        <Col md={10}>
          <Button color="primary" onClick={handleSearch}><i className="fa fa-search" /></Button>{' '}
          {/* <Button color="secondary"><i className="fa fa-print" /></Button>{' '}
          <Button color="danger"><i className="fa fa-trash" /></Button> */}
        </Col>
        <Col md={2} className="text-right">
          <ButtonDropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
            <Button color="primary" onClick={handleNewTransactionClick}>
              New Transaction
            </Button>
            <DropdownToggle caret color="primary" />
            {/* <DropdownMenu end>
              <DropdownItem onClick={() => handleConvertToDebitNote}>Convert to Debit Note</DropdownItem>
              <DropdownItem onClick={() => handleRepeatGoodsReturn}>Repeat Goods Return</DropdownItem>
            </DropdownMenu> */}
          </ButtonDropdown>
        </Col>
      </Row>

      <Table bordered hover size="sm" className="bg-white">
        <thead>
          <tr>
            <th><Input type="checkbox" /></th>
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
    onChange={(e) => {
      const tranNo = item.tran_no;
      if (e.target.checked) {
        setSelectedTranNos(prev => [...prev, tranNo]);
      } else {
        setSelectedTranNos(prev => prev.filter(no => no !== tranNo));
      }
    }}
  />
</td>

              <td><Link to={`/GoodsReturnEdit/${item.goods_return_id}`}>{item.tran_no}</Link></td>
              <td>{item.tran_date?moment(item.tran_date).format('YYYY-MM-DD'):''}</td>
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
