import React from "react";
import { FlatList, TouchableOpacity, Text, StyleSheet } from "react-native";

type Day = {
  day: string;
  date: number;
};

type Props = {
  days: Day[];
  selectedDay: number;
  onSelectDay: (date: number) => void;
};

const DaySelector: React.FC<Props> = ({ days, selectedDay, onSelectDay }) => {
  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={days}
      keyExtractor={(item) => item.date.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[
            styles.dayButton,
            item.date === selectedDay && styles.activeDayButton,
          ]}
          onPress={() => onSelectDay(item.date)}
        >
          <Text
            style={[
              styles.dayText,
              item.date === selectedDay && styles.activeDayText,
            ]}
          >
            {item.day}
          </Text>
          <Text
            style={[
              styles.dateText,
              item.date === selectedDay && styles.activeDateText,
            ]}
          >
            {item.date}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  dayButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#E9ECEF",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    width: 60,
    height: 70,
  },
  activeDayButton: {
    backgroundColor: "#28A745",
  },
  dayText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#6C757D",
  },
  activeDayText: {
    color: "#FFFFFF",
  },
  dateText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6C757D",
  },
  activeDateText: {
    color: "#FFFFFF",
  },
});

export default DaySelector;
