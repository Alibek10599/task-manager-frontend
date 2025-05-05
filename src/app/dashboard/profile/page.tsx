'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

interface ProfileFormData {
  name: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function Profile() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState<ProfileFormData>({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState<{
    name?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }

    // Clear success message when user makes changes
    if (success) {
      setSuccess('');
    }
  };

  const validateProfileForm = () => {
    const errors: {
      name?: string;
      email?: string;
    } = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateSecurityForm = () => {
    const errors: {
      currentPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
    } = {};

    if (!formData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateProfileForm()) {
      return;
    }

    setLoading(true);
    setSuccess('');

    try {
      // This would be implemented with a real API call in a production app
      // For now, simulate a successful update
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      setFormErrors({
        general: 'Failed to update profile. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSecuritySubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateSecurityForm()) {
      return;
    }

    setLoading(true);
    setSuccess('');

    try {
      // This would be implemented with a real API call in a production app
      // For now, simulate a successful update
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess('Password changed successfully');

      // Reset form fields
      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (error) {
      console.error('Failed to change password:', error);
      setFormErrors({
        general: 'Failed to change password. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
          Profile
        </h1>
      </div>

      <div className='flex border-b dark:border-gray-700'>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'profile'
              ? 'border-b-2 border-primary text-primary dark:text-primary-light'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('profile')}
        >
          Profile Information
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'security'
              ? 'border-b-2 border-primary text-primary dark:text-primary-light'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('security')}
        >
          Security
        </button>
      </div>

      {activeTab === 'profile' ? (
        <Card>
          {formErrors.general && (
            <div className='mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md'>
              {formErrors.general}
            </div>
          )}

          {success && (
            <div className='mb-6 p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-md'>
              {success}
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className='space-y-6'>
            <div className='flex items-center space-x-6'>
              <div className='w-20 h-20 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-white text-2xl'>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
                  {user?.name || 'User'}
                </h3>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>

            <Input
              id='name'
              name='name'
              label='Full Name'
              value={formData.name}
              onChange={handleChange}
              error={formErrors.name}
              required
            />

            <Input
              id='email'
              name='email'
              type='email'
              label='Email Address'
              value={formData.email}
              onChange={handleChange}
              error={formErrors.email}
              required
            />

            <div className='flex justify-end'>
              <Button type='submit' loading={loading} disabled={loading}>
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <Card>
          {formErrors.general && (
            <div className='mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md'>
              {formErrors.general}
            </div>
          )}

          {success && (
            <div className='mb-6 p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-md'>
              {success}
            </div>
          )}

          <form onSubmit={handleSecuritySubmit} className='space-y-6'>
            <Input
              id='currentPassword'
              name='currentPassword'
              type='password'
              label='Current Password'
              value={formData.currentPassword}
              onChange={handleChange}
              error={formErrors.currentPassword}
              required
            />

            <Input
              id='newPassword'
              name='newPassword'
              type='password'
              label='New Password'
              value={formData.newPassword}
              onChange={handleChange}
              error={formErrors.newPassword}
              required
            />

            <Input
              id='confirmPassword'
              name='confirmPassword'
              type='password'
              label='Confirm New Password'
              value={formData.confirmPassword}
              onChange={handleChange}
              error={formErrors.confirmPassword}
              required
            />

            <div className='flex justify-end'>
              <Button type='submit' loading={loading} disabled={loading}>
                Change Password
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
