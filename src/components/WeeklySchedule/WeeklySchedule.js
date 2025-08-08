import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Input,
  Button,
  Table,
} from 'reactstrap';
import PropTypes from 'prop-types';
import api from '../../constants/api';

const WeeklySchedule = ({ customerId }) => {
  const [companyUpdates, setCompanyUpdates] = useState({});
  const [filters, setFilters] = useState({
    customer: '',
    area: '',
    salesman: '',
    day: '',
    schedule: ''
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const salesmen = ['AMPRO','sales1']; // Add more salesmen as needed

  // Fetch companies on component mount
  useEffect(() => {
    const fetchSchedule = async () => {
      if (!customerId) return;
      try {
        const response = await api.post('/contact/getContactssById', { company_id: customerId });
        const scheduleData = response.data.data;
        // The API returns an array, so we need to get the first element.
        if (Array.isArray(scheduleData) && scheduleData.length > 0) {
          const customerData = scheduleData[0];
          setCompanyUpdates(prev => ({
            ...prev,
            [customerId]: {
              company_id: customerId,
              sales_man: customerData.sales_man || '',
              day: customerData.day || '',
              action: customerData.action === '1' || customerData.action === 1 || false,
            },
          }));
        }
      } catch (error) {
        console.error('Error fetching schedule:', error);
      }
    };
    fetchSchedule();
  }, [customerId]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle field changes for each company
  const handleCompanyFieldChange = (companyId, field, value) => {
    setCompanyUpdates(prev => ({
      ...prev,
      [companyId]: {
        ...prev[companyId],
        company_id: companyId,
        [field]: value
      }
    }));
  };

  // Handle update for a single customer
  const handleUpdateSchedule = async () => {
    if (!customerId) return;

    const updateData = companyUpdates[customerId];

    if (!updateData || !updateData.sales_man || !updateData.day) {
      alert('Please select both a Sales Man and a Day.');
      return;
    }

    try {
      await api.post('/company/updateSchedule', updateData);
      alert('Successfully updated schedule');
      // No need to refresh here as the data is self-contained
    } catch (error) {
      console.error('Error updating schedule:', error);
      alert('Error updating schedule. Please try again.');
    }
  };

  return (
    <div className="p-4">
      <h2>Salesman Schedule Weekly</h2>
      
      {/* Filters */}
      {!customerId && (
      <Row className="mb-4">
        <Col md={2}>
          <Input
            type="text"
            placeholder="Customer"
            name="customer"
            value={filters.customer}
            onChange={handleFilterChange}
          />
        </Col>
        <Col md={2}>
          <Input
            type="select"
            name="area"
            value={filters.area}
            onChange={handleFilterChange}
          >
            <option value="">Select Area</option>
            {/* Add area options */}
          </Input>
        </Col>
        <Col md={2}>
          <Input
            type="select"
            name="salesman"
            value={filters.salesman}
            onChange={handleFilterChange}
          >
            <option value="">Select Salesman</option>
            {salesmen.map(man => (
              <option key={man} value={man}>{man}</option>
            ))}
          </Input>
        </Col>
        <Col md={2}>
          <Input
            type="select"
            name="day"
            value={filters.day}
            onChange={handleFilterChange}
          >
            <option value="">Select Day</option>
            {days.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </Input>
        </Col>
        <Col md={2}>
          <Input
            type="select"
            name="schedule"
            value={filters.schedule}
            onChange={handleFilterChange}
          >
            <option value="">Select Schedule</option>
            {/* Add schedule options */}
          </Input>
        </Col>
        <Col md={1}>
          <Button color="primary" onClick={() => {}}>Search</Button>
        </Col>
      </Row>
      )}

      {customerId && (
        <Row>
          <Col>
            <Button color="success" onClick={handleUpdateSchedule}>Save Schedule</Button>
          </Col>
        </Row>
      )}


      {/* Company List Table */}
      <Table responsive bordered>
        {!customerId && (
        <thead>
          <tr>
            <th>CustomerName</th>
            <th>Address</th>
            <th>Area</th>
            <th>Sales Man</th>
            <th>Day</th>
            <th>Action</th>
          </tr>
        </thead>
        )}
        {customerId && (
          <thead>
            <tr>
              <th>Sales Man</th>
              <th>Day</th>
              <th>Action</th>
            </tr>
          </thead>
        )}
        <tbody>
          {/* Render a single row for the customer when customerId is provided */}
          {customerId && (
            <tr key={customerId}>
              <td>
                <Input
                  type="select"
                  value={companyUpdates[customerId]?.sales_man || ''}
                  onChange={(e) => handleCompanyFieldChange(customerId, 'sales_man', e.target.value)}
                >
                  <option value="">Select Salesman</option>
                  {salesmen.map(man => (
                    <option key={man} value={man}>{man}</option>
                  ))}
                </Input>
              </td>
              <td>
                <Input
                  type="select"
                  value={companyUpdates[customerId]?.day || ''}
                  onChange={(e) => handleCompanyFieldChange(customerId, 'day', e.target.value)}
                >
                  <option value="">Select Day</option>
                  {days.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </Input>
              </td>
              <td>
                <Input
                  type="checkbox"
                  style={{ width: '20px', height: '20px' }}
                  checked={companyUpdates[customerId]?.action || false}
                  onChange={(e) => handleCompanyFieldChange(customerId, 'action', e.target.checked)}
                />
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

WeeklySchedule.propTypes = {
  customerId: PropTypes.string,
};

WeeklySchedule.defaultProps = {
  customerId: '',
};

export default WeeklySchedule;
