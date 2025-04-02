import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const mockData = [
  {
    id: "1",
    name: "Chăm sóc ông A",
    location: "Hà Nội",
    time: "08:00",
    status: "ongoing",
  },
  {
    id: "2",
    name: "Hỗ trợ bà B",
    location: "TP.HCM",
    time: "10:00",
    status: "completed",
  },
  {
    id: "3",
    name: "Chăm sóc ông A",
    location: "Hà Nội",
    time: "08:00",
    status: "ongoing",
  },
  {
    id: "4",
    name: "Chăm sóc ông A",
    location: "Hà Nội",
    time: "08:00",
    status: "ongoing",
  },
  {
    id: "5",
    name: "Chăm sóc ông A",
    location: "Hà Nội",
    time: "08:00",
    status: "ongoing",
  },
];

const WorkList = ({ status }: { status: "ongoing" | "completed" }) => {
  const navigation = useNavigation();
  const filteredData = mockData.filter((item) => item.status === status);

  return (
    <FlatList
      data={filteredData}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
         // onPress={() => navigation.navigate("WorkDetail", { workId: item.id })}
        >
          <Text style={styles.title}>{item.name}</Text>
          <Text>
            {item.location} - {item.time}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: "white",
    marginVertical: 8,
    borderRadius: 20,
  },
  title: { fontWeight: "bold", fontSize: 16, paddingBottom: 8 },
});

export default WorkList;
