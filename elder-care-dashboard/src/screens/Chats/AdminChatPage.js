import React from 'react';
import ChatList from ".././Chats/ChatList";
import ChatWindow from ".././Chats/ChatWindow"
import MessageInput from ".././Chats/MessageInput"
import Layout from "../../Layout"

export default function AdminChatPage() {
  return (
    <Layout>
      <div className="flex h-screen">
        <ChatList />
        <div className="flex flex-col flex-1">
          <ChatWindow />
          <MessageInput />
        </div>
      </div>
    </Layout>
  );
}
