import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [productSuggestions, setProductSuggestions] = useState({});
  const [customerSuggestions, setCustomerSuggestions] = useState({}); // New state for customer code suggestions
  const navigate = useNavigate();

  // Function to generate delivery_code
  const generateCodes = () => {
    return api
      .post('/commonApi/getCodeValues', { type: 'delivery' })
      .then((res) => res.data.data)
      .catch((error) => {
        message('Failed to generate code', 'error');
        throw error;
      });
  };

  // New function to handle Save button click
  const handleSave = async () => {
    // if (productRows.length !== 1 || customerRows.length !== 1) {
    //   message('Please select or add exactly 4 products and 4 customers.', 'warning');
    //   return;
    // }
    setLoading(true);
    try {
                const deliveryOrderCode = await generateCodes();

      // Create delivery orders concurrently for all customers
      const createOrderPromises = customerRows.map(customer => {
        const deliveryOrder = {
          companyId: customer.id, // Assuming customerCode is companyId
          date: doDate,
          delivery_code:deliveryOrderCode,
          delivery_status: 'Open',
          products: productRows.map(product => ({
            productId: product.id // Assuming product.id is productId
          }))
        };
        return api.post('/salesOrder/createDeliveryOrder', deliveryOrder);
      });

      const responses = await Promise.all(createOrderPromises);

      for (let i = 0; i < responses.length; i++) {
        if (!responses[i].data.success) {
          message(`Failed to create delivery order for customer ${customerRows[i].customerCode}`, 'error');
          setLoading(false);
          return;
        }
      }

    

      message('Delivery orders created successfully.', 'success');
                navigate('/DeliveryCL');

    } catch (error) {
      message('Error occurred while creating delivery orders.', 'error');
    } finally {
      setLoading(false);
    }
  };

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
        
        console.log('Loaded products:', products.map(p => p.product_code));
        setProductRows(products.map((product, index) => ({
          id: product.product_id || index + 1,
          productCode: String(product.product_code),
          productName: product.title
        })));

        setCustomerRows(customers.map((customer, index) => ({
          id: customer.company_id || index + 1,
          customerCode: customer.customer_code,
          customerName: customer.company_name,
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
    const updatedRows = productRows.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    );
    console.log('Updated productRows:', updatedRows);
    setProductRows(updatedRows);
  };

  // Handle customer row changes
  const handleCustomerChange = (id, field, value) => {
    setCustomerRows(customerRows.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  // Fetch customer details when customer code changes
  const fetchCustomerDetails = async (id, customerCode) => {
    if (!customerCode) return;
    
    try {
      const response = await api.post('/product/getCustomerByCode', { customerCode });
      if (response.data.success && response.data.data) {
        handleCustomerChange(id, 'customerName', response.data.data.company_name || '');
      }
    } catch (error) {
      message('Failed to fetch customer details', 'error');
    }
  };

  // Fetch customer code suggestions based on input
  const fetchCustomerSuggestions = async (id, input) => {
    if (!input) {
      setCustomerSuggestions(prev => ({ ...prev, [id]: [] }));
      return;
    }
    try {
      const response = await api.post('/product/searchCustomers', { search: input });
      if (response.data.success && response.data.data) {
        setCustomerSuggestions(prev => ({
          ...prev,
          [id]: response.data.data.slice(0, 100) // Limit to 100 suggestions
        }));
      }
    } catch (error) {
      console.error('Failed to fetch customer suggestions', error);
      setCustomerSuggestions(prev => ({ ...prev, [id]: [] }));
    }
  };

  // Handle customer code selection from dropdown
  const handleCustomerSelect = (id, customer) => {
    if (!customer || !customer.customer_code) {
      return;
    }
    const updatedRow = {
      ...customerRows.find(row => row.id === id),
      customerCode: customer.customer_code,
      customerName: customer.company_name || '',
       id: customer.company_id ,
      price: 1.3 // Set default price to 1.3
    };
    const updatedRows = customerRows.map(row =>
      row.id === id ? updatedRow : row
    );
    setCustomerRows(updatedRows);
    setCustomerSuggestions(prev => ({ ...prev, [id]: [] })); // Clear suggestions
  };

  // Fetch product suggestions based on product code
  const fetchProductSuggestions = async (id, productCode) => {
    if (!productCode) {
      setProductSuggestions({ ...productSuggestions, [id]: [] });
      return;
    }
    
    try {
      const response = await api.post('/product/searchProducts', { search: productCode });
      console.log('Product suggestions response:', response.data.data);
      if (response.data.success && response.data.data) {
        setProductSuggestions({ 
          ...productSuggestions, 
          [id]: response.data.data.slice(0, 100) // Limit to 5 suggestions
        });
      }
    } catch (error) {
      let errorMessage = 'Failed to fetch product suggestions';
      if (error.response) {
        errorMessage += `: Server returned ${error.response.status}`;
        if (error.response.data && error.response.data.message) {
          errorMessage += ` - ${error.response.data.message}`;
        }
      } else if (error.request) {
        errorMessage += ': No response received from server';
      } else {
        errorMessage += `: ${error.message}`;
      }
      console.error(errorMessage);
      setProductSuggestions({ ...productSuggestions, [id]: [] });
    }
  };

  // Handle product selection from dropdown
  const handleProductSelect = (id, product) => {
    console.log('Selected product:', product);
    if (!product || !product.product_code) {
      console.warn('Invalid product data received');
      return;
    }
    
    const updatedRow = {
      ...productRows.find(row => row.id === id),
      productCode: String(product.product_code),
      productName: product.title || '',
      id: product.product_id // Add product_id to state for sending productId
    };

    const updatedRows = productRows.map(row => 
      row.id === id ? updatedRow : row
    );

    setProductRows(updatedRows);
    setProductSuggestions({ ...productSuggestions, [id]: [] });
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
                          <div className="relative">
                            <input
                              type="text"
                              value={row.productCode}
                              onChange={(e) => {
                                handleProductChange(row.id, 'productCode', e.target.value);
                                fetchProductSuggestions(row.id, e.target.value);
                              }}
                              className="form-control"
                              placeholder="Enter product code"
                            />
                            {productSuggestions[row.id]?.length > 0 && (
                              <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                {productSuggestions[row.id].map((product) => (
                                  <div
                                    key={product.product_id}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleProductSelect(row.id, product)}
                                  >
                                    <div className="font-medium">{product.product_code}</div>
                                    <div className="text-sm text-gray-600">{product.title}</div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={row.productName}
                            readOnly
                            className="form-control bg-gray-50"
                            placeholder="Product name will appear here"
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
                          <div className="relative">
                            <input
                              type="text"
                              value={row.customerCode}
                              onChange={(e) => {
                                handleCustomerChange(row.id, 'customerCode', e.target.value);
                                fetchCustomerDetails(row.id, e.target.value);
                                fetchCustomerSuggestions(row.id, e.target.value);
                              }}
                              className="form-control"
                              placeholder="Enter customer code"
                            />
                            {customerSuggestions[row.id]?.length > 0 && (
                              <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                {customerSuggestions[row.id].map((customer) => (
                                  <div
                                    key={customer.company_id}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleCustomerSelect(row.id, customer)}
                                  >
                                    <div className="font-medium">{customer.customer_code}</div>
                                    <div className="text-sm text-gray-600">{customer.company_name}</div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
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
          <Button color="primary" onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BulkDeliveryOrder;
