'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useTasks } from '../../../../hooks/useTasks';
import Card from '../../../../components/ui/Card';
import Input from '../../../../components/ui/Input';
import TextArea from '../../../../components/ui/TextArea';
import Button from '../../../../components/ui/Button';
import Select from '../../../../components/ui/Select';

interface TaskFormData {
  title: string;
  description: string;
  assigneeId: string;
  deadline: string;
}

export default function NewTask() {
  const router = useRouter();
  const { addTask, loading } = useTasks();

  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    assigneeId: '', // In a real app, this might default to the current user's ID
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0], // 7 days from now
  });

  const [formErrors, setFormErrors] = useState<{
    title?: string;
    description?: string;
    assigneeId?: string;
    deadline?: string;
    general?: string;
  }>({});

  // In a real app, this would come from an API call
  const mockUsers = [
    { id: 'user1', name: 'John Doe' },
    { id: 'user2', name: 'Jane Smith' },
    { id: 'user3', name: 'Bob Johnson' },
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
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
  };

  const validateForm = () => {
    const errors: {
      title?: string;
      description?: string;
      assigneeId?: string;
      deadline?: string;
    } = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }

    if (!formData.assigneeId) {
      errors.assigneeId = 'Assignee is required';
    }

    if (!formData.deadline) {
      errors.deadline = 'Deadline is required';
    } else {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (deadlineDate < today) {
        errors.deadline = 'Deadline cannot be in the past';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const success = await addTask({
        title: formData.title,
        description: formData.description,
        assigneeId: formData.assigneeId,
        deadline: new Date(formData.deadline).toISOString(),
      });

      if (success) {
        router.push('/dashboard/tasks');
      } else {
        setFormErrors({
          general: 'Failed to create task. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error creating task:', error);
      setFormErrors({
        general: 'An error occurred. Please try again.',
      });
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
          Create New Task
        </h1>
      </div>

      <Card>
        {formErrors.general && (
          <div className='mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md'>
            {formErrors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-6'>
          <Input
            id='title'
            name='title'
            label='Title'
            placeholder='Enter task title'
            value={formData.title}
            onChange={handleChange}
            error={formErrors.title}
            required
            autoFocus
          />

          <TextArea
            id='description'
            name='description'
            label='Description'
            placeholder='Enter task description'
            value={formData.description}
            onChange={handleChange}
            error={formErrors.description}
            required
            rows={5}
          />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <Select
              id='assigneeId'
              name='assigneeId'
              label='Assignee'
              value={formData.assigneeId}
              onChange={handleChange}
              error={formErrors.assigneeId}
              options={[
                { value: '', label: 'Select an assignee' },
                ...mockUsers.map((user) => ({
                  value: user.id,
                  label: user.name,
                })),
              ]}
              required
            />

            <Input
              id='deadline'
              name='deadline'
              type='date'
              label='Deadline'
              value={formData.deadline}
              onChange={handleChange}
              error={formErrors.deadline}
              required
            />
          </div>

          <div className='flex justify-end space-x-3'>
            <Button type='button' variant='outline' onClick={handleCancel}>
              Cancel
            </Button>
            <Button type='submit' loading={loading} disabled={loading}>
              Create Task
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
