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

const InputPicker = ({
  label,
  value,
  placeholder,
  icon,
  onPress,
  error,
}: {
  label: string;
  value?: string;
  placeholder: string;
  icon: string;
  onPress: () => void;
  error?: string;
}) => (
  <>
    <Text style={styles.label}>{label}</Text>
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={styles.inputFake}>
        <Feather
          name={icon}
          size={18}
          color="#777"
          style={{ marginRight: 8 }}
        />
        <Text style={{ color: value ? "#000" : "#aaa", fontSize: 16 }}>
          {value || placeholder}
        </Text>
      </View>
    </TouchableOpacity>
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </>
);

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

  // Clear errors
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

      <InputPicker
        label="Dịch vụ"
        value={service?.name}
        placeholder="Chọn dịch vụ"
        icon="shopping-bag"
        onPress={() => setModals((m) => ({ ...m, service: true }))}
        error={errors.service}
      />

      <InputPicker
        label="Gói dịch vụ"
        value={packageService?.name}
        placeholder="Chọn gói"
        icon="package"
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
        error={errors.package}
      />

      <InputPicker
        label="Ngày bắt đầu"
        value={startDate}
        placeholder="Chọn ngày"
        icon="calendar"
        onPress={() => setModals((m) => ({ ...m, datePicker: true }))}
        error={errors.date}
      />

      <InputPicker
        label="Giờ bắt đầu"
        value={startTime}
        placeholder="Chọn giờ"
        icon="clock"
        onPress={() => setModals((m) => ({ ...m, timePicker: true }))}
        error={errors.time}
      />

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

      <ServiceModal
        visible={modals.service}
        onClose={() => setModals((m) => ({ ...m, service: false }))}
        onSelect={(svc) => {
          setService(svc);
          setPackageService(null);
          setModals((m) => ({ ...m, service: false }));
        }}
      />
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
    backgroundColor: "#fefefe",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e1e1e",
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 6,
    marginTop: 12,
  },
  inputFake: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 16,
    marginBottom: 5
  },
  errorText: {
    color: "#e53935",
    fontSize: 13,
    marginTop: 4,
  },
  button: {
    marginTop: 36,
    paddingVertical: 7,
    borderRadius: 28,
    backgroundColor: "#28a745",
    elevation: 2,
  },
});

export default ServiceInfo;
