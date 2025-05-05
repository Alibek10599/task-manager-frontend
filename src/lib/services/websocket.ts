import { io, Socket } from 'socket.io-client';
import { store } from '../../store';
import { receiveMessage } from '../../store/slices/chatSlice';
import { addNotification } from '../../store/slices/uiSlice';
import { Task } from '../../store/slices/tasksSlice';
import { Message } from '../../store/slices/chatSlice';

class WebSocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  connect() {
    if (this.isConnected) return;

    const state = store.getState();
    const token = state.auth.token;

    if (!token) {
      console.error('Cannot connect to WebSocket without token');
      return;
    }

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080';

    this.socket = io(wsUrl, {
      auth: {
        token,
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.setupEventListeners();
    this.isConnected = true;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      store.dispatch(
        addNotification({
          message: 'Failed to connect to chat server',
          type: 'error',
          timeout: 5000,
        })
      );
    });

    // Chat messages
    this.socket.on('message', (message: Message) => {
      store.dispatch(receiveMessage(message));

      // Notify if it's a new message and not from the active conversation
      const state = store.getState();
      const chatState = state.chat as { activeConversation: string; conversations: { participantId: string; participantName: string }[] };
      const activeConversation = chatState.activeConversation;

      if (message.senderId !== activeConversation) {
        const sender = chatState.conversations.find(
          (c) => c.participantId === message.senderId
        );

        store.dispatch(
          addNotification({
            message: `New message from ${
              sender?.participantName || 'Unknown User'
            }`,
            type: 'info',
            timeout: 5000,
          })
        );
      }
    });

    // Task updates
    this.socket.on('task_created', (task: Task) => {
      store.dispatch(
        addNotification({
          message: `New task assigned: ${task.title}`,
          type: 'info',
          timeout: 5000,
        })
      );
    });

    this.socket.on('task_updated', (task: Task) => {
      store.dispatch(
        addNotification({
          message: `Task "${task.title}" has been updated`,
          type: 'info',
          timeout: 5000,
        })
      );
    });
  }

  // Send a chat message
  sendMessage(recipientId: string, content: string) {
    if (!this.socket || !this.isConnected) {
      this.connect();
    }

    this.socket?.emit('send_message', {
      recipientId,
      content,
    });
  }

  // Join a chat room
  joinRoom(roomId: string) {
    if (!this.socket || !this.isConnected) {
      this.connect();
    }

    this.socket?.emit('join_room', { roomId });
  }

  // Leave a chat room
  leaveRoom(roomId: string) {
    if (!this.socket || !this.isConnected) return;

    this.socket.emit('leave_room', { roomId });
  }
}

// Create a singleton instance
const websocketService = new WebSocketService();

export default websocketService;
