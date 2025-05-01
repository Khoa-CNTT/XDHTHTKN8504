import React, { useEffect } from "react";
import { Modal, View, Text, Button, StyleSheet, Vibration } from "react-native";
import { useSocketStore } from "@/stores/socketStore";
import { acceptBooking } from "@/api/BookingApi";
import { Booking } from "@/types/Booking";
import { formatTime } from "@/utils/dateHelper"; // Đảm bảo đường dẫn đúng với cấu trúc dự án của bạn
import {
  CalendarDays,
  Clock,
  DollarSign,
  User,
  Stethoscope,
} from "lucide-react-native";

const BookingModal = () => {
  const { newBooking, setNewBooking } = useSocketStore((state) => state);
  const [visible, setVisible] = React.useState(false);

  useEffect(() => {
    if (newBooking) {
      setVisible(true); // Hiển thị modal khi có booking mới
      Vibration.vibrate([300, 100, 300], true); 
    }
  }, [newBooking]);

  const handleAccept = async () => {
    if (!newBooking?._id) {
      alert("Không có ID booking hợp lệ");
      return;
    }
    try {
      await acceptBooking(newBooking._id); // Chấp nhận booking
      closeModal();
    } catch (error) {
      alert("Không thể chấp nhận booking");
    }
  };

  const handleReject = () => {
    closeModal();
  };

  const closeModal = () => {
    setNewBooking(null); // Đặt lại trạng thái sau khi xử lý
    setVisible(false); // Đóng modal
    Vibration.cancel();
  };

  if (!newBooking) return null; // Nếu không có booking, không hiển thị gì

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={closeModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Công Việc Mới!</Text>
          <BookingDetails booking={newBooking} />
          <View style={styles.buttons}>
            <Button title="Chấp nhận" onPress={handleAccept} />
            <Button title="Từ chối" onPress={handleReject} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Tách component hiển thị thông tin booking
const BookingDetails = ({ booking }: { booking: Booking }) => (
  <View style={styles.details}>
    <DetailRow
      label="Khách hàng"
      value={`${booking.profileId.firstName} ${booking.profileId.lastName}`}
      icon={<User size={22} color="#4f46e5" />}
    />
    <DetailRow
      label="Dịch vụ"
      value={booking.serviceId.name}
      icon={<Stethoscope size={22} color="#4f46e5" />}
    />
    <DetailRow
      label="Ngày thực hiện"
      value={`${formatTime(
        booking.repeatFrom,
        "date"
      )} - ${formatTime(booking.repeatTo, "date")}`}
      icon={<CalendarDays size={22} color="#4f46e5" />}
    />
    <DetailRow
      label="Thời Gian"
      value={`${booking.timeSlot.start} - ${booking.timeSlot.end}`}
      icon={<Clock size={22} color="#4f46e5" />}
    />

    <DetailRow
      label="Tiền nhận được"
      value={`${booking.totalDiscount.toLocaleString()}đ`}
      icon={<DollarSign size={22} color="#4f46e5" />}
    />
  </View>
);

// Component hiển thị một dòng thông tin
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
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Màu nền mờ
  },
  modalContent: {
    width: 350, // Đã tăng kích thước modal
    padding: 25, // Thêm padding để không gian rộng rãi
    backgroundColor: "white",
    borderRadius: 15, // Góc bo tròn lớn hơn
    alignItems: "center",
  },
  title: {
    fontSize: 24, // Tăng cỡ chữ tiêu đề
    fontWeight: "bold",
    marginBottom: 15, // Khoảng cách lớn hơn giữa tiêu đề và thông tin
  },
  details: {
    width: "100%",
    marginBottom: 25, // Tăng khoảng cách dưới thông tin
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10, // Khoảng cách giữa các dòng thông tin
  },
  bold: {
    fontWeight: "bold",
    marginRight: 10, // Khoảng cách giữa icon và chữ
    fontSize: 16, // Tăng cỡ chữ của label
  },
  value: {
    fontSize: 16, // Tăng cỡ chữ của value
  },
  buttons: {
    marginTop: 20,
    width: "100%",
  },
});

export default BookingModal;
