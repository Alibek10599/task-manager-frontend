'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import Layout from '../../components/ui/Layout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, refreshToken } = useAuth();

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      // Refresh token silently in the background
      refreshToken();
    }
  }, [isAuthenticated, router, refreshToken]);

  // Show nothing while checking authentication
  if (!isAuthenticated) {
    return null;
  }

  return <Layout>{children}</Layout>;
}
