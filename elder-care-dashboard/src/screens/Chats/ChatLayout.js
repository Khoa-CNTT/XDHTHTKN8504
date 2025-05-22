import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchMyChats,
  setCurrentChat,
  clearCurrentChat,
  fetchChatMessages
} from '../../store/chatSlice';
import socketService from '../../services/socket';
import ChatSideBar from './ChatSideBar'
import ChatWindow from './ChatWindow';
import NewChatModal from './NewChatModal';
import { MessageCircle, Plus } from 'lucide-react';
import Layout from '../../Layout';

const ChatLayout = () => {
  const dispatch = useDispatch();
  const { chats, currentChat, isLoading } = useSelector(state => state.chat);
  const [user] = useState(() => JSON.parse(localStorage.getItem("user")));

  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    // Check if mobile view
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    checkMobileView();
    window.addEventListener('resize', checkMobileView);

    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

  useEffect(() => {
    if (user?._id) {
      // Connect to socket
      socketService.connect(user._id);

      // Fetch user's chats
      dispatch(fetchMyChats());
    }

    return () => {
      socketService.disconnect();
    };
  }, [dispatch, user]);

  const handleChatSelect = async (chat) => {
    dispatch(setCurrentChat(chat));

    // Fetch messages for the selected chat
    dispatch(fetchChatMessages({ chatId: chat._id }));

    // Join the chat room via socket
    socketService.joinChat(chat._id);
  };

  const handleBackToList = () => {
    dispatch(clearCurrentChat());
  };

  const handleNewChat = () => {
    setShowNewChatModal(true);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Please login to access chat</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="flex h-screen bg-white">
        {/* Sidebar - Hidden on mobile when chat is selected */}
        <div className={`
        ${isMobileView && currentChat ? 'hidden' : 'block'}
        ${isMobileView ? 'w-full' : 'w-80'}
        bg-white border-r border-gray-200 flex flex-col
      `}>
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-gray-900">Chats</h1>
              <button
                onClick={handleNewChat}
                className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                title="New Chat"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-hidden">
            <ChatSideBar
              chats={chats}
              currentChat={currentChat}
              onChatSelect={handleChatSelect}
              isLoading={isLoading}
              currentUser={user}
            />
          </div>
        </div>

        {/* Main Chat Area */}
        <div className={`
        ${isMobileView && !currentChat ? 'hidden' : 'flex-1'}
        flex flex-col
      `}>
          {currentChat ? (
            <ChatWindow
              chat={currentChat}
              currentUser={user}
              onBack={isMobileView ? handleBackToList : null}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <MessageCircle className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Welcome to Chat
                </h3>
                <p className="text-gray-500 max-w-sm">
                  Select a chat from the sidebar to start messaging, or create a new chat to begin a conversation.
                </p>
                <button
                  onClick={handleNewChat}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Start New Chat
                </button>
              </div>
            </div>
          )}
        </div>

        {/* New Chat Modal */}
        {showNewChatModal && (
          <NewChatModal
            onClose={() => setShowNewChatModal(false)}
            currentUser={user}
          />
        )}
      </div>
    </Layout>
  );
};

export default ChatLayout;