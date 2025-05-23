import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Linking,
  Animated,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";

import { useSocketStore } from "../stores/socketStore";
import useAuthStore from "../stores/authStore";
import { getChatDetail, sendNewChatMessage } from "../api/chatService";
import { ChatMessage } from "../types/Chat";
import { formatTime } from "../utils/dateHelper";
import { useRoute } from "@react-navigation/native";
import socket from "../utils/socket";
import { log } from "../utils/logger";

const Header = ({ onBack, onCall, avatar, name }: any) => (
  <View style={styles.headerContainer}>
    <TouchableOpacity onPress={onBack} style={styles.headerBackButton}>
      <Ionicons name="arrow-back" size={26} color="#28a745" />
    </TouchableOpacity>
    <Image
      source={
        avatar
          ? { uri: avatar }
          : require("../asset/img/hinh1.png")
      }
      style={styles.headerAvatar}
    />
    <View style={{ flex: 1 }}>
      <Text style={styles.headerTitle}>{name}</Text>
      <Text style={styles.headerSubtitle}>Đang trò chuyện</Text>
    </View>
    <TouchableOpacity onPress={onCall} style={styles.headerCallButton}>
      <Feather name="phone-call" size={24} color="#28a745" />
    </TouchableOpacity>
  </View>
);

const MessageBubble = ({
  isMe,
  avatar,
  message,
  timestamp,
}: {
  isMe: boolean;
  avatar?: string;
  message: string;
  timestamp: string;
}) => {
  return (
    <View
      style={[
        styles.messageContainer,
        isMe ? styles.messageContainerRight : styles.messageContainerLeft,
      ]}
    >
      {!isMe && (
        <Image
          source={avatar ? { uri: avatar } : require("../asset/img/hinh1.png")}
          style={styles.messageAvatar}
        />
      )}
      <View
        style={[
          styles.messageBubble,
          isMe ? styles.messageBubbleRight : styles.messageBubbleLeft,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isMe ? { color: "#fff" } : { color: "#222" },
          ]}
        >
          {message}
        </Text>
        <Text
          style={[
            styles.messageTime,
            isMe ? { color: "#ddd" } : { color: "#888" },
          ]}
        >
          {`${formatTime(timestamp, "datetime")}`}
        </Text>
      </View>
    </View>
  );
};

const MessageInputBar = ({
  input,
  setInput,
  onSend,
}: {
  input: string;
  setInput: (text: string) => void;
  onSend: () => void;
}) => (
  <View style={styles.inputBar}>
    <TextInput
      value={input}
      onChangeText={setInput}
      placeholder="Nhập tin nhắn..."
      placeholderTextColor="#999"
      style={styles.inputText}
      multiline
    />
    <TouchableOpacity onPress={onSend} style={styles.sendButton}>
      <Feather name="send" size={22} color="#fff" />
    </TouchableOpacity>
  </View>
);

const ChatScreen = () => {
  const router = useRouter();
  const route = useRoute();
  const { chatId, staffName, avatar, staffPhone } = route.params as {
    chatId: string;
    staffName: string;
    avatar?: string;
    staffPhone: string;
  };

  const currentUser = useAuthStore((state) => state.user);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const listener = async (payload: any) => {
      log("tin nhắn mới từ màn hình tin nhắn");

      const chatDetail = await getChatDetail(chatId);
      setMessages(chatDetail.messages || []);
    };
    socket.on("new_message", listener);
  }, []);
  useEffect(() => {
    if (!chatId) return;

    (async () => {
      try {
        const chatDetail = await getChatDetail(chatId);
        setMessages(chatDetail.messages || []);
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      } catch (error) {
        Alert.alert("Lỗi", "Không thể tải tin nhắn.");
        console.error(error);
      }
    })();
  }, [chatId]);

  // Xử lý gửi tin nhắn
  const handleSendMessage = async () => {
    if (!chatId || input.trim() === "") return;

    const message = input.trim();

    try {
      // Gọi API gửi tin nhắn mới
      const newMessage = await sendNewChatMessage(chatId, { message });

      // Thêm message mới vào local
      setMessages((prev) => [
        ...prev,
        {
          _id: newMessage._id || `${Date.now()}`, // đảm bảo có id
          message: newMessage.message,
          senderId: newMessage.senderId,
          time: newMessage.timestamp,
        },
      ]);

      setInput("");
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);

      // Nếu bạn vẫn muốn gửi qua socket (tùy backend) thì gọi thêm sendMessage ở đây
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể gửi tin nhắn");
      console.error("Lỗi gửi tin nhắn:", error);
    }
  };

  // Xử lý gọi điện
  const callCustomer = () => {
    if (!staffPhone) {
      Alert.alert("Lỗi", "Không tìm thấy số điện thoại.");
      return;
    }

    const telURL = `tel:${staffPhone}`;

    Linking.canOpenURL(telURL)
      .then((supported) => {
        if (supported) {
          Linking.openURL(telURL);
        } else {
          Alert.alert("Lỗi", "Không thể mở ứng dụng gọi điện.");
        }
      })
      .catch((err) => console.error("Lỗi khi gọi điện:", err));
  };

  if (!chatId) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ fontSize: 16, color: "#444" }}>
          Đang tải phòng trò chuyện...
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.screenContainer}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <Header
        onBack={() => {}}
        onCall={callCustomer}
        avatar={avatar}
        name={staffName || "Cuộc trò chuyện"}
      />

      <View style={styles.chatContainer}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((msg) => (
            <MessageBubble
              key={msg._id}
              isMe={msg.senderId === currentUser?._id}
              avatar={avatar}
              message={msg.message}
              timestamp={msg.timestamp || ""}
            />
          ))}
        </ScrollView>

        <MessageInputBar
          input={input}
          setInput={setInput}
          onSend={handleSendMessage}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: "#f0f2f5", paddingTop: 30},

  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomColor: "#2e7d32", // màu xanh mảnh
    borderBottomWidth: 1,
    backgroundColor: "transparent", // hoặc có thể bỏ dòng này
  },
  headerBackButton: {
    paddingRight: 12,
  },
  headerCallButton: {
    paddingLeft: 12,
    padding: 6,
  },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2e7d32",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#2e7d32",
    marginTop: 2,
  },

  chatContainer: { flex: 1, paddingHorizontal: 16, paddingBottom: 12 },
  messagesContent: { paddingVertical: 12 },

  messageContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 12,
  },
  messageContainerRight: { justifyContent: "flex-end", alignSelf: "flex-end" },
  messageContainerLeft: {
    justifyContent: "flex-start",
    alignSelf: "flex-start",
  },

  messageAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  messageBubble: {
    maxWidth: "75%",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  messageBubbleRight: {
    backgroundColor: "#4caf50",
    borderTopRightRadius: 0,
  },
  messageBubbleLeft: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 0,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
    alignSelf: "flex-end",
  },

  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    marginTop: 6,
  },
  inputText: {
    flex: 1,
    maxHeight: 120,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: "#222",
  },
  sendButton: {
    backgroundColor: "#2e7d32",
    borderRadius: 25,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChatScreen;
