import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/StackNavigator';
import { useBookings } from '../context/BookingsContext';
import Footer from '../components/Footer';

type TabType = 'Upcoming' | 'Completed' | 'Canceled';
type NavigationProp = StackNavigationProp<RootStackParamList>;

const MyBookings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('Upcoming');
  const { bookings, cancelBooking } = useBookings();
  const navigation = useNavigation<NavigationProp>();

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'Upcoming') return booking.status === 'upcoming';
    if (activeTab === 'Completed') return booking.status === 'completed';
    return booking.status === 'cancelled';
  });

  const handleReschedule = (booking: any) => {
    navigation.navigate('BookAppointment', {
      doctor: {
        id: booking.doctorId,
        name: booking.doctorName,
        specialty: booking.doctorSpecialty,
        image: booking.doctorImage,
        clinic: booking.clinic,
      }
    });
  };

  const renderAppointmentCard = (booking: any) => (
    <View key={booking.id} style={styles.appointmentCard}>
      <Text style={styles.dateTime}>{booking.date}</Text>
      
      <View style={styles.doctorInfo}>
        <Image 
          source={booking.doctorImage} 
          style={styles.doctorImage}
        />
        <View style={styles.doctorDetails}>
          <Text style={styles.doctorName}>{booking.doctorName}</Text>
          <Text style={styles.specialty}>{booking.doctorSpecialty}</Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={14} color="#8F9BB3" />
            <Text style={styles.locationText}>{booking.clinic}</Text>
          </View>
        </View>
      </View>

      {activeTab === 'Upcoming' && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => cancelBooking(booking.id)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.rescheduleButton}
            onPress={() => handleReschedule(booking)}
          >
            <Text style={styles.rescheduleButtonText}>Reschedule</Text>
          </TouchableOpacity>
        </View>
      )}

      {activeTab === 'Completed' && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.reBookButton}
            onPress={() => handleReschedule(booking)}
          >
            <Text style={styles.reBookButtonText}>Re-Book</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reviewButton}>
            <Text style={styles.reviewButtonText}>Add Review</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Bookings</Text>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('Upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'Upcoming' && styles.activeTabText]}>
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Completed' && styles.activeTab]}
          onPress={() => setActiveTab('Completed')}
        >
          <Text style={[styles.tabText, activeTab === 'Completed' && styles.activeTabText]}>
            Completed
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Canceled' && styles.activeTab]}
          onPress={() => setActiveTab('Canceled')}
        >
          <Text style={[styles.tabText, activeTab === 'Canceled' && styles.activeTabText]}>
            Canceled
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredBookings.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No {activeTab.toLowerCase()} appointments</Text>
          </View>
        ) : (
          filteredBookings.map(renderAppointmentCard)
        )}
      </ScrollView>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2E3A59',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF1F7',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2E3A59',
  },
  tabText: {
    fontSize: 14,
    color: '#8F9BB3',
  },
  activeTabText: {
    color: '#2E3A59',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  appointmentCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  dateTime: {
    fontSize: 14,
    color: '#2E3A59',
    marginBottom: 12,
    fontWeight: '500',
  },
  doctorInfo: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  doctorImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  doctorDetails: {
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
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: '#8F9BB3',
    marginLeft: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#F7F9FC',
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#2E3A59',
    fontWeight: '500',
  },
  rescheduleButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#2E3A59',
    borderRadius: 12,
    alignItems: 'center',
  },
  rescheduleButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  reBookButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F7F9FC',
    borderRadius: 8,
    alignItems: 'center',
  },
  reBookButtonText: {
    fontSize: 14,
    color: '#2E3A59',
    fontWeight: '500',
  },
  reviewButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#2E3A59',
    borderRadius: 8,
    alignItems: 'center',
  },
  reviewButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#8F9BB3',
  },
});

export default MyBookings;