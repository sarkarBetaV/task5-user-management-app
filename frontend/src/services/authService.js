import axios from "axios";

// Determine API URL based on environment
let API_URL;

if (process.env.NODE_ENV === "production") {
  // For production - use the full backend URL
  API_URL = "https://user-management-backend-71i5.onrender.com/api";
} else {
  // For local development
  API_URL = "http://localhost:5000/api";
}

console.log("🔗 API URL:", API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(
      `🚀 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`
    );
    return config;
  },
  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("❌ Response error:", error.response?.data || error.message);
    console.error("📡 Response status:", error.response?.status);
    console.error("🔗 Request URL:", error.config?.baseURL + error.config?.url);

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email, password) => {
    const response = await api.post("/login", { email, password });
    return response.data;
  },

  register: async (username, email, password, designation) => {
    const response = await api.post("/register", {
      username,
      email,
      password,
      designation,
    });
    return response.data;
  },

  verifyEmail: async (token) => {
    try {
      console.log("Calling verification API with token:", token);
      const response = await api.get(`/verify-email/${token}`);

      // ✅ Handle both response formats for compatibility
      const result = response.data;

      // If backend returns { status: 'success' }, convert to { success: true }
      if (result.status === "success") {
        return {
          success: true,
          message: result.message,
        };
      }

      // If backend already returns { success: true }, use as-is
      return result;
    } catch (error) {
      console.error("Email verification API error:", error);

      // ✅ Provide consistent error response
      throw {
        response: {
          data: {
            message: error.response?.data?.message || "Verification failed",
          },
        },
      };
    }
  },

  verifyToken: async () => {
    const response = await api.get("/users");
    return response.data;
  },

  getUsers: async () => {
    const response = await api.get("/users");
    return response.data;
  },

  blockUsers: async (userIds) => {
    const response = await api.post("/users/block", { userIds });
    return response.data;
  },

  unblockUsers: async (userIds) => {
    const response = await api.post("/users/unblock", { userIds });
    return response.data;
  },

  deleteUsers: async (userIds) => {
    const response = await api.post("/users/delete", { userIds });
    return response.data;
  },

  deleteUnverifiedUsers: async () => {
    const response = await api.delete("/users/unverified");
    return response.data;
  },

  // Health check
  healthCheck: async () => {
    const response = await api.get("/health");
    return response.data;
  },

  // Test database
  testDatabase: async () => {
    const response = await api.get("/test-db");
    return response.data;
  },
};
