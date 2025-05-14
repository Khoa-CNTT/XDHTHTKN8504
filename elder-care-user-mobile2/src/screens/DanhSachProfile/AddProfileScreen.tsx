import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, ScrollView, Image, Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Feather } from '@expo/vector-icons';

type RootStackParamList = {
    Home: undefined;
    ServiceScreen: { serviceId: string };
    Seach: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const bloodGroups = [
    { label: 'A+', value: 'A+' },
    { label: 'A-', value: 'A-' },
    { label: 'B+', value: 'B+' },
    { label: 'B-', value: 'B-' },
    { label: 'AB+', value: 'AB+' },
    { label: 'AB-', value: 'AB-' },
    { label: 'O+', value: 'O+' },
    { label: 'O-', value: 'O-' },
];

const AddProfileScreen: React.FC = () => {
    const [step, setStep] = useState(1);
    const navigation = useNavigation<NavigationProp>();

    // Step 1 state
    const [avatar, setAvatar] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [province, setProvince] = useState('');
    const [district, setDistrict] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');

    const [nameError, setNameError] = useState('');
    const [dobError, setDobError] = useState('');
    const [genderError, setGenderError] = useState('');
    const [provinceError, setProvinceError] = useState('');
    const [districtError, setDistrictError] = useState('');
    const [addressError, setAddressError] = useState('');
    const [phoneError, setPhoneError] = useState('');

    // Step 2 state
    const [bloodGroup, setBloodGroup] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [careNote, setCareNote] = useState('');

    const [bloodGroupError, setBloodGroupError] = useState('');
    const [weightError, setWeightError] = useState('');
    const [heightError, setHeightError] = useState('');

    // Medical histories: array of { name, desc }
    const [medicalHistories, setMedicalHistories] = useState([{ name: '', desc: '' }]);

    // Date picker
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    // Avatar picker
    const pickAvatar = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert("Thông báo", "Bạn cần cấp quyền truy cập ảnh để chọn avatar.");
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });
        if (!result.canceled && result.assets && result.assets.length > 0) {
            setAvatar(result.assets[0].uri);
        }
    };

    const handleConfirmDate = (date: Date) => {
        const formatted = date.toLocaleDateString('vi-VN'); // định dạng dd/mm/yyyy
        setDob(formatted);
        setDatePickerVisibility(false);
    };

    const validateStep1 = () => {
        let valid = true;

        setNameError(name ? '' : 'Vui lòng nhập họ và tên');
        setDobError(dob ? '' : 'Vui lòng chọn ngày sinh');
        setGenderError(gender ? '' : 'Vui lòng chọn giới tính');
        setProvinceError(province ? '' : 'Vui lòng nhập tỉnh/thành');
        setDistrictError(district ? '' : 'Vui lòng nhập quận/huyện');
        setAddressError(address ? '' : 'Vui lòng nhập địa chỉ');
        setPhoneError(phone ? '' : 'Vui lòng nhập số điện thoại');

        if (!name || !dob || !gender || !province || !district || !address || !phone) {
            valid = false;
        }

        return valid;
    };

    const validateStep2 = () => {
        let valid = true;

        setBloodGroupError(bloodGroup ? '' : 'Vui lòng chọn nhóm máu');
        setWeightError(weight ? '' : 'Vui lòng nhập cân nặng');
        setHeightError(height ? '' : 'Vui lòng nhập chiều cao');

        if (!bloodGroup || !weight || !height) {
            valid = false;
        }

        // Validate medical histories: nếu có bệnh án thì phải nhập tên bệnh án
        for (let i = 0; i < medicalHistories.length; i++) {
            if (medicalHistories[i].name && !medicalHistories[i].desc) {
                Alert.alert('Thông báo', `Vui lòng nhập mô tả cho bệnh án thứ ${i + 1}`);
                return false;
            }
            if (!medicalHistories[i].name && medicalHistories[i].desc) {
                Alert.alert('Thông báo', `Vui lòng nhập tên bệnh án cho bệnh án thứ ${i + 1}`);
                return false;
            }
        }

        return valid;
    };

    return (
        <ScrollView style={styles.container}>
            {step === 1 && (
                <View>
                    <View style={styles.avatarContainer}>
                        <TouchableOpacity onPress={pickAvatar}>
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

                    <Text style={styles.label}>Họ và tên <Text style={styles.required}>*</Text></Text>
                    <TextInput
                        style={[styles.input, nameError && styles.inputError]}
                        placeholder="Nhập họ và tên"
                        value={name}
                        onChangeText={setName}
                    />
                    {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

                    <Text style={styles.label}>Ngày sinh <Text style={styles.required}>*</Text></Text>
                    <TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
                        <TextInput
                            style={[styles.input, dobError && styles.inputError]}
                            placeholder="Chọn ngày/tháng/năm"
                            value={dob}
                            editable={false}
                            pointerEvents="none"
                        />
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            onConfirm={handleConfirmDate}
                            onCancel={() => setDatePickerVisibility(false)}
                            maximumDate={new Date()}
                        />
                    </TouchableOpacity>
                    {dobError ? <Text style={styles.errorText}>{dobError}</Text> : null}

                    <Text style={styles.label}>Giới tính <Text style={styles.required}>*</Text></Text>
                    <View style={styles.genderRow}>
                        {['Nam', 'Nữ', 'Khác'].map(g => (
                            <TouchableOpacity
                                key={g}
                                style={[styles.radioBtn, gender === g && styles.radioBtnActive]}
                                onPress={() => setGender(g)}
                            >
                                <View style={[styles.radioCircle, gender === g && styles.radioChecked]} />
                                <Text style={styles.radioLabel}>{g}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    {genderError ? <Text style={styles.errorText}>{genderError}</Text> : null}

                    <Text style={styles.label}>Tỉnh/Thành phố</Text>
                    <TextInput
                        style={[styles.input, provinceError && styles.inputError]}
                        placeholder="Nhập tỉnh/thành phố"
                        value={province}
                        onChangeText={setProvince}
                    />
                    {provinceError ? <Text style={styles.errorText}>{provinceError}</Text> : null}

                    <Text style={styles.label}>Quận/Huyện</Text>
                    <TextInput
                        style={[styles.input, districtError && styles.inputError]}
                        placeholder="Nhập quận/huyện"
                        value={district}
                        onChangeText={setDistrict}
                    />
                    {districtError ? <Text style={styles.errorText}>{districtError}</Text> : null}

                    <Text style={styles.label}>Địa chỉ</Text>
                    <TextInput
                        style={[styles.input, addressError && styles.inputError]}
                        placeholder="Nhập địa chỉ chi tiết"
                        value={address}
                        onChangeText={setAddress}
                    />
                    {addressError ? <Text style={styles.errorText}>{addressError}</Text> : null}

                    <Text style={styles.label}>Số điện thoại</Text>
                    <TextInput
                        style={[styles.input, phoneError && styles.inputError]}
                        placeholder="Nhập số điện thoại"
                        keyboardType="phone-pad"
                        value={phone}
                        onChangeText={setPhone}
                    />
                    {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}

                    <TouchableOpacity
                        style={styles.nextButton}
                        onPress={() => {
                            if (validateStep1()) setStep(2);
                        }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.nextButtonText}>Tiếp tục</Text>
                            <Feather name="arrow-right" size={20} color="#fff" style={{ marginLeft: 8 }} />
                        </View>
                    </TouchableOpacity>
                </View>
            )}

            {step === 2 && (
                <View>
                    <Text style={styles.label}>Nhóm máu <Text style={styles.required}>*</Text></Text>
                    <View style={styles.dropdown}>
                        <Picker
                            selectedValue={bloodGroup}
                            onValueChange={setBloodGroup}
                        >
                            <Picker.Item label="Chọn nhóm máu" value="" />
                            {bloodGroups.map(bg => (
                                <Picker.Item key={bg.value} label={bg.label} value={bg.value} />
                            ))}
                        </Picker>
                        <Feather name="chevron-down" size={20} color="#777" style={styles.dropdownIcon} />
                    </View>
                    {bloodGroupError ? <Text style={styles.errorText}>{bloodGroupError}</Text> : null}

                    <Text style={styles.label}>Cân nặng (kg) <Text style={styles.required}>*</Text></Text>
                    <TextInput
                        style={[styles.input, weightError && styles.inputError]}
                        placeholder="Nhập cân nặng"
                        keyboardType="numeric"
                        value={weight}
                        onChangeText={setWeight}
                    />
                    {weightError ? <Text style={styles.errorText}>{weightError}</Text> : null}

                    <Text style={styles.label}>Chiều cao (cm) <Text style={styles.required}>*</Text></Text>
                    <TextInput
                        style={[styles.input, heightError && styles.inputError]}
                        placeholder="Nhập chiều cao"
                        keyboardType="numeric"
                        value={height}
                        onChangeText={setHeight}
                    />
                    {heightError ? <Text style={styles.errorText}>{heightError}</Text> : null}

                    {/* Tiểu sử bệnh án + Thêm bệnh án */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, marginBottom: 8 }}>
                        <Text style={[styles.label, { marginTop: 0, marginBottom: 0 }]}>Tiểu sử bệnh án</Text>
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#37B44E',
                                borderRadius: 8,
                                paddingVertical: 6,
                                paddingHorizontal: 12,
                                alignItems: 'center',
                                marginLeft: 8,
                            }}
                            onPress={() => setMedicalHistories([...medicalHistories, { name: '', desc: '' }])}
                        >
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>+ Thêm bệnh án</Text>
                        </TouchableOpacity>
                    </View>
                    {medicalHistories.map((item, idx) => (
                        <View key={idx} style={{ marginBottom: 12 }}>
                            <TextInput
                                style={styles.input}
                                placeholder="Tên bệnh án"
                                value={item.name}
                                onChangeText={text => {
                                    const arr = [...medicalHistories];
                                    arr[idx].name = text;
                                    setMedicalHistories(arr);
                                }}
                            />
                            <TextInput
                                style={styles.textArea}
                                placeholder="Mô tả bệnh án"
                                value={item.desc}
                                onChangeText={text => {
                                    const arr = [...medicalHistories];
                                    arr[idx].desc = text;
                                    setMedicalHistories(arr);
                                }}
                                multiline
                            />
                        </View>
                    ))}

                    <Text style={styles.label}>Lưu ý chăm sóc</Text>
                    <TextInput
                        style={styles.textArea}
                        placeholder="Nhập các lưu ý đặc biệt về chăm sóc (nếu có)"
                        value={careNote}
                        onChangeText={setCareNote}
                        multiline
                    />

                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={() => {
                            if (validateStep2()) {
                                Alert.alert("Thành công", "Hồ sơ đã được lưu!");
                                // Logic lưu dữ liệu ở đây nếu cần
                            }
                        }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.saveButtonText}>Lưu hồ sơ</Text>
                            <Feather name="check-circle" size={20} color="#fff" style={{ marginLeft: 8 }} />
                        </View>
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f6f8',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 24,
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
    nextButton: {
        backgroundColor: '#3b82f6',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 24,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    nextButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
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
        borderRadius:8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#1e293b',
        backgroundColor: '#fff',
        marginBottom: 12,
        textAlignVertical: 'top',
        minHeight: 100,
    },
});

export default AddProfileScreen;