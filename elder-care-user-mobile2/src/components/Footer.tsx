import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert, Modal, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import useAuthStore from "../stores/authStore";

type RootStackParamList = {
    Home: undefined;
    MyBookings: undefined;
    Profile: undefined;
    Map: undefined;
    Booking: undefined;
    DoctorDetails: { doctor: any };
    BookAppointment: { doctor: any };
    WorkScreen: undefined;
    Login: undefined; // Ensure Login route is defined
};

type NavigationProp = StackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList>;

const Footer: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<RouteProps>();
    const [activeTab, setActiveTab] = useState<keyof RootStackParamList | null>(route.name as keyof RootStackParamList | null);
    const [pressedTab, setPressedTab] = useState<keyof RootStackParamList | null>(null);
    const [iconSizes, setIconSizes] = useState<{ [key in keyof RootStackParamList]: number }>({
        Home: 28,
        Map: 28,
        Booking: 28,
        MyBookings: 28,
        Profile: 28,
        DoctorDetails: 28,
        BookAppointment: 28,
        WorkScreen: 28,
        Login: 28,
    });

    const { token } = useAuthStore();

    // State for custom alert modal
    const [isAlertVisible, setAlertVisible] = useState(false);

    const handleNavigation = useCallback((screenName: keyof RootStackParamList) => {
        if (screenName === 'DoctorDetails' || screenName === 'BookAppointment') {
            console.log('Cannot navigate directly to this screen');
            return;
        }
        navigation.navigate(screenName);
        setActiveTab(screenName);
    }, [navigation]);

    const handleProfilePress1 = () => {
        if (token) {
            navigation.navigate("WorkScreen");
        } else {
            setAlertVisible(true); // Show custom alert
        }
    };
    const handleProfilePress2 = () => {
        if (token) {
            navigation.navigate("Booking");
        } else {
            setAlertVisible(true); // Show custom alert
        }
    };
    const handleProfilePress3 = () => {
        if (token) {
            navigation.navigate("MyBookings");
        } else {
            setAlertVisible(true); // Show custom alert
        }
    };
    const handleProfilePress4 = () => {
        if (token) {
            navigation.navigate("Profile");
        } else {
            setAlertVisible(true); // Show custom alert
        }
    };

    const handleConfirmLogin = () => {
        setAlertVisible(false);
        navigation.navigate("Login");
    };

    const handleCancelLogin = () => {
        setAlertVisible(false);
    };

    const handlePressIn = useCallback((tabName: keyof RootStackParamList) => {
        setPressedTab(tabName);
        setIconSizes(prevSizes => ({
            ...prevSizes,
            [tabName]: 34,
        }));
    }, []);

    const handlePressOut = useCallback(() => {
        if (pressedTab) {
            setIconSizes(prevSizes => {
                const newSizes = { ...prevSizes };
                for (const key in newSizes) {
                    newSizes[key as keyof RootStackParamList] = 28;
                }
                return newSizes;
            });
            setPressedTab(null);
        }
    }, [pressedTab]);

    const getTabStyle = (tabName: keyof RootStackParamList) => {
        return [
            styles.tab,
            pressedTab === tabName && styles.tabPressed,
        ];
    };

    const getIconSize = (tabName: keyof RootStackParamList) => {
        return iconSizes[tabName];
    };

    const getIconColor = (tabName: keyof RootStackParamList) => {
        return activeTab === tabName || pressedTab === tabName ? '#37B44E' : '#9DA3A6';
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={getTabStyle('Home')}
                onPress={() => handleNavigation('Home')}
                onPressIn={() => handlePressIn('Home')}
                onPressOut={handlePressOut}
            >
                <Ionicons name="home" size={getIconSize('Home')} color={getIconColor('Home')} />
            </TouchableOpacity>
            <TouchableOpacity
                style={getTabStyle('Map')}
                // onPress={() => handleNavigation('WorkScreen')}
                onPress={handleProfilePress1}
                onPressIn={() => handlePressIn('Map')}
                onPressOut={handlePressOut}
            >
                <Ionicons name="location" size={getIconSize('Map')} color={getIconColor('Map')} />
            </TouchableOpacity>
            <TouchableOpacity
                style={getTabStyle('Booking')}
                // onPress={() => handleNavigation('Booking')}
                onPress={handleProfilePress2}
                onPressIn={() => handlePressIn('Booking')}
                onPressOut={handlePressOut}
            >
                <Ionicons name="book" size={getIconSize('Booking')} color={getIconColor('Booking')} />
            </TouchableOpacity>
            <TouchableOpacity
                style={getTabStyle('MyBookings')}
                onPress={handleProfilePress3}
                // onPress={() => handleNavigation('MyBookings')}
                onPressIn={() => handlePressIn('MyBookings')}
                onPressOut={handlePressOut}
            >
                <Ionicons name="calendar" size={getIconSize('MyBookings')} color={getIconColor('MyBookings')} />
                
            </TouchableOpacity>
            <TouchableOpacity
                style={getTabStyle('Profile')}
                onPress={handleProfilePress4}
                onPressIn={() => handlePressIn('Profile')}
                onPressOut={handlePressOut}
            >
                <Ionicons name="person-circle" size={getIconSize('Profile')} color={getIconColor('Profile')} />
            </TouchableOpacity>

            {/* Custom Alert Modal */}
            <Modal
                transparent={true}
                animationType="fade"
                visible={isAlertVisible}
                onRequestClose={() => setAlertVisible(false)}
            >
                <View style={customAlertStyles.centeredView}>
                    <View style={customAlertStyles.modalView}>
                        <Text style={customAlertStyles.modalTitle}>Yêu cầu đăng nhập</Text>
                        <Text style={customAlertStyles.modalText}>
                            Bạn cần đăng nhập để truy cập trang cá nhân. Bạn có muốn đăng nhập ngay bây giờ không?
                        </Text>
                        <View style={customAlertStyles.buttonContainer}>
                            <TouchableOpacity
                                style={[customAlertStyles.button, customAlertStyles.buttonCancel]}
                                onPress={handleCancelLogin}
                            >
                                <Text style={customAlertStyles.textStyle}>Không</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[customAlertStyles.button, customAlertStyles.buttonConfirm]}
                                onPress={handleConfirmLogin}
                            >
                                <Text style={customAlertStyles.textStyle}>Đăng nhập</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 12,
        borderTopWidth: 0.7,
        borderTopColor: '#ccc',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        elevation: 8, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    tab: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 50,
    },
    tabPressed: {
        backgroundColor: '#F0F8F4',
    },
});

