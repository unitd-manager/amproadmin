import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import SalesOrderDetails from '../SalesOrderDetails';
import api from '../../../constants/api';
import AppContext from '../../../context/AppContext';

// Mock all external dependencies
jest.mock('../../../constants/api');

const mockedMessage = jest.fn();
jest.mock('../../../components/Message', () => ({
  __esModule: true,
  default: (text, type) => mockedMessage(text, type),
}));


// Mock BreadCrumbs component
jest.mock('../../../layouts/breadcrumbs/BreadCrumbs', () => {
  return function MockedBreadCrumbs() {
    return <div data-testid="breadcrumbs">BreadCrumbs</div>;
  };
});

// Mock reactstrap components
jest.mock('reactstrap', () => {
    const ActualReactstrap = jest.requireActual('reactstrap');
    return {
      ...ActualReactstrap,
      Row: ({ children, className }) => (
        <div className={`row ${className || ''}`} data-testid="mock-row">
          {children}
        </div>
      ),
      Col: ({ children, md, xs, className }) => (
        <div 
          className={`col-md-${md} col-xs-${xs} ${className || ''}`}
          data-testid="mock-col"
        >
          {children}
        </div>
      ),
      Form: ({ children, onSubmit }) => (
        <form onSubmit={onSubmit} data-testid="mock-form">
          {children}
        </form>
      ),
      FormGroup: ({ children }) => (
        <div className="form-group" data-testid="mock-form-group">
          {children}
        </div>
      ),
      Label: ({ children, htmlFor }) => (
        <label htmlFor={htmlFor} data-testid={`label-${htmlFor}`}>
          {children}
        </label>
      ),
      Input: ({ type, name, value, onChange, children, className, ...props }) => {
        if (type === 'select') {
          return (
            <select
              name={name}
              value={value}
              onChange={onChange}
              className={className}
              data-testid={`select-${name}`}
              {...props}
            >
              {children}
            </select>
          );
        }
        return (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className={className}
            data-testid={`input-${name || 'unnamed'}`}
            {...props}
          />
        );
      },
      Button: ({ children, onClick, disabled, color, className, type, ...props }) => (
        <button
          onClick={onClick}
          disabled={disabled}
          className={`btn btn-${color} ${className || ''}`}
          type={type}
          data-testid={`button-${type || 'default'}`}
          {...props}
        >
          {children}
        </button>
      ),
    };
  });

// Mock ToastContainer with proper exports
jest.mock('react-toastify', () => ({
  ToastContainer: () => <div data-testid="toast-container">ToastContainer</div>,
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
  },
}));
 
// Mock ComponentCard
jest.mock('../../../components/ComponentCard', () => ({ children, title }) => (
  <div data-testid="component-card">
    <div data-testid="card-title">{title}</div>
    {children}
  </div>
));

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: '1' }),
}));

// Sample test data
const mockCompanyData = [
  { company_id: 1, company_name: 'Test Company 1' },
  { company_id: 2, company_name: 'Test Company 2' },
  { company_id: 3, company_name: 'Test Company 3' }
];

const mockCurrencyData = [
  { currency_id: 1, currency_name: 'USD' },
  { currency_id: 2, currency_name: 'EUR' },
  { currency_id: 3, currency_name: 'GBP' }
];

const mockSalesOrderData = {
  sales_order_id: 1,
  company_id: 1,
  currency_id: 1,
  company_name: 'Test Company 1',
  tran_no: 'SO001',
  tran_date: '2024-01-15',
  status: 'Open'
};

const mockLoggedInUser = {
  user_id: 1,
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@example.com'
};

const renderComponent = (routePath = '/SalesOrderDetails') => {
  return render(
    <MemoryRouter initialEntries={[routePath]}>
      <AppContext.Provider value={{ loggedInuser: mockLoggedInUser }}>
        <SalesOrderDetails />
      </AppContext.Provider>
    </MemoryRouter>
  );
};

describe('SalesOrderDetails Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock successful API responses
    api.get.mockImplementation((url) => {
      if (url === '/company/getCompany') {
        return Promise.resolve({ data: { data: mockCompanyData } });
      }
      if (url === '/currency/getCurrency') {
        return Promise.resolve({ data: { data: mockCurrencyData } });
      }
      return Promise.resolve({ data: { data: [] } });
    });

    api.post.mockImplementation((url) => {
      if (url === '/salesorder/getSalesorderById') {
        return Promise.resolve({ data: { data: [mockSalesOrderData] } });
      }
      if (url === '/commonApi/getCodeValues') {
        return Promise.resolve({ data: { data: 'SO002' } });
      }
      if (url === '/salesOrder/insertSalesOrder') {
        return Promise.resolve({ data: { data: { insertId: 123 } } });
      }
      return Promise.resolve({ data: { data: [] } });
    });
  });

  test('renders the component with form fields', async () => {
    renderComponent();

    // Check if the main title is rendered
    await waitFor(() => expect(screen.getByText('New Sales Order')).toBeInTheDocument());

    // Check if form fields are rendered
    await waitFor(() => expect(screen.getByText(/Company Name/)).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText(/Currency Name/)).toBeInTheDocument());
    await waitFor(() => expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument());
    await waitFor(() => expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument());
  });

  test('loads company and currency data on mount', async () => {
    renderComponent();

    // Wait for API calls and verify they were made
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/company/getCompany');
      expect(api.get).toHaveBeenCalledWith('/currency/getCurrency');
    });

    // Verify company data is loaded into the select
    const companySelect = screen.getByTestId('select-company_id');
    await waitFor(() => {
        expect(companySelect).toHaveValue('1');
    });
  });

  test('displays validation error when submitting empty form', async () => {
    renderComponent('/SalesOrderDetails');
    
    const companySelect = screen.getByTestId('select-company_id');
    fireEvent.change(companySelect, { target: { value: '' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Check if validation error is shown
    await waitFor(() => {
      expect(mockedMessage).toHaveBeenCalledWith('Please fill all required fields', 'warning');
    });
  });

  test('successfully submits the form with valid data', async () => {
    api.post.mockImplementation((url) => {
      if (url === '/commonApi/getCodeValues') {
        return Promise.resolve({ data: { data: 'SO002' } });
      }
      if (url === '/salesOrder/insertSalesOrder') {
        return Promise.resolve({ data: { data: { insertId: 123 } } });
      }
      return Promise.resolve({ data: { data: [] } });
    });

    renderComponent('/SalesOrderDetails');
    
    // Fill in the form
    const companySelect = await screen.findByTestId('select-company_id');
    fireEvent.change(companySelect, { target: { value: '1' } });

    const currencySelect = await screen.findByTestId('select-currency_id');
    fireEvent.change(currencySelect, { target: { value: '2' } });

    // Submit the form
    const submitButton = await screen.findByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    // Verify the API was called with the correct data
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        '/salesOrder/insertSalesOrder',
        expect.objectContaining({
          company_id: '1',
          currency_id: '2',
          status: 'Open',
          created_by: 'John',
        })
      );
      expect(mockedMessage).toHaveBeenCalledWith('Order inserted successfully.', 'success');
    });
  });

  test('loads existing sales order data when in edit mode', async () => {
    renderComponent('/SalesOrderDetails/1');

    // Verify the API was called to fetch the sales order
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        '/salesorder/getSalesorderById',
        { sales_order_id: '1' }
      );
    });

    // Verify form is populated with existing data
    await waitFor(() => {
        expect(screen.getByDisplayValue('Test Company 1')).toBeInTheDocument();
    });
  });
});
