import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import ScheduleItem from "../../../components/ScheduleItem";
import useScheduleStore from "@/stores/scheduleStore";
import { Schedule } from "@/types/Schedule";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type Day = {
  day: string;
  date: Date;
};

const getWeekDays = (): Day[] => {
  const days = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  const today = new Date();
  const currentDay = today.getDay(); // Chủ nhật = 0, Thứ 2 = 1

  // Tính lại thứ Hai gần nhất
  const offset = currentDay === 0 ? -6 : 1 - currentDay;
  const monday = new Date(today);
  monday.setDate(today.getDate() + offset);

  return days.map((day, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return { day, date };
  });
};

const isToday = (date: Date) =>
  date.toDateString() === new Date().toDateString();

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
        const today = isToday(item.date);

        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayItem,
              isSelected && styles.dayItemSelected,
              today && styles.todayItem,
            ]}
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
    if (!selectedDay) {
      setSelectedDay(new Date()); // mặc định chọn hôm nay
    }

    // if (!schedules || schedules.length === 0) {
    //   const fetchSchedules = async () => {
    //     setLoading(true);
    //     try {
    //       await fetchSchedule(); // từ store
    //     } catch (error) {
    //       setSchedules([]);
    //     } finally {
    //       setLoading(false);
    //     }
    //   };
    //   fetchSchedules();
    // }
  }, []);

  const filteredSchedules =
    selectedDay && Array.isArray(schedules)
      ? schedules.filter((schedule) => {
          if (!schedule.date) return false;

          const scheduleDate = new Date(schedule.date);
          if (isNaN(scheduleDate.getTime())) return false;

          return scheduleDate.toDateString() === selectedDay.toDateString();
        })
      : [];

  const handleSelectJob = (job: Schedule) => {
    if (job.bookingId) {
      router.push(`/screens/schedule-detail/${job.bookingId}`);
    } else {
      console.warn("bookingId is missing in selected job:", job);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={33} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dịch vụ</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Ionicons name="person-circle-outline" size={33} color="#000" />
        </TouchableOpacity>
      </View>

      {selectedDay && (
        <DaySelector
          days={getWeekDays()}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
        />
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#28A745" />
      ) : (
        <FlatList
          data={filteredSchedules}
          keyExtractor={(item) => item._id}
          renderItem={({ item, index }) => (
            <ScheduleItem
              schedule={item}
              onPress={() => handleSelectJob(item)}
            />
          )}
          initialNumToRender={5}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Không có công việc nào trong ngày.
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
    marginBottom: 5
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#000",
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
  todayItem: {
    borderWidth: 1,
    borderColor: "#28A745",
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
