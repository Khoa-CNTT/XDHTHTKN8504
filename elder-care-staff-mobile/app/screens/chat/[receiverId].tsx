import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
} from "react-native";
import  {db}  from "../../../firebase/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";


const ChatScreen = ({ route }: { route: any }) => {
  const { receiverId } = route.params;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "chats"),
      where("receiverId", "==", receiverId),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newMessages: any[] = [];
      querySnapshot.forEach((doc) => {
        newMessages.push(doc.data());
      });
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [receiverId]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      await addDoc(collection(db, "chats"), {
        senderId: "user1", // Thay bằng ID người dùng thực tế
        receiverId,
        message,
        timestamp: serverTimestamp(),
      });
      setMessage("");
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.messageContainer}>
            <Text>
              {item.senderId}: {item.message}
            </Text>
            <Text>
              {new Date(item.timestamp.seconds * 1000).toLocaleTimeString()}
            </Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message"
          value={message}
          onChangeText={setMessage}
        />
        <Button title="Send" onPress={handleSendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    paddingLeft: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  messageContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 5,
  },
});

export default ChatScreen;
