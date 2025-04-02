import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/StackNavigator';
import { useFavorites } from '../context/FavoritesContext';

type DoctorDetailsProps = {
  route: RouteProp<RootStackParamList, 'DoctorDetails'>;
  navigation: StackNavigationProp<RootStackParamList>;
};

const DoctorDetails: React.FC<DoctorDetailsProps> = ({ route, navigation }) => {
  const { doctor } = route.params;
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  const toggleFavorite = () => {
    if (isFavorite(doctor.id)) {
      removeFavorite(doctor.id);
    } else {
      addFavorite(doctor);
    }
  };

  const stats = [
    { value: '2,000+', label: 'patients' },
    { value: '10+', label: 'experience' },
    { value: doctor.rating, label: 'rating' },
    { value: doctor.reviews, label: 'reviews' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#2E3A59" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Doctor Details</Text>
        <TouchableOpacity onPress={toggleFavorite}>
          <Ionicons 
            name={isFavorite(doctor.id) ? "heart" : "heart-outline"} 
            size={24} 
            color={isFavorite(doctor.id) ? "#FF4B4B" : "#2E3A59"} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.doctorProfile}>
        <Image source={doctor.image} style={styles.doctorImage} />
        <Text style={styles.doctorName}>{doctor.name}</Text>
        <Text style={styles.specialty}>{doctor.specialty}</Text>
        <Text style={styles.clinic}>{doctor.clinic}</Text>
      </View>

      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About me</Text>
        <Text style={styles.aboutText}>
          {doctor.name} is a dedicated {doctor.specialty.toLowerCase()}, brings a wealth of experience to {doctor.clinic}.
          <Text style={styles.viewMore}> view more</Text>
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Working Time</Text>
        <Text style={styles.workingTime}>Monday-Friday, 08:00 AM-18:00 PM</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.reviewHeader}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.reviewItem}>
          <Image 
            source={require('../asset/img/hinh1.png')} 
            style={styles.reviewerImage} 
          />
          <View style={styles.reviewContent}>
            <Text style={styles.reviewerName}>Emily Anderson</Text>
            <View style={styles.ratingStars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons 
                  key={star} 
                  name="star" 
                  size={16} 
                  color="#FFD700" 
                  style={styles.star}
                />
              ))}
            </View>
            <Text style={styles.reviewText}>
              Dr. Patel is a true professional who genuinely cares about his patients. I highly recommend Dr. Patel to
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.bookButton}
        onPress={() => {
          console.log('Navigating to BookAppointment with doctor:', doctor);
          navigation.navigate('BookAppointment', { doctor });
        }}
      >
        <Text style={styles.bookButtonText}>Book Appointment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E3A59',
  },
  doctorProfile: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  doctorImage: {
    width: 100,
    height: 100,
    borderRadius: 16,
    marginBottom: 16,
  },
  doctorName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2E3A59',
    marginBottom: 8,
  },
  specialty: {
    fontSize: 16,
    color: '#8F9BB3',
    marginBottom: 4,
  },
  clinic: {
    fontSize: 14,
    color: '#8F9BB3',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 24,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#EDF1F7',
    marginHorizontal: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E3A59',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#8F9BB3',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E3A59',
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#8F9BB3',
  },
  viewMore: {
    color: '#2E3A59',
    fontWeight: '500',
  },
  workingTime: {
    fontSize: 14,
    color: '#8F9BB3',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
    color: '#2E3A59',
    fontWeight: '500',
  },
  reviewItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  reviewerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewContent: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2E3A59',
    marginBottom: 4,
  },
  ratingStars: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  star: {
    marginRight: 4,
  },
  reviewText: {
    fontSize: 14,
    color: '#8F9BB3',
    lineHeight: 20,
  },
  bookButton: {
    backgroundColor: '#2E3A59',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DoctorDetails; 