import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const StepPersonalDetails = () => {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [careNote, setCareNote] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Họ và tên</Text>
        <View style={styles.inputWrapper}>
          <MaterialIcons
            name="person"
            size={20}
            color="#777"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Nhập họ và tên"
            placeholderTextColor="#aaa"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>
      </View>

      {/* Số điện thoại */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Số điện thoại</Text>
        <View style={styles.inputWrapper}>
          <MaterialIcons
            name="phone"
            size={20}
            color="#777"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Nhập số điện thoại"
            placeholderTextColor="#aaa"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>
      </View>

      {/* Địa chỉ */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Địa chỉ</Text>
        <View style={styles.inputWrapper}>
          <MaterialIcons
            name="location-on"
            size={20}
            color="#777"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Nhập địa chỉ"
            placeholderTextColor="#aaa"
            value={address}
            onChangeText={setAddress}
          />
        </View>
      </View>

      {/* Lưu ý chăm sóc */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Địa chỉ</Text>
        <View style={styles.inputWrapper}>
          <MaterialIcons
            name="location-on"
            size={20}
            color="#777"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Nhập địa chỉ"
            placeholderTextColor="#aaa"
            value={address}
            onChangeText={setAddress}
          />
        </View>
      </View>
    </View>
  );
};

export default StepPersonalDetails;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 60,
    backgroundColor: "#fff",
    borderRadius: 50,
    gap: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 12,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#222",
    paddingVertical: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
});
