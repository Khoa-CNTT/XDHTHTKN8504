import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import SearchBox from "../components/SearchBox";
import { useServicesStore } from "../stores/serviceStore";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';


type RootStackParamList = {
    ServiceScreen: { serviceId: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList>;
const Seach: React.FC = () => {

    const { services, fetchServices, isLoading } = useServicesStore();
    const [searchText, setSearchText] = useState("");
    const [filteredServices, setFilteredServices] = useState(services);
    const navigation = useNavigation<NavigationProp>();
  
    useEffect(() => {
      fetchServices();
    }, []);
  
    useEffect(() => {
      if (!searchText) {
        setFilteredServices(services);
      } else {
        setFilteredServices(
          services.filter((service) =>
            service.name.toLowerCase().includes(searchText.toLowerCase())
          )
        );
      }
    }, [searchText, services]);
  
    return (
      <View style={styles.container}>
        <SearchBox
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Tìm kiếm dịch vụ theo tên..."
        />
        {isLoading ? (
          <Text style={styles.loadingText}>Đang tải...</Text>
        ) : (
          <FlatList
            data={filteredServices}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => navigation.navigate("ServiceScreen", { serviceId: item._id })}
              >
                <Text style={styles.itemText}>{item.name}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Không tìm thấy dịch vụ nào.</Text>
            }
          />
        )}
      </View>
    );
  };

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 40 },
  loadingText: { textAlign: "center", marginTop: 20, color: "#888" },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemText: { fontSize: 16, color: "#222" },
  emptyText: { textAlign: "center", marginTop: 30, color: "#888" },
});

export default Seach;