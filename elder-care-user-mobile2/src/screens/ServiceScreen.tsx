import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { ArrowLeft, Star, MessageCircle, Users, Briefcase, ChevronDown, ChevronUp } from "lucide-react-native";
import { useRoute } from "@react-navigation/native";
import { useServicesStore } from "../stores/serviceStore";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { usePackageStore } from '../stores/PackageService';
import { Package } from "../types/PackageService";
import useAuthStore from "../stores/authStore";

type RootStackParamList = {
    BookAService: undefined;
    Login: undefined;
};
type NavigationProp = StackNavigationProp<RootStackParamList>;

// Component Quy trình làm việc
const QuyTrinhLamViec: React.FC<{ role: string }> = ({ role }) => {
    if (role === "doctor") {
        return (
            <View>
                <Text style={styles.processStep}>- Khách hàng đặt lịch qua app Eldercare.</Text>
                <Text style={styles.processStep}>- Bác sĩ của Eldercare tiếp nhận lịch, liên hệ với bệnh nhân để hỏi thêm tình trạng và xác nhận lịch hẹn</Text>
                <Text style={styles.processStep}>- Bác sĩ mang các thiết bị máy móc cần thiết đến nhà bệnh nhân</Text>
                <Text style={styles.processStep}>- Bác sĩ thực hiện các hoạt động khám lâm sàng, siêu âm, điện tâm đồ, lấy mẫu xét nghiệm nếu cần</Text>
                <Text style={styles.processStep}>- Trả kết quả khám và đưa ra tham vấn y khoa ngay sau buổi khám.</Text>
            </View>
        );
    }

    if (role === "nurse") {
        return (
            <View>
                <Text style={styles.processStep}>Bước 1: Đọc hồ sơ bệnh án (nếu có), đơn thuốc</Text>
                <Text style={styles.processStep}>Bước 2: Hỏi bệnh nhân, người nhà về tình trạng sức khỏe, khám sức khỏe, đo nhịp tim, phổi, huyết áp, kiểm tra vết thương</Text>
                <Text style={styles.processStep}>Bước 3: Lập phương án chăm sóc, Thực hiện các hoạt động chăm sóc</Text>
                <Text style={styles.processStep}>Bước 4: Khám sơ bộ, đo huyết áp, nhịp tim, phổi, kiểm tra vết thương trước</Text>
            </View>
        );
    }

    return <Text>Chưa có quy trình làm việc.</Text>;
};

// Component Gói dịch vụ
const ServicePackage: React.FC<{ packageData: Package; onPackagePress: (pkg: Package) => void }> = ({ packageData, onPackagePress }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handlePress = () => {
        setIsExpanded(!isExpanded);
        onPackagePress(packageData);
    };

    return (
        <TouchableOpacity style={styles.packageCard} onPress={handlePress}>
            <View style={styles.rowBetween}>
                <Text style={styles.packageName}>{packageData.name}</Text>
                {isExpanded ? (
                    <ChevronUp size={22} color="#888" />
                ) : (
                    <ChevronDown size={22} color="#888" />
                )}
            </View>
            {isExpanded && (
                <View>
                    <View style={styles.rowBetween}>
                        <Text style={styles.packageLabel}>Giá:</Text>
                        <Text style={styles.packagePrice}>{packageData.price?.toLocaleString("vi-VN")} VNĐ</Text>
                    </View>
                    {/* <View style={styles.rowBetween}>
                        <Text style={styles.packageDescription}>{packageData.description}</Text>
                    </View> */}
                    {packageData.totalDays && (
                        <View style={styles.rowBetween}>
                            <Text style={styles.packageLabel}>Số ngày:</Text>
                            <Text style={styles.packageInfo}>{packageData.totalDays}</Text>
                        </View>
                    )}
                    {packageData.repeatInterval && (
                        <View style={styles.rowBetween}>
                            <Text style={styles.packageLabel}>Chu kỳ:</Text>
                            <Text style={styles.packageInfo}>{packageData.repeatInterval} ngày</Text>
                        </View>
                    )}
                    {packageData.timeWork && (
                        <View style={styles.rowBetween}>
                            <Text style={styles.packageLabel}>Thời gian làm việc:</Text>
                            <Text style={styles.packageInfo}>{packageData.timeWork} giờ</Text>
                        </View>
                    )}
                </View>
            )}
        </TouchableOpacity>
    );
};

