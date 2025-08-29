/*eslint-disable*/
import React, { useState, useEffect } from 'react';
import {
  Button, Input, Table, Row, Col, DropdownToggle, DropdownMenu,
  DropdownItem, ButtonDropdown, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../constants/api';

const PurchaseDebitNote = () => {
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

  const [statusModal, setStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('Open');

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await api.get('/purchaseorder/getFilteredPurchaseDebitNote', {
        params: {
          tran_no: filters.tran_no || '',
          from_date: filters.from_date || '',
          to_date: filters.to_date || '',
          status: filters.status || '',
          supplier_id: filters.supplier || '',
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
    navigate('/PurchaseDebitNoteDetails'); // Example
  };

  const handlePrintwithoutPrice = async () => {
    if (selectedTranNos.length !== 1) {
      alert('Select a single Purchase Order to print.');
      return;
    }
    const tranNo = selectedTranNos[0];
    const res = await api.get(`/purchaseorder/getPoByTranNo/${tranNo}`);
    const poData = res.data.data;

    const content = `
      <html><body>
        <h3>PO: ${poData.tran_no}</h3>
        <p>Status: ${poData.status}</p>
        <p>Supplier: ${poData.company_name}</p>
        <ul>
          ${poData.items.map(i => `<li>${i.item_title} - Qty: ${i.quantity}</li>`).join('')}
        </ul>
      </body></html>
    `;
    const win = window.open('', '', 'width=800,height=600');
    win.document.write(content);
    win.print();
    win.close();
  };

  const handleConverttoGra = async () => {
    if (selectedTranNos.length !== 1) {
      alert('Please select one PO to convert.');
      return;
    }
    try {
      await api.post('/purchaseorder/convertToGRA', { tran_no: selectedTranNos[0] });
      alert('Converted to GRA!');
    } catch (err) {
      console.error(err);
      alert('Conversion failed');
    }
  };

  const handleChangeStatus = () => {
    if (selectedTranNos.length !== 1) {
      alert('Select one PO to change status');
      return;
    }
    setStatusModal(true);
  };

  const submitNewStatus = async () => {
    try {
      await api.post('/purchaseorder/changeStatus', {
        tran_no: selectedTranNos[0],
        status: newStatus
      });
      alert('Status updated!');
      setStatusModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  const handleRepeatPurchaseOrder = async () => {
    if (selectedTranNos.length !== 1) {
      alert('Select one PO to repeat');
      return;
    }
    try {
      const res = await api.post('purchaseorder/repeatGoodsReceipt', {
        tran_no: selectedTranNos[0]
      });
      alert('Repeated successfully');
      navigate(`/PurchaseOrderEdit/${res.data.new_id}`);
    } catch (err) {
      console.error(err);
      alert('Repeat failed');
    }
  };

  return (
    <div className="p-4 bg-light">
      <h4 className="mb-4">Purchase DebitNote Management</h4>

      <Row className="mb-3">
        <Col md={2}><Input name="tran_no" placeholder="Tran No" value={filters.tran_no} onChange={handleFilterChange} /></Col>
        <Col md={2}><Input type="date" name="from_date" value={filters.from_date} onChange={handleFilterChange} /></Col>
        <Col md={2}><Input type="date" name="to_date" value={filters.to_date} onChange={handleFilterChange} /></Col>
        <Col md={2}>
          <Input type="select" name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">All</option>
            <option>Open</option>
            <option>Closed</option>
            <option>Cancelled</option>
          </Input>
        </Col>
        <Col md={2}><Input name="supplier" placeholder="Supplier" value={filters.supplier} onChange={handleFilterChange} /></Col>
      </Row>

      <Row className="mb-3">
        <Col md={10}>
          <Button color="primary" onClick={handleSearch}><i className="fa fa-search" /></Button>{' '}
          {/* <Button color="secondary"><i className="fa fa-print" /></Button>{' '}
          <Button color="danger"><i className="fa fa-trash" /></Button> */}
        </Col>
        <Col md={2} className="text-right">
          <ButtonDropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
            <Button color="primary" onClick={handleNewTransactionClick}>New Transaction</Button>
            <DropdownToggle caret color="primary" />
            {/* <DropdownMenu end>
              <DropdownItem onClick={handlePrintwithoutPrice}>Print Without Price</DropdownItem>
              <DropdownItem onClick={handleConverttoGra}>Convert To GRA</DropdownItem>
              <DropdownItem onClick={handleChangeStatus}>Change Status</DropdownItem>
              <DropdownItem onClick={handleRepeatPurchaseOrder}>Repeat Purchase Order</DropdownItem>
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
            <th>BalanceAmount</th>
          </tr>
        </thead>
        <tbody>
          {goodsReturns.length > 0 ? goodsReturns.map((item) => (
            <tr key={item.purchase_debit_note_id}>
              <td>
                <Input
                  type="checkbox"
                  onChange={(e) => {
                    const tranNo = item.tran_no;
                    setSelectedTranNos(prev =>
                      e.target.checked ? [...prev, tranNo] : prev.filter(no => no !== tranNo)
                    );
                  }}
                />
              </td>
              <td><Link to={`/PurchaseDebitNoteEdit/${item.purchase_debit_note_id}`}>{item.tran_no}</Link></td>
              <td>{moment(item.tran_date).format('YYYY-MM-DD')}</td>
              <td>{item.company_name}</td>
              <td>{item.status}</td>
              <td>{item.invoice_no}</td>
              <td>{item.sub_total}</td>
              <td>{item.gst}</td>
              <td>{item.net_total}</td>
              <td>{item.balance_amount}</td>
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

      {/* Change Status Modal */}
      <Modal isOpen={statusModal} toggle={() => setStatusModal(false)}>
        <ModalHeader>Change PO Status</ModalHeader>
        <ModalBody>
          <Input type="select" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
            <option>Open</option>
            <option>Closed</option>
            <option>Cancelled</option>
          </Input>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={submitNewStatus}>Update</Button>
          <Button color="secondary" onClick={() => setStatusModal(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default PurchaseDebitNote;
