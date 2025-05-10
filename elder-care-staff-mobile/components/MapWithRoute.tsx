import React, { useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";

type MapWithRouteProps = {
  customerAddress: string;
};

type Coord = {
  latitude: number;
  longitude: number;
};

export const MapWithRoute: React.FC<MapWithRouteProps> = ({
  customerAddress,
}) => {
  const [currentLocation, setCurrentLocation] = useState<Coord | null>(null);
  const [customerLocation, setCustomerLocation] = useState<Coord | null>(null);
  const [routeCoords, setRouteCoords] = useState<Coord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Permission to access location was denied");
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setCurrentLocation(coords);
    })();
  }, []);

  useEffect(() => {
    if (customerAddress && currentLocation) {
      fetchCustomerLocationAndRoute();
    }
  }, [customerAddress, currentLocation]);

  const fetchCustomerLocationAndRoute = async () => {
    try {
      const geocoded = await Location.geocodeAsync(customerAddress);
      if (!geocoded[0]) return;

      const customerCoords = {
        latitude: geocoded[0].latitude,
        longitude: geocoded[0].longitude,
      };
      setCustomerLocation(customerCoords);

      await getRoute(currentLocation!, customerCoords);
    } catch (error) {
      console.error("Error fetching location/route:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRoute = async (origin: Coord, destination: Coord) => {
    const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY;
    const originStr = `${origin.latitude},${origin.longitude}`;
    const destinationStr = `${destination.latitude},${destination.longitude}`;

    try {
     const response = await axios.get<{
       routes: { overview_polyline: { points: string } }[];
     }>(`https://maps.googleapis.com/maps/api/directions/json`, {
       params: {
         origin: originStr,
         destination: destinationStr,
         key: apiKey,
       },
     });

     const points = decodePolyline(
       response.data.routes[0]?.overview_polyline?.points || ""
     );
      setRouteCoords(points);
    } catch (error) {
      console.error("Failed to get directions:", error);
    }
  };

  const decodePolyline = (encoded: string): Coord[] => {
    let index = 0,
      len = encoded.length;
    let lat = 0,
      lng = 0;
    const coordinates: Coord[] = [];

    while (index < len) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      coordinates.push({
        latitude: lat / 1e5,
        longitude: lng / 1e5,
      });
    }

    return coordinates;
  };

  if (loading || !currentLocation) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      provider={PROVIDER_GOOGLE}
      initialRegion={{
        ...currentLocation,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
    >
      <Marker
        coordinate={currentLocation}
        title="Vị trí của bạn"
        pinColor="blue"
      />
      {customerLocation && (
        <Marker
          coordinate={customerLocation}
          title="Khách hàng"
          pinColor="red"
        />
      )}
      {routeCoords.length > 0 && (
        <Polyline
          coordinates={routeCoords}
          strokeWidth={4}
          strokeColor="blue"
        />
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
