import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import chatAPI from '../services/chatAPI';

// Async thunks
export const fetchMyChats = createAsyncThunk(
    'chat/fetchMyChats',
    async (_, { rejectWithValue }) => {
        try {
            const response = await chatAPI.getMyChats();
            return response.data.chats;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch chats');
        }
    }
);

export const fetchChatMessages = createAsyncThunk(
    'chat/fetchChatMessages',
    async ({ chatId, page = 1, limit = 50 }, { rejectWithValue }) => {
        try {
            const response = await chatAPI.getChatMessages(chatId, { page, limit });
            return {
                chatId,
                messages: response.data.messages,
                pagination: response.data.pagination
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch messages');
        }
    }
);

export const createNewChat = createAsyncThunk(
    'chat/createNewChat',
    async (chatData, { rejectWithValue }) => {
        try {
            const response = await chatAPI.createChat(chatData);
            return response.data.chat;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create chat');
        }
    }
);

export const sendMessage = createAsyncThunk(
    'chat/sendMessage',
    async ({ chatId, message }, { rejectWithValue }) => {
        try {
            const response = await chatAPI.sendMessage(chatId, { message });
            return {
                chatId,
                message: response.data.message
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to send message');
        }
    }
);

export const markMessagesAsRead = createAsyncThunk(
    'chat/markMessagesAsRead',
    async ({ chatId, messageIds }, { rejectWithValue }) => {
        try {
            await chatAPI.markAsRead(chatId, { messageIds });
            return { chatId, messageIds };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to mark messages as read');
        }
    }
);

export const fetchAvailableUsers = createAsyncThunk(
    'chat/fetchAvailableUsers',
    async (role, { rejectWithValue }) => {
        try {
            const response = await chatAPI.getAvailableUsers(role);
            return response.data.users;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
        }
    }
);

const initialState = {
    chats: [],
    currentChat: null,
    messages: {},
    availableUsers: [],
    onlineUsers: [], // ✅ Thay đổi từ Set thành Array
    isLoading: false,
    isLoadingMessages: false,
    isLoadingUsers: false,
    error: null,
    messageError: null,
    typingUsers: {}, // ✅ Sẽ chứa arrays thay vì Sets
    unreadCounts: {}
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setCurrentChat: (state, action) => {
            state.currentChat = action.payload;
        },

        clearCurrentChat: (state) => {
            state.currentChat = null;
        },

        addMessage: (state, action) => {
            const { chatId, message } = action.payload;
            if (!state.messages[chatId]) {
                state.messages[chatId] = [];
            }
            state.messages[chatId].push(message);

            // Update last activity in chat list
            const chat = state.chats.find(c => c._id === chatId);
            if (chat) {
                chat.metadata.lastActivity = message.timestamp;
                // Move chat to top
                state.chats = [chat, ...state.chats.filter(c => c._id !== chatId)];
            }

            // Update unread count if message is not from current user
            if (state.currentChat?._id !== chatId) {
                state.unreadCounts[chatId] = (state.unreadCounts[chatId] || 0) + 1;
            }
        },

        updateMessageReadStatus: (state, action) => {
            const { chatId, messageIds } = action.payload;
            if (state.messages[chatId]) {
                state.messages[chatId] = state.messages[chatId].map(msg =>
                    messageIds.includes(msg._id) ? { ...msg, isRead: true } : msg
                );
            }
        },

        setOnlineUsers: (state, action) => {
            // ✅ Chuyển từ Set thành Array
            state.onlineUsers = Array.isArray(action.payload) ? action.payload : [action.payload];
        },

        addOnlineUser: (state, action) => {
            // ✅ Thêm user vào array nếu chưa tồn tại
            const userId = action.payload;
            if (!state.onlineUsers.includes(userId)) {
                state.onlineUsers.push(userId);
            }
        },

        removeOnlineUser: (state, action) => {
            // ✅ Xóa user khỏi array
            const userId = action.payload;
            state.onlineUsers = state.onlineUsers.filter(id => id !== userId);
        },

        setTypingUser: (state, action) => {
            const { chatId, userId, isTyping } = action.payload;
            if (!state.typingUsers[chatId]) {
                state.typingUsers[chatId] = []; // ✅ Khởi tạo như array
            }

            if (isTyping) {
                // ✅ Thêm vào array nếu chưa có
                if (!state.typingUsers[chatId].includes(userId)) {
                    state.typingUsers[chatId].push(userId);
                }
            } else {
                // ✅ Xóa khỏi array
                state.typingUsers[chatId] = state.typingUsers[chatId].filter(id => id !== userId);
            }
        },

        clearUnreadCount: (state, action) => {
            const chatId = action.payload;
            delete state.unreadCounts[chatId];
        },

        addNewChat: (state, action) => {
            const newChat = action.payload;
            state.chats.unshift(newChat);
        },

        clearError: (state) => {
            state.error = null;
            state.messageError = null;
        },

        clearMessages: (state, action) => {
            const chatId = action.payload;
            if (chatId) {
                delete state.messages[chatId];
            } else {
                state.messages = {};
            }
        }
    },

    extraReducers: (builder) => {
        builder
            // Fetch my chats
            .addCase(fetchMyChats.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchMyChats.fulfilled, (state, action) => {
                state.isLoading = false;
                state.chats = action.payload;
            })
            .addCase(fetchMyChats.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Fetch chat messages
            .addCase(fetchChatMessages.pending, (state) => {
                state.isLoadingMessages = true;
            })
            .addCase(fetchChatMessages.fulfilled, (state, action) => {
                state.isLoadingMessages = false;
                const { chatId, messages } = action.payload;
                state.messages[chatId] = messages;
            })
            .addCase(fetchChatMessages.rejected, (state, action) => {
                state.isLoadingMessages = false;
                state.messageError = action.payload;
            })

            // Create new chat
            .addCase(createNewChat.fulfilled, (state, action) => {
                state.chats.unshift(action.payload);
            })

            // Send message
            .addCase(sendMessage.fulfilled, (state, action) => {
                // const { chatId, message } = action.payload;
                // if (!state.messages[chatId]) {
                //     state.messages[chatId] = [];
                // }
                // state.messages[chatId].push(message);
            })

            // Mark messages as read
            .addCase(markMessagesAsRead.fulfilled, (state, action) => {
                const { chatId, messageIds } = action.payload;
                if (state.messages[chatId]) {
                    state.messages[chatId] = state.messages[chatId].map(msg =>
                        messageIds.includes(msg._id) ? { ...msg, isRead: true } : msg
                    );
                }
                delete state.unreadCounts[chatId];
            })

            // Fetch available users
            .addCase(fetchAvailableUsers.pending, (state) => {
                state.isLoadingUsers = true;
            })
            .addCase(fetchAvailableUsers.fulfilled, (state, action) => {
                state.isLoadingUsers = false;
                state.availableUsers = action.payload;
            })
            .addCase(fetchAvailableUsers.rejected, (state, action) => {
                state.isLoadingUsers = false;
                state.error = action.payload;
            });
    }
});

export const {
    setCurrentChat,
    clearCurrentChat,
    addMessage,
    updateMessageReadStatus,
    setOnlineUsers,
    addOnlineUser,
    removeOnlineUser,
    setTypingUser,
    clearUnreadCount,
    addNewChat,
    clearError,
    clearMessages
} = chatSlice.actions;

export default chatSlice.reducer;