const customAlertStyles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.5)', // Dim background
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        // Enhanced shadow for a more luxurious feel
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6 // More vertical offset for depth
        },
        shadowOpacity: 0.15, // Softer opacity
        shadowRadius: 10, // Wider spread
        elevation: 10, // Android shadow
        width: '85%', // Slightly wider
        maxWidth: 400, // Max width for larger screens
    },
    modalTitle: {
        marginBottom: 18, // More space below title
        textAlign: "center",
        fontSize: 22, // Slightly larger font size
        fontWeight: "bold",
        color: '#2C3E50', // Deeper, more sophisticated dark gray
    },
    modalText: {
        marginBottom: 25, // More space below text
        textAlign: "center",
        fontSize: 16,
        color: '#4A4A4A', // Softer dark gray
        lineHeight: 24, // Improved readability
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 10, // Space above buttons
    },
    button: {
        borderRadius: 12, // Slightly more rounded corners
        paddingVertical: 14, // More vertical padding
        paddingHorizontal: 25, // More horizontal padding
        elevation: 5, // Android button shadow
        flex: 1, // Distribute space evenly
        marginHorizontal: 8, // Space between buttons
        // iOS button shadow
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    buttonCancel: {
        backgroundColor: "#95A5A6", // Muted gray for "Không"
        
    },
    buttonConfirm: {
        backgroundColor: "#37B44E", // Richer green for "Đăng nhập"
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    
        fontSize: 17, // Slightly larger font for button text
    }
});

export default Footer;
