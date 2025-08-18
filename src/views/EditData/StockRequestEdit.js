import React, { useState, useEffect, useContext } from 'react';
import { Form, Row, Col, FormGroup, Label, Input, Button, Table } from 'reactstrap';
import { ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import ComponentCard from '../../components/ComponentCard';
import ComponentCardV2 from '../../components/ComponentCardV2';
//import Tabs from '../../components/Tabs';
import Tabs from '../../components/ProjectTabs/Tab';
import message from '../../components/Message';
import api from '../../constants/api';
import creationdatetime from '../../constants/creationdatetime';
import AppContext from '../../context/AppContext';

const StockRequestEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loggedInuser } = useContext(AppContext);

  const [stockRequestDetails, setStockRequestDetails] = useState({});
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({});

  // Handle input changes
  const handleInputs = (e) => {
    setStockRequestDetails({ ...stockRequestDetails, [e.target.name]: e.target.value });
  };

  // Handle new product input changes
  const handleProductInputs = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  // Fetch stock request details
  const getStockRequestById = () => {
    api
      .post('/stockRequest/getStockRequestById', { stock_request_id: id })
      .then((res) => {
        setStockRequestDetails(res.data.data[0]);
      })
      .catch(() => {
        message('Stock request not found', 'info');
      });
  };

  // Fetch products
  const getStockRequestProducts = () => {
    api
      .post('/stockRequest/getStockRequestProducts', { stock_request_id: id })
      .then((res) => {
        setProducts(res.data.data);
      })
      .catch(() => {
        message('Products not found', 'info');
      });
  };

  // Update stock request
  const editStockRequest = () => {
    const updatedData = {
      ...stockRequestDetails,
      modification_date: creationdatetime,
      modified_by: loggedInuser.first_name,
    };

    api
      .post('/stockRequest/editStockRequest', updatedData)
      .then(() => {
        message('Record updated successfully', 'success');
      })
      .catch(() => {
        message('Unable to update record.', 'error');
      });
  };

  // Delete stock request
  const deleteStockRequest = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This will delete the stock request permanently.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .post('/stockRequest/deleteStockRequest', { stock_request_id: id })
          .then(() => {
            message('Stock request deleted', 'success');
            navigate('/stockRequest');
          })
          .catch(() => {
            message('Unable to delete record.', 'error');
          });
      }
    });
  };

  // Add new product
  const addProduct = () => {
    if (!newProduct.product_name) {
      message('Please enter product name', 'error');
      return;
    }

    api
      .post('/stockRequest/insertStockRequestProduct', {
        ...newProduct,
        stock_request_id: id,
        creation_date: creationdatetime,
        created_by: loggedInuser.first_name,
      })
      .then(() => {
        message('Product added', 'success');
        setNewProduct({});
        getStockRequestProducts();
      })
      .catch(() => {
        message('Unable to add product.', 'error');
      });
  };

  // Delete product
  const deleteProduct = (productId) => {
    Swal.fire({
      title: 'Delete product?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .post('/stockRequest/deleteStockRequestProduct', { stock_request_product_id: productId })
          .then(() => {
            message('Product deleted', 'success');
            getStockRequestProducts();
          })
          .catch(() => {
            message('Unable to delete product.', 'error');
          });
      }
    });
  };

  useEffect(() => {
    getStockRequestById();
    getStockRequestProducts();
  }, [id]);

  const tabs = [
    {
      id: '1',
      title: 'Details',
      content: (
        <FormGroup>
          <ComponentCard title="Stock Request Details" creationModificationDate={stockRequestDetails}>
            <Row>
              <Col md="4">
                <FormGroup>
                  <Label>Stock Request No</Label>
                  <Input
                    type="text"
                    name="stock_req_no"
                    value={stockRequestDetails.stock_req_no || ''}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label>From Location</Label>
                  <Input
                    type="text"
                    name="from_location"
                    value={stockRequestDetails.from_location || ''}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label>To Location</Label>
                  <Input
                    type="text"
                    name="to_location"
                    value={stockRequestDetails.to_location || ''}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="4">
                <FormGroup>
                  <Label>Status</Label>
                  <Input
                    type="select"
                    name="status"
                    value={stockRequestDetails.status || ''}
                    onChange={handleInputs}
                  >
                    <option value="">Select</option>
                    <option value="Draft">Draft</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Completed">Completed</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label>Stock Request Date</Label>
                  <Input
                    type="date"
                    name="stock_req_date"
                    value={stockRequestDetails.stock_req_date || ''}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label>Remarks</Label>
                  <Input
                    type="text"
                    name="remarks"
                    value={stockRequestDetails.remarks || ''}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>
            </Row>
          </ComponentCard>
        </FormGroup>
      ),
    },
    {
      id: '2',
      title: 'Products',
      content: (
        <ComponentCard title="Stock Request Products">
          <Row>
            <Col md="4">
              <Input
                type="text"
                placeholder="Product Name"
                name="product_name"
                value={newProduct.product_name || ''}
                onChange={handleProductInputs}
              />
            </Col>
            <Col md="2">
              <Input
                type="number"
                placeholder="Quantity"
                name="quantity"
                value={newProduct.quantity || ''}
                onChange={handleProductInputs}
              />
            </Col>
            <Col md="2">
              <Button color="primary" onClick={addProduct}>
                Add
              </Button>
            </Col>
          </Row>
          <Table className="mt-3" bordered>
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod, index) => (
                <tr key={prod.stock_request_product_id}>
                  <td>{index + 1}</td>
                  <td>{prod.product_name}</td>
                  <td>{prod.quantity}</td>
                  <td>
                    <Button
                      color="danger"
                      size="sm"
                      onClick={() => deleteProduct(prod.stock_request_product_id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </ComponentCard>
      ),
    },
  ];

  return (
    <div>
      <Form>
        <ComponentCardV2>
          <Row>
            <Col>
              <Button
                color="primary"
                onClick={() => {
                  editStockRequest();
                  setTimeout(() => {
                    navigate('/stockRequest');
                    window.location.reload();
                  }, 1100);
                }}
              >
                Save
              </Button>
            </Col>
            <Col>
              <Button
                color="primary"
                onClick={() => {
                  editStockRequest();
                }}
              >
                Apply
              </Button>
            </Col>
            <Col>
              <Button
                color="dark"
                onClick={() => {
                  navigate('/stockRequest');
                }}
              >
                Back to List
              </Button>
            </Col>
            <Col>
              <Button color="danger" onClick={deleteStockRequest}>
                Delete
              </Button>
            </Col>
          </Row>
        </ComponentCardV2>
      </Form>

      <ToastContainer />

      <Tabs tabs={tabs} />
    </div>
  );
};

export default StockRequestEdit;
