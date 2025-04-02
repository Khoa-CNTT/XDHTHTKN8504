import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const medicalCenters = [
  {
    id: "1",
    name: "Sunrise Health Clinic",
    address: "123 Oak Street, CA 98765",
    coordinate: {
      latitude: 37.78825,
      longitude: -122.4324,
    },
  },
  {
    id: "2",
    name: "Golden Cardiology",
    address: "555 Bridge Street, CA 12345",
    coordinate: {
      latitude: 37.78525,
      longitude: -122.4324,
    },
  },
];

const MapScreen = () => {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {medicalCenters.map((center) => (
          <Marker
            key={center.id}
            coordinate={center.coordinate}
            title={center.name}
            description={center.address}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default MapScreen;
