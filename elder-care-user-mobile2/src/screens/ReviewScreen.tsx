import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
    Booking: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const ReviewScreen: React.FC = () => {
    const [rating, setRating] = useState(5);
    const [review, setReview] = useState('');
    const navigation = useNavigation<NavigationProp>();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back-ios" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Để lại đánh giá</Text>
            </View>

            {/* Product Info */}
            <View style={styles.productRow}>
                <Image
                    source={require("../asset/img/hinh2.jpeg")}
                    style={styles.productImage}
                />
                <View style={styles.productInfo}>
                    <Text style={styles.productTitle}>Áo khoác nâu</Text>
                    <Text style={styles.productDetails}>Kích thước : XL | Số lượng : 10 cái</Text>
                    <Text style={styles.productPrice}>$83.97</Text>
                </View>
                <TouchableOpacity style={styles.reorderBtn}>
                    <Text style={styles.reorderText}>Đặt lại</Text>
                </TouchableOpacity>
            </View>

            {/* Rating */}
            <Text style={styles.sectionTitle}>Đơn hàng của bạn thế nào?</Text>
            <Text style={styles.ratingLabel}>Đánh giá chung của bạn</Text>
            <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map(i => (
                    <TouchableOpacity key={i} onPress={() => setRating(i)}>
                        <FontAwesome
                            name={i <= rating ? 'star' : 'star-o'}
                            size={36}
                            color="#FFA500"
                            style={{ marginHorizontal: 4 }}
                        />
                    </TouchableOpacity>
                ))}
            </View>

            {/* Review Input */}
            <Text style={styles.addReviewLabel}>Thêm đánh giá chi tiết</Text>
            <TextInput
                style={styles.textInput}
                placeholder="Nhập tại đây"
                value={review}
                onChangeText={setReview}
                multiline
            />

            {/* Add Photo */}
            {/* <TouchableOpacity style={styles.addPhotoRow}>
                <MaterialIcons name="add-a-photo" size={24} color="#B0B0B0" />
                <Text style={styles.addPhotoText}>thêm ảnh</Text>
            </TouchableOpacity> */}

            {/* Buttons */}
            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
                    <Text style={styles.cancelText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitBtn} onPress={() => {/* handle submit */ }}>
                    <Text style={styles.submitText}>Gửi</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingTop: 40 // Cách top xuống 40 như yêu cầu
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },

    productRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },

    productImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
    },

    productInfo: {
        flex: 1,
        marginLeft: 10,
    },

    productTitle: {
        fontWeight: 'bold',
        fontSize: 16,
    },

    productDetails: {
        color: '#888',
        fontSize: 13,
    },

    productPrice: {
        fontWeight: 'bold',
        marginTop: 4,
    },

    reorderBtn: {
        backgroundColor: '#37B44E',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 6,
    },

    reorderText: {
        color: '#fff',
        fontWeight: 'bold',
    },

    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 12,
    },

    ratingLabel: {
        textAlign: 'center',
        color: '#888',
        marginBottom: 10,
    },

    starsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },

    addReviewLabel: {
        marginBottom: 6,
        marginTop: 10,
    },

    textInput: {
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 10,
        padding: 12,
        minHeight: 70,
        marginBottom: 10,
    },

    addPhotoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },

    addPhotoText: {
        color: '#B0B0B0',
        marginLeft: 8,
    },

    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },

    cancelBtn: {
        flex: 1,
        backgroundColor: '#eee', // Giữ nguyên màu nền nút Hủy
        borderRadius: 24,
        padding: 14,
        marginRight: 10,
        alignItems: 'center',
    },

    submitBtn: {
        flex: 1,
        backgroundColor: '#37B44E', // Thay đổi màu nền nút Gửi
        borderRadius: 24,
        padding: 14,
        marginLeft: 10,
        alignItems: 'center',
    },

    cancelText: {
        color: '#7B4F2C',
        fontWeight: 'bold',
    },

    submitText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});


export default ReviewScreen;