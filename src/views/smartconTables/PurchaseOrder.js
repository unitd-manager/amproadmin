// import React, { useEffect, useState } from 'react';
// import * as Icon from 'react-feather';
// import { Row,Col,Button } from 'reactstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'datatables.net-dt/js/dataTables.dataTables';
// import 'datatables.net-dt/css/jquery.dataTables.min.css';
// //import $ from 'jquery';
// import 'datatables.net-buttons/js/buttons.colVis';
// import 'datatables.net-buttons/js/buttons.flash';
// import 'datatables.net-buttons/js/buttons.html5';
// import 'datatables.net-buttons/js/buttons.print';
// import { Link } from 'react-router-dom';
// import moment from 'moment';
// import api from '../../constants/api';
// import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
// import CommonTable from '../../components/CommonTable';
// import message from '../../components/Message';


// const PurchaseOrder = () => {
//   //All state variable
//   const [purchaseOrder, setPurchaseOrder] = useState(null);
//   const[loading,setLoading]=useState(false);
//   //Getting data from purchaseorder
//   const getpurchaseorder = () => {
//     setLoading(true)
//     api.get('/purchaseorder/TabPurchaseOrder').then((res) => {
//       setPurchaseOrder(res.data.data);
//       setLoading(false)
//     }).catch(()=>{
//       setLoading(false)
//       message('Unable to get Purchase Data')
//     })
//   };
//   useEffect(() => {
//     setTimeout(() => {
     
//     }, 1000);
//     getpurchaseorder();
//   }, []);
// //Structure of purchaseorder list view
//   const columns = [
//     {
//       name: '#',
//       grow: 0,
//       wrap: true,
//       width: '4%',
//     },
//     {
//       name: 'Edit',
//       selector: 'edit',
//       cell: () => <Icon.Edit2 />,
//       grow: 0,
//       width: 'auto',
//       button: true,
//       sortable: false,
//     },
//     {
//       name: 'PO Code',
//       selector: 'po_code',
//       sortable: true,
//       grow: 0,
//       wrap: true,
//     },
//     {
//       name: 'Title',
//       selector: 'title',
//       sortable: true,
//       grow: 2,
//       wrap: true,
//     },
   
//     {
//       name: 'Status',
//       selector: 'status',
//       sortable: true,
//       width: 'auto',
//       grow: 3,

//     },
//     {
//       name: 'PO Date',
//       selector: 'purchase_order_date',
//       sortable: true,
//       width: 'auto',
//       grow: 3,

//     },
//     {
//       name: 'Supplier Invoice Code',
//       selector: 'supplier_inv_code',
//       sortable: true,
//       width: 'auto',
//       grow: 3,

//     },
//     {
//       name: 'Creation Date',
//       selector: 'creation_date',
//       sortable: true,
//       width: 'auto',
//       grow: 3,

//     },
//   ];
//   return (
//     <div className="MainDiv">
//       <div className=" pt-xs-25">
//         <BreadCrumbs/>

//         <CommonTable
//         loading={loading}
//           title="Purchase Order List"
//           Button={
//             <>
//             <Row>
//               <Col md="6">
//             <Link to="/purchaseorderDetails">
//               <Button color="primary" className="shadow-none">
//                 New
//               </Button>
//             </Link>
//             </Col>
//             <Col md="6">
//             <a href="http://43.228.126.245/pyramidapi/storage/excelsheets/PurchaseOrder.xlsx" download>
//              <Button color="primary" className="shadow-none" >
//                Sample
//              </Button>
//              </a>
//              </Col>
//              </Row>
//             </>
//           }
//         >
//                     <thead>
//             <tr>
//               {columns.map((cell) => {
//                 return <td key={cell.name}>{cell.name}</td>;
//               })}
//             </tr>
//           </thead>
//           <tbody>
//             {purchaseOrder &&
//               purchaseOrder.map((element, index) => {
//                 return (
//                   <tr key={element.purchase_order_id}>
//                     <td>{index + 1}</td>
//                     <td>
//                       <Link to={`/purchaseorderEdit/${element.purchase_order_id}`}><Icon.Edit2 />
//                       </Link>
//                     </td>
//                     <td>{element.po_code}</td>
//                     <td>{element.title ? element.title :element.title_field}</td>
//                     <td>{element.status}</td>
//                     <td>{element.purchase_order_date? moment(element.purchase_order_date).format('YYYY-MM-DD'):''}</td>
//                     <td>{element.supplier_inv_code}</td>
//                     <td>{element.creation_date? moment(element.creation_date).format('YYYY-MM-DD'):''}</td>
//                   </tr>
//                 );
//               })}
//           </tbody>
//           </CommonTable>
//       </div>
//     </div>
//   );
// };

// export default PurchaseOrder;

/*eslint-disable*/
import React, { useState, useEffect } from 'react';
import {
  Button, Input, Table, Row, Col, DropdownToggle, DropdownMenu,
  DropdownItem, ButtonDropdown, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../constants/api';

const PurchaseOrder = () => {
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
      const res = await api.get('/purchaseorder/getFilteredPurchaseOrder', {
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
    navigate('/PurchaseOrderDetails'); // Example
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
      <h4 className="mb-4">Purchase Order Management</h4>

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
                    setSelectedTranNos(prev =>
                      e.target.checked ? [...prev, tranNo] : prev.filter(no => no !== tranNo)
                    );
                  }}
                />
              </td>
              <td><Link to={`/PurchaseOrderEdit/${item.purchase_order_id}`}>{item.tran_no}</Link></td>
              <td>{moment(item.tran_date).format('YYYY-MM-DD')}</td>
              <td>{item.company_name}</td>
              <td>{item.status}</td>
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

export default PurchaseOrder;
