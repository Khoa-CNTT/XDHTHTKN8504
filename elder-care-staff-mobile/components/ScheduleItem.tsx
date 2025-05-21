import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { format } from "date-fns";
import { Schedule } from "@/types/Schedule";
import { Clock, User, Info, BadgeCheck} from "lucide-react-native";
import { formatTime } from "@/utils/dateHelper";


const getStatusLabel = (status: string) => {
  const statusMap: Record<string, string> = {
    scheduled: "Đang lên lịch",
    waiting_for_client: "Chờ bạn xác nhận",
    waiting_for_nurse: "Chờ nhân viên xác nhận",
    on_the_way: "Nhân viên đang di chuyển",
    check_in: "Nhân viên đã đến nơi",
    in_progress: "Đang chăm sóc",
    check_out: "Hoàn tất, chờ xác nhận",
    completed: "Đã hoàn tất",
    canceled: "Lịch bị hủy",
    default: "Không rõ trạng thái",
  };
  return statusMap[status] || statusMap["default"];
};

const statusStyles: Record<string, any> = {
  in_progress: { color: "#34D399" },
  scheduled: { color: "#FBBF24" },
  waiting_for_client: { color: "#FBBF24" },
  waiting_for_nurse: { color: "#34D399" },
  on_the_way: { color: "#34D399" },
  check_in: { color: "#34D399" },
  check_out: { color: "#34D399" },
  completed: { color: "#10B981" },
  cancelled: { color: "#EF4444" },
  default: { color: "#9CA3AF" },
};

interface ScheduleItemProps {
  schedule: Schedule;
  onPress?: () => void;
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({ schedule, onPress }) => {
  const { patientName, timeSlots, status, serviceName } = schedule;

  let time = "Chưa rõ thời gian";
  if (Array.isArray(timeSlots)) {
    time = timeSlots
      .map((slot) => {
        if (!slot.start || !slot.end) return null;
        try {
          const start = formatTime(slot.start,'time');
          const end = formatTime(slot.end, "time");
          return `${start} ${end}`;
        } catch {
          return null;
        }
      })
      .filter(Boolean)
      .join(", ");
  }

  const statusLabel = getStatusLabel(status);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.leftSection}>
        {/* <BadgeCheck size={20} color="#6B7280" /> */}
        <Text style={styles.time}>{time}</Text>
      </View>

      <View style={styles.rightSection}>
        <Text style={styles.title}>{serviceName}</Text>
        <View style={styles.row}>
          <User size={16} color="#3B82F6" />
          <Text style={styles.text}> {patientName}</Text>
        </View>
        <View style={styles.row}>
          <BadgeCheck
            size={16}
            color={statusStyles[status]?.color || "#9CA3AF"}
          />
          <Text
            style={[
              styles.status,
              { color: statusStyles[status]?.color || "#9CA3AF" },
            ]}
          >
            {" "}
            {statusLabel}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ScheduleItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 5,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  leftSection: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    width: 80,
  },
  time: {
    fontSize: 18,
    fontWeight: "600",
    color: "#28A745",
    marginTop: 4,
  },
  rightSection: {
    flex: 1,
    justifyContent: "center",
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  text: {
    fontSize: 14,
    color: "#374151",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  status: {
    fontSize: 14,
    fontWeight: "600",
  },
});
