import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import PagerView from "react-native-pager-view";
import WorkList from "./WorkList";

const WorkTabs = () => {
  const [page, setPage] = useState(0);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.tabBar}>
        <Text
          style={[styles.tabItem, page === 0 && styles.activeTab]}
          onPress={() => setPage(0)}
        >
          Đang Thực Hiện
        </Text>
        <Text
          style={[styles.tabItem, page === 1 && styles.activeTab]}
          onPress={() => setPage(1)}
        >
          Đã Hoàn Thành
        </Text>
      </View>
      <PagerView
        style={{ flex: 1 }}
        initialPage={0}
        onPageSelected={(e) => setPage(e.nativeEvent.position)}
      >
        <View key="1">
          <WorkList status="ongoing" />
        </View>
        <View key="2">
          <WorkList status="completed" />
        </View>
      </PagerView>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    padding: 10,
  },
  tabItem: {
    fontSize: 16,
    paddingVertical: 8,
    color: "#888",
  },
  activeTab: {
    fontWeight: "bold",
    color: "#28a745",
    borderBottomWidth: 2,
    borderBottomColor: "#28a745",
  },
});

export default WorkTabs;
