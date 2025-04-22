import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import SearchBox from '../components/SearchBox';

const categories = ['Tất cả', 'Chăm sóc tại nhà', 'Xét nghiệm tại nhà', 'Xét nghiệm gene'];

const featuredServices = [
  { 
    id: '1', 
    categories: 'Chăm sóc tại nhà',
    title: 'Gói 3 ngày chăm sóc bệnh nhân chuyên nghiệp ở bệnh viện', 
    duration: '3 ngày', 
    image: require('../asset/img/hinh1.png') 
  },
  { id: '2',categories: 'Xét nghiệm tại nhà', title: 'Gói 7 ngày chăm sóc bệnh nhân chuyên nghiệp ở bệnh viện', duration: '7 ngày', image: require('../asset/img/hinh1.png') },
  { id: '3',categories: '', title: 'Gói 15 ngày chăm sóc bệnh nhân chuyên nghiệp ở bệnh viện', duration: '15 ngày', image: require('../asset/img/hinh1.png') },
  { id: '4',categories: 'Xét nghiệm gene', title: 'Gói 30 ngày chăm sóc bệnh nhân chuyên nghiệp ở bệnh viện', duration: '30 ngày', image: require('../asset/img/hinh1.png') },
  { id: '5',categories: 'Chăm sóc tại nhà', title: 'Chăm sóc 4h', duration: '4h', image: require('../asset/img/hinh1.png') },
  { id: '6',categories: 'Chăm sóc tại nhà', title: 'Chăm sóc 8h', duration: '8h', image: require('../asset/img/hinh1.png') },
  { id: '7',categories: 'Chăm sóc tại nhà', title: 'Chăm sóc 12h', duration: '12h', image: require('../asset/img/hinh1.png') },
  { id: '8',categories: 'Chăm sóc tại nhà', title: 'Chăm sóc 12h (ca đêm)', duration: '12h', image: require('../asset/img/hinh1.png') },
];

const AllServices: React.FC = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = featuredServices.filter(service => {
    const matchesSearch = searchQuery === '' || service.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Tất cả' || service.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2E3A59" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dịch vụ</Text>
      </View>

      <SearchBox
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Tìm kiếm dịch vụ..."
      />

      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.filterChip,
                selectedCategory === category && styles.filterChipSelected,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedCategory === category && styles.filterChipTextSelected,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredServices}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.serviceList}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.serviceCard}>
            <Image source={item.image} style={styles.serviceImage} />
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceTitle}>{item.title}</Text>
              <Text style={styles.serviceDuration}>Thời gian: {item.duration}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
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
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
    color: '#2E3A59',
  },
  filterWrapper: {
    paddingVertical: 12,
  },
  filterContent: {
    paddingHorizontal: 16,
    flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 100,
    backgroundColor: '#fff',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E4E9F2',
  },
  filterChipSelected: {
    backgroundColor: '#2E3A59',
    borderColor: '#2E3A59',
  },
  filterChipText: {
    color: '#2E3A59',
    fontSize: 14,
    fontWeight: '500',
  },
  filterChipTextSelected: {
    color: '#fff',
  },
  serviceList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  serviceCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    padding: 12,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#EDF1F7',
    elevation: 2,
  },
  serviceImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
    marginRight: 12,
  },
  serviceInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E3A59',
    marginBottom: 4,
  },
  serviceDuration: {
    fontSize: 14,
    color: '#8F9BB3',
  },
});

export default AllServices;
