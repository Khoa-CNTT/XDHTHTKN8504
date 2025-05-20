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
import { Ionicons } from "@expo/vector-icons";

type RootStackParamList = {
  Home: undefined;
  ServiceScreen: { serviceId: string };
  Seach: undefined;
  Booking: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { services, fetchServices, isLoading, error } = useServicesStore();
  const [showAll, setShowAll] = useState(false);

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
        <TouchableOpacity onPress={() => navigation.navigate("Booking")}>
          <Text style={styles.seeAll}>Xem tất cả</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={services}
        keyExtractor={(item) => item._id}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.serviceCard}
            onPress={() => navigation.navigate("ServiceScreen", { serviceId: item._id })}
            activeOpacity={0.85}
          >
            <View style={styles.cardImageWrapper}>
              <Image
                source={item.imgUrl ? { uri: item.imgUrl } : require("../asset/img/hinh2.jpeg")}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <TouchableOpacity style={styles.favoriteBtn}>
                <Ionicons name="heart-outline" size={20} color="#000" />
              </TouchableOpacity>
            </View>
            <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
            <View style={styles.cardRow}>
              <Ionicons name="star" size={14} color="#FFB800" />
              <Text style={styles.cardRating}>4.9</Text>
              <Text style={styles.cardPrice}> {item.price ? `${item.price.toLocaleString("vi-VN")} VNĐ` : ""}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.gridContent}
        style={{ flex: 1 }}
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
    color: "#000",
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#3E2723',
    letterSpacing: -0.5,
  },
  seeAll: {
    fontSize: 16,
    fontWeight: "600",
    color: "#47B33E",
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
  },
  gridContent: {
    paddingHorizontal: 12,
    paddingBottom: 80,
  },
  serviceCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 18,
    margin: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
    alignItems: "flex-start",
    minWidth: 160,
    maxWidth: "48%",
  },
  cardImageWrapper: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 10,
    position: "relative",
    backgroundColor: "#43B33f",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    borderRadius: 14,
  },
  favoriteBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#3E2723",
    marginBottom: 4,
    marginTop: 2,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  cardRating: {
    fontSize: 13,
    color: "#000",
    marginLeft: 4,
    marginRight: 8,
    fontWeight: "600",
  },
  cardPrice: {
    fontSize: 14,
    color: "#3E2723",
    fontWeight: "bold",
    marginLeft: "auto",
  },
});

export default HomeScreen;