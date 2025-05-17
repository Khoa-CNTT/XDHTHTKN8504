// src/screens/ChatScreen.tsx
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
} from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { Ionicons, Feather } from "@expo/vector-icons";
import useScheduleStore from "../stores/scheduleStore";
import useAuthStore from "../stores/authStore";
import { useChatStore } from "../stores/chatStore";
import { useSocketStore } from "../stores/socketStore"; // ✅ dùng socket
import { RootStackParamList } from "../navigation/navigation";
import { ChatMessage } from "../stores/chatStore";


type ChatScreenRouteProp = RouteProp<RootStackParamList, "Chat">;

// --- Header component ---
const Header = ({ onBack, onCall, avatar, name }: any) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: "#28a745",
      borderBottomWidth: 1,
      borderBottomColor: "#eee",
      elevation: 2,
    }}
  >
    <TouchableOpacity onPress={onBack} style={{ paddingRight: 12 }}>
      <Ionicons name="arrow-back" size={24} color="#fff" />
    </TouchableOpacity>
    <Image
      source={
        avatar ? { uri: avatar } : require("../asset/img/unknownAvatar.png")
      }
      style={{ width: 36, height: 36, borderRadius: 18, marginRight: 10 }}
    />
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 16, fontWeight: "600", color: "#fff" }}>
        {name}
      </Text>
      <Text style={{ fontSize: 12, color: "#fff" }}>{"Đang trò chuyện"}</Text>
    </View>
    <TouchableOpacity onPress={onCall}>
      <Feather name="phone-call" size={22} color="#fff" />
    </TouchableOpacity>
  </View>
);

// --- Message bubble ---
const MessageBubble = ({
  isMe,
  avatar,
  message,
  timestamp,
}: {
  isMe: boolean;
  avatar?: string;
  message: string;
  timestamp: number;
}) => (
  <View
    style={{
      flexDirection: isMe ? "row-reverse" : "row",
      alignItems: "flex-end",
      marginBottom: 12,
    }}
  >
    {!isMe && (
      <Image
        source={
          avatar ? { uri: avatar } : require("../asset/img/unknownAvatar.png")
        }
        style={{ width: 28, height: 28, borderRadius: 14, marginRight: 8 }}
      />
    )}
    <View
      style={{
        backgroundColor: isMe ? "#28A745" : "#ffffff",
        padding: 10,
        borderRadius: 16,
        maxWidth: "75%",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <Text style={{ color: isMe ? "#fff" : "#000" }}>{message}</Text>
      <Text
        style={{
          fontSize: 10,
          color: isMe ? "#e0e0e0" : "#999",
          marginTop: 4,
          alignSelf: "flex-end",
        }}
      >
        {new Date(timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
    </View>
  </View>
);

// --- Input bar ---
const MessageInputBar = ({
  input,
  setInput,
  onSend,
}: {
  input: string;
  setInput: (text: string) => void;
  onSend: () => void;
}) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      borderTopWidth: 1,
      borderTopColor: "#ddd",
      paddingTop: 8,
      paddingBottom: 8,
      paddingHorizontal: 12,
      backgroundColor: "#fff",
    }}
  >
    <TextInput
      value={input}
      onChangeText={setInput}
      placeholder="Nhập tin nhắn..."
      style={{
        flex: 1,
        padding: 10,
        backgroundColor: "#fff",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#ddd",
      }}
    />
    <TouchableOpacity
      onPress={onSend}
      style={{
        backgroundColor: "#28A745",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
      }}
    >
      <Text style={{ color: "#fff", fontWeight: "bold" }}>Gửi</Text>
    </TouchableOpacity>
  </View>
);

// --- ChatScreen ---
const ChatScreen = () => {
  const route = useRoute<ChatScreenRouteProp>();
  const navigation = useNavigation();
  const scheduleID = route.params.scheduleId;

  const currentUser = useAuthStore((state) => state.user);
  const profile = useScheduleStore((state) =>
    state.getScheduleById(scheduleID)
  );

  // Lấy tin nhắn cho phòng chat, trả về undefined nếu không có
  const messagesForRoom = useChatStore((state) => {
    const msgs = state.messages[scheduleID];
    return msgs ? msgs : undefined;
  });

  // Mảng an toàn (không undefined)
  const messages = messagesForRoom ?? [];

  const [input, setInput] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);

  const { sendMessage } = useSocketStore();

  // Scroll xuống cuối khi có tin nhắn mới
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages.length]);

  // Gửi tin nhắn
  const handleSendMessage = () => {
    if (input.trim() === "") return;
    sendMessage(scheduleID, input.trim(), currentUser?._id || "");
    setInput("");
  };

  // Gọi điện thoại đến khách hàng
  const callCustomer = () => {
    const phone = profile?.staffPhone;
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    } else {
      alert("Không tìm thấy số điện thoại.");
    }
  };

  if (!scheduleID || !profile) {
    return (
      <View style={{ padding: 16 }}>
        <Text>Đang tải phòng trò chuyện...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: "#f9f9f9" }}
    >
      <Header
        onBack={() => navigation.goBack()}
        onCall={callCustomer}
        avatar={profile.staffAvatar}
        name={profile.staffFullName}
      />

      <View style={{ flex: 1, padding: 16 }}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              isMe={!msg.isReceived}
              avatar={profile.staffAvatar}
              message={msg.text}
              timestamp={new Date(msg.time).getTime()}
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

export default ChatScreen;
