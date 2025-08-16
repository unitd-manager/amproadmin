import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import Test from './salesOrder';
import api from '../../constants/api';

// Mock the api module
jest.mock('../../constants/api');

// Mock child components
jest.mock('../../components/CommonTable', () => ({ children, title, Button }) => (
  <div>
    <h1>{title}</h1>
    {Button}
    <table>{children}</table>
  </div>
));
jest.mock('../../layouts/breadcrumbs/BreadCrumbs', () => () => <div />);
jest.mock('../../components/PDF/PrintPerfoma', () => () => <div />);
jest.mock('../../components/PDF/SalesOrderPrintWithCost', () => () => <div />);
jest.mock('../../components/PDF/PdfPick', () => () => <div />);
jest.mock('../../components/PDF/PdfPack', () => () => <div />);
jest.mock('../../components/PDF/PdfSalesOrderQuote', () => () => <div />);

describe('SalesOrder Component', () => {
  const mockData = [
    { sales_order_id: 1, tran_no: 'SO-101', tran_date: '2024-01-01', company_name: 'Test Corp', status: 'Open', sub_total: 100, tax: 10, net_total: 110, created_by: 'Admin' },
    { sales_order_id: 2, tran_no: 'SO-102', tran_date: '2024-01-02', company_name: 'Another Corp', status: 'Closed', sub_total: 200, tax: 20, net_total: 220, created_by: 'Admin' },
  ];

  let apiPostSpy;

  beforeEach(() => {
    apiPostSpy = jest.spyOn(api, 'post').mockResolvedValue({ data: { data: mockData } });
  });

  afterEach(() => {
    apiPostSpy.mockRestore();
  });

  test('renders the component and fetches data', async () => {
    render(
      <Router>
        <Test />
      </Router>
    );
    await waitFor(() => {
      expect(screen.getByText('Sales Order List')).toBeInTheDocument();
      expect(screen.getByText('SO-101')).toBeInTheDocument();
      expect(screen.getByText('SO-102')).toBeInTheDocument();
    });
  });

  test('handles search functionality', async () => {
    render(
      <Router>
        <Test />
      </Router>
    );
    apiPostSpy.mockClear();
    fireEvent.change(screen.getByPlaceholderText('Tran No'), { target: { value: 'SO-101' } });
    fireEvent.click(screen.getByText('Search'));
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/salesOrder/getsalesorder', expect.objectContaining({ tran_no: 'SO-101' }));
    });
  });

  test('handles deleting selected orders', async () => {
    window.confirm = jest.fn(() => true);
    render(
      <Router>
        <Test />
      </Router>
    );
    await waitFor(() => {
      fireEvent.click(screen.getAllByRole('checkbox')[1]);
    });
    apiPostSpy.mockClear();
    fireEvent.click(screen.getByTestId('delete-button'));
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/salesOrder/deleteSalesOrder', { sales_order_id: [1] });
    });
  });

  test('New Transaction button navigates to SalesOrderDetails', () => {
    const { container } = render(
      <Router>
        <Test />
      </Router>
    );
    const newTransactionButton = container.querySelector('a[href="/SalesOrderDetails"]');
    expect(newTransactionButton).toBeInTheDocument();
  });

  test('calls generateInvoice when "Convert To Sales Invoice" is clicked', async () => {
    render(
      <Router>
        <Test />
      </Router>
    );
    await waitFor(() => {
      fireEvent.click(screen.getAllByRole('checkbox')[1]);
    });
    apiPostSpy.mockClear();
    fireEvent.click(screen.getByTestId('new-transaction-button'));
    await waitFor(() => {
      fireEvent.click(screen.getByText('Convert To Sales Invoice'));
    });
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/salesOrder/generateInvoiceFromSalesOrder', expect.any(Object));
    });
  });

  test('calls generateDeliveryOrder when "Convert To Delivery Order" is clicked', async () => {
    render(
      <Router>
        <Test />
      </Router>
    );
    await waitFor(() => {
      fireEvent.click(screen.getAllByRole('checkbox')[1]);
    });
    apiPostSpy.mockClear();
    fireEvent.click(screen.getByTestId('new-transaction-button'));
    await waitFor(() => {
      fireEvent.click(screen.getByText('Convert To Delivery Order'));
    });
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/salesOrder/generateDeliveryFromDeliveryOrder', expect.any(Object));
    });
  });

  test('calls repeatSalesOrder when "Repeat Sales Order" is clicked', async () => {
    render(
      <Router>
        <Test />
      </Router>
    );
    await waitFor(() => {
      fireEvent.click(screen.getAllByRole('checkbox')[1]);
    });
    apiPostSpy.mockClear();
    fireEvent.click(screen.getByTestId('new-transaction-button'));
    await waitFor(() => {
      fireEvent.click(screen.getByText('Repeat Sales Order'));
    });
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/salesOrder/repeatSalesOrder', expect.any(Object));
    });
  });
});
