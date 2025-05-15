import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Feather, Ionicons } from '@expo/vector-icons';
import useProfileStore from "../stores/profileStore";
import { Profile } from "../types/profile";
import { uploadAvatar } from '../api/uploadService';
import { formatDateToISO } from '../utils/formatDateToISO';

type RootStackParamList = {
    EditCareRecipient: { profileId: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'EditCareRecipient'>;

const bloodGroups = [
    { label: 'A+', value: 'A+' },
    { label: 'A-', value: 'A-' },
    { label: 'B+', value: 'B+' },
    { label: 'B-', value: 'B-' },
    { label: 'AB+', value: 'AB+' },
    { label: 'AB-', value: 'AB-' },
    { label: 'O+', value: 'O+' },
    { label: 'O-', value: 'O-' },
    { label: 'Không rõ', value: 'unknow' }
];

const genderMap: Record<string, "male" | "female" | "other"> = {
    Nam: "male",
    Nữ: "female",
    Khác: "other",
};

type MedicalHistory = {
    name: string;
    description: string;
};

type ErrorState = {
    firstName?: string;
    lastName?: string;
    relationship?: string;
    birthDate?: string;
    gender?: string;
    province?: string;
    district?: string;
    homeAddress?: string;
    phone?: string;
    bloodGroup?: string;
    weight?: string;
    height?: string;
};

const { width } = Dimensions.get('window');

const EditCareRecipientScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute();
    const { profileId } = route.params as { profileId: string };
    const { getProfileById, editProfile, isLoading, error } = useProfileStore();
    const profileToEdit = getProfileById(profileId);

    // State
    const [avatar, setAvatar] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [gender, setGender] = useState('');
    const [province, setProvince] = useState('');
    const [district, setDistrict] = useState('');
    const [homeAddress, setHomeAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [relationship, setRelationship] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [notes, setNotes] = useState('');
    const [medicalHistories, setMedicalHistories] = useState<MedicalHistory[]>([
        { name: '', description: '' },
    ]);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [errors, setErrors] = useState<ErrorState>({});

    useEffect(() => {
        if (profileToEdit) {
            setAvatar(profileToEdit.avartar || '');
            setFirstName(profileToEdit.firstName || '');
            setLastName(profileToEdit.lastName || '');
            setRelationship(profileToEdit.relationship || '');
            setPhone(profileToEdit.phone || '');
            // Parse address
            if (profileToEdit.address) {
                const parts = profileToEdit.address.split(',').map(s => s.trim());
                setHomeAddress(parts[0] || '');
                setDistrict(parts[1] || '');
                setProvince(parts[2] || '');
            }
            setBirthDate(profileToEdit.birthDate ? new Date(profileToEdit.birthDate).toLocaleDateString('vi-VN') : '');
            setGender(profileToEdit.sex || '');
            if (profileToEdit.healthInfo && profileToEdit.healthInfo.length > 0) {
                const info = profileToEdit.healthInfo[0];
                setBloodGroup(info.typeBlood || '');
                setWeight(info.weight ? String(info.weight) : '');
                setHeight(info.height ? String(info.height) : '');
                setNotes(info.notes || '');
                setMedicalHistories(
                    info.condition && Array.isArray(info.condition) && info.condition.length > 0
                        ? info.condition.map((c: any) => ({
                            name: c.name || '',
                            description: c.description || ''
                        }))
                        : [{ name: '', description: '' }]
                );
            }
        }
    }, [profileToEdit]);

    const handleUpload = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
            });
            if (result.canceled) return;
            const url = await uploadAvatar(result.assets[0].uri);
            setAvatar(url);
        } catch (error: any) {
            Alert.alert("Upload thất bại", error.message);
        }
    };

    const handleDateConfirm = (date: Date) => {
        setBirthDate(date.toLocaleDateString('vi-VN'));
        setDatePickerVisibility(false);
    };

    const validate = () => {
        const newErrors: ErrorState = {};
        if (!firstName) newErrors.firstName = 'Vui lòng nhập họ';
        if (!lastName) newErrors.lastName = 'Vui lòng nhập tên';
        if (!relationship) newErrors.relationship = 'Vui lòng nhập mối quan hệ';
        if (!birthDate) newErrors.birthDate = 'Vui lòng chọn ngày sinh';
        if (!gender) newErrors.gender = 'Vui lòng chọn giới tính';
        if (!province) newErrors.province = 'Vui lòng nhập tỉnh/thành';
        if (!district) newErrors.district = 'Vui lòng nhập quận/huyện';
        if (!homeAddress) newErrors.homeAddress = 'Vui lòng nhập địa chỉ';
        if (!phone) newErrors.phone = 'Vui lòng nhập số điện thoại';
        if (!bloodGroup) newErrors.bloodGroup = 'Vui lòng chọn nhóm máu';
        if (!weight) newErrors.weight = 'Vui lòng nhập cân nặng';
        if (!height) newErrors.height = 'Vui lòng nhập chiều cao';
        setErrors(newErrors);

        for (let i = 0; i < medicalHistories.length; i++) {
            const { name, description } = medicalHistories[i];
            if (name && !description) {
                Alert.alert("Thông báo", `Vui lòng nhập mô tả cho bệnh án thứ ${i + 1}`);
                return false;
            }
            if (!name && description) {
                Alert.alert("Thông báo", `Vui lòng nhập tên bệnh án cho bệnh án thứ ${i + 1}`);
                return false;
            }
        }
        return Object.keys(newErrors).length === 0;
    };

    const handleMedicalHistoryChange = (idx: number, field: keyof MedicalHistory, value: string) => {
        setMedicalHistories(prev => {
            const arr = [...prev];
            arr[idx] = { ...arr[idx], [field]: value };
            return arr;
        });
    };

    const handleUpdateProfile = async () => {
        if (!validate()) return;
        try {
            const formatDate = formatDateToISO(birthDate);
            const address = `${homeAddress}, ${district}, ${province}`;
            const payload: Partial<Profile> = {
                avartar: avatar,
                firstName,
                lastName,
                birthDate: formatDate,
                sex: gender as "male" | "female" | "other",
                relationship,
                address,
                phone,
                healthInfo: [
                    {
                        typeBlood: bloodGroup,
                        weight: Number(weight),
                        height: Number(height),
                        notes: notes || undefined,
                        condition: medicalHistories.filter(
                            (m) => m.name && m.description
                        ),
                    },
                ],
            };
            await editProfile(profileId, payload);
            Alert.alert("Thành công", "Cập nhật hồ sơ thành công!");
            navigation.goBack();
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
            <ScrollView style={styles.container}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>

                <View style={{ alignItems: 'center', marginBottom: 24 }}>
                    <TouchableOpacity onPress={handleUpload}>
                        {avatar ? (
                            <Image source={{ uri: avatar }} style={styles.avatarCircle} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Feather name="user" size={36} color="#fff" />
                            </View>
                        )}
                        <View style={styles.avatarAdd}>
                            <Feather name="plus" size={18} color="#fff" />
                        </View>
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Họ <Text style={styles.required}>*</Text></Text>
                <TextInput
                    style={[styles.input, errors.firstName && styles.inputError]}
                    placeholder="Nhập họ của bạn"
                    value={firstName}
                    onChangeText={setFirstName}
                />
                {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}

                <Text style={styles.label}>Tên <Text style={styles.required}>*</Text></Text>
                <TextInput
                    style={[styles.input, errors.lastName && styles.inputError]}
                    placeholder="Nhập tên của bạn"
                    value={lastName}
                    onChangeText={setLastName}
                />
                {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}

                <Text style={styles.label}>Mối quan hệ <Text style={styles.required}>*</Text></Text>
                <TextInput
                    style={[styles.input, errors.relationship && styles.inputError]}
                    placeholder="Bạn có quan hệ gì với chủ tài khoản?"
                    value={relationship}
                    onChangeText={setRelationship}
                />
                {errors.relationship && <Text style={styles.errorText}>{errors.relationship}</Text>}

                <Text style={styles.label}>Ngày sinh <Text style={styles.required}>*</Text></Text>
                <TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
                    <TextInput
                        style={[styles.input, errors.birthDate && styles.inputError]}
                        placeholder="Chọn ngày/tháng/năm"
                        value={birthDate}
                        editable={false}
                        pointerEvents="none"
                    />
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleDateConfirm}
                        onCancel={() => setDatePickerVisibility(false)}
                        maximumDate={new Date()}
                    />
                </TouchableOpacity>
                {errors.birthDate && <Text style={styles.errorText}>{errors.birthDate}</Text>}

                <Text style={styles.label}>Giới tính <Text style={styles.required}>*</Text></Text>
                <View style={styles.genderRow}>
                    {Object.entries(genderMap).map(([label, value]) => (
                        <TouchableOpacity
                            key={value}
                            style={[
                                styles.radioBtn,
                                gender === value && styles.radioBtnActive,
                            ]}
                            onPress={() => setGender(value)}
                        >
                            <View
                                style={[
                                    styles.radioCircle,
                                    gender === value && styles.radioChecked,
                                ]}
                            />
                            <Text style={styles.radioLabel}>{label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}

                <Text style={styles.label}>Tỉnh/Thành phố</Text>
                <TextInput
                    style={[styles.input, errors.province && styles.inputError]}
                    placeholder="Nhập tỉnh/thành phố"
                    value={province}
                    onChangeText={setProvince}
                />
                {errors.province && <Text style={styles.errorText}>{errors.province}</Text>}

                <Text style={styles.label}>Quận/Huyện</Text>
                <TextInput
                    style={[styles.input, errors.district && styles.inputError]}
                    placeholder="Nhập quận/huyện"
                    value={district}
                    onChangeText={setDistrict}
                />
                {errors.district && <Text style={styles.errorText}>{errors.district}</Text>}

                <Text style={styles.label}>Địa chỉ</Text>
                <TextInput
                    style={[styles.input, errors.homeAddress && styles.inputError]}
                    placeholder="Nhập địa chỉ chi tiết"
                    value={homeAddress}
                    onChangeText={setHomeAddress}
                />
                {errors.homeAddress && <Text style={styles.errorText}>{errors.homeAddress}</Text>}

                <Text style={styles.label}>Số điện thoại</Text>
                <TextInput
                    style={[styles.input, errors.phone && styles.inputError]}
                    placeholder="Nhập số điện thoại"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                />
                {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

                <Text style={styles.label}>Nhóm máu <Text style={styles.required}>*</Text></Text>
                <View style={styles.dropdown}>
                    <Picker selectedValue={bloodGroup} onValueChange={setBloodGroup}>
                        <Picker.Item label="Chọn nhóm máu" value="" />
                        {bloodGroups.map((bg) => (
                            <Picker.Item
                                key={bg.value}
                                label={bg.label}
                                value={bg.value}
                            />
                        ))}
                    </Picker>
                    <Feather
                        name="chevron-down"
                        size={20}
                        color="#777"
                        style={styles.dropdownIcon}
                    />
                </View>
                {errors.bloodGroup && <Text style={styles.errorText}>{errors.bloodGroup}</Text>}

                <Text style={styles.label}>Cân nặng (kg) <Text style={styles.required}>*</Text></Text>
                <TextInput
                    style={[styles.input, errors.weight && styles.inputError]}
                    placeholder="Nhập cân nặng"
                    keyboardType="numeric"
                    value={weight}
                    onChangeText={setWeight}
                />
                {errors.weight && <Text style={styles.errorText}>{errors.weight}</Text>}

                <Text style={styles.label}>Chiều cao (cm) <Text style={styles.required}>*</Text></Text>
                <TextInput
                    style={[styles.input, errors.height && styles.inputError]}
                    placeholder="Nhập chiều cao"
                    keyboardType="numeric"
                    value={height}
                    onChangeText={setHeight}
                />
                {errors.height && <Text style={styles.errorText}>{errors.height}</Text>}

                {/* Tiểu sử bệnh án + Thêm bệnh án */}
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: 16,
                        marginBottom: 8,
                    }}
                >
                    <Text style={[styles.label, { marginTop: 0, marginBottom: 0 }]}>
                        Tiểu sử bệnh án
                    </Text>
                    <TouchableOpacity
                        style={{
                            backgroundColor: "#37B44E",
                            borderRadius: 8,
                            paddingVertical: 6,
                            paddingHorizontal: 12,
                            alignItems: "center",
                            marginLeft: 8,
                        }}
                        onPress={() =>
                            setMedicalHistories([
                                ...medicalHistories,
                                { name: "", description: "" },
                            ])
                        }
                    >
                        <Text
                            style={{ color: "#fff", fontWeight: "bold", fontSize: 15 }}
                        >
                            + Thêm bệnh án
                        </Text>
                    </TouchableOpacity>
                </View>
                {medicalHistories.map((item, idx) => (
                    <View key={idx} style={{ marginBottom: 12 }}>
                        <TextInput
                            style={styles.input}
                            placeholder="Tên bệnh án"
                            value={item.name}
                            onChangeText={(text) =>
                                handleMedicalHistoryChange(idx, 'name', text)
                            }
                        />
                        <TextInput
                            style={styles.textArea}
                            placeholder="Mô tả bệnh án"
                            value={item.description}
                            onChangeText={(text) =>
                                handleMedicalHistoryChange(idx, 'description', text)
                            }
                            multiline
                        />
                    </View>
                ))}

                <Text style={styles.label}>Lưu ý chăm sóc</Text>
                <TextInput
                    style={styles.textArea}
                    placeholder="Nhập các lưu ý đặc biệt về chăm sóc (nếu có)"
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                />

                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleUpdateProfile}
                >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
                        <Feather
                            name="check-circle"
                            size={20}
                            color="#fff"
                            style={{ marginLeft: 8 }}
                        />
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f6f8',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    avatarPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#d1d5db',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    avatarAdd: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#3b82f6',
        borderRadius: 14,
        width: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#334155',
        marginTop: 16,
        marginBottom: 8,
    },
    required: {
        color: '#dc2626',
    },
    input: {
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#1e293b',
        backgroundColor: '#fff',
        marginBottom: 12,
    },
    inputError: {
        borderColor: '#dc2626',
    },
    errorText: {
        color: '#dc2626',
        marginBottom: 8,
        fontSize: 14,
    },
    genderRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    radioBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 24,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#cbd5e0',
    },
    radioBtnActive: {
        borderColor: '#3b82f6',
        backgroundColor: '#eff6ff',
    },
    radioCircle: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 1,
        borderColor: '#3b82f6',
        marginRight: 8,
        backgroundColor: '#fff',
    },
    radioChecked: {
        backgroundColor: '#3b82f6',
        borderColor: '#3b82f6',
    },
    radioLabel: {
        fontSize: 16,
        color: '#334155',
    },
    dropdown: {
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        marginBottom: 12,
        backgroundColor: '#fff',
        overflow: 'hidden',
        justifyContent: 'center',
    },
    dropdownIcon: {
        position: 'absolute',
        right: 16,
        color: '#777',
    },
    saveButton: {
        backgroundColor: '#22c55e',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 32,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    textArea: {
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#1e293b',
        backgroundColor: '#fff',
        marginBottom: 12,
        textAlignVertical: 'top',
        minHeight: 100,
    },
    backIcon: {
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 8,
        marginBottom: 10,
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 2,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default EditCareRecipientScreen;
///mmmmmmmmmmmm