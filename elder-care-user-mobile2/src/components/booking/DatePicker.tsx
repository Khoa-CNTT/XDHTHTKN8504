// components/DatePicker.tsx
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { CalendarDays } from "lucide-react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

interface DatePickerProps {
  mode: "single" | "range";
  selectedDate: Date | null;
  startDate: Date | null;
  endDate: Date | null;
  showDatePicker: boolean;
  setShowDatePicker: React.Dispatch<React.SetStateAction<boolean>>;
  setMode: (mode: "single" | "range") => void;
  handleDateConfirm: (date: Date) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({
  mode,
  selectedDate,
  startDate,
  endDate,
  showDatePicker,
  setShowDatePicker,
  setMode,
  handleDateConfirm,
}) => {
  return (
    <>
      <TouchableOpacity
        style={styles.datePickerContainer}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.text}>
          {mode === "single"
            ? selectedDate
              ? selectedDate.toLocaleDateString()
              : "Chọn ngày"
            : startDate && endDate
            ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
            : startDate
            ? `${startDate.toLocaleDateString()} - ...`
            : "Chọn khoảng ngày"}
        </Text>
        <CalendarDays size={20} />
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={() => setShowDatePicker(false)}
        minimumDate={new Date()}
        buttonTextColorIOS="#28A745"
        confirmTextIOS="Xác nhận"
        cancelTextIOS="Huỷ"
        isDarkModeEnabled={false}
      />
    </>
  );
};

const styles = StyleSheet.create({
  datePickerContainer: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    fontSize: 14,
    color: "#333",
  },
});

export default DatePicker;
