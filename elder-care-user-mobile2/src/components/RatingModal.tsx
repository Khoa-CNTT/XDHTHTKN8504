import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createReview } from "../api/ReviewService"; // import hàm API tạo review

type RatingModalProps = {
  visible: boolean;
  onClose: () => void;
  scheduleId: string; // cần truyền scheduleId để tạo review
  onSuccess?: () => void; // callback khi tạo review thành công
};

const RatingModal: React.FC<RatingModalProps> = ({
  visible,
  onClose,
  scheduleId,
  onSuccess,
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStarPress = (star: number) => {
    setRating(star);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert("Thông báo", "Vui lòng chọn số sao đánh giá");
      return;
    }
    setLoading(true);
    try {
      const newReview = await createReview(scheduleId, { rating, comment });
      if (newReview) {
        Alert.alert("Thành công", "Đánh giá đã được gửi");
        setRating(0);
        setComment("");
        onSuccess && onSuccess();
        onClose();
      } else {
        Alert.alert("Lỗi", "Không thể gửi đánh giá. Vui lòng thử lại.");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setRating(0);
      setComment("");
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>
            Bạn có cảm thấy hài lòng nhân viên chăm sóc?
          </Text>

          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => {
              const filled = star <= rating;
              return (
                <Pressable
                  key={star}
                  onPress={() => handleStarPress(star)}
                  style={({ pressed }) => [
                    styles.starButton,
                    pressed && { transform: [{ scale: 1.2 }] },
                  ]}
                  android_ripple={{ color: "#FFD700" }}
                  disabled={loading}
                >
                  <Ionicons
                    name={filled ? "star" : "star-outline"}
                    size={36}
                    color={filled ? "#FFD700" : "#B0B0B0"}
                    style={styles.starIcon}
                  />
                </Pressable>
              );
            })}
          </View>

          <TextInput
            style={styles.textInput}
            multiline
            placeholder="Viết bình luận của bạn..."
            placeholderTextColor="#9CA3AF"
            value={comment}
            onChangeText={setComment}
            textAlignVertical="top"
            maxLength={250}
            editable={!loading}
          />

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
              activeOpacity={0.8}
              disabled={loading}
            >
              <Text style={styles.cancelText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
              activeOpacity={0.8}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.submitText}>Gửi</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(46, 58, 89, 0.85)", // nền tối mờ nhẹ, màu chủ đạo app
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2E3A59",
    textAlign: "center",
    marginBottom: 24,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
  },
  starButton: {
    marginHorizontal: 6,
  },
  starIcon: {
    textShadowColor: "rgba(0,0,0,0.15)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  textInput: {
    minHeight: 100,
    borderColor: "#E2E8F0",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 12,
    fontSize: 16,
    color: "#2E3A59",
    marginBottom: 28,
    backgroundColor: "#F9FAFB",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F3F4F6",
    marginRight: 14,
  },
  submitButton: {
    backgroundColor: "#2E3A59",
  },
  cancelText: {
    color: "#6B7280",
    fontWeight: "600",
    fontSize: 16,
  },
  submitText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});

export default RatingModal;
