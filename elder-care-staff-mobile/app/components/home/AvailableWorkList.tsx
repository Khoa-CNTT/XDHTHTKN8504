import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Card, Divider } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import useScheduleStore from "../../stores/scheduleStore";
import { router } from "expo-router";

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

  return (
    <ScrollView>
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
          {todayJobs.length === 0 ? (
            <Text style={styles.emptyText}>
              Không có công việc trong hôm nay
            </Text>
          ) : (
            todayJobs.map((job, index) => (
              <View key={job._id}>
                <TouchableOpacity
                  onPress={() =>
                    router.push(`/screens/schedule-detail/${job._id}`)
                  }
                >
                  <View style={styles.jobItem}>
                    <Ionicons
                      name="location-outline"
                      size={20}
                      color="#007bff"
                      style={styles.icon}
                    />
                    <View style={styles.jobInfo}>
                      <Text style={styles.jobTitle}>{job.patientName}</Text>
                      <Text style={styles.jobSubtitle}>
                        {job.serviceName} -{" "}
                        {new Date(job.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                {index < todayJobs.length - 1 && (
                  <Divider style={styles.divider} />
                )}
              </View>
            ))
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
  },
  divider: {
    marginVertical: 5,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 10,
  },
  icon: {
    marginRight: 10, // Đảm bảo các icon thẳng hàng với nội dung
  },
});

export default AvailableWorkList;
