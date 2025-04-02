import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Header from "../components/Header";
import SearchBox from "../components/SearchBox";
import Banner from "../components/Banner";
import MedicalCenterCard from "../components/MedicalCenterCard";
import Footer from "../components/Footer";

type RootStackParamList = {
  Home: undefined;
  AllDoctors: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const medicalCenters = [
  {
    id: "1",
    name: "Sunrise Health Clinic",
    address: "123 Oak Street, CA 98765",
    rating: 5.0,
    reviews: 58,
    distance: "2.5 km/40min",
    image: require("../asset/img/hinh1.png"),
    type: "Health Clinic"
  },
  {
    id: "2",
    name: "Golden Cardiology",
    address: "555 Bridge Street, CA 12345",
    rating: 4.9,
    reviews: 103,
    distance: "2.5 km/40min",
    image: require("../asset/img/hinh1.png"),
    type: "Cardiology"
  },
];

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleSearchPress = () => {
    navigation.navigate('AllDoctors');
  };

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity onPress={handleSearchPress} activeOpacity={0.7}>
        <SearchBox 
          editable={false}
          placeholder="Search doctor..."
        />
      </TouchableOpacity>
      <Banner />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Nearby Medical Centers</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.medicalCentersList}
        data={medicalCenters}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MedicalCenterCard item={item} />}
      />

      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  seeAll: {
    fontSize: 14,
    color: '#666',
  },
  medicalCentersList: {
    paddingLeft: 16,
    paddingBottom: 16,
  },
});

export default HomeScreen;
