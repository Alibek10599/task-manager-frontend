'use client';

import { JSX, useCallback } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RootState } from '../../store';
import { useChat } from '../../hooks/useChat';

const Sidebar = () => {
  const pathname = usePathname();
  const { sidebarOpen, isMobile } = useSelector((state: RootState) => state.ui);
  const { getUnreadCount } = useChat();

  const unreadCount = getUnreadCount();

  const NavItem = useCallback(
    ({
      href,
      label,
      icon,
    }: {
      href: string;
      label: string;
      icon: JSX.Element;
      badge?: number;
    }) => {
      const isActive = pathname === href || pathname?.startsWith(`${href}/`);

      return (
        <Link href={href}>
          <div
            className={`flex items-center px-6 py-3 cursor-pointer ${
              isActive
                ? 'bg-primary bg-opacity-10 text-primary dark:text-primary-light border-r-4 border-primary'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <span className='w-6 h-6 mr-3'>{icon}</span>
            <span className='text-sm font-medium'>{label}</span>
          </div>
        </Link>
      );
    },
    [pathname]
  );

  if (!sidebarOpen && !isMobile) {
    // Mini sidebar (collapsed state for desktop)
    return (
      <aside className='w-16 bg-white dark:bg-gray-800 shadow h-screen fixed z-20 transition-all'>
        <div className='h-16 flex items-center justify-center'>
          <span className='text-2xl font-bold text-primary'>TM</span>
        </div>
        <nav className='mt-4'>
          {/* Dashboard */}
          <div className='flex justify-center py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'>
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M3 12l2-2m0 0l7-7 7 7m-7-7v14'
              />
            </svg>
          </div>
          {/* Tasks */}
          <div className='flex justify-center py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'>
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
              />
            </svg>
          </div>
          {/* Chat */}
          <div className='flex justify-center py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 relative'>
            <svg
              className='w-6 h-6'
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
              <span className='absolute top-1 right-1 inline-flex items-center justify-center w-4 h-4 text-xs font-semibold text-white bg-red-500 rounded-full'>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          {/* Profile */}
          <div className='flex justify-center py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'>
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
              />
            </svg>
          </div>
        </nav>
      </aside>
    );
  }

  if (!sidebarOpen && isMobile) {
    // Hidden on mobile
    return null;
  }

  // Full sidebar
  return (
    <aside
      className={`w-64 bg-white dark:bg-gray-800 shadow h-screen fixed z-20 transition-all ${
        isMobile ? 'transform translate-x-0' : ''
      }`}
    >
      <div className='h-16 flex items-center justify-center border-b dark:border-gray-700'>
        <Link href='/dashboard'>
          <span className='text-2xl font-bold text-primary'>Task Manager</span>
        </Link>
      </div>
      <nav className='mt-4'>
        <NavItem
          href='/dashboard'
          label='Dashboard'
          icon={
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M3 12l2-2m0 0l7-7 7 7m-7-7v14'
              />
            </svg>
          }
        />
        <NavItem
          href='/dashboard/tasks'
          label='Tasks'
          icon={
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
              />
            </svg>
          }
        />
        <div className='relative'>
          <NavItem
            href='/dashboard/chat'
            label='Chat'
            icon={
              <svg
                className='w-6 h-6'
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
            }
          />
          {unreadCount > 0 && (
            <span className='absolute top-3 right-6 inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-500 rounded-full'>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
        <NavItem
          href='/dashboard/profile'
          label='Profile'
          icon={
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
              />
            </svg>
          }
        />
      </nav>
    </aside>
  );
};

export default Sidebar;
