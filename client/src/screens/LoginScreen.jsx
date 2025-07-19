import { useState } from 'react';
import api from '../services/api.js';
import { setToken } from '../utils/auth.js';
import { useNavigate, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import AnimatedButton from '../components/AnimatedButton';
import { motion } from 'framer-motion';
import { jwtDecode } from 'jwt-decode'; // ✅ FIX: named import

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setToken(data.token);

      const decoded = jwtDecode(data.token);

      toast.success('✅ Login successful!');

      setTimeout(() => {
        if (decoded.isNew) {
          navigate('/welcome-dashboard');
        } else {
          navigate('/dashboard');
        }
      }, 1000);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <motion.div
      initial={{ x: '-100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        maxWidth: '400px',
        margin: 'auto',
        paddingTop: '80px',
        textAlign: 'center',
        color: '#1f2937',
      }}
    >
      <Toaster position="top-center" reverseOrder={false} />
      <h2 style={{ color: '#4f46e5', marginBottom: '20px' }}>Login</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{
          display: 'block',
          width: '100%',
          padding: '10px',
          marginBottom: '10px',
          borderRadius: '4px',
          border: '1px solid #ddd',
        }}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{
          display: 'block',
          width: '100%',
          padding: '10px',
          marginBottom: '20px',
          borderRadius: '4px',
          border: '1px solid #ddd',
        }}
      />
      <AnimatedButton onClick={handleLogin} style={{ width: '100%' }}>
        Login
      </AnimatedButton>

      <p style={{ marginTop: '10px' }}>
        Don’t have an account?{' '}
        <Link to="/register" style={{ color: '#4f46e5', textDecoration: 'underline' }}>
          Register
        </Link>
      </p>
    </motion.div>
  );
}
