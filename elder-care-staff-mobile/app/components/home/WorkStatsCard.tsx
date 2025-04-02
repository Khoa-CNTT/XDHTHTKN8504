import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const WorkStatsCard = ({ workHistory }: { workHistory: number }) => {
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.push("/screens/WorkScreen")}>
      <Card style={styles.card}>
        <Card.Title
          title="Số ca đã làm trong tuần"
          left={() => (
            <Ionicons name="stats-chart-outline" size={24} color="purple" />
          )}
        />
        <Card.Content>
          <Text style={styles.stats}>{workHistory} ca</Text>
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
  stats: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default WorkStatsCard;

