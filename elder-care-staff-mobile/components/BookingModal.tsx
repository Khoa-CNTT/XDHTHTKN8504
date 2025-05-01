// src/components/BookingModal.tsx
import React, { useEffect } from "react";
import { Modal, View, Text, Button, StyleSheet } from "react-native";
import { useSocketStore } from "@/stores/socketStore";
import { acceptBooking } from "@/api/BookingApi";
 // Import store

const BookingModal = () => {
  const { newBooking, setNewBooking } = useSocketStore((state) => state);
  const [visible, setVisible] = React.useState(false);

  useEffect(() => {
    if (newBooking) {
      setVisible(true); // Hiển thị modal khi có booking mới
    }
  }, [newBooking]);

  const handleAccept = async() => {
     if (!newBooking?._id) {
       alert("Không có ID booking hợp lệ");
       return;
     }
    try {
      const response = await acceptBooking(newBooking?._id);
      setNewBooking(null); // Đặt lại trạng thái sau khi xử lý
      setVisible(false); // Đóng modal
    } catch (error) {
      alert("Không thể chấp nhận booking");
    }
    setNewBooking(null); // Đặt lại trạng thái sau khi xử lý
    setVisible(false); // Đóng modal
  };

  const handleReject = () => {
    // Xử lý khi từ chối booking
    console.log("Từ chối booking:", newBooking);
    setNewBooking(null); // Đặt lại trạng thái sau khi xử lý
    setVisible(false); // Đóng modal
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => setVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Booking Mới</Text>
          <Text style={styles.details}>
            Thông tin booking: {JSON.stringify(newBooking)}
          </Text>
          <View style={styles.buttons}>
            <Button title="Chấp nhận" onPress={handleAccept} />
            <Button title="Từ chối" onPress={handleReject} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Màu nền mờ
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  details: {
    marginVertical: 10,
  },
  buttons: {
    marginTop: 20,
  },
});

export default BookingModal;
