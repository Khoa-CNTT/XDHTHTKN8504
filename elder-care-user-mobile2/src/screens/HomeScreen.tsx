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
  ServiceScreen: { serviceId: string };
  Seach: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { services, fetchServices, isLoading, error } = useServicesStore();

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

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Dịch vụ nổi bật</Text>
      </View>

      <FlatList
        data={services}
        horizontal={true} // Để cuộn ngang
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <TouchableOpacity
          style={[
            styles.serviceItem,
            index % 2 === 0 ? { marginRight: 12 } : { marginLeft: 12 },
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
    color: "#red",
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginTop: 25,
    

  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "black",
    marginBottom: 20,

    letterSpacing: -0.5,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  serviceItem: {
    width: 380, // Mỗi item chiếm 300px
    backgroundColor: "#F7FFF9",
    borderRadius: 20,
    alignItems: "center",
    marginRight: 5, // Khoảng cách giữa các item
    elevation: 6,
    borderColor: "#ecf0f1",
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 50,
  },
  imageContainer: {
    width: "100%",
    height: 180, // Chiều cao hình ảnh
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
    color: "#black",
    textAlign: "center",
  },
  seeAllContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  seeAll: {

    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    // textAlign: "center",
    paddingHorizontal: 10,
    paddingBottom: 15,
    marginTop: 10,
  },
  footerContainer: {
    marginTop: 30,
    marginBottom: 30,
  },
});

export default HomeScreen;
