import React, { useEffect, useState, useContext } from 'react';
import * as Icon from 'react-feather';
import { Input, Button } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import $ from 'jquery';
import readXlsxFile from 'read-excel-file';
import 'datatables.net-buttons/js/buttons.colVis';
import 'datatables.net-buttons/js/buttons.flash';
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.print';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import AppContext from '../../context/AppContext';
import api from '../../constants/api';
import message from '../../components/Message';
import { columns } from '../../data/Tender/InventoryData';
import ViewAdjustStockHistoryModal from '../../components/Inventory/ViewAdjustStockHistoryModal';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import CommonTable from '../../components/CommonTable';
import creationdatetime from '../../constants/creationdatetime';

function Inventory() {
  // State variables
  const [stockinputOpen, setStockinputOpen] = useState(false);
  const [inventories, setInventories] = useState([]);
  const [modalId, setModalId] = useState(null);
  const [adjustStockHistoryModal, setAdjustStockHistoryModal] = useState(false);
  const [stockChangeId, setStockChangeId] = useState();
  const [inventoryStock, setInventoryStock] = useState({
    inventory_id: null,
    stock: null,
  });
  const [loading, setLoading] = useState(false);
  const [adjuststockDetails, setAdjuststockDetails] = useState({
    inventory_id: null,
    product_id: null,
    adjust_stock: 0,
    modified_by: '',
    created_by: '',
    current_stock: null,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  //navigate
  const navigate = useNavigate();
  const { loggedInuser } = useContext(AppContext);
  // Get All inventories
  const getAllinventories = () => {
    setLoading(true);
    api
      .get('/inventory/getinventoryMain')
      .then((res) => {
        setLoading(false);
        setInventories(res.data.data);
      })
      .catch(() => {
        message('Inventory Data Not Found', 'info');
        setLoading(false);
      });
  };
  //handle change
  const handleStockinput = (e, element) => {
    setInventoryStock({
      inventory_id: element.inventory_id,
      stock: e.target.value,
    });
    
  
    const adjustedStockValue = parseFloat(e.target.value);
    const currentStockValue = parseFloat(element.stock) || 0; // If element.stock is null, set it to 0
  
    const adjustStock = adjustedStockValue - currentStockValue;
  
    setAdjuststockDetails({
      inventory_id: element.inventory_id,
      product_id: element.productId,
      adjust_stock: adjustStock,
      modified_by: '',
      created_by: '',
      current_stock: currentStockValue,
    });
  };
   // TRIGGER TO IMPORT EXCEL SHEET
   const importExcel = () => {
    $('#import_excel').trigger('click');
  }

  // UPLOAD FILE ON THER SERVER
  const uploadOnServer = (arr) => {
      api.post('/inventory/import/excel', {data: JSON.stringify(arr)})
      .then(() => {
        message('File uploaded successfully', 'success');
        $('#upload_file').val(null);
      })
      .catch((err) => {
        message('Failed to upload.', 'error');
        console.log(err.stack);
        console.log('err.response', err.response)
        console.log('err.request', err.request)
        console.log('err.config', err.config)
      });
  }

  // PROCESSING AND FORMATTING THE DATA
  const processData = (rows) => {
    const arr = [];
    rows.shift();

    for ( let x = 0; x < rows.length; x++ ) {
      arr.push(
        {
          ProductCode: rows[x][0],
          ProductName: rows[x][1],
          Description: rows[x][2],
          Price: rows[x][3],
          Unit: rows[x][4],
          Category: rows[x][5],
          Stock: rows[x][6]
         
        }
      )
    }

    uploadOnServer(arr);
  }

  // IMPORTING EXCEL FILE
  const importExcelFile = (e) => {
    console.log(e.target.id)
    const reader = new FileReader();
    reader.onload = () => {
      console.log(reader.readyState)
      if (reader.readyState === 2) {
        readXlsxFile(e.target.files[0])
          .then((rows) => {
            processData(rows);
            message('Uploading File On The Server', 'info');
          })
          .finally(() => {
            $('#upload_file').val(null);
          }).catch(
            err => console.log(err)
          );
      }
    };
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  //adjust stock
  const adjuststock = () => {
    adjuststockDetails.creation_date = creationdatetime;
    adjuststockDetails.created_by = loggedInuser.first_name;
    api
      .post('/inventory/insertadjust_stock_log', adjuststockDetails)
      .then(() => {
        message('Stock updated successfully', 'success');
        getAllinventories();
        navigate('/inventory');
      })
      .catch(() => {
        message('Unable to edit record.', 'error');
      });
  };
  //update stock
  const updateStockinInventory = () => {
    inventoryStock.modification_date = creationdatetime;
    inventoryStock.modified_by = loggedInuser.first_name;
    api
      .post('/inventory/updateInventoryStock', inventoryStock)
      .then(() => {
        message('Stock updated successfully', 'success');
        getAllinventories();
        navigate('/inventory');
      })
      .catch(() => {
        message('Unable to edit record.', 'error');
      });
  };

  useEffect(() => {
    setTimeout(() => {
    
    }, 1000);
  }, []);
  useEffect(() => {
    getAllinventories();
  }, []);

  // Pagination and search logic
  const filteredInventories = searchTerm
    ? inventories.filter(
        (item) =>
          (item.product_name && item.product_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.inventory_code && item.inventory_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.product_code && item.product_code.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : inventories;
  const totalItems = filteredInventories.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / entriesPerPage));
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = Math.min(startIndex + entriesPerPage, totalItems);
  const paginatedData = filteredInventories.slice(startIndex, endIndex);
  const getPageNumbers = () => {
    const pages = [];
    const maxToShow = 5;
    if (totalPages <= maxToShow) {
      for (let i = 1; i <= totalPages; i += 1) pages.push(i);
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, currentPage + 2);
      if (start > 1) pages.push(1, '...');
      for (let i = start; i <= end; i += 1) pages.push(i);
      if (end < totalPages) pages.push('...', totalPages);
    }
    return pages;
  };

  return (
    <div className="MainDiv">
      <ToastContainer></ToastContainer>
      <div className="pt-xs-25">
        <BreadCrumbs />
        {/* Search and controls */}
        <div className="d-flex align-items-center mb-3 gap-2">
          <Input
            type="text"
            placeholder="Search by Product Name, Inventory Code, Product Code"
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            style={{ width: 300 }}
            className="me-2"
          />
          <label htmlFor="entriesDropdown" className="me-2 mb-0">
            Show
            <select
              id="entriesDropdown"
              className="form-select ms-2"
              style={{ width: 100, display: 'inline-block' }}
              value={entriesPerPage}
              onChange={e => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              {[10, 25, 50, 100].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </label>
          <span className="mb-0">entries</span>
          <Button color="primary" className="shadow-none mr-2" onClick={() => importExcel()}>
            Import
          </Button>
          <input type='file' style={{display: 'none'}} id="import_excel" onChange={importExcelFile} />
        </div>
        <CommonTable
          loading={loading}
          title="Inventory List"
        >
          <thead>
            <tr>
              {columns.map((cell) => {
                return <td key={cell.id}>{cell.name}</td>;
              })}
            </tr>
          </thead>
          <tbody>
            {paginatedData && paginatedData.length > 0 ? (
              paginatedData.map((element, i) => {
                return (
                  <tr key={element.inventory_id}>
                    <td>{startIndex + i + 1}</td>
                    <td>
                      <Link to={`/inventoryEdit/${element.inventory_id}`}>
                        <Icon.Edit2 />
                      </Link>
                    </td>
                    <td>{element.inventory_code}</td>
                    <td>{element.product_name}</td>
                    <td>{element.product_type}</td>
                    <td>{element.product_code}</td>
                    <td>{element.unit}</td>
                    <td>{element.stock}</td>
                    {stockinputOpen && stockChangeId === element.inventory_id ? (
                      <td>
                        <Input
                          type="text"
                          defaultValue={element.stock}
                          onChange={(e) => handleStockinput(e, element)}
                        />
                        <Button
                          color="primary"
                          className="shadow-none"
                          onClick={() => {
                            adjuststock(element);
                            updateStockinInventory();
                            setStockinputOpen(false);
                          }}
                        >
                          save
                        </Button>
                      </td>
                    ) : (
                      <td>
                        <span
                          onClick={() => {
                            setStockChangeId(element.inventory_id);
                            setStockinputOpen(true);
                          }}
                        >
                          <Link to="">Adjust Stock</Link>
                        </span>
                      </td>
                    )}
                    <td>
                      <span
                        onClick={() => {
                          setAdjustStockHistoryModal(true);
                          setModalId(element.inventory_id);
                        }}
                      >
                        <Link to="">view</Link>
                      </span>
                    </td>
                   {adjustStockHistoryModal && modalId === element.inventory_id && <ViewAdjustStockHistoryModal
                      adjustStockHistoryModal={adjustStockHistoryModal}
                      setAdjustStockHistoryModal={setAdjustStockHistoryModal}
                      inventoryId={modalId}
                    />}
                    <td>{element.minimum_order_level}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center">
                  {loading ? 'Loading...' : 'No inventory found'}
                </td>
              </tr>
            )}
          </tbody>
        </CommonTable>
        {/* Pagination controls */}
        <div className="d-flex justify-content-between align-items-center mt-2">
          <div>
            {totalItems > 0 ? `Showing ${startIndex + 1} to ${endIndex} of ${totalItems} entries` : 'Showing 0 to 0 of 0 entries'}
          </div>
          <div className="d-flex align-items-center gap-2">
            <Button color="light" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>First</Button>
            <Button color="light" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>Prev</Button>
            {getPageNumbers().map((p) => (
              typeof p === 'string' ? (
                <span key={`ellipsis-${p}`} style={{ padding: '0 6px' }}>{p}</span>
              ) : (
                <Button key={`page-${p}`} color={p === currentPage ? 'primary' : 'light'} size="sm" onClick={() => setCurrentPage(p)}>{p}</Button>
              )
            ))}
            <Button color="light" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>Next</Button>
            <Button color="light" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>Last</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inventory;
