// BookAService.tsx
import React, { useState } from "react";
import dayjs from "dayjs";
import { View, ScrollView, StyleSheet } from "react-native";
import { useNavigation } from "expo-router";
import StepIndicator from "react-native-step-indicator";
import AppBar from "../components/AppBar";
import PersonalInfo from "../components/booking2/PersonalInfoStep";
import ServiceInfo from "../components/booking2/ServiceStep";
import ConfirmationStep from "../components/booking2/ConfirmationStep";
import { log } from "../utils/logger";
import { createBookingByPackage } from "../api/BookingService";
import { StepFormData } from "../types/StepFormData";
import { useWalletStore } from "../stores/WalletStore";
import { Modal, Text, Button } from "react-native-paper";
import Feather from "react-native-vector-icons/Feather";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/navigation"; 

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
const labels = ["Cá Nhân", "Dịch Vụ", "Xác Nhận"];

export default function BookAService() {
  const navigation = useNavigation<NavigationProp>();
  const Wallet = useWalletStore((state) => state.wallet);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<StepFormData>({
    profile: null,
    service: null,
    packageService: null,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const getBookingPreview = (formData: StepFormData) => {
    const { profile, service, packageService, startTime, note } = formData;

    if (!profile || !service || !packageService || !startTime) return null;

    const fullName = `${profile.lastName} ${profile.firstName}`;
    const repeatFrom = dayjs(startTime).format("YYYY-MM-DD");
    const repeatTo = dayjs(startTime)
      .add(packageService.totalDays - 1, "day")
      .format("YYYY-MM-DD");

    const start = dayjs(startTime);
    const end = start.add(packageService.timeWork, "hour");

    return {
      profileId: profile._id,
      address: profile.address,
      fullName,
      phone: profile.phone,
      packageId: packageService._id,

      serviceId: service._id,
      serviceName: `${service.name} (${packageService.name})`,
      price: packageService.price,
      repeatInterval: packageService.repeatInterval,

      repeatFrom,
      repeatTo,
      note,
      timeSlot: {
        start: start.format("HH:mm"),
        end: end.format("HH:mm"),
      },
    };
  };

  const handleTopUp = () => {
    setModalVisible(false);
    navigation.navigate("TopUpScreen"); // đổi "TopUpScreen" thành tên màn hình nạp tiền của bạn
  };
  const goToStep = (step: number) => setCurrentStep(step);
  const next = () => setCurrentStep((s) => s + 1);
  const updateData = (data: Partial<StepFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    next();
  };
  const handleSubmit = async () => {
    const bookingPreview = getBookingPreview(formData);
    if (!bookingPreview) return;

    if (bookingPreview.price > Wallet.balance) {
      setModalVisible(true);
      return;
    }
    const body = {
      packageId: bookingPreview.packageId,
      profileId: bookingPreview.profileId,
      repeatFrom: bookingPreview.repeatFrom,
      timeSlot: { start: bookingPreview.timeSlot.start },
      notes: bookingPreview.note,
    };
    try {
      const result = await createBookingByPackage(body);
      navigation.navigate('MyBookings');
    } catch (error) {
      log("Lỗi khi tạo booking", error);
    }
  };

  return (
    <View style={styles.container}>
      <AppBar title="Đặt lịch chăm sóc" />
      <View style={styles.stepIndicatorWrapper}>
        <StepIndicator
          currentPosition={currentStep}
          stepCount={3}
          labels={labels}
          customStyles={stepIndicatorStyles}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.stepCard}>
          {currentStep === 0 && (
            <PersonalInfo
              onNext={(data) => updateData({ profile: data })}
              defaultValues={formData.profile || undefined}
            />
          )}
          {currentStep === 1 && (
            <ServiceInfo
              onNext={(data) => updateData(data)}
              defaultValues={formData}
            />
          )}
          {currentStep === 2 && (
            <ConfirmationStep
              formData={getBookingPreview(formData)}
              onConfirm={handleSubmit}
              goToStep={goToStep}
            />
          )}
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        contentContainerStyle={styles.modalContainer}
      >
        <View style={{ alignItems: "center", marginBottom: 16 }}>
          <Feather name="alert-triangle" size={48} color="#e53935" />
        </View>
        <Text style={styles.modalText}>
          Ví của bạn không đủ để thực hiện giao dịch, vui lòng nạp thêm tiền vào
          ví.
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 24,
          }}
        >
          <Button
            mode="outlined"
            onPress={() => setModalVisible(false)}
            style={{ flex: 1, marginRight: 8 }}
          >
            Đóng
          </Button>
          <Button
            mode="contained"
            onPress={handleTopUp}
            style={{ flex: 1, marginLeft: 8 }}
          >
            Nạp tiền
          </Button>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecebf0",
  },
  scrollContent: {
    flexGrow: 1,
  },
  stepIndicatorWrapper: {
    backgroundColor: "#ecebf0",
    paddingVertical: 20,
    paddingHorizontal: 8,
    shadowColor: "#000",
  },
  stepCard: {
    backgroundColor: "#fff",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 12,
    color: "#e53935",
    fontWeight: "bold",
  },
});

const stepIndicatorStyles = {
  stepIndicatorSize: 40,
  currentStepIndicatorSize: 30,
  labelSize: 14,
  currentStepLabelColor: "#000",
  stepIndicatorFinishedColor: "#28a745",
  stepIndicatorCurrentColor: "#28a745",
  stepIndicatorUnFinishedColor: "#aaaaaa",
};

