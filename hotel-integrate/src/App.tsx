import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Users from './pages/Users';
import BookRoom from './pages/BookRoom';
import Reservations from './pages/Reservations';
import ReservationDetailsPage from './pages/ReservationDetails';
import AddRoom from './pages/AddRoom';
import MakePayment from './pages/MakePayment';
import MakePaymentGeneric from './pages/MakePaymentGeneric';

import './App.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
          <Route path="/book-room" element={<ProtectedRoute><BookRoom /></ProtectedRoute>} />
          <Route path="/reservations" element={<ProtectedRoute><Reservations /></ProtectedRoute>} />
          <Route path="/reservations/:reservationId" element={<ProtectedRoute><ReservationDetailsPage /></ProtectedRoute>} />
          <Route path="/add-room" element={<ProtectedRoute><AddRoom /></ProtectedRoute>} />
          <Route path="/make-payment" element={<ProtectedRoute><MakePaymentGeneric /></ProtectedRoute>} />
          <Route path="/make-payment/:reservationId" element={<ProtectedRoute><MakePayment /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
