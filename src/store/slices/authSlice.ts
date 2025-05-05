import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
// import * as jwt_decode from 'jwt-decode';

// Define types
interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

// Define initial state
const initialState: AuthState = {
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  refreshToken:
    typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Define API base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Async thunks
export const login = createAsyncThunk<AuthResponse, LoginCredentials>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data?.message || 'Failed to login'
        );
      }
      return rejectWithValue('Failed to login');
    }
  }
);

export const register = createAsyncThunk<AuthResponse, RegisterCredentials>(
  'auth/register',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/register`,
        credentials
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data?.message || 'Failed to register'
        );
      }
      return rejectWithValue('Failed to register');
    }
  }
);

export const refreshAuthToken = createAsyncThunk<AuthResponse, void>(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const refreshToken = state.auth.refreshToken;

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post(`${API_URL}/auth/refresh`, {
        refreshToken,
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data?.message || 'Failed to refresh token'
        );
      }
      return rejectWithValue('Failed to refresh token');
    }
  }
);

// Create slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;

      // Clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      }
    },
    setCredentials: (state, action: PayloadAction<AuthResponse>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;

      // Save to local storage
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      }
    },
  },
  extraReducers: (builder) => {
    // Login cases
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;

      // Save to local storage
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      }
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Register cases
    builder.addCase(register.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;

      // Save to local storage
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      }
    });
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Refresh token cases
    builder.addCase(refreshAuthToken.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(refreshAuthToken.fulfilled, (state, action) => {
      state.loading = false;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;

      // Save to local storage
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      }
    });
    builder.addCase(refreshAuthToken.rejected, (state) => {
      state.loading = false;
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;

      // Clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      }
    });
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
