import React from 'react';
import { Link } from 'react-router-dom';

const VerificationFailed = () => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconContainer}>
          <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 style={styles.title}>Verification Failed 😔</h1>
        <p style={styles.message}>
          The verification link is invalid or has expired. Please try registering again or contact support if the problem persists.
        </p>
        <div style={styles.buttonContainer}>
          <Link to="/register" style={styles.primaryButton}>
            Register Again
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
  icon: {
    width: '80px',
    height: '80px',
    color: '#dc3545',
    margin: '0 auto',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#dc3545',
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
    backgroundColor: '#dc3545',
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

// Add hover effects
styles.primaryButton[':hover'] = {
  backgroundColor: '#c82333',
};
styles.secondaryButton[':hover'] = {
  backgroundColor: '#007bff',
  color: 'white',
};

export default VerificationFailed;