import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyChats, setSelectedChat } from '../../store/chatSlice'

export default function ChatList() {
    const dispatch = useDispatch();
    const { chatList, selectedChatId } = useSelector(state => state.chat);

    useEffect(() => {
        dispatch(fetchMyChats());
    }, [dispatch]);

    console.log(chatList);    

    return (
        <div className="w-1/3 border-r overflow-y-auto h-screen">
            {chatList.map(chat => (
                <div
                    key={chat._id}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-100 ${selectedChatId === chat._id ? 'bg-gray-200' : ''}`}
                    onClick={() => dispatch(setSelectedChat(chat._id))}
                >
                    <p className="font-semibold">{chat.title}</p>
                    <p className="text-sm text-gray-500">
                        {chat.participants.map(p => p.name).join(', ')}
                    </p>
                </div>
            ))}
        </div>
    );
}
