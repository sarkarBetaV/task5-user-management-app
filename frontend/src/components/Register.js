import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.js";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    company: "",
  });
  const [loading, setLoading] = useState(false);
  const { register, error, setError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    // Add validation for role and company
    if (!formData.role.trim() || !formData.company.trim()) {
      setError("Please enter both role and company");
      return;
    }

    setLoading(true);

    try {
      // Combine role and company for designation
      const combinedDesignation = `${formData.role}, ${formData.company}`;
      
      await register(formData.username, formData.email, formData.password, combinedDesignation);
      alert(
        "Registration successful! Please check your email to verify your account."
      );
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Register</h2>
        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Choose a username"
            />
          </div>

          {/* Role Input Field */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Role/Position:</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="e.g., CFO, Engineer, Manager"
            />
          </div>

          {/* Company Input Field */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Company:</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="e.g., Meta Platforms, Inc."
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Enter your email"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Enter your password"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {}),
            }}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p style={styles.link}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
  },
  formContainer: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
  },
  title: {
    textAlign: "center",
    marginBottom: "1.5rem",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  formGroup: {
    marginBottom: "1rem",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: "bold",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "1rem",
    boxSizing: "border-box",
  },
  button: {
    padding: "0.75rem",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "1rem",
    cursor: "pointer",
    marginTop: "1rem",
  },
  buttonDisabled: {
    backgroundColor: "#6c757d",
    cursor: "not-allowed",
  },
  error: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    padding: "0.75rem",
    borderRadius: "4px",
    marginBottom: "1rem",
    border: "1px solid #f5c6cb",
  },
  link: {
    textAlign: "center",
    marginTop: "1rem",
  },
};

export default Register;