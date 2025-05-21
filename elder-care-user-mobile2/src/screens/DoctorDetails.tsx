import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { getReviewsByStaffId } from "../api/ReviewService";
import { getStaffDetail } from "../api/StaffAPI"; // Import your StaffService
import { Review } from "../types/Review";
import { Staff } from "../types/Staff"; // Import Staff type if you have one
import { log } from "../utils/logger";

const DoctorDetails: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { participantId } = route.params as { participantId: string };
  const [isLoading, setIsLoading] = useState(true);


 
  const [reviews, setReviews] = useState<Review[]>([]);
  const [staffDetail, setStaffDetail] = useState<Staff>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true); // Bắt đầu loading
        if (participantId) {
          const staffDetail = await getStaffDetail(participantId);
          log(staffDetail)
          setStaffDetail(staffDetail);

          const fetchedReviews = await getReviewsByStaffId(participantId);
          setReviews(fetchedReviews);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        Alert.alert("Lỗi", "Không thể tải thông tin. Vui lòng thử lại.");
      } finally {
        setIsLoading(false); // Kết thúc loading
      }
    };

    fetchData();
  }, [participantId]);
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  const handleGoBack = () => navigation.goBack();
 

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
        <Image
          source={
            staffDetail?.userId?.avatar
              ? { uri: staffDetail.userId.avatar }
              : require("../asset/img/hinh1.png")
          }
          style={styles.doctorImage}
        />
        <Text
          style={styles.doctorName}
        >{`${staffDetail.firstName} ${staffDetail.lastName}`}</Text>
        <Text style={styles.specialty}>{staffDetail.specialization}</Text>
        <Text style={styles.clinic}>{staffDetail.email}</Text>
      </View>

      <View style={styles.statsContainer}>
        
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Giới thiệu</Text>
        <Text style={styles.aboutText}>
          {`${staffDetail.firstName} ${staffDetail.lastName}`} là một{" "}
          {staffDetail.userId.role === "doctor" ? "bác sĩ" : "y tá"} tận tâm, giàu
          kinh nghiệm làm việc tại phòng khám.
          <Text style={styles.viewMore}> xem thêm</Text>
        </Text>
      </View>

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
                  review.staffId
                    ? { uri: review.staffId }
                    : require("../asset/img/hinh1.png")
                }
                style={styles.reviewerImage}
              />
              <View style={styles.reviewContent}>
                <Text style={styles.reviewerName}>
                  {review.staffId || "Người dùng ẩn danh"}
                </Text>
                <View style={styles.ratingStars}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                      key={star}
                      name={star <= review.rating ? "star" : "star-outline"}
                      size={18}
                      color="#FFD700"
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

      <TouchableOpacity
        style={styles.bookButton}
        onPress={handleGoBack}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  loadingText: {
    fontSize: 18,
    color: "#6B7280",
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
  participantIdText: {
    fontSize: 14,
    color: "#888",
    marginTop: 8,
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
    marginBottom: 12,
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
  noReviewsText: {
    textAlign: "center",
    fontSize: 16,
    color: "#6B7280",
    marginTop: 20,
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