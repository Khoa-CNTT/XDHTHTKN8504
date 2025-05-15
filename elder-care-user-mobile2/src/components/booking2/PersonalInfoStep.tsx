import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button, TextInput } from "react-native-paper";
import { Feather } from "@expo/vector-icons";
import CareRecipientModal from "../CareRecipientModal";
import { Profile } from "../../types/profile";
import InputDisplay from "../InputDisplay";

interface PersonalInfoProps {
  onNext: (data: Profile & { notes?: string }) => void;
  defaultValues?: Partial<Profile>;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({
  onNext,
  defaultValues,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [notes, setNotes] = useState("");
  const [showError, setShowError] = useState(false);

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
    setShowError(false);
  };

  const handleSubmit = () => {
    if (!selectedProfile) {
      setShowError(true);
      return;
    }
    setShowError(false);
    onNext({ ...selectedProfile, notes });
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        👤 Thông tin cá nhân
      </Text>
      <Text variant="bodyMedium" style={styles.description}>
        Chọn hồ sơ để tự động điền thông tin vào biểu mẫu.
      </Text>

      <Text style={styles.label}>Họ và tên</Text>
      <InputDisplay
        icon="user"
        value={
          selectedProfile
            ? `${selectedProfile.firstName} ${selectedProfile.lastName}`
            : undefined
        }
        placeholder="Chọn hồ sơ chăm sóc"
        onPress={() => setModalVisible(true)}
      />
      {showError && (
        <Text style={styles.errorText}>
          Vui lòng chọn hồ sơ chăm sóc trước khi tiếp tục.
        </Text>
      )}

      <Text style={styles.label}>Số điện thoại</Text>
      <InputDisplay
        icon="phone"
        value={selectedProfile?.phone}
        placeholder="Chưa có số điện thoại"
      />

      <Text style={styles.label}>Địa chỉ</Text>
      <InputDisplay
        icon="map-pin"
        value={selectedProfile?.address}
        placeholder="Chưa có địa chỉ"
        multiline
      />

      <Text style={styles.label}>Ghi chú chăm sóc (không bắt buộc)</Text>
      <View style={styles.notesContainer}>
        <Feather
          name="info"
          size={18}
          color="#666"
          style={{ marginRight: 8 }}
        />
        <TextInput
          placeholder="Nhập ghi chú chăm sóc"
          value={notes}
          onChangeText={setNotes}
          multiline
          style={styles.notesInput}
          underlineColor="transparent"
          outlineColor="#ccc"
        />
      </View>

      <Button
        mode="contained"
        icon="arrow-right"
        style={styles.button}
        onPress={handleSubmit}
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
    padding: 24,
    backgroundColor: "#fff",
    borderRadius: 16,
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontWeight: "700",
    marginBottom: 10,
    color: "#222",
  },
  description: {
    marginBottom: 20,
    color: "#666",
    fontSize: 15,
    lineHeight: 22,
  },
  label: {
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 14,
    color: "#444",
    fontSize: 15,
  },
  notesContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 1,
    backgroundColor: "#fafafa",
  },
  notesInput: {
    flex: 1,
    fontSize: 16,
    minHeight: 30,
    maxHeight: 120,
    backgroundColor: "transparent",
    fontStyle: "italic",
    color: "#999",
  },
  button: {
    paddingVertical: 7,
    marginTop: 32,
    borderRadius: 24,
    backgroundColor: "#28a745",
  },
  errorText: {
    color: "red",
    fontSize: 13,
    marginTop: 4,
  },
});
