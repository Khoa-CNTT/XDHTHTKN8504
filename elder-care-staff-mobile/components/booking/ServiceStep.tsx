import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Text, Button } from "react-native-paper";

export default function ServiceStep() {
  const [isCustomPackage, setIsCustomPackage] = useState(true);
  const [isOneDayPackage, setIsOneDayPackage] = useState(true);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [repeat, setRepeat] = useState("");
  const [careTime, setCareTime] = useState("");
  const [careHours, setCareHours] = useState("");
  const [selectedService, setSelectedService] = useState("");

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.title}>Service Package</Text>

        {/* Gói dịch vụ */}
        <View style={styles.buttonGroup}>
          <Button
            mode={isCustomPackage ? "contained" : "outlined"}
            onPress={() => setIsCustomPackage(true)}
            style={styles.packageButton}
          >
            Custom Package
          </Button>
          <Button
            mode={!isCustomPackage ? "contained" : "outlined"}
            onPress={() => setIsCustomPackage(false)}
            style={styles.packageButton}
          >
            Predefined Package
          </Button>
        </View>

        {/* Package Duration (ẩn nếu chọn Predefined) */}
        {isCustomPackage && (
          <>
            <Text style={styles.label}>Package Duration</Text>
            <View style={styles.buttonGroup}>
              <Button
                mode={isOneDayPackage ? "contained" : "outlined"}
                onPress={() => setIsOneDayPackage(true)}
                style={styles.packageButton}
              >
                1 Day
              </Button>
              <Button
                mode={!isOneDayPackage ? "contained" : "outlined"}
                onPress={() => setIsOneDayPackage(false)}
                style={styles.packageButton}
              >
                Multi-Day
              </Button>
            </View>
          </>
        )}

        {/* Ngày */}
        <Text style={styles.label}>Booking Date(s)</Text>
        <TextInput
          label={isOneDayPackage ? "Booking Date" : "Start Date"}
          value={startDate}
          onChangeText={setStartDate}
          style={styles.input}
          mode="outlined"
          outlineColor="#cce6cc"
          activeOutlineColor="#28a745"
        />
        {isCustomPackage && !isOneDayPackage && (
          <TextInput
            label="End Date"
            value={endDate}
            onChangeText={setEndDate}
            style={styles.input}
            mode="outlined"
            outlineColor="#cce6cc"
            activeOutlineColor="#28a745"
          />
        )}

        {/* Lặp lại */}
        {isCustomPackage && (
          <>
            <Text style={styles.label}>Repeat</Text>
            <TextInput
              label="Repeat (e.g., Every Monday)"
              value={repeat}
              onChangeText={setRepeat}
              style={styles.input}
              mode="outlined"
              outlineColor="#cce6cc"
              activeOutlineColor="#28a745"
            />
          </>
        )}

        {/* Thời gian */}
        <Text style={styles.label}>Care Time</Text>
        <TextInput
          label="Time of Day (e.g., 9:00 AM)"
          value={careTime}
          onChangeText={setCareTime}
          style={styles.input}
          mode="outlined"
          outlineColor="#cce6cc"
          activeOutlineColor="#28a745"
        />

        {/* Giờ chăm sóc */}
        {isCustomPackage && (
          <>
            <Text style={styles.label}>Care Hours</Text>
            <TextInput
              label="Duration in Hours"
              value={careHours}
              onChangeText={setCareHours}
              style={styles.input}
              keyboardType="numeric"
              mode="outlined"
              outlineColor="#cce6cc"
              activeOutlineColor="#28a745"
            />
          </>
        )}

        {/* Dịch vụ */}
        <Text style={styles.label}>Choose a Service</Text>
        {/* Bạn có thể thêm dropdown hoặc radio group tại đây */}

        <Button mode="outlined" style={styles.backButton}>
          Back
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: 16,
  },
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#28a745",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
    marginTop: 12,
    color: "#555",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  packageButton: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  input: {
    marginBottom: 12,
    backgroundColor: "#f5fff5",
    borderRadius: 10,
  },
  backButton: {
    marginTop: 24,
    borderRadius: 8,
    borderColor: "#28a745",
  },
});
