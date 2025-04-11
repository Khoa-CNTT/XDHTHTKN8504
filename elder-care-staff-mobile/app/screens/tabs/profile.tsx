import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";

const menuItems = [
  { id: "1", icon: "person-outline", title: "Edit Profile" },
  { id: "2", icon: "heart-outline", title: "Working" },
  { id: "3", icon: "notifications-outline", title: "Notifications" },
  { id: "4", icon: "settings-outline", title: "Settings" },
  { id: "5", icon: "help-circle-outline", title: "Help and Support" },
  { id: "6", icon: "document-text-outline", title: "Terms and Conditions" },
  { id: "7", icon: "log-out-outline", title: "Log Out" },
];

export default function Profile() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>

      {/* Avatar */}
      <View style={styles.profileSection}>
        <Image
          source={require("../../../assets/images/avatar.jpg")}
          style={styles.avatar}
        />
        <Text style={styles.name}>Daniel Martinez</Text>
        <Text style={styles.phone}>+123 856479683</Text>
      </View>

      {/* Menu List */}
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/screens/income-screen")}
          >
            <Ionicons name={item.icon as any} size={20} color="#333" />
            <Text style={styles.menuText}>{item.title}</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#ccc" />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#28A745",
  },

  profileSection: { alignItems: "center", marginBottom: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  editIcon: {
    position: "absolute",
    bottom: 10,
    right: 140,
    backgroundColor: "#333",
    padding: 5,
    borderRadius: 50,
  },
  name: { fontSize: 18, fontWeight: "bold", marginTop: 10 },
  phone: { fontSize: 14, color: "gray" },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuText: { flex: 1, fontSize: 16, marginLeft: 10 },
});
