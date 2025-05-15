import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Button, TextInput } from "react-native-paper";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format, isBefore, isSameDay, parse } from "date-fns";
import ServiceModal from "../ServiceModal";
import PackageModal from "../PackageModal";
import { Service } from "../../types/Service";
import { Package } from "../../types/PackageService";

interface Props {
  onNext: (data: {
    service: Service;
    packageService: Package;
    startTime: string;
  }) => void;
  defaultValues?: {
    service?: Service | null;
    packageService?: Package | null;
    startTime?: string;
  };
}

const ServiceInfo: React.FC<Props> = ({ onNext, defaultValues = {} }) => {
  const [service, setService] = useState<Service | null>(
    defaultValues.service || null
  );
  const [packageService, setPackageService] = useState<Package | null>(
    defaultValues.packageService || null
  );

  const [startDate, setStartDate] = useState(
    defaultValues.startTime?.split("T")[0] || ""
  );
  const [startTime, setStartTime] = useState(
    defaultValues.startTime?.split("T")[1] || ""
  );

  const [errorService, setErrorService] = useState("");
  const [errorPackage, setErrorPackage] = useState("");
  const [errorDate, setErrorDate] = useState("");
  const [errorTime, setErrorTime] = useState("");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isServiceModalVisible, setServiceModalVisible] = useState(false);
  const [isPackageModalVisible, setPackageModalVisible] = useState(false);

  const validate = () => {
    let valid = true;

    if (!service) {
      setErrorService("Vui lòng chọn dịch vụ");
      valid = false;
    } else {
      setErrorService("");
    }

    if (!packageService) {
      setErrorPackage("Vui lòng chọn gói dịch vụ");
      valid = false;
    } else {
      setErrorPackage("");
    }

    if (!startDate) {
      setErrorDate("Vui lòng chọn ngày");
      valid = false;
    } else {
      const selectedDate = parse(startDate, "yyyy-MM-dd", new Date());
      if (isBefore(selectedDate, new Date().setHours(0, 0, 0, 0))) {
        setErrorDate("Không thể chọn ngày trong quá khứ");
        valid = false;
      } else {
        setErrorDate("");
      }
    }

    if (!startTime) {
      setErrorTime("Vui lòng chọn giờ");
      valid = false;
    } else if (startDate) {
      const selectedTime = parse(
        `${startDate}T${startTime}`,
        "yyyy-MM-dd'T'HH:mm",
        new Date()
      );
      const now = new Date();
      if (isSameDay(parse(startDate, "yyyy-MM-dd", new Date()), now)) {
        const minTime = new Date();
        const maxTime = new Date();
        maxTime.setHours(minTime.getHours() + 1);
        if (
          isBefore(selectedTime, minTime) ||
          isBefore(maxTime, selectedTime)
        ) {
          setErrorTime("Thời gian phải trong vòng 1 giờ tới");
          valid = false;
        } else {
          setErrorTime("");
        }
      } else {
        setErrorTime("");
      }
    }

    return valid;
  };

  const handleNext = () => {
    if (!validate()) return;
    onNext({
      service: service!,
      packageService: packageService!,
      startTime: `${startDate}T${startTime}`,
    });
  };

  useEffect(() => {
    if (service) setErrorService("");
  }, [service]);

  useEffect(() => {
    if (packageService) setErrorPackage("");
  }, [packageService]);

  useEffect(() => {
    if (startDate) setErrorDate("");
  }, [startDate]);

  useEffect(() => {
    if (startTime) setErrorTime("");
  }, [startTime]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông tin dịch vụ</Text>

      <Text style={styles.label}>Dịch vụ</Text>
      <TouchableOpacity onPress={() => setServiceModalVisible(true)}>
        <TextInput
          placeholder="Chọn dịch vụ"
          value={service?.name || ""}
          editable={false}
          style={styles.input}
          left={<TextInput.Icon icon="briefcase" />}
        />
      </TouchableOpacity>
      {errorService ? (
        <Text style={styles.errorText}>{errorService}</Text>
      ) : null}

      <Text style={styles.label}>Gói dịch vụ</Text>
      <TouchableOpacity
        onPress={() => {
          if (!service) {
            setErrorService("Vui lòng chọn dịch vụ trước");
            return;
          }
          setPackageModalVisible(true);
        }}
      >
        <TextInput
          placeholder="Chọn gói"
          value={packageService?.name || ""}
          editable={false}
          style={styles.input}
          left={<TextInput.Icon icon="folder" />}
        />
      </TouchableOpacity>
      {errorPackage ? (
        <Text style={styles.errorText}>{errorPackage}</Text>
      ) : null}

      <Text style={styles.label}>Ngày bắt đầu</Text>
      <TextInput
        placeholder="Chọn ngày"
        value={startDate}
        onFocus={() => setShowDatePicker(true)}
        style={styles.input}
        left={<TextInput.Icon icon="calendar" />}
      />
      {errorDate ? <Text style={styles.errorText}>{errorDate}</Text> : null}

      <Text style={styles.label}>Giờ bắt đầu</Text>
      <TextInput
        placeholder="Chọn giờ"
        value={startTime}
        onFocus={() => setShowTimePicker(true)}
        style={styles.input}
        left={<TextInput.Icon icon="clock" />}
      />
      {errorTime ? <Text style={styles.errorText}>{errorTime}</Text> : null}

      <Button
        mode="contained"
        icon="arrow-right"
        style={styles.button}
        onPress={handleNext}
      >
        Tiếp tục
      </Button>

      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="date"
        onConfirm={(date) => {
          setStartDate(format(date, "yyyy-MM-dd"));
          setShowDatePicker(false);
        }}
        onCancel={() => setShowDatePicker(false)}
      />

      <DateTimePickerModal
        isVisible={showTimePicker}
        mode="time"
        onConfirm={(time) => {
          setStartTime(format(time, "HH:mm"));
          setShowTimePicker(false);
        }}
        onCancel={() => setShowTimePicker(false)}
      />

      <ServiceModal
        visible={isServiceModalVisible}
        onClose={() => setServiceModalVisible(false)}
        onSelect={(svc) => {
          setService(svc);
          setPackageService(null);
          setServiceModalVisible(false);
        }}
      />

      <PackageModal
        visible={isPackageModalVisible}
        serviceId={service?._id || ""}
        onClose={() => setPackageModalVisible(false)}
        onSelect={(pkg) => {
          setPackageService(pkg);
          setPackageModalVisible(false);
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
    marginBottom: 16,
    color: "#222",
  },
  label: {
    marginTop: 16,
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    marginBottom: 4,
  },
  button: {
    marginTop: 32,
    borderRadius: 24,
    backgroundColor: "#28a745",
  },
  errorText: {
    color: "#e53935",
    fontSize: 13,
    marginBottom: 8,
  },
});

export default ServiceInfo;
