import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Animated,
} from "react-native";
import { useEffect, useRef } from "react";
import { useModalStore } from "../stores/modalStore";

const GlobalModal = () => {
  const {
    visible,
    title,
    message,
    hideModal,
    onDetailPress,
    type, // "popup" hoặc "dialog"
    autoHideDuration,
  } = useModalStore();

  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    // Chỉ áp dụng hiệu ứng cho popup
    if (visible && type === "popup") {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      if (autoHideDuration) {
        const timeout = setTimeout(() => {
          hideModal();
        }, autoHideDuration);
        return () => clearTimeout(timeout);
      }
    }

    if (!visible && type === "popup") {
      // Reset lại vị trí khi ẩn
      translateY.setValue(-100);
    }
  }, [visible, type, autoHideDuration, hideModal, translateY]);

  if (!visible) return null;

  // Nếu modal là Popup, bao bọc toàn màn hình để lắng nghe chạm
  if (type === "popup") {
    return (
      <Modal visible={visible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={hideModal}>
          <View style={[styles.backdrop, styles.popupBackdrop]}>
            <Animated.View
              style={[
                styles.modalContentPopup,
                { transform: [{ translateY }] },
              ]}
            >
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>{message}</Text>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }

  // Với Dialog, giữ nguyên hiển thị ở giữa màn hình và đóng modal qua nút bấm
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.modalContentDialog}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.buttonOutline} onPress={hideModal}>
              <Text style={styles.buttonTextOutline}>Đóng</Text>
            </TouchableOpacity>
            {onDetailPress && (
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  onDetailPress();
                  hideModal();
                }}
              >
                <Text style={styles.buttonText}>Xem chi tiết</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  popupBackdrop: {
    justifyContent: "flex-start",
    paddingTop: 50, // Khoảng cách từ trên cùng của màn hình
  },
  modalContentDialog: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    width: "85%",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 8,
    alignItems: "center",
  },
  modalContentPopup: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 16,
    width: "90%",
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 6,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#222",
  },
  message: {
    fontSize: 16,
    marginBottom: 12,
    color: "#555",
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonOutline: {
    borderColor: "#aaa",
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
  buttonTextOutline: {
    color: "#555",
    fontWeight: "600",
  },
});

export default GlobalModal;
