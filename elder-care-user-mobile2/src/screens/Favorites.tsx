import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, SafeAreaView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/StackNavigator';
import { useFavorites } from '../context/FavoritesContext';
import { useFavoriteHospitals } from '../context/FavoriteHospitalsContext';

type NavigationProp = StackNavigationProp<RootStackParamList>;
type TabType = 'Doctors' | 'Hospitals';

interface RemoveModalProps {
  visible: boolean;
  item: any;
  onCancel: () => void;
  onConfirm: () => void;
}

const RemoveModal: React.FC<RemoveModalProps> = ({ visible, item, onCancel, onConfirm }) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onCancel}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Remove from Favorites?</Text>
        
        <View style={styles.modalCard}>
          <Image source={item?.image} style={styles.modalImage} />
          <View style={styles.modalCardInfo}>
            <Text style={styles.modalName}>{item?.name}</Text>
            <Text style={styles.modalSpecialty}>{item?.specialty || item?.type}</Text>
            <View style={styles.modalLocation}>
              <Ionicons name="location" size={12} color="#8F9BB3" />
              <Text style={styles.modalAddress} numberOfLines={1}>
                {item?.clinic || item?.address}
              </Text>
            </View>
            <View style={styles.modalRating}>
              <Ionicons name="star" size={12} color="#FFB800" />
              <Text style={styles.modalRatingText}>{item?.rating}</Text>
              <Text style={styles.modalReviews}>{item?.reviews} Reviews</Text>
            </View>
          </View>
        </View>

        <View style={styles.modalButtons}>
          <TouchableOpacity 
            style={[styles.modalButton, styles.cancelButton]} 
            onPress={onCancel}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.modalButton, styles.removeButton]} 
            onPress={onConfirm}
          >
            <Text style={styles.removeButtonText}>Yes, Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const Favorites: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('Doctors');
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const navigation = useNavigation<NavigationProp>();
  const { favorites, removeFavorite } = useFavorites();
  const { favoriteHospitals, removeFavoriteHospital } = useFavoriteHospitals();

  const handleRemove = (item: any) => {
    setSelectedItem(item);
    setRemoveModalVisible(true);
  };

  const confirmRemove = () => {
    if (selectedItem) {
      if (activeTab === 'Doctors') {
        removeFavorite(selectedItem.id);
      } else {
        removeFavoriteHospital(selectedItem.id);
      }
    }
    setRemoveModalVisible(false);
    setSelectedItem(null);
  };

  const renderSummary = () => (
    <View style={styles.summaryContainer}>
      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <View style={[styles.summaryIcon, { backgroundColor: '#E3F2FD' }]}>
            <Ionicons name="medical" size={20} color="#2196F3" />
          </View>
          <View>
            <Text style={styles.summaryCount}>{favorites.length}</Text>
            <Text style={styles.summaryLabel}>Doctors</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryItem}>
          <View style={[styles.summaryIcon, { backgroundColor: '#E8F5E9' }]}>
            <Ionicons name="business" size={20} color="#4CAF50" />
          </View>
          <View>
            <Text style={styles.summaryCount}>{favoriteHospitals.length}</Text>
            <Text style={styles.summaryLabel}>Hospitals</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderFavoriteDoctor = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.favoriteCard}
      onPress={() => navigation.navigate('DoctorDetails', { doctor: item })}
    >
      <View style={styles.cardContent}>
        <Image source={item.image} style={styles.doctorImage} />
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>{item.name}</Text>
          <Text style={styles.specialty}>{item.specialty}</Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={14} color="#8F9BB3" />
            <Text style={styles.clinic}>{item.clinic}</Text>
          </View>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.rating}>{item.rating}</Text>
            <Text style={styles.reviews}>{item.reviews} Reviews</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={() => handleRemove(item)}
        >
          <Ionicons name="heart" size={24} color="#FF4B4B" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderFavoriteHospital = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.favoriteCard}>
      <Image source={item.image} style={styles.hospitalImage} />
      <View style={styles.hospitalInfo}>
        <Text style={styles.hospitalName}>{item.name}</Text>
        <View style={styles.locationContainer}>
          <Ionicons name="location" size={14} color="#8F9BB3" />
          <Text style={styles.address}>{item.address}</Text>
        </View>
        <View style={styles.ratingRow}>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>{item.rating}</Text>
            <View style={styles.starsContainer}>
              {Array(5).fill(0).map((_, i) => (
                <Ionicons key={i} name="star" size={12} color="#FFB800" style={styles.star} />
              ))}
            </View>
            <Text style={styles.reviews}>({item.reviews} Reviews)</Text>
          </View>
        </View>
        <View style={styles.bottomRow}>
          <View style={styles.distanceContainer}>
            <Ionicons name="time-outline" size={14} color="#8F9BB3" />
            <Text style={styles.distance}>{item.distance}</Text>
          </View>
          <View style={styles.typeContainer}>
            <Ionicons name="medical-outline" size={14} color="#8F9BB3" />
            <Text style={styles.type}>{item.type}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.favoriteButton}
        onPress={() => handleRemove(item)}
      >
        <Ionicons name="heart" size={24} color="#FF4B4B" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#2E3A59" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favorites</Text>
        <View style={styles.placeholder} />
      </View>

      {renderSummary()}

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'Doctors' && styles.activeTab]}
          onPress={() => setActiveTab('Doctors')}
        >
          <Text style={[styles.tabText, activeTab === 'Doctors' && styles.activeTabText]}>
            Doctors
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'Hospitals' && styles.activeTab]}
          onPress={() => setActiveTab('Hospitals')}
        >
          <Text style={[styles.tabText, activeTab === 'Hospitals' && styles.activeTabText]}>
            Hospitals
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={activeTab === 'Doctors' ? favorites : favoriteHospitals}
        renderItem={activeTab === 'Doctors' ? renderFavoriteDoctor : renderFavoriteHospital}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <RemoveModal
        visible={removeModalVisible}
        item={selectedItem}
        onCancel={() => {
          setRemoveModalVisible(false);
          setSelectedItem(null);
        }}
        onConfirm={confirmRemove}
      />
    </SafeAreaView>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2E3A59',
  },
  placeholder: {
    width: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#2E3A59',
  },
  tabText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#8F9BB3',
  },
  activeTabText: {
    color: '#2E3A59',
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  favoriteCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 12,
  },
  hospitalImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginBottom: 12,
  },
  doctorInfo: {
    flex: 1,
  },
  hospitalInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E3A59',
    marginBottom: 4,
  },
  hospitalName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E3A59',
    marginBottom: 8,
  },
  specialty: {
    fontSize: 14,
    color: '#8F9BB3',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  clinic: {
    fontSize: 12,
    color: '#8F9BB3',
    marginLeft: 4,
  },
  address: {
    fontSize: 14,
    color: '#8F9BB3',
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingRow: {
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    marginHorizontal: 4,
  },
  star: {
    marginRight: 2,
  },
  rating: {
    fontSize: 14,
    color: '#2E3A59',
    marginLeft: 4,
    marginRight: 4,
  },
  reviews: {
    fontSize: 14,
    color: '#8F9BB3',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distance: {
    fontSize: 14,
    color: '#8F9BB3',
    marginLeft: 4,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  type: {
    fontSize: 14,
    color: '#8F9BB3',
    marginLeft: 4,
  },
  favoriteButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 340,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E3A59',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  modalImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  modalCardInfo: {
    flex: 1,
  },
  modalName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E3A59',
    marginBottom: 4,
  },
  modalSpecialty: {
    fontSize: 14,
    color: '#8F9BB3',
    marginBottom: 4,
  },
  modalLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  modalAddress: {
    fontSize: 12,
    color: '#8F9BB3',
    marginLeft: 4,
  },
  modalRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalRatingText: {
    fontSize: 12,
    color: '#2E3A59',
    marginLeft: 4,
    marginRight: 4,
  },
  modalReviews: {
    fontSize: 12,
    color: '#8F9BB3',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F7F9FC',
  },
  removeButton: {
    backgroundColor: '#2E3A59',
  },
  cancelButtonText: {
    color: '#2E3A59',
    fontSize: 16,
    fontWeight: '600',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  summaryContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCount: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2E3A59',
    marginBottom: 2,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#8F9BB3',
  },
  divider: {
    width: 1,
    backgroundColor: '#E4E9F2',
    marginHorizontal: 16,
  },
});

export default Favorites;
