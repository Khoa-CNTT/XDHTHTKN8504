import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { format } from "date-fns";
import { Schedule } from "@/types/Schedule";

// Hàm chuyển đổi thời gian từ UTC sang giờ Việt Nam
const toVietnamDate = (isoString: string): Date => {
  const date = new Date(isoString);
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  return new Date(utc + 7 * 60 * 60000); // Thêm 7 giờ để chuyển sang múi giờ Việt Nam
};

// Hàm xử lý trạng thái
const getStatusLabel = (status: string) => {
  const statusMap: Record<string, string> = {
    "scheduled": "Đang lên lịch",
    "pending": "Đang lên lịch",
    "waiting": "Đang lên lịch",
    "in-progress": "Đang thực hiện",
    "started": "Đang thực hiện",
    "default": "Không thực hiện",
  };
  return statusMap[status] || statusMap["default"];
};

interface ScheduleItemProps {
  schedule: Schedule;
  onPress?: () => void;
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({ schedule, onPress }) => {
  const { patientName, date, timeSlots, status } = schedule;

  // Ghép các khung giờ thành chuỗi: "08:00 - 10:00, 13:00 - 15:00"
  const time = timeSlots
    .map((slot) => `${format(toVietnamDate(slot.startTime), "HH:mm")} - ${format(toVietnamDate(slot.endTime), "HH:mm")}`)
    .join(", ");

  // Dùng date-fns để format ngày thành định dạng "dd/MM/yyyy"
  const formattedDate = format(toVietnamDate(date), "dd/MM/yyyy");

  // Lấy nhãn trạng thái
  const statusLabel = getStatusLabel(status);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.time}>{time}</Text>
      <View style={styles.content}>
        <Text style={styles.title}>{patientName}</Text>
        <Text style={styles.date}>Ngày: {formattedDate}</Text>
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
  "in-progress": { color: "#28A745" }, // Đang thực hiện
  scheduled: { color: "#FFC107" }, // Đang lên lịch
  pending: { color: "#FFC107" }, // Đang lên lịch
  waiting: { color: "#FFC107" }, // Đang lên lịch
};
