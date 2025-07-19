import { NavLink, useNavigate } from 'react-router-dom';
import { removeToken } from '../utils/auth';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    toast.success('🚪 Logged out');
    setTimeout(() => navigate('/'), 1000);
  };

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#4f46e5',
        color: 'white',
      }}
    >
      <motion.h3
        whileHover={{ scale: 1.05 }}
        style={{ cursor: 'default' }}
      >
      Payment Dashboard
      </motion.h3>

      <nav style={{ display: 'flex', gap: '15px' }}>
        <NavLink
          to="/dashboard"
          style={({ isActive }) => ({
            color: isActive ? '#22c55e' : 'white',
            textDecoration: 'none',
          })}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/transactions"
          style={({ isActive }) => ({
            color: isActive ? '#22c55e' : 'white',
            textDecoration: 'none',
          })}
        >
          Transactions
        </NavLink>
        <NavLink
          to="/add-payment"
          style={({ isActive }) => ({
            color: isActive ? '#22c55e' : 'white',
            textDecoration: 'none',
          })}
        >
          Add Payment
        </NavLink>
      </nav>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleLogout}
        style={{
          backgroundColor: '#ef4444',
          color: 'white',
          border: 'none',
          padding: '6px 10px',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Logout
      </motion.button>
    </motion.header>
  );
}
