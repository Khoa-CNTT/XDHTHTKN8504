import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    chats: [],
    currentChat: null,
    messages: [],
    loading: false,
    messageLoading: false,
    error: null,
    pagination: {
        page: 1,
        limit: 50,
        total: 0,
        pages: 0
    },
    availableUsers: [],
};

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        // Lấy danh sách chat
        fetchChatsStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchChatsSuccess: (state, action) => {
            state.loading = false;
            state.chats = action.payload;
        },
        fetchChatsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Lấy tin nhắn của một chat
        fetchMessagesStart: (state) => {
            state.messageLoading = true;
            state.error = null;
        },
        fetchMessagesSuccess: (state, action) => {
            state.messageLoading = false;
            state.messages = action.payload.messages;
            state.pagination = action.payload.pagination || {
                page: 1,
                limit: 50,
                total: action.payload.messages.length,
                pages: 1
            };
        },
        fetchMessagesFailure: (state, action) => {
            state.messageLoading = false;
            state.error = action.payload;
        },

        // Đặt chat hiện tại
        setCurrentChat: (state, action) => {
            state.currentChat = action.payload;
        },

        // Thêm tin nhắn mới
        addMessage: (state, action) => {
            // Thêm tin nhắn vào đầu danh sách (do tin nhắn mới nhất ở trên)
            state.messages = [action.payload, ...state.messages];

            // Cập nhật lastActivity của chat
            const chatIndex = state.chats.findIndex(
                chat => chat._id === action.payload.chatId
            );

            if (chatIndex !== -1) {
                state.chats[chatIndex].metadata = {
                    ...state.chats[chatIndex].metadata,
                    lastActivity: new Date().toISOString()
                };

                // Sắp xếp lại chats theo lastActivity
                state.chats.sort((a, b) =>
                    new Date(b.metadata.lastActivity) - new Date(a.metadata.lastActivity)
                );
            }
        },

        // Đánh dấu đã đọc
        markAsRead: (state, action) => {
            const { chatId, messageIds, readBy } = action.payload;

            state.messages = state.messages.map(msg => {
                if (messageIds.includes(msg._id)) {
                    return { ...msg, isRead: true };
                }
                return msg;
            });
        },

        // Thêm chat mới 
        addChat: (state, action) => {
            state.chats = [action.payload, ...state.chats];
        },

        // Lấy danh sách người dùng có thể chat
        fetchAvailableUsersStart: (state) => {
            state.loading = true;
        },
        fetchAvailableUsersSuccess: (state, action) => {
            state.loading = false;
            state.availableUsers = action.payload;
        },
        fetchAvailableUsersFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Reset messages khi chuyển chat
        resetMessages: (state) => {
            state.messages = [];
            state.pagination = {
                page: 1,
                limit: 50,
                total: 0,
                pages: 0
            };
        },
    },
});

export const {
    fetchChatsStart,
    fetchChatsSuccess,
    fetchChatsFailure,
    fetchMessagesStart,
    fetchMessagesSuccess,
    fetchMessagesFailure,
    setCurrentChat,
    addMessage,
    markAsRead,
    addChat,
    fetchAvailableUsersStart,
    fetchAvailableUsersSuccess,
    fetchAvailableUsersFailure,
    resetMessages,
} = chatSlice.actions;

export default chatSlice.reducer;