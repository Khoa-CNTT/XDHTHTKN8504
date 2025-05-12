import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from '@expo/vector-icons';
import AuthStore from '../stores/authStore';
import useProfileStore from "../stores/profileStore"; // Import useProfileStore
import { Profile } from "../types/profile"; // Import kiểu Profile

type RootStackParamList = {
    Booking: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const { width, height } = Dimensions.get('window');

const AddCreateCareProfileScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [relationship, setRelationship] = useState('');
    const [address, setAddress] = useState('');
    const [emergencyContact, setEmergencyContact] = useState({ name: '', phone: '' });
    const [healthConditions, setHealthConditions] = useState([{ condition: '', notes: '' }]);
    const { user } = AuthStore();
    const userId = user?._id;
    const { addProfile } = useProfileStore(); // Lấy hàm addProfile từ profileStore

    // State để theo dõi lỗi của từng trường
    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [relationshipError, setRelationshipError] = useState('');
    const [addressError, setAddressError] = useState('');
    const [emergencyNameError, setEmergencyNameError] = useState('');
    const [emergencyPhoneError, setEmergencyPhoneError] = useState('');
    const [healthConditionError, setHealthConditionError] = useState('');

    const isFormValid =
        firstName && lastName && relationship && address &&
        emergencyContact.name && emergencyContact.phone &&
        healthConditions[0].condition;

    const handleCreateProfile = async () => {
        let isValid = true;

        // Kiểm tra và cập nhật trạng thái lỗi cho từng trường
        if (!firstName) {
            setFirstNameError("Vui lòng nhập họ");
            isValid = false;
        } else {
            setFirstNameError('');
        }

        if (!lastName) {
            setLastNameError("Vui lòng nhập tên");
            isValid = false;
        } else {
            setLastNameError('');
        }

        if (!relationship) {
            setRelationshipError("Vui lòng nhập mối quan hệ");
            isValid = false;
        } else {
            setRelationshipError('');
        }

        if (!address) {
            setAddressError("Vui lòng nhập địa chỉ");
            isValid = false;
        } else {
            setAddressError('');
        }

        if (!emergencyContact.name) {
            setEmergencyNameError("Vui lòng nhập tên người liên hệ");
            isValid = false;
        } else {
            setEmergencyNameError('');
        }

        if (!emergencyContact.phone) {
            setEmergencyPhoneError("Vui lòng nhập số điện thoại liên hệ");
            isValid = false;
        } else {
            setEmergencyPhoneError('');
        }

        if (!healthConditions[0].condition) {
            setHealthConditionError("Vui lòng nhập tình trạng sức khỏe");
            isValid = false;
        } else {
            setHealthConditionError('');
        }

        if (!isValid) {
            return; // Không tiến hành tạo hồ sơ nếu có lỗi
        }

        try {
            const newProfileData: Partial<Profile> = {
                userId: userId!, // Non-null assertion vì userId chỉ undefined khi chưa login, logic tạo profile cần user đã login
                firstName: firstName,
                lastName: lastName,
                relationship: relationship,
                address: address,
                emergencyContact: emergencyContact,
                healthConditions: healthConditions,
                // Bạn có thể thêm các trường khác của Profile nếu cần
            };

            await addProfile(newProfileData); // Sử dụng addProfile từ profileStore

            Alert.alert("Thành công", "Tạo hồ sơ thành công!");
            navigation.navigate("Booking");
        } catch (error: any) {
            Alert.alert("Lỗi", error?.response?.data?.message || "Không thể tạo hồ sơ.");
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.container}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>Tạo Hồ Sơ</Text>

                    <Text style={styles.inputTitle}>Họ</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập họ"
                        value={firstName}
                        onChangeText={(text) => {
                            setFirstName(text);
                            setFirstNameError(''); // Xóa lỗi khi người dùng bắt đầu nhập
                        }}
                    />
                    {firstNameError ? <Text style={styles.errorText}>{firstNameError}</Text> : null}

                    <Text style={styles.inputTitle}>Tên</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập tên"
                        value={lastName}
                        onChangeText={(text) => {
                            setLastName(text);
                            setLastNameError('');
                        }}
                    />
                    {lastNameError ? <Text style={styles.errorText}>{lastNameError}</Text> : null}

                    <Text style={styles.inputTitle}>Mối quan hệ</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập mối quan hệ"
                        value={relationship}
                        onChangeText={(text) => {
                            setRelationship(text);
                            setRelationshipError('');
                        }}
                    />
                    {relationshipError ? <Text style={styles.errorText}>{relationshipError}</Text> : null}

                    <Text style={styles.inputTitle}>Địa chỉ</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập địa chỉ"
                        value={address}
                        onChangeText={(text) => {
                            setAddress(text);
                            setAddressError('');
                        }}
                    />
                    {addressError ? <Text style={styles.errorText}>{addressError}</Text> : null}

                    <Text style={styles.inputTitle}>Tên người liên hệ khẩn cấp</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập tên người liên hệ"
                        value={emergencyContact.name}
                        onChangeText={(text) => {
                            setEmergencyContact({ ...emergencyContact, name: text });
                            setEmergencyNameError('');
                        }}
                    />
                    {emergencyNameError ? <Text style={styles.errorText}>{emergencyNameError}</Text> : null}

                    <Text style={styles.inputTitle}>Số điện thoại liên hệ khẩn cấp</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập số điện thoại"
                        value={emergencyContact.phone}
                        onChangeText={(text) => {
                            setEmergencyContact({ ...emergencyContact, phone: text });
                            setEmergencyPhoneError('');
                        }}
                        keyboardType="phone-pad"
                    />
                    {emergencyPhoneError ? <Text style={styles.errorText}>{emergencyPhoneError}</Text> : null}

                    <Text style={styles.inputTitle}>Tình trạng sức khỏe</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập tình trạng sức khỏe"
                        value={healthConditions[0].condition}
                        onChangeText={(text) => {
                            setHealthConditions([{ condition: text, notes: healthConditions[0].notes }]);
                            setHealthConditionError('');
                        }}
                    />
                    {healthConditionError ? <Text style={styles.errorText}>{healthConditionError}</Text> : null}

                    <Text style={styles.inputTitle}>Ghi chú về sức khỏe</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập ghi chú"
                        value={healthConditions[0].notes}
                        onChangeText={(text) =>
                            setHealthConditions([{ condition: healthConditions[0].condition, notes: text }])
                        }
                    />

                    <TouchableOpacity
                        style={[styles.createButton, isFormValid ? styles.createButtonEnabled : styles.createButtonDisabled]}
                        onPress={handleCreateProfile}
                    >
                        <Text style={styles.createButtonText}>Tạo hồ sơ</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        paddingBottom: 100,
    },
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9', // Màu nền nhạt
        padding: width * 0.05,
        paddingTop: width * 0.1,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2E3A59',
        marginLeft: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    inputTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4a5568', // Màu chữ đậm hơn
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#cbd5e0', // Màu viền nhạt hơn
        borderRadius: 8,
        padding: width * 0.04,
        marginBottom: 5, // Giảm margin bottom để có chỗ cho thông báo lỗi
        backgroundColor: '#fff',
        shadowColor: 'rgba(0, 0, 0, 0.1)', // Thay đổi màu bóng
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8, // Tăng độ đậm của bóng
        shadowRadius: 4,
        elevation: 2,
    },
    backIcon: {
        alignSelf: 'flex-start',
        backgroundColor: '#fff', // Thêm màu nền cho icon
        borderRadius: 20, // Làm cho nó tròn
        padding: 8, // Thêm padding
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 2,
    },
    createButton: {
        padding: 18,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 25,
        backgroundColor: '#48bb78', // Màu xanh lá cây
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4, // Tăng độ đậm
        shadowRadius: 6,
        elevation: 3,
    },
    createButtonEnabled: {
        backgroundColor: '#00bcd4',
    },
    createButtonDisabled: {
        backgroundColor: '#e0f2f7',
    },
    createButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
    },
});

export default AddCreateCareProfileScreen;