const ServiceScreen: React.FC = () => {
    const route = useRoute();
    const { serviceId } = route.params as { serviceId: string };
    const navigation = useNavigation<NavigationProp>();
    const serviceFromStore = useServicesStore((state) => state.getServiceById(serviceId));
    const { getPackageByServiceId, fetchPackages } = usePackageStore();
    const packagesFromStore = getPackageByServiceId(serviceId);
    const [expandedPackageId, setExpandedPackageId] = useState<string | null>(null);
    const { token } = useAuthStore(); 

    // Handler for the profile icon press
  const handleBookAService = () => {
    if (token) {
      // If user is logged in, navigate to their profile screen
      navigation.navigate("BookAService"); // Navigate to a dedicated ProfileScreen
    } else {
      // If user is not logged in, navigate to LoginScreen
      navigation.navigate("Login");
    }
  };

    // Sửa avatar lấy từ imgUrl nếu có, nếu không lấy theo role
    const service = {
        name: serviceFromStore?.name || "Tên dịch vụ",
        description: serviceFromStore?.description || "Mô tả dịch vụ",
        avatar: serviceFromStore?.imgUrl
            ? { uri: serviceFromStore.imgUrl }
            : serviceFromStore?.role === "doctor"
                ? require("../asset/img/DoctorAvatar.jpg")
                : require("../asset/img/nurse_avatar.png"),
        patients: serviceFromStore?.price ? `${serviceFromStore.price.toLocaleString()}VNĐ` : " Chưa cập nhậtnhật",
        experience: "23",
        rating: 5,
        reviews: "1,872",
        workingTime: "Cả ngày",
        role: serviceFromStore?.role || "doctor", // Lấy role từ store, mặc định doctor
    };

    useEffect(() => {
        fetchPackages();
    }, [fetchPackages]);

    const packages = packagesFromStore;

    const handlePackagePress = (pkg: Package) => {
        setExpandedPackageId(prevId => prevId === pkg._id ? null : pkg._id);
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
                    </View>
                </View>

                {/* Stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <View style={styles.statIcon}>
                            <Users color="#fff" size={18} />
                        </View>
                        <Text style={styles.statNumber}>{service.patients}</Text>
                        <Text style={styles.statLabel}>Giá tiền theo giờ</Text>
                    </View>
                    <View style={styles.statItem}>
                        <View style={styles.statIcon}>
                            <Briefcase color="#fff" size={18} />
                        </View>
                        <Text style={styles.statNumber}>{service.experience}</Text>
                        <Text style={styles.statLabel}>
                            {service.role === "doctor" ? "Bác sĩ" : "Điều dưỡng"}
                        </Text>
                    </View>
                    {/* <View style={styles.statItem}>
                        <View style={styles.statIcon}>
                            <Star color="#fff" size={18} />
                        </View>
                        <Text style={styles.statNumber}>{service.rating}</Text>
                        <Text style={styles.statLabel}>đánh giá</Text>
                    </View> */}
                    <View style={styles.statItem}>
                        <View style={styles.statIcon}>
                            <MessageCircle color="#fff" size={18} />
                        </View>
                        <Text style={styles.statNumber}>{service.reviews}</Text>
                        <Text style={styles.statLabel}>Lượt Đặt</Text>
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

                {/* Quy trình làm việc */}
                <View style={styles.section}>
                    <View style={styles.reviewHeader}>
                        <Text style={styles.sectionTitle}>Quy trình làm việc</Text>
                    </View>
                    <QuyTrinhLamViec role={service.role} />
                </View>

                {/* Gói dịch vụ */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Gói dịch vụ</Text>
                    {packages.map((pkg, index) => (
                        <ServicePackage
                            key={index}
                            packageData={pkg}
                            onPackagePress={handlePackagePress}
                        />
                    ))}
                </View>
            </ScrollView>

            {/* Appointment Button */}
            <TouchableOpacity
                style={styles.appointmentButton}
                onPress={handleBookAService}
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
        justifyContent: "center",
        paddingHorizontal: 16,
        paddingTop: 45,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f2f2f2",
        position: "relative",
    },
    headerTitle: {
        flex: 1,
        textAlign: "center",
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
        borderRadius: 4,
        overflow: "hidden",
        marginTop: 16,
    },
    doctorAvatar: {
        width: "100%",
        height: 180,
        resizeMode: "cover",
    },
    doctorInfo: {
        position: "absolute",
        bottom: 16,
        left: 16,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    doctorName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
        textShadowColor: "rgba(0, 0, 0, 0.5)",
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
    processStep: {
        fontSize: 14,
        color: "#555",
        marginBottom: 8,
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
    packageCard: {
        padding: 16,
        marginBottom: 12,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    packageName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    packageLabel: {
        fontSize: 14,
        color: '#555',
        fontWeight: 'bold',
    },
    packagePrice: {
        fontSize: 14,
        color: '#22c55e',
        fontWeight: 'bold',
        marginBottom: 8
    },
    packageDescription: {
        fontSize: 14,
        color: '#555'
    },
    packageInfo: {
        fontSize: 14,
        color: '#555',
        marginTop: 4
    }
});

export default ServiceScreen;