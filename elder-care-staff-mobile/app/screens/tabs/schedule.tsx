import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import ScheduleItem from "@/app/components/ScheduleItem";
import getSchedules from "../../api/scheduleApi";
import useScheduleStore from "@/app/stores/scheduleStore";
import { Schedule } from "@/types/Schedule";
import { router } from "expo-router";

type Day = {
  day: string;
  date: Date;
};

const getWeekDays = (): Day[] => {
  const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());

  return days.map((day, index) => {
    const dateObj = new Date(weekStart);
    dateObj.setDate(weekStart.getDate() + index);
    return {
      day,
      date: dateObj,
    };
  });
};

const DaySelector = ({
  days,
  selectedDay,
  onSelectDay,
}: {
  days: Day[];
  selectedDay: Date;
  onSelectDay: (day: Date) => void;
}) => {
  return (
    <View style={styles.daySelector}>
      {days.map((item, index) => {
        const isSelected =
          selectedDay &&
          item.date.toDateString() === selectedDay.toDateString();
        return (
          <TouchableOpacity
            key={index}
            style={[styles.dayItem, isSelected && styles.dayItemSelected]}
            onPress={() => onSelectDay(item.date)}
          >
            <Text
              style={[styles.dayLabel, isSelected && styles.dayLabelSelected]}
            >
              {item.day}
            </Text>
            <Text
              style={[styles.dateLabel, isSelected && styles.dateLabelSelected]}
            >
              {item.date.getDate()}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default function ScheduleScreen() {
  const [loading, setLoading] = useState(false);
  const schedules = useScheduleStore((state) => state.schedules);
  const selectedDay = useScheduleStore((state) => state.selectedDay);
  const setSchedules = useScheduleStore((state) => state.setSchedules);
  const setSelectedDay = useScheduleStore((state) => state.setSelectedDay);


  useEffect(() => {
    if (!schedules || schedules.length === 0) {
      const fetchSchedules = async () => {
        setLoading(true);
        try {
          const data = await getSchedules();
          if (Array.isArray(data)) {
            setSchedules(data);
          } else {
            throw new Error("Dữ liệu không hợp lệ từ API");
          }
        } catch (error) {
          setSchedules([]);
        } finally {
          setLoading(false);
        }
      };
      fetchSchedules();
    }
  }, [schedules, setSchedules]);

  const filteredSchedules = Array.isArray(schedules)
    ? schedules.filter(
        (schedule) =>
          new Date(schedule.date).toDateString() === selectedDay.toDateString()
      )
    : [];

 const handleSelectJob = (job: Schedule) => {
   if (job.bookingId) {
     router.push(`/screens/schedule-detail/${job.bookingId}`);
   } else {
     console.warn("bookingId is missing in selected job:", job);
     // Optionally, show a toast or alert
   }
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

      {/* <JobDetailModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        job={selectedJob || {}}
      /> */}
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
  daySelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dayItem: {
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  dayItemSelected: {
    backgroundColor: "#28A745",
  },
  dayLabel: {
    fontSize: 14,
    color: "#6c757d",
  },
  dayLabelSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  dateLabel: {
    fontSize: 16,
    color: "#333",
  },
  dateLabelSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
});
