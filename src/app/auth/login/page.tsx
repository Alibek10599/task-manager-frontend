'use client';

import type React from 'react';
import Link from 'next/link';
import { useState } from 'react';
import {
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Box,
  Typography,
  Container,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../../../hooks/useAuth';

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

export default function LoginPage() {
  const { login, loading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password, rememberMe });
    // Add your login logic here
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
              Войти
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              id='email'
              label='Адрес электронной почты'
              placeholder='youremail@gmail.com'
              variant='outlined'
              margin='normal'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              fullWidth
              id='password'
              label='Пароль'
              type={showPassword ? 'text' : 'password'}
              placeholder='••••••••'
              variant='outlined'
              margin='normal'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={handleClickShowPassword}
                      edge='end'
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                my: 2,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                }
                label={<Typography variant='body2'>Запомнить меня</Typography>}
              />
              <Link href='/forgot-password' style={{ textDecoration: 'none' }}>
                <Typography
                  variant='body2'
                  color='text.secondary'
                  sx={{ '&:hover': { textDecoration: 'underline' } }}
                >
                  Забыли пароль?
                </Typography>
              </Link>
            </Box>

            <Button
              fullWidth
              variant='contained'
              size='large'
              sx={{ mt: 2 }}
              type='submit'
            >
              Войти <span style={{ marginLeft: '8px' }}>→</span>
            </Button>
          </form>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
