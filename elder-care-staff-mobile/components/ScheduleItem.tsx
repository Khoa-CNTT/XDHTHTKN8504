import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { format } from "date-fns";
import { Schedule } from "@/types/Schedule";

const getStatusLabel = (status: string) => {
  const statusMap: Record<string, string> = {
    scheduled: "Đang lên lịch",
    pending: "Đang lên lịch",
    waiting: "Đang lên lịch",
    "in-progress": "Đang thực hiện",
    started: "Đang thực hiện",
    default: "Không thực hiện",
  };
  return statusMap[status] || statusMap["default"];
};

interface ScheduleItemProps {
  schedule: Schedule;
  onPress?: () => void;
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({ schedule, onPress }) => {
  const { _id, patientName, timeSlots, status, serviceName } = schedule;

  let time = "Chưa rõ thời gian";

  if (Array.isArray(timeSlots)) {
    time = timeSlots
      .map((slot) => {
        if (!slot.start || !slot.end) return null;
        try {
          const start = format(new Date(slot.start), "HH:mm");
          const end = format(new Date(slot.end), "HH:mm");
          return `${start} - ${end}`;
        } catch (err) {
          console.warn("Lỗi chuyển đổi ngày giờ:", slot, err);
          return null;
        }
      })
      .filter(Boolean)
      .join(", ");
  }

  const statusLabel = getStatusLabel(status);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.time}>{time}</Text>
      <View style={styles.content}>
        <Text style={styles.title}>{serviceName}</Text>
        {serviceName && (
          <Text style={styles.service}>Khách hàng: {patientName}</Text>
        )}
        <Text
          style={[styles.status, statusStyles[status] || styles.defaultStatus]}
        >
          {statusLabel}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ScheduleItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  time: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#28A745",
    width: 100,
    paddingRight: 15,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  service: {
    fontSize: 14,
    color: "#17A2B8",
  },
  status: {
    fontSize: 14,
    fontWeight: "600",
  },
  defaultStatus: {
    color: "#6C757D",
  },
});

const statusStyles: Record<string, any> = {
  "in-progress": { color: "#28A745" },
  scheduled: { color: "#FFC107" },
  pending: { color: "#FFC107" },
  waiting: { color: "#FFC107" },
};
