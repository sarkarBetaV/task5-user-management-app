import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyEmail } from '../services/authService';
import VerificationSuccess from './VerificationSuccess';
import VerificationFailed from './VerificationFailed';

const EmailVerification = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'failed'

  useEffect(() => {
    const verifyToken = async () => {
      try {
        console.log('Verifying token:', token);
        const result = await verifyEmail(token);
        
        if (result.success) {
          setStatus('success');
        } else {
          setStatus('failed');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('failed');
      }
    };

    if (token) {
      verifyToken();
    } else {
      setStatus('failed');
    }
  }, [token]);

  if (status === 'loading') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.loadingSpinner}></div>
          <h1 style={styles.title}>Verifying Your Email...</h1>
          <p style={styles.message}>Please wait while we verify your email address.</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return <VerificationSuccess />;
  }

  if (status === 'failed') {
    return <VerificationFailed />;
  }
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  card: {
    backgroundColor: 'white',
    padding: '3rem',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    textAlign: 'center',
    maxWidth: '500px',
    width: '100%',
  },
  loadingSpinner: {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #007bff',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 20px',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '1rem',
  },
  message: {
    fontSize: '1rem',
    color: '#666',
    lineHeight: '1.6',
  },
};

// Add CSS for spinner animation
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`, styleSheet.cssRules.length);

export default EmailVerification;