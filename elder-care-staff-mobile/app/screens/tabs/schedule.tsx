import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import DaySelector from "@/app/components/DaySelector";
import ScheduleItem from "@/app/components/ScheduleItem";

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

const scheduleData = [
  {
    time: "08:00 AM",
    title: "Chăm sóc khách A",
    details: "Tắm rửa, ăn sáng, đo huyết áp",
    status: "done",
  },
  {
    time: "10:00 AM",
    title: "Vật lý trị liệu khách B",
    details: "Bài tập giãn cơ, hỗ trợ vận động",
    status: "progress",
  },
  {
    time: "12:00 PM",
    title: "Chăm sóc khách C",
    details: "Chuẩn bị bữa trưa, đo huyết áp",
    status: "pending",
  },
  {
    time: "03:00 PM",
    title: "Dọn dẹp và kiểm tra phòng khách D",
    details: "Dọn giường, kiểm tra tủ thuốc",
    status: "done",
  },
  {
    time: "06:00 PM",
    title: "Chăm sóc buổi tối khách E",
    details: "Chuẩn bị ăn tối, kiểm tra sức khỏe",
    status: "progress",
  },
];

export default function ScheduleScreen() {
  const [weekDays] = useState(getWeekDays());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Lịch làm việc</Text>
      <DaySelector
        days={weekDays}
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
      />
      <FlatList
        data={scheduleData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <ScheduleItem {...item} />}
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
});
