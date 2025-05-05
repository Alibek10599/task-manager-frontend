import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '..';

// Define task status enum
export enum TaskStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

// Define types
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assigneeId: string;
  deadline: string; // ISO date string
  createdAt: string;
  updatedAt: string;
}

interface TasksState {
  tasks: Task[];
  currentTask: Task | null;
  loading: boolean;
  error: string | null;
}

interface CreateTaskDto {
  title: string;
  description: string;
  assigneeId: string;
  deadline: string;
}

interface UpdateTaskDto {
  id: string;
  title?: string;
  description?: string;
  status?: TaskStatus;
  assigneeId?: string;
  deadline?: string;
}

// Define initial state
const initialState: TasksState = {
  tasks: [],
  currentTask: null,
  loading: false,
  error: null,
};

// Define API base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Create async thunks
export const fetchTasks = createAsyncThunk<Task[]>(
  'tasks/fetchAll',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { token } = state.auth;

      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await axios.get(`${API_URL}/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to fetch tasks'
      );
    }
  }
);

export const fetchTaskById = createAsyncThunk<Task, string>(
  'tasks/fetchById',
  async (taskId, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { token } = state.auth;

      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await axios.get(`${API_URL}/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to fetch task'
      );
    }
  }
);

export const createTask = createAsyncThunk<Task, CreateTaskDto>(
  'tasks/create',
  async (taskData, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { token } = state.auth;

      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await axios.post(`${API_URL}/tasks`, taskData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to create task'
      );
    }
  }
);

export const updateTask = createAsyncThunk<Task, UpdateTaskDto>(
  'tasks/update',
  async (taskData, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { token } = state.auth;

      if (!token) {
        throw new Error('No authentication token');
      }

      const { id, ...updateData } = taskData;

      const response = await axios.put(`${API_URL}/tasks/${id}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to update task'
      );
    }
  }
);

export const deleteTask = createAsyncThunk<string, string>(
  'tasks/delete',
  async (taskId, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { token } = state.auth;

      if (!token) {
        throw new Error('No authentication token');
      }

      await axios.delete(`${API_URL}/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return taskId;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to delete task'
      );
    }
  }
);

// Create slice
const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearCurrentTask: (state) => {
      state.currentTask = null;
    },
    setCurrentTask: (state, action: PayloadAction<Task>) => {
      state.currentTask = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch all tasks
    builder.addCase(fetchTasks.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.loading = false;
      state.tasks = action.payload;
    });
    builder.addCase(fetchTasks.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch task by id
    builder.addCase(fetchTaskById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTaskById.fulfilled, (state, action) => {
      state.loading = false;
      state.currentTask = action.payload;
    });
    builder.addCase(fetchTaskById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create task
    builder.addCase(createTask.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createTask.fulfilled, (state, action) => {
      state.loading = false;
      state.tasks.push(action.payload);
    });
    builder.addCase(createTask.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update task
    builder.addCase(updateTask.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateTask.fulfilled, (state, action) => {
      state.loading = false;

      // Update in tasks array
      const index = state.tasks.findIndex(
        (task) => task.id === action.payload.id
      );
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }

      // Update current task if it's the same one
      if (state.currentTask && state.currentTask.id === action.payload.id) {
        state.currentTask = action.payload;
      }
    });
    builder.addCase(updateTask.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete task
    builder.addCase(deleteTask.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteTask.fulfilled, (state, action) => {
      state.loading = false;
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);

      // Clear current task if it's the deleted one
      if (state.currentTask && state.currentTask.id === action.payload) {
        state.currentTask = null;
      }
    });
    builder.addCase(deleteTask.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearCurrentTask, setCurrentTask } = tasksSlice.actions;
export default tasksSlice.reducer;
