import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import {db}  from "../../../firebase/firebase"; 
import { useRouter } from "expo-router";

interface ChatItemProps {
  name: string;
  lastMessage: string;
  time: string;
  avatarSource: string;
  unreadCount?: number;
  receiverId: string; // Thêm receiverId để điều hướng đến chat chi tiết
}

const ChatItem: React.FC<ChatItemProps> = ({
  name,
  lastMessage,
  time,
  avatarSource,
  unreadCount,
  receiverId,
}) => {
  const router = useRouter();

  // Điều hướng đến màn hình chat cụ thể
  const goToChat = () => {
    router.push(`./${receiverId}`); 
  };

  return (
    <TouchableOpacity style={styles.chatItem} onPress={goToChat}>
      <Image source={{ uri: avatarSource }} style={styles.avatar} />
      <View style={styles.chatInfo}>
        <View style={styles.row}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
        <Text style={styles.lastMessage}>{lastMessage}</Text>
      </View>
      {unreadCount !== undefined && unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadCount}>{unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const ListChat: React.FC = () => {
  const [chatData, setChatData] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, "chats"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages: any[] = [];
      querySnapshot.forEach((doc) => {
        messages.push(doc.data());
      });
      setChatData(messages);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Feather
            name="search"
            size={20}
            color="#888"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search message..."
            placeholderTextColor="#888"
          />
        </View>
      </View>

      <ScrollView style={styles.chatListContainer}>
        {chatData.map((item, index) => (
          <ChatItem
            key={index}
            name={item.name || "User"}
            lastMessage={item.message}
            time={new Date(item.timestamp.seconds * 1000).toLocaleTimeString()}
            avatarSource="https://via.placeholder.com/50"
            receiverId={item.receiverId} // Truyền receiverId vào để điều hướng
          />
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 50, // Adjust for status bar if needed
    paddingBottom: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  chatListContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  chatInfo: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  time: {
    fontSize: 12,
    color: "#888",
  },
  lastMessage: {
    fontSize: 14,
    color: "#666",
  },
  unreadBadge: {
    backgroundColor: "#6200EE", // Example purple color
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  unreadCount: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  fab: {
    position: "absolute",
    bottom: 80, // Adjust as needed based on bottom navigation height
    left: "50%",
    marginLeft: -30,
    backgroundColor: "#6200EE", // Example purple color
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});

export default ListChat;
