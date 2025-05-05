import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import { store } from '../../store';
import { refreshAuthToken, logout } from '../../store/slices/authSlice';

// Create a custom axios instance
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor for adding the auth token
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // If it's a 401 error and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        await store.dispatch(refreshAuthToken()).unwrap();

        // Update the authorization header with the new token
        const state = store.getState();
        const newToken = state.auth.token;

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        // Retry the original request with the new token
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh token fails, logout the user and reject the promise
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
