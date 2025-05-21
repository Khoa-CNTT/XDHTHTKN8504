import React, { useEffect } from "react";
import { ScrollView, View, StyleSheet, ActivityIndicator } from "react-native";
import { Text, Button } from "react-native-paper";
import { format } from "date-fns";
import { useLocalSearchParams } from "expo-router";
import useBookingStore from "../../../stores/BookingStore";
import { log } from "@/utils/logger";

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionContent}>{children}</View>
  </View>
);

const LabelText = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value ?? "—"}</Text>
  </View>
);

const BookingDetailScreen = () => {
  const { bookingId } = useLocalSearchParams();
  const { booking, loading, fetchBooking } = useBookingStore();
  log("booking check: ", bookingId)

  useEffect(() => {
    if (!booking && typeof bookingId === "string") {
      fetchBooking(bookingId);
    }
  }, [bookingId]);

  const handleRetry = () => {
    if (typeof bookingId === "string") {
      fetchBooking(bookingId);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Đang tải thông tin đặt lịch...</Text>
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>Không tìm thấy lịch hẹn.</Text>
        <Button
          mode="outlined"
          onPress={handleRetry}
          style={styles.retryButton}
        >
          Thử lại
        </Button>
      </View>
    );
  }

  const {
    timeSlot,
    repeatFrom,
    repeatTo,
    serviceId,
    profileId,
    totalDiscount,
    totalPrice,
    createdAt,
  } = booking;

  const healthInfo = profileId?.healthInfo?.[0];
  log("booking Data: ", booking)


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.invoiceTitle}>HÓA ĐƠN DỊCH VỤ Y TẾ</Text>
      <Text style={styles.invoiceDate}>
        Ngày tạo:{" "}
        {createdAt ? format(new Date(createdAt), "dd/MM/yyyy HH:mm") : "—"}
      </Text>

      <Section title="1. Thông tin khách hàng">
        <LabelText
          label="Họ tên"
          value={
            profileId
              ? `${profileId.firstName ?? ""} ${
                  profileId.lastName ?? ""
                }`.trim()
              : undefined
          }
        />
        <LabelText label="Số điện thoại" value={profileId?.phone} />
        <LabelText label="Địa chỉ" value={profileId?.address} />
      </Section>

      <Section title="2. Thông tin sức khỏe">
        <LabelText
          label="Chiều cao"
          value={healthInfo?.height ? `${healthInfo.height} cm` : undefined}
        />
        <LabelText
          label="Cân nặng"
          value={healthInfo?.weight ? `${healthInfo.weight} kg` : undefined}
        />
        <LabelText label="Nhóm máu" value={healthInfo?.typeBlood} />

        <View style={{ marginTop: 8 }}>
          <Text
            style={{ color: "#34495e", fontWeight: "bold", marginBottom: 4 }}
          >
            Các bệnh lý, tình trạng sức khỏe:
          </Text>
          {healthInfo?.condition && healthInfo.condition.length > 0 ? (
            healthInfo.condition.map((cond) => (
              <Text key={cond._id} style={{ color: "#2c3e50", marginLeft: 8 }}>
                - {cond.name}
              </Text>
            ))
          ) : (
            <Text style={{ color: "#7f8c8d", fontStyle: "italic" }}>
              Không có bệnh lý nào được ghi nhận
            </Text>
          )}
        </View>

        {healthInfo?.notes ? (
          <View style={{ marginTop: 12 }}>
            <Text
              style={{ color: "#34495e", fontWeight: "bold", marginBottom: 4 }}
            >
              Ghi chú sức khỏe:
            </Text>
            <Text style={{ color: "#2c3e50", marginLeft: 8 }}>
              {healthInfo.notes}
            </Text>
          </View>
        ) : null}
      </Section>

      <Section title="3. Thông tin dịch vụ">
        <LabelText label="Dịch vụ" value={serviceId?.name} />
        <LabelText
          label="Ngày bắt đầu"
          value={repeatFrom && format(new Date(repeatFrom), "dd/MM/yyyy")}
        />
        <LabelText
          label="Ngày kết thúc"
          value={repeatTo && format(new Date(repeatTo), "dd/MM/yyyy")}
        />
        <LabelText
          label="Khung giờ"
          value={timeSlot && `${timeSlot.start} - ${timeSlot.end}`}
        />
      </Section>

      <Section title="4. Thông tin thanh toán">
        <LabelText
          label="Tổng giá"
          value={totalPrice ? `${totalPrice.toLocaleString()} VND` : undefined}
        />
        <LabelText
          label="Giảm giá"
          value={
            0
          }
        />
        <View style={styles.finalRow}>
          <Text style={styles.finalLabel}>Nhận được</Text>
          <Text style={styles.finalValue}>
            {totalDiscount.toLocaleString()} VND
          </Text>
        </View>
      </Section>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f7f9fc",
    padding: 16,
  },
  invoiceTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: 4,
  },
  invoiceDate: {
    textAlign: "center",
    color: "#7f8c8d",
    marginBottom: 16,
  },
  section: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#ccc",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#34495e",
    marginBottom: 10,
  },
  sectionContent: {
    borderTopWidth: 1,
    borderTopColor: "#ecf0f1",
    paddingTop: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  label: {
    color: "#7f8c8d",
    fontSize: 15,
    flex: 1,
  },
  value: {
    color: "#2c3e50",
    fontSize: 15,
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
  },
  finalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 10,
  },
  finalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  finalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e74c3c",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#333",
  },
  retryButton: {
    marginTop: 12,
  },
});

export default BookingDetailScreen;
