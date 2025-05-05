'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../hooks/useAuth';
import { useTasks } from '../../../hooks/useTasks';
import { TaskStatus } from '../../../store/slices/tasksSlice';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

export default function TasksList() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { tasks, getAllTasks, loading } = useTasks();

  // Filters
  const [filter, setFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Initialize filters from URL params
  useEffect(() => {
    const filterParam = searchParams.get('filter');
    if (filterParam) {
      setFilter(filterParam);
    }

    const statusParam = searchParams.get('status');
    if (statusParam) {
      setStatusFilter(statusParam);
    }

    const searchParam = searchParams.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [searchParams]);

  // Load tasks
  useEffect(() => {
    getAllTasks();
  }, [getAllTasks]);

  // Apply filters to tasks
  const filteredTasks = tasks.filter((task) => {
    // Apply search filter
    if (
      searchQuery &&
      !task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !task.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Apply status filter
    if (statusFilter !== 'all' && task.status !== statusFilter) {
      return false;
    }

    // Apply main filter
    switch (filter) {
      case 'my-tasks':
        return user && task.assigneeId === user.id;
      case 'upcoming':
        const now = new Date();
        const nextWeek = new Date(now);
        nextWeek.setDate(now.getDate() + 7);
        const deadlineDate = new Date(task.deadline);
        return (
          task.status !== TaskStatus.COMPLETED &&
          deadlineDate >= now &&
          deadlineDate <= nextWeek
        );
      case 'overdue':
        const currentDate = new Date();
        return (
          task.status !== TaskStatus.COMPLETED &&
          new Date(task.deadline) < currentDate
        );
      default:
        return true;
    }
  });

  // Sort tasks by date (newest first)
  const sortedTasks = [...filteredTasks].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };

  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setStatusFilter(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
          Tasks
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

      {/* Filters */}
      <Card>
        <div className='flex flex-col md:flex-row gap-4'>
          <div className='md:w-1/3'>
            <Select
              label='Filter'
              id='filter'
              value={filter}
              onChange={handleFilterChange}
              options={[
                { value: 'all', label: 'All Tasks' },
                { value: 'my-tasks', label: 'My Tasks' },
                { value: 'upcoming', label: 'Upcoming' },
                { value: 'overdue', label: 'Overdue' },
              ]}
            />
          </div>
          <div className='md:w-1/3'>
            <Select
              label='Status'
              id='status'
              value={statusFilter}
              onChange={handleStatusFilterChange}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: TaskStatus.NEW, label: 'New' },
                { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
                { value: TaskStatus.COMPLETED, label: 'Completed' },
              ]}
            />
          </div>
          <div className='md:w-1/3'>
            <Input
              label='Search'
              id='search'
              type='text'
              placeholder='Search tasks...'
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </Card>

      {/* Task List */}
      <Card>
        {loading ? (
          <div className='space-y-4'>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className='animate-pulse p-4 border-b dark:border-gray-700 last:border-b-0'
              >
                <div className='h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2'></div>
                <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4'></div>
              </div>
            ))}
          </div>
        ) : sortedTasks.length === 0 ? (
          <div className='text-center py-12'>
            <svg
              className='mx-auto h-12 w-12 text-gray-400'
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
            <h3 className='mt-2 text-lg font-medium text-gray-900 dark:text-white'>
              No tasks found
            </h3>
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
              {searchQuery
                ? 'Try adjusting your search or filters'
                : 'Create a new task to get started'}
            </p>
            <div className='mt-6'>
              <Link href='/dashboard/tasks/new'>
                <Button>Create a new task</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className='divide-y dark:divide-gray-700'>
            {sortedTasks.map((task) => (
              <Link href={`/dashboard/tasks/${task.id}`} key={task.id}>
                <div className='p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer'>
                  <div className='flex items-start justify-between'>
                    <div className='space-y-1'>
                      <h3 className='font-medium text-gray-900 dark:text-white'>
                        {task.title}
                      </h3>
                      <p className='text-sm text-gray-500 dark:text-gray-400 line-clamp-2'>
                        {task.description}
                      </p>
                      <div className='flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400'>
                        <span>
                          Due: {new Date(task.deadline).toLocaleDateString()}
                        </span>
                        {/* More task info can go here */}
                      </div>
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
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
