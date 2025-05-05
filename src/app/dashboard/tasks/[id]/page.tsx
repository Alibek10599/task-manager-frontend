'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTasks } from '../../../../hooks/useTasks';
import { TaskStatus } from '../../../../store/slices/tasksSlice';
import Card from '../../../../components/ui/Card';
import Badge from '../../../../components/ui/Badge';
import Button from '../../../../components/ui/Button';
import Modal from '../../../../components/ui/Modal';
import Select from '../../../../components/ui/Select';

export default function TaskDetail() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;

  const { currentTask, getTaskById, editTask, removeTask, loading } =
    useTasks();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [updatedStatus, setUpdatedStatus] = useState<TaskStatus | ''>('');

  useEffect(() => {
    if (taskId) {
      getTaskById(taskId);
    }
  }, [taskId, getTaskById]);

  useEffect(() => {
    if (currentTask) {
      setUpdatedStatus(currentTask.status);
    }
  }, [currentTask]);

  const handleStatusChange = async (status: TaskStatus) => {
    if (currentTask) {
      try {
        await editTask({
          id: currentTask.id,
          status,
        });
      } catch (error) {
        console.error('Failed to update task status:', error);
      }
    }
  };

  const handleDelete = async () => {
    if (currentTask) {
      try {
        const success = await removeTask(currentTask.id);
        if (success) {
          router.push('/dashboard/tasks');
        }
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className='animate-pulse space-y-6'>
        <div className='h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3'></div>
        <Card>
          <div className='space-y-4'>
            <div className='h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2'></div>
            <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-full'></div>
            <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4'></div>
          </div>
        </Card>
      </div>
    );
  }

  if (!currentTask) {
    return (
      <div className='text-center py-12'>
        <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
          Task not found
        </h3>
        <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
          The task you`re looking for does not exist or has been deleted.
        </p>
        <div className='mt-6'>
          <Button onClick={() => router.push('/dashboard/tasks')}>
            Back to Tasks
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
          Task Details
        </h1>
        <div className='flex space-x-2'>
          <Button variant='outline' onClick={() => setIsEditModalOpen(true)}>
            Edit
          </Button>
          <Button variant='danger' onClick={() => setIsDeleteModalOpen(true)}>
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <div className='space-y-6'>
          <div>
            <div className='flex justify-between items-start'>
              <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                {currentTask.title}
              </h2>
              <Badge
                variant={
                  currentTask.status === TaskStatus.COMPLETED
                    ? 'success'
                    : currentTask.status === TaskStatus.IN_PROGRESS
                    ? 'warning'
                    : 'info'
                }
              >
                {currentTask.status.replace('_', ' ')}
              </Badge>
            </div>
            <p className='mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-line'>
              {currentTask.description}
            </p>
          </div>

          <div className='border-t dark:border-gray-700 pt-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                  Deadline
                </h3>
                <p className='mt-1 text-gray-900 dark:text-white'>
                  {new Date(currentTask.deadline).toLocaleDateString(
                    undefined,
                    {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }
                  )}
                </p>
              </div>
              <div>
                <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                  Assignee
                </h3>
                <p className='mt-1 text-gray-900 dark:text-white'>
                  {/* Display assignee name here - would come from users data */}
                  {currentTask.assigneeId}
                </p>
              </div>
              <div>
                <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                  Created at
                </h3>
                <p className='mt-1 text-gray-900 dark:text-white'>
                  {new Date(currentTask.createdAt).toLocaleDateString(
                    undefined,
                    {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }
                  )}
                </p>
              </div>
              <div>
                <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                  Last updated
                </h3>
                <p className='mt-1 text-gray-900 dark:text-white'>
                  {new Date(currentTask.updatedAt).toLocaleDateString(
                    undefined,
                    {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className='border-t dark:border-gray-700 pt-4'>
            <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-3'>
              Update Status
            </h3>
            <div className='flex flex-wrap gap-2'>
              <Button
                variant={
                  currentTask.status === TaskStatus.NEW ? 'primary' : 'outline'
                }
                size='sm'
                onClick={() => handleStatusChange(TaskStatus.NEW)}
              >
                New
              </Button>
              <Button
                variant={
                  currentTask.status === TaskStatus.IN_PROGRESS
                    ? 'primary'
                    : 'outline'
                }
                size='sm'
                onClick={() => handleStatusChange(TaskStatus.IN_PROGRESS)}
              >
                In Progress
              </Button>
              <Button
                variant={
                  currentTask.status === TaskStatus.COMPLETED
                    ? 'primary'
                    : 'outline'
                }
                size='sm'
                onClick={() => handleStatusChange(TaskStatus.COMPLETED)}
              >
                Completed
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title='Edit Task'
        footer={
          <div className='flex justify-end space-x-2'>
            <Button variant='outline' onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (currentTask && updatedStatus) {
                  await editTask({
                    id: currentTask.id,
                    status: updatedStatus as TaskStatus,
                  });
                  setIsEditModalOpen(false);
                }
              }}
            >
              Save Changes
            </Button>
          </div>
        }
      >
        <div className='space-y-4'>
          <p className='text-gray-700 dark:text-gray-300 mb-2'>
            Update task status:
          </p>
          <Select
            id='status'
            value={updatedStatus}
            onChange={(e) => setUpdatedStatus(e.target.value as TaskStatus)}
            options={[
              { value: TaskStatus.NEW, label: 'New' },
              { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
              { value: TaskStatus.COMPLETED, label: 'Completed' },
            ]}
          />
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title='Delete Task'
        footer={
          <div className='flex justify-end space-x-2'>
            <Button
              variant='outline'
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant='danger' onClick={handleDelete}>
              Delete
            </Button>
          </div>
        }
      >
        <div>
          <p className='text-gray-700 dark:text-gray-300'>
            Are you sure you want to delete this task? This action cannot be
            undone.
          </p>
        </div>
      </Modal>
    </div>
  );
}
