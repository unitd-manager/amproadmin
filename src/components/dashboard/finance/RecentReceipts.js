import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardHeader, CardBody, Table, Input, Button } from 'reactstrap';
import { FaFilter } from 'react-icons/fa';
import api from '../../../constants/api';

const toISO = (d) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const RecentReceipts = () => {
  const [raw, setRaw] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState(toISO(new Date()));
  const [toDate, setToDate] = useState(toISO(new Date()));
  const [showFilters, setShowFilters] = useState(false);

  // Fallback API: reuse invoices data as receipts if dedicated endpoint is absent.
  const fetchReceipts = () => {
    setLoading(true);
    const params = { fromDate, toDate };
    api
      .post('/invoice/getFilteredInvoices', params)
      .then((res) => {
        const data = res?.data?.data || [];
        // Normalize fields to match UI columns
        const mapped = Array.isArray(data)
          ? data.map((x) => ({
              id: x.invoice_id || x.id,
              date: x.date || x.invoice_date,
              code: x.invoiceNo || x.invoice_code,
              customer: x.customer || x.company_name,
              amount: x.amount || x.invoice_amount,
            }))
          : [];
        setRaw(mapped);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchReceipts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const start = fromDate ? new Date(fromDate) : null;
    const end = toDate ? new Date(toDate) : null;
  return raw
      .filter((x) => !!x?.date)
      .filter((x) => {
        const d = new Date(x.date);
        if (start && d < start) return false;
        if (end && d > end) return false;
        return true;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [raw, fromDate, toDate]);

  return (
    <Card className="shadow-sm mb-4 h-100" style={{ borderRadius: '8px' }}>
      <CardHeader className="bg-white" style={{ borderBottom: '1px solid #dee2e6', padding: '1rem' }}>
        <h5 className="mb-0 text-primary" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
          Recent Receipts
        </h5>
        <div className="d-flex align-items-center mt-2" style={{ gap: '8px' }}>
          {showFilters && (
            <>
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                style={{ width: '120px', fontSize: '0.875rem' }}
                className="border-primary"
              />
              <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                style={{ width: '120px', fontSize: '0.875rem' }}
                className="border-primary"
              />
              <Button
                color="primary"
                size="sm"
                onClick={fetchReceipts}
                disabled={loading}
                style={{ fontSize: '0.875rem', padding: '0.375rem 0.75rem' }}
              >
                OK
              </Button>
            </>
          )}
          <Button color="light" size="sm" onClick={() => setShowFilters((s) => !s)}>
            <FaFilter className="text-muted" style={{ fontSize: '1rem' }} />
          </Button>
        </div>
      </CardHeader>
      <CardBody style={{ maxHeight: '400px', overflowY: 'auto', padding: '0' }}>
        <Table bordered responsive hover size="sm" className="mb-0">
          <thead className="table-light" style={{ backgroundColor: '#f8f9fa' }}>
            <tr>
              <th style={{ fontWeight: 'bold', fontSize: '0.875rem', padding: '0.75rem' }}>Date</th>
              <th style={{ fontWeight: 'bold', fontSize: '0.875rem', padding: '0.75rem' }}>InvoiceNo</th>
              <th style={{ fontWeight: 'bold', fontSize: '0.875rem', padding: '0.75rem' }}>Customer</th>
              <th className="text-end" style={{ fontWeight: 'bold', fontSize: '0.875rem', padding: '0.75rem' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>{r.date}</td>
                <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>
                  <a href="#!" className="text-primary" style={{ textDecoration: 'none' }}>
                    {r.code}
                  </a>
                </td>
                <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>
                  <a href="#!" className="text-primary" style={{ textDecoration: 'none' }}>
                    {r.customer}
                  </a>
                </td>
                <td className="text-end" style={{ padding: '0.75rem', fontSize: '0.875rem', fontWeight: '500' }}>
                  {Number(r.amount || 0).toFixed(2)}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center" style={{ padding: '2rem', color: '#6c757d' }}>
                  {loading ? 'Loading...' : 'No receipts in range.'}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default RecentReceipts;


