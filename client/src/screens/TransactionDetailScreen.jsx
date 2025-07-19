import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Header from '../components/Header';
import { motion } from 'framer-motion';

export default function TransactionDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [txn, setTxn] = useState(null);

  useEffect(() => {
    api.get(`/payments/${id}`)
      .then(res => setTxn(res.data))
      .catch(() => {
        alert('Failed to fetch transaction details');
        navigate('/transactions');
      });
  }, [id, navigate]);

  if (!txn) {
    return (
      <div>
        <Header />
        <p style={{ textAlign: 'center', padding: '20px' }}>Loading transaction...</p>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          maxWidth: '600px',
          margin: '40px auto',
          background: '#f9fafb',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        <h2 style={{ color: '#4f46e5', marginBottom: '20px' }}>Transaction Details</h2>
        <p><strong>ID:</strong> {txn._id}</p>
        <p><strong>Receiver:</strong> {txn.receiver}</p>
        <p><strong>Amount:</strong> ₹{txn.amount}</p>
        <p><strong>Status:</strong> {txn.status}</p>
        <p><strong>Method:</strong> {txn.method}</p>
        <p><strong>Created At:</strong> {new Date(txn.createdAt).toLocaleString()}</p>

        <button
          onClick={() => navigate('/transactions')}
          style={{
            marginTop: '20px',
            backgroundColor: '#4f46e5',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Back to List
        </button>
      </motion.div>
    </div>
  );
}
