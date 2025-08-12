import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CustomerEdit from './CustomerEdit';
import api from '../../constants/api';
import message from '../../components/Message';
import AppContext from '../../context/AppContext';

// Mocking child components
jest.mock('../../components/Customer/CustomerMoreDetails', () => () => <div>ContentMoreDetails</div>);
jest.mock('../../components/Customer/CustomerLogin', () => () => <div>CustomerLogin</div>);
jest.mock('../../components/Customer/ContactPerson', () => () => <div>ContactPerson</div>);
jest.mock('../../components/Customer/ShippingDetail', () => () => <div>CustomerShippingDetail</div>);
jest.mock('../../components/Customer/SalesMan', () => () => <div>CustomerSalesmen</div>);
jest.mock('../../components/Customer/Module', () => () => <div>CustomerTransactions</div>);
jest.mock('../../components/Customer/ProductDetails', () => () => <div>CustomerProductDetails</div>);
jest.mock('../../components/WeeklySchedule/WeeklySchedule', () => () => <div>WeeklySchedule</div>);

// Mocking external dependencies
jest.mock('../../constants/api');
jest.mock('../../components/Message');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: '1' }),
}));

const mockCustomerData = {
  company_id: 1,
  customer_code: 'CUST-001',
  company_name: 'Test Customer 1',
  first_name: 'Test Customer 1',
  mobile: '1234567890',
  email: 'test@example.com',
  is_active: 1,
};

const loggedInUser = {
    first_name: 'Test User'
};

const renderComponent = () => {
  return render(
    <AppContext.Provider value={{ loggedInuser: loggedInUser }}>
        <MemoryRouter initialEntries={['/CustomerEdit/1']}>
            <Routes>
                <Route path="/CustomerEdit/:id" element={<CustomerEdit />} />
            </Routes>
        </MemoryRouter>
    </AppContext.Provider>
  );
};

describe('CustomerEdit Component', () => {
  beforeEach(() => {
    api.post.mockResolvedValue({ data: { data: [mockCustomerData] } });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the customer edit page and fetches data', async () => {
    renderComponent();

    await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/contact/getContactssById', { company_id: '1' });
        expect(screen.getByDisplayValue('CUST-001')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Test Customer 1')).toBeInTheDocument();
    });

    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Apply')).toBeInTheDocument();
    expect(screen.getByText('Back to List')).toBeInTheDocument();
  });

  test('handles input changes', async () => {
    renderComponent();
    await waitFor(() => {
        expect(screen.getByDisplayValue('Test Customer 1')).toBeInTheDocument();
    });

    const nameInput = screen.getByDisplayValue('Test Customer 1');
    fireEvent.change(nameInput, { target: { value: 'Updated Customer Name' } });
    expect(nameInput.value).toBe('Updated Customer Name');
  });

  test('switches between tabs', async () => {
    renderComponent();
    await waitFor(() => {
        expect(screen.getByText('Additional')).toBeInTheDocument();
    });

    // Default tab
    expect(screen.getByText('ContentMoreDetails')).toBeVisible();

    // Click on another tab
    fireEvent.click(screen.getByText('Customer Login Info'));
    await waitFor(() => {
        expect(screen.getByText('CustomerLogin')).toBeVisible();
    });

    fireEvent.click(screen.getByText('Contact'));
    await waitFor(() => {
        expect(screen.getByText('ContactPerson')).toBeVisible();
    });
  });

  test('saves the data when "Save" button is clicked', async () => {
    renderComponent();
    await waitFor(() => {
        expect(screen.getByDisplayValue('Test Customer 1')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByDisplayValue('Test Customer 1'), { target: { value: 'Updated Customer Name' } });
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/contact/editContact', expect.objectContaining({
            company_name: 'Updated Customer Name'
        }));
        expect(message).toHaveBeenCalledWith('Record edited successfully', 'success');
    });
  });

  test('saves the data when "Apply" button is clicked', async () => {
    renderComponent();
    await waitFor(() => {
        expect(screen.getByDisplayValue('Test Customer 1')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByDisplayValue('Test Customer 1'), { target: { value: 'Updated Customer Name' } });
    fireEvent.click(screen.getByText('Apply'));

    await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/contact/editContact', expect.objectContaining({
            company_name: 'Updated Customer Name'
        }));
        expect(message).toHaveBeenCalledWith('Record edited successfully', 'success');
        expect(mockNavigate).not.toHaveBeenCalled(); // Should not navigate on Apply
    });
  });

  test('shows warning if required fields are empty on save', async () => {
    api.post.mockResolvedValue({ data: { data: [{...mockCustomerData, first_name: '', mobile: '', email: ''}] } });
    renderComponent();
    
    await waitFor(() => {
        expect(screen.getByDisplayValue('CUST-001')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
        expect(message).toHaveBeenCalledWith('Please fill all required fields (Name, Mobile, Email)', 'warning');
    });
  });
});
