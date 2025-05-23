import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Header from "../components/Header";
import SearchBox from "../components/SearchBox";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import { useServicesStore } from "../stores/serviceStore";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../navigation/navigation";

type NavigationProp = StackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { services, isLoading, error } = useServicesStore();
  const [showAll, setShowAll] = useState(false);
  const nurseService = services.filter((s) => s.role === "nurse")
  const doctorService = services.filter((s) => s.role === "doctor");

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

      <ScrollView
        nestedScrollEnabled
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <Banner />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Dịch vụ bác sĩ</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Booking")}>
            <Text style={styles.seeAll}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={doctorService}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.serviceCardHorizontal}
              onPress={() =>
                navigation.navigate("ServiceScreen", { serviceId: item._id })
              }
              activeOpacity={0.9}
            >
              <View style={styles.cardImageWrapper}>
                <Image
                  source={
                    item.imgUrl
                      ? { uri: item.imgUrl }
                      : require("../asset/img/hinh2.jpeg")
                  }
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <TouchableOpacity style={styles.favoriteBtn}>
                  <Ionicons name="heart-outline" size={20} color="#333" />
                </TouchableOpacity>
              </View>
              <Text style={styles.cardTitle} numberOfLines={2}>
                {item.name}
              </Text>
              <View style={styles.cardRow}>
                <Text style={styles.cardPrice}>
                  {item.price
                    ? `${item.price.toLocaleString("vi-VN")} VNĐ`
                    : ""}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="#888"
                  style={styles.cardIcon}
                />
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.horizontalListContainer}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Dịch vụ điều dưỡng</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Booking")}>
            <Text style={styles.seeAll}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={nurseService}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.serviceCardHorizontal}
              onPress={() =>
                navigation.navigate("ServiceScreen", { serviceId: item._id })
              }
              activeOpacity={0.9}
            >
              <View style={styles.cardImageWrapper}>
                <Image
                  source={
                    item.imgUrl
                      ? { uri: item.imgUrl }
                      : require("../asset/img/hinh2.jpeg")
                  }
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <TouchableOpacity style={styles.favoriteBtn}>
                  <Ionicons name="heart-outline" size={20} color="#333" />
                </TouchableOpacity>
              </View>
              <Text style={styles.cardTitle} numberOfLines={2}>
                {item.name}
              </Text>
              <View style={styles.cardRow}>
                <Text style={styles.cardPrice}>
                  {item.price
                    ? `${item.price.toLocaleString("vi-VN")} VNĐ`
                    : ""}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="#888"
                  style={styles.cardIcon}
                />
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.horizontalListContainer}
        />
      </ScrollView>

      <Footer />
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
  },
  loadingText: {
    fontSize: 18,
    color: "#999",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
  },
  errorText: {
    fontSize: 18,
    color: "#E53935",
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#212121",
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4CAF50",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: "#E8F5E9",
  },
  gridContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  serviceCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 20,
    margin: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
    alignItems: "flex-start",
    minWidth: 160,
    maxWidth: "48%",
  },
  cardImageWrapper: {
    width: "100%",
    aspectRatio: 16 / 9, // ✅ Tỉ lệ chữ nhật ngang
    borderRadius: 7,
    overflow: "hidden",
    marginBottom: 15,
    backgroundColor: "#f0f0f0",
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  favoriteBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 20,
    padding: 6,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#212121",
    marginBottom: 7,
    lineHeight: 18,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "stretch",
    margin: 2,
  },
  cardPrice: {
    fontSize: 13,
    color: "#2E7D32",
    fontWeight: "bold",
  },
  horizontalListContainer: {
    paddingLeft: 16,
    paddingRight: 8,
    paddingBottom: 9,
  },

  serviceCardHorizontal: {
    height: 190,
    width: 180, // hoặc 160 nếu bạn thích gọn
    backgroundColor: "#fdfafa",
    borderRadius: 8,
    borderWidth: 0.2,
    marginRight: 12,
    padding: 9,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  cardIcon: {
    marginLeft: 6,
    alignSelf: "center",
  },
});


export default HomeScreen;