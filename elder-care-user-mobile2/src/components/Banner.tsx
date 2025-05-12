import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Animated, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
    Home: undefined;
    MyBookings: undefined;
    Profile: undefined;
    Map: undefined;
    DoctorDetails: { doctor: any };
    BookAppointment: { doctor: any };
    ServiceDetails: { serviceId: string };
    FeaturedService: undefined;
    Booking: undefined;
    AllDoctors: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const bannerData = [
    {
        id: '1',
        title: "Ưu đãi cuối tuần",
        subtitle: "Giảm 25% cho mọi dịch vụ",
        image: require('../asset/img/Onboarding3.png'),
        backgroundColor: '#81C784', // Màu xanh lá cây nhạt
        textColor: '#FFFFFF',
    },
    {
        id: '2',
        title: "Khám sức khỏe tại nhà",
        subtitle: "Tiện lợi và nhanh chóng",
        image: require('../asset/img/Onboarding2.png'),
        backgroundColor: '#64B5F6', // Màu xanh dương nhạt
        textColor: '#FFFFFF',
    },
    {
        id: '3',
        title: "Chăm sóc người cao tuổi",
        subtitle: "Tận tâm và chu đáo",
        image: require('../asset/img/Onboarding1.png'),
        backgroundColor: '#9575CD', // Màu tím nhạt
        textColor: '#FFFFFF',
    },
];

const { width, height } = Dimensions.get('window');
const BANNER_WIDTH = width - 32;
const BANNER_HEIGHT = 180; // Sử dụng một phần ba chiều cao màn hình
const AUTO_SCROLL_INTERVAL = 3000;

const Banner: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const bannerRef = useRef<any>(null);
    const navigation = useNavigation<NavigationProp>();

    useEffect(() => {
        const timer = setInterval(() => {
            const nextIndex = (activeIndex + 1) % bannerData.length;
            bannerRef.current?.scrollToIndex({
                index: nextIndex,
                animated: true,
            });
            setActiveIndex(nextIndex);
        }, AUTO_SCROLL_INTERVAL);

        return () => clearInterval(timer);
    }, [activeIndex]);

    const handleBannerPress = () => {
        navigation.navigate('Booking');
    };

    const renderItem = ({ item }: { item: typeof bannerData[0] }) => {
        return (
            <TouchableOpacity onPress={handleBannerPress} style={styles.slide}>
                <Image source={item.image} style={styles.backgroundImage} resizeMode="cover" />
                <View style={styles.overlay}>
                    <View style={styles.textContainer}>
                        <Text style={[styles.title, { color: item.textColor }]}>{item.title}</Text>
                        <Text style={[styles.subtitle, { color: item.textColor }]}>{item.subtitle}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Animated.FlatList
                ref={bannerRef}
                data={bannerData}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                onMomentumScrollEnd={(event) => {
                    const newIndex = Math.round(event.nativeEvent.contentOffset.x / BANNER_WIDTH);
                    setActiveIndex(newIndex);
                }}
                keyExtractor={(item) => item.id}
            />
            <View style={styles.pagination}>
                {bannerData.map((_, index) => {
                    const inputRange = [
                        (index - 1) * BANNER_WIDTH,
                        index * BANNER_WIDTH,
                        (index + 1) * BANNER_WIDTH,
                    ];
                    const dotOpacity = scrollX.interpolate({
                        inputRange,
                        outputRange: [0.3, 1, 0.3],
                        extrapolate: 'clamp',
                    });
                    const dotWidth = scrollX.interpolate({
                        inputRange,
                        outputRange: [10, 30, 10], // Kích thước lớn hơn khi active
                        extrapolate: 'clamp',
                    });
                    const dotColor = scrollX.interpolate({
                        inputRange,
                        outputRange: ['#BBBBBB', '#FFFFFF', '#BBBBBB'], // Màu sắc thay đổi
                        extrapolate: 'clamp',
                    });

                    return (
                        <Animated.View
                            key={index}
                            style={[styles.dot, {
                                opacity: dotOpacity,
                                width: dotWidth,
                                backgroundColor: dotColor,
                                borderRadius: 5, // Bo tròn nhẹ
                            }]}
                        />
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginVertical: 16,
    },
    slide: {
        width: BANNER_WIDTH,
        height: BANNER_HEIGHT, // Sử dụng chiều cao mới
        borderRadius: 12, // Giảm bo tròn
        overflow: 'hidden',
        position: 'relative',
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: 12, // Giảm bo tròn
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0)', // Lớp phủ tối hơn
        justifyContent: 'flex-end', // Đẩy nội dung xuống dưới
        paddingHorizontal: 20,
        paddingBottom: 20, // Thêm padding dưới
        borderRadius: 12,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        maxWidth: '100%',
    },
    title: {
        fontSize: 24, // Tăng kích thước tiêu đề
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
        lineHeight: 30,
        textShadowColor: 'rgba(255, 255, 255, 0.5)', // Thêm bóng đổ cho chữ
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    subtitle: {
        fontSize: 14,
        color: '#EEEEEE', // Màu chữ nhạt hơn
        opacity: 1,
        lineHeight: 20,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 8,
        resizeMode: 'contain',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16, // Tăng khoảng cách lề
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 5, // Bo tròn hơn
        backgroundColor: '#BBBBBB',
        marginHorizontal: 6, // Tăng khoảng cách giữa các chấm
    },
    dotActive: {
        width: 24,
        backgroundColor: '#FFFFFF',
    },
});

export default Banner;
