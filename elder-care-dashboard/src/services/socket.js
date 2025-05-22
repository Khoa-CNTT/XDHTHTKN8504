import { io } from 'socket.io-client';
import { store } from '../store/store';
import {
    addMessage,
    updateMessageReadStatus,
    addOnlineUser,
    removeOnlineUser,
    setTypingUser,
    addNewChat
} from '../store/chatSlice';

class SocketService {
    constructor() {
        this.socket = null;
        this.isConnected = false;
    }

    connect(userId) {
        if (this.socket?.connected) {
            return;
        }

        const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

        this.socket = io(SOCKET_URL, {
            autoConnect: true,
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
            timeout: 20000,
        });

        this.setupEventListeners(userId);
    }

    setupEventListeners(userId) {
        if (!this.socket) return;

        // Connection events
        this.socket.on('connect', () => {
            console.log('Connected to server');
            this.isConnected = true;
            // Authenticate user
            this.socket.emit('authenticate', { userId });
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from server');
            this.isConnected = false;
        });

        this.socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
        });

        // Authentication events
        this.socket.on('authenticated', (data) => {
            console.log('Authenticated:', data);
        });

        this.socket.on('auth_error', (error) => {
            console.error('Authentication error:', error);
        });

        // Chat events
        this.socket.on('available_chats', (chats) => {
            console.log('Available chats:', chats);
        });

        this.socket.on('chat_initialized', (chat) => {
            console.log('New chat initialized:', chat);
            store.dispatch(addNewChat(chat));
        });

        this.socket.on('receive_message', (data) => {
            console.log('New message received:', data);
            const { chatId, senderId, message, timestamp, isRead } = data;

            store.dispatch(addMessage({
                chatId,
                message: {
                    _id: data.messageId || Date.now().toString(),
                    senderId,
                    message,
                    timestamp,
                    isRead
                }
            }));
        });

        this.socket.on('messages_read', (data) => {
            console.log('Messages marked as read:', data);
            const { chatId, messageIds } = data;
            store.dispatch(updateMessageReadStatus({ chatId, messageIds }));
        });

        this.socket.on('user_typing', (data) => {
            const { chatId, userId, isTyping } = data;
            store.dispatch(setTypingUser({ chatId, userId, isTyping }));
        });

        this.socket.on('user_online', (data) => {
            store.dispatch(addOnlineUser(data.userId));
        });

        this.socket.on('user_disconnected', (data) => {
            store.dispatch(removeOnlineUser(data.userId));
        });

        // Error events
        this.socket.on('chat_error', (error) => {
            console.error('Chat error:', error);
        });

        this.socket.on('message_error', (error) => {
            console.error('Message error:', error);
        });

        this.socket.on('read_error', (error) => {
            console.error('Read error:', error);
        });
    }

    // Send message
    sendMessage(chatId, senderId, message) {
        if (this.socket?.connected) {
            this.socket.emit('send_message', {
                chatId,
                senderId,
                message
            });
        }
    }

    // Initialize new chat
    initializeChat(initiatorId, targetId, chatType, title = '') {
        if (this.socket?.connected) {
            this.socket.emit('initialize_chat', {
                initiatorId,
                targetId,
                chatType,
                title
            });
        }
    }

    // Mark messages as read
    markAsRead(chatId, userId, messageIds) {
        if (this.socket?.connected) {
            this.socket.emit('mark_as_read', {
                chatId,
                userId,
                messageIds
            });
        }
    }

    // Typing indicators
    startTyping(chatId, userId) {
        if (this.socket?.connected) {
            this.socket.emit('typing_start', { chatId, userId });
        }
    }

    stopTyping(chatId, userId) {
        if (this.socket?.connected) {
            this.socket.emit('typing_stop', { chatId, userId });
        }
    }

    // Join chat room
    joinChat(chatId) {
        if (this.socket?.connected) {
            this.socket.emit('join_chat', { chatId });
        }
    }

    // Leave chat room
    leaveChat(chatId) {
        if (this.socket?.connected) {
            this.socket.emit('leave_chat', { chatId });
        }
    }

    // Disconnect
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
        }
    }

    // Get connection status
    isSocketConnected() {
        return this.isConnected && this.socket?.connected;
    }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
