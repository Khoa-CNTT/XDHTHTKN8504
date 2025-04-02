import React, { useEffect, useState } from "react";
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
import { useNavigation } from "@react-navigation/native";

interface Job {
  id: string;
  name: string;
  location: string;
  time: string;
  status: string;
}

const mockData: Job[] = [
  {
    id: "1",
    name: "Chăm sóc ông A",
    location: "Hà Nội",
    time: "08:00",
    status: "Pending_staff",
  },
  {
    id: "2",
    name: "Hỗ trợ bà B",
    location: "TP.HCM",
    time: "10:00",
    status: "Pending_staff",
  },
  {
    id: "3",
    name: "Chăm sóc cụ C",
    location: "Đà Nẵng",
    time: "14:00",
    status: "Pending_staff",
  },
  {
    id: "4",
    name: "Chăm sóc cụ C",
    location: "Đà Nẵng",
    time: "14:00",
    status: "Pending_staff",
  },
  {
    id: "5",
    name: "Chăm sóc cụ C",
    location: "Đà Nẵng",
    time: "14:00",
    status: "Pending_staff",
  },
  {
    id: "6",
    name: "Chăm sóc cụ C",
    location: "Đà Nẵng",
    time: "14:00",
    status: "Pending_staff",
  },
];

const AvailableWorkList = () => {
  const navigation = useNavigation();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const filteredJobs = mockData.filter(
        (job) => job.status === "Pending_staff"
      );
      setJobs(filteredJobs);
      setLoading(false);
    }, 1500);
  }, []);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
    );
  }

  return (
    <ScrollView>
      <Card style={styles.card}>
        <Card.Title
          title="Công việc khả dụng"
          left={() => (
            <Ionicons name="briefcase-outline" size={24} color="#007bff" />
          )}
        />
        <Card.Content>
          {jobs.length === 0 ? (
            <Text style={styles.emptyText}>Không có công việc khả dụng</Text>
          ) : (
            jobs.map((job, index) => (
              <View key={job.id}>
                <TouchableOpacity
                // onPress={() =>
                //   navigation.navigate("WorkDetail", { workId: job.id })
                // }
                >
                  <View style={styles.jobItem}>
                    <Ionicons
                      name="location-outline"
                      size={20}
                      color="#007bff"
                    />
                    <View style={styles.jobInfo}>
                      <Text style={styles.jobTitle}>{job.name}</Text>
                      <Text style={styles.jobSubtitle}>
                        {job.location} - {job.time}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                {index < jobs.length - 1 && <Divider style={styles.divider} />}
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
    elevation: 3, // Hiệu ứng đổ bóng
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
    fontWeight: "bold",
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
});

export default AvailableWorkList;
