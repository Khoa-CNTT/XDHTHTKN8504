import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Button, TextInput } from "react-native-paper";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";
import ServiceModal from "../ServiceModal";

interface AdditionalInfoProps {
  onNext: (data: any) => void;
  defaultValues: any;
}

const ServiceInfo: React.FC<AdditionalInfoProps> = ({
  onNext,
  defaultValues = {},
}) => {
  const [servicePackage, setServicePackage] = useState(
    defaultValues.servicePackage || ""
  );
  const [serviceOption, setServiceOption] = useState("");
  const [startDate, setStartDate] = useState(defaultValues.startDate || "");
  const [endDate, setEndDate] = useState(defaultValues.endDate || "");
  const [startTime, setStartTime] = useState(defaultValues.startTime || "");
  const [duration, setDuration] = useState(defaultValues.duration || "");

  const [isOneDay, setIsOneDay] = useState(true);
  const [serviceType, setServiceType] = useState("");

  const [startDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [endDatePickerVisible, setEndDatePickerVisible] = useState(false);
  const [startTimePickerVisible, setStartTimePickerVisible] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const onSubmit = () => {
    if (!servicePackage || !startDate || !startTime) {
      alert("Vui lòng chọn dịch vụ, ngày và giờ bắt đầu!");
      return;
    }

    if (serviceType === "custom") {
      if (!duration) {
        alert("Vui lòng nhập thời lượng cho gói tùy chọn!");
        return;
      }
      if (!isOneDay && !endDate) {
        alert("Vui lòng chọn ngày kết thúc!");
        return;
      }
    }

    onNext({
      servicePackage,
      serviceOption,
      startDate,
      endDate: isOneDay ? startDate : endDate,
      startTime,
      duration,
      isOneDay,
      serviceType,
    });
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        Thông tin dịch vụ
      </Text>

      {/* Chọn gói dịch vụ */}
      <Text style={styles.label}>Loại gói dịch vụ</Text>
      <View style={styles.buttonGroup}>
        <Button
          onPress={() => setServiceType("available")}
          style={[
            styles.button,
            serviceType === "available"
              ? styles.activeButton
              : styles.inactiveButton,
          ]}
          labelStyle={
            serviceType === "available"
              ? styles.activeButtonText
              : styles.inactiveButtonText
          }
        >
          Gói có sẵn
        </Button>
        <Button
          onPress={() => setServiceType("custom")}
          style={[
            styles.button,
            serviceType === "custom"
              ? styles.activeButton
              : styles.inactiveButton,
          ]}
          labelStyle={
            serviceType === "custom"
              ? styles.activeButtonText
              : styles.inactiveButtonText
          }
        >
          Gói tùy chọn
        </Button>
      </View>

      {/* Loại lịch (chỉ hiện nếu là gói tùy chọn) */}
      {serviceType === "custom" && (
        <>
          <Text style={styles.label}>Loại lịch</Text>
          <View style={styles.buttonGroup}>
            <Button
              onPress={() => setIsOneDay(true)}
              style={[
                styles.button,
                isOneDay ? styles.activeButton : styles.inactiveButton,
              ]}
              labelStyle={
                isOneDay ? styles.activeButtonText : styles.inactiveButtonText
              }
            >
              Một ngày
            </Button>
            <Button
              onPress={() => setIsOneDay(false)}
              style={[
                styles.button,
                !isOneDay ? styles.activeButton : styles.inactiveButton,
              ]}
              labelStyle={
                !isOneDay ? styles.activeButtonText : styles.inactiveButtonText
              }
            >
              Dài ngày
            </Button>
          </View>
        </>
      )}

      {/* Chọn gói dịch vụ */}
      <Text style={styles.label}>Chọn gói dịch vụ</Text>
      <TouchableOpacity onPress={() => setIsModalVisible(true)}>
        <TextInput
          placeholder="Chọn dịch vụ"
          value={servicePackage}
          editable={false}
          style={styles.input}
          left={<TextInput.Icon icon="folder" color="#28a745" />}
        />
      </TouchableOpacity>

      {/* Ngày bắt đầu/kết thúc */}
      <Text style={styles.label}>Ngày bắt đầu và kết thúc</Text>
      <View style={styles.row}>
        <TextInput
          placeholder="Bắt đầu"
          value={startDate}
          onFocus={() => setStartDatePickerVisible(true)}
          style={styles.halfInput}
          left={<TextInput.Icon icon="calendar" color="#28a745" />}
        />
        {serviceType === "custom" && !isOneDay && (
          <TextInput
            placeholder="Kết thúc"
            value={endDate}
            onFocus={() => setEndDatePickerVisible(true)}
            style={styles.halfInput}
            left={<TextInput.Icon icon="calendar" color="#28a745" />}
          />
        )}
      </View>

      {/* Giờ bắt đầu và thời lượng */}
      <Text style={styles.label}>Thời gian</Text>
      <View style={styles.row}>
        <TextInput
          placeholder="Giờ bắt đầu"
          value={startTime}
          onFocus={() => setStartTimePickerVisible(true)}
          style={styles.halfInput}
          left={<TextInput.Icon icon="clock" color="#28a745" />}
        />
        {serviceType === "custom" && (
          <TextInput
            placeholder="Thời lượng"
            value={duration}
            onChangeText={setDuration}
            style={styles.halfInput}
            keyboardType="numeric"
            left={<TextInput.Icon icon="timer" color="#28a745" />}
          />
        )}
      </View>

      {/* Nút tiếp tục */}
      <Button
        onPress={onSubmit}
        mode="contained"
        style={styles.submitButton}
        icon="arrow-right"
      >
        Tiếp tục
      </Button>

      {/* Pickers */}
      <DateTimePickerModal
        isVisible={startDatePickerVisible}
        mode="date"
        onConfirm={(date) => {
          setStartDate(format(date, "yyyy-MM-dd"));
          setStartDatePickerVisible(false);
        }}
        onCancel={() => setStartDatePickerVisible(false)}
      />
      <DateTimePickerModal
        isVisible={endDatePickerVisible}
        mode="date"
        onConfirm={(date) => {
          setEndDate(format(date, "yyyy-MM-dd"));
          setEndDatePickerVisible(false);
        }}
        onCancel={() => setEndDatePickerVisible(false)}
      />
      <DateTimePickerModal
        isVisible={startTimePickerVisible}
        mode="time"
        onConfirm={(date) => {
          setStartTime(format(date, "HH:mm"));
          setStartTimePickerVisible(false);
        }}
        onCancel={() => setStartTimePickerVisible(false)}
      />

      {/* Modal chọn dịch vụ */}
      <ServiceModal
        visible={isModalVisible}
        role="customer"
        onClose={() => setIsModalVisible(false)}
        onSelect={(serviceId) => {
          setServicePackage(serviceId);
          setIsModalVisible(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#222",
  },
  label: {
    fontWeight: "600",
    fontSize: 16,
    marginTop: 16,
    marginBottom: 6,
    color: "#333",
  },
  input: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfInput: {
    flex: 1,
    backgroundColor: "#f5f0f0",
    borderRadius: 12,
    marginBottom: 12,
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  button: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
  },
  activeButton: {
    backgroundColor: "#28a745",
    borderColor: "#28a745",
  },
  inactiveButton: {
    backgroundColor: "#fff",
    borderColor: "#28a745",
  },
  activeButtonText: {
    color: "#fff",
  },
  inactiveButtonText: {
    color: "#28a745",
  },
  submitButton: {
    marginTop: 24,
    backgroundColor: "#28a745",
    borderRadius: 30,
    paddingVertical: 6,
  },
});

export default ServiceInfo;
