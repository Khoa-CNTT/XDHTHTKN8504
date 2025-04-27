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
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from "@react-navigation/stack";
import CareProfilesApi from "../api/careRecipientAPI";
import useCareRecipientStore from '../stores/careRecipientStore'; // <-- Đảm bảo import đúng
import AuthStore from '../stores/authStore';
// TODO: Thay USER_ID_FROM_AUTH bằng userId thực tế từ auth

type RootStackParamList = {
  BookingSuccess: undefined;
};
type NavigationProp = StackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

const CreateCareProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [address, setAddress] = useState('');
  const [emergencyContact, setEmergencyContact] = useState({ name: '', phone: '' });
  const [healthConditions, setHealthConditions] = useState([
    { condition: '', notes: '' }
  ]);
  const { user } = AuthStore(); // <-- Lấy user từ store
  const userId = user?._id; // <-- userId lấy từ user.id
  // const userId = '6808ad4cdc447092c07e7ddc'; // <-- Thay bằng ID thực

  const isFormValid =
    firstName && lastName && relationship && address &&
    emergencyContact.name && emergencyContact.phone &&
    healthConditions[0].condition;

  const handleCreateProfile = async () => {
    if (!isFormValid) {
      Alert.alert("Thiếu thông tin", "Vui lòng điền đầy đủ các trường bắt buộc.");
      return;
    }

    try {
      await CareProfilesApi.createProfile(
        userId,
        firstName,
        lastName,
        relationship,
        address,
        emergencyContact,
        healthConditions
      );

      // Fetch lại danh sách hồ sơ
      await useCareRecipientStore.getState().fetchProfiles(userId);

      Alert.alert("Thành công", "Tạo hồ sơ thành công!");
      navigation.navigate("BookingSuccess");
    } catch (error: any) {
      Alert.alert("Lỗi", error?.response?.data?.message || "Không thể tạo hồ sơ.");
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
            <Ionicons name="arrow-back" size={25} color="#2E3A59" />
          </TouchableOpacity>

          <TextInput style={styles.input} placeholder="First Name" value={firstName} onChangeText={setFirstName} />
          <TextInput style={styles.input} placeholder="Last Name" value={lastName} onChangeText={setLastName} />
          <TextInput style={styles.input} placeholder="Relationship" value={relationship} onChangeText={setRelationship} />
          <TextInput style={styles.input} placeholder="Address" value={address} onChangeText={setAddress} />

          {/* Emergency Contact */}
          <TextInput
            style={styles.input}
            placeholder="Emergency Contact Name"
            value={emergencyContact.name}
            onChangeText={(text) =>
              setEmergencyContact({ ...emergencyContact, name: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Emergency Contact Phone"
            value={emergencyContact.phone}
            onChangeText={(text) =>
              setEmergencyContact({ ...emergencyContact, phone: text })
            }
            keyboardType="phone-pad"
          />

          {/* Health Condition */}
          <TextInput
            style={styles.input}
            placeholder="Health Condition"
            value={healthConditions[0].condition}
            onChangeText={(text) =>
              setHealthConditions([{ ...healthConditions[0], condition: text }])
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Health Notes"
            value={healthConditions[0].notes}
            onChangeText={(text) =>
              setHealthConditions([{ ...healthConditions[0], notes: text }])
            }
          />

          <TouchableOpacity
            style={[styles.createButton, isFormValid ? styles.createButtonEnabled : styles.createButtonDisabled]}
            onPress={handleCreateProfile}
          >
            <Text style={styles.createButtonText}>Create profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 50,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: width * 0.05,
    paddingTop: width * 0.1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: width * 0.03,
    marginBottom: 15,
  },
  backIcon: {
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  createButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  createButtonEnabled: {
    backgroundColor: '#007BFF',
  },
  createButtonDisabled: {
    backgroundColor: '#ccc',
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CreateCareProfileScreen;
