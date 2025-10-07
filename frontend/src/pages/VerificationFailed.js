import React from 'react';
import { Link } from 'react-router-dom';

const VerificationFailed = () => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.errorIcon}>✗</div>
        <h1 style={styles.title}>Email Verification Failed</h1>
        <p style={styles.message}>
          The verification link is invalid or has expired. 
          Please try registering again or contact support if the problem persists.
        </p>
        <div style={styles.actions}>
          <Link to="/register" style={styles.button}>
            Register Again
          </Link>
          <Link to="/login" style={styles.secondaryButton}>
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5'
  },
  card: {
    backgroundColor: 'white',
    padding: '3rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    textAlign: 'center',
    maxWidth: '500px'
  },
  errorIcon: {
    fontSize: '4rem',
    color: '#dc3545',
    marginBottom: '1rem'
  },
  title: {
    color: '#333',
    marginBottom: '1rem'
  },
  message: {
    color: '#666',
    marginBottom: '2rem',
    fontSize: '1.1rem',
    lineHeight: '1.5'
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center'
  },
  button: {
    display: 'inline-block',
    padding: '0.75rem 2rem',
    backgroundColor: '#dc3545',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    fontSize: '1rem'
  },
  secondaryButton: {
    display: 'inline-block',
    padding: '0.75rem 2rem',
    backgroundColor: '#6c757d',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    fontSize: '1rem'
  }
};

export default VerificationFailed;