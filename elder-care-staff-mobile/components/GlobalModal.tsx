import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { useModalStore } from "@/stores/modalStore";

const GlobalModal = () => {
  const { visible, title, message, type, onConfirm, onDetailPress, hideModal } =
    useModalStore();

  const [slideAnim] = useState(new Animated.Value(-300)); // Initial position for animation

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  const renderButtons = () => {
    return (
      <View style={styles.buttonRow}>
        {onConfirm && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              hideModal();
              onConfirm();
            }}
          >
            <Text style={styles.buttonText}>Đồng ý</Text>
          </TouchableOpacity>
        )}

        {onDetailPress && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              hideModal();
              onDetailPress();
            }}
          >
            <Text style={styles.buttonText}>Xem chi tiết</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={hideModal}
        >
          <Text style={[styles.buttonText, { color: "gray" }]}>Đóng</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          {type === "dialog" && renderButtons()}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-start", // Align at the top of the screen
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    marginTop: 20, // Position modal at the top with some space
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    flexWrap: "wrap",
  },
  button: {
    backgroundColor: "#28A745",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 90,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
});

export default GlobalModal;
