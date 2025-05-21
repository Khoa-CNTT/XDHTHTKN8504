import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMessages, markAsRead } from '../../store/chatSlice'

export default function ChatWindow() {
    const dispatch = useDispatch();
    const { selectedChat, messages } = useSelector(state => state.chat);
    const bottomRef = useRef();

    useEffect(() => {
        if (selectedChat?._id) {
            dispatch(fetchMessages(selectedChat._id));
        }
    }, [selectedChat?._id]);

    useEffect(() => {
        if (selectedChat?._id && messages.length) {
            const unreadIds = messages.filter(m => !m.isRead).map(m => m._id);
            if (unreadIds.length) {
                dispatch(markAsRead({ chatId: selectedChat._id, messageIds: unreadIds }));
            }
        }
    }, [messages]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex-1 p-4 flex flex-col h-screen overflow-y-auto">
            {messages.map(msg => (
                <div key={msg._id} className={`mb-2 ${msg.senderId === selectedChat?.currentUserId ? 'text-right' : 'text-left'}`}>
                    <div className="inline-block px-4 py-2 bg-blue-100 rounded">
                        {msg.message}
                    </div>
                </div>
            ))}
            <div ref={bottomRef} />
        </div>
    );
}
