import React, { useState, useEffect } from "react";
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
import { createBooking } from "../api/BookingService";
import { useModalStore } from "../stores/modalStore";

import { useRoute, RouteProp } from "@react-navigation/native";

type BookVisitRouteParams = {
    BookVisitScreen: {
        careRecipient?: Profile;
        role?: string;
    };
};

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
    const [role, setRole] = useState<string | undefined>(undefined);

    const route = useRoute<RouteProp<BookVisitRouteParams, "BookVisitScreen">>();

    // State để theo dõi lỗi
    const [careRecipientError, setCareRecipientError] = useState<string | null>(null);
    const [serviceError, setServiceError] = useState<string | null>(null);
    const [startTimeError, setStartTimeError] = useState<string | null>(null);
    const [endTimeError, setEndTimeError] = useState<string | null>(null);
    const [dateError, setDateError] = useState<string | null>(null);

    useEffect(() => {
        if (route.params?.careRecipient) {
            setCareRecipient(route.params.careRecipient);
        }
        if (route.params?.role) {
            setRole(route.params.role);
        }
    }, [route.params]);

    const handleResetForm = () => {
        setSelectedServiceId(null);
        setNote("");
        setAddress("");
        setSelectedDate(null);
        setStartDate(null);
        setEndDate(null);
        setStartTime(null);
        setEndTime(null);
        setMode("single");

        // Reset lỗi
        setCareRecipientError(null);
        setServiceError(null);
        setStartTimeError(null);
        setEndTimeError(null);
        setDateError(null);
    };


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
            setDateError(null); // Xóa lỗi khi chọn ngày
        } else {
            if (!startDate || (startDate && endDate)) {
                setStartDate(date);
                setEndDate(null);
                setDateError(null); // Xóa lỗi khi chọn ngày bắt đầu
            } else {
                if (date > startDate) {
                    setEndDate(date);
                    setDateError(null); // Xóa lỗi khi chọn ngày kết thúc
                } else {
                    setStartDate(date);
                    setEndDate(null);
                    setDateError("Ngày kết thúc phải sau ngày bắt đầu");
                }
            }
        }
        setShowDatePicker(false);
    };
    const formatTime = (date: Date | null): string => {
        return date ? date.toTimeString().slice(0, 5) : "";
    };
    const validateBookingData = () => {
        let isValid = true;
        if (!careRecipient) {
            setCareRecipientError("Vui lòng chọn người nhận chăm sóc.");
            isValid = false;
        } else {
            setCareRecipientError(null);
        }
        if (!selectedServiceId) {
            setServiceError("Vui lòng chọn dịch vụ.");
            isValid = false;
        } else {
            setServiceError(null);
        }
        if (!startTime) {
            setStartTimeError("Vui lòng chọn thời gian bắt đầu.");
            isValid = false;
        } else {
            setStartTimeError(null);
        }
        if (!endTime) {
            setEndTimeError("Vui lòng chọn thời gian kết thúc.");
            isValid = false;
        } else {
            setEndTimeError(null);
        }
        if (mode === "range" && (!startDate || !endDate)) {
            setDateError("Vui lòng chọn khoảng ngày đặt lịch.");
            isValid = false;
        } else if (mode === "single" && !selectedDate) {
            setDateError("Vui lòng chọn ngày đặt lịch.");
            isValid = false;
        } else {
            setDateError(null);
        }
        return isValid;
    };

    // Hàm gửi request tạo booking
    const handleBookingSubmit = async () => {
        if (!validateBookingData()) {
            return;
        }
        let repeatFrom: string;
        let repeatTo: string;

        if (mode === "single" && selectedDate) {
            const start = new Date(selectedDate);
            start.setHours(0, 0, 0, 0);
            const end = new Date(selectedDate);
            end.setHours(23, 59, 59, 999);
            repeatFrom = start.toISOString();
            repeatTo = end.toISOString();
        } else if (mode === "range" && startDate && endDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            repeatFrom = start.toISOString();
            repeatTo = end.toISOString();
        } else {
            alert("Vui lòng chọn ngày hợp lệ.");
            return;
        }

        // Tạo timeSlot từ giờ bắt đầu và kết thúc
        const timeSlot = {
            start: formatTime(startTime),
            end: formatTime(endTime),
        };

        // Dữ liệu booking sẽ gửi lên server
        const bookingData: CreateBookingRequest = {
            profileId: careRecipient!._id, // Đã validate careRecipient nên có thể dùng !
            serviceId: selectedServiceId!, // Đã validate selectedServiceId nên có thể dùng !
            status: "pending",
            notes: note, // nếu có input ghi chú thì đưa vào đây
            paymentId: null,
            participants: [],
            repeatFrom,
            repeatTo,
            timeSlot,
        };

        try {
            await createBooking(bookingData);
            useModalStore.getState().showModal(
                "Đặt lịch thành công",
                'Đơn đặt lịch của bạn đã được gửi đi, bạn sẽ nhận được thông báo khi có người nhận lịch.',
                {
                    type: "popup",
                    autoHideDuration: 3000,
                });
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
                    <TouchableOpacity onPress={handleResetForm}>
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
                            <Text style={{ color: careRecipient ? "#000" : "#888" }}>
                                {careRecipient
                                    ? `${careRecipient.firstName} ${careRecipient.lastName}`
                                    : "Chọn người nhận"}
                            </Text>
                        </View>
                        <ChevronRight size={20} />
                    </TouchableOpacity>
                    {careRecipientError && <Text style={styles.errorText}>{careRecipientError}</Text>}
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
                    {serviceError && <Text style={styles.errorText}>{serviceError}</Text>}
                </Section>

                <ServiceModal
                    visible={modalServiceVisible}
                    
                    onClose={() => setModalServiceVisible(false)}
                    onSelect={(service) => {
                        setSelectedServiceId(service._id);
                        setServiceError(null); // Xóa lỗi khi chọn dịch vụ
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
                    {dateError && <Text style={styles.errorText}>{dateError}</Text>}
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
                    {startTimeError && <Text style={styles.errorText}>{startTimeError}</Text>}
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
                    {endTimeError && <Text style={styles.errorText}>{endTimeError}</Text>}
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
                <Text style={styles.totalPrice}>0 VND</Text>
                <TouchableOpacity style={styles.bookVisitButton} onPress={handleBookingSubmit}>
                    <Text style={styles.bookVisitText}>Đặt lịch hẹn</Text>
                </TouchableOpacity>
            </View>
            <CareRecipientModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onApply={(profile) => {
                    setCareRecipient(profile || null);
                    setCareRecipientError(null); // Xóa lỗi khi chọn người nhận
                    setModalVisible(false);
                    // if (profile) {
                    //   setValue("profileId", profile._id); // Nếu dùng react-hook-form
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
        paddingHorizontal: 16,
    },
    headerTitle: { fontSize: 20, fontWeight: "bold", color: "#2E3A59" },
    resetText: { color: "#00A8E8", fontSize: 16 },
    section: { marginBottom: 20, paddingHorizontal: 16 },
    sectionTitle: {
        fontSize: 16, // Giảm kích thước tiêu đề section
        fontWeight: "bold",
        color: "#2E3A59",
        marginBottom: 8, // Giảm margin bottom
    },
    sectionItem: {
        backgroundColor: "#f0f0f0",
        padding: 12,
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 5, // Giảm margin bottom
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
    content: { flex: 1, paddingHorizontal: 16, paddingTop: 16 }, // Thêm padding top cho content
    bookVisitButton: {
        backgroundColor: "#28A745",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        alignItems: "center",
    },
    bookVisitText: { fontSize: 18, fontWeight: "bold", color: "#fff" },
    errorText: {
        color: "red",
        fontSize: 12,
        marginTop: 3,
    },
});

export default BookVisitScreen;
   