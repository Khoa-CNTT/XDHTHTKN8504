import React, { useEffect } from "react";
import {
  Modal,
  View,
  Text,
  Button,
  StyleSheet,
  Vibration,
  TouchableOpacity,
} from "react-native";
import { useSocketStore } from "@/stores/socketStore";
import { acceptBooking } from "@/api/BookingApi";
import { Booking } from "@/types/Booking";
import { formatTime } from "@/utils/dateHelper";
import {
  CalendarDays,
  Clock,
  DollarSign,
  User,
  Stethoscope,
} from "lucide-react-native";
import { playNotificationSound } from "@/utils/soundService";

const BookingModal = () => {
  const { newBooking, setNewBooking } = useSocketStore((state) => state);
  const [visible, setVisible] = React.useState(false);

  useEffect(() => {
    if (newBooking) {
      setVisible(true);
      Vibration.vibrate(300);
      playNotificationSound("dialog");
    }
  }, [newBooking]);

  const handleAccept = async () => {
    if (!newBooking?._id) {
      alert("Không có ID booking hợp lệ");
      return;
    }
    try {
      await acceptBooking(newBooking._id);
      closeModal();
    } catch (error) {
      alert("Không thể chấp nhận booking");
    }
  };

  const handleReject = () => {
    closeModal();
  };

  const closeModal = () => {
    setNewBooking(null);
    setVisible(false);
    Vibration.cancel();
  };

  if (!newBooking) return null;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={closeModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Công Việc Mới!</Text>
          <BookingDetails booking={newBooking} />
          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={handleAccept}
            >
              <Text style={styles.buttonText}>Tiếp nhận chăm sóc</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.rejectButton}
              onPress={handleReject}
            >
              <Text style={styles.buttonText}>Từ chối</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const BookingDetails = ({ booking }: { booking: Booking }) => (
  <View style={styles.details}>
    <DetailRow
      label=""
      value={`${booking.profileId.firstName} ${booking.profileId.lastName}`}
      icon={<User size={22} color="#4f46e5" />}
    />
    <DetailRow
      label=""
      value={booking.serviceId.name}
      icon={<Stethoscope size={22} color="#4f46e5" />}
    />
    <DetailRow
      label=""
      value={`${formatTime(booking.repeatFrom, "date")} - ${formatTime(
        booking.repeatTo,
        "date"
      )}`}
      icon={<CalendarDays size={22} color="#4f46e5" />}
    />
    <DetailRow
      label=""
      value={`${booking.timeSlot.start} - ${booking.timeSlot.end}`}
      icon={<Clock size={22} color="#4f46e5" />}
    />
    <DetailRow
      label=""
      value={`${booking.totalDiscount.toLocaleString()}đ`}
      icon={<DollarSign size={22} color="#4f46e5" />}
    />
  </View>
);

const DetailRow = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: JSX.Element;
}) => (
  <View style={styles.row}>
    {icon}
    <Text style={styles.bold}>{label}:</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 350,
    padding: 25,
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  details: {
    width: "100%",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  bold: {
    fontWeight: "bold",
    marginRight: 12,
    fontSize: 16,
    color: "#333",
  },
  value: {
    fontSize: 16,
    color: "#666",
  },
  buttons: {
    marginTop: 20,
    width: "100%",
  },
  acceptButton: {
    backgroundColor: "#4caf50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 10,
  },
  rejectButton: {
    backgroundColor: "#f44336",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
});

export default BookingModal;
