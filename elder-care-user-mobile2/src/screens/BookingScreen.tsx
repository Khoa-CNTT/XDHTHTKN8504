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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="menu" size={24} color="#2E3A59" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đặt dịch vụ</Text>
        <TouchableOpacity onPress={() => navigation.navigate("ProfileList")}>
          <Ionicons name="person-circle-outline" size={24} color="#2E3A59" />
        </TouchableOpacity>
      </View>

      {/* Care Recipient */}
      <View style={styles.careRecipient}>
        <TouchableOpacity style={styles.careBox} onPress={handleCareRecipientClick}>
          <View style={styles.avatarContainer}>
            {selectedCareRecipient ? (
              <Text style={styles.avatarLetter}>
                {selectedCareRecipient.firstName.charAt(0).toUpperCase()}
              </Text>
            ) : (
              <Ionicons name="person-outline" size={20} color="#666" />
            )}
          </View>
          <Text style={styles.careText}>
            {selectedCareRecipient
              ? `${selectedCareRecipient.firstName}${selectedCareRecipient.lastName || ""}`
              : "Chọn người được chăm sóc"}
          </Text>
          <Ionicons name="pencil-outline" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Dịch vụ Homage tiêu đề */}
      <Text style={styles.sectionTitle}>Dịch vụ Homage</Text>

      {/* Danh sách dịch vụ */}
      <FlatList
        data={services}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("BookVisit")}
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
            <Ionicons name="chevron-forward-outline" size={20} color="#888" />
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 120 }}
        style={styles.serviceList}
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
    backgroundColor: "#fff",
  },
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 45,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2E3A59",
  },
  careRecipient: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  careBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    padding: 14,
    borderRadius: 12,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  avatarContainer: {
    backgroundColor: "#c4a484",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarLetter: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
  careText: {
    flex: 1,
    fontSize: 16,
    color: "#444",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E3A59",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  serviceList: {
    paddingHorizontal: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardImage: {
    width: 48,
    height: 48,
    borderRadius: 10,
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E3A59",
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
  },
  footerFixed: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    zIndex: 10,
    elevation: 10,
  },
});

export default BookingScreen;
