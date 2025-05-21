import React from "react";
import { TouchableOpacity, View, Text, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Booking } from "@/types/Booking";

type BookingItemProps = {
  item: Booking;
  onPress: () => void;
};

const BookingItem = ({ item, onPress }: BookingItemProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        marginHorizontal: 16,
        marginVertical: 8,
        padding: 16,
        borderRadius: 12,
        backgroundColor: "#fff",
        elevation: 2,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Avatar + Tên */}
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Image
            source={{
              uri: item.profileId.avartar || "https://via.placeholder.com/48",
            }}
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              marginRight: 12,
              backgroundColor: "#eee",
            }}
          />
          <>
            <Text
              style={{ fontWeight: "bold", fontSize: 16 }}
              numberOfLines={1}
            >
              {`${item.profileId.firstName} ${item.profileId.lastName}`}
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 8,
              }}
            >
              <Text style={{ color: "#666" }}>
                {new Date(item.updatedAt).toLocaleDateString()}
              </Text>
              <Feather name="chevron-right" size={20} color="#999" />
            </View>
          </>
        </View>

        <Text style={{ color: "#28a745", fontWeight: "600" }}>
          {item.totalDiscount.toLocaleString()}đ
        </Text>
      </View>

      {/* Ngày và icon điều hướng */}
    </TouchableOpacity>
  );
};

export default BookingItem;
