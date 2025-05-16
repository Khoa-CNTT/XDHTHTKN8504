import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { Feather } from "@expo/vector-icons";

interface InputDisplayProps {
  icon: string;
  value?: string;
  placeholder?: string;
  onPress?: () => void;
  multiline?: boolean;
  style?: ViewStyle;
}

const InputDisplay: React.FC<InputDisplayProps> = ({
  icon,
  value,
  placeholder,
  onPress,
  multiline = false,
  style,
}) => {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Feather name={icon as any} size={18} color="#666" style={styles.icon} />
      <Text
        style={value ? styles.text : styles.placeholder}
        numberOfLines={multiline ? 2 : 1}
        ellipsizeMode="tail"
      >
        {value || placeholder}
      </Text>
      {onPress && <Feather name="chevron-down" size={22} color="#666" />}
    </Container>
  );
};

export default InputDisplay;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 5
  },
  icon: {
    marginRight: 8,
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: "#111",
  },
  placeholder: {
    flex: 1,
    fontSize: 16,
    fontStyle: "italic",
    color: "#999",
  },
});
