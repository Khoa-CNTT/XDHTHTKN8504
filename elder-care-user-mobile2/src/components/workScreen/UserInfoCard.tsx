import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

type Props = {
  name: string;
  phone: string;
  avatarUrl?: string;
};

const UserInfoCard: React.FC<Props> = ({ name, phone, avatarUrl }) => {
  return (
    <View style={styles.userInfo}>
      <Image
        source={{ uri: avatarUrl || "https://via.placeholder.com/40" }}
        style={styles.avatar}
      />
      <View>
        <Text style={styles.userName}>{name}</Text>
        <Text style={styles.phone}>{phone}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  phone: {
    fontSize: 14,
    color: "gray",
  },
});

export default UserInfoCard;
