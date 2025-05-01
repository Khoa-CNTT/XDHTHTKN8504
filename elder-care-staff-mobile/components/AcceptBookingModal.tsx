import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  User,
  CalendarDays,
  Clock,
  Stethoscope,
  X,
  Check,
} from "lucide-react-native";

interface AcceptBookingModalProps {
  visible: boolean;
  onAccept: () => void;
  onDecline: () => void;
  bookingInfo: {
    patientName: string;
    time: string;
    date: string;
    serviceName: string;
  } | null;
}

const AcceptBookingModal: React.FC<AcceptBookingModalProps> = ({
  visible,
  onAccept,
  onDecline,
  bookingInfo,
}) => {
  if (!bookingInfo) return null;

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Bạn có muốn nhận booking này?</Text>

          <View style={styles.row}>
            <User size={20} color="#555" />
            <Text style={styles.info}>
              {" "}
              Bệnh nhân: {bookingInfo.patientName}
            </Text>
          </View>

          <View style={styles.row}>
            <CalendarDays size={20} color="#555" />
            <Text style={styles.info}> Ngày: {bookingInfo.date}</Text>
          </View>

          <View style={styles.row}>
            <Clock size={20} color="#555" />
            <Text style={styles.info}> Giờ: {bookingInfo.time}</Text>
          </View>

          <View style={styles.row}>
            <Stethoscope size={20} color="#555" />
            <Text style={styles.info}> Dịch vụ: {bookingInfo.serviceName}</Text>
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity
              onPress={onDecline}
              style={[styles.button, styles.decline]}
            >
              <X size={20} color="#fff" />
              <Text style={styles.buttonText}>Từ chối</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onAccept}
              style={[styles.button, styles.accept]}
            >
              <Check size={20} color="#fff" />
              <Text style={styles.buttonText}>Chấp nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AcceptBookingModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#00000066",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "85%",
    elevation: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  info: {
    fontSize: 16,
    marginLeft: 8,
    color: "#333",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 6,
    paddingVertical: 10,
    borderRadius: 8,
  },
  decline: {
    backgroundColor: "#f44336",
  },
  accept: {
    backgroundColor: "#4caf50",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 6,
  },
});
