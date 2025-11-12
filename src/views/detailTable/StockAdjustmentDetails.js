/*eslint-disable*/
import React, { useState, useEffect,useRef } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Table,
  Row,
  Col,
  Container,
  Card,
  CardBody
} from "reactstrap";
import { FaTrash, FaPlus } from "react-icons/fa";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import api from "../../constants/api";
import message from "../../components/Message";

const StockAdjustmentDetails = () => {
  const navigate = useNavigate();
  
  // Master form state
  const [formData, setFormData] = useState({
    stock_adjustment_date: new Date().toISOString().split('T')[0],
    location_id: "",
    remarks: ""
  });
  
  // Locations state
  const [locations, setLocations] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
     const productCodeRefs = useRef([]); // keeps Select refs
      const cartonQtyRefs = useRef([]);
  // Items state
  const [rows, setRows] = useState([
    {
      product_id: "",
      product_code: "",
      product_name: "",
      stock_in_hand_carton: "",
      stock_in_hand_loose: "",
      stock_in_hand_qty: "",
      adjustment_type: "Increase",
      adjustment_carton: 0,
      adjustment_loose: 0,
      adjustment_qty: 0,
      new_stock_carton: 0,
      new_stock_loose: 0,
      new_stock_qty: 0
    }
  ]);

  // Fetch locations
  const fetchLocations = async () => {
    try {
      const response = await api.get('/stockRequest/getAllLocations');
      if (response.data.msg === "Success") {
        setLocations(response.data.data);
      }
    } catch (error) {
      message('Error fetching locations', 'error');
      console.error(error);
    }
  };

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      const response = await api.get('/product/getProducts');
      if (response?.data) {
        setProducts(response?.data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      message.error('Failed to load products');
    }
  };

  useEffect(() => {
    fetchLocations();
    fetchProducts();
  }, []);

  // Handle master form changes
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Search and select product
  const handleProductSearch = (index, searchValue) => {
    if (!searchValue) return;
    
    // Search by product code or name
    const foundProduct = products.find(product => 
      product.product_code?.toLowerCase() === searchValue.toLowerCase() ||
      product.product_name?.toLowerCase().includes(searchValue.toLowerCase())
    );
    
    if (foundProduct) {
      const updatedRows = [...rows];
      updatedRows[index] = {
        ...updatedRows[index],
        product_id: foundProduct.product_id,
        product_code: foundProduct.product_code,
        product_name: foundProduct.product_name
      };
      setRows(updatedRows);
    }
  };

  // Add new row
  const addRow = () => {
    setRows([
      ...rows,
      {
        product_id: "",
        product_code: "",
        product_name: "",
        stock_in_hand_carton: "",
        stock_in_hand_loose: "",
        stock_in_hand_qty: "",
        adjustment_type: "Increase",
        adjustment_carton: 0,
        adjustment_loose: 0,
        adjustment_qty: 0,
        new_stock_carton: 0,
        new_stock_loose: 0,
        new_stock_qty: 0
      }
    ]);
  };
  const handleProductSelect = (index, selectedProduct) => {
      console.log("Selected Product:", selectedProduct);
      const updatedRows = [...rows];
      updatedRows[index].product_id = selectedProduct.value;
      updatedRows[index].product_code = selectedProduct.label;
      updatedRows[index].product_name = selectedProduct.product_name;
      updatedRows[index].stock_in_hand_carton = selectedProduct.carton_qty;
      updatedRows[index].stock_in_hand_loose = selectedProduct.loose_qty;
      updatedRows[index].stock_in_hand_qty = selectedProduct.qty_in_stock;
      setRows(updatedRows);
      console.log("Updated Rows:", updatedRows);
    };
  // Delete row
  const deleteRow = (index) => {
    const updated = [...rows];
    updated.splice(index, 1);
    setRows(updated);
  };

  // Handle input change for items
  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    
    // Auto-calculate new stock when adjustment values change
    if (field.includes('adjustment_') || field.includes('stock_in_hand_')) {
      calculateNewStock(updated, index);
    }
    
    setRows(updated);
  };

  // Calculate new stock based on adjustment type and values
  const calculateNewStock = (updatedRows, index) => {
    const row = updatedRows[index];
    const stockInHandCarton = parseFloat(row.stock_in_hand_carton) || 0;
    const stockInHandLoose = parseFloat(row.stock_in_hand_loose) || 0;
    const stockInHandQty = parseFloat(row.stock_in_hand_qty) || 0;
    
    const adjustmentCarton = parseFloat(row.adjustment_carton) || 0;
    const adjustmentLoose = parseFloat(row.adjustment_loose) || 0;
    const adjustmentQty = parseFloat(row.adjustment_qty) || 0;
    
    const multiplier = row.adjustment_type === 'Increase' ? 1 : -1;
    
    updatedRows[index].new_stock_carton = stockInHandCarton + (adjustmentCarton * multiplier);
    updatedRows[index].new_stock_loose = stockInHandLoose + (adjustmentLoose * multiplier);
    updatedRows[index].new_stock_qty = stockInHandQty + (adjustmentQty * multiplier);
  };

  // Submit form
  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Validate form data
      if (!formData.stock_adjustment_date || !formData.location_id) {
        message.error('Please fill in all required fields');
        return;
      }

      // Filter valid items (items with product_id)
      const validItems = rows.filter(row => row?.product_id && String(row.product_id).trim() !== '');
      
      if (validItems.length === 0) {
        message.error('Please add at least one product item');
        return;
      }

      // Construct payload
      const payload = {
        stock_adjustment_date: formData.stock_adjustment_date,
        location_id: formData.location_id,
        remarks: formData.remarks || '',
        items: validItems
      };

      // Send API request
      const response = await api.post('/stockRequest/insertStockAdjustment', payload);
      
        message.success('Stock adjustment created successfully!');
        navigate('/StockAdjustment');
      
    } catch (error) {
      console.error('Error creating stock adjustment:', error);
      message.error('Failed to create stock adjustment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/StockAdjustment');
  };

  return (
    <Container fluid>
      <Card>
        <CardBody>
          <h5>Add/Edit Stock Adjustment</h5>
          <Form>
            <Row>
              <Col md={4}>
                <FormGroup>
                  <Label>Stock Adjustment Date <span className="text-danger">*</span></Label>
                  <Input 
                    type="date" 
                    name="stock_adjustment_date"
                    value={formData.stock_adjustment_date}
                    onChange={handleFormChange}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label>Location <span className="text-danger">*</span></Label>
                  <Input 
                    type="select"
                    name="location_id"
                    value={formData.location_id}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">Select Location</option>
                    {locations.map(location => (
                      <option key={location.location_id} value={location.location_id}>
                        {location.location_name}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label>Remarks</Label>
                  <Input 
                    type="text" 
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleFormChange}
                    placeholder="Enter remarks"
                  />
                </FormGroup>
              </Col>
            </Row>

            <h6 className="mt-3">Products</h6>
            <Table bordered responsive>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Product ID</th>
                  <th>Product Code</th>
                  <th>Product Name</th>
                  <th colSpan="3">Stock In Hand</th>
                  <th>Adj Type</th>
                  <th colSpan="3">Stock Adjustment</th>
                  <th colSpan="3">New Stock</th>
                  <th>Action</th>
                </tr>
                <tr>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th>Carton</th>
                  <th>Loose</th>
                  <th>Qty</th>
                  <th></th>
                  <th>Carton</th>
                  <th>Loose</th>
                  <th>Qty</th>
                  <th>Carton</th>
                  <th>Loose</th>
                  <th>Qty</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows?.map((row, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>
                      <Input
                        value={row.product_id}
                        onChange={(e) =>
                          handleChange(i, "product_id", e.target.value)
                        }
                        placeholder="Product ID"
                      />
                    </td>
                      <td style={{ padding: "0.3rem", minWidth: "200px" }}>
  <Select
    options={products.map((pr) => ({
      value: pr.product_id,
      label: `${pr.product_code} - ${pr.product_name}`,
      product_code: pr.product_code,
      product_name: pr.product_name,
      qty_in_stock:pr.qty_in_stock
    }))}
    value={
      row.product_id
        ? {
            value: row.product_id,
            label: `${row.product_code} - ${row.product_name}`,
          }
        : null
    }
    onChange={(selectedOption) => {
      handleProductSelect(i, selectedOption);
      if (cartonQtyRefs.current[i]) {
        cartonQtyRefs.current[i].focus();
      }
    }}
      styles={{
    control: (base) => ({
      ...base,
      fontSize: "12px",
      minHeight: "30px"
     
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
      fontSize: "12px", 
      width: '300px'  // keep it above modal, table, etc.
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999   // just in case
    })
  }}
    placeholder="Select Product"
    filterOption={(candidate, input) => {
      if (!input) return true;
      const lowerInput = input.toLowerCase();
      return (
        candidate.data.product_code.toLowerCase().includes(lowerInput) ||
        candidate.data.product_name.toLowerCase().includes(lowerInput)
      );
    }}
    // assign ref so we can call focus() on the react-select instance
    ref={(el) => (productCodeRefs.current[i] = el)}
    inputId={`product-select-${i}`}
  />
</td>


            {/* Product Name (auto updated) */}
            <td style={{ padding: "0.3rem" }}>
              <input
                type="text"
                className="form-control form-control-sm"
                value={row.product_name || ""}
                readOnly
              />
            </td>
                    <td>
                      <Input
                        type="number"
                        value={row.stock_in_hand_carton}
                        onChange={(e) =>
                          handleChange(i, "stock_in_hand_carton", e.target.value)
                        }
                        placeholder="0"
                      />
                    </td>
                    <td>
                      <Input
                        type="number"
                        value={row.stock_in_hand_loose}
                        onChange={(e) =>
                          handleChange(i, "stock_in_hand_loose", e.target.value)
                        }
                        placeholder="0"
                      />
                    </td>
                    <td>
                      <Input
                        type="number"
                        value={row.stock_in_hand_qty}
                        onChange={(e) =>
                          handleChange(i, "stock_in_hand_qty", e.target.value)
                        }
                        placeholder="0"
                      />
                    </td>
                    <td>
                      <Input
                        type="select"
                        value={row.adjustment_type}
                        onChange={(e) => handleChange(i, "adjustment_type", e.target.value)}
                      >
                        <option value="Increase">Increase</option>
                        <option value="Decrease">Decrease</option>
                      </Input>
                    </td>
                    <td>
                      <Input
                        type="number"
                        value={row.adjustment_carton}
                        onChange={(e) =>
                          handleChange(i, "adjustment_carton", e.target.value)
                        }
                        placeholder="0"
                      />
                    </td>
                    <td>
                      <Input
                        type="number"
                        value={row.adjustment_loose}
                        onChange={(e) =>
                          handleChange(i, "adjustment_loose", e.target.value)
                        }
                        placeholder="0"
                      />
                    </td>
                    <td>
                      <Input
                        type="number"
                        value={row.adjustment_qty}
                        onChange={(e) =>
                          handleChange(i, "adjustment_qty", e.target.value)
                        }
                        placeholder="0"
                      />
                    </td>
                    <td>
                      <Input
                        type="number"
                        value={row.new_stock_carton}
                        readOnly
                        style={{ backgroundColor: '#f8f9fa' }}
                      />
                    </td>
                    <td>
                      <Input
                        type="number"
                        value={row.new_stock_loose}
                        readOnly
                        style={{ backgroundColor: '#f8f9fa' }}
                      />
                    </td>
                    <td>
                      <Input
                        type="number"
                        value={row.new_stock_qty}
                        readOnly
                        style={{ backgroundColor: '#f8f9fa' }}
                      />
                    </td>
                    <td>
                      <Button
                        color="danger"
                        size="sm"
                        onClick={() => deleteRow(i)}
                        disabled={rows.length === 1}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Button color="primary" onClick={addRow} className="mb-3">
              <FaPlus /> Add Product
            </Button>

            <div className="d-flex justify-content-between">
              <Button 
                color="secondary"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button 
                color="success"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </Container>
  );
};

export default StockAdjustmentDetails;
