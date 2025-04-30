import React, { useState } from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
import { ChevronRight, User } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import LocationInput from "../components/booking/LocationInput";
import DatePicker from "../components/booking/DatePicker";
import TimePicker from "../components/booking/TimePicker";
import ModeSwitch from "../components/booking/ModeSwitch";
import Section from "../components/Section";
import * as Location from "expo-location";
import Ionicons from "react-native-vector-icons/Ionicons";
import CareRecipientModal from "../components/CareRecipientModal";
import ServiceModal from "../components/ServiceModal";
import { useServicesStore } from "../stores/serviceStore";
import { Profile } from "../types/profile";

import createBooking from "../api/BookingService";
import { CreateBookingRequest } from "../types/CreateBookingRequest";

const BookVisitScreen: React.FC = () => {
  const navigation = useNavigation();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [mode, setMode] = useState<"single" | "range">("single");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [address, setAddress] = useState("");
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [careRecipient, setCareRecipient] = useState<Profile | null>(null);
  const [modalServiceVisible, setModalServiceVisible] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null
  );
  const [note, setNote] = useState<string>("");
  const selectedService = useServicesStore((state) =>
    state.getServiceById(selectedServiceId ?? "")
  );
  const handleGetCurrentLocation = async () => {
    try {
      setIsGettingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Bạn cần cấp quyền truy cập vị trí để sử dụng tính năng này.");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const reverseGeocode = await Location.reverseGeocodeAsync(
        location.coords
      );
      if (reverseGeocode.length > 0) {
        const { street, name, city, region } = reverseGeocode[0];
        const fullAddress = `${name || ""} ${street || ""}, ${city || ""}, ${
          region || ""
        }`;
        setAddress(fullAddress.trim());
      } else {
        alert("Không tìm được địa chỉ.");
      }
    } catch (err) {
      alert("Đã xảy ra lỗi khi lấy vị trí.");
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleDateConfirm = (date: Date) => {
    if (mode === "single") {
      setSelectedDate(date);
    } else {
      if (!startDate || (startDate && endDate)) {
        setStartDate(date);
        setEndDate(null);
      } else {
        if (date > startDate) {
          setEndDate(date);
        } else {
          setStartDate(date);
        }
      }
    }
    setShowDatePicker(false);
  };
  const formatTime = (date: Date | null): string => {
    return date ? date.toTimeString().slice(0, 5) : "";
  };
  // Hàm gửi request tạo booking
  const handleBookingSubmit = async () => {
    if (!careRecipient || !selectedServiceId || !startTime || !endTime) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc.");
      return;
    }

    // Xác định ngày bắt đầu và kết thúc lặp (single hoặc repeat mode)
    // const fromDate =
    //   mode === "single" && selectedDate ? selectedDate : startDate!;
    // const toDate = mode === "single" && selectedDate ? selectedDate : endDate!;
    // Nếu người dùng chọn 1 ngày duy nhất:
    const selectedDate = new Date(); // ví dụ ngày 2025-04-30

    const repeatFrom = new Date(
      selectedDate.setHours(0, 0, 0, 0)
    ).toISOString();
    const repeatTo = new Date(
      selectedDate.setHours(23, 59, 59, 999)
    ).toISOString();

    // Tạo timeSlot từ giờ bắt đầu và kết thúc
    const timeSlot = {
      start: formatTime(startTime),
      end: formatTime(endTime),
    };

    // Dữ liệu booking sẽ gửi lên server
    const bookingData: CreateBookingRequest = {
      profileId: careRecipient._id,
      serviceId: selectedServiceId,
      status: "pending",
      notes: note, // nếu có input ghi chú thì đưa vào đây
      paymentId: null,
      participants: [],
      repeatFrom,
      repeatTo,
      timeSlot,
    };

    try {
      console.log("Booking data:", bookingData);

      await createBooking(bookingData);
      alert("Đặt lịch thành công!");
      navigation.goBack();
    } catch (error: any) {
      alert("Lỗi khi đặt lịch: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back-outline" size={24} color="#2E3A59" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Đặt lịch hẹn</Text>
          <TouchableOpacity>
            <Text style={styles.resetText}>Thiết lập lại</Text>
          </TouchableOpacity>
        </View>

        {/* Người nhận */}
        <Section title="Người nhận chăm sóc">
          <TouchableOpacity
            style={styles.sectionItem}
            onPress={() => setModalVisible(true)} // Mở modal khi bấm
          >
            <View style={styles.sectionItemContent}>
              <User size={20} color="#444" />
              <Text>
                {careRecipient
                  ? `${careRecipient.firstName} ${careRecipient.lastName}`
                  : "Chọn người nhận"}
              </Text>
            </View>
            <ChevronRight size={20} />
          </TouchableOpacity>
        </Section>

        {/* Dịch vụ */}
        <Section title="Bạn cần dịch vụ hoặc thủ thuật y tế nào?">
          <TouchableOpacity
            style={styles.sectionItem}
            onPress={() => setModalServiceVisible(true)}
          >
            <Text style={{ color: selectedService ? "#000" : "#888" }}>
              {selectedService ? selectedService.name : "Chọn dịch vụ"}
            </Text>
            <ChevronRight size={20} />
          </TouchableOpacity>
        </Section>

        <ServiceModal
          visible={modalServiceVisible}
          onClose={() => setModalServiceVisible(false)}
          onSelect={(id) => {
            setSelectedServiceId(id);
            setModalServiceVisible(false);
          }}
        />

        {/* Vị trí thăm khám */}
        <Section title="Vị trí thăm khám">
          <LocationInput
            address={address}
            setAddress={setAddress}
            handleGetCurrentLocation={handleGetCurrentLocation}
            isGettingLocation={isGettingLocation}
          />
        </Section>

        {/* Ngày đặt lịch */}
        <Section title="Ngày đặt lịch?">
          <ModeSwitch mode={mode} setMode={setMode} />
          <DatePicker
            mode={mode}
            selectedDate={selectedDate}
            startDate={startDate}
            endDate={endDate}
            showDatePicker={showDatePicker}
            setShowDatePicker={setShowDatePicker}
            setMode={setMode}
            handleDateConfirm={handleDateConfirm}
          />
        </Section>

        {/* Thời gian bắt đầu */}
        <Section title="Chọn thời gian bắt đầu">
          <TimePicker
            title="Bắt đầu"
            time={startTime}
            showTimePicker={showStartTimePicker}
            setShowTimePicker={setShowStartTimePicker}
            setTime={setStartTime}
          />
        </Section>

        {/* Thời gian kết thúc */}
        <Section title="Chọn thời gian kết thúc">
          <TimePicker
            title="Kết thúc"
            time={endTime}
            showTimePicker={showEndTimePicker}
            setShowTimePicker={setShowEndTimePicker}
            setTime={setEndTime}
          />
        </Section>
        {/* Hướng dẫn */}
        <Section title="Hướng dẫn đặc biệt?">
          <TextInput
            placeholder="Thêm hướng dẫn (tuỳ chọn)"
            style={{
              backgroundColor: "#f0f0f0",
              padding: 12,
              borderRadius: 12,
              textAlignVertical: "top",
            }}
            multiline
            numberOfLines={3}
            value={note}
            onChangeText={(text) => setNote(text)}
          />
        </Section>

        <Section title="Chọn phương thức thanh toán">
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>
              Thiết lập phương thức thanh toán
            </Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#666" />
          </TouchableOpacity>
        </Section>
      </ScrollView>

      <View style={styles.bottomBar}>
        <Text style={styles.totalPrice}>SGD 0</Text>
        <TouchableOpacity style={styles.bookVisitButton} onPress={handleBookingSubmit}>
          <Text style={styles.bookVisitText}>Đặt lịch hẹn</Text>
        </TouchableOpacity>
      </View>
      <CareRecipientModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onApply={(profile) => {
          setCareRecipient(profile || null);
          setModalVisible(false);
          // if (profile) {
          //   setValue("profileId", profile._id); // Nếu dùng react-hook-form
          // }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 35,
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#2E3A59" },
  resetText: { color: "#00A8E8", fontSize: 16 },
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#2E3A59",
    marginBottom: 12,
  },
  sectionItem: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionItemContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#F8F8F8",
    borderColor: "#E0E0E0",
    borderWidth: 1,
  },
  actionText: { fontSize: 14, color: "#666" },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  totalPrice: { fontSize: 18, fontWeight: "bold", color: "#2E3A59" },
  content: { flex: 1, padding: 16 },
  bookVisitButton: {
    backgroundColor: "#28A745",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center",
  },
  bookVisitText: { fontSize: 18, fontWeight: "bold", color: "#fff" },
});

export default BookVisitScreen;
