'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // This would make an API call to request password reset in a real app
      // For now, simulate a successful request
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess(true);
    } catch (err) {
      console.error('Error on submitting form: ', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div className='text-center'>
          <h2 className='mt-6 text-3xl font-extrabold text-gray-900 dark:text-white'>
            Forgot your password?
          </h2>
          <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
            Enter your email address and we`ll send you a link to reset your
            password.
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
                Reset link sent! Check your email for instructions.
              </div>
              <p className='mt-4 text-sm text-gray-600 dark:text-gray-400'>
                Didn`t receive the email? Check your spam folder or{' '}
                <button
                  className='font-medium text-primary hover:text-primary-dark'
                  onClick={() => setSuccess(false)}
                >
                  try again
                </button>
                .
              </p>
            </div>
          ) : (
            <form className='space-y-6' onSubmit={handleSubmit}>
              <Input
                id='email'
                name='email'
                type='email'
                autoComplete='email'
                label='Email address'
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                error={error}
                required
              />

              <div>
                <Button
                  type='submit'
                  fullWidth
                  loading={loading}
                  disabled={loading}
                >
                  Send reset link
                </Button>
              </div>

              <div className='text-center'>
                <Link
                  href='/auth/login'
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
