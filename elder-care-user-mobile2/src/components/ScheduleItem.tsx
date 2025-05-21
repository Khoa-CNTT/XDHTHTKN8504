import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { formatTime } from "../utils/dateHelper";
import { Schedule } from "../types/schedule";

const getStatusLabel = (status: string) => {
  const statusMap: Record<string, string> = {
    scheduled: "Đang lên lịch",
    waiting_for_client: "Chờ bạn xác nhận",
    waiting_for_nurse: "Chờ nhân viên xác nhận",
    on_the_way: "Nhân viên đang di chuyển",
    check_in: "Nhân viên đã đến nơi",
    in_progress: "Đang thực hiện chăm sóc",
    check_out: "Đã hoàn tất, chờ xác nhận",
    completed: "Ca chăm sóc đã hoàn tất",
    canceled: "Bị hủy",
    default: "Không thực hiện",
  };
  return statusMap[status] || statusMap["default"];
};

const statusStyles: Record<string, any> = {
  in_progress: { color: "#28A745" },
  scheduled: { color: "#FFC107" },
  waiting_for_client: { color: "#FFC107" },
  waiting_for_nurse: { color: "#28A745" },
  on_the_way: { color: "#28A745" },
  check_in: { color: "#28A745" },
  check_out: { color: "#28A745" },
  completed: { color: "#28A745" },
  canceled: { color: "#DC3545" },
  default: { color: "#6C757D" },
};

export type ScheduleUser = Schedule & {
  staffFullName: string;
  staffPhone: string;
  staffAvatar?: string;
};

interface ScheduleItemProps {
  schedule: ScheduleUser;
  onPress?: () => void;
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({ schedule, onPress }) => {
  const status = schedule.status;
  const statusLabel = getStatusLabel(status);

  let time = "Chưa rõ thời gian";
  if (Array.isArray(schedule.timeSlots)) {
    time = schedule.timeSlots
      .map((slot) => {
        if (!slot.start || !slot.end) return null;
        try {
          const start = formatTime(new Date(slot.start), "time");
          const end = formatTime(new Date(slot.end), "time");
          return `${start}  ${end}`;
        } catch (err) {
          console.warn("Lỗi chuyển đổi ngày giờ:", slot, err);
          return null;
        }
      })
      .filter(Boolean)
      .join(", ");
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.time}>{time}</Text>
      <View style={styles.content}>
        <Text style={styles.title}>{schedule.serviceName}</Text>
        <Text style={styles.service}>Nhân viên: {schedule.staffFullName}</Text>
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
