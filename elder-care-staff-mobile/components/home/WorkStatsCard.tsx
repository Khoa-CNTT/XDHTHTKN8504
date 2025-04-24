import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import useScheduleStore from "../../stores/scheduleStore"; // Đảm bảo nhập đúng path

const WorkStatsCard = () => {
  const { schedules } = useScheduleStore(); // Lấy danh sách lịch từ store
  const router = useRouter();

  const scheduledWork = schedules.filter(
    (schedule) =>
      schedule.status === "scheduled"
  );

  return (
    <TouchableOpacity onPress={() => router.push("/screens/tabs/schedule")}>
      <Card style={styles.card}>
        <Card.Title
          titleStyle={{ fontSize: 16, fontWeight: "bold" }}
          title="Số công việc đang lên lịch"
          left={() => (
            <Ionicons name="stats-chart-outline" size={24} color="purple" />
          )}
        />
        <Card.Content>
          <Text style={styles.stats}>{scheduledWork.length} ca</Text>
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
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default WorkStatsCard;
