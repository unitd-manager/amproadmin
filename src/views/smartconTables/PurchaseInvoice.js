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
  const [selectAll, setSelectAll] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [suppliers, setSuppliers] = useState([]);

  // 🔥 Modals
  const [paymentModal, setPaymentModal] = useState(false);
  const [operationModal, setOperationModal] = useState(false);

  const [paymentAmount, setPaymentAmount] = useState('');
  const [operationCost, setOperationCost] = useState('');

  const navigate = useNavigate();
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // ================= FETCH =================

  const fetchData = async () => {
    try {
      const res = await api.get('/purchaseorder/getFilteredPurchaseInvoice', {
        params: {
          ...filters
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
      .catch(console.error);

  }, [currentPage]);

  // ================= FILTERS =================

  const handleFilterChange = e =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleSearch = () => {
    setCurrentPage(1);
    fetchData();
  };

  const handlePrev = () => setCurrentPage(p => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage(p => p + 1);

  const handleNewTransactionClick = () =>
    navigate('/PurchaseInvoiceDetails');

  // ================= SELECTION =================

  const handleSelectAll = e => {
    setSelectAll(e.target.checked);
    setSelectedPurchaseInvoiceIds(
      e.target.checked ? goodsReturns.map(i => i.purchase_invoice_id) : []
    );
  };

  const handleIndividualCheckboxChange = (e, id) => {
    if (e.target.checked)
      setSelectedPurchaseInvoiceIds(prev => [...prev, id]);
    else
      setSelectedPurchaseInvoiceIds(prev => prev.filter(i => i !== id));
  };

  useEffect(() => {
    setSelectAll(
      selectedPurchaseInvoiceIds.length > 0 && selectedPurchaseInvoiceIds.length === goodsReturns.length
    );
  }, [selectedPurchaseInvoiceIds, goodsReturns]);

  // ================= REPEAT =================

  const repeatPurchaseInvoice = () => {
    if (selectedPurchaseInvoiceIds.length === 0) {
      alert('Select at least one invoice');
      return;
    }

    api.post('/purchaseorder/repeatPurchaseInvoice', {
      purchase_invoice_ids: selectedPurchaseInvoiceIds
    })
      .then(() => {
        message('Purchase invoices repeated successfully', 'success');
        fetchData();
      })
      .catch(() => alert('Repeat failed'));
  };

  // ================= DELETE =================

  const handleDeleteSelected = async () => {

    if (selectedPurchaseInvoiceIds.length === 0) {
      alert('Select records to delete');
      return;
    }

    if (!window.confirm('Delete selected invoices?')) return;

    await Promise.all(
      selectedPurchaseInvoiceIds.map(id =>
        api.post('/purchaseorder/deletePurchaseInvoice', {
          purchase_invoice_id: id
        })
      )
    );

    message('Deleted successfully', 'success');
    setSelectedPurchaseInvoiceIds([]);
    fetchData();
  };

  // ================= MAKE PAYMENT =================

  const handleMakePayment = () => {
    if (selectedPurchaseInvoiceIds.length === 0) {
      alert('Select invoice(s)');
      return;
    }
    setPaymentModal(true);
  };

  const submitPayment = async () => {
    try {

      await api.post('/purchaseorder/makePaymentPurchaseInvoice', {
        purchase_invoice_ids: selectedPurchaseInvoiceIds,
        amount: paymentAmount
      });

      message('Payment recorded', 'success');

      setPaymentModal(false);
      setPaymentAmount('');
      fetchData();

    } catch {
      alert('Payment failed');
    }
  };

  // ================= OPERATION COST =================

  const handleAddOperationCost = () => {
    if (selectedPurchaseInvoiceIds.length === 0) {
      alert('Select invoice(s)');
      return;
    }
    setOperationModal(true);
  };

  const submitOperationCost = async () => {
    try {

      await api.post('/purchaseorder/addOperationCostPurchaseInvoice', {
        purchase_invoice_ids: selectedPurchaseInvoiceIds,
        cost: operationCost
      });

      message('Operation cost added', 'success');

      setOperationModal(false);
      setOperationCost('');
      fetchData();

    } catch {
      alert('Failed to add cost');
    }
  };

  // ================= RECAP =================

  const handleRecap = async () => {

    if (selectedPurchaseInvoiceIds.length === 0) {
      alert('Select invoice(s)');
      return;
    }

    try {

      await api.post('/purchaseorder/recapPurchaseInvoice', {
        purchase_invoice_ids: selectedPurchaseInvoiceIds
      });

      message('Recap completed', 'success');
      fetchData();

    } catch {
      alert('Recap failed');
    }
  };

  // ================= UI =================

  return (
    <div className="p-4 bg-light">

      <ToastContainer />
      <h4>Purchase Invoice Management</h4>

      {/* ===== FILTER ROW ===== */}

      <Row className="mb-2">

        <Col md={2}>
          <Input bsSize="sm" name="tran_no"
            placeholder="Tran No"
            value={filters.tran_no}
            onChange={handleFilterChange} />
        </Col>

        <Col md={2}>
          <Input bsSize="sm" type="date"
            name="from_date"
            value={filters.from_date}
            onChange={handleFilterChange} />
        </Col>

        <Col md={2}>
          <Input bsSize="sm" type="date"
            name="to_date"
            value={filters.to_date}
            onChange={handleFilterChange} />
        </Col>

        <Col md={2}>
          <Input bsSize="sm" type="select"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}>
            <option value="">All Status</option>
            <option>Open</option>
            <option>Closed</option>
            <option>Cancelled</option>
          </Input>
        </Col>

        <Col md={2}>
          <div style={{ display: 'flex', flexDirection: 'row', gap: 8, alignItems: 'center', whiteSpace: 'nowrap' }}>
            <Button size="sm" color="primary" onClick={handleSearch} style={{ display: 'inline-flex' }}>
              <i className="fa fa-search" />
            </Button>

            <Button color="secondary" style={{ display: 'inline-flex' }}>
              <i className="fa fa-print" />
              <PdfPurchaseInvoiceList ids={selectedPurchaseInvoiceIds} />
            </Button>

            <Button color="danger" onClick={handleDeleteSelected} style={{ display: 'inline-flex' }}>
              <i className="fa fa-trash" />
            </Button>
          </div>
        </Col>

      </Row>

      {/* ===== ACTION ROW ===== */}

      <Row className="mb-2">

        <Col md={8} />

        <Col md={4} className="text-right">

          <ButtonDropdown isOpen={dropdownOpen} toggle={toggleDropdown}>

            <Button size="sm" color="primary"
              onClick={handleNewTransactionClick}>
              New Transaction
            </Button>

            <DropdownToggle caret size="sm" color="primary" />

            <DropdownMenu end>

              <DropdownItem onClick={handleMakePayment}>
                Make Payment
              </DropdownItem>

              <DropdownItem onClick={repeatPurchaseInvoice}>
                Repeat Invoice
              </DropdownItem>

              <DropdownItem onClick={handleRecap}>
                Recap
              </DropdownItem>

              <DropdownItem onClick={handleAddOperationCost}>
                Add Operation Cost
              </DropdownItem>

            </DropdownMenu>

          </ButtonDropdown>

        </Col>

      </Row>

      {/* ===== TABLE ===== */}

      <Table className="bg-white">

        <thead>
          <tr>
            <th>
              <Input type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll} />
            </th>
            <th>Tran No</th>
            <th>Date</th>
            <th>Supplier</th>
            <th>Invoice</th>
            <th>Net Total</th>
            <th>Paid</th>
            <th>Balance</th>
          </tr>
        </thead>

        <tbody>
          {goodsReturns.map(item => (

            <tr key={item.purchase_invoice_id}>

              <td>
                <Input type="checkbox"
                  checked={selectedPurchaseInvoiceIds.includes(item.purchase_invoice_id)}
                  onChange={e =>
                    handleIndividualCheckboxChange(e, item.purchase_invoice_id)
                  } />
              </td>

              <td>
                <Link to={`/PurchaseInvoiceEdit/${item.purchase_invoice_id}`}>
                  {item.tran_no}
                </Link>
              </td>

               <td>
                              {item?.tran_date && moment(item.tran_date).isValid()
                                ? moment(item.tran_date).format('YYYY-MM-DD')
                                : ''}
                            </td>

              <td>{item.company_name}</td>
              <td>{item.invoice_no}</td>
              <td>{item.net_total}</td>
              <td>{item.paid_amount}</td>
              <td>{item.balance_amount}</td>

            </tr>

          ))}
        </tbody>

      </Table>

      {/* ===== PAYMENT MODAL ===== */}

      <Modal isOpen={paymentModal} toggle={() => setPaymentModal(false)}>
        <ModalHeader>Make Payment</ModalHeader>
        <ModalBody>
          <Input type="number"
            placeholder="Amount"
            value={paymentAmount}
            onChange={e => setPaymentAmount(e.target.value)} />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={submitPayment}>Submit</Button>
          <Button onClick={() => setPaymentModal(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>

      {/* ===== OPERATION COST MODAL ===== */}

      <Modal isOpen={operationModal} toggle={() => setOperationModal(false)}>
        <ModalHeader>Add Operation Cost</ModalHeader>
        <ModalBody>
          <Input type="number"
            placeholder="Cost"
            value={operationCost}
            onChange={e => setOperationCost(e.target.value)} />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={submitOperationCost}>Add</Button>
          <Button onClick={() => setOperationModal(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>

    </div>
  );
};

export default PurchaseInvoice;