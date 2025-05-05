import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define types
interface UIState {
  isDarkMode: boolean;
  sidebarOpen: boolean;
  isMobile: boolean;
  notifications: Notification[];
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timeout?: number; // in milliseconds
}

// Define initial state
const initialState: UIState = {
  isDarkMode:
    typeof window !== 'undefined'
      ? localStorage.getItem('darkMode') === 'true'
      : false,
  sidebarOpen: true,
  isMobile: typeof window !== 'undefined' ? window.innerWidth < 768 : false,
  notifications: [],
};

// Create slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;

      // Save to local storage
      if (typeof window !== 'undefined') {
        localStorage.setItem('darkMode', state.isDarkMode.toString());

        // Apply to document
        if (state.isDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarState: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setIsMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload;

      // Close sidebar automatically on mobile
      if (state.isMobile) {
        state.sidebarOpen = false;
      } else {
        state.sidebarOpen = true;
      }
    },
    addNotification: (
      state,
      action: PayloadAction<Omit<Notification, 'id'>>
    ) => {
      const id = Date.now().toString();
      state.notifications.push({
        id,
        ...action.payload,
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  toggleDarkMode,
  toggleSidebar,
  setSidebarState,
  setIsMobile,
  addNotification,
  removeNotification,
  clearNotifications,
} = uiSlice.actions;

export default uiSlice.reducer;
