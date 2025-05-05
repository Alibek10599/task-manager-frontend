'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import api from '../../../lib/services/api';

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tokenError, setTokenError] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Get token from URL
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setTokenError(true);
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.password) {
      setError('Password is required');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // This would make an API call to reset password in a real app
      // Include the token from the URL in the request
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real application, you would call your API with the token:
      await api.post('/auth/reset-password', {
        token,
        password: formData.password,
      });

      setSuccess(true);

      // Redirect to login after a few seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      console.error('Error resetting password:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (tokenError) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-md w-full space-y-8'>
          <div className='text-center'>
            <h2 className='mt-6 text-3xl font-extrabold text-gray-900 dark:text-white'>
              Invalid Reset Link
            </h2>
            <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
              The password reset link is invalid or has expired.
            </p>
            <div className='mt-6'>
              <Link href='/forgot-password'>
                <Button fullWidth>Request a new reset link</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div className='text-center'>
          <h2 className='mt-6 text-3xl font-extrabold text-gray-900 dark:text-white'>
            Reset your password
          </h2>
          <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
            Please enter your new password below.
          </p>
        </div>

        <div className='mt-8 bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10'>
          {error && (
            <div className='mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md'>
              {error}
            </div>
          )}

          {success ? (
            <div className='text-center'>
              <div className='mb-4 p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-md'>
                Your password has been reset successfully!
              </div>
              <p className='mt-4 text-sm text-gray-600 dark:text-gray-400'>
                You will be redirected to the login page shortly.
              </p>
            </div>
          ) : (
            <form className='space-y-6' onSubmit={handleSubmit}>
              <Input
                id='password'
                name='password'
                type='password'
                autoComplete='new-password'
                label='New password'
                value={formData.password}
                onChange={handleChange}
                required
              />

              <Input
                id='confirmPassword'
                name='confirmPassword'
                type='password'
                autoComplete='new-password'
                label='Confirm new password'
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />

              <div>
                <Button
                  type='submit'
                  fullWidth
                  loading={loading}
                  disabled={loading}
                >
                  Reset password
                </Button>
              </div>

              <div className='text-center'>
                <Link
                  href='/login'
                  className='font-medium text-primary hover:text-primary-dark'
                >
                  Back to login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
