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
  Modal,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  BookingSuccess: undefined;
};
type NavigationProp = StackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

const CreateCareProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  // Updated state variables
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [healthStatus, setHealthStatus] = useState('');
  const [underlyingDiseases, setUnderlyingDiseases] = useState('');
  const [allergies, setAllergies] = useState('');
  const [specialCare, setSpecialCare] = useState('');
  const [showGenderModal, setShowGenderModal] = useState(false);

  // Validation
  const isAgeValid = /^\d+$/.test(age) && age.trim() !== '';
  const isFormValid =
    name.trim() !== '' &&
    isAgeValid &&
    gender.trim() !== '';

  const handleCreateProfile = () => {
    if (isFormValid) {
      console.log('Creating Care Profile with data:', {
        name,
        age,
        gender,
        healthStatus,
        underlyingDiseases,
        allergies,
        specialCare,
      });
      navigation.navigate('BookingSuccess');
    }
  };

  const selectGender = (selectedGender: string) => {
    setGender(selectedGender);
    setShowGenderModal(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>

          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
            <Ionicons name="arrow-back" size={25} color="#2E3A59" />
             {/* <Text style={styles.title}>Let's create your Care Profile</Text> */}
          </TouchableOpacity>

          {/* Name */}
          <TextInput
            style={[styles.input, name.trim() === '' && !isFormValid && styles.errorInput]}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
          {name.trim() === '' && !isFormValid && (
            <Text style={styles.errorText}>Name is required</Text>
          )}

          {/* Age */}
          <TextInput
            style={[styles.input, (!isAgeValid && age.trim() !== '') && !isFormValid && styles.errorInput]}
            placeholder="Age"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
            maxLength={3}
          />
          {(!isAgeValid && age.trim() !== '') && !isFormValid && (
            <Text style={styles.errorText}>Please enter a valid age</Text>
          )}

          {/* Gender */}
          <TouchableOpacity onPress={() => setShowGenderModal(true)}>
            <TextInput
              style={[styles.input, gender.trim() === '' && !isFormValid && styles.errorInput]}
              placeholder="Select Gender"
              value={gender}
              editable={false}
              pointerEvents="none"
            />
          </TouchableOpacity>
          {gender.trim() === '' && !isFormValid && (
            <Text style={styles.errorText}>Gender is required</Text>
          )}

          {/* Health Status */}
          <TextInput
            style={styles.input}
            placeholder="Health Status"
            value={healthStatus}
            onChangeText={setHealthStatus}
            multiline
          />

          {/* Underlying Diseases */}
          <TextInput
            style={styles.input}
            placeholder="Underlying Diseases"
            value={underlyingDiseases}
            onChangeText={setUnderlyingDiseases}
            multiline
          />

          {/* Allergies */}
          <TextInput
            style={styles.input}
            placeholder="Allergies"
            value={allergies}
            onChangeText={setAllergies}
            multiline
          />

          {/* Special Care Requirements */}
          <TextInput
            style={styles.input}
            placeholder="Special Care Requirements"
            value={specialCare}
            onChangeText={setSpecialCare}
            multiline
          />

          {/* Create button */}
          <TouchableOpacity
            style={[styles.createButton, isFormValid ? styles.createButtonEnabled : styles.createButtonDisabled]}
            onPress={handleCreateProfile}
            disabled={!isFormValid}
          >
            <Text style={styles.createButtonText}>Create profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Gender Modal */}
      <Modal
        visible={showGenderModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowGenderModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowGenderModal(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Gender</Text>
          {['Male', 'Female', 'Other', 'Prefer not to say'].map(option => (
            <TouchableOpacity key={option} style={styles.genderOption} onPress={() => selectGender(option)}>
              <Text>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
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
  title: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: width * 0.03,
    marginBottom: 15,
  },
  backIcon: {
    marginBottom: 10, // Space below the icon
    alignSelf: 'flex-start',
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 15,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  genderOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default CreateCareProfileScreen;