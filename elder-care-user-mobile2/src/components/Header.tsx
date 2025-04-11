import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Header: React.FC = () => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.locationLabel}>Location</Text>
        <TouchableOpacity style={styles.locationButton}>
          <Ionicons name="location" size={20} color="#333" />
          <Text style={styles.locationText}>Seattle, USA</Text>
          <Ionicons name="chevron-down" size={20} color="#333" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity>
        <Image 
          source={require('../asset/img/hinh1.png')}
          style={styles.profileImage}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 44,
    paddingBottom: 16,
  },
  locationLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 4,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default Header;
