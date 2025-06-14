import React, { useState, useEffect } from 'react';
import { Card, CardTitle, Button } from 'reactstrap';
import api from '../../constants/api';
import message from '../Message';

const BulkDeliveryOrder = () => {
  const [doDate, setDoDate] = useState('');
  const [productRows, setProductRows] = useState([
    { id: 1, productCode: '', productName: '' }
  ]);
  const [customerRows, setCustomerRows] = useState([
    { id: 1, customerCode: '', customerName: '', qty: 0, price: 0 }
  ]);
  const [totalQty, setTotalQty] = useState(0);
  const [loading, setLoading] = useState(false);

  // Calculate total quantity whenever customer rows change
  useEffect(() => {
    const total = customerRows.reduce((sum, row) => sum + Number(row.qty), 0);
    setTotalQty(total);
  }, [customerRows]);

  // Load data based on selected date
  const handleLoad = async () => {
    if (!doDate) {
      message('Please select a date first', 'warning');
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('/salesOrder/getBulkDeliveryData', { date: doDate });
      if (response.data.success) {
        // Assuming the API returns { products: [], customers: [] }
        const { products, customers } = response.data.data;
        
        setProductRows(products.map((product, index) => ({
          id: index + 1,
          productCode: product.product_code,
          productName: product.product_name
        })));

        setCustomerRows(customers.map((customer, index) => ({
          id: index + 1,
          customerCode: customer.customer_code,
          customerName: customer.customer_name,
          qty: 0,
          price: 0
        })));
      }
    } catch (error) {
      message('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Add new product row
  const addProductRow = () => {
    const newId = productRows.length + 1;
    setProductRows([...productRows, { id: newId, productCode: '', productName: '' }]);
  };

  // Add new customer row
  const addCustomerRow = () => {
    const newId = customerRows.length + 1;
    setCustomerRows([...customerRows, { 
      id: newId, 
      customerCode: '', 
      customerName: '', 
      qty: 0, 
      price: 0 
    }]);
  };

  // Delete product row
  const deleteProductRow = (id) => {
    setProductRows(productRows.filter(row => row.id !== id));
  };

  // Delete customer row
  const deleteCustomerRow = (id) => {
    setCustomerRows(customerRows.filter(row => row.id !== id));
  };

  // Handle product row changes
  const handleProductChange = (id, field, value) => {
    setProductRows(productRows.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  // Handle customer row changes
  const handleCustomerChange = (id, field, value) => {
    setCustomerRows(customerRows.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  // Fetch product details when product code changes
  const fetchProductDetails = async (id, productCode) => {
    if (!productCode) return;
    
    try {
      const response = await api.post('/product/getProductByCode', { productCode });
      if (response.data.success && response.data.data) {
        handleProductChange(id, 'productName', response.data.data.product_name || '');
      }
    } catch (error) {
      message('Failed to fetch product details', 'error');
    }
  };

  // Fetch customer details when customer code changes
  const fetchCustomerDetails = async (id, customerCode) => {
    if (!customerCode) return;
    
    try {
      const response = await api.post('/customer/getCustomerByCode', { customerCode });
      if (response.data.success && response.data.data) {
        handleCustomerChange(id, 'customerName', response.data.data.customer_name || '');
      }
    } catch (error) {
      message('Failed to fetch customer details', 'error');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-4">
        <Card className="p-4">
          <CardTitle tag="h4" className="mb-4">Add Multi Delivery Order</CardTitle>
          
          <div className="flex items-center gap-4 mb-6">
            <input
              type="date"
              value={doDate}
              onChange={(e) => setDoDate(e.target.value)}
              className="form-control w-48"
            />
            <Button 
              color="primary"
              onClick={handleLoad}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Load'}
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Products Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b">
                <h5 className="font-medium">Product</h5>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2">S No</th>
                      <th className="px-4 py-2">Product Code</th>
                      <th className="px-4 py-2">Product Name</th>
                      <th className="px-4 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productRows.map((row) => (
                      <tr key={row.id}>
                        <td className="px-4 py-2">{row.id}</td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={row.productCode}
                            onChange={(e) => {
                              handleProductChange(row.id, 'productCode', e.target.value);
                              fetchProductDetails(row.id, e.target.value);
                            }}
                            className="form-control"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={row.productName}
                            onChange={(e) => handleProductChange(row.id, 'productName', e.target.value)}
                            className="form-control"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <Button 
                            color="danger" 
                            size="sm"
                            onClick={() => deleteProductRow(row.id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t">
                <Button color="primary" onClick={addProductRow}>
                  + Add Product
                </Button>
              </div>
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b">
                <h5 className="font-medium">Customer</h5>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2">S No</th>
                      <th className="px-4 py-2">Customer Code</th>
                      <th className="px-4 py-2">Customer Name</th>
                      <th className="px-4 py-2">Qty</th>
                      <th className="px-4 py-2">Price</th>
                      <th className="px-4 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerRows.map((row) => (
                      <tr key={row.id}>
                        <td className="px-4 py-2">{row.id}</td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={row.customerCode}
                            onChange={(e) => {
                              handleCustomerChange(row.id, 'customerCode', e.target.value);
                              fetchCustomerDetails(row.id, e.target.value);
                            }}
                            className="form-control"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={row.customerName}
                            onChange={(e) => handleCustomerChange(row.id, 'customerName', e.target.value)}
                            className="form-control"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={row.qty}
                            onChange={(e) => handleCustomerChange(row.id, 'qty', parseFloat(e.target.value) || 0)}
                            className="form-control"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={row.price}
                            onChange={(e) => handleCustomerChange(row.id, 'price', parseFloat(e.target.value) || 0)}
                            className="form-control"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <Button 
                            color="danger" 
                            size="sm"
                            onClick={() => deleteCustomerRow(row.id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t">
                <Button color="primary" onClick={addCustomerRow}>
                  + Add Customer
                </Button>
                <div className="mt-4 text-right">
                  <strong>Total Qty: {totalQty}</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button color="secondary">Cancel</Button>
            <Button color="primary">Save</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BulkDeliveryOrder;
