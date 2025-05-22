import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import Footer from "../components/Footer";
import { useServicesStore } from "../stores/serviceStore";
import useAuthStore from "../stores/authStore"; // Import useAuthStore

type RootStackParamList = {
  Home: undefined;
  ServiceScreen: { serviceId: string };
  ProfileList: undefined; // This likely needs to be changed to a specific profile screen
  Login: undefined; // Add Login to your RootStackParamList
  ProfileScreen: undefined; // Add a dedicated ProfileScreen to your RootStackParamList
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const getImageByRole = (role: string) => {
  switch (role) {
    case "doctor":
      return require("../asset/img/DoctorAvatar.jpg");
    case "nurse":
      return require("../asset/img/nurse_avatar.png");
    default:
      return require("../asset/img/nurse_avatar.png");
  }
};

const BookingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const services = useServicesStore.getState().services;
  const [searchText, setSearchText] = useState("");
  const { token } = useAuthStore(); // Get the authentication token from the store

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Handler for the profile icon press
  const handleProfilePress = () => {
    if (token) {
      // If user is logged in, navigate to their profile screen
      navigation.navigate("ProfileList"); // Navigate to a dedicated ProfileScreen
    } else {
      // If user is not logged in, navigate to LoginScreen
      navigation.navigate("Login");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.7}>
          <Ionicons name="menu-outline" size={33} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dịch vụ</Text>
        <TouchableOpacity
          onPress={handleProfilePress} // Use the new handler here
          activeOpacity={0.7}
        >
          <Ionicons name="person-circle-outline" size={33} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Section */}
      <View style={styles.sectionContainer}>
        {/* Ô tìm kiếm */}
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm dịch vụ..."
          value={searchText}
          onChangeText={setSearchText}
        />

        {/* Danh sách dịch vụ cuộn được */}
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 120 }}>
          {filteredServices.map((service) => (
            <TouchableOpacity
              key={service._id}
              style={styles.card}
              onPress={() => {
                navigation.navigate("ServiceScreen", { serviceId: service._id });
              }}
            >
              <Image
                source={
                  service.imgUrl
                    ? { uri: service.imgUrl }
                    : getImageByRole(service.role)
                }
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{service.name}</Text>
                <Text style={styles.cardDescription} numberOfLines={2}>
                  {service.description}
                </Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={22} color="#999" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Footer cố định */}
      <View style={styles.footerFixed}>
        <Footer />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#000',
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginTop: 25,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 16,
    fontSize: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 18,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 13,
    color: "#000",
  },
  footerFixed: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    zIndex: 10,
    elevation: 10,
  },
});

export default BookingScreen;