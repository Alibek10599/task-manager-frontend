'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';
import { useChat } from '../../hooks/useChat';
import { TaskStatus } from '../../store/slices/tasksSlice';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Link from 'next/link';
import Button from '../../components/ui/Button';

export default function Dashboard() {
  const { user } = useAuth();
  const {
    tasks,
    getAllTasks,
    getTasksByStatus,
    getMyTasks,
    getUpcomingTasks,
    getOverdueTasks,
    // loading: tasksLoading,
  } = useTasks();
  const { getUnreadCount } = useChat();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await getAllTasks();
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [getAllTasks]);

  // Get tasks by status
  const newTasks = getTasksByStatus(TaskStatus.NEW);
  const inProgressTasks = getTasksByStatus(TaskStatus.IN_PROGRESS);
  const completedTasks = getTasksByStatus(TaskStatus.COMPLETED);

  // Get my tasks (assigned to current user)
  const myTasks = user ? getMyTasks(user.id) : [];

  // Get upcoming and overdue tasks
  const upcomingTasks = getUpcomingTasks();
  const overdueTasks = getOverdueTasks();

  // Get unread messages count
  const unreadCount = getUnreadCount();

  return (
    <div className='space-y-6'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center'>
        <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
          Dashboard
        </h1>
        <Link href='/dashboard/tasks/new'>
          <Button
            variant='primary'
            leftIcon={
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
                  d='M12 4v16m8-8H4'
                />
              </svg>
            }
          >
            New Task
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {[...Array(3)].map((_, i) => (
            <Card key={i} className='animate-pulse h-32'>
              <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4'></div>
              <div className='h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2'></div>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {/* Statistics Cards */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <Card className='bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800'>
              <div className='flex items-center'>
                <div className='w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mr-4'>
                  <svg
                    className='w-6 h-6 text-blue-500 dark:text-blue-300'
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
                <div>
                  <h3 className='text-sm font-semibold text-blue-800 dark:text-blue-200'>
                    Total Tasks
                  </h3>
                  <p className='text-2xl font-bold text-blue-900 dark:text-blue-100'>
                    {tasks.length}
                  </p>
                </div>
              </div>
            </Card>

            <Card className='bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800'>
              <div className='flex items-center'>
                <div className='w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mr-4'>
                  <svg
                    className='w-6 h-6 text-green-500 dark:text-green-300'
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
                </div>
                <div>
                  <h3 className='text-sm font-semibold text-green-800 dark:text-green-200'>
                    Completed
                  </h3>
                  <p className='text-2xl font-bold text-green-900 dark:text-green-100'>
                    {completedTasks.length}
                  </p>
                </div>
              </div>
            </Card>

            <Card className='bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800'>
              <div className='flex items-center'>
                <div className='w-12 h-12 bg-yellow-100 dark:bg-yellow-800 rounded-full flex items-center justify-center mr-4'>
                  <svg
                    className='w-6 h-6 text-yellow-500 dark:text-yellow-300'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                </div>
                <div>
                  <h3 className='text-sm font-semibold text-yellow-800 dark:text-yellow-200'>
                    Pending
                  </h3>
                  <p className='text-2xl font-bold text-yellow-900 dark:text-yellow-100'>
                    {newTasks.length + inProgressTasks.length}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Tasks Section */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* My Tasks */}
            <Card
              title='My Tasks'
              subtitle={`Tasks assigned to you (${myTasks.length})`}
              footer={
                <Link
                  href='/dashboard/tasks?filter=my-tasks'
                  className='text-primary hover:text-primary-dark text-sm font-medium'
                >
                  View all
                </Link>
              }
            >
              {myTasks.length === 0 ? (
                <div className='text-center py-4 text-gray-500 dark:text-gray-400'>
                  No tasks assigned to you
                </div>
              ) : (
                <div className='space-y-4'>
                  {myTasks.slice(0, 5).map((task) => (
                    <Link href={`/dashboard/tasks/${task.id}`} key={task.id}>
                      <div className='flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors'>
                        <div className='flex-1'>
                          <h4 className='font-medium text-gray-900 dark:text-white'>
                            {task.title}
                          </h4>
                          <p className='text-sm text-gray-500 dark:text-gray-400 truncate'>
                            {task.description}
                          </p>
                        </div>
                        <Badge
                          variant={
                            task.status === TaskStatus.COMPLETED
                              ? 'success'
                              : task.status === TaskStatus.IN_PROGRESS
                              ? 'warning'
                              : 'info'
                          }
                        >
                          {task.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </Card>

            {/* Upcoming Tasks */}
            <Card
              title='Upcoming Deadlines'
              subtitle='Tasks due in the next 7 days'
              footer={
                <Link
                  href='/dashboard/tasks?filter=upcoming'
                  className='text-primary hover:text-primary-dark text-sm font-medium'
                >
                  View all
                </Link>
              }
            >
              {upcomingTasks.length === 0 ? (
                <div className='text-center py-4 text-gray-500 dark:text-gray-400'>
                  No upcoming deadlines
                </div>
              ) : (
                <div className='space-y-4'>
                  {upcomingTasks.slice(0, 5).map((task) => (
                    <Link href={`/dashboard/tasks/${task.id}`} key={task.id}>
                      <div className='flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors'>
                        <div className='flex-1'>
                          <h4 className='font-medium text-gray-900 dark:text-white'>
                            {task.title}
                          </h4>
                          <p className='text-sm text-gray-500 dark:text-gray-400'>
                            Due: {new Date(task.deadline).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant='warning'>
                          {new Date(task.deadline).toLocaleDateString(
                            undefined,
                            {
                              month: 'short',
                              day: 'numeric',
                            }
                          )}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Overdue Tasks */}
          {overdueTasks.length > 0 && (
            <Card
              title='Overdue Tasks'
              subtitle='Tasks that have passed their deadline'
              className='border-red-100 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
              headerClassName='text-red-800 dark:text-red-200'
            >
              <div className='space-y-4'>
                {overdueTasks.slice(0, 3).map((task) => (
                  <Link href={`/dashboard/tasks/${task.id}`} key={task.id}>
                    <div className='flex items-center justify-between p-3 hover:bg-red-100/50 dark:hover:bg-red-900/50 rounded-md transition-colors'>
                      <div className='flex-1'>
                        <h4 className='font-medium text-red-900 dark:text-red-100'>
                          {task.title}
                        </h4>
                        <p className='text-sm text-red-700 dark:text-red-300'>
                          Due: {new Date(task.deadline).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant='danger' size='sm'>
                        Update
                      </Button>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          )}

          {/* Notifications */}
          {unreadCount > 0 && (
            <Card
              title='Notifications'
              subtitle={`You have ${unreadCount} unread message${
                unreadCount > 1 ? 's' : ''
              }`}
              className='border-blue-100 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20'
              headerClassName='text-blue-800 dark:text-blue-200'
              footer={
                <Link
                  href='/dashboard/chat'
                  className='text-blue-700 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-100 text-sm font-medium'
                >
                  Go to chat
                </Link>
              }
            >
              <div className='p-4'>
                <div className='flex items-center'>
                  <div className='w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mr-4'>
                    <svg
                      className='w-6 h-6 text-blue-500 dark:text-blue-300'
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
                  </div>
                  <div>
                    <h4 className='font-medium text-blue-900 dark:text-blue-100'>
                      You have unread messages
                    </h4>
                    <p className='text-blue-700 dark:text-blue-300'>
                      Check your chat inbox to see new messages.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
