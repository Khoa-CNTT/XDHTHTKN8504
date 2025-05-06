import React, { useEffect } from "react";
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
  AllDoctors: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { services, fetchServices, isLoading, error } = useServicesStore();

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSearchPress = () => {
    navigation.navigate("AllDoctors");
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
        <SearchBox editable={false} placeholder="Tìm kiếm ..." />
      </TouchableOpacity>
      <Banner />

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Dịch vụ nổi bật</Text>
      </View>

      <FlatList
        data={services}
        numColumns={2}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[
              styles.serviceItem,
              index % 2 === 0 ? { marginRight: 12 } : { marginLeft: 12 },
            ]}
            onPress={() => {
              console.log(`Đã nhấn vào: ${item.name}`);
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
        contentContainerStyle={[styles.listContent, { paddingBottom: 120 }]}
        style={{ flex: 1 }}
      />
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  loadingText: {
    fontSize: 18,
    color: "#555",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  errorText: {
    fontSize: 18,
    color: "#FF4500",
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#34495e",
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  serviceItem: {
    flex: 0.5,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 0.5,
    borderColor: "#e5e5e5",
  },
  imageContainer: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  serviceImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  serviceName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#34495e",
    textAlign: "center",
  },
  seeAllContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  seeAll: {
    fontSize: 16,
    color: "#3498db",
    fontWeight: "bold",
  },
  footerContainer: {
    marginTop: 30,
    marginBottom: 30,
  },
});

export default HomeScreen;

