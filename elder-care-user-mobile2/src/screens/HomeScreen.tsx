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
        <Text>Đang tải dịch vụ...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>Lỗi: {error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
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
              index % 2 === 0 ? { marginRight: 10 } : { marginLeft: 10 },
            ]}
            onPress={() => {
              console.log(`Đã nhấn vào: ${item.name}`);
            }}
            activeOpacity={0.8}
          >
            <View style={styles.imageContainer}>
              <Image
                source={require("../asset/img/hinh1.png")}
                style={styles.serviceImage}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.serviceName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          services.length > 6 && (
            <TouchableOpacity
              style={styles.seeAllContainer}
              onPress={() => {
                // Xử lý khi nhấn vào "Xem tất cả"
              }}
            >
              {/* <Text style={styles.seeAll}>Xem tất cả</Text> */}
            </TouchableOpacity>
          )
        }
        contentContainerStyle={[styles.listContent, { paddingBottom: 100 }]} // Đệm để không che bởi Footer
        style={{ flexGrow: 0 }}
      />

      {/* Footer cố định */}
      <View style={styles.footerContainer}>
        <Footer />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 20,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  serviceItem: {
    flex: 0.5,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
    marginBottom: 10,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  serviceImage: {
    width: "100%",
    height: "100%",
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#34495e",
    textAlign: "center",
  },
  seeAllContainer: {
    marginTop: 15,
    alignItems: "center",
  },
  seeAll: {
    fontSize: 16,
    color: "#3498db",
    fontWeight: "bold",
  },
  footerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    zIndex: 10,
    elevation: 10,
  },
});

export default HomeScreen;
