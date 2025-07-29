import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Input,
  Button,
  Table,
} from 'reactstrap';
import weeklyScheduleApi from '../../constants/weeklyScheduleApi';

const WeeklySchedule = () => {
  const [companies, setCompanies] = useState([]);
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
    const fetchCompanies = async () => {
      try {
        const response = await weeklyScheduleApi.getCompanies();
        setCompanies(response.data.data);
        
        // Initialize companyUpdates with existing values from database
        const updates = {};
        response.data.data.forEach(company => {
          if (company.sales_man || company.day || company.action) {
            updates[company.company_id] = {
              company_id: company.company_id,
              sales_man: company.sales_man || '',
              day: company.day || '',
              action: company.action === '1' || company.action === 1 || false
            };
          }
        });
        setCompanyUpdates(updates);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };
    fetchCompanies();
  }, []);

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

  // Handle update all button click
  const handleUpdateAll = async () => {
    try {
      const updates = Object.values(companyUpdates);
      
      // Filter out companies that have both sales_man and day selected
      const validUpdates = updates.filter(update => 
        update.sales_man && update.day && update.action !== undefined
      );

      if (validUpdates.length === 0) {
        alert('Please select values for at least one company to update');
        return;
      }

      // Update all companies concurrently
      await Promise.all(
        validUpdates.map(updateData => weeklyScheduleApi.updateSchedule(updateData))
      );

      alert('Successfully updated schedules');
                window.location.reload()

      // Refresh the companies list
      const response = await weeklyScheduleApi.getCompanies();
      setCompanies(response.data.data);
      
      // Clear the updates
      setCompanyUpdates({});
    } catch (error) {
      console.error('Error updating schedules:', error);
      alert('Error updating schedules. Please try again.');
    }
  };

  return (
    <div className="p-4">
      <h2>Salesman Schedule Weekly</h2>
      
      {/* Filters */}
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
        <Col md={1}>
          <Button color="success" onClick={handleUpdateAll}>Update All</Button>
        </Col>
      </Row>

      {/* Company List Table */}
      <Table responsive bordered>
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
        <tbody>
          {companies.map((company) => (
            <tr key={company.company_id}>
              <td>{company.company_name}</td>
              <td>{company.address_street}</td>
              <td>{company.area || '-'}</td>
              <td>
                <Input 
                  type="select"
                  value={companyUpdates[company.company_id]?.sales_man || ''}
                  onChange={(e) => handleCompanyFieldChange(company.company_id, 'sales_man', e.target.value)}
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
                  value={companyUpdates[company.company_id]?.day || ''}
                  onChange={(e) => handleCompanyFieldChange(company.company_id, 'day', e.target.value)}
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
                  checked={companyUpdates[company.company_id]?.action || false}
                  onChange={(e) => handleCompanyFieldChange(company.company_id, 'action', e.target.checked)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default WeeklySchedule;
