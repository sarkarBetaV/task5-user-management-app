import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";
import UserTable from "./UserTable";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await authService.getUsers();
      setUsers(response.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setMessage("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUsers = async () => {
    if (selectedUsers.length === 0) {
      setMessage("Please select users to block");
      return;
    }

    try {
      await authService.blockUsers(selectedUsers);
      setMessage("Users blocked successfully");
      await fetchUsers();
      setSelectedUsers([]);
    } catch (error) {
      console.error("Error blocking users:", error);
      setMessage("Error blocking users");
    }
  };

  const handleUnblockUsers = async () => {
    if (selectedUsers.length === 0) {
      setMessage("Please select users to unblock");
      return;
    }

    try {
      await authService.unblockUsers(selectedUsers);
      setMessage("Users unblocked successfully");
      await fetchUsers();
      setSelectedUsers([]);
    } catch (error) {
      console.error("Error unblocking users:", error);
      setMessage("Error unblocking users");
    }
  };

  const handleDeleteUsers = async () => {
    if (selectedUsers.length === 0) {
      setMessage("Please select users to delete");
      return;
    }

    if (window.confirm("Are you sure you want to delete the selected users?")) {
      try {
        await authService.deleteUsers(selectedUsers);
        setMessage("Users deleted successfully");
        await fetchUsers();
        setSelectedUsers([]);
      } catch (error) {
        console.error("Error deleting users:", error);
        setMessage("Error deleting users");
      }
    }
  };

  // ADD THIS NEW FUNCTION HERE:
  const handleDeleteUnverifiedUsers = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete all unverified users registered more than 24 hours ago?"
      )
    ) {
      try {
        const response = await authService.deleteUnverifiedUsers();
        setMessage(response.message);
        await fetchUsers();
      } catch (error) {
        console.error("Error deleting unverified users:", error);
        setMessage("Error deleting unverified users");
      }
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((user) => user.id));
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>User Management Dashboard</h1>
        <div style={styles.userInfo}>
          <span>Welcome, {user?.username}!</span>
          <button onClick={logout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>

      {/* Add this verification warning */}
      {!user?.isVerified && (
        <div style={styles.verificationWarning}>
          ⚠️ Please verify your email to access all features. Check your inbox
          for the verification link.
        </div>
      )}

      {message && (
        <div style={styles.message}>
          {message}
          <button onClick={() => setMessage("")} style={styles.closeMessage}>
            ×
          </button>
        </div>
      )}

      <div style={styles.actions}>
        <button
          onClick={handleBlockUsers}
          disabled={selectedUsers.length === 0}
          style={styles.actionButton}
        >
          Block
        </button>
        <button
          onClick={handleUnblockUsers}
          disabled={selectedUsers.length === 0}
          style={styles.iconButton}
          title="Unblock Users"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <circle cx="12" cy="16" r="1" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </button>
        <button
          onClick={handleDeleteUsers}
          disabled={selectedUsers.length === 0}
          style={{ ...styles.iconButton, ...styles.deleteButton }}
          title="Delete Selected Users"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </button>
        <button
          onClick={handleDeleteUnverifiedUsers}
          style={{ ...styles.actionButton, ...styles.warningButton }}
        >
          Delete Unverified Users
        </button>
        <button
          onClick={fetchUsers}
          style={styles.iconButton}
          title="Refresh Users"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M23 4v6h-6" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
        </button>
      </div>

      {loading ? (
        <div style={styles.loading}>Loading users...</div>
      ) : (
        <UserTable
          users={users}
          selectedUsers={selectedUsers}
          onSelectUser={handleSelectUser}
          onSelectAll={handleSelectAll}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  // Add this to your existing styles object
  iconButton: {
    padding: "0.5rem 0.75rem",
    fontSize: "1.2rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
    cursor: "pointer",
    backgroundColor: "white",
    margin: "0 0.25rem",
    minWidth: "45px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  warningButton: {
    backgroundColor: "#ffc107",
    color: "#000",
  },

  verificationWarning: {
    backgroundColor: "#fff3cd",
    color: "#856404",
    padding: "1rem",
    borderRadius: "4px",
    marginBottom: "1rem",
    border: "1px solid #ffeaa7",
    textAlign: "center",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
    paddingBottom: "1rem",
    borderBottom: "1px solid #ddd",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  logoutButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  message: {
    backgroundColor: "#d4edda",
    color: "#155724",
    padding: "0.75rem",
    borderRadius: "4px",
    marginBottom: "1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeMessage: {
    background: "none",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
    color: "#155724",
  },
  actions: {
    display: "flex",
    gap: "1rem",
    marginBottom: "2rem",
    flexWrap: "wrap",
  },
  actionButton: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
  },
  deleteButton: {
    color: "red",
    backgroundColor: "white",
  },
  loading: {
    textAlign: "center",
    fontSize: "1.2rem",
    padding: "2rem",
  },
};

export default Dashboard;
