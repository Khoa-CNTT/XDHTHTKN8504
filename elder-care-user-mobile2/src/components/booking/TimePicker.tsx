// components/TimePicker.tsx
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Clock } from "lucide-react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

interface TimePickerProps {
  title: string;
  time: Date | null;
  showTimePicker: boolean;
  setShowTimePicker: React.Dispatch<React.SetStateAction<boolean>>;
  setTime: (time: Date) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({
  title,
  time,
  showTimePicker,
  setShowTimePicker,
  setTime,
}) => {
  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={() => setShowTimePicker(true)}
      >
        <Text style={styles.content}>{`${title}: ${time ? time.toLocaleTimeString() : "--:--"}`}</Text>
        <Clock size={20} />
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={showTimePicker}
        mode="time"
        onConfirm={(date) => {
          setTime(date);
          setShowTimePicker(false);
        }}
        onCancel={() => setShowTimePicker(false)}
        isDarkModeEnabled={false}
        buttonTextColorIOS="#28A745"
        confirmTextIOS="Xác nhận"
        cancelTextIOS="Huỷ"
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  content: {
    fontSize: 14, 
  }
});

export default TimePicker;
