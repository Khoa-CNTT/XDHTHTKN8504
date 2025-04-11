import React from "react";
import { View, StyleSheet,Text } from "react-native";
import WorkTabs from "../components/WorkTabs";

const WorkScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle} >Công Việc Của Tôi</Text>
      <WorkTabs />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f5f5f5",
    paddingTop: 20,
    paddingHorizontal: 10,
    },
  headerTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#28A745",
    textAlign: "center",
    marginBottom: 15,
  },
});

export default WorkScreen;
