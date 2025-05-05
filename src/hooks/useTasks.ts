import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTasks,
  fetchTaskById,
  createTask,
  updateTask,
  deleteTask,
  clearCurrentTask,
  //   Task,
  TaskStatus,
} from '../store/slices/tasksSlice';
import { RootState, AppDispatch } from '../store';

export const useTasks = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, currentTask, loading, error } = useSelector(
    (state: RootState) => state.tasks
  );

  const getAllTasks = useCallback(async () => {
    try {
      await dispatch(fetchTasks()).unwrap();
      return true;
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      return false;
    }
  }, [dispatch]);

  const getTaskById = useCallback(
    async (taskId: string) => {
      try {
        await dispatch(fetchTaskById(taskId)).unwrap();
        return true;
      } catch (error) {
        console.error('Failed to fetch task by ID:', error);
        return false;
      }
    },
    [dispatch]
  );

  const addTask = useCallback(
    async (taskData: {
      title: string;
      description: string;
      assigneeId: string;
      deadline: string;
    }) => {
      try {
        await dispatch(createTask(taskData)).unwrap();
        return true;
      } catch (error) {
        console.error('Failed to create task:', error);
        return false;
      }
    },
    [dispatch]
  );

  const editTask = useCallback(
    async (taskData: {
      id: string;
      title?: string;
      description?: string;
      status?: TaskStatus;
      assigneeId?: string;
      deadline?: string;
    }) => {
      try {
        await dispatch(updateTask(taskData)).unwrap();
        return true;
      } catch (error) {
        console.error('Failed to update task:', error);
        return false;
      }
    },
    [dispatch]
  );

  const removeTask = useCallback(
    async (taskId: string) => {
      try {
        await dispatch(deleteTask(taskId)).unwrap();
        return true;
      } catch (error) {
        console.error('Failed to delete task:', error);
        return false;
      }
    },
    [dispatch]
  );

  const clearTask = useCallback(() => {
    dispatch(clearCurrentTask());
  }, [dispatch]);

  // Filter tasks by status
  const getTasksByStatus = useCallback(
    (status: TaskStatus) => {
      return tasks.filter((task) => task.status === status);
    },
    [tasks]
  );

  // Filter tasks assigned to current user
  const getMyTasks = useCallback(
    (userId: string) => {
      return tasks.filter((task) => task.assigneeId === userId);
    },
    [tasks]
  );

  // Get tasks that are due soon (within 7 days)
  const getUpcomingTasks = useCallback(() => {
    const now = new Date();
    const nextWeek = new Date(now);
    nextWeek.setDate(now.getDate() + 7);

    return tasks.filter((task) => {
      const deadlineDate = new Date(task.deadline);
      return (
        task.status !== TaskStatus.COMPLETED &&
        deadlineDate >= now &&
        deadlineDate <= nextWeek
      );
    });
  }, [tasks]);

  // Get overdue tasks
  const getOverdueTasks = useCallback(() => {
    const now = new Date();

    return tasks.filter((task) => {
      const deadlineDate = new Date(task.deadline);
      return task.status !== TaskStatus.COMPLETED && deadlineDate < now;
    });
  }, [tasks]);

  return {
    tasks,
    currentTask,
    loading,
    error,
    getAllTasks,
    getTaskById,
    addTask,
    editTask,
    removeTask,
    clearTask,
    getTasksByStatus,
    getMyTasks,
    getUpcomingTasks,
    getOverdueTasks,
  };
};
