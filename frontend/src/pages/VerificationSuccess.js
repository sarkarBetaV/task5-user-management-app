import React from 'react';
import { Link } from 'react-router-dom';

const VerificationSuccess = () => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.successIcon}>✓</div>
        <h1 style={styles.title}>Email Verified Successfully!</h1>
        <p style={styles.message}>
          Your email has been verified successfully. You can now log in to your account.
        </p>
        <Link to="/login" style={styles.button}>
          Go to Login
        </Link>
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
  successIcon: {
    fontSize: '4rem',
    color: '#28a745',
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
  button: {
    display: 'inline-block',
    padding: '0.75rem 2rem',
    backgroundColor: '#007bff',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    transition: 'background-color 0.2s'
  }
};

export default VerificationSuccess;