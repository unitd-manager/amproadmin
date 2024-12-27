import React, { useEffect, useState } from 'react';
import * as Icon from 'react-feather';
import { Button, Row, Col } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import 'datatables.net-buttons/js/buttons.colVis';
import 'datatables.net-buttons/js/buttons.flash';
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.print';
import $ from 'jquery';
import readXlsxFile from 'read-excel-file';
import { Link} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import api from '../../constants/api';
import message from '../../components/Message';
import { columns } from '../../data/Tender/InventoryData';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import CommonTable from '../../components/CommonTable';
// import ViewAdjustStockHistoryModal from '../../components/Inventory/ViewAdjustStockHistoryModal';

function Inventory() {
  //statevariables
  // const [stockinputOpen, setStockinputOpen] = useState(false);
  const [inventories, setInventories] = useState([]);
  // const [modalId, setModalId] = useState(null);
  // const [adjustStockHistoryModal, setAdjustStockHistoryModal] = useState(false);
  // const [stockChangeId, setStockChangeId] = useState();
  // const [inventoryStock, setInventoryStock] = useState({
  //   inventory_id: null,
  //   stock: null,
  // });
  const [loading, setLoading] = useState(false);

  // const [adjuststockDetails, setAdjuststockDetails] = useState({
  //   inventory_id: null,
  //   product_id: null,
  //   adjust_stock: 0,
  //   modified_by: '',
  //   created_by: '',
  //   current_stock: null,
  // });
  // //navigate
  // const navigate = useNavigate();
  const [progress, setProgress] = useState('');

  const processDirectory = async (directoryHandle, parentPath, formData) => {
    const entries = Array.from(directoryHandle.values()); // Get all entries as an array
    const promises = entries.map(async (entry) => {
        const currentPath = parentPath ? `${parentPath}/${entry.name}` : entry.name;

        if (entry.kind === 'file') {
            const file = await entry.getFile();
            formData.append('files', file, currentPath); // Include the folder path in the file name
        } else if (entry.kind === 'directory') {
            await processDirectory(entry, currentPath, formData);
        }
    });

    await Promise.all(promises); // Process all entries concurrently
};

const uploadFolder = async (formData) => {
    setProgress('Uploading folder...');
    try {
        const response = await api.post('/inventory/upload-folder', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log('Upload response:', response.data);
        setProgress('Upload complete!');
    } catch (error) {
        console.error('Error uploading folder:', error.message);
        setProgress('Upload failed!');
    }
};
  const handleFolderSelect = async () => {
      try {
          const directoryHandle = await window.showDirectoryPicker();
          const formData = new FormData();

          // Recursively process the directory and append files to FormData
          await processDirectory(directoryHandle, '', formData);

          // Send the FormData to the backend
          await uploadFolder(formData);
      } catch (error) {
          console.error('Error selecting or uploading folder:', error);
      }
  };



  // // Get All inventories
  const getAllinventories = () => {
    setLoading(false);
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

  useEffect(() => {
    setTimeout(() => {
      $('#example').DataTable({
        pagingType: 'full_numbers',
        pageLength: 20,
        processing: true,
        dom: 'Bfrtip',
        buttons: [
          {
            extend: 'print',
            text: 'Print',
            className: 'shadow-none btn btn-primary',
          },
        ],
      });
    }, 1000);

    getAllinventories();
  }, []);
  //handle change
  // const handleStockinput = (e, element) => {
  //   setInventoryStock({
  //     inventory_id: element.inventory_id,
  //     stock: e.target.value,
  //   });
  //   inventoryStock.inventory_id = element.inventory_id;
  //   inventoryStock.stock = e.target.value;
  //   const adjustStock = parseFloat(inventoryStock.stock) - parseFloat(element.stock);

  //   setAdjuststockDetails({
  //     inventory_id: element.inventory_id,
  //     product_id: element.productId,
  //     adjust_stock: adjustStock,
  //     modified_by: '',
  //     created_by: '',
  //     current_stock: element.stock,
  //   });
  // };
  // //adjust stock
  // const adjuststock = () => {
  //   api
  //     .post('/inventory/insertadjust_stock_log', adjuststockDetails)
  //     .then(() => {
  //       message('Stock updated successfully', 'success');
  //       getAllinventories();
  //       navigate('/inventory');
  //     })
  //     .catch(() => {
  //       message('Unable to edit record.', 'error');
  //     });
  // };
  // //update stock
  // const updateStockinInventory = () => {
  //   api
  //     .post('/inventory/updateinventoryStock', inventoryStock)
  //     .then(() => {
  //       message('Stock updated successfully', 'success');
  //       getAllinventories();
  //       navigate('/inventory');
  //     })
  //     .catch(() => {
  //       message('Unable to edit record.', 'error');
  //     });
  // };
  // TRIGGER TO IMPORT EXCEL SHEET
  const importExcel = () => {
    $('#import_excel').trigger('click');
  };

  // UPLOAD FILE ON THER SERVER
  const uploadOnServer = (arr) => {
    api
      .post('/inventory/import/excel', { data: JSON.stringify(arr) })
      .then(() => {
        message('File uploaded successfully', 'success');
        $('#upload_file').val(null);
      })
      .catch((err) => {
        message('Failed to upload.', 'error');
        console.log(err.stack);
        console.log('err.response', err.response);
        console.log('err.request', err.request);
        console.log('err.config', err.config);
      });
  };
  const processData = (rows) => {
    const arr = [];
    rows.shift();

    for (let x = 0; x < rows.length; x++) {
      arr.push({
        ProductCode: rows[x][0],
        ProductName: rows[x][1],
        DepartmentName: rows[x][2],
        CategoryName: rows[x][3],
        SubCategoryName: rows[x][4],
        BrandName: rows[x][5],
        SupplierName: rows[x][6],
        PurchaseUOM: rows[x][7],
        SalesUOM: rows[x][8],
        PcsPerCarton: rows[x][9],
        PurchaseUnitCost: rows[x][10],
        RetailPrice: rows[x][11],
        WholesalePrice: rows[x][12],
        CartonPrice: rows[x][13],
        DisplayOrder: rows[x][14],
        ModelNo: rows[x][15],
        Qty: rows[x][16],
      });
    }

    uploadOnServer(arr);
  };

  
  const importExcelFile = (e) => {
    console.log(e.target.id);
    const reader = new FileReader();
    reader.onload = () => {
      console.log(reader.readyState);
      if (reader.readyState === 2) {
        readXlsxFile(e.target.files[0])
          .then((rows) => {
            processData(rows);
            message('Uploading File On The Server', 'info');
          })
          .finally(() => {
            $('#upload_file').val(null);
          })
          .catch((err) => console.log(err));
      }
    };
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  useEffect(() => {
    getAllinventories();
  }, []);

  return (
    <div className="MainDiv">
      <ToastContainer></ToastContainer>
      <div className=" pt-xs-25">
        <BreadCrumbs />
        <div>
            <button type='submit' onClick={handleFolderSelect}>Select and Upload Folder</button>
            <p>{progress}</p>
        </div>
        <CommonTable
          loading={loading}
          title="Inventory List"
          Button={
            <>
              <Row>
                <Col md="6">
                  <Button
                    color="primary"
                    className="shadow-none mr-2"
                    onClick={() => importExcel()}
                  >
                    Import
                  </Button>
                  {/* </Link> */}
                  <input
                    type="file"
                    style={{ display: 'none' }}
                    id="import_excel"
                    onChange={importExcelFile}
                  />
                </Col>
                <Col md="6">
                  <a
                    href="https://foodecom.unitdtechnologies.com/storage/excelsheets/Inventory.xlsx"
                    download
                  >
                    <Button color="primary" className="shadow-none">
                      Sample
                    </Button>
                  </a>
                </Col>
              </Row>
            </>
          }
        >
          <thead>
            <tr>
              {columns.map((cell) => {
                return <td key={cell.id}>{cell.name}</td>;
              })}
            </tr>
          </thead>
          <tbody>
            {inventories &&
              inventories.map((element) => {
                return (
                  <tr key={element.inventory_id}>
                    <td>{element.inventory_id}</td>
                    <td>
                      <Link to={`/inventoryEdit/${element.inventory_id}`}>
                        <Icon.Edit2 />
                      </Link>
                    </td>
                    {/* <td>{element.inventory_code}</td> */}
                    <td>{element.product_name}</td>
                    <td>
                    <Link to={`/productEdit/${element.productId}`}>
                      {element.product_code}
                      </Link>
                      </td>
                    <td>{element.unit}</td>
                    <td>{element.current_stock}</td>
                    {/* {stockinputOpen && stockChangeId === element.inventory_id ? (
                      <td>
                        {' '}
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
                    )} */}
                    {/* <td>
                      <span
                        onClick={() => {
                          setAdjustStockHistoryModal(true);
                          setModalId(element.inventory_id);
                        }}
                      >
                        <Link to="">view</Link>
                      </span>
                    </td> */}
                    {/* <ViewAdjustStockHistoryModal
                      adjustStockHistoryModal={adjustStockHistoryModal}
                      setAdjustStockHistoryModal={setAdjustStockHistoryModal}
                      inventoryId={modalId}
                    /> */}
                    <td>{element.minimum_order_level}</td>
                  </tr>
                );
              })}
          </tbody>
        </CommonTable>
      </div>
    </div>
  );
}

export default Inventory;
