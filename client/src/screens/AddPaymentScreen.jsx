import { useState, useEffect } from 'react';
import api from '../services/api.js';
import Header from '../components/Header.jsx';
import toast, { Toaster } from 'react-hot-toast';

export default function AddPaymentScreen() {
  const [payment, setPayment] = useState({
    amount: '',
    receiver: '',
    phone: '',
    status: 'success',
    method: 'cash'
  });
  const [allPayments, setAllPayments] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api.get('/payments').then(res => {
      setAllPayments(res.data);
    });
  }, []);

  const handleReceiverChange = (value) => {
    setPayment({ ...payment, receiver: value });
    if (value.trim() === '') {
      setSuggestions([]);
      setHistory([]);
      return;
    }

    const filteredNames = Array.from(
      new Set(
        allPayments
          .filter(txn => txn.receiver.toLowerCase().startsWith(value.toLowerCase()))
          .map(txn => txn.receiver)
      )
    );

    setSuggestions(filteredNames);

    const filteredHistory = allPayments.filter(txn =>
      txn.receiver.toLowerCase().startsWith(value.toLowerCase())
    );
    setHistory(filteredHistory);
  };

  const handleSuggestionClick = (name) => {
    setPayment({ ...payment, receiver: name });
    setSuggestions([]);
    const filteredHistory = allPayments.filter(txn => txn.receiver === name);
    setHistory(filteredHistory);
  };

  const handleSubmit = () => {
    if (!payment.amount || !payment.receiver || !payment.phone) {
      toast.error('⚠️ Amount, Receiver & Phone are required');
      return;
    }

    api.post('/payments', payment).then(res => {
      sendWhatsApp(res.data);
      toast.success('✅ Payment added & WhatsApp message sent');
      setPayment({ amount: '', receiver: '', phone: '', status: 'success', method: 'cash' });
      setSuggestions([]);
      setHistory([]);
    });
  };

  const sendWhatsApp = (txn) => {
    const msg = `📄 *Transaction Details:*\n\nID: ${txn._id}\nReceiver: ${txn.receiver}\nAmount: ₹${txn.amount}\nStatus: ${txn.status}\nMethod: ${txn.method}\nDate: ${new Date(txn.createdAt).toLocaleString()}`;
    const phone = payment.phone.replace(/\D/g, '');
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div>
      <Header />
      <Toaster position="top-center" />
      <div style={{ maxWidth: '600px', margin: 'auto', paddingTop: '30px' }}>
        <h2 style={{ marginBottom: '20px', color: '#4f46e5' }}>Add New Payment</h2>

        <input
          placeholder="Amount"
          value={payment.amount}
          onChange={e => setPayment({ ...payment, amount: e.target.value })}
          style={inputStyle}
        />

        <input
          placeholder="Receiver"
          value={payment.receiver}
          onChange={e => handleReceiverChange(e.target.value)}
          style={inputStyle}
        />

        {suggestions.length > 0 && (
          <div style={suggestionBoxStyle}>
            {suggestions.map(name => (
              <div
                key={name}
                onClick={() => handleSuggestionClick(name)}
                style={suggestionItemStyle}
              >
                {name}
              </div>
            ))}
          </div>
        )}

        <input
          placeholder="Phone Number (with country code, e.g., 91xxxxxxxxxx)"
          value={payment.phone}
          onChange={e => setPayment({ ...payment, phone: e.target.value })}
          style={inputStyle}
        />

        <select
          value={payment.status}
          onChange={e => setPayment({ ...payment, status: e.target.value })}
          style={inputStyle}
        >
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>

        <select
          value={payment.method}
          onChange={e => setPayment({ ...payment, method: e.target.value })}
          style={inputStyle}
        >
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="upi">UPI</option>
        </select>

        <button
          onClick={handleSubmit}
          style={submitButtonStyle}
        >
          Add Payment & Notify
        </button>

        {history.length > 0 && (
          <div style={{ marginTop: '30px' }}>
            <h3 style={{ color: '#4f46e5', marginBottom: '10px' }}>
              Previous Transactions for "{payment.receiver}"
            </h3>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {history.map(txn => (
                <div
                  key={txn._id}
                  style={{
                    background: '#f9fafb',
                    padding: '8px',
                    marginBottom: '5px',
                    borderRadius: '4px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                  }}
                >
                  <p><strong>Amount:</strong> ₹{txn.amount} | <strong>Status:</strong> {txn.status}</p>
                  <p><strong>Date:</strong> {new Date(txn.createdAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  display: 'block',
  width: '100%',
  padding: '10px',
  marginBottom: '10px',
  borderRadius: '4px',
  border: '1px solid #ddd',
};

const submitButtonStyle = {
  backgroundColor: '#4f46e5',
  color: 'white',
  border: 'none',
  padding: '10px',
  width: '100%',
  borderRadius: '4px',
  cursor: 'pointer',
  marginTop: '10px',
};

const suggestionBoxStyle = {
  background: '#f9fafb',
  padding: '5px',
  borderRadius: '4px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  marginBottom: '10px',
};

const suggestionItemStyle = {
  cursor: 'pointer',
  padding: '4px 8px',
  borderBottom: '1px solid #e5e7eb',
};
