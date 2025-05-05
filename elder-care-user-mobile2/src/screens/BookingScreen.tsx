import React, { useState, useEffect } from "react";
 import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
 } from "react-native";
 import { useNavigation } from "@react-navigation/native";
 import { StackNavigationProp } from "@react-navigation/stack";
 import { Ionicons } from "@expo/vector-icons";
 import Footer from "../components/Footer";
 import CareRecipientModal from "../components/CareRecipientModal";
 import { Profile } from "../types/profile";
 import { useServicesStore } from "../stores/serviceStore";
 import { Service } from "../types/Service";

 type RootStackParamList = {
  AddCareRecipient: undefined;
  ProfileList: undefined;
  BookVisit: undefined;
 };

 type NavigationProp = StackNavigationProp<RootStackParamList>;

 const BookingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCareRecipient, setSelectedCareRecipient] = useState<Profile | undefined>(undefined);
  const { services, fetchServices, isLoading, error } = useServicesStore();

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleCareRecipientClick = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleApplyCareRecipient = (profile: Profile | undefined) => {
    setSelectedCareRecipient(profile);
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.7}>
          <Ionicons name="menu-outline" size={33} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chọn dịch vụ</Text>
        <TouchableOpacity onPress={() => navigation.navigate("ProfileList")} activeOpacity={0.7}>
          <Ionicons name="person-circle-outline" size={33} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Care Recipient */}
      <View style={styles.careRecipient}>
        <TouchableOpacity style={styles.careBox} onPress={handleCareRecipientClick} activeOpacity={0.8}>
          <View style={styles.avatarContainer}>
            {selectedCareRecipient ? (
              <Text style={styles.avatarLetter}>
                {selectedCareRecipient.firstName.charAt(0).toUpperCase()}
              </Text>
            ) : (
              <Ionicons name="person" size={22} color="#fff" />
            )}
          </View>
          <Text style={styles.careText}>
            {selectedCareRecipient
              ? `${selectedCareRecipient.firstName} ${selectedCareRecipient.lastName || ""}`
              : "Chọn người được chăm sóc"}
          </Text>
          <Ionicons name="pencil-outline" size={22} color="#777" />
        </TouchableOpacity>
      </View>

      {/* Dịch vụ Homage tiêu đề */}
      <Text style={styles.sectionTitle}>Dịch vụ của chúng tôi</Text>

      {/* Danh sách dịch vụ */}
      <FlatList
        data={services}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("BookVisit")}
            activeOpacity={0.8}
          >
            <Image
              source={require("../asset/img/hinh1.png")}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={22} color="#999" />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.serviceList}
        showsVerticalScrollIndicator={false}
      />

      {/* Footer cố định */}
      <View style={styles.footerFixed}>
        <Footer />
      </View>

      {/* Modal chọn người được chăm sóc */}
      <CareRecipientModal
        visible={modalVisible}
        onClose={closeModal}
        onApply={handleApplyCareRecipient}
      />
    </View>
  );
 };

 const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9", // Light background
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#555",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
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
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  careRecipient: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
  },
  careBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    padding: 16,
    borderRadius: 10,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  avatarContainer: {
    backgroundColor: "#c4a484",////////////
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  avatarLetter: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
  },
  careText: {
    flex: 1,
    fontSize: 17,
    color: "#444",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 18,
    paddingHorizontal: 20,
    marginTop: 25,
  },
  serviceList: {
    paddingHorizontal: 20,
    paddingBottom: 130, // Adjust for footer
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  cardImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 18,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 15,
    color: "#666",
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