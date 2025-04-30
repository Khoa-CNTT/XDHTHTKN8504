import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons'; // Import thư viện icon
import Footer from '../components/Footer';
import CareRecipientModal from '../components/CareRecipientModal';
import useProfileStore from "../stores/profileStore";
import { Profile } from '../types/profile';

type RootStackParamList = {
  AddCareRecipient: undefined;
  Profile: undefined;
  BookVisit: undefined;
};
type NavigationProp = StackNavigationProp<RootStackParamList>;


interface CardData {
  title: string;
  description: string;
  image: any;
}


const cardData: CardData[] = [
  {
    title: "Chăm sóc & Điều dưỡng tại nhà",
    description:
      "Bạn đồng hành, Bữa ăn, Vệ sinh & Đi vệ sinh, Chăm sóc ống, Truyền dịch, Chăm sóc vết thương, Điều dưỡng riêng",
    image: require('../asset/img/hinh1.png'),
  },
  {
    title: "Trị liệu tại nhà",
    description: "Vật lý trị liệu, Ngôn ngữ trị liệu & Phục hồi chức năng",
    image: require('../asset/img/hinh1.png'),
  },
  {
    title: "Trị liệu tại nhà",
    description: "Vật lý trị liệu, Ngôn ngữ trị liệu & Phục hồi chức năng",
    image: require('../asset/img/hinh1.png'),
  },
];

const BookingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCareRecipient, setSelectedCareRecipient] = useState<Profile | undefined>(undefined);

  const handleCareRecipientClick = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleApplyCareRecipient = (profile: Profile | undefined) => {
    setSelectedCareRecipient(profile);
  };


  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="menu" size={24} color="#2E3A59" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Đặt dịch vụ</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Ionicons name="person-circle-outline" size={24} color="#2E3A59" />
          </TouchableOpacity>
        </View>

        {/* Care Recipient */}
        <View style={styles.careRecipient}>
          <TouchableOpacity style={styles.careBox} onPress={handleCareRecipientClick}>
            <View style={styles.avatarContainer}>
              {selectedCareRecipient ? (
                <Text style={styles.avatarLetter}>
                  {selectedCareRecipient.firstName.charAt(0).toUpperCase()}
                </Text>
              ) : (
                <Ionicons name="person-outline" size={20} color="#666" />
              )}
            </View>
            <Text style={styles.careText}>
              {selectedCareRecipient ? `Cho: ${selectedCareRecipient.firstName} ${selectedCareRecipient.lastName || ''}` : 'Chọn người được chăm sóc'}
            </Text>
            <Ionicons name="pencil-outline" size={20} color="#666" />
          </TouchableOpacity>
        </View>


        <Text style={styles.sectionTitle}>Dịch vụ Homage</Text>


        {cardData.map((card, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => navigation.navigate('BookVisit')}
          >
            <Image
              source={card.image}
              style={{ width: 40, height: 40, borderRadius: 8, marginRight: 12 }}
              resizeMode="cover"
            />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardDescription}>{card.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Footer */}
      <Footer />

      <CareRecipientModal
        visible={modalVisible}
        onClose={closeModal}
        onApply={handleApplyCareRecipient}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
    paddingTop: 45,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E3A59',
  },
  careRecipient: {
    marginBottom: 24,
  },
  careBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8', // Lighter background
    padding: 12,
    borderRadius: 10,
    borderColor: '#E0E0E0',  // Light border
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05, // Subtle shadow
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  careText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E3A59',
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    marginLeft: 16,
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2E3A59',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: '#666',
  },
  avatarContainer: {
    backgroundColor: '#c4a484',
    color: 'white',
    width: 32,
    height: 32,
    borderRadius: 16,
    textAlign: 'center',
    lineHeight: 32,
    marginRight: 10,
    justifyContent: 'center', // Center the text vertically
    alignItems: 'center',
  },
  avatarLetter: {
    fontSize: 18,
    color: 'white',
  },
});

export default BookingScreen;
