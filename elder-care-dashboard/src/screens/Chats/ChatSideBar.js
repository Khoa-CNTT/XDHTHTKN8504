import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Search, Circle, Phone, User, UserCheck, Heart } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const ChatSidebar = ({ chats, currentChat, onChatSelect, isLoading, currentUser }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all'); // all, admin-staff, admin-family, staff-family
    const { onlineUsers, unreadCounts } = useSelector(state => state.chat);

    // Filter chats based on search term and type
    const filteredChats = chats.filter(chat => {
        // Filter by search term
        const otherParticipant = chat.participants.find(p => p._id !== currentUser._id);
        const matchesSearch =
            (typeof otherParticipant?.name === 'string' && otherParticipant.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (typeof chat.title === 'string' && chat.title.toLowerCase().includes(searchTerm.toLowerCase()));


        // Filter by chat type
        const matchesType = filterType === 'all' || chat.chatType === filterType;

        return matchesSearch && matchesType;
    });

    const getChatDisplayInfo = (chat) => {
        // Find the other participant (not current user)
        const otherParticipant = chat.participants.find(p => p._id !== currentUser._id);

        const displayName = otherParticipant?.name || chat.title || 'Unknown User';
        const isOnline = onlineUsers.includes(otherParticipant?._id);

        // Get last message info
        const lastMessage = chat.messages?.[0];
        let lastMessageText = 'No messages yet';
        let lastMessageTime = '';

        if (lastMessage) {
            lastMessageText = lastMessage.message.length > 45
                ? lastMessage.message.substring(0, 45) + '...'
                : lastMessage.message;

            lastMessageTime = formatDistanceToNow(new Date(lastMessage.timestamp), { addSuffix: true });
        }

        const unreadCount = unreadCounts[chat._id] || 0;

        return {
            displayName,
            isOnline,
            lastMessageText,
            lastMessageTime,
            unreadCount,
            otherParticipant
        };
    };

    const getRoleInfo = (role) => {
        const roleConfig = {
            admin: {
                color: 'bg-red-100 text-red-700 border-red-200',
                label: 'Admin',
                icon: UserCheck
            },
            doctor: {
                color: 'bg-blue-100 text-blue-700 border-blue-200',
                label: 'Doctor',
                icon: User
            },
            nurse: {
                color: 'bg-green-100 text-green-700 border-green-200',
                label: 'Nurse',
                icon: Heart
            },
            family_member: {
                color: 'bg-purple-100 text-purple-700 border-purple-200',
                label: 'Family',
                icon: User
            }
        };
        return roleConfig[role] || {
            color: 'bg-gray-100 text-gray-700 border-gray-200',
            label: role,
            icon: User
        };
    };

    const getChatTypeInfo = (chatType) => {
        const typeConfig = {
            'admin-staff': { label: 'Admin ↔ Staff', color: 'text-blue-600' },
            'admin-family': { label: 'Admin ↔ Family', color: 'text-purple-600' },
            'staff-family': { label: 'Staff ↔ Family', color: 'text-green-600' },
            // 'doctor-nurse': { label: 'Doctor ↔ Nurse', color: 'text-orange-600' }
        };
        return typeConfig[chatType] || { label: chatType, color: 'text-gray-600' };
    };

    const getFilterOptions = () => [
        { value: 'all', label: 'All Chats', count: chats.length },
        { value: 'admin-staff', label: 'Admin ↔ Staff', count: chats.filter(c => c.chatType === 'admin-staff').length },
        { value: 'admin-family', label: 'Admin ↔ Family', count: chats.filter(c => c.chatType === 'admin-family').length },
        { value: 'staff-family', label: 'Staff ↔ Family', count: chats.filter(c => c.chatType === 'staff-family').length },
        // { value: 'doctor-nurse', label: 'Doctor ↔ Nurse', count: chats.filter(c => c.chatType === 'doctor-nurse').length }
    ];

    if (isLoading) {
        return (
            <div className="p-4">
                <div className="animate-pulse space-y-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="flex items-center space-x-3 p-3">
                            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* Search Bar */}
            <div className="p-4 bg-white border-b border-gray-200">
                <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all"
                    />
                </div>

                {/* Filter Tabs */}
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                    {getFilterOptions().map(option => (
                        <button
                            key={option.value}
                            onClick={() => setFilterType(option.value)}
                            className={`
                flex-1 px-2 py-1.5 text-xs font-medium rounded-md transition-all text-center
                ${filterType === option.value
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                }
              `}
                        >
                            {option.label}
                            {option.count > 0 && (
                                <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${filterType === option.value ? 'bg-blue-100' : 'bg-gray-200'
                                    }`}>
                                    {option.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
                {filteredChats.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Search className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="font-medium">{searchTerm ? 'No conversations found' : 'No conversations yet'}</p>
                        <p className="text-sm mt-1">
                            {searchTerm ? 'Try adjusting your search terms' : 'Start a new conversation to begin'}
                        </p>
                    </div>
                ) : (
                    <div className="p-2 space-y-1">
                        {filteredChats.map(chat => {
                            const {
                                displayName,
                                isOnline,
                                lastMessageText,
                                lastMessageTime,
                                unreadCount,
                                otherParticipant
                            } = getChatDisplayInfo(chat);

                            const isSelected = currentChat?._id === chat._id;
                            const roleInfo = getRoleInfo(otherParticipant?.role);
                            const chatTypeInfo = getChatTypeInfo(chat.chatType);
                            const RoleIcon = roleInfo.icon;

                            return (
                                <div
                                    key={chat._id}
                                    onClick={() => onChatSelect(chat)}
                                    className={`
                    p-3 rounded-lg cursor-pointer transition-all duration-200 border
                    ${isSelected
                                            ? 'bg-blue-50 border-blue-200 shadow-sm'
                                            : 'bg-white border-gray-100 hover:bg-gray-50 hover:border-gray-200'
                                        }
                  `}
                                >
                                    <div className="flex items-start space-x-3">
                                        {/* Avatar with role indicator */}
                                        <div className="relative flex-shrink-0">
                                            <div className={`
                        w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold text-sm
                        ${otherParticipant?.role === 'admin' ? 'bg-gradient-to-br from-red-500 to-red-600' :
                                                    otherParticipant?.role === 'doctor' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                                                        otherParticipant?.role === 'nurse' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                                                            'bg-gradient-to-br from-purple-500 to-purple-600'}
                      `}>
                                                {displayName.charAt(0).toUpperCase()}
                                            </div>

                                            {/* Online/Offline indicator */}
                                            <div className={`
                        absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 border-2 border-white rounded-full
                        ${isOnline ? 'bg-green-500' : 'bg-gray-400'}
                      `}></div>

                                            {/* Role icon */}
                                            <div className={`
                        absolute -top-1 -left-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center
                        ${roleInfo.color}
                      `}>
                                                <RoleIcon className="w-2.5 h-2.5" />
                                            </div>
                                        </div>

                                        {/* Chat Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="font-semibold text-gray-900 text-sm truncate">
                                                    {displayName}
                                                </h4>
                                                {lastMessageTime && (
                                                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                                                        {lastMessageTime}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <p className="text-xs text-gray-600 truncate flex-1">
                                                    {lastMessageText}
                                                </p>
                                                {unreadCount > 0 && (
                                                    <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full ml-2 flex-shrink-0">
                                                        {unreadCount > 99 ? '99+' : unreadCount}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Chat type and role info */}
                                            <div className="flex items-center justify-between mt-2">
                                                <span className={`text-xs font-medium ${chatTypeInfo.color}`}>
                                                    {chatTypeInfo.label}
                                                </span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full border ${roleInfo.color}`}>
                                                    {roleInfo.label}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatSidebar;
