import React from "react";
import {
  Routes,
  Route,
  Navigate,
  useParams,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext.js";
import Login from "./components/Login.js";
import Register from "./components/Register.js";
import Dashboard from "./components/Dashboard.js";
import VerificationSuccess from "./pages/VerificationSuccess.js";
import VerificationFailed from "./pages/VerificationFailed.js";

// Improved Email Verification Component
const EmailVerification = () => {
  const { verifyEmail } = useAuth();
  const { token } = useParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] =
    React.useState("verifying"); // 'verifying', 'success', 'failed'

  React.useEffect(() => {
    const verifyToken = async () => {
      try {
        console.log("🔍 Starting email verification with token:", token);

        if (!token) {
          console.error("❌ No token provided");
          setVerificationStatus("failed");
          return;
        }

        const result = await verifyEmail(token);
        console.log("✅ Verification result:", result);

        if (result.success) {
          setVerificationStatus("success");
          // Use navigate instead of window.location.href for SPA behavior
          setTimeout(() => navigate("/verify-email/success"), 1000);
        } else {
          setVerificationStatus("failed");
          setTimeout(() => navigate("/verify-email/failed"), 1000);
        }
      } catch (error) {
        console.error("❌ Verification error:", error);
        setVerificationStatus("failed");
        setTimeout(() => navigate("/verify-email/failed"), 1000);
      }
    };

    if (token) {
      verifyToken();
    } else {
      setVerificationStatus("failed");
      setTimeout(() => navigate("/verify-email/failed"), 1000);
    }
  }, [token, verifyEmail, navigate]);

  if (verificationStatus === "verifying") {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.loadingSpinner}></div>
          <h2>Verifying your email...</h2>
          <p>Please wait while we verify your email address.</p>
          <p style={styles.smallText}>
            Token: {token ? `${token.substring(0, 15)}...` : "None"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <p>Redirecting...</p>
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
    backgroundColor: "#f8f9fa",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    backgroundColor: "white",
    padding: "3rem",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    textAlign: "center",
    maxWidth: "500px",
    width: "100%",
  },
  loadingSpinner: {
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #007bff",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    animation: "spin 1s linear infinite",
    margin: "0 auto 20px",
  },
  smallText: {
    fontSize: "0.8rem",
    color: "#666",
    marginTop: "10px",
    wordBreak: "break-all",
  },
};

// Add CSS for spinner animation
const styleSheet = document.styleSheets[0];
const animationStyle = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;
const styleElement = document.createElement("style");
styleElement.textContent = animationStyle;
document.head.appendChild(styleElement);

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
        {/* ✅ Email verification routes */}
        <Route path="/verify-email/success" element={<VerificationSuccess />} />
        <Route path="/verify-email/failed" element={<VerificationFailed />} />
        <Route path="/verify-email/:token" element={<EmailVerification />} />
        <Route
          path="/"
          element={<Navigate to={user ? "/dashboard" : "/login"} />}
        />
        <Route path="*" element={<div>Loading...</div>} />
        <Route path="/test-route" element={<div>Test Route Works!</div>} />

      </Routes>
    </div>
  );
}

export default App;
