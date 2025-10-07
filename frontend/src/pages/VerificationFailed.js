import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const VerificationFailed = () => {
  const location = useLocation();
  const errorMessage = location.state?.errorMessage || 'The verification link is invalid or has expired.';

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconContainer}>
          <div style={styles.failedIcon}>✗</div>
        </div>
        <h1 style={styles.title}>Verification Failed 😔</h1>
        <p style={styles.message}>
          {errorMessage}
        </p>
        <div style={styles.buttonContainer}>
          <Link to="/register" style={styles.primaryButton}>
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

// ... keep your existing styles the same ...
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
  failedIcon: {
    width: '80px',
    height: '80px',
    backgroundColor: '#dc3545',
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

export default VerificationFailed;