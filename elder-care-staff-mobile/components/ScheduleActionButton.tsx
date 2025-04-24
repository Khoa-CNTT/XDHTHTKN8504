import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { ScheduleStatus } from "../types/ScheduleStatus";

interface Props {
  title: string;
  status: ScheduleStatus;
  onStatusChange: (status: ScheduleStatus) => void;
  isTooEarly: () => boolean;
  onTooEarly: () => void;
}

const ScheduleActionButton: React.FC<Props> = ({
  title,
  status,
  onStatusChange,
  isTooEarly,
  onTooEarly,
}) => {
  const handlePress = () => {
    if (isTooEarly()) {
      onTooEarly();
    } else {
      onStatusChange(status);
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

export default ScheduleActionButton;

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
  },
  text: {
    color: "white",
    textAlign: "center",
    padding: 10,
    fontWeight: "bold",
  },
});
