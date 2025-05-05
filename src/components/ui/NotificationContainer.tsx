'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeNotification } from '../../store/slices/uiSlice';
import { RootState, AppDispatch } from '../../store';

const NotificationContainer = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { notifications } = useSelector((state: RootState) => state.ui);

  // Auto-remove notifications after timeout
  useEffect(() => {
    notifications.forEach((notification) => {
      if (notification.timeout) {
        const timer = setTimeout(() => {
          dispatch(removeNotification(notification.id));
        }, notification.timeout);

        return () => clearTimeout(timer);
      }
    });
  }, [notifications, dispatch]);

  if (!notifications.length) return null;

  return (
    <div className='fixed top-4 right-4 z-50 space-y-2 w-80'>
      {notifications.map((notification) => {
        // Determine bg color based on type
        let bgColor;
        let textColor = 'text-white';
        let icon;

        switch (notification.type) {
          case 'success':
            bgColor = 'bg-green-500';
            icon = (
              <svg
                className='w-6 h-6 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M5 13l4 4L19 7'
                />
              </svg>
            );
            break;
          case 'error':
            bgColor = 'bg-red-500';
            icon = (
              <svg
                className='w-6 h-6 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            );
            break;
          case 'warning':
            bgColor = 'bg-yellow-500';
            textColor = 'text-gray-800';
            icon = (
              <svg
                className='w-6 h-6 text-gray-800'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                />
              </svg>
            );
            break;
          case 'info':
          default:
            bgColor = 'bg-blue-500';
            icon = (
              <svg
                className='w-6 h-6 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
            );
        }

        return (
          <div
            key={notification.id}
            className={`${bgColor} p-4 rounded-md shadow-lg flex items-start animate-notification-in`}
          >
            <div className='mr-3 pt-0.5'>{icon}</div>
            <div className='flex-1'>
              <p className={`${textColor} font-medium`}>
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => dispatch(removeNotification(notification.id))}
              className='ml-4 text-white opacity-70 hover:opacity-100 focus:outline-none'
            >
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationContainer;
