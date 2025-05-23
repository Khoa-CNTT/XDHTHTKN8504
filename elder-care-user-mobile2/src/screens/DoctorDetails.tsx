import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { getReviewsByStaffId } from "../api/ReviewService";
import { getStaffDetail } from "../api/StaffAPI";
import { Review } from "../types/Review";
import { Staff } from "../types/Staff";
import { log } from "../utils/logger";

const DoctorDetails: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { participantId } = route.params as { participantId: string };
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [staffDetail, setStaffDetail] = useState<Staff>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (participantId) {
          const staffDetail = await getStaffDetail(participantId);
          log(staffDetail);
          setStaffDetail(staffDetail);

          const fetchedReviews = await getReviewsByStaffId(participantId);
          setReviews(fetchedReviews);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        Alert.alert("Lỗi", "Không thể tải thông tin. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [participantId]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#28a745" />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  const handleGoBack = () => navigation.goBack();

  const averageRating = reviews.length
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={33} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông tin nhân viên</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Ionicons name="person-circle-outline" size={33} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Profile */}
      <View style={styles.doctorProfile}>
        <Image
          source={
            staffDetail?.userId?.avatar
              ? { uri: staffDetail.userId.avatar }
              : require("../asset/img/hinh1.png")
          }
          style={styles.doctorImage}
        />
        <Text style={styles.doctorName}>
          {`${staffDetail.firstName} ${staffDetail.lastName}`}
        </Text>
        <Text style={styles.specialty}>{staffDetail.specialization? staffDetail.specialization : "Nhân viên y tế"}</Text>
        <Text style={styles.email}>{staffDetail.email}</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{"50+"}</Text>
          <Text style={styles.statLabel}>Khách hàng</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{`${staffDetail.experience}+`}</Text>
          <Text style={styles.statLabel}>Kinh nghiệm</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{reviews.length}</Text>
          <Text style={styles.statLabel}>Đánh giá</Text>
        </View>

        <View style={styles.statItem}>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <Text style={styles.statValue}>{averageRating}</Text>
            <Ionicons
              size={16}
              color="#11fc09"
              style={{ marginHorizontal: 2 }}
            />
          </View>
          <Text style={styles.statLabel}>Trung bình</Text>
        </View>
      </View>

      {/* Introduction */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Giới thiệu</Text>
        <Text style={styles.aboutText}>
          {`${staffDetail.firstName} ${staffDetail.lastName}`} là{" "}
          {staffDetail.userId.role === "doctor" ? "bác sĩ" : "y tá"} rất tận tâm
          và luôn đặt sự chăm sóc tận tình lên hàng đầu. Với nhiều năm kinh
          nghiệm làm việc tại phòng khám,{" "}
          {staffDetail.userId.role === "doctor" ? "bác sĩ" : "y tá"} sẽ đồng
          hành cùng bạn để mang lại sức khỏe tốt nhất.
        </Text>
      </View>

      {/* Reviews */}
      <View style={styles.section}>
        <View style={styles.reviewHeader}>
          <Text style={styles.sectionTitle}>Đánh giá</Text>
          <TouchableOpacity
            onPress={() => console.log("Xem tất cả đánh giá đã nhấn")}
            activeOpacity={0.7}
          >
            <Text style={styles.seeAll}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        {reviews.length > 0 ? (
          reviews.map((review) => (
            <View key={review._id} style={styles.reviewItem}>
              <Image
                source={
                  review.reviewer?.avartar
                    ? { uri: review.reviewer?.avartar }
                    : require("../asset/img/use.jpg")
                }
                style={styles.reviewerImage}
              />
              <View style={styles.reviewContent}>
                <Text style={styles.reviewerName}>
                  {review.reviewer
                    ? `${review.reviewer.firstName} ${review.reviewer.lastName}`
                    : "Người dùng ẩn danh"}
                </Text>
                <View style={styles.ratingStars}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                      key={star}
                      name={star <= review.rating ? "star" : "star-outline"}
                      size={18}
                      color="#ffd700"
                      style={styles.star}
                    />
                  ))}
                </View>
                <Text style={styles.reviewText}>{review.comment}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noReviewsText}>Chưa có đánh giá nào.</Text>
        )}
      </View>

      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleGoBack}
        activeOpacity={0.8}
      >
        <Text style={styles.backButtonText}>Quay lại</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F5F1", // nền nhẹ nhàng xanh nhạt
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
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#000",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F5F1",
  },
  loadingText: {
    fontSize: 18,
    color: "#28a745",
    marginTop: 12,
  },
  doctorProfile: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 20,
    shadowColor: "#28a745",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 15,
    elevation: 6,
  },
  doctorImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: "#28a745",
  },
  doctorName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2E3A59",
    marginBottom: 6,
  },
  specialty: {
    fontSize: 16,
    color: "#4C5C4C",
    fontStyle: "italic",
    marginBottom: 4,
  },
  email: {
    fontSize: 15,
    color: "#6B7280",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#DFF2DF",
    marginHorizontal: 20,
    paddingVertical: 24,
    borderRadius: 16,
    marginTop: 24,
    marginBottom: 32,
    shadowColor: "#28a745",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#28a745",
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 14,
    color: "#52734D",
  },
  ratingStars: {
    flexDirection: "row",
    marginBottom: 6,
  
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#28a745",
    marginBottom: 16,
  },
  aboutText: {
    fontSize: 16,
    lineHeight: 26,
    color: "#4C5C4C",
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  seeAll: {
    fontSize: 15,
    color: "#28a745",
    fontWeight: "600",
  },
  reviewItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#28a745",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 4,
    marginBottom: 14,
  },
  reviewerImage: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 18,
    borderWidth: 1,
    borderColor: "#28a745",
  },
  reviewContent: {
    flex: 1,
  },
  reviewerName: {
    fontWeight: "700",
    fontSize: 16,
    color: "#2E3A59",
    marginBottom: 6,
  },
  reviewText: {
    fontSize: 15,
    color: "#4C5C4C",
    marginTop: 6,
  },
  star: {
    marginRight: 4,
  },
  noReviewsText: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#7E9E79",
    textAlign: "center",
    paddingVertical: 24,
  },
  backButton: {
    backgroundColor: "#28a745",
    marginHorizontal: 60,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#28a745",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 5,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
});

export default DoctorDetails;
