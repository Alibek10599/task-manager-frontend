import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchConversations,
  fetchMessages,
  sendMessage,
  markMessagesAsRead,
  setActiveConversation,
  clearActiveConversation,
  Conversation,
  Message,
} from '../store/slices/chatSlice';
import { RootState, AppDispatch } from '../store';
import websocketService from '../lib/services/websocket';

export const useChat = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { conversations, activeConversation, messages, loading, error } =
    useSelector(
      (state: RootState) =>
        state.chat as {
          conversations: Conversation[];
          activeConversation: string | null;
          messages: Message[];
          loading: boolean;
          error: string | null;
        }
    );

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Connect to WebSocket when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      websocketService.connect();
    } else {
      websocketService.disconnect();
    }

    return () => {
      websocketService.disconnect();
    };
  }, [isAuthenticated]);

  // Join room when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      websocketService.joinRoom(activeConversation);

      // Mark messages as read
      dispatch(markMessagesAsRead(activeConversation));
    }

    return () => {
      if (activeConversation) {
        websocketService.leaveRoom(activeConversation);
      }
    };
  }, [activeConversation, dispatch]);

  const getConversations = useCallback(async () => {
    try {
      await dispatch(fetchConversations()).unwrap();
      return true;
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      return false;
    }
  }, [dispatch]);

  const getMessages = useCallback(
    async (participantId: string) => {
      try {
        await dispatch(fetchMessages(participantId)).unwrap();
        return true;
      } catch (error) {
        console.error('Failed to fetch messages:', error);
        return false;
      }
    },
    [dispatch]
  );

  const sendChatMessage = useCallback(
    async (recipientId: string, content: string) => {
      try {
        // Send via API first
        await dispatch(sendMessage({ recipientId, content })).unwrap();

        // Also send via WebSocket
        websocketService.sendMessage(recipientId, content);

        return true;
      } catch (error) {
        console.error('Failed to send message:', error);
        return false;
      }
    },
    [dispatch]
  );

  const markAsRead = useCallback(
    async (participantId: string) => {
      try {
        await dispatch(markMessagesAsRead(participantId)).unwrap();
        return true;
      } catch (error) {
        console.error('Failed to mark messages as read:', error);
        return false;
      }
    },
    [dispatch]
  );

  const setConversation = useCallback(
    (participantId: string) => {
      dispatch(setActiveConversation(participantId));
      return getMessages(participantId);
    },
    [dispatch, getMessages]
  );

  const clearConversation = useCallback(() => {
    dispatch(clearActiveConversation());
  }, [dispatch]);

  // Get total unread messages count
  const getUnreadCount = useCallback(() => {
    return conversations.reduce(
      (total: number, conv: Conversation) => total + conv.unreadCount,
      0
    );
  }, [conversations]);

  return {
    conversations,
    activeConversation,
    messages,
    loading,
    error,
    getConversations,
    getMessages,
    sendMessage: sendChatMessage,
    markAsRead,
    setConversation,
    clearConversation,
    getUnreadCount,
  };
};
