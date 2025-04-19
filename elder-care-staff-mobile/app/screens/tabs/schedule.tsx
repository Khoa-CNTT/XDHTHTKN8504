import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import JobDetailModal from "@/app/components/JobDetailModal";
import DaySelector from "@/app/components/DaySelector";
import ScheduleItem from "@/app/components/ScheduleItem";
import getSchedules from "../../api/scheduleApi";
import useScheduleStore from "@/app/stores/scheduleStore";

const getWeekDays = () => {
  const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const today = new Date();
  return days.map((day, index) => ({
    day,
    date: new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - today.getDay() + index
    ).getDate(),
  }));
};

export default function ScheduleScreen() {
  const [loading, setLoading] = useState(false);
  const schedules = useScheduleStore((state) => state.schedules);
  const selectedDay = useScheduleStore((state) => state.selectedDay);
  const setSchedules = useScheduleStore((state) => state.setSchedules);
  const setSelectedDay = useScheduleStore((state) => state.setSelectedDay);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      try {
        const data = await getSchedules();
        setSchedules(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching schedules:", error);
        setSchedules([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [setSchedules]);

  const filteredSchedules = Array.isArray(schedules)
    ? schedules.filter(
        (schedule) => new Date(schedule.date).getDate() === selectedDay
      )
    : [];

  const handleSelectJob = (job: any) => {
    setSelectedJob(job);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Lịch làm việc</Text>

      <DaySelector
        days={getWeekDays()}
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#28A745" />
      ) : (
        <FlatList
          data={filteredSchedules}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <ScheduleItem
              schedule={item}
              onPress={() => handleSelectJob(item)}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Không có công việc nào trong ngày.
            </Text>
          }
        />
      )}

      <JobDetailModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        job={selectedJob}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#28A745",
    textAlign: "center",
    marginBottom: 15,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
    color: "#6c757d",
  },
});
