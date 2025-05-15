import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Divider, Button, IconButton } from "react-native-paper";
import { formatTime } from "../../utils/dateHelper";

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
    fullName,
    address,
    phone,
    serviceName,
    price,
    repeatFrom,
    repeatTo,
    timeSlot,
  } = formData;

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        Xác nhận thông tin
      </Text>
      <Text variant="bodyMedium" style={styles.description}>
        Vui lòng kiểm tra lại các thông tin bên dưới trước khi gửi yêu cầu.
      </Text>

      <Section title="Thông tin cá nhân" onEdit={() => goToStep(1)}>
        <InfoRow label="Họ tên" value={fullName} />
        <InfoRow label="Địa chỉ" value={address} />
        <InfoRow label="SĐT liên hệ" value={phone || "Chưa có"} />
      </Section>

      <Divider style={styles.divider} />

      <Section title="Thông tin dịch vụ" onEdit={() => goToStep(2)}>
        <InfoRow label="Tên dịch vụ" value={serviceName} />
        <InfoRow
          label="Ngày diễn ra"
          value={`${formatTime(repeatFrom, "date")} - ${formatTime(
            repeatTo,
            "date"
          )}`}
        />
        <InfoRow
          label="Giờ bắt đầu"
          value={`${timeSlot.start} - ${timeSlot.end}`}
        />
        <InfoRow
          label="Tổng tiền"
          value={`${Number(price).toLocaleString("vi-VN")} ₫`}
        />
      </Section>

      <Button
        mode="contained"
        onPress={onConfirm}
        style={styles.confirmButton}
        icon="check"
        labelStyle={styles.confirmLabel}
      >
        Xác nhận & Gửi yêu cầu
      </Button>
    </View>
  );
};

const Section = ({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) => (
  <View style={styles.sectionContainer}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <IconButton icon="pencil-outline" size={20} onPress={onEdit} />
    </View>
    <View style={styles.sectionContent}>{children}</View>
  </View>
);

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value || "Chưa có"}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9f9fb",
    flex: 1,
  },
  title: {
    fontWeight: "700",
    marginBottom: 6,
    color: "#1a1a1a",
  },
  description: {
    marginBottom: 16,
    color: "#666",
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    backgroundColor: "#e7eaf6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  sectionTitle: {
    fontWeight: "600",
    fontSize: 16,
    color: "#333",
  },
  sectionContent: {
    marginTop: 12,
  },
  row: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    color: "#888",
    marginBottom: 2,
  },
  value: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
  },
  divider: {
    marginVertical: 12,
    backgroundColor: "#ddd",
  },
  confirmButton: {
    marginTop: 24,
    borderRadius: 30,
    paddingVertical: 8,
    backgroundColor: "#4caf50",
  },
  confirmLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ConfirmationStep;
