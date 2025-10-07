import React from "react";

const UserTable = ({ users, selectedUsers, onSelectUser, onSelectAll }) => {
  const allSelected = users.length > 0 && selectedUsers.length === users.length;

  // Function to calculate relative time
  const getRelativeTime = (dateString) => {
    if (!dateString) return "Never";

    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 31536000)
      return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  };

  // Function to format registration date (date only)
  const formatRegistrationDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Function to get designation style
  const getDesignationStyle = (designation) => {
    const baseStyle = styles.designationBadge;
    switch (designation) {
      case "Admin":
        return { ...baseStyle, ...styles.designationAdmin };
      case "Manager":
        return { ...baseStyle, ...styles.designationManager };
      case "Editor":
        return { ...baseStyle, ...styles.designationEditor };
      case "Viewer":
        return { ...baseStyle, ...styles.designationViewer };
      default:
        return { ...baseStyle, ...styles.designationUser };
    }
  };

  return (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onSelectAll}
                style={styles.checkbox}
              />
            </th>
            <th style={styles.th}>Username</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Verified</th>
            <th style={styles.th}>Registered</th>
            <th style={styles.th}>Last Login</th>
          </tr>
        </thead>
        <tbody>
          {users && users.length > 0 ? (
            users.map((user) => (
              <tr
                key={user.id}
                style={{
                  ...styles.tr,
                  ...(selectedUsers.includes(user.id)
                    ? styles.selectedRow
                    : {}),
                }}
              >
                <td style={styles.td}>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => onSelectUser(user.id)}
                    style={styles.checkbox}
                  />
                </td>
                <td style={styles.td}>
                  <div>
                    <div style={styles.username}>{user.username}</div>
                    <div style={styles.designation}>{user.designation}</div>
                  </div>
                </td>

                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.status,
                      ...(user.isBlocked ? styles.blocked : styles.active),
                    }}
                  >
                    {user.isBlocked ? "Blocked" : "Active"}
                  </span>
                </td>
                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.status,
                      ...(user.isVerified
                        ? styles.verified
                        : styles.unverified),
                    }}
                  >
                    {user.isVerified ? "Yes" : "No"}
                  </span>
                </td>
                <td style={styles.td}>
                  {formatRegistrationDate(user.registeredAt)}
                </td>
                <td style={styles.td}>
                  <span
                    style={
                      user.lastLoginAt ? styles.lastLogin : styles.neverLoggedIn
                    }
                  >
                    {getRelativeTime(user.lastLoginAt)}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={styles.noUsers}></td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  tableContainer: {
    overflowX: "auto",
    border: "1px solid #ddd",
    borderRadius: "8px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "white",
  },
  th: {
    backgroundColor: "#f8f9fa",
    padding: "1rem",
    textAlign: "left",
    borderBottom: "1px solid #ddd",
    fontWeight: "bold",
    color: "#333",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "1rem",
    borderBottom: "1px solid #eee",
    whiteSpace: "nowrap",
  },
  tr: {
    transition: "background-color 0.2s",
  },
  selectedRow: {
    backgroundColor: "#e3f2fd",
  },
  checkbox: {
    transform: "scale(1.2)",
  },
  status: {
    padding: "0.25rem 0.5rem",
    borderRadius: "4px",
    fontSize: "0.875rem",
    fontWeight: "bold",
  },
  active: {
    backgroundColor: "#d4edda",
    color: "#155724",
  },
  blocked: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
  },
  verified: {
    backgroundColor: "#d1ecf1",
    color: "#0c5460",
  },
  unverified: {
    backgroundColor: "#fff3cd",
    color: "#856404",
  },
  lastLogin: {
    color: "#28a745",
    fontWeight: "500",
  },
  neverLoggedIn: {
    color: "#6c757d",
    fontStyle: "italic",
  },
  noUsers: {
    textAlign: "center",
    padding: "2rem",
    color: "#6c757d",
  },

  // ADD THE NEW STYLES HERE:
  username: {
    fontWeight: "bold",
    marginBottom: "2px",
  },
  designation: {
    fontSize: "0.8rem",
    color: "#6c757d",
    fontStyle: "italic",
  },
  designationBadge: {
    padding: "0.25rem 0.5rem",
    borderRadius: "4px",
    fontSize: "0.75rem",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  designationUser: {
    backgroundColor: "#e9ecef",
    color: "#495057",
  },
  designationAdmin: {
    backgroundColor: "#dc3545",
    color: "white",
  },
  designationManager: {
    backgroundColor: "#fd7e14",
    color: "white",
  },
  designationEditor: {
    backgroundColor: "#20c997",
    color: "white",
  },
  designationViewer: {
    backgroundColor: "#6f42c1",
    color: "white",
  },
};

export default UserTable;
