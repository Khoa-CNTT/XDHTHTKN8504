import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

interface IncomeCardProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap; // Đảm bảo chỉ nhận các icon hợp lệ
  income: string;
  color?: string;
  onPress?: () => void;
}

const IncomeCard: React.FC<IncomeCardProps> = ({
  title,
  icon,
  income,
  color = "green",
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={styles.card}>
        <Card.Title
          title={title}
          left={() => <Ionicons name={icon as any} size={24} color={color} />} // Cast icon
        />
        <Card.Content>
          <Text style={[styles.income, { color }]}>{income}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    borderRadius: 20,
  },
  income: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default IncomeCard;
