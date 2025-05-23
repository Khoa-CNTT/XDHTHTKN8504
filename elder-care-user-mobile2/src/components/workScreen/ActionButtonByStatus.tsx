import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { ScheduleStatus } from "../../types/ScheduleStatus";

type Props = {
  status: ScheduleStatus;
  onUpdate: (newStatus: ScheduleStatus) => void;
  loading?: boolean; // 👈 thêm dòng này
};


const ActionButtonByStatus: React.FC<Props> = ({ status, onUpdate }) => {
  const getContent = (): [string, (() => void)?] => {
    switch (status) {
      case "scheduled":
        return ["Lịch chưa tới thời gian thực hiện"];
      case "waiting_for_client":
        return ["Sẵn sàng", () => onUpdate("waiting_for_nurse")];
      case "waiting_for_nurse":
      case "on_the_way":
        return ["Nhân viên đang trên đường tới"];
      case "check_in":
        return ["Nhân viên đã tới"];
      case "in_progress":
        return ["Đang chăm sóc"];
      case "check_out":
        return ["Xác nhận hoàn thành", () => onUpdate("completed")];
      case "completed":
        return ["Về màn hình chính"];
      case "cancelled":
        return ["Kết thúc chăm sóc"];
      default:
        return ["Trở về màn hình chính"];
    }
  };

  const [label, action] = getContent();

  return (
    <TouchableOpacity style={styles.button} onPress={action} disabled={!action}>
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 20,
  },
  text: {
    padding: 14,
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default ActionButtonByStatus;
