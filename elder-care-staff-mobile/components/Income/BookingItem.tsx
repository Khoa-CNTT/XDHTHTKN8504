import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { CompletedBooking } from "@/types/CompletedBooking"; 
import { formatTime } from "../../utils/dateHelper"; 
type BookingItemProps = {
  item: CompletedBooking;
  onPress?: () => void;
};

const BookingItem: React.FC<BookingItemProps> = ({ item, onPress}) => {
  return (
    <TouchableOpacity style={styles.Item} onPress={onPress}>
      {/* Nếu có avatar, bỏ comment và sử dụng */}
      {/* <Image source={{ uri: item.avatar }} style={styles.avatar} /> */}
      <View style={styles.Details}>
        <Text style={styles.Name}>{item.serviceName} </Text>
        <Text style={styles.Meta}>{item.patientName}</Text>
        <Text style={styles.salary}>{item.salary} VND</Text>
      </View>
      <Text style={styles.timeInfo}>
        {formatTime(item.completedAt, "datetime")}{" "}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  Item: {
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 18,
  },
  Details: {
    flex: 1,
  },
  Name: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  Meta: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },
  salary: {
    fontSize: 14,
    color: "#FFC107",
    marginTop: 4,
  },
  timeInfo: {
    fontSize: 13,
    color: "#888",
  },
});

export default BookingItem;
