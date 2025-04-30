import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as Location from "expo-location";

export default function BookVisitScreen() {
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  const [pickerMode, setPickerMode] = useState<null | string>(null);

  const showPicker = (mode: string) => setPickerMode(mode);
  const hidePicker = () => setPickerMode(null);

  const handleConfirm = (date: Date) => {
    switch (pickerMode) {
      case "startDate":
        setStartDate(date);
        break;
      case "endDate":
        setEndDate(date);
        break;
      case "startTime":
        setStartTime(date);
        break;
      case "endTime":
        setEndTime(date);
        break;
    }
    hidePicker();
  };

  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;

    const loc = await Location.getCurrentPositionAsync({});
    const address = await Location.reverseGeocodeAsync(loc.coords);
    if (address.length > 0) {
      setLocation(`${address[0].street}, ${address[0].city}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.title}>
        Đặt lịch hẹn
      </Text>

      <TextInput
        label="Địa điểm"
        value={location}
        onChangeText={setLocation}
        right={
          <TextInput.Icon icon="crosshairs-gps" onPress={getCurrentLocation} />
        }
        mode="outlined"
      />

      <TextInput
        label="Ngày bắt đầu"
        value={startDate ? startDate.toLocaleDateString() : ""}
        onFocus={() => showPicker("startDate")}
        mode="outlined"
      />

      <TextInput
        label="Ngày kết thúc"
        value={endDate ? endDate.toLocaleDateString() : ""}
        onFocus={() => showPicker("endDate")}
        mode="outlined"
      />

      <TextInput
        label="Giờ bắt đầu"
        value={
          startTime
            ? startTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : ""
        }
        onFocus={() => showPicker("startTime")}
        mode="outlined"
      />

      <TextInput
        label="Giờ kết thúc"
        value={
          endTime
            ? endTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : ""
        }
        onFocus={() => showPicker("endTime")}
        mode="outlined"
      />

      <Button mode="contained" style={styles.button}>
        Gửi yêu cầu
      </Button>

      <DateTimePickerModal
        isVisible={!!pickerMode}
        mode={pickerMode?.includes("Date") ? "date" : "time"}
        onConfirm={handleConfirm}
        onCancel={hidePicker}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { marginBottom: 16 },
  button: { marginTop: 24 },
});
