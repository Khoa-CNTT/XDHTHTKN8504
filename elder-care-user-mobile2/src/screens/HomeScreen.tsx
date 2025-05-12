import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Header from "../components/Header";
import SearchBox from "../components/SearchBox";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import { useServicesStore } from "../stores/serviceStore";

type RootStackParamList = {
  Home: undefined;
  ServiceScreen: { serviceId: string };
  Seach: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { services, fetchServices, isLoading, error } = useServicesStore();
  const [showAll, setShowAll] = useState(false); // Trạng thái xem tất cả

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSearchPress = () => {
    navigation.navigate("Seach");
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Đang tải dịch vụ...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Lỗi: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity onPress={handleSearchPress} activeOpacity={0.7}>
        <SearchBox editable={false} placeholder="Tìm kiếm dịch vụ ..." />
      </TouchableOpacity>

      <Banner />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Dịch vụ nổi bật</Text>
        <TouchableOpacity onPress={() => setShowAll(!showAll)}>
          <Text style={styles.seeAll}>
            {showAll ? "Thu gọn" : "Xem tất cả"}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        key={showAll ? "vertical" : "horizontal"} // Bắt buộc render lại khi thay đổi số cột
        data={services}
        keyExtractor={(item) => item._id}
        horizontal={!showAll}
        numColumns={showAll ? 1 : undefined}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[
              styles.serviceItem,
              showAll
                ? { marginBottom: 20, width: "100%" }
                : index % 2 === 0
                ? { marginRight: 12 }
                : { marginLeft: 12 },
            ]}
            onPress={() => {
              navigation.navigate("ServiceScreen", { serviceId: item._id });
            }}
            activeOpacity={0.8}
          >
            <View style={styles.imageContainer}>
              <Image
                source={require("../asset/img/hinh2.jpeg")}
                style={styles.serviceImage}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.serviceName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={[styles.listContent, { paddingBottom: 5 }]}
        style={{ flex: 1 }}
        snapToAlignment="center"
        decelerationRate="fast"
      />

      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  loadingText: {
    fontSize: 18,
    color: "#7f8c8d",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "black",
    letterSpacing: -0.5,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  serviceItem: {
    width: 380,
    backgroundColor: "#F7FFF9",
    borderRadius: 20,
    alignItems: "center",
    elevation: 6,
    borderColor: "#ecf0f1",
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 20,
    alignSelf: "center",
  },
  imageContainer: {
    width: "100%",
    height: 180,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  serviceImage: {
    width: "100%",
    height: "100%",
  },
  serviceName: {
    fontSize: 15,
    fontWeight: "600",
    color: "black",
    textAlign: "center",
    paddingVertical: 10,
  },
  seeAll: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  footerContainer: {
    marginTop: 30,
    marginBottom: 30,
  },
});

export default HomeScreen;