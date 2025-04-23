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
import { Ionicons } from '@expo/vector-icons';
import Footer from '../components/Footer';
import CareRecipientModal from '../components/CareRecipientModal';

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

interface CareRecipient {
  id: number;
  name: string;
}

// Sample card data
const cardData: CardData[] = [
  {
    title: "Home Personal Care & Nursingzz",
    description:
      "Companionship, Meals, Hygiene & Toileting, Tube Care, IV Drip, Wound Care, Private Nursing",
    image: require('../asset/img/hinh1.png'),
  },
  {
    title: "Home Therapy",
    description: "Physiotherapy, Speech & Occupational Therapy",
    image: require('../asset/img/hinh1.png'),
  },
  {
    title: "Home Therapy",
    description: "Physiotherapy, Speech & Occupational Therapy",
    image: require('../asset/img/hinh1.png'),
  },
];

const BookingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<CareRecipient | null>(null);

  const handleCareRecipientClick = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="menu" size={24} color="#2E3A59" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Book a service</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Ionicons name="person-circle-outline" size={24} color="#2E3A59" />
          </TouchableOpacity>
        </View>

        {/* Care Recipient Section */}
        <View style={styles.careRecipient}>
          <TouchableOpacity style={styles.careBox} onPress={handleCareRecipientClick}>
            <Ionicons name="person-circle-outline" size={40} color="#ccc" />
            <Text style={styles.careText}>
              {selectedRecipient ? selectedRecipient.name : 'Care Recipient'}
            </Text>
            <Ionicons name="pencil" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Modal chọn người nhận */}
        <CareRecipientModal
          visible={modalVisible}
          onClose={closeModal}
          selectedId={selectedRecipient?.id}
          onSelect={(recipient) => {
            setSelectedRecipient(recipient);
            console.log('Selected recipient:', JSON.stringify(recipient)); // (NOBRIDGE) LOG
          }}
        />

        {/* Services Section */}
        <Text style={styles.sectionTitle}>Homage Services</Text>

        {/* Render cards dynamically */}
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
    </View>
  );
};

export default BookingScreen;

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
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
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
});
