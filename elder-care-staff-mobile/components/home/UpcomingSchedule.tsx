import React from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { isToday } from "date-fns";
import useScheduleStore from "../../stores/scheduleStore";
import { formatTime } from "@/utils/dateHelper";

const UpcomingSchedule = () => {
  const { nearestSchedule, loading } = useScheduleStore();

  if (loading) {
    return (
      <View style={styles.upcomingRideContainer}>
        <ActivityIndicator size="small" color="#28a745" />
      </View>
    );
  }

  if (!nearestSchedule) {
    return (
      <View style={styles.upcomingRideContainer}>
        <View style={styles.rideDetailsCard}>
          <View style={styles.emptyCardContent}>
            <Ionicons
              name="calendar-outline"
              size={48}
              color="#ccc"
              style={{ marginBottom: 10 }}
            />
            <Text style={styles.emptyText}>Không có lịch sắp tới</Text>
          </View>
        </View>
      </View>
    );
  }

  const { avatar, serviceName, customerAddress, phoneNumber, schedule } =
    nearestSchedule;
  const timeSlotText = schedule.timeSlots?.[0]
    ? `${formatTime(schedule.timeSlots[0].start, "time")} - ${formatTime(
        schedule.timeSlots[0].end,
        "datetime"
      )}`
    : "Chưa rõ thời gian";

  const isTodaySchedule = schedule?.timeSlots?.[0]
    ? isToday(new Date(schedule.timeSlots[0].start))
    : false;

  const statusColor = isTodaySchedule ? "#28a745" : "#ffc107"; // xanh lá hoặc vàng

  return (
    <View style={styles.upcomingRideContainer}>
      <View style={styles.rideDetailsCard}>
        <View style={styles.riderInfo}>
          <Image
            source={
              avatar
                ? { uri: avatar }
                : require("../../assets/images/avatar.jpg")
            }
            style={styles.riderAvatar}
          />
          <Text style={styles.riderName}>{schedule.patientName}</Text>
          <View
            style={[styles.rideIdContainer, { backgroundColor: statusColor }]}
          >  
            <Text style={[styles.rideId, { color: "#ffffff" }]}>
              {schedule._id.slice(-4)}
            </Text>
          </View>
        </View>

        <View style={styles.addressContainer}>
          <MaterialIcons name="timer" size={16} color="#777" />
          <Text style={styles.addressText}>{timeSlotText}</Text>
        </View>

        <View style={styles.addressContainer}>
          <MaterialIcons name="medical-services" size={16} color="#777" />
          <Text style={styles.addressText}>{serviceName}</Text>
        </View>

        <View style={styles.addressContainer}>
          <Ionicons name="location" size={16} color="#777" />
          <Text style={styles.addressText}>{customerAddress}</Text>
        </View>

        <View style={styles.addressContainer}>
          <Ionicons name="call" size={16} color="#777" />
          <Text style={styles.addressText}>{phoneNumber}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  upcomingRideContainer: {
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  rideDetailsCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
  },
  riderInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  riderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  riderName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  rideIdContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  rideId: {
    fontWeight: "bold",
    fontSize: 14,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  addressText: {
    marginLeft: 5,
    color: "#555",
    fontSize: 14,
    flexShrink: 1,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
  emptyCardContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },
});

export default UpcomingSchedule;
