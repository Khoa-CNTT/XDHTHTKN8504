import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Button, TextInput } from "react-native-paper";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Feather from "react-native-vector-icons/Feather";
import ServiceModal from "../ServiceModal";
import PackageModal from "../PackageModal";
import { Service } from "../../types/Service";
import { Package } from "../../types/PackageService";
import { parse, isSameDay, addHours, isBefore, format } from "date-fns";

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

  const [errors, setErrors] = useState({
    service: "",
    package: "",
    date: "",
    time: "",
  });

  const [modals, setModals] = useState({
    service: false,
    package: false,
    datePicker: false,
    timePicker: false,
  });

  const validate = () => {
    const newErrors = { service: "", package: "", date: "", time: "" };
    let valid = true;

    if (!service) {
      newErrors.service = "Vui lòng chọn dịch vụ";
      valid = false;
    }

    if (!packageService) {
      newErrors.package = "Vui lòng chọn gói dịch vụ";
      valid = false;
    }

    if (!startDate) {
      newErrors.date = "Vui lòng chọn ngày";
      valid = false;
    } else {
      const selectedDate = parse(startDate, "yyyy-MM-dd", new Date());
      if (isBefore(selectedDate, new Date().setHours(0, 0, 0, 0))) {
        newErrors.date = "Không thể chọn ngày trong quá khứ";
        valid = false;
      }
    }

    if (!startTime) {
      newErrors.time = "Vui lòng chọn giờ";
      valid = false;
    } else if (startDate) {
      const selectedDateTime = parse(
        `${startDate}T${startTime}`,
        "yyyy-MM-dd'T'HH:mm",
        new Date()
      );
      const now = new Date();
      const isToday = isSameDay(
        parse(startDate, "yyyy-MM-dd", new Date()),
        now
      );

      if (isToday) {
        const oneHourLater = addHours(now, 1);

        if (isBefore(selectedDateTime, oneHourLater)) {
          newErrors.time =
            "Vui lòng chọn giờ ít nhất sau 1 tiếng kể từ thời điểm hiện tại.";
          valid = false;
        }
      }
    }

    setErrors(newErrors);
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

  // Auto-clear lỗi khi người dùng sửa
  useEffect(() => {
    if (service) setErrors((prev) => ({ ...prev, service: "" }));
  }, [service]);

  useEffect(() => {
    if (packageService) setErrors((prev) => ({ ...prev, package: "" }));
  }, [packageService]);

  useEffect(() => {
    if (startDate) setErrors((prev) => ({ ...prev, date: "" }));
  }, [startDate]);

  useEffect(() => {
    if (startTime) setErrors((prev) => ({ ...prev, time: "" }));
  }, [startTime]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông tin dịch vụ</Text>

      {/* Dịch vụ */}
      <Text style={styles.label}>Dịch vụ</Text>
      <TouchableOpacity
        onPress={() => setModals((m) => ({ ...m, service: true }))}
      >
        <TextInput
          placeholder="Chọn dịch vụ"
          value={service?.name || ""}
          editable={false}
          style={styles.input}
          left={
            <TextInput.Icon
              icon={() => <Feather name="shopping-bag" size={20} />}
            />
          }
        />
      </TouchableOpacity>
      {errors.service ? (
        <Text style={styles.errorText}>{errors.service}</Text>
      ) : null}

      {/* Gói dịch vụ */}
      <Text style={styles.label}>Gói dịch vụ</Text>
      <TouchableOpacity
        onPress={() => {
          if (!service) {
            setErrors((prev) => ({
              ...prev,
              service: "Vui lòng chọn dịch vụ trước",
            }));
            return;
          }
          setModals((m) => ({ ...m, package: true }));
        }}
      >
        <TextInput
          placeholder="Chọn gói"
          value={packageService?.name || ""}
          editable={false}
          style={styles.input}
          left={
            <TextInput.Icon icon={() => <Feather name="package" size={20} />} />
          }
        />
      </TouchableOpacity>
      {errors.package ? (
        <Text style={styles.errorText}>{errors.package}</Text>
      ) : null}

      {/* Ngày */}
      <Text style={styles.label}>Ngày bắt đầu</Text>
      <TextInput
        placeholder="Chọn ngày"
        value={startDate}
        onFocus={() => setModals((m) => ({ ...m, datePicker: true }))}
        style={styles.input}
        left={
          <TextInput.Icon icon={() => <Feather name="calendar" size={20} />} />
        }
      />
      {errors.date ? <Text style={styles.errorText}>{errors.date}</Text> : null}

      {/* Giờ */}
      <Text style={styles.label}>Giờ bắt đầu</Text>
      <TextInput
        placeholder="Chọn giờ"
        value={startTime}
        onFocus={() => setModals((m) => ({ ...m, timePicker: true }))}
        style={styles.input}
        left={
          <TextInput.Icon icon={() => <Feather name="clock" size={20} />} />
        }
      />
      {errors.time ? <Text style={styles.errorText}>{errors.time}</Text> : null}

      {/* Nút tiếp tục */}
      <Button
        mode="contained"
        icon="arrow-right"
        style={styles.button}
        onPress={handleNext}
      >
        Tiếp tục
      </Button>

      {/* Pickers */}
      <DateTimePickerModal
        isVisible={modals.datePicker}
        mode="date"
        onConfirm={(date) => {
          setStartDate(format(date, "yyyy-MM-dd"));
          setModals((m) => ({ ...m, datePicker: false }));
        }}
        onCancel={() => setModals((m) => ({ ...m, datePicker: false }))}
      />

      <DateTimePickerModal
        isVisible={modals.timePicker}
        mode="time"
        onConfirm={(time) => {
          setStartTime(format(time, "HH:mm"));
          setModals((m) => ({ ...m, timePicker: false }));
        }}
        onCancel={() => setModals((m) => ({ ...m, timePicker: false }))}
      />

      {/* Modal chọn dịch vụ */}
      <ServiceModal
        visible={modals.service}
        onClose={() => setModals((m) => ({ ...m, service: false }))}
        onSelect={(svc) => {
          setService(svc);
          setPackageService(null);
          setModals((m) => ({ ...m, service: false }));
        }}
      />

      {/* Modal chọn gói */}
      <PackageModal
        visible={modals.package}
        serviceId={service?._id || ""}
        onClose={() => setModals((m) => ({ ...m, package: false }))}
        onSelect={(pkg) => {
          setPackageService(pkg);
          setModals((m) => ({ ...m, package: false }));
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
    paddingVertical:7,
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
