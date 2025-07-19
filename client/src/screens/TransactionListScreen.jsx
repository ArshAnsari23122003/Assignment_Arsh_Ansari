import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import Header from '../components/Header.jsx';

export default function TransactionListScreen() {
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    method: '',
    startDate: '',
    endDate: '',
  });
  const navigate = useNavigate();

  const pageSize = 5;

  useEffect(() => {
    api.get('/payments').then(res => {
      setTransactions(res.data);
      setFiltered(res.data);
    });
  }, []);

  const applyFilters = () => {
    let data = [...transactions];

    if (filters.status) {
      data = data.filter(txn => txn.status === filters.status);
    }

    if (filters.method) {
      data = data.filter(txn => txn.method === filters.method);
    }

    if (filters.startDate) {
      const start = new Date(filters.startDate);
      data = data.filter(txn => new Date(txn.createdAt) >= start);
    }

    if (filters.endDate) {
      const end = new Date(filters.endDate);
      data = data.filter(txn => new Date(txn.createdAt) <= end);
    }

    setFiltered(data);
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ status: '', method: '', startDate: '', endDate: '' });
    setFiltered(transactions);
    setPage(1);
  };

  const exportToCSV = () => {
    const csvHeader = ['Receiver,Amount,Status,Method,Date'];
    const csvRows = filtered.map(txn =>
      [
        txn.receiver,
        txn.amount,
        txn.status,
        txn.method,
        new Date(txn.createdAt).toLocaleString()
      ].join(',')
    );

    const blob = new Blob([csvHeader.concat(csvRows).join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <Header />
      <div style={{ maxWidth: '800px', margin: 'auto', paddingTop: '30px' }}>
        <h2 style={{ color: '#4f46e5', marginBottom: '20px', textAlign: 'center' }}>
          All Transactions
        </h2>

        {/* Filters */}
        <div
          style={{
            marginBottom: '20px',
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
            padding: '10px',
            backgroundColor: '#f3f4f6',
            borderRadius: '8px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
          }}
        >
          <select
            value={filters.status}
            onChange={e => setFilters({ ...filters, status: e.target.value })}
            style={selectStyle}
          >
            <option value="">All Status</option>
            <option value="success">Success</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          <select
            value={filters.method}
            onChange={e => setFilters({ ...filters, method: e.target.value })}
            style={selectStyle}
          >
            <option value="">All Methods</option>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="upi">UPI</option>
          </select>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontSize: '12px', color: '#374151' }}>Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={e => setFilters({ ...filters, startDate: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontSize: '12px', color: '#374151' }}>End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={e => setFilters({ ...filters, endDate: e.target.value })}
              style={inputStyle}
            />
          </div>

          <button
            onClick={applyFilters}
            style={applyBtnStyle}
          >
            Apply Filters
          </button>

          <button
            onClick={clearFilters}
            style={clearBtnStyle}
          >
            Clear
          </button>

          <button
            onClick={exportToCSV}
            style={exportBtnStyle}
          >
            Export to CSV
          </button>
        </div>

        {/* Transaction Cards */}
        {paginated.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6b7280' }}>No transactions found.</p>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            {paginated.map(txn => (
              <div
                key={txn._id}
                style={{
                  backgroundColor: txn.status === 'failed' ? '#fee2e2' : '#f9fafb',
                  padding: '15px',
                  borderRadius: '6px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
              >
                <p><strong>Receiver:</strong> {txn.receiver}</p>
                <p><strong>Amount:</strong> ₹{txn.amount}</p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span style={{ color: txn.status === 'failed' ? '#dc2626' : '#16a34a' }}>
                    {txn.status}
                  </span>
                </p>
                <p><strong>Method:</strong> {txn.method}</p>
                <button
                  onClick={() => navigate(`/transactions/${txn._id}`)}
                  style={detailBtnStyle}
                >
                  See Transaction Details
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            style={paginationBtn}
          >
            Previous
          </button>
          <span style={{ margin: '0 10px' }}>Page {page}</span>
          <button
            disabled={page * pageSize >= filtered.length}
            onClick={() => setPage(page + 1)}
            style={paginationBtn}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

// Styles
const selectStyle = {
  padding: '6px',
  borderRadius: '4px',
  border: '1px solid #ddd',
};

const inputStyle = {
  padding: '6px',
  borderRadius: '4px',
  border: '1px solid #ddd',
};

const applyBtnStyle = {
  backgroundColor: '#4f46e5',
  color: '#fff',
  border: 'none',
  padding: '8px 12px',
  borderRadius: '4px',
  cursor: 'pointer',
};

const clearBtnStyle = {
  backgroundColor: '#ef4444',
  color: '#fff',
  border: 'none',
  padding: '8px 12px',
  borderRadius: '4px',
  cursor: 'pointer',
};

const exportBtnStyle = {
  backgroundColor: '#10b981',
  color: '#fff',
  border: 'none',
  padding: '8px 12px',
  borderRadius: '4px',
  cursor: 'pointer',
};

const detailBtnStyle = {
  marginTop: '10px',
  backgroundColor: '#4f46e5',
  color: '#fff',
  border: 'none',
  padding: '6px 10px',
  borderRadius: '4px',
  cursor: 'pointer',
};

const paginationBtn = {
  backgroundColor: '#4f46e5',
  color: '#fff',
  border: 'none',
  padding: '6px 10px',
  borderRadius: '4px',
  cursor: 'pointer',
  margin: '0 5px',
};
