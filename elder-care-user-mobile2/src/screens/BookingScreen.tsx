import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import Footer from "../components/Footer";
import CareRecipientModal from "../components/CareRecipientModal";
import { Profile } from "../types/profile";

type RootStackParamList = {
  AddCareRecipient: undefined;
  ProfileList: undefined;
  BookVisit: { role: "doctor" | "nurse"; careRecipient: Profile };
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const BookingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCareRecipient, setSelectedCareRecipient] = useState<
    Profile | undefined
  >(undefined);

  const handleCareRecipientClick = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleApplyCareRecipient = (profile: Profile | undefined) => {
    setSelectedCareRecipient(profile);
  };

  const handleSelectCareType = (type: "doctor" | "nurse") => {
    if (!selectedCareRecipient) {
      Alert.alert("Thông báo", "Vui lòng chọn người được chăm sóc trước.");
      return;
    }
    navigation.navigate("BookVisit", {
      role: type,
      careRecipient: selectedCareRecipient,
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.7}>
          <Ionicons name="menu-outline" size={33} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chọn dịch vụ</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("ProfileList")}
          activeOpacity={0.7}
        >
          <Ionicons name="person-circle-outline" size={33} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Care Recipient */}
      <View style={styles.careRecipient}>
        <TouchableOpacity
          style={styles.careBox}
          onPress={handleCareRecipientClick}
          activeOpacity={0.8}
        >
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
              ? `${selectedCareRecipient.firstName} ${
                  selectedCareRecipient.lastName || ""
                }`
              : "Chọn người được chăm sóc"}
          </Text>
          <Ionicons name="pencil-outline" size={22} color="#777" />
        </TouchableOpacity>
      </View>

      {/* Section title */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Chọn loại dịch vụ</Text>

        {/* Doctor Card */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => handleSelectCareType("doctor")}
        >
          <Image
            source={require("../asset/img/DoctorAvatar.jpg")} // Thay bằng ảnh thực tế của bạn
            style={styles.cardImage}
            resizeMode="cover"
          />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Bác sĩ</Text>
            <Text style={styles.cardDescription}>
              Chăm sóc chuyên môn y tế tại nhà
            </Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={22} color="#999" />
        </TouchableOpacity>

        {/* Nurse Card */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => handleSelectCareType("nurse")}
        >
          <Image
            source={require("../asset/img/nurse_avatar.png")} // Thay bằng ảnh thực tế của bạn
            style={styles.cardImage}
            resizeMode="cover"
          />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Điều dưỡng</Text>
            <Text style={styles.cardDescription}>
              Chăm sóc sinh hoạt và theo dõi sức khoẻ
            </Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={22} color="#999" />
        </TouchableOpacity>
      </View>

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
    backgroundColor: "#c4a484",
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
  sectionContainer: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 18,
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
