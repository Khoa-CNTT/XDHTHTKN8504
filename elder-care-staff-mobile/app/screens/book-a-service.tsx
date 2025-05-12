import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PersonaInfoStep from "@/components/booking/PersonalInfoStep";
import ServiceStep from "@/components/booking/ServiceStep";

const steps = ["Thông tin", "Dịch vụ", "Xác nhận"];

const UploadKYCScreen = () => {
  const [step, setStep] = useState(0);

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return <PersonaInfoStep />;
      case 1:
        return <ServiceStep />;
      case 2:
        return <Text>Xác nhận thông tin</Text>; // Tạm placeholder
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setStep(step - 1)}
            disabled={step === 0}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={step === 0 ? "#ccc" : "black"}
            />
          </TouchableOpacity>
          <Text style={styles.title}>Đặt Lịch Hẹn</Text>
          <TouchableOpacity>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Step Indicators */}
        <View style={styles.stepIndicator}>
          {steps.map((label, index) => (
            <View key={index} style={styles.stepItem}>
              <Text
                style={[
                  styles.stepLabel,
                  step === index
                    ? styles.activeStep
                    : index < step
                    ? styles.completedStep
                    : styles.inactiveStep,
                ]}
              >
                {label}
              </Text>
              <View
                style={[
                  styles.stepLine,
                  step === index
                    ? styles.activeLine
                    : index < step
                    ? styles.completedLine
                    : styles.inactiveLine,
                ]}
              />
            </View>
          ))}
        </View>

        {/* Step Content */}
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>{renderStepContent()}</View>
        </ScrollView>
        
      </View>
    </KeyboardAvoidingView>
  );
};

export default UploadKYCScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    paddingTop: 30,
    backgroundColor: "#faf8f8",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  stepIndicator: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 30,
    marginBottom: 20,
  },
  stepItem: {
    alignItems: "center",
    flex: 1,
  },
  stepLabel: {
    fontSize: 14,
  },
  stepLine: {
    marginTop: 5,
    height: 5,
    width: "90%",
    borderRadius: 2,
  },
  activeStep: {
    color: "#28a745",
    fontWeight: "bold",
  },
  completedStep: {
    color: "#28a745",
  },
  inactiveStep: {
    color: "#ccc",
  },
  activeLine: {
    backgroundColor: "#28a745",
  },
  completedLine: {
    backgroundColor: "#28a745",
  },
  inactiveLine: {
    backgroundColor: "#ccc",
  },
  content: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  nextButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    margin: 10,
  },
  nextText: {
    color: "white",
    fontWeight: "bold",
  },
});
