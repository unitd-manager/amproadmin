import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import CustomerDetails from './CustomerDetails';
import api from '../../constants/api';
import message from '../../components/Message';

// Mocking the external dependencies
jest.mock('../../constants/api');
jest.mock('../../components/Message');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <CustomerDetails />
    </BrowserRouter>
  );
};

describe('CustomerDetails Component', () => {
  beforeEach(() => {
    api.post.mockResolvedValue({ data: { data: { insertId: 100 } } });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the new customer details page', () => {
    renderComponent();
    expect(screen.getByText('New Customer Details')).toBeInTheDocument();
    expect(screen.getByLabelText('Customer Code')).toBeInTheDocument();
    expect(screen.getByLabelText(/Customer Name/)).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  test('save button is disabled if required fields are empty', () => {
    renderComponent();
    expect(screen.getByText('Save')).toBeDisabled();
  });

  test('enables save button when required fields are filled', () => {
    renderComponent();
    fireEvent.change(screen.getByLabelText('Customer Code'), { target: { value: 'CUST-101' } });
    fireEvent.change(screen.getByLabelText(/Customer Name/), { target: { value: 'New Test Customer' } });
    expect(screen.getByText('Save')).not.toBeDisabled();
  });

  test('calls api to insert customer and navigates on successful save', async () => {
    renderComponent();
    const customerCodeInput = screen.getByLabelText('Customer Code');
    const customerNameInput = screen.getByLabelText(/Customer Name/);
    const saveButton = screen.getByText('Save');

    fireEvent.change(customerCodeInput, { target: { value: 'CUST-101' } });
    fireEvent.change(customerNameInput, { target: { value: 'New Test Customer' } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('company/insertCompany', {
        customer_code: 'CUST-101',
        company_name: 'New Test Customer',
      });
      expect(message).toHaveBeenCalledWith('Customer details inserted successfully.', 'success');
      expect(mockNavigate).toHaveBeenCalledWith('/CustomerEdit/100');
    });
  });

  test('shows error message if required fields are not filled on save', async () => {
    renderComponent();
    fireEvent.click(screen.getByText('Save'));
    await waitFor(() => {
        expect(message).toHaveBeenCalledWith('Please fill all required fields.', 'error');
    });
  });

  test('cancel button navigates back', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
