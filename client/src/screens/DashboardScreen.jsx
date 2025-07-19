import { useEffect, useState } from 'react';
import api from '../services/api.js';
import Header from '../components/Header.jsx';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

export default function DashboardScreen() {
  const [metrics, setMetrics] = useState({
    totalPaymentsToday: 0,
    totalPaymentsThisWeek: 0,
    totalRevenue: 0,
    failedCount: 0,
    revenueTrend: [],
  });

  useEffect(() => {
    api.get('/payments/stats')
      .then(res => {
        setMetrics(res.data);
      })
      .catch(() => {
        console.error('Failed to fetch dashboard metrics');
      });
  }, []);

  return (
    <div>
      <Header />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          maxWidth: '1000px',
          margin: 'auto',
          paddingTop: '30px',
          textAlign: 'center',
        }}
      >
        <h2 style={{ color: '#4f46e5', marginBottom: '20px' }}>Dashboard Metrics</h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '40px',
          }}
        >
          <MetricCard title="Payments Today" value={metrics.totalPaymentsToday} color="#4f46e5" />
          <MetricCard title="Payments This Week" value={metrics.totalPaymentsThisWeek} color="#3b82f6" />
          <MetricCard title="Total Revenue" value={`₹${metrics.totalRevenue}`} color="#22c55e" />
          <MetricCard title="Failed Transactions" value={metrics.failedCount} color="#ef4444" />
        </div>

        <h3 style={{ marginBottom: '20px', color: '#4f46e5' }}>Revenue Trend (Last 7 Days)</h3>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrics.revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}

function MetricCard({ title, value, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      style={{
        backgroundColor: '#f9fafb',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <h3>{title}</h3>
      <p
        style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color,
        }}
      >
        {value}
      </p>
    </motion.div>
  );
}
