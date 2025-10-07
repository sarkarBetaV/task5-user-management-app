import React from 'react';
import { Link } from 'react-router-dom';

const VerificationSuccess = () => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconContainer}>
          <div style={styles.successIcon}>✓</div>
        </div>
        <h1 style={styles.title}>Email Verified Successfully! 🎉</h1>
        <p style={styles.message}>
          Your email has been successfully verified. You can now access all features of your account.
        </p>
        <div style={styles.buttonContainer}>
          <Link to="/login" style={styles.primaryButton}>
            Continue to Login
          </Link>
          <Link to="/" style={styles.secondaryButton}>
            Go to Homepage
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
  iconContainer: {
    marginBottom: '1.5rem',
  },
  successIcon: {
    width: '80px',
    height: '80px',
    backgroundColor: '#28a745',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '40px',
    fontWeight: 'bold',
    margin: '0 auto',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: '1rem',
  },
  message: {
    fontSize: '1.1rem',
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '2rem',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  primaryButton: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '12px 30px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    transition: 'background-color 0.3s',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    color: '#007bff',
    padding: '12px 30px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    border: '2px solid #007bff',
    transition: 'all 0.3s',
  },
};

export default VerificationSuccess;