import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    ArrowLeft,
    Send,
    Phone,
    MoreVertical,
    User,
    Circle,
    Clock,
    CheckCheck,
    AlertCircle,
    Paperclip,
    Smile
} from 'lucide-react';
import {
    sendMessage,
    markMessagesAsRead,
    clearUnreadCount
} from '../../store/chatSlice';
import socketService from '../../services/socket';

// Utility functions for date formatting
const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (messageDate.getTime() === today.getTime()) {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    } else if (messageDate.getTime() === yesterday.getTime()) {
        return `Yesterday ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' +
            date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    }
};

const ChatWindow = ({ chat, currentUser, onBack }) => {
    const dispatch = useDispatch();
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const [messageText, setMessageText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showChatInfo, setShowChatInfo] = useState(false);

    const {
        messages,
        isLoadingMessages,
        typingUsers,
        onlineUsers
    } = useSelector(state => state.chat);

    const chatMessages = messages[chat._id] || [];
    const otherParticipant = chat.participants.find(p => p._id !== currentUser._id);
    const isOtherUserOnline = onlineUsers.includes(otherParticipant?._id);
    const isOtherUserTyping = typingUsers[chat._id]?.includes(otherParticipant?._id);


    // Scroll to bottom when new messages arrive
    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    // Mark messages as read when chat opens
    useEffect(() => {
        if (chat._id && chatMessages.length > 0) {
            const unreadMessageIds = chatMessages
                .filter(msg => !msg.isRead && msg.senderId !== currentUser._id)
                .map(msg => msg._id);

            if (unreadMessageIds.length > 0) {
                dispatch(markMessagesAsRead({ chatId: chat._id, messageIds: unreadMessageIds }));
                socketService.markAsRead(chat._id, currentUser._id, unreadMessageIds);
            }

            dispatch(clearUnreadCount(chat._id));
        }
    }, [chat._id, chatMessages, currentUser._id, dispatch]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!messageText.trim()) return;

        const message = messageText.trim();
        setMessageText('');

        // Send via Socket.IO for real-time
        socketService.sendMessage(chat._id, currentUser._id, message);

        // Also dispatch to Redux for state management
        // dispatch(sendMessage({ chatId: chat._id, message }));

        // Stop typing indicator
        if (isTyping) {
            socketService.stopTyping(chat._id, currentUser._id);
            setIsTyping(false);
        }
    };

    const handleInputChange = (e) => {
        setMessageText(e.target.value);

        // Handle typing indicators
        if (!isTyping && e.target.value.length > 0) {
            setIsTyping(true);
            socketService.startTyping(chat._id, currentUser._id);
        } else if (isTyping && e.target.value.length === 0) {
            setIsTyping(false);
            socketService.stopTyping(chat._id, currentUser._id);
        }
    };

    const getRoleInfo = (role) => {
        const roleConfig = {
            admin: { color: 'text-red-600', label: 'Admin', bgColor: 'bg-red-50' },
            doctor: { color: 'text-blue-600', label: 'Doctor', bgColor: 'bg-blue-50' },
            nurse: { color: 'text-green-600', label: 'Nurse', bgColor: 'bg-green-50' },
            family_member: { color: 'text-purple-600', label: 'Family Member', bgColor: 'bg-purple-50' }
        };
        return roleConfig[role] || { color: 'text-gray-600', label: role, bgColor: 'bg-gray-50' };
    };

    const getChatTypeLabel = (chatType) => {
        const types = {
            'admin-staff': 'Admin & Staff Communication',
            'admin-family': 'Admin & Family Communication',
            'staff-family': 'Staff & Family Communication',
            'doctor-nurse': 'Medical Team Communication'
        };
        return types[chatType] || chatType;
    };

    const otherUserRole = getRoleInfo(otherParticipant?.role);

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white shadow-sm">
                <div className="flex items-center space-x-3">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                    )}

                    {/* User Avatar & Info */}
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold
                ${otherParticipant?.role === 'admin' ? 'bg-gradient-to-br from-red-500 to-red-600' :
                                    otherParticipant?.role === 'doctor' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                                        otherParticipant?.role === 'nurse' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                                            'bg-gradient-to-br from-purple-500 to-purple-600'}
              `}>
                                {otherParticipant?.name?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <div className={`
                absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-white rounded-full
                ${isOtherUserOnline ? 'bg-green-500' : 'bg-gray-400'}
              `}></div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900">
                                {otherParticipant?.name || 'Unknown User'}
                            </h3>
                            <div className="flex items-center space-x-2 text-sm">
                                <span className={`font-medium ${otherUserRole.color}`}>
                                    {otherUserRole.label}
                                </span>
                                <span className="text-gray-400">•</span>
                                <span className={`flex items-center ${isOtherUserOnline ? 'text-green-600' : 'text-gray-500'}`}>
                                    <Circle className={`w-2 h-2 mr-1 ${isOtherUserOnline ? 'fill-current' : ''}`} />
                                    {isOtherUserOnline ? 'Online' : 'Offline'}
                                </span>
                                {isOtherUserTyping && (
                                    <>
                                        <span className="text-gray-400">•</span>
                                        <span className="text-blue-600 text-xs">typing...</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                    <div className="text-right">
                        <div className="text-xs text-gray-500">
                            {getChatTypeLabel(chat.chatType)}
                        </div>
                        <div className="text-xs text-gray-400">
                            Chat ID: {chat._id.slice(-6)}
                        </div>
                    </div>

                    <button
                        onClick={() => setShowChatInfo(!showChatInfo)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {isLoadingMessages ? (
                    <div className="flex items-center justify-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                ) : chatMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                            <User className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-lg font-medium mb-2">Start the conversation</p>
                        <p className="text-sm text-center max-w-md">
                            This is the beginning of your conversation with {otherParticipant?.name}.
                            Send a message to get started.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {chatMessages.map((message, index) => {
                            const isCurrentUser = message.senderId === currentUser._id;
                            const showAvatar = index === chatMessages.length - 1 ||
                                chatMessages[index + 1]?.senderId !== message.senderId;

                            return (
                                <div
                                    key={message._id || index}
                                    className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} items-end space-x-2`}
                                >
                                    {!isCurrentUser && (
                                        <div className="w-8 h-8 flex-shrink-0">
                                            {showAvatar && (
                                                <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium
                          ${otherUserRole.bgColor.replace('bg-', 'bg-gradient-to-br from-').replace('-50', '-500 to-').replace('50', '600')}
                        `}>
                                                    {otherParticipant?.name?.charAt(0).toUpperCase() || '?'}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className={`
                    max-w-xs lg:max-w-md px-4 py-2 rounded-2xl
                    ${isCurrentUser
                                            ? 'bg-blue-500 text-white rounded-br-md'
                                            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md shadow-sm'
                                        }
                  `}>
                                        <p className="text-sm whitespace-pre-wrap break-words">
                                            {message.message}
                                        </p>

                                        <div className={`
                      flex items-center justify-end space-x-1 mt-1 text-xs
                      ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}
                    `}>
                                            <span>{formatMessageTime(message.timestamp)}</span>
                                            {isCurrentUser && (
                                                <div className="flex items-center">
                                                    {message.isRead ? (
                                                        <CheckCheck className="w-3 h-3" />
                                                    ) : (
                                                        <CheckCheck className="w-3 h-3 opacity-50" />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 bg-white p-4">
                <div onSubmit={handleSendMessage} className="flex items-end space-x-3">
                    <div className="flex-1">
                        <div className="relative">
                            <input
                                ref={inputRef}
                                type="text"
                                value={messageText}
                                onChange={handleInputChange}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}
                                placeholder={`Message ${otherParticipant?.name || 'user'}...`}
                                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                maxLength={1000}
                            />

                            {/* Typing indicator area */}
                            {isOtherUserTyping && (
                                <div className="absolute -top-8 left-4 text-xs text-gray-500 bg-white px-2 py-1 rounded shadow-sm border">
                                    {otherParticipant?.name} is typing...
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleSendMessage}
                        disabled={!messageText.trim()}
                        className={`
              p-3 rounded-full transition-all
              ${messageText.trim()
                                ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-md'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }
            `}
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Chat Info Panel (if shown) */}
            {showChatInfo && (
                <div className="absolute top-0 right-0 w-80 h-full bg-white border-l border-gray-200 shadow-lg z-10">
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">Chat Information</h3>
                            <button
                                onClick={() => setShowChatInfo(false)}
                                className="p-1 hover:bg-gray-100 rounded"
                            >
                                ×
                            </button>
                        </div>
                    </div>

                    <div className="p-4 space-y-4">
                        <div className="text-center">
                            <div className={`
                w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white font-bold text-xl mb-3
                ${otherUserRole.bgColor.replace('bg-', 'bg-gradient-to-br from-').replace('-50', '-500 to-').replace('50', '600')}
              `}>
                                {otherParticipant?.name?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <h4 className="font-semibold text-gray-900">{otherParticipant?.name}</h4>
                            <p className={`text-sm font-medium ${otherUserRole.color}`}>{otherUserRole.label}</p>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div>
                                <span className="text-gray-500">Status:</span>
                                <span className={`ml-2 ${isOtherUserOnline ? 'text-green-600' : 'text-gray-600'}`}>
                                    {isOtherUserOnline ? 'Online' : 'Offline'}
                                </span>
                            </div>

                            <div>
                                <span className="text-gray-500">Chat Type:</span>
                                <span className="ml-2 text-gray-900">{getChatTypeLabel(chat.chatType)}</span>
                            </div>

                            <div>
                                <span className="text-gray-500">Started:</span>
                                <span className="ml-2 text-gray-900">
                                    {new Date(chat.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatWindow;