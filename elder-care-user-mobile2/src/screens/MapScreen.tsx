import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import Footer from '../components/Footer'; // Import Footer component

const { width, height } = Dimensions.get('window');

// Mock data for staff progress steps
const progressSteps = [
  { id: 1, title: 'Booking Confirmed', description: 'Your booking has been confirmed', completed: true, time: '10:00 AM' },
  { id: 2, title: 'Caregiver Assigned', description: 'Nurse Sarah has been assigned to you', completed: true, time: '10:15 AM' },
  { id: 3, title: 'On the Way', description: 'Caregiver is on their way to your location', completed: true, time: '10:30 AM' },
  { id: 4, title: 'Arrived', description: 'Caregiver has arrived at your location', completed: false, time: 'Pending' },
  { id: 5, title: 'Care in Progress', description: 'Your care service is in progress', completed: false, time: 'Pending' },
  { id: 6, title: 'Service Completed', description: 'Your care service has been completed', completed: false, time: 'Pending' },
];

const MapScreen = () => {
  const [activeStep, setActiveStep] = useState(3); // Current active step

  // Initialize map region (default location)
  const initialRegion = {
    latitude: 10.7769, // Default to Ho Chi Minh City
    longitude: 106.7009,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  // Caregiver's current location
  const caregiverLocation = {
    latitude: 10.7769,
    longitude: 106.6970, // Slightly offset for demonstration
  };

  // User's location
  const userLocation = {
    latitude: 10.7769,
    longitude: 106.7050, // Slightly offset for demonstration
  };

  return (
    <View style={styles.container}>
      {/* Map View (Part 1) */}
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={initialRegion}
        >
          {/* Caregiver Marker */}
          <Marker
            coordinate={caregiverLocation}
            title="Caregiver"
            description="Sarah - Your Caregiver"
          >
            <View style={styles.caregiverMarker}>
              <Ionicons name="medical" size={24} color="white" />
            </View>
          </Marker>

          {/* User Location Marker */}
          <Marker
            coordinate={userLocation}
            title="Your Location"
            description="Home"
          >
            <View style={styles.userMarker}>
              <Ionicons name="home" size={24} color="white" />
            </View>
          </Marker>
        </MapView>

        {/* Map Controls */}
        <View style={styles.mapControls}>
          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="locate" size={24} color="#28A745" />
          </TouchableOpacity>
        </View>

        {/* Estimated Time Banner */}
        <View style={styles.estimatedTimeBanner}>
          <View style={styles.etaContent}>
            <Text style={styles.etaTitle}>Estimated Arrival</Text>
            <Text style={styles.etaTime}>10 minutes</Text>
          </View>
          <TouchableOpacity style={styles.contactButton}>
            <Ionicons name="call" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress Tracker (Part 2) */}
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Booking Progress</Text>
          <Text style={styles.bookingId}>ID: #ELC5789</Text>
        </View>

        <ScrollView style={styles.stepsContainer}>
          {progressSteps.map((step, index) => (
            <View key={step.id} style={styles.stepItem}>
              {/* Step Timeline */}
              <View style={styles.timeline}>
                <View 
                  style={[
                    styles.timelineDot, 
                    step.completed ? styles.completedDot : 
                    (step.id === activeStep ? styles.activeDot : styles.pendingDot)
                  ]}
                >
                  {step.completed && <Ionicons name="checkmark" size={16} color="white" />}
                </View>
                {index < progressSteps.length - 1 && (
                  <View 
                    style={[
                      styles.timelineBar, 
                      step.completed ? styles.completedBar : styles.pendingBar
                    ]} 
                  />
                )}
              </View>

              {/* Step Content */}
              <View style={styles.stepContent}>
                <View style={styles.stepHeader}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepTime}>{step.time}</Text>
                </View>
                <Text style={styles.stepDescription}>{step.description}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Footer Component */}
      <Footer />
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  // Map Styles
  mapContainer: {
    height: height * 0.45,
    width: '100%',
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapControls: {
    position: 'absolute',
    right: 16,
    bottom: 90,
  },
  controlButton: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  caregiverMarker: {
    backgroundColor: '#28A745',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
  },
  userMarker: {
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
  },
  estimatedTimeBanner: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  etaContent: {
    flex: 1,
  },
  etaTitle: {
    fontSize: 14,
    color: '#666',
  },
  etaTime: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  contactButton: {
    backgroundColor: '#28A745',
    borderRadius: 8,
    padding: 8,
  },

  // Progress Tracker Styles
  progressContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingTop: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  progressHeader: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  bookingId: {
    fontSize: 14,
    color: '#666',
  },
  stepsContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timeline: {
    width: 24,
    alignItems: 'center',
    marginRight: 10,
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  timelineBar: {
    width: 2,
    flex: 1,
    marginVertical: 4,
    marginLeft: 11, // To center the line
  },
  completedDot: {
    backgroundColor: '#28A745',
  },
  activeDot: {
    backgroundColor: '#28A745',
    borderWidth: 2,
    borderColor: 'rgba(40, 167, 69, 0.2)',
  },
  pendingDot: {
    backgroundColor: '#d0d0d0',
  },
  completedBar: {
    backgroundColor: '#28A745',
  },
  pendingBar: {
    backgroundColor: '#d0d0d0',
  },
  stepContent: {
    flex: 1,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  stepTime: {
    fontSize: 14,
    color: '#666',
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});