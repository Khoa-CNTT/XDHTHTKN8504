import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  ServiceDetails: { service: any };
  BookService: { service: any };
};

type ServiceDetailsProps = {
  route: RouteProp<RootStackParamList, 'ServiceDetails'>;
  navigation: StackNavigationProp<RootStackParamList>;
};

const ServiceDetails: React.FC<ServiceDetailsProps> = ({ route, navigation }) => {
  const { service } = route.params;

  const stats = [
    { value: service.patients || 'N/A', label: 'patients' },
    { value: service.experience || 'N/A', label: 'years' },
    { value: service.rating || 'N/A', label: 'rating' },
    { value: service.reviews || 'N/A', label: 'reviews' },
    //dededede
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#2E3A59" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Service Details</Text>
        <View style={{ width: 24 }} /> {/* Placeholder for symmetry */}
      </View>

      <View style={styles.profile}>
        <Image source={service.image} style={styles.image} />
        <Text style={styles.name}>{service.name}</Text>
        <Text style={styles.type}>{service.type}</Text>
      </View>

      <View style={styles.statsContainer}>
        {stats.map((stat, idx) => (
          <View key={idx} style={styles.statItem}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About Service</Text>
        <Text style={styles.aboutText}>{service.description}</Text>
      </View>

      <TouchableOpacity
        style={styles.bookButton}
        onPress={() => navigation.navigate('BookService', { service })}
      >
        <Text style={styles.bookButtonText}>Book Service</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
  },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#2E3A59' },
  profile: { alignItems: 'center', paddingVertical: 24 },
  image: { width: 100, height: 100, borderRadius: 16, marginBottom: 16 },
  name: { fontSize: 20, fontWeight: '600', color: '#2E3A59', marginBottom: 8 },
  type: { fontSize: 16, color: '#8F9BB3', marginBottom: 4 },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 24,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#EDF1F7',
    marginHorizontal: 16,
  },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '600', color: '#2E3A59', marginBottom: 4 },
  statLabel: { fontSize: 14, color: '#8F9BB3' },
  section: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#2E3A59', marginBottom: 12 },
  aboutText: { fontSize: 14, lineHeight: 20, color: '#8F9BB3' },
  bookButton: {
    backgroundColor: '#2E3A59',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  bookButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default ServiceDetails;