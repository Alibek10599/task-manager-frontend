'use client';

import { ReactNode, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setIsMobile } from '../../store/slices/uiSlice';
import { useAuth } from '../../hooks/useAuth';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import NotificationContainer from './NotificationContainer';
import { RootState, AppDispatch } from '../../store';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useAuth();
  const { isDarkMode, isMobile, sidebarOpen } = useSelector(
    (state: RootState) => state.ui
  );

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      dispatch(setIsMobile(window.innerWidth < 768));
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Apply dark mode
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [dispatch, isDarkMode]);

  if (!isAuthenticated) {
    // Simple layout for auth pages
    return (
      <div
        className={`min-h-screen transition-colors ${isDarkMode ? 'dark' : ''}`}
      >
        <main className='min-h-screen bg-gray-50 dark:bg-gray-900'>
          <NotificationContainer />
          {children}
        </main>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors ${isDarkMode ? 'dark' : ''}`}
    >
      <div className='flex min-h-screen'>
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div
          className={`flex-1 transition-all ${
            sidebarOpen && !isMobile ? 'ml-64' : 'ml-0'
          }`}
        >
          <Navbar />
          <main className='p-6 bg-gray-50 dark:bg-gray-900 min-h-[calc(100vh-64px)]'>
            <NotificationContainer />
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
