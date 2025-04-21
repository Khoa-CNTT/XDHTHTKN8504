import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export interface Schedule {
  _id: string;
  patientName: string;
  date: string;
  timeSlots: { startTime: string; endTime: string }[];
  status: string;
}

interface ScheduleItemProps {
  schedule: Schedule;
  onPress?: () => void;
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({ schedule, onPress }) => {
  const { patientName, date, timeSlots, status } = schedule;

  // Ghép các khung giờ thành chuỗi: "08:00 - 10:00, 13:00 - 15:00"
  const time = timeSlots
    .map((slot) => `${slot.startTime} - ${slot.endTime}`)
    .join(", ");

  const formattedDate = new Date(date).toLocaleDateString("vi-VN");

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.time}>{time}</Text>
      <View style={styles.content}>
        <Text style={styles.title}>{patientName}</Text>
        <Text style={styles.date}>Ngày: {formattedDate}</Text>
        <Text
          style={[styles.status, statusStyles[status] || styles.defaultStatus]}
        >
          {status === "completed"
            ? "Hoàn thành"
            : status === "pending"
            ? "Đang chờ"
            : status === "cancelled"
            ? "Đã hủy"
            : status}
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
  date: {
    fontSize: 14,
    color: "#495057",
  },
  status: {
    fontSize: 14,
    fontWeight: "600",
  },
  defaultStatus: {
    color: "#6C757D",
  },
});

// Màu tương ứng theo trạng thái
const statusStyles: Record<string, any> = {
  completed: { color: "#28A745" },
  pending: { color: "#FFC107" },
  cancelled: { color: "#DC3545" },
};
