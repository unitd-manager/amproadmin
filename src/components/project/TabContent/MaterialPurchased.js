import React from 'react';
import { CardTitle, Row, Col, FormGroup, Input, Button, Table } from 'reactstrap';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import PdfMaterialPurchaseOrder from '../../PDF/PdfMaterialPurchaseOrder';
import PdfMaterialRequestOrder from '../../PDF/PdfMaterialRequestOrder'; 
import api from '../../../constants/api';
import message from '../../Message'; 
/* eslint-disable */
export default function MaterialPurchased({
  addPurchaseOrderModal,
  addMaterialRequestModal,
  setAddPurchaseOrderModal,
  setAddMaterialrequestModal,
  insertDelivery,
  addQtytoStocks,
  tabPurchaseOrderLineItemTable,
  testJsonData,
  testJsonDatass,
  setEditPo,
  setEditMR,
  setPOId,
  setMRId,
  setEditPOLineItemsModal,
  setEditMRLineItemsModal,
  getTotalOfPurchase,
  handleCheck,
  setTransferModal,
  setTransferItem,
  setViewLineModal,
  projectId,
}) {
  MaterialPurchased.propTypes = {
    addPurchaseOrderModal: PropTypes.any,
    addMaterialRequestModal: PropTypes.any,
    setAddPurchaseOrderModal: PropTypes.any,
    setAddMaterialRequestModal: PropTypes.any,
    insertDelivery: PropTypes.any,
    addQtytoStocks: PropTypes.any,
    tabPurchaseOrderLineItemTable: PropTypes.any,
    testJsonData: PropTypes.any,
    testJsonDatass: PropTypes.any,
    setEditPo: PropTypes.any,
    setEditMR: PropTypes.any,
    setPOId: PropTypes.any,
    setMRId: PropTypes.any,
    setEditPOLineItemsModal: PropTypes.any,
    setEditMRLineItemsModal: PropTypes.any,
    getTotalOfPurchase: PropTypes.any,
    handleCheck: PropTypes.any,
    setTransferModal: PropTypes.any,
    setTransferItem: PropTypes.any,
    setViewLineModal: PropTypes.any,
    projectId:PropTypes.any,
  };
  const [checkedItems, setCheckedItems] = React.useState([]);

  const handleCheckchange = (e, item) => {
    const isChecked = e.target.checked;
    setCheckedItems(prevState => 
      isChecked 
        ? [...prevState, item] 
        : prevState.filter(i => i.materials_request_line_items_id !== item.materials_request_line_items_id)
    );
  };
  

  const handleRequestForApproval = () => {
    if (checkedItems.length === 0) {
        Swal.fire('No items selected', 'Please select at least one item to request for approval.', 'warning');
        return;
    }

    console.log('Selected items:', checkedItems);

    const promises = checkedItems.map((item) => {
        if (!item.materials_request_line_items_id) {
            console.error('Missing material_request_line_items_id for item:', item);
            return Promise.reject('Missing material_request_line_items_id');
        }
        return api.post('/materialrequest/updateMaterialRequestItem', {
            materials_request_line_items_id: item.materials_request_line_items_id,
            status: 'Sent for approval'
        });
    });

    Promise.all(promises)
        .then(() => {
            Swal.fire('Success', 'Selected items have been sent for approval.', 'success');
            // Optionally refresh data or update the UI here
        })
        .catch((error) => {
            console.error('Error updating status:', error);
            message('Unable to update the status of selected items', 'error');
        });
};

  const handleApproveMaterialRequest = () => {
    const materialRequestIds = checkedItems.map(item => item.materials_request_line_items_id);
    
    api.post('/materialrequest/approvematerialrequest', {
        matReqProductChecked: materialRequestIds,
        project_id: projectId // Ensure you pass the correct project_id
    })
    .then(() => {
        Swal.fire('Success', 'Material request approved and PO generated.', 'success');
        // Optionally refresh data or update the UI here
    })
    .catch(() => {
        message('Unable to approve material request', 'error');
    });
};

  // Delete Purchase Order
  const deletePurchaseOrder = (deletePurchaseOrderId) => {
    Swal.fire({
      title: `Are you sure? `,
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .post('/purchaseorder/deletePurchaseOrder', { purchase_order_id: deletePurchaseOrderId })
          .then(() => {
            Swal.fire('Deleted!', 'Purchase Order has been deleted.', 'success');
            window.location.reload();
            setViewLineModal(false);
          })
          .catch(() => {
            message('Unable to Delete Purchase Order', 'info');
          });
      }
    });
  };

  // render table in group based on same id's
  function groupBy(arr, key) {
    return arr.reduce((acc, item) => {
      const group = item[key];
      acc[group] = acc[group] || [];
      acc[group].push(item);
      return acc;
    }, {});
  }

  const groups = testJsonData && groupBy(testJsonData, 'purchase_order_id');
  const groupss = testJsonDatass && groupBy(testJsonDatass, 'material_request_id');

  return (
    <>
      <Row className="mb-4">
        <Col md="3">
          <Button
            color="primary"
            className="shadow-none"
            onClick={() => {
              setAddMaterialrequestModal(true);
            }}
          >
            Add Material Request
          </Button>
        </Col>
        <Col md="3">
          <Button
            color="primary"
            className="shadow-none"
            onClick={
              handleRequestForApproval
            }
          >
            Request For Approval
          </Button>
        </Col>
        <Col md="3">
          <Button color="primary" className="shadow-none" onClick={ handleApproveMaterialRequest } >
            Approve Material Request
          </Button>
        </Col>
     
      </Row>
      {testJsonDatass && <>{Object.values(groupss).map((group,index)=>(
      <>
        <Row key={index.toString()}>
          <CardTitle tag="h4" className="border-bottom bg-secondary p-2 mb-0 text-white">
            <Row>
              <Col>{group[0].mr_code}</Col>
              <Col>
                <div className="anchor">
                  <span
                    onClick={() => {
                      setEditMR(true);
                      setMRId(group);
                    }}
                  >
                    <u style={{ color: '#fff' }}> Edit MR </u>
                  </span>
                </div>
              </Col>
              <Col>
                <div className="anchor">
                  <span
                    onClick={() => {
                      setEditMRLineItemsModal(true);
                      setMRId(group);
                    }}
                  >
                    <u style={{ color: '#fff' }}> Edit MR Line Items </u>
                  </span>
                </div>
              </Col>
              <Col>
                <div className="anchor">
                  <span>
                  
          <PdfMaterialRequestOrder
            tabPurchaseOrderLineItemTable={group}
            purchasePoOrder={group[0]}
          ></PdfMaterialRequestOrder>
        
                  </span>
                </div>
              </Col>
            
              <Col className="d-flex justify-content-end">
                <Button
                  color="primary"
                  className="shadow-none"
                  onClick={() => {
                    deletePurchaseOrder(group[0].materials_request_id);
                  }}
                >
                  X
                </Button>
              </Col>
            </Row>
          </CardTitle>
        </Row>
        <Table
          key={group[0].materials_request_id}
          id="example"
          className="display border border-secondary rounded"
        >
          <thead>
            <tr>
              <th>D.O</th>
              <th>Title</th> 
              <th>Qty</th>
              <th>UOM</th>
              <th>Unit Price</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Remarks</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {group.map((item, index) => (
              <tr key={item.materials_request_line_items_id}>
                <td>
                  {' '}
                  <FormGroup>
          {item.status !== 'PO generated' && (
            <Input
              type="checkbox"
              value={item.materials_request_id}
              onChange={(e) => {
                handleCheckchange(e, item);
              }}
            />
          )}
        </FormGroup>
                </td>

                <td>{item.item_title}</td>
                <td>{item.quantity}</td>
                <td>{item.unit}</td>
                <td>{item.cost_price}</td>
                <td>{item.quantity * item.cost_price}</td>
                <td>{item.status}</td>
                <td>{item.remarks}</td>
                <td>
                 
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </>
    ))}</>}
      <Row className="mb-4">
        <Col md="3">
          <Button
            color="primary"
            className="shadow-none"
            onClick={() => {
              setAddPurchaseOrderModal(true);
            }}
          >
            Add Purchase Order
          </Button>
        </Col>
        <Col md="3">
          <Button
            color="primary"
            className="shadow-none"
            onClick={() => {
              insertDelivery();
            }}
          >
            Create Delivery Order
          </Button>
        </Col>
        <Col md="3">
          <Button color="primary" className="shadow-none" onClick={() => addQtytoStocks()}>
            Add all Qty to Stock
          </Button>
        </Col>
     
      </Row>

      {testJsonData && <>{Object.values(groups).map((group,index)=>(
      <>
        <Row key={index.toString()}>
          <CardTitle tag="h4" className="border-bottom bg-secondary p-2 mb-0 text-white">
            <Row>
              <Col>{group[0].company_name}</Col>
              <Col>
                <div className="anchor">
                  <span
                    onClick={() => {
                      setEditPo(true);
                      setPOId(group);
                    }}
                  >
                    <u style={{ color: '#fff' }}> Edit Po </u>
                  </span>
                </div>
              </Col>
              <Col>
                <div className="anchor">
                  <span
                    onClick={() => {
                      setEditPOLineItemsModal(true);
                      setPOId(group);
                    }}
                  >
                    <u style={{ color: '#fff' }}> Edit Line Items </u>
                  </span>
                </div>
              </Col>
              <Col>
                <div className="anchor">
                  <span>
                  
          <PdfMaterialPurchaseOrder
            tabPurchaseOrderLineItemTable={group}
            purchasePoOrder={group[0]}
          ></PdfMaterialPurchaseOrder>
        
                  </span>
                </div>
              </Col>
              <Col> Total : {getTotalOfPurchase(group)}</Col>
              <Col className="d-flex justify-content-end">
                <Button
                  color="primary"
                  className="shadow-none"
                  onClick={() => {
                    deletePurchaseOrder(group[0].purchase_order_id);
                  }}
                >
                  X
                </Button>
              </Col>
            </Row>
          </CardTitle>
        </Row>
        <Table
          key={group[0].purchase_order_id}
          id="example"
          className="display border border-secondary rounded"
        >
          <thead>
            <tr>
              <th>D.O</th>
              <th>Title</th> 
              <th>Qty</th>
              <th>UOM</th>
              <th>Unit Price</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Remarks</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {group.map((item, index) => (
              <tr key={item.po_product_id}>
                <td>
                  {' '}
                  <FormGroup>
                    <Input
                      type="checkbox"
                      value={item.purchase_order_id}
                      onChange={(e) => {
                        handleCheck(e, item);
                      }}
                    />
                  </FormGroup>
                </td>

                <td>{item.item_title}</td>
                <td>{item.qty}</td>
                <td>{item.unit}</td>
                <td>{item.cost_price}</td>
                <td>{item.qty * item.cost_price}</td>
                <td>{item.status}</td>
                <td>{item.description}</td>
                <td>
                  {' '}
                  <FormGroup>
                    <Row>
                      <span
                        onClick={() => {
                          setTransferItem(item);
                          setTransferModal(true);
                        }}
                      >
                        <u>Transfer</u>
                      </span>
                    </Row>
                  </FormGroup> 
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </>
    ))}</>}
    </>
  );
}
