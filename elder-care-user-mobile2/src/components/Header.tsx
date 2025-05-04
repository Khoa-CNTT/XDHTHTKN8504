import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/StackNavigator'; // Import RootStackParamList

// Define the type for the navigation prop
type HeaderScreenNavigationProp = StackNavigationProp<
  RootStackParamList, // Use RootStackParamList here
  "Notifications"
>;

interface HeaderProps {
  onMessagePress?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMessagePress }) => {
  const navigation = useNavigation<HeaderScreenNavigationProp>();
  const notificationCount = 3; // Example notification count

  const handleNotificationPress = () => {
    navigation.navigate('Notifications');
  };

  return (
    <View style={styles.container}>
      <View>
        
        <TouchableOpacity style={styles.locationButton}>
          <Ionicons name="home-outline" size={20} color="#333" />
          <Text style={styles.locationText}>Sức Khỏe</Text>

        </TouchableOpacity>
      </View>
      <View style={styles.iconsContainer}>
        <TouchableOpacity onPress={handleNotificationPress} style={styles.iconContainer}>
          <Ionicons name="notifications-outline" size={24} color="#333" />
          {notificationCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>{notificationCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={onMessagePress} style={styles.iconContainer}>
          <Ionicons name="chatbubble-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>
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
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginLeft: 16,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default Header;
