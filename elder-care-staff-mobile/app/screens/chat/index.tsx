import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { ArrowLeft, Phone, Send } from "lucide-react-native";
import { router } from "expo-router";

type Message = {
  id: string;
  text: string;
  time: string;
  isReceived: boolean;
};

const ChatScreen = () => {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "1",
      text: "Speedy Chow. I'm just around the corner from your place. 😊",
      time: "10:10",
      isReceived: true,
    },
    {
      id: "2",
      text: "Awesome, thanks for letting me know! Can't wait for my delivery. 🌟",
      time: "10:11",
      isReceived: false,
    },
    {
      id: "3",
      text: "No problem at all!\nI'll be there in about 15 minutes.",
      time: "10:11",
      isReceived: true,
    },
    {
      id: "4",
      text: "I'll text you when I arrive.",
      time: "10:11",
      isReceived: true,
    },
  ]);

  const [newMessage, setNewMessage] = React.useState("");
  const scrollViewRef = useRef<ScrollView>(null);
  const animationValues = useRef<{ [key: string]: Animated.Value }>({}).current;

  const handleSend = () => {
    if (newMessage.trim() === "") return;

    const id = Date.now().toString();
    const newMsg: Message = {
      id,
      text: newMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isReceived: false,
    };

    animationValues[id] = new Animated.Value(0); // Khởi tạo animation cho tin nhắn mới

    setMessages((prev) => [...prev, newMsg]);
    setNewMessage("");

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Trigger animation
    setTimeout(() => {
      Animated.timing(animationValues[id], {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, 150);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 20}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={() => {router.back()}}>
            <ArrowLeft color="#fff" size={24} />
          </TouchableOpacity>
          <Text style={styles.contactName}>David Wayne</Text>
          <TouchableOpacity style={styles.headerButton}>
            <Phone
              color="#fff"
              size={24}
              style={{ transform: [{ rotate: "270deg" }] }}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {messages.map((message) => {
            const anim = animationValues[message.id] || new Animated.Value(1);
            return (
              <Animated.View
                key={message.id}
                style={{
                  transform: [
                    {
                      translateY: anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0], // Bay nhẹ từ dưới lên
                      }),
                    },
                  ],
                  opacity: anim,
                  marginBottom: 12,
                }}
              >
                <View
                  style={[
                    styles.messageBubble,
                    message.isReceived
                      ? styles.receivedBubble
                      : styles.sentBubble,
                  ]}
                >
                  <Text
                    style={
                      message.isReceived ? styles.receivedText : styles.sentText
                    }
                  >
                    {message.text}
                  </Text>
                  <Text
                    style={[
                      styles.time,
                      message.isReceived
                        ? styles.receivedTime
                        : styles.sentTime,
                    ]}
                  >
                    {message.time}
                  </Text>
                </View>
              </Animated.View>
            );
          })}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="iMessage"
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Send color="#fff" size={24} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#28A745",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "android" ? 40 : 0,
  },
  headerButton: { padding: 16 },
  contactName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  messagesContainer: { flex: 1 },
  messagesContent: { padding: 16 },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 18,
  },
  receivedBubble: {
    backgroundColor: "#f1f1f1",
    alignSelf: "flex-start",
    marginRight: "auto",
  },
  sentBubble: {
    backgroundColor: "#28A745",
    alignSelf: "flex-end",
    marginLeft: "auto",
  },
  receivedText: { color: "#000", fontSize: 18 },
  sentText: { color: "#fff", fontSize: 18 },
  time: { fontSize: 12, marginTop: 4, textAlign: "right" },
  receivedTime: { color: "#999" },
  sentTime: { color: "rgba(255, 255, 255, 0.7)" },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    backgroundColor: "#f9f9f9",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#28A745",
    borderRadius: 20,
    padding: 10,
  },
});

export default ChatScreen;
