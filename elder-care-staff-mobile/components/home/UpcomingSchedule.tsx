import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const UpcomingSchedule = () => {
  return (
    <View style={styles.upcomingRideContainer}>
      <Text style={styles.upcomingRideTitle}>New Upcoming Ride</Text>
      <View style={styles.rideDetailsCard}>
        <View style={styles.riderInfo}>
          <Image
            source={{ uri: "https://via.placeholder.com/50" }} 
            style={styles.riderAvatar}
          />
          <Text style={styles.riderName}>Johnson Smithkover</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#ffc107" />
            <Text style={styles.rating}>4.5</Text>
          </View>
          <View style={styles.rideIdContainer}>
            <Text style={styles.rideId}>256</Text>
          </View>
        </View>
        <Text style={styles.rideTime}>15 Dec'23 at 10:15 AM</Text>
        <Text style={styles.rideDistance}>
          <MaterialIcons name="location-on" size={16} color="#777" /> 9.5 km
        </Text>
        <View style={styles.addressContainer}>
          <Ionicons name="location" size={16} color="#777" />
          <Text style={styles.addressText}>
            220 Yonge St, Toronto, ON M5B 2H1, Canada
          </Text>
        </View>
        <View style={styles.addressContainer}>
          <Ionicons name="flag" size={16} color="#777" />
          <Text style={styles.addressText}>
            17600 Yonge St, Newmarket, ON L3Y 4Z1, Canada
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  upcomingRideContainer: {
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  upcomingRideTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  rideDetailsCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
  },
  riderInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  riderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  riderName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  rating: {
    marginLeft: 3,
    color: "#ffc107",
  },
  rideIdContainer: {
    backgroundColor: "#d4edda",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  rideId: {
    color: "#155724",
    fontWeight: "bold",
    fontSize: 14,
  },
  rideTime: {
    fontSize: 14,
    color: "#777",
    marginBottom: 5,
  },
  rideDistance: {
    fontSize: 14,
    color: "#777",
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  addressText: {
    marginLeft: 5,
    color: "#555",
    fontSize: 14,
    flexShrink: 1,
  },
});

export default UpcomingSchedule;
