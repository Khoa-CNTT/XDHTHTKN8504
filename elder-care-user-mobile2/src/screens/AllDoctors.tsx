import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import SearchBox from '../components/SearchBox';
import { useFavorites } from '../context/FavoritesContext';

type RootStackParamList = {
  Home: undefined;
  AllDoctors: undefined;
  DoctorDetails: { doctor: any };
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  clinic: string;
  rating: number;
  reviews: number;
  image: any;
  isFavorite: boolean;
};

type DoctorItemProps = {
  doctor: Doctor;
  navigation: NavigationProp;
};

const DoctorItem: React.FC<DoctorItemProps> = ({ doctor, navigation }) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  const handlePress = () => {
    navigation.navigate('DoctorDetails', { doctor });
  };

  const toggleFavorite = (e: any) => {
    e.stopPropagation();
    if (isFavorite(doctor.id)) {
      removeFavorite(doctor.id);
    } else {
      addFavorite(doctor);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.doctorCard}
      onPress={handlePress}
    >
      <View style={styles.doctorInfo}>
        <Image source={doctor.image} style={styles.doctorImage} />
        <View style={styles.textContainer}>
          <Text style={styles.doctorName}>{doctor.name}</Text>
          <Text style={styles.specialty}>{doctor.specialty}</Text>
          <Text style={styles.clinic}>{doctor.clinic}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{doctor.rating}</Text>
            <Text style={styles.reviews}>{doctor.reviews} Reviews</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
          <Ionicons 
            name={isFavorite(doctor.id) ? "heart" : "heart-outline"} 
            size={24} 
            color={isFavorite(doctor.id) ? "#FF4B4B" : "#8F9BB3"} 
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const specialties = ['All', 'General', 'Cardiologist', 'Dentist', 'Pediatrics'];

const doctors = [
  {
    id: '1',
    name: 'Dr. David Patel',
    specialty: 'Cardiologist',
    clinic: 'Cardiology Center, USA',
    rating: 5,
    reviews: 1872,
    image: require('../asset/img/hinh1.png'),
    isFavorite: false,
  },
  {
    id: '2',
    name: 'Dr. Jessica Turner',
    specialty: 'General',
    clinic: "Women's Clinic,Seattle,USA",
    rating: 4.9,
    reviews: 127,
    image: require('../asset/img/hinh1.png'),
    isFavorite: false,
  },
  {
    id: '3',
    name: 'Dr. Michael Johnson',
    specialty: 'Dentist',
    clinic: 'Maple Associates, NY,USA',
    rating: 4.7,
    reviews: 5223,
    image: require('../asset/img/hinh1.png'),
    isFavorite: false,
  },
  {
    id: '4',
    name: 'Dr. Emily Walker',
    specialty: 'Pediatrics',
    clinic: 'Serenity Pediatrics Clinic',
    rating: 5,
    reviews: 405,
    image: require('../asset/img/hinh1.png'),
    isFavorite: false,
  },
  {
    id: '5',
    name: 'Dr. Sarah Chen',
    specialty: 'Pediatrics',
    clinic: 'Children First Medical Center',
    rating: 4.9,
    reviews: 728,
    image: require('../asset/img/hinh1.png'),
    isFavorite: false,
  },
];

const AllDoctors: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const handleBack = () => {
    navigation.goBack();
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = searchQuery === '' || 
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.clinic.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSpecialty = selectedSpecialty === 'All' || doctor.specialty === selectedSpecialty;
    
    return matchesSearch && matchesSpecialty;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2E3A59" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Doctors</Text>
      </View>

      <SearchBox
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search doctor..."
      />

      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          {specialties.map((specialty) => (
            <TouchableOpacity
              key={specialty}
              style={[
                styles.filterChip,
                selectedSpecialty === specialty && styles.filterChipSelected,
              ]}
              onPress={() => setSelectedSpecialty(specialty)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedSpecialty === specialty && styles.filterChipTextSelected,
                ]}
              >
                {specialty}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>{filteredDoctors.length} founds</Text>
        <TouchableOpacity style={styles.sortButton}>
          <Text style={styles.sortButtonText}>Default</Text>
          <Ionicons name="chevron-down" size={16} color="#8F9BB3" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredDoctors}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.doctorsList}
        renderItem={({ item }) => (
          <DoctorItem doctor={item} navigation={navigation} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
    color: '#2E3A59',
  },
  filterWrapper: {
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  filterContent: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 100,
    backgroundColor: '#fff',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E4E9F2',
  },
  filterChipSelected: {
    backgroundColor: '#2E3A59',
    borderColor: '#2E3A59',
  },
  filterChipText: {
    color: '#2E3A59',
    fontSize: 14,
    fontWeight: '500',
  },
  filterChipTextSelected: {
    color: '#fff',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
  },
  resultsCount: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2E3A59',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortButtonText: {
    color: '#8F9BB3',
    fontSize: 14,
    marginRight: 4,
  },
  doctorsList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  doctorCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#EDF1F7',
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E3A59',
    marginBottom: 4,
  },
  specialty: {
    fontSize: 14,
    color: '#8F9BB3',
    marginBottom: 4,
  },
  clinic: {
    fontSize: 14,
    color: '#8F9BB3',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2E3A59',
    marginLeft: 4,
    marginRight: 4,
  },
  reviews: {
    fontSize: 14,
    color: '#8F9BB3',
  },
  favoriteButton: {
    padding: 4,
  },
});

export default AllDoctors; 