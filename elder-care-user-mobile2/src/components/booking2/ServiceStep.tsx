import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Button, TextInput } from "react-native-paper";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";
import ServiceModal from "../ServiceModal";
import PackageModal from "../PackageModal";
import {  Package } from "../../types/PackageService"; 
import {Service} from "../../types/Service";

interface AdditionalInfoProps {
  onNext: (data: {
    service: Service;
    packageService: Package;
    startTime: string;
  }) => void;
  defaultValues: {
    service?: Service | null;
    packageService?: Package | null;
    startTime?: string;
  };
}

const ServiceInfo: React.FC<AdditionalInfoProps> = ({
  onNext,
  defaultValues = {},
}) => {
  const [service, setService] = useState<Service | null>(
    defaultValues?.service || null
  );
  const [packageService, setPackageService] = useState<Package | null>(
    defaultValues?.packageService || null
  );

  // Parse start date and time if startTime exists
  const defaultDate = defaultValues.startTime
    ? defaultValues.startTime.split("T")[0]
    : "";
  const defaultTime = defaultValues.startTime
    ? defaultValues.startTime.split("T")[1]
    : "";

  const [startDate, setStartDate] = useState(defaultDate);
  const [startTime, setStartTime] = useState(defaultTime);

  const [startDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [startTimePickerVisible, setStartTimePickerVisible] = useState(false);

  const [isServiceModalVisible, setIsServiceModalVisible] = useState(false);
  const [isPackageModalVisible, setIsPackageModalVisible] = useState(false);

  const onSubmit = () => {
    if (!service || !packageService || !startDate || !startTime) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    onNext({
      service,
      packageService,
      startTime: `${startDate}T${startTime}`,
    });
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        Thông tin dịch vụ
      </Text>

      {/* Tên dịch vụ */}
      <Text style={styles.label}>Tên dịch vụ</Text>
      <TouchableOpacity onPress={() => setIsServiceModalVisible(true)}>
        <TextInput
          placeholder="Chọn dịch vụ"
          value={service?.name || ""}
          editable={false}
          style={styles.input}
          left={<TextInput.Icon icon="briefcase" color="#28a745" />}
        />
      </TouchableOpacity>

      {/* Gói dịch vụ */}
      <Text style={styles.label}>Gói dịch vụ</Text>
      <TouchableOpacity
        onPress={() => {
          if (!service) {
            alert("Vui lòng chọn dịch vụ trước");
            return;
          }
          setIsPackageModalVisible(true);
        }}
      >
        <TextInput
          placeholder="Chọn gói"
          value={packageService?.name || ""}
          editable={false}
          style={styles.input}
          left={<TextInput.Icon icon="folder" color="#28a745" />}
        />
      </TouchableOpacity>

      {/* Ngày bắt đầu */}
      <Text style={styles.label}>Ngày bắt đầu</Text>
      <TextInput
        placeholder="Chọn ngày"
        value={startDate}
        onFocus={() => setStartDatePickerVisible(true)}
        style={styles.input}
        left={<TextInput.Icon icon="calendar" color="#28a745" />}
      />

      {/* Giờ bắt đầu */}
      <Text style={styles.label}>Giờ bắt đầu</Text>
      <TextInput
        placeholder="Chọn giờ"
        value={startTime}
        onFocus={() => setStartTimePickerVisible(true)}
        style={styles.input}
        left={<TextInput.Icon icon="clock" color="#28a745" />}
      />

      <Button
        onPress={onSubmit}
        mode="contained"
        style={styles.submitButton}
        icon="arrow-right"
      >
        Tiếp tục
      </Button>

      {/* Date pickers */}
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
        visible={isServiceModalVisible}
        onClose={() => setIsServiceModalVisible(false)}
        onSelect={(selectedService) => {
          setService(selectedService);
          setPackageService(null); // Reset package
          setIsServiceModalVisible(false);
        }}
      />

      {/* Modal chọn gói dịch vụ */}
      <PackageModal
        visible={isPackageModalVisible}
        serviceId={service?._id || ""}
        onClose={() => setIsPackageModalVisible(false)}
        onSelect={(pkg) => {
          setPackageService(pkg);
          setIsPackageModalVisible(false);
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
  submitButton: {
    marginTop: 24,
    backgroundColor: "#28a745",
    borderRadius: 30,
    paddingVertical: 6,
  },
});

export default ServiceInfo;
