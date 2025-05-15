// BookAService.tsx
import React, { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
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

  const goToStep = (step: number) => setCurrentStep(step);
  const next = () => setCurrentStep((s) => s + 1);

  const updateData = (data: Partial<StepFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    next();
  };

  const handleSubmit = async () => {
    log("dữ liệu gửi resqest Booking: ", formData)
    if (
      !formData.profile ||
      !formData.service._id ||
      !formData.startTime ||
      !formData.endTime ||
      !formData.repeatFrom ||
      !formData.repeatTo
    ) {
      log("Thiếu dữ liệu cần thiết để gửi booking");
      return;
    }

    const body = {
      profileId: formData.profile._id,
      serviceId: formData.service._id,
      notes: formData.note,
      participants: [],
      repeatFrom: formData.repeatFrom,
      repeatTo: formData.repeatTo,
      timeSlot: {
        start: formData.startTime,
        end: formData.endTime,
      },
    };

    try {
      const result = await createBooking(body);
      log("Booking thành công", result);
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
              formData={formData}
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

// import * as ImagePicker from "expo-image-picker";

// async function pickImageAndUpload() {
//   const result = await ImagePicker.launchImageLibraryAsync({
//     mediaTypes: ImagePicker.MediaTypeOptions.Images,
//     quality: 0.7,
//   });

//   if (!result.canceled) {
//     const imageUri = result.assets[0].uri;
//     const uploadedUrl = await uploadImageToCloudinary(imageUri);
//     if (uploadedUrl) {
//       // Lưu URL ảnh vào form data
//       setFormData((prev) => ({ ...prev, avatar: uploadedUrl }));
//     }
//   }
// }
