import React, { useState, useEffect } from 'react';
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
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from "@react-navigation/stack";
import useProfileStore from "../stores/profileStore";
import { Profile } from "../types/profile";


type RootStackParamList = {
    // ProfileDetails: { profileId: string };
    // AddCareRecipient: undefined;
    EditCareRecipient: { profileId: string };
};

type EditCareRecipientScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditCareRecipient'>;

const { width } = Dimensions.get('window');

const EditCareRecipientScreen: React.FC = () => {
    const navigation = useNavigation<EditCareRecipientScreenNavigationProp>();
    const route = useRoute();
    const { profileId } = route.params as { profileId: string };
    const { getProfileById, editProfile, isLoading, error } = useProfileStore();
    const profileToEdit = getProfileById(profileId);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [relationship, setRelationship] = useState('');
    const [address, setAddress] = useState('');
    const [emergencyContact, setEmergencyContact] = useState({ name: '', phone: '' });
    const [healthConditions, setHealthConditions] = useState([{ condition: '', notes: '' }]);

    useEffect(() => {
        if (profileToEdit) {
            setFirstName(profileToEdit.firstName || '');
            setLastName(profileToEdit.lastName || '');
            setRelationship(profileToEdit.relationship || '');
            setAddress(profileToEdit.address || '');
            setEmergencyContact(profileToEdit.emergencyContact || { name: '', phone: '' });
            setHealthConditions(profileToEdit.healthConditions || [{ condition: '', notes: '' }]);
        }
    }, [profileToEdit]);

    const isFormValid =
        firstName && lastName && relationship && address &&
        emergencyContact.name && emergencyContact.phone &&
        healthConditions[0].condition;

    const handleUpdateProfile = async () => {
        if (!isFormValid) {
            Alert.alert("Thiếu thông tin", "Vui lòng điền đầy đủ các trường bắt buộc.");
            return;
        }

        try {
            const updatedProfileData: Partial<Profile> = {
                firstName: firstName,
                lastName: lastName,
                relationship: relationship,
                address: address,
                emergencyContact: emergencyContact,
                healthConditions: healthConditions,
                // Bạn có thể thêm các trường khác của Profile nếu cần
            };

            await editProfile(profileId, updatedProfileData);
            Alert.alert("Thành công", "Cập nhật hồ sơ thành công!");
            navigation.goBack(); // Quay lại màn hình danh sách sau khi cập nhật
        } catch (error: any) {
            Alert.alert("Lỗi", error?.response?.data?.message || "Không thể cập nhật hồ sơ.");
        }
    };

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <Text>Đang tải thông tin hồ sơ...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text>Lỗi khi tải thông tin hồ sơ: {error}</Text>
            </View>
        );
    }

    if (!profileToEdit) {
        return (
            <View style={styles.centered}>
                <Text>Không tìm thấy hồ sơ.</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.container}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>Chỉnh Sửa Hồ Sơ</Text>

                    <Text style={styles.inputTitle}>Họ</Text>
                    <TextInput style={styles.input} placeholder="Nhập họ" value={firstName} onChangeText={setFirstName} />

                    <Text style={styles.inputTitle}>Tên</Text>
                    <TextInput style={styles.input} placeholder="Nhập tên" value={lastName} onChangeText={setLastName} />

                    <Text style={styles.inputTitle}>Mối quan hệ</Text>
                    <TextInput style={styles.input} placeholder="Nhập mối quan hệ" value={relationship} onChangeText={setRelationship} />

                    <Text style={styles.inputTitle}>Địa chỉ</Text>
                    <TextInput style={styles.input} placeholder="Nhập địa chỉ" value={address} onChangeText={setAddress} />

                    <Text style={styles.inputTitle}>Tên người liên hệ khẩn cấp</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập tên người liên hệ"
                        value={emergencyContact.name}
                        onChangeText={(text) => setEmergencyContact({ ...emergencyContact, name: text })}
                    />

                    <Text style={styles.inputTitle}>Số điện thoại liên hệ khẩn cấp</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập số điện thoại"
                        value={emergencyContact.phone}
                        onChangeText={(text) => setEmergencyContact({ ...emergencyContact, phone: text })}
                        keyboardType="phone-pad"
                    />

                    <Text style={styles.inputTitle}>Tình trạng sức khỏe</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập tình trạng sức khỏe"
                        value={healthConditions[0].condition}
                        onChangeText={(text) =>
                            setHealthConditions([{ condition: text, notes: healthConditions[0].notes }])
                        }
                    />

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
                        onPress={handleUpdateProfile}
                    >
                        <Text style={styles.createButtonText}>Lưu Thay Đổi</Text>
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
        backgroundColor: '#f9f9f9',
        padding: width * 0.05,
        paddingTop: width * 0.1,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2E3A59',
        marginLeft: 10,
        marginBottom: 20,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    inputTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4a5568',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#cbd5e0',
        borderRadius: 8,
        padding: width * 0.04,
        marginBottom: 15,
        backgroundColor: '#fff',
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 2,
    },
    backIcon: {
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 8,
        marginBottom: 20,
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
        backgroundColor: '#48bb78',
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
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
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default EditCareRecipientScreen;