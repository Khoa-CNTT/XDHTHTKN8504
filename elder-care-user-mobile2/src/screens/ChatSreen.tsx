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
  Linking
} from "react-native";
import { useRouter } from "expo-router";
import { useSocketStore } from "../stores/socketStore";
import useScheduleStore from "../stores/scheduleStore";
import useAuthStore from "../stores/authStore";
import { Ionicons, Feather } from "@expo/vector-icons"; // Expo icon library


const ChatScreen = () => {
  const router = useRouter();
  const { messages, sendMessage } = useSocketStore();
  const currentUser = useAuthStore((state) => state.user);
  const profile = useScheduleStore((state) => state.schedule);


  const roomId = profile._id;
  const roomMessages = roomId ? messages[roomId] || [] : [];
  const [input, setInput] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSendMessage = () => {
    if (roomId && input.trim() !== "") {
      sendMessage(roomId, input.trim());
      setInput("");
    }
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [roomMessages.length]);

  const callCustomer = () => {
     Linking.openURL(`tel:${profile?.staffPhone}`).catch((err) =>
       console.error("Failed to make a call", err)
     );
  
  };

  if (!roomId || !profile) {
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
      {/* Header */}
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
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ paddingRight: 12 }}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        {profile.staffAvatar ? (
          <Image
            source={{ uri: profile.staffAvatar }}
            style={{ width: 36, height: 36, borderRadius: 18, marginRight: 10 }}
          />
        ) : (
          <Image
            source={require("../asset/img/unknownAvatar.png")}
            style={{ width: 28, height: 28, borderRadius: 14, marginRight: 8 }}
          />
        )}

        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: "600", color: "#fff" }}>
            {profile.staffFullName}
          </Text>
          <Text style={{ fontSize: 12, color: "#fff" }}>{"Không có SĐT"}</Text>
        </View>

        <TouchableOpacity onPress={callCustomer}>
          <Feather name="phone-call" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Nội dung chat */}
      <View style={{ flex: 1, padding: 16 }}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {roomMessages.map((msg, idx) => {
            const isMe = msg.senderId === currentUser?._id;
            return (
              <View
                key={idx}
                style={{
                  flexDirection: isMe ? "row-reverse" : "row",
                  alignItems: "flex-end",
                  marginBottom: 12,
                }}
              >
                {!isMe && (
                  <Image
                    source={{ uri: profile.staffAvatar }}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      marginRight: 8,
                    }}
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
                  <Text style={{ color: isMe ? "#fff" : "#000" }}>
                    {msg.message}
                  </Text>
                  <Text
                    style={{
                      fontSize: 10,
                      color: isMe ? "#e0e0e0" : "#999",
                      marginTop: 4,
                      alignSelf: "flex-end",
                    }}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            borderTopWidth: 1,
            borderTopColor: "#ddd",
            paddingTop: 8,
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
            onPress={handleSendMessage}
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
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;
