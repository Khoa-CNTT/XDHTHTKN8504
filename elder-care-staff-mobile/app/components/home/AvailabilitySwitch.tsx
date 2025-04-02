import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";

const AvailabilitySwitch = ({
  isAvailable,
  setIsAvailable,
}: {
  isAvailable: boolean;
  setIsAvailable: (value: boolean) => void;
}) => {
  return (
    <View style={styles.statusContainer}>
      <Text style={styles.statusText}>Sẵn sàng nhận ca</Text>
      <Switch value={isAvailable} onValueChange={setIsAvailable} />
    </View>
  );
};

const styles = StyleSheet.create({
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderRadius: 20,
    margin: 10,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AvailabilitySwitch;
