import React, { useEffect, useState } from 'react';
import { Row, Col, Label,Input,Table } from 'reactstrap';
import PropTypes from 'prop-types';
import api from '../../constants/api';

const ProductStockMovement = ({ productId }) => {
  const [stockData, setStockData] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [location, setLocation] = useState('Head Office');

  // Set default date range (last 30 days)
  useEffect(() => {
    const today = new Date();
    const to = today.toISOString().split('T')[0];
    const from = new Date(today.setDate(today.getDate() - 30)).toISOString().split('T')[0];
    setFromDate(from);
    setToDate(to);
  }, []);

  const fetchStockMovement = async () => {
    try {
      const response = await api.post('/product/stockMovement', {
        product_id: productId,
        from_date: fromDate,
        to_date: toDate,
      });
      setStockData(response.data.data || []);
    } catch (error) {
      console.error('Error fetching stock movement', error);
    }
  };

  useEffect(() => {
    if (productId && fromDate && toDate) {
      fetchStockMovement();
    }
  }, [productId, fromDate, toDate]);

  return (
    <div className="p-4 rounded shadow bg-white max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Product Stock Movement</h2>
      
      <Row>
  {/* From Date */}
  <Col>
    <Label htmlFor="fromDate">From Date</Label>
    <Input
      type="date"
      name="fromDate"
      id="fromDate"
      value={fromDate}
      onChange={(e) => setFromDate(e.target.value)}
    />
  </Col>

  {/* To Date */}
  <Col>
    <Label htmlFor="toDate">To Date</Label>
    <Input
      type="date"
      name="toDate"
      id="toDate"
      value={toDate}
      onChange={(e) => setToDate(e.target.value)}
    />
  </Col>

  {/* Location */}
  <Col>
    <Label htmlFor="location">Location</Label>
    <Input
      type="select"
      name="location"
      id="location"
      value={location}
      onChange={(e) => setLocation(e.target.value)}
    >
      <option value="Head Office">Head Office</option>
    </Input>
  </Col>
</Row>

      <div className="overflow-auto border rounded">
        <Table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2">Tran No</th>
              <th className="px-3 py-2">Tran Type</th>
              <th className="px-3 py-2">Tran Date</th>
              <th className="px-3 py-2 text-right">Qty</th>
              <th className="px-3 py-2 text-right">Running Qty</th>
            </tr>
          </thead>
          <tbody>
            {stockData.length > 0 ? (
              <>
                {/* Opening Stock */}
                <tr className="bg-yellow-100 font-semibold">
                  <td className="px-3 py-2">-</td>
                  <td className="px-3 py-2">Opening</td>
                  <td className="px-3 py-2">{fromDate}</td>
                  <td className="px-3 py-2 text-right">
                    {parseFloat(stockData[0].opening_qty || 0).toFixed(2)}
                  </td>
                  <td className="px-3 py-2 text-right">
                    {parseFloat(stockData[0].opening_qty || 0).toFixed(2)}
                  </td>
                </tr>

                {/* Transactions */}
                {stockData.map((item) => (
                  <tr
                    key={item.tran_no || `${item.tran_type}-${item.tran_date}`}
                    className="border-t"
                  >
                    <td className="px-3 py-2">{item.tran_no || '-'}</td>
                    <td className="px-3 py-2">{item.tran_type}</td>
                    <td className="px-3 py-2">
                      {new Date(item.tran_date).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {parseFloat(item.qty).toFixed(2)}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {parseFloat(item.running_qty).toFixed(2)}
                    </td>
                  </tr>
                ))}

                {/* Closing Stock */}
                <tr className="bg-green-100 font-semibold">
                  <td className="px-3 py-2">-</td>
                  <td className="px-3 py-2">Closing Stock</td>
                  <td className="px-3 py-2">{toDate}</td>
                  <td className="px-3 py-2 text-right">
                    {parseFloat(stockData[stockData.length - 1].running_qty || 0).toFixed(2)}
                  </td>
                  <td className="px-3 py-2 text-right">
                    {parseFloat(stockData[stockData.length - 1].running_qty || 0).toFixed(2)}
                  </td>
                </tr>
              </>
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No stock movement found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

ProductStockMovement.propTypes = {
  productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default ProductStockMovement;
