'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../hooks/useAuth';
import Input from '../../ui/Input';
import Button from '../../ui/Button';
import Checkbox from '../../../components/ui/Checkbox';

export default function Login() {
  const { login, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    password?: string;
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
      email?: string;
      password?: string;
    } = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
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
      const success = await login({
        email: formData.email,
        password: formData.password,
      });

      if (!success) {
        setFormErrors({
          general: 'Invalid email or password',
        });
      }
    } catch (err) {
      console.error('Error on handleSubmit:', err);
      setFormErrors({
        general: 'An error occurred. Please try again.',
      });
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div className='text-center'>
          <h2 className='mt-6 text-3xl font-extrabold text-gray-900 dark:text-white'>
            Sign in to your account
          </h2>
          <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
            Or{' '}
            <Link
              href='/register'
              className='font-medium text-primary hover:text-primary-dark'
            >
              create a new account
            </Link>
          </p>
        </div>

        <div className='mt-8 bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10'>
          {(error || formErrors.general) && (
            <div className='mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md'>
              {error || formErrors.general}
            </div>
          )}

          <form className='space-y-6' onSubmit={handleSubmit}>
            <Input
              id='email'
              name='email'
              type='email'
              autoComplete='email'
              label='Email address'
              value={formData.email}
              onChange={handleChange}
              error={formErrors.email}
              required
            />

            <Input
              id='password'
              name='password'
              type='password'
              autoComplete='current-password'
              label='Password'
              value={formData.password}
              onChange={handleChange}
              error={formErrors.password}
              required
            />

            <div className='flex items-center justify-between'>
              <Checkbox
                id='remember_me'
                name='rememberMe'
                checked={formData.rememberMe}
                onChange={handleChange}
                label='Remember me'
              />

              <div className='text-sm'>
                <Link
                  href='/forgot-password'
                  className='font-medium text-primary hover:text-primary-dark'
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <Button
                type='submit'
                fullWidth
                loading={loading}
                disabled={loading}
              >
                Sign in
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
