/*eslint-disable*/
import React, { useState, useEffect } from 'react';
import {
  Button, Input, Table, Row, Col, DropdownToggle, DropdownMenu,
  DropdownItem, ButtonDropdown, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import api from '../../constants/api';
import PdfPurchaseInvoiceList from '../../components/PDF/PdfPurchaseInvoiceList';
import message from '../../components/Message';

const PurchaseInvoice = () => {
  const [filters, setFilters] = useState({
    tran_no: '',
    from_date: '',
    to_date: '',
    status: '',
    head_office: '',
    supplier: '',
    invoice_no: '',
    payment_status: ''
  });

  const [goodsReturns, setGoodsReturns] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPurchaseInvoiceIds, setSelectedPurchaseInvoiceIds] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [statusModal, setStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('Open');

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await api.get('/purchaseorder/getFilteredPurchaseInvoice', {
        params: {
          tran_no: filters.tran_no || '',
          invoice_no: filters.invoice_no || '',
          from_date: filters.from_date || '',
          to_date: filters.to_date || '',
          status: filters.status || '',
          supplier_id: filters.supplier || '',
          head_office: filters.head_office || '',
          payment_status: filters.payment_status || '',
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
    api.get('/supplier/getSupplier')
      .then(res => setSuppliers(res.data.data))
      .catch(err => console.error(err));
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
    navigate('/PurchaseInvoiceDetails'); // Example
  };

  const handlePrintwithoutPrice = async () => {
    if (selectedPurchaseInvoiceIds.length !== 1) {
      alert('Select a single Purchase Order to print.');
      return;
    }
    const purchaseInvoiceId = selectedPurchaseInvoiceIds[0];
    const res = await api.get(`/purchaseorder/getPoByTranNo/${purchaseInvoiceId}`);
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
    if (selectedPurchaseInvoiceIds.length !== 1) {
      alert('Please select one PO to convert.');
      return;
    }
    try {
      await api.post('/purchaseorder/convertToGRA', { tran_no: selectedPurchaseInvoiceIds[0] });
      alert('Converted to GRA!');
    } catch (err) {
      console.error(err);
      alert('Conversion failed');
    }
  };

  const handleChangeStatus = () => {
    if (selectedPurchaseInvoiceIds.length !== 1) {
      alert('Select one PO to change status');
      return;
    }
    setStatusModal(true);
  };

  const submitNewStatus = async () => {
    try {
      await api.post('/purchaseorder/changeStatus', {
        tran_no: selectedPurchaseInvoiceIds[0],
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
    if (selectedPurchaseInvoiceIds.length !== 1) {
      alert('Select one PO to repeat');
      return;
    }
    try {
      const res = await api.post('purchaseorder/repeatGoodsReceipt', {
        tran_no: selectedPurchaseInvoiceIds[0]
      });
      alert('Repeated successfully');
      navigate(`/PurchaseOrderEdit/${res.data.new_id}`);
    } catch (err) {
      console.error(err);
      alert('Repeat failed');
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedPurchaseInvoiceIds.length === 0) {
      alert('Please select at least one record to delete.');
      return;
    }
    if (window.confirm('Are you sure you want to delete the selected records?')) {
      try {
        await Promise.all(selectedPurchaseInvoiceIds.map(purchaseInvoiceId =>
          api.post('/purchaseorder/deletePurchaseInvoice', { purchase_invoice_id: purchaseInvoiceId })
        ));
        message('Invoices deleted successfully!','success');
        setSelectedPurchaseInvoiceIds([]);
        fetchData();
      } catch (err) {
        console.error(err);
        alert('Failed to delete selected records.');
      }
    }
  };

  const handleSelectAll = (e) => {
    setSelectAll(e.target.checked);
    if (e.target.checked) {
      setSelectedPurchaseInvoiceIds(goodsReturns.map(item => item.purchase_invoice_id));
    } else {
      setSelectedPurchaseInvoiceIds([]);
    }
  };

  const handleIndividualCheckboxChange = (e, purchaseInvoiceId) => {
    if (e.target.checked) {
      setSelectedPurchaseInvoiceIds(prev => [...prev, purchaseInvoiceId]);
    } else {
      setSelectedPurchaseInvoiceIds(prev => prev.filter(id => id !== purchaseInvoiceId));
    }
  };

  return (
    <div className="p-4 bg-light">
      <ToastContainer/>
      <h4 className="mb-4">Purchase Invoice Management</h4>

      {/* <Row className="mb-3">
        <Col md={2}><Input name="tran_no" placeholder="Tran No" value={filters.tran_no} onChange={handleFilterChange} /></Col>
        <Col md={2}><Input type="date" name="from_date" value={filters.from_date} onChange={handleFilterChange} /></Col>
        <Col md={2}><Input type="date" name="to_date" value={filters.to_date} onChange={handleFilterChange} /></Col>
        <Col md={2}>
          <Input type="select" name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">Open</option>
            <option>Open</option>
            <option>Closed</option>
            <option>Cancelled</option>
          </Input>
        </Col>
        <Col md={2}>
          <Button color="primary" onClick={handleSearch}><i className="fa fa-search" /></Button>
        </Col>
        <Col md={2}>
          <Button color="secondary" ><i className="fa fa-print" /> <PdfPurchaseInvoiceList ids={selectedPurchaseInvoiceIds} /> </Button>
          <Button color="danger" onClick={handleDeleteSelected}><i className="fa fa-trash" /></Button>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={2}>
          <Input type="select" name="head_office" value={filters.head_office} onChange={handleFilterChange}>
            <option value="">Head Office</option>
            <option>Head Office</option>
            <option>Branch Office</option>
          </Input>
        </Col>
        <Col md={2}>
          <Input type="select" name="supplier" value={filters.supplier} onChange={handleFilterChange}>
            <option value="">Select All Supplier</option>
            {suppliers.map(sup => (
              <option key={sup.supplier_id} value={sup.supplier_id}>{sup.company_name}</option>
            ))}
          </Input>
        </Col>
        <Col md={2}><Input name="invoice_no" placeholder="Invoice No" value={filters.invoice_no} onChange={handleFilterChange} /></Col>
        <Col md={2}>
          <Input type="select" name="payment_status" value={filters.payment_status} onChange={handleFilterChange}>
            <option value="">Not Paid</option>
            <option>Paid</option>
            <option>Not Paid</option>
          </Input>
        </Col>
        <Col md={4} className="text-right">
          <ButtonDropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
            <Button color="primary" onClick={handleNewTransactionClick}>New Transaction</Button>
            <DropdownToggle caret color="primary" />
            <DropdownMenu end>
              <DropdownItem onClick={() => navigate('/MakePayment')}>Make Payment</DropdownItem>
              <DropdownItem onClick={handleRepeatPurchaseOrder}>Repeat Purchase Invoice</DropdownItem>
              <DropdownItem onClick={() => navigate('/Recap')}>Recap</DropdownItem>
              <DropdownItem onClick={() => navigate('/AddOperationCost')}>Add Operation Cost</DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
        </Col>
      </Row> */}
      <Row className="mb-2 align-items-center">
  <Col md={2}>
    <Input
      bsSize="sm"
      name="tran_no"
      placeholder="Tran No"
      value={filters.tran_no}
      onChange={handleFilterChange}
    />
  </Col>
  <Col md={2}>
    <Input
      bsSize="sm"
      type="date"
      name="from_date"
      value={filters.from_date}
      onChange={handleFilterChange}
    />
  </Col>
  <Col md={2}>
    <Input
      bsSize="sm"
      type="date"
      name="to_date"
      value={filters.to_date}
      onChange={handleFilterChange}
    />
  </Col>
  <Col md={2}>
    <Input
      bsSize="sm"
      type="select"
      name="status"
      value={filters.status}
      onChange={handleFilterChange}
    >
      <option value="">All Status</option>
      <option>Open</option>
      <option>Closed</option>
      <option>Cancelled</option>
    </Input>
  </Col>
  <Col md={2} className="d-flex gap-2">
    <Button color="primary" size="sm" onClick={handleSearch}>
      <i className="fa fa-search" />
    </Button>
    <Button color="secondary" size="sm" onClick={() => {
      if (selectedPurchaseInvoiceIds.length===0) {
       alert('Please select at least one record to print.');
      } 
    }}>
      <i className="fa fa-print" />
       {selectedPurchaseInvoiceIds.length>0 && <PdfPurchaseInvoiceList ids={selectedPurchaseInvoiceIds} />}
    </Button>
    <Button color="danger" size="sm" onClick={handleDeleteSelected}>
      <i className="fa fa-trash" />
    </Button>
  </Col>
</Row>

<Row className="mb-2 align-items-center">
  <Col md={2}>
    <Input
      bsSize="sm"
      type="select"
      name="head_office"
      value={filters.head_office}
      onChange={handleFilterChange}
    >
      <option value="">Head Office</option>
      <option>Head Office</option>
      <option>Branch Office</option>
    </Input>
  </Col>
  <Col md={2}>
    <Input
      bsSize="sm"
      type="select"
      name="supplier"
      value={filters.supplier}
      onChange={handleFilterChange}
    >
      <option value="">All Supplier</option>
      {suppliers.map(sup => (
        <option key={sup.supplier_id} value={sup.supplier_id}>
          {sup.company_name}
        </option>
      ))}
    </Input>
  </Col>
  <Col md={2}>
    <Input
      bsSize="sm"
      name="invoice_no"
      placeholder="Invoice No"
      value={filters.invoice_no}
      onChange={handleFilterChange}
    />
  </Col>
  <Col md={2}>
    <Input
      bsSize="sm"
      type="select"
      name="payment_status"
      value={filters.payment_status}
      onChange={handleFilterChange}
    >
      <option value="">All Payments</option>
      <option>Paid</option>
      <option>Not Paid</option>
    </Input>
  </Col>
  <Col md={4} className="text-right">
    <ButtonDropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
      <Button color="primary" size="sm" onClick={handleNewTransactionClick}>
        New Transaction
      </Button>
      <DropdownToggle caret color="primary" size="sm" />
      <DropdownMenu end>
        <DropdownItem onClick={() => navigate('/MakePayment')}>Make Payment</DropdownItem>
        <DropdownItem onClick={handleRepeatPurchaseOrder}>Repeat Purchase Invoice</DropdownItem>
        <DropdownItem onClick={() => navigate('/Recap')}>Recap</DropdownItem>
        <DropdownItem onClick={() => navigate('/AddOperationCost')}>Add Operation Cost</DropdownItem>
      </DropdownMenu>
    </ButtonDropdown>
  </Col>
</Row>


      <Table bordered hover size="sm" className="bg-white">
        <thead>
          <tr>
            <th>
              <Input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </th>
            <th>Tran No</th>
            <th>Tran Date</th>
            <th>Supplier</th>
            <th>InvoiceNo</th>
            <th>SubTotal</th>
            <th>Tax</th>
            <th>NetTotal</th>
            <th>PaidAmount</th>
            <th>BalanceAmount</th>
          </tr>
        </thead>
        <tbody>
          {goodsReturns.length > 0 ? goodsReturns.map((item) => (
            <tr key={item.purchase_invoice_id}>
              <td>
                <Input
                  type="checkbox"
                  checked={selectedPurchaseInvoiceIds.includes(item.purchase_invoice_id)}
                  onChange={(e) => handleIndividualCheckboxChange(e, item.purchase_invoice_id)}
                />
              </td>
              <td><Link to={`/PurchaseInvoiceEdit/${item.purchase_invoice_id}`}>{item.tran_no}</Link></td>
              <td>{moment(item.tran_date).format('YYYY-MM-DD')}</td>
              <td>{item.company_name}</td>
              <td>{item.invoice_no}</td>
              <td>{item.sub_total}</td>
              <td>{item.gst}</td>
              <td>{item.net_total}</td>
              <td>{item.paid_amount}</td>
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

export default PurchaseInvoice;
