import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import chatAPI from '../services/chatAPI';

export const fetchMyChats = createAsyncThunk('chat/fetchMyChats', chatAPI.getMyChats);
export const fetchMessages = createAsyncThunk('chat/fetchMessages', chatAPI.getMessages);
export const markAsRead = createAsyncThunk('chat/markAsRead', chatAPI.markMessagesRead);

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chatList: [],
        selectedChatId: null,
        selectedChat: null,
        messages: []
    },
    reducers: {
        setSelectedChat: (state, action) => {
            state.selectedChatId = action.payload;
            state.selectedChat = state.chatList.find(c => c._id === action.payload);
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchMyChats.fulfilled, (state, action) => {
                state.chatList = action.payload.chats;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.messages = action.payload.messages;
            });
    }
});

export const { setSelectedChat } = chatSlice.actions;
export default chatSlice.reducer;
