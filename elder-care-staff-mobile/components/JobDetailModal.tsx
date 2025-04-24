import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import { IconButton } from "react-native-paper"; 
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"; 
import Modal from "react-native-modal";
import dayjs from "dayjs";

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
  if (!job) {
    return (
      <Modal isVisible={visible}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      </Modal>
    );
  }

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
              <IconButton
                icon="close" // Thay vì Icon từ react-native-vector-icons, sử dụng icon từ react-native-paper
                size={24}
                onPress={onClose}
              />
            </TouchableOpacity>
          </View>

          {/* Thông tin công việc */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin công việc</Text>
            <View style={styles.row}>
              <MaterialCommunityIcons
                name="calendar"
                size={20}
                color="#007bff"
              />
              <Text>Ngày làm: {dayjs(job.date).format("DD/MM/YYYY")}</Text>
            </View>
            <View style={styles.row}>
              <MaterialCommunityIcons name="clock" size={20} color="#007bff" />
              <Text>Thời gian: {job.time}</Text>
            </View>
            <View style={styles.row}>
              <MaterialCommunityIcons
                name="timer-sand"
                size={20}
                color="#007bff"
              />
              <Text>Thời lượng: {job.duration} giờ</Text>
            </View>
            <View style={styles.row}>
              <MaterialCommunityIcons name="wrench" size={20} color="#007bff" />
              <Text>Mô tả: {job.description}</Text>
            </View>
            <View style={styles.row}>
              <MaterialCommunityIcons
                name="currency-usd"
                size={20}
                color="#007bff"
              />
              <Text>Lương: {job.salary.toLocaleString()} VND</Text>
            </View>
            <View style={styles.row}>
              <MaterialCommunityIcons
                name="calendar-clock"
                size={20}
                color="#007bff"
              />
              <Text>
                Bắt đầu: {dayjs(job.startDate).format("HH:mm DD/MM/YYYY")}
              </Text>
            </View>
            <View style={styles.row}>
              <MaterialCommunityIcons
                name="calendar-clock"
                size={20}
                color="#007bff"
              />
              <Text>
                Kết thúc: {dayjs(job.endDate).format("HH:mm DD/MM/YYYY")}
              </Text>
            </View>
          </View>

          {/* Other sections... */}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  container: {
    height: Platform.OS === "ios" ? "85%" : "100%",
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
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default JobDetailModal;
