import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginScreen from './screens/LoginScreen.jsx';
import RegisterScreen from './screens/RegisterScreen.jsx';
import DashboardScreen from './screens/DashboardScreen.jsx';
import AddPaymentScreen from './screens/AddPaymentScreen.jsx';
import TransactionListScreen from './screens/TransactionListScreen.jsx';
import TransactionDetailScreen from './screens/TransactionDetailScreen.jsx';
import WelcomeDashboard from './screens/WelcomeDashboard.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/dashboard" element={<DashboardScreen />} />
        <Route path="/welcome-dashboard" element={<WelcomeDashboard />} />
        <Route path="/add-payment" element={<AddPaymentScreen />} />
        <Route path="/transactions" element={<TransactionListScreen />} />
        <Route path="/transactions/:id" element={<TransactionDetailScreen />} />
      </Routes>
    </BrowserRouter>
  );
}
