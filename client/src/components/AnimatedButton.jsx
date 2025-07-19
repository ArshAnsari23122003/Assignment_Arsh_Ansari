import { motion } from 'framer-motion';

export default function AnimatedButton({ children, onClick, style = {} }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{
        backgroundColor: '#4f46e5',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        padding: '10px',
        cursor: 'pointer',
        fontWeight: 'bold',
        ...style,
      }}
    >
      {children}
    </motion.button>
  );
}
