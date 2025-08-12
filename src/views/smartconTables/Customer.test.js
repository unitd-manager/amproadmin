import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import Customer from './Customer';
import api from '../../constants/api';
import message from '../../components/Message';

// Mocking the external dependencies
jest.mock('../../constants/api');
jest.mock('../../components/Message');

const mockCustomers = [
  {
    company_id: 1,
    customer_code: 'CUST-001',
    company_name: 'Test Customer 1',
    address: '123 Test St',
    phone: '123-456-7890',
    email: 'test1@example.com',
    mobile: '098-765-4321',
    is_active: 1,
    formattedStatus: 'Active',
  },
  {
    company_id: 2,
    customer_code: 'CUST-002',
    company_name: 'Test Customer 2',
    address: '456 Test Ave',
    phone: '111-222-3333',
    email: 'test2@example.com',
    mobile: '444-555-6666',
    is_active: 0,
    formattedStatus: 'Inactive',
  },
];

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <Customer />
    </BrowserRouter>
  );
};

describe('Customer Component', () => {
  beforeEach(() => {
    api.get.mockResolvedValue({ data: { data: mockCustomers } });
    api.post.mockResolvedValue({ data: {} });
    window.confirm = jest.fn(() => true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the customer list page with initial data', async () => {
    renderComponent();

    expect(screen.getByText('Customer List')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Customer Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Mobile No.')).toBeInTheDocument();
    expect(screen.getByText('Add New')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Test Customer 1')).toBeInTheDocument();
      expect(screen.getByText('Test Customer 2')).toBeInTheDocument();
    });
  });

  test('filters customers by name', async () => {
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText('Customer Name'), { target: { value: 'Test Customer 1' } });

    await waitFor(() => {
        expect(api.get).toHaveBeenCalledWith('/contact/getContactss', {
            params: {
              company_name: 'Test Customer 1',
              mobile: '',
              is_active: 1,
            },
          });
    });
  });

  test('handles deleting a customer', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Test Customer 1')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByTestId('delete-button');
    fireEvent.click(deleteButtons[0]);

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this customer?');

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/contact/deleteContact', { company_id: 1 });
      expect(message).toHaveBeenCalledWith('Customer deleted successfully', 'success');
    });
  });

  test('handles activating a customer', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Test Customer 2')).toBeInTheDocument();
    });

    const activateButtons = screen.getAllByTestId('activate-button');
    fireEvent.click(activateButtons[0]);

    expect(screen.getByText('Activate Customer')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Activate'));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/contact/updateContactStatus', {
        company_id: 2,
        is_active: 1,
      });
      expect(message).toHaveBeenCalledWith('Customer activated successfully', 'success');
    });
  });

  test('navigates to the add new customer page', () => {
    const { container } = renderComponent();
    const addNewButton = screen.getByText('Add New').closest('a');
    expect(addNewButton).toHaveAttribute('href', '/CustomerDetails');
  });

  test('navigates to the edit customer page', async () => {
    renderComponent();
    await waitFor(() => {
        expect(screen.getByText('Test Customer 1')).toBeInTheDocument();
      });
  
      const editButtons = screen.getAllByTestId('edit-button');
      expect(editButtons[0].closest('a')).toHaveAttribute('href', '/CustomerEdit/1');
  });
});
