import React, { useEffect } from "react";
import { ScrollView, View, StyleSheet, ActivityIndicator } from "react-native";
import { Text, Button } from "react-native-paper";
import { format } from "date-fns";
import { useLocalSearchParams } from "expo-router";
import useBookingStore from "../../../stores/BookingStore";

const Section = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
    <View style={styles.sectionContent}>{children}</View>
    <View style={styles.separator} />
  </View>
);

const LabelText = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) => (
  <View style={styles.labelContainer}>
    <Text style={styles.labelText}>{label}</Text>
    <Text style={styles.valueText}>{value ?? "-"}</Text>
  </View>
);

const BookingDetailScreen = () => {
  const { bookingId } = useLocalSearchParams();
  const { booking, loading, fetchBooking } = useBookingStore();

  useEffect(() => {
    if (!booking && typeof bookingId === "string") {
      fetchBooking(bookingId);
    }
  }, [bookingId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Đang tải thông tin...</Text>
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>
          Không tìm thấy thông tin lịch hẹn.
        </Text>
        <Button
          mode="outlined"
          onPress={() => {
            if (typeof bookingId === "string") {
              fetchBooking(bookingId);
            }
          }}
          style={styles.retryButton}
          labelStyle={{ color: "#000" }}
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
  const finalPrice = Math.max(0, totalPrice - totalDiscount);

  return (
    <ScrollView style={styles.container}>
      <Section
        title="Thông tin đặt lịch"
        subtitle={
          createdAt
            ? `Lên lịch lúc ${format(new Date(createdAt), "dd/MM/yyyy")}`
            : undefined
        }
      >
        <LabelText label="Dịch vụ" value={serviceId?.name} />
        <LabelText
          label="Ngày bắt đầu"
          value={
            repeatFrom ? format(new Date(repeatFrom), "dd/MM/yyyy") : undefined
          }
        />
        <LabelText
          label="Ngày kết thúc"
          value={
            repeatTo ? format(new Date(repeatTo), "dd/MM/yyyy") : undefined
          }
        />
        <LabelText
          label="Thời gian"
          value={timeSlot ? `${timeSlot.start} - ${timeSlot.end}` : undefined}
        />
        <LabelText
          label="Khách hàng"
          value={
            profileId
              ? `${profileId.firstName ?? ""} ${
                  profileId.lastName ?? ""
                }`.trim()
              : undefined
          }
        />
        <LabelText
          label="Địa chỉ"
          value={profileId?.address ?? "Không có địa chỉ"}
        />
        <LabelText
          label="Số điện thoại"
          value={profileId?.phone ?? "Không có số điện thoại"}
        />
      </Section>

      <Section
        title="Thông tin sức khỏe"
        subtitle="Thông tin được cập nhật từ hồ sơ cá nhân"
      >
        <LabelText
          label="Chiều cao"
          value={healthInfo?.height ? `${healthInfo.height} cm` : "?"}
        />
        <LabelText
          label="Cân nặng"
          value={healthInfo?.weight ? `${healthInfo.weight} kg` : "?"}
        />
        <LabelText
          label="Nhóm máu"
          value={healthInfo?.typeBlood ?? "Không rõ"}
        />
      </Section>

      <Section
        title="Thông tin thanh toán"
        subtitle="Chi tiết về chi phí và ưu đãi"
      >
        <LabelText
          label="Tổng giá gốc"
          value={totalPrice ? `${totalPrice.toLocaleString()} VND` : undefined}
        />
        <LabelText
          label="Tổng đã giảm"
          value={
            totalDiscount ? `${totalDiscount.toLocaleString()} VND` : undefined
          }
        />
        <View style={{ marginTop: 8 }}>
          <Text style={styles.finalPrice}>
            Thành tiền cuối cùng: {finalPrice.toLocaleString()} VND
          </Text>
        </View>
      </Section>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
    fontFamily: "serif",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#444",
    marginBottom: 12,
    fontStyle: "italic",
  },
  sectionContent: {
    paddingLeft: 8,
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  labelText: {
    fontSize: 16,
    color: "#000",
    fontFamily: "serif",
  },
  valueText: {
    fontSize: 16,
    color: "#000",
    fontFamily: "serif",
    maxWidth: "65%",
    textAlign: "right",
  },
  finalPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    fontFamily: "serif",
  },
  separator: {
    height: 1,
    backgroundColor: "#aaa",
    marginTop: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#000",
    fontFamily: "serif",
  },
  retryButton: {
    borderColor: "#000",
  },
});

export default BookingDetailScreen;
