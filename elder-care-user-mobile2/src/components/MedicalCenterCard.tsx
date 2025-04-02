import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavoriteHospitals } from '../context/FavoriteHospitalsContext';
import { openInMaps } from '../utils/mapUtils';

interface MedicalCenterCardProps {
  item: {
    id: string;
    name: string;
    address: string;
    image: any;
    rating: number;
    reviews: number;
    type: string;
    distance: string;
  };
}

const MedicalCenterCard: React.FC<MedicalCenterCardProps> = ({ item }) => {
  const { isFavoriteHospital, addFavoriteHospital, removeFavoriteHospital } = useFavoriteHospitals();

  const toggleFavorite = () => {
    if (isFavoriteHospital(item.id)) {
      removeFavoriteHospital(item.id);
    } else {
      addFavoriteHospital(item);
    }
  };

  const renderStars = () => {
    return Array(5).fill(0).map((_, i) => (
      <Ionicons
        key={i}
        name="star"
        size={14}
        color="#FFB800"
        style={styles.star}
      />
    ));
  };

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.95}>
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.image} resizeMode="cover" />
        <TouchableOpacity 
          style={styles.heartButton}
          onPress={toggleFavorite}
        >
          <Ionicons 
            name={isFavoriteHospital(item.id) ? "heart" : "heart-outline"} 
            size={20} 
            color={isFavoriteHospital(item.id) ? "#FF4B4B" : "#fff"} 
          />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.locationContainer}>
          <TouchableOpacity 
            onPress={() => openInMaps(item.address)}
            style={styles.locationButton}
          >
            <Ionicons name="location-outline" size={18} color="#8F9BB3" />
            <Text style={styles.address} numberOfLines={1}>{item.address}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>{item.rating.toFixed(1)}</Text>
          <View style={styles.stars}>{renderStars()}</View>
          <Text style={styles.reviews}>({item.reviews} Reviews)</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoContainer}>
          <View style={styles.info}>
            <Ionicons name="walk-outline" size={18} color="#8F9BB3" />
            <Text style={styles.infoText}>{item.distance}</Text>
          </View>
          <View style={styles.info}>
            <Ionicons name="medical-outline" size={18} color="#8F9BB3" />
            <Text style={styles.infoText}>{item.type}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 240,
    height: 245,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#EDF1F7',
  },
  imageContainer: {
    position: 'relative',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  heartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E3A59',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  address: {
    fontSize: 12,
    color: '#8F9BB3',
    marginLeft: 3,
    flex: 1,
    lineHeight: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E3A59',
    marginRight: 3,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 3,
  },
  star: {
    marginRight: 1,
  },
  reviews: {
    fontSize: 12,
    color: '#8F9BB3',
  },
  divider: {
    height: 1,
    backgroundColor: '#EDF1F7',
    marginHorizontal: -10,
    marginBottom: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  infoText: {
    fontSize: 12,
    color: '#8F9BB3',
    marginLeft: 4,
  },
});

export default MedicalCenterCard;
