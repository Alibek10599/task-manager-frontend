import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { RootState } from '..';

// Define types
export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: string; // ISO date string
  read: boolean;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: number;
}

interface ChatState {
  conversations: Conversation[];
  activeConversation: string | null; // participantId of the active conversation
  messages: Message[];
  loading: boolean;
  error: string | null;
}

interface SendMessageDto {
  recipientId: string;
  content: string;
}

// Define initial state
const initialState: ChatState = {
  conversations: [],
  activeConversation: null,
  messages: [],
  loading: false,
  error: null,
};

// Define API base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Create async thunks
export const fetchConversations = createAsyncThunk<Conversation[]>(
  'chat/fetchConversations',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { token } = state.auth;

      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await axios.get(`${API_URL}/chat/conversations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Failed to fetch conversations');
    }
  }
);

export const fetchMessages = createAsyncThunk<Message[], string>(
  'chat/fetchMessages',
  async (participantId, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { token } = state.auth;

      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await axios.get(
        `${API_URL}/chat/messages/${participantId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // Handle API errors
        const axiosError = error as AxiosError;
        return rejectWithValue(
          axiosError.response?.data ||
            axiosError.message ||
            'API request failed'
        );
      }

      if (error instanceof Error) {
        // Handle standard JS errors
        return rejectWithValue(error.message);
      }

      // Handle unknown error types
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const sendMessage = createAsyncThunk<Message, SendMessageDto>(
  'chat/sendMessage',
  async (messageData, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { token } = state.auth;

      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await axios.post(
        `${API_URL}/chat/messages`,
        messageData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(
        (axios.isAxiosError(error) && error.response?.data?.message) ||
          'Failed to send message'
      );
    }
  }
);

export const markMessagesAsRead = createAsyncThunk<void, string>(
  'chat/markMessagesAsRead',
  async (participantId, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { token } = state.auth;

      if (!token) {
        throw new Error('No authentication token');
      }

      await axios.put(
        `${API_URL}/chat/messages/read/${participantId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return;
    } catch (error: unknown) {
      return rejectWithValue(
        (axios.isAxiosError(error) && error.response?.data?.message) ||
          'Failed to mark messages as read'
      );
    }
  }
);

// Create slice
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveConversation: (state, action: PayloadAction<string>) => {
      state.activeConversation = action.payload;
    },
    clearActiveConversation: (state) => {
      state.activeConversation = null;
      state.messages = [];
    },
    receiveMessage: (state, action: PayloadAction<Message>) => {
      const message = action.payload;

      // Add message to messages array if it's from the active conversation
      if (
        state.activeConversation &&
        (message.senderId === state.activeConversation ||
          message.recipientId === state.activeConversation)
      ) {
        state.messages.push(message);
      }

      // Update conversation or create new one
      const isFromActiveSender = state.activeConversation === message.senderId;
      const senderId = message.senderId;
      const conversationIndex = state.conversations.findIndex(
        (conv) => conv.participantId === senderId
      );

      if (conversationIndex !== -1) {
        // Update existing conversation
        state.conversations[conversationIndex] = {
          ...state.conversations[conversationIndex],
          lastMessage: message.content,
          lastMessageTimestamp: message.timestamp,
          unreadCount: isFromActiveSender
            ? 0
            : state.conversations[conversationIndex].unreadCount + 1,
        };
      } else {
        // If this is a new conversation, we'll add placeholder data
        // This should be updated when we next fetch conversations
        state.conversations.push({
          id: `temp-${Date.now()}`,
          participantId: senderId,
          participantName: 'Unknown User', // Will be updated when we fetch conversations
          lastMessage: message.content,
          lastMessageTimestamp: message.timestamp,
          unreadCount: 1,
        });
      }

      // Sort conversations by last message timestamp
      state.conversations.sort(
        (a, b) =>
          new Date(b.lastMessageTimestamp).getTime() -
          new Date(a.lastMessageTimestamp).getTime()
      );
    },
  },
  extraReducers: (builder) => {
    // Fetch conversations
    builder.addCase(fetchConversations.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchConversations.fulfilled, (state, action) => {
      state.loading = false;
      state.conversations = action.payload;
    });
    builder.addCase(fetchConversations.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch messages
    builder.addCase(fetchMessages.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchMessages.fulfilled, (state, action) => {
      state.loading = false;
      state.messages = action.payload;
    });
    builder.addCase(fetchMessages.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Send message
    builder.addCase(sendMessage.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(sendMessage.fulfilled, (state, action) => {
      state.loading = false;
      state.messages.push(action.payload);

      // Update conversation
      const recipientId = action.payload.recipientId;
      const conversationIndex = state.conversations.findIndex(
        (conv) => conv.participantId === recipientId
      );

      if (conversationIndex !== -1) {
        state.conversations[conversationIndex] = {
          ...state.conversations[conversationIndex],
          lastMessage: action.payload.content,
          lastMessageTimestamp: action.payload.timestamp,
        };

        // Move this conversation to the top
        const conversation = state.conversations[conversationIndex];
        state.conversations.splice(conversationIndex, 1);
        state.conversations.unshift(conversation);
      }
    });
    builder.addCase(sendMessage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Mark messages as read
    builder.addCase(markMessagesAsRead.fulfilled, (state) => {
      // Find the conversation and reset unread count
      if (state.activeConversation) {
        const conversationIndex = state.conversations.findIndex(
          (conv) => conv.participantId === state.activeConversation
        );

        if (conversationIndex !== -1) {
          state.conversations[conversationIndex] = {
            ...state.conversations[conversationIndex],
            unreadCount: 0,
          };
        }
      }

      // Mark all messages from the active conversation as read
      state.messages = state.messages.map((message) => {
        if (message.senderId === state.activeConversation && !message.read) {
          return { ...message, read: true };
        }
        return message;
      });
    });
  },
});

export const {
  setActiveConversation,
  clearActiveConversation,
  receiveMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
