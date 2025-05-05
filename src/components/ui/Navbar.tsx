'use client';

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toggleSidebar, toggleDarkMode } from '../../store/slices/uiSlice';
import { RootState, AppDispatch } from '../../store';
import { useAuth } from '../../hooks/useAuth';
import { useChat } from '../../hooks/useChat';

const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>();
//   const router = useRouter();
  const { user, logout } = useAuth();
  const { getUnreadCount } = useChat();
  const { isDarkMode, sidebarOpen } = useSelector(
    (state: RootState) => state.ui
  );

  const handleToggleSidebar = useCallback(() => {
    dispatch(toggleSidebar());
  }, [dispatch]);

  const handleToggleDarkMode = useCallback(() => {
    dispatch(toggleDarkMode());
  }, [dispatch]);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  const unreadCount = getUnreadCount();

  return (
    <header className='bg-white dark:bg-gray-800 shadow h-16 z-10'>
      <div className='flex items-center justify-between h-full px-6'>
        <div className='flex items-center'>
          <button
            onClick={handleToggleSidebar}
            className='p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none'
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            <svg
              className='w-6 h-6 text-gray-600 dark:text-gray-300'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M4 6h16M4 12h16M4 18h16'
              />
            </svg>
          </button>
        </div>

        <div className='flex items-center space-x-4'>
          {/* Notifications */}
          <div className='relative'>
            <Link href='/dashboard/chat'>
              <button className='p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none relative'>
                <svg
                  className='w-6 h-6 text-gray-600 dark:text-gray-300'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z'
                  />
                </svg>
                {unreadCount > 0 && (
                  <span className='absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-500 rounded-full'>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            </Link>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={handleToggleDarkMode}
            className='p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none'
            aria-label={
              isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'
            }
          >
            {isDarkMode ? (
              <svg
                className='w-6 h-6 text-gray-300'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
                />
              </svg>
            ) : (
              <svg
                className='w-6 h-6 text-gray-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'
                />
              </svg>
            )}
          </button>

          {/* User Menu */}
          <div className='relative group'>
            <button className='flex items-center focus:outline-none'>
              <span className='text-sm font-medium text-gray-800 dark:text-gray-200 mr-2 hidden md:block'>
                {user?.name || 'User'}
              </span>
              <div className='w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center'>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </button>

            <div className='absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 hidden group-hover:block'>
              <Link href='/dashboard/profile'>
                <div className='block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'>
                  Profile
                </div>
              </Link>
              <button
                className='block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
