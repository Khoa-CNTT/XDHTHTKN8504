// components/TooEarlyModal.tsx
import React from "react";
import { Modal, View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

type Props = {
  visible: boolean;
  onClose: () => void;
};

const TooEarlyModal: React.FC<Props> = ({ visible, onClose }) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>
            Chưa đến giờ bắt đầu. Bạn chỉ có thể thực hiện thao tác này trong
            vòng 1 tiếng trước giờ hẹn.
          </Text>
          <Button mode="contained" onPress={onClose}>
            Đóng
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 12,
    textAlign: "center",
  },
});

export default TooEarlyModal;
