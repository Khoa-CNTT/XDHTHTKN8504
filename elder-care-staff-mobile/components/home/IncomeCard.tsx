import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";

// Định nghĩa kiểu cho props
interface InfoCardProps {
  value: string | number; // Kiểu dữ liệu của value có thể là string hoặc number
  label: string; // label là string
  icon: React.ReactNode; // icon là một React component (node)
  color: string; // color là một chuỗi (string)
}

const InfoCard: React.FC<InfoCardProps> = ({ value, label, icon, color }) => {
  return (
    <View style={styles.infoCard}>
      <Text style={styles.infoValue}>
        {typeof value === "number" && value > 100
          ? value.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })
          : value}
      </Text>
      <Text style={styles.infoLabel}>{label}</Text>
      <View style={[styles.iconContainer, { borderColor: color }]}>{icon}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  infoCard: {
    backgroundColor: "#fff",
    width: "45%",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "flex-start",
  },
  infoValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  infoLabel: {
    fontSize: 14,
    color: "#777",
    marginBottom: 8,
  },
  iconContainer: {
    padding: 2,
    borderRadius: 8,
    marginTop: 4,
  },
});

export default InfoCard;
