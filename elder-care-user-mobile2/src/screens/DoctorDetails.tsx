import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const DoctorDetails: React.FC = () => {
  const doctor = {
    id: "1",
    name: "Luu Nguyen Van",
    specialty: "Doctor",
    clinic: "Luu.nguyenvan2511@gmail.com",
    image: require("../asset/img/hinh1.png"),
    rating: 4.5,
    reviews: 120,
  };

  const stats = [
    { value: "20+", label: "Khách hàng" },
    { value: "10+", label: "Kinh nghiệm" },
    { value: doctor.rating.toString(), label: "Sao" },
    { value: doctor.reviews.toString(), label: "Đánh giá" },
  ];

  const handleGoBack = () => console.log("Back button pressed");
  const handleBookAppointment = () =>
    console.log("Book Appointment pressed for doctor:", doctor);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={26} color="#2E3A59" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông tin nhân viên y tế</Text>
        <View style={{ width: 26 }} />
      </View>

      <View style={styles.doctorProfile}>
        <Image source={doctor.image} style={styles.doctorImage} />
        <Text style={styles.doctorName}>{doctor.name}</Text>
        <Text style={styles.specialty}>{doctor.specialty}</Text>
        <Text style={styles.clinic}>{doctor.clinic}</Text>
      </View>

      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Giới thiệu</Text>
        <Text style={styles.aboutText}>
          {doctor.name} là một {doctor.specialty.toLowerCase()} tận tâm, giàu
          kinh nghiệm làm việc tại {doctor.clinic}.
          <Text style={styles.viewMore}> xem thêm</Text>
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.reviewHeader}>
          <Text style={styles.sectionTitle}>Đánh giá</Text>
          <TouchableOpacity
            onPress={() => console.log("See all reviews pressed")}
            activeOpacity={0.7}
          >
            <Text style={styles.seeAll}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.reviewItem}>
          <Image
            source={require("../asset/img/hinh1.png")}
            style={styles.reviewerImage}
          />
          <View style={styles.reviewContent}>
            <Text style={styles.reviewerName}>Lê Đình Long</Text>
            <View style={styles.ratingStars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name="star"
                  size={18}
                  color="#FFD700"
                  style={styles.star}
                />
              ))}
            </View>
            <Text style={styles.reviewText}>
              Dr. Lưu là một chuyên gia tận tâm luôn quan tâm đến bệnh nhân
              của mình. Tôi rất khuyên bạn chọn bác sĩ này.
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.bookButton}
        onPress={handleBookAppointment}
        activeOpacity={0.8}
      >
        <Text style={styles.bookButtonText}>Quay lại</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2E3A59",
  },
  doctorProfile: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  doctorImage: {
    width: 110,
    height: 110,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: "#2E3A59",
  },
  doctorName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2E3A59",
    marginBottom: 6,
  },
  specialty: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 4,
  },
  clinic: {
    fontSize: 15,
    color: "#6B7280",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#EFF3F6",
    marginHorizontal: 20,
    paddingVertical: 24,
    borderRadius: 16,
    marginTop: 24,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2E3A59",
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2E3A59",
    marginBottom: 16,
  },
  aboutText: {
    fontSize: 15,
    lineHeight: 24,
    color: "#6B7280",
  },
  viewMore: {
    color: "#2563EB",
    fontWeight: "600",
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  seeAll: {
    fontSize: 15,
    color: "#2563EB",
    fontWeight: "600",
  },
  reviewItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  reviewerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  reviewContent: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#2E3A59",
    marginBottom: 6,
  },
  ratingStars: {
    flexDirection: "row",
    marginBottom: 10,
  },
  star: {
    marginRight: 6,
  },
  reviewText: {
    fontSize: 15,
    color: "#6B7280",
    lineHeight: 22,
  },
  bookButton: {
    backgroundColor: "#28a745",
    marginHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});

export default DoctorDetails;
