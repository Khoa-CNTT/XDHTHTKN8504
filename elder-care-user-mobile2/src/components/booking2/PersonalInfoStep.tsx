import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Button } from "react-native-paper";
import { Feather } from "@expo/vector-icons";
import CareRecipientModal from "../CareRecipientModal";
import { Profile } from "../../types/profile";

interface PersonalInfoProps {
  onNext: (data: Profile) => void;
  defaultValues?: Partial<Profile>;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({
  onNext,
  defaultValues,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  // Khi có defaultValues truyền vào (chuyển lại step), giữ lại dữ liệu đã chọn
  useEffect(() => {
    if (defaultValues?.firstName) {
      setSelectedProfile(defaultValues as Profile);
    }
  }, [defaultValues]);

  const handleSelectProfile = (profile?: Profile) => {
    if (profile) {
      setSelectedProfile(profile);
    }
    setModalVisible(false);
  };

  const handleSubmit = () => {
    if (selectedProfile) {
      onNext(selectedProfile);
    } else {
      alert("Vui lòng chọn hồ sơ trước khi tiếp tục.");
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        👤 Thông tin cá nhân
      </Text>
      <Text variant="bodyMedium" style={styles.description}>
        Chọn hồ sơ để tự động điền thông tin vào biểu mẫu.
      </Text>

      {/* Họ và tên */}
      <Text style={styles.label}>Họ và tên</Text>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        activeOpacity={0.9}
      >
        <View style={styles.inputBox}>
          <Text
            style={
              selectedProfile?.firstName ? styles.inputText : styles.placeholder
            }
          >
            {selectedProfile?.firstName || "Chọn hồ sơ chăm sóc"}
          </Text>
          <Feather name="chevron-down" size={20} color="#888" />
        </View>
      </TouchableOpacity>

      {/* Số điện thoại */}
      <Text style={styles.label}>Số điện thoại</Text>
      <View style={styles.inputBox}>
        <Text
          style={
            selectedProfile?.emergencyContact?.phone
              ? styles.inputText
              : styles.placeholder
          }
        >
          {selectedProfile?.emergencyContact?.phone || "Chưa có số điện thoại"}
        </Text>
        <Feather name="phone" size={18} color="#888" />
      </View>

      {/* Địa chỉ */}
      <Text style={styles.label}>Địa chỉ</Text>
      <View style={styles.inputBox}>
        <Text
          style={
            selectedProfile?.address ? styles.inputText : styles.placeholder
          }
        >
          {selectedProfile?.address || "Chưa có địa chỉ"}
        </Text>
        <Feather name="map-pin" size={18} color="#888" />
      </View>

      {/* Lưu ý */}
      <Text style={styles.label}>Lưu ý chăm sóc</Text>
      <View style={styles.inputBox}>
        <Text
          style={
            selectedProfile?.relationship
              ? styles.inputText
              : styles.placeholder
          }
        >
          {selectedProfile?.relationship || "Chưa có ghi chú"}
        </Text>
        <Feather name="info" size={18} color="#888" />
      </View>

      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.button}
        contentStyle={{ paddingVertical: 6 }}
        labelStyle={{ fontSize: 16 }}
      >
        Tiếp tục
      </Button>

      <CareRecipientModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onApply={handleSelectProfile}
      />
    </View>
  );
};

export default PersonalInfo;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 6,
    color: "#333",
  },
  description: {
    marginBottom: 16,
    color: "#666",
    fontSize: 14,
  },
  label: {
    fontWeight: "600",
    marginBottom: 4,
    marginTop: 12,
    color: "#444",
    fontSize: 14,
  },
  inputBox: {
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  inputText: {
    fontSize: 15,
    color: "#111",
  },
  placeholder: {
    fontSize: 15,
    color: "#888",
    fontStyle: "italic",
  },
  button: {
    marginTop: 24,
    backgroundColor: "#28a745",
    borderRadius: 8,
  },
});
