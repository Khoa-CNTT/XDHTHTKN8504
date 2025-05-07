import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { ArrowLeft, Star, MessageCircle, Users, Briefcase } from "lucide-react-native";
import { useRoute } from "@react-navigation/native";
import { useServicesStore } from "../stores/serviceStore";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
    Booking: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const ServiceScreen: React.FC = () => {
    const route = useRoute();
    const { serviceId } = route.params as { serviceId: string };
    const navigation = useNavigation<NavigationProp>();

    // Lấy service từ store
    const serviceFromStore = useServicesStore((state) => state.getServiceById(serviceId));

    // Dữ liệu mẫu
    const service = {
        name: serviceFromStore?.name || "Tên dịch vụ",
        description: serviceFromStore?.description || "Mô tả dịch vụ",
        avatar: require("../asset/img/hinh3.jpeg"), // Thay thế bằng đường dẫn ảnh thật
        patients: "2,000+",
        experience: "10+",
        rating: 5,
        reviews: "1,872",
        workingTime: "Cả ngày",
        review: {
            user: "Nguyễn",
            avatar: require("../asset/img/Onboarding3.png"), // Thay thế bằng đường dẫn ảnh thật
            rating: 5,
            comment:
                "Nguyên chuyên gia thực thụ, người thực sự quan tâm đến bệnh nhân của mình. Tôi rất khuyến cho bất kỳ ai tìm kiếm sự chăm sóc đặc biệt.",
        },
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft color="#000" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chi Tiết Dịch Vụ</Text>
            </View>

            <ScrollView style={styles.content}>
                {/* Doctor Card */}
                <View style={styles.doctorCard}>
                    <Image source={service.avatar} style={styles.doctorAvatar} />
                    <View style={styles.doctorInfo}>
                        <Text style={styles.doctorName}>{service.name}</Text>
                        {/* Bạn có thể thêm thông tin bác sĩ khác ở đây */}
                    </View>
                </View>

                {/* Stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <View style={styles.statIcon}>
                            <Users color="#fff" size={18} />
                        </View>
                        <Text style={styles.statNumber}>{service.patients}</Text>
                        <Text style={styles.statLabel}>bệnh nhân</Text>
                    </View>
                    <View style={styles.statItem}>
                        <View style={styles.statIcon}>
                            <Briefcase color="#fff" size={18} />
                        </View>
                        <Text style={styles.statNumber}>{service.experience}</Text>
                        <Text style={styles.statLabel}>kinh nghiệm</Text>
                    </View>
                    <View style={styles.statItem}>
                        <View style={styles.statIcon}>
                            <Star color="#fff" size={18} />
                        </View>
                        <Text style={styles.statNumber}>{service.rating}</Text>
                        <Text style={styles.statLabel}>đánh giá</Text>
                    </View>
                    <View style={styles.statItem}>
                        <View style={styles.statIcon}>
                            <MessageCircle color="#fff" size={18} />
                        </View>
                        <Text style={styles.statNumber}>{service.reviews}</Text>
                        <Text style={styles.statLabel}>lượt xem</Text>
                    </View>
                </View>

                {/* Service Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Thông tin dịch vụ</Text>
                    <Text style={styles.sectionContent}>{service.description}</Text>
                </View>

                {/* Working Time */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Thời gian làm việc</Text>
                    <Text style={styles.sectionContent}>{service.workingTime}</Text>
                </View>

                {/* Reviews */}
                <View style={styles.section}>
                    <View style={styles.reviewHeader}>
                        <Text style={styles.sectionTitle}>Đánh giá</Text>
                        <TouchableOpacity>
                            <Text style={styles.viewAllReviews}>Xem tất cả</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.reviewItem}>
                        <Image source={service.review.avatar} style={styles.reviewAvatar} />
                        <View style={styles.reviewInfo}>
                            <Text style={styles.reviewName}>{service.review.user}</Text>
                            <View style={styles.reviewRating}>
                                <Star color="#FFC107" size={16} />
                                <Text style={styles.reviewRatingText}>{service.review.rating}.0</Text>
                            </View>
                            <Text style={styles.reviewComment}>{service.review.comment}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Appointment Button */}
            <TouchableOpacity
                style={styles.appointmentButton}
                onPress={() => navigation.navigate("Booking")} // Điều hướng đến màn hình "ĐặtLịch"
            >
                <Text style={styles.appointmentButtonText}>Đặt lịch hẹn</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center", // ✅ Căn giữa theo chiều ngang
        paddingHorizontal: 16,
        paddingTop: 45, // ✅ Đẩy phần top xuống
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f2f2f2",
        position: "relative",
    },
    headerTitle: {
        flex: 1, // Cho phép chiếm không gian
        textAlign: "center", // Căn giữa tiêu đề
        fontSize: 20,
        fontWeight: "bold",
        color: "#000",
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
    doctorCard: {
        backgroundColor: "#f9f9f9",
        borderRadius: 4, // Góc bo tròn nhẹ
        overflow: "hidden",
        marginTop: 16,
    },
    doctorAvatar: {
        width: "100%",
        height: 180, // Chiều cao ảnh nổi bật hơn
        resizeMode: "cover",
    },
    doctorInfo: {
        position: "absolute", // Định vị tuyệt đối so với doctorCard
        bottom: 16, // Cách đáy 16px
        left: 16, // Cách trái 16px
        paddingHorizontal: 8, // Padding ngang
        paddingVertical: 4,   // Padding dọc
    },
    doctorName: {
        fontSize: 16, // Kích thước chữ nhỏ hơn
        fontWeight: "bold",
        color: "#fff", // Chữ trắng để tương phản với ảnh
        textShadowColor: "rgba(0, 0, 0, 0.5)", // Bóng đổ nhẹ cho chữ
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 20,
        paddingHorizontal: 8,
    },
    statItem: {
        alignItems: "center",
    },
    statIcon: {
        backgroundColor: "#37B44E",
        borderRadius: 13,
        width: 36,
        height: 36,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 6,
    },
    statNumber: {
        fontWeight: "bold",
        fontSize: 16,
        color: "#333",
    },
    statLabel: {
        fontSize: 12,
        color: "#777",
    },
    section: {
        marginTop: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 8,
    },
    sectionContent: {
        fontSize: 14,
        color: "#555",
        lineHeight: 22,
    },
    reviewHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
        paddingRight: 8,
    },
    viewAllReviews: {
        color: "#37B44E",
        fontSize: 14,
        fontWeight: "bold",
    },
    reviewItem: {
        flexDirection: "row",
        padding: 16,
        backgroundColor: "#fff",
        borderRadius: 8,
        marginBottom: 12,
        // Bóng đổ cho iOS
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        // Bóng đổ cho Android
        elevation: 2,
    },
    reviewAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
    },
    reviewInfo: {
        flex: 1,
    },
    reviewName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 4,
    },
    reviewRating: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    reviewRatingText: {
        marginLeft: 4,
        color: "#FFC107",
    },
    reviewComment: {
        fontSize: 14,
        color: "#555",
        lineHeight: 20,
    },
    appointmentButton: {
        backgroundColor: "#22c55e",
        margin: 16,
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: "center",
    },
    appointmentButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
});

export default ServiceScreen;