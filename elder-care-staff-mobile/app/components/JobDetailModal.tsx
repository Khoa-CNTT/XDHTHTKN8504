import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Modal from "react-native-modal";

type Customer = {
  avatar: string;
  name: string;
  age: number;
  phone: string;
  address: string;
  note?: string;
};

type Job = {
  customer: Customer;
  date: string;
  time: string;
  duration: number;
  description: string;
  status: string;
  salary: number;
  startDate: string;
  endDate: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  job: Job | null;
};

const JobDetailModal: React.FC<Props> = ({ visible, onClose, job }) => {
  if (!job) return null;

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      animationIn="slideInUp"
      animationOut="slideOutDown"
      style={styles.modal}
    >
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Chi tiết công việc</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} />
            </TouchableOpacity>
          </View>

          {/* Thông tin khách hàng */}
          <View style={styles.section}>
            <View style={styles.row}>
              <Image
                source={{ uri: job.customer.avatar }}
                style={styles.avatar}
              />
              <View style={styles.customerInfo}>
                <Text style={styles.name}>{job.customer.name}</Text>
                <Text style={styles.age}>{job.customer.age} tuổi</Text>
                <Text style={styles.phone}>📞 {job.customer.phone}</Text>
                <Text style={styles.address}>📍 {job.customer.address}</Text>
              </View>
            </View>
            {job.customer.note && (
              <Text style={styles.note}>📝 Ghi chú: {job.customer.note}</Text>
            )}
          </View>

          {/* Thông tin công việc */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin công việc</Text>
            <Text>📅 Ngày làm: {job.date}</Text>
            <Text>🕒 Thời gian: {job.time}</Text>
            <Text>⏱️ Thời lượng: {job.duration} giờ</Text>
            <Text>🔧 Mô tả: {job.description}</Text>
            <Text>💰 Lương: {job.salary.toLocaleString()} VND</Text>
            <Text>📆 Bắt đầu: {job.startDate}</Text>
            <Text>📆 Kết thúc: {job.endDate}</Text>
          </View>

          {/* Trạng thái và hành động */}
          <View style={styles.section}>
            <Text style={styles.status}>Trạng thái: {job.status}</Text>

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Bắt đầu công việc</Text>
            </TouchableOpacity>

            <View style={styles.actions}>
              <TouchableOpacity>
                <Text style={styles.link}>📍 Xem đường đi</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.link}>📝 Gửi báo cáo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default JobDetailModal;

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  container: {
    height: "85%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
  },
  content: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  section: {
    marginVertical: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 12,
  },
  customerInfo: {
    flex: 1,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
  age: {
    fontSize: 14,
  },
  phone: {
    fontSize: 14,
    color: "gray",
  },
  address: {
    fontSize: 14,
    color: "gray",
  },
  note: {
    marginTop: 8,
    fontStyle: "italic",
    color: "#555",
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  status: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#007bff",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    marginVertical: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 12,
  },
  link: {
    color: "#007bff",
    fontWeight: "500",
  },
});
