import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import socket from "../../services/socket"
import { getUserIdFromToken } from '../../utils/jwtHelper';

export default function MessageInput() {
    const [msg, setMsg] = useState('');
    const { selectedChat } = useSelector(state => state.chat);

    const user = getUserIdFromToken();

    const handleSend = () => {
        console.log("💬 Gửi tin nhắn:", {
            chatId: selectedChat._id,
            senderId: user._id,
            message: msg
        });

        socket.emit('send_message', {
            chatId: selectedChat._id,
            senderId: user._id,
            message: msg
        });
        setMsg('');
    };
 
    return (
        <div className="p-4 border-t flex gap-2">
            <input
                type="text"
                className="flex-1 p-2 border rounded"
                placeholder="Nhập tin nhắn..."
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button
                onClick={handleSend}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Gửi
            </button>
        </div>
    );
}
