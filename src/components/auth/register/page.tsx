'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../hooks/useAuth';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Checkbox from '../../../components/ui/Checkbox';

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
    <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div className='text-center'>
          <h2 className='mt-6 text-3xl font-extrabold text-gray-900 dark:text-white'>
            Create a new account
          </h2>
          <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
            Or{' '}
            <Link
              href='/login'
              className='font-medium text-primary hover:text-primary-dark'
            >
              sign in to your existing account
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
              id='name'
              name='name'
              type='text'
              autoComplete='name'
              label='Full name'
              value={formData.name}
              onChange={handleChange}
              error={formErrors.name}
              required
            />

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
              autoComplete='new-password'
              label='Password'
              value={formData.password}
              onChange={handleChange}
              error={formErrors.password}
              required
            />

            <Input
              id='passwordConfirmation'
              name='passwordConfirmation'
              type='password'
              autoComplete='new-password'
              label='Confirm password'
              value={formData.passwordConfirmation}
              onChange={handleChange}
              error={formErrors.passwordConfirmation}
              required
            />

            <Checkbox
              id='agreeTerms'
              name='agreeTerms'
              checked={formData.agreeTerms}
              onChange={handleChange}
              label={
                <span>
                  I agree to the{' '}
                  <Link
                    href='/terms'
                    className='text-primary hover:text-primary-dark'
                  >
                    Terms and Conditions
                  </Link>
                </span>
              }
              error={formErrors.agreeTerms}
            />

            <div>
              <Button
                type='submit'
                fullWidth
                loading={loading}
                disabled={loading}
              >
                Create account
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
