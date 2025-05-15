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
import { createBooking } from "../api/BookingService";
import { StepFormData } from "../types/StepFormData";

const labels = ["Cá Nhân", "Dịch Vụ", "Xác Nhận"];

export default function BookAService() {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<StepFormData>({
    profile: null,
    service: null,
    packageService: null,
  });
  
  const getBookingPreview = (formData: StepFormData) => {
    const { profile, service, packageService, startTime } = formData;

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

      serviceId: service._id,
      serviceName: `${service.name} (${packageService.name})`,
      price: packageService.price,
      repeatInterval: packageService.repeatInterval,

      repeatFrom,
      repeatTo,

      timeSlot: {
        start: start.format("HH:mm"),
        end: end.format("HH:mm"),
      },
    };
  };


  const goToStep = (step: number) => setCurrentStep(step);
  const next = () => setCurrentStep((s) => s + 1);
  const updateData = (data: Partial<StepFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    next();
  };
  const handleSubmit = async () => {
    const bookingPreview = getBookingPreview(formData);
    const body = {
      profileId: bookingPreview.profileId,
      serviceId: bookingPreview.serviceId, // ID của service (Khám bệnh/Chăm sóc)
      status: "pending", // Tình trạng booking
      notes: "",
      paymentId: null, 
      participants: [],
      repeatFrom: bookingPreview.repeatFrom,
      repeatTo: bookingPreview.repeatTo,
      timeSlot: bookingPreview.timeSlot,
      repeatInterval: bookingPreview.repeatInterval,
    };
    log("request gửi booking", body)
    try {
      const result = await createBooking(body);
      navigation.goBack();
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

