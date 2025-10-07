import React from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { useAuth } from './context/AuthContext.js';  // Add .js extension
import Login from './components/Login.js';  // Add .js extension
import Register from './components/Register.js';  // Add .js extension
import Dashboard from './components/Dashboard.js';  // Add .js extension
import VerificationSuccess from './pages/VerificationSuccess.js';  // Add .js extension
import VerificationFailed from './pages/VerificationFailed.js';  // Add .js extension

// Email Verification Component
const EmailVerification = () => {
  const { verifyEmail } = useAuth();
  const { token } = useParams();

  React.useEffect(() => {
    const verifyToken = async () => {
      try {
        await verifyEmail(token);
        window.location.href = '/verify-email/success';
      } catch (error) {
        window.location.href = '/verify-email/failed';
      }
    };

    verifyToken();
  }, [token, verifyEmail]);

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h2>Verifying your email...</h2>
      <p>Please wait while we verify your email address.</p>
    </div>
  );
};

function App() {
  const { user } = useAuth();

  return (
    <div className="App">
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <Login /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/register" 
          element={!user ? <Register /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/dashboard" 
          element={user ? <Dashboard /> : <Navigate to="/login" />} 
        />
        <Route path="/verify-email/success" element={<VerificationSuccess />} />
        <Route path="/verify-email/failed" element={<VerificationFailed />} />
        <Route path="/verify-email/:token" element={<EmailVerification />} />
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </div>
  );
}

export default App;