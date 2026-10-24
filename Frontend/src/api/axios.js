import axios from "axios";

const api = axios.create({
  baseURL: "/api/v1",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("companion_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token if expired
      // localStorage.removeItem("companion_token");
    }
    const message = error.response?.data?.message || error.message || "Network Error";
    return Promise.reject(new Error(message));
  }
);

export default api;
