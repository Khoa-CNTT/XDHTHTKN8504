import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Divider, Button, IconButton } from "react-native-paper";

interface ConfirmationStepProps {
  formData: any;
  onConfirm: () => void;
  goToStep: (step: number) => void;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  formData,
  onConfirm,
  goToStep,
}) => {
  const {
    firstName,
    address,
    relationship,
    emergencyContact,
    servicePackage,
    serviceOption,
    serviceType,
    isOneDay,
    startDate,
    endDate,
    startTime,
    duration,
  } = formData;

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        Xác nhận thông tin
      </Text>
      <Text variant="bodyMedium" style={styles.description}>
        Vui lòng kiểm tra lại các thông tin bên dưới trước khi gửi yêu cầu.
      </Text>

      {/* --- Thông tin cá nhân --- */}
      <SectionHeader title="Thông tin cá nhân" onEdit={() => goToStep(1)} />
      <InfoRow label="Họ tên" value={firstName} />
      <InfoRow label="Địa chỉ" value={address} />
      <InfoRow label="Mối quan hệ" value={relationship} />
      <InfoRow
        label="SĐT liên hệ"
        value={emergencyContact?.phone || "Chưa có"}
      />

      <Divider style={styles.divider} />

      {/* --- Thông tin dịch vụ --- */}
      <SectionHeader title="Thông tin dịch vụ" onEdit={() => goToStep(2)} />
      <InfoRow
        label="Loại gói"
        value={serviceType === "available" ? "Gói có sẵn" : "Gói tùy chọn"}
      />
      <InfoRow label="Tên dịch vụ" value={servicePackage} />
      {serviceOption && <InfoRow label="Lựa chọn" value={serviceOption} />}
      <InfoRow label="Ngày bắt đầu" value={startDate} />
      {!isOneDay && <InfoRow label="Ngày kết thúc" value={endDate} />}
      <InfoRow label="Giờ bắt đầu" value={startTime} />
      {serviceType === "custom" && (
        <InfoRow label="Thời lượng" value={`${duration} phút`} />
      )}

      {/* --- Nút xác nhận --- */}
      <Button
        mode="contained"
        onPress={onConfirm}
        style={styles.confirmButton}
        icon="check"
      >
        Xác nhận & Gửi yêu cầu
      </Button>
    </View>
  );
};

// 🔧 Tiêu đề mỗi phần với nút chỉnh sửa
const SectionHeader = ({
  title,
  onEdit,
}: {
  title: string;
  onEdit: () => void;
}) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <IconButton icon="pencil" size={20} onPress={onEdit} />
  </View>
);

// 🧾 Hàng thông tin
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value || "Chưa có"}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    marginBottom: 16,
    color: "#666",
  },
  sectionHeader: {
    backgroundColor: "#ecebf0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  sectionTitle: {
    fontWeight: "600",
    fontSize: 16,
  },
  row: {
    marginBottom: 10,
  },
  label: {
    color: "#666",
    fontSize: 14,
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
  divider: {
    marginVertical: 16,
    backgroundColor: "#ccc",
  },
  confirmButton: {
    marginTop: 24,
    borderRadius: 30,
    backgroundColor: "#28a745",
  },
});

export default ConfirmationStep;
