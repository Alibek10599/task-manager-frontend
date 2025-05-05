import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import {
  login,
  register,
  logout,
  refreshAuthToken,
} from '../store/slices/authSlice';
import { LoginRequest, RegisterRequest, User } from '../types/auth';
import { RootState, AppDispatch } from '../store';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user, token, isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const handleLogin = useCallback(
    async (credentials: LoginRequest) => {
      try {
        await dispatch(login(credentials)).unwrap();
        router.push('/dashboard');
        return true;
      } catch (error) {
        console.error('Login failed:', error);
        return false;
      }
    },
    [dispatch, router]
  );

  const handleRegister = useCallback(
    async (userData: RegisterRequest) => {
      try {
        await dispatch(register(userData)).unwrap();
        router.push('/dashboard');
        return true;
      } catch (error) {
        console.error('Registration failed:', error);
        return false;
      }
    },
    [dispatch, router]
  );

  const handleLogout = useCallback(() => {
    dispatch(logout());
    router.push('/login');
  }, [dispatch, router]);

  const refreshToken = useCallback(async () => {
    try {
      await dispatch(refreshAuthToken()).unwrap();
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      handleLogout();
      return false;
    }
  }, [dispatch, handleLogout]);

  return {
    user: user as User | null,
    token,
    isAuthenticated,
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    refreshToken,
  };
};
