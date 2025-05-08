import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { Card, Divider } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import useScheduleStore from "../../stores/scheduleStore";
import { router } from "expo-router";
import { Schedule } from "@/types/Schedule";

const AvailableWorkList = () => {
  const schedules = useScheduleStore((state) => state.schedules);

  const today = new Date();
  const todayStr = today.toDateString();

  const todayJobs = schedules.filter((job) => {
    const jobDateStr = new Date(job.date).toDateString();
    return jobDateStr === todayStr;
  });

  if (!schedules.length) {
    return (
      <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
    );
  }

  const renderItem = ({ item }: { item: Schedule }) => (
    <TouchableOpacity
      key={item._id}
      onPress={() => router.push(`/screens/schedule-detail/${item._id}`)}
    >
      <View style={styles.jobItem}>
        <Ionicons
          name="location-outline"
          size={20}
          color="#007bff"
          style={styles.icon}
        />
        <View style={styles.jobInfo}>
          <Text style={styles.jobTitle}>{item.patientName}</Text>
          <Text style={styles.jobSubtitle}>{item.serviceName}</Text>
        </View>
      </View>
      <Divider style={styles.divider} />
    </TouchableOpacity>
  );

  const ListHeader = () => (
    <Card style={styles.card}>
      <Card.Title
        titleStyle={{ fontSize: 16, fontWeight: "bold" }}
        title="Công việc hôm nay"
        left={() => (
          <Ionicons
            name="calendar-outline"
            size={24}
            color="#007bff"
            style={styles.icon}
          />
        )}
      />
      <Card.Content>
        {todayJobs.length === 0 && (
          <Text style={styles.emptyText}>Không có công việc trong hôm nay</Text>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={todayJobs}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={{ paddingBottom: 20 }}
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        windowSize={5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 10,
    borderRadius: 20,
    backgroundColor: "#fff",
    elevation: 3,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  jobItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  jobInfo: {
    marginLeft: 10,
  },
  jobTitle: {
    fontSize: 16,
  },
  jobSubtitle: {
    fontSize: 14,
    color: "#666",
    flexWrap: "wrap",
    width: 300,
    flexShrink: 1,
  },
  divider: {
    marginVertical: 5,
    marginHorizontal: 16,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 10,
  },
  icon: {
    marginRight: 10,
  },
});

export default AvailableWorkList;
