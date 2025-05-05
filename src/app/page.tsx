'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className='min-h-screen bg-gradient-to-br from-primary to-primary-dark text-white'>
      <div className='container mx-auto px-4 py-16'>
        <header className='flex justify-between items-center mb-16'>
          <div className='text-2xl font-bold'>Task Manager</div>
          <div className='space-x-4'>
            <Link href='/login'>
              <Button
                variant='outline'
                className='text-white border-white hover:bg-white/10'
              >
                Login
              </Button>
            </Link>
            <Link href='/register'>
              <Button
                variant='outline'
                className='text-white border-white hover:bg-white/10'
              >
                Register
              </Button>
            </Link>
          </div>
        </header>

        <main className='flex flex-col md:flex-row items-center justify-between gap-16'>
          <div className='md:w-1/2'>
            <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold mb-6'>
              Manage Your Tasks Efficiently
            </h1>
            <p className='text-lg md:text-xl mb-8 text-white/80'>
              A comprehensive task management solution with real-time chat
              functionality, notifications, and multi-platform support.
            </p>
            <div className='space-x-4'>
              <Link href='/register'>
                <Button
                  size='lg'
                  className='bg-white text-primary hover:bg-white/90'
                >
                  Get Started
                </Button>
              </Link>
              <Link href='/features'>
                <Button
                  size='lg'
                  variant='outline'
                  className='text-white border-white hover:bg-white/10'
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          <div className='md:w-1/2'>
            <div className='bg-white/10 backdrop-blur-sm rounded-lg p-8 shadow-lg border border-white/20'>
              <div className='space-y-4'>
                <div className='flex items-center space-x-4 p-4 bg-white/10 rounded-lg'>
                  <div className='w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white'>
                    ✓
                  </div>
                  <div>
                    <h3 className='font-semibold'>Task Management</h3>
                    <p className='text-white/70 text-sm'>
                      Create, update, and track your tasks
                    </p>
                  </div>
                </div>

                <div className='flex items-center space-x-4 p-4 bg-white/10 rounded-lg'>
                  <div className='w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white'>
                    💬
                  </div>
                  <div>
                    <h3 className='font-semibold'>Real-time Chat</h3>
                    <p className='text-white/70 text-sm'>
                      Communicate with team members instantly
                    </p>
                  </div>
                </div>

                <div className='flex items-center space-x-4 p-4 bg-white/10 rounded-lg'>
                  <div className='w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-white'>
                    📱
                  </div>
                  <div>
                    <h3 className='font-semibold'>Mobile Support</h3>
                    <p className='text-white/70 text-sm'>
                      Access your tasks on any device
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
