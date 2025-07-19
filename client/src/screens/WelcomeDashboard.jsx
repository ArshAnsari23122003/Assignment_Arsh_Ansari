import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { useEffect } from 'react';

export default function WelcomeDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    toast.success('🎉 Welcome! Enjoy your new dashboard.');
  }, []);

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <Toaster position="top-center" reverseOrder={false} />
      <h1 style={{ color: '#4f46e5', fontSize: '2rem' }}>🎉 Welcome to Your Dashboard!</h1>
      <p style={{ marginTop: '20px', fontSize: '1.1rem', color: '#374151' }}>
        Since this is your first login, we’ve prepared a special experience for you.
      </p>
      <button
        onClick={() => navigate('/dashboard')}
        style={{
          marginTop: '30px',
          backgroundColor: '#4f46e5',
          color: '#fff',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '1rem',
        }}
      >
        Go to Dashboard
      </button>
    </div>
  );
}
