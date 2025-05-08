'use client';

import type React from 'react';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import {
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Box,
  Typography,
  Container,
  ThemeProvider,
  createTheme,
  CssBaseline,
  FormHelperText,
  Alert,
} from '@mui/material';

// Create a custom theme with the blue color from the original design
const theme = createTheme({
  palette: {
    primary: {
      main: '#4285F4',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          padding: '10px 16px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: '16px',
        },
      },
    },
  },
});

// Mock auth hook to simulate the provided useAuth hook
const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
  }) => {
    setLoading(true);
    setError(null);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // For demo purposes, always succeed
    setLoading(false);
    return true;
  };

  return { register, loading, error };
};

export default function Register() {
  const { register, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    agreeTerms: false,
  });
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    passwordConfirmation?: string;
    agreeTerms?: string;
    general?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = () => {
    const errors: {
      name?: string;
      email?: string;
      password?: string;
      passwordConfirmation?: string;
      agreeTerms?: string;
    } = {};

    if (!formData.name) {
      errors.name = 'Name is required';
    }

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (!formData.passwordConfirmation) {
      errors.passwordConfirmation = 'Please confirm your password';
    } else if (formData.password !== formData.passwordConfirmation) {
      errors.passwordConfirmation = 'Passwords do not match';
    }

    if (!formData.agreeTerms) {
      errors.agreeTerms = 'You must agree to the terms and conditions';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const success = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        passwordConfirmation: formData.passwordConfirmation,
      });

      if (!success) {
        setFormErrors({
          general: 'Registration failed. Please try again.',
        });
      }
    } catch (err) {
      console.error('Registration error:', err);
      setFormErrors({
        general: 'An error occurred. Please try again.',
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          justifyContent: 'center',
          alignItems: 'center',
          p: 3,
        }}
      >
        <Container maxWidth='sm'>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant='h4' component='h1' fontWeight='600'>
              Создать аккаунт
            </Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
              Или{' '}
              <Link
                href='/auth/login'
                style={{
                  color: theme.palette.primary.main,
                  textDecoration: 'none',
                }}
              >
                войдите в существующий аккаунт
              </Link>
            </Typography>
          </Box>

          {(error || formErrors.general) && (
            <Alert severity='error' sx={{ mb: 2 }}>
              {error || formErrors.general}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              id='name'
              name='name'
              label='Полное имя'
              placeholder='Иван Иванов'
              variant='outlined'
              margin='normal'
              value={formData.name}
              onChange={handleChange}
              error={!!formErrors.name}
              helperText={formErrors.name}
              required
            />

            <TextField
              fullWidth
              id='email'
              name='email'
              label='Адрес электронной почты'
              placeholder='youremail@gmail.com'
              type='email'
              variant='outlined'
              margin='normal'
              value={formData.email}
              onChange={handleChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
              required
            />

            <TextField
              fullWidth
              id='password'
              name='password'
              label='Пароль'
              type='password'
              variant='outlined'
              margin='normal'
              value={formData.password}
              onChange={handleChange}
              error={!!formErrors.password}
              helperText={formErrors.password}
              required
            />

            <TextField
              fullWidth
              id='passwordConfirmation'
              name='passwordConfirmation'
              label='Подтвердите пароль'
              type='password'
              variant='outlined'
              margin='normal'
              value={formData.passwordConfirmation}
              onChange={handleChange}
              error={!!formErrors.passwordConfirmation}
              helperText={formErrors.passwordConfirmation}
              required
            />

            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    id='agreeTerms'
                    name='agreeTerms'
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    color='primary'
                  />
                }
                label={
                  <Typography variant='body2'>
                    Я согласен с{' '}
                    <Link
                      href='/terms'
                      style={{
                        color: theme.palette.primary.main,
                        textDecoration: 'none',
                      }}
                    >
                      условиями использования
                    </Link>
                  </Typography>
                }
              />
              {formErrors.agreeTerms && (
                <FormHelperText error>{formErrors.agreeTerms}</FormHelperText>
              )}
            </Box>

            <Button
              fullWidth
              variant='contained'
              size='large'
              sx={{ mt: 3 }}
              type='submit'
              disabled={loading}
            >
              {loading ? 'Создание аккаунта...' : 'Создать аккаунт'}
            </Button>
          </form>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
