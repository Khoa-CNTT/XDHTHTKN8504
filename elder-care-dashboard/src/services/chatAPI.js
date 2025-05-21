import axios from '../api/axios';

const token = localStorage.getItem('token');

const chatAPI = {
    getMyChats: async () => {
        const res = await axios.get('/chats/my-chats', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    },
    getMessages: async (chatId) => {
        const res = await axios.get(`/chats/${chatId}/messages`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return res.data;
    },
    markMessagesRead: async ({ chatId, messageIds }) => {
        return axios.put(`/chats/${chatId}/read`, { messageIds }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
};

export default chatAPI;
