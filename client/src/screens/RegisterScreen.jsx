import { useState } from 'react';
import api from '../services/api.js';
import { useNavigate, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import AnimatedButton from '../components/AnimatedButton';
import { motion } from 'framer-motion';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await api.post('/auth/register', { email, password });
      toast.success('🎉 Account created! Redirecting...');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '-100%', opacity: 0 }}
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
      <h2 style={{ color: '#4f46e5', marginBottom: '20px' }}>Register</h2>

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
      <AnimatedButton onClick={handleRegister} style={{ width: '100%' }}>
        Register
      </AnimatedButton>

      <p style={{ marginTop: '10px' }}>
        Already have an account?{' '}
        <Link to="/" style={{ color: '#4f46e5', textDecoration: 'underline' }}>
          Login
        </Link>
      </p>
    </motion.div>
  );
}
