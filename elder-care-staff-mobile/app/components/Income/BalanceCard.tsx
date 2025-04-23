import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface BalanceCardProps {
  salary: number;
  completed: number;
  distance: string;
}

const BalanceCard: React.FC<BalanceCardProps> = ({
  salary,
  completed,
  distance,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.todayText}>Tháng này</Text>
      <Text style={styles.amountText}>{salary} VND</Text>
      <View style={styles.infoRow}>
        <View style={styles.infoBox}>
          <Text style={styles.infoValue}>{completed}</Text>
          <Text style={styles.infoLabel}>Hoàn thành</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoValue}>{distance}</Text>
          <Text style={styles.infoLabel}>Distance</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    marginTop: -50,
    borderRadius: 20,
    padding: 25,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  todayText: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
  },
  amountText: {
    fontSize: 38,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 12,
    color: "#28A745",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  infoBox: {
    alignItems: "center",
    flex: 1,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    paddingVertical: 12,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  infoValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#28A745",
  },
  infoLabel: {
    fontSize: 14,
    color: "#888",
  },
});

export default BalanceCard;
