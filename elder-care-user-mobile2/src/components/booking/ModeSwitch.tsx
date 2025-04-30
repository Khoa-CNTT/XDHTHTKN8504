// components/ModeSwitch.tsx
import React from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";

interface ModeSwitchProps {
  mode: "single" | "range";
  setMode: React.Dispatch<React.SetStateAction<"single" | "range">>;
}

const ModeSwitch: React.FC<ModeSwitchProps> = ({ mode, setMode }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setMode("single")}
        style={[styles.button, mode === "single" && styles.selectedButton]}
      >
        <Text style={mode === "single" ? styles.selectedText : undefined}>
          Một ngày
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setMode("range")}
        style={[styles.button, mode === "range" && styles.selectedButton]}
      >
        <Text style={mode === "range" ? styles.selectedText : undefined}>
          Khoảng thời gian
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  button: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  selectedButton: {
    backgroundColor: "#28A745",
    borderColor: "#28A745",
  },
  selectedText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ModeSwitch;
