import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, ActivityIndicator, Text } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { FontAwesome5 } from "@expo/vector-icons";
import * as Location from "expo-location";
import axios from "axios";
import { useTheme } from "react-native-paper";
import { log } from "@/utils/logger";

type MapWithRouteProps = {
  customerAddress: string;
};

type Coord = {
  latitude: number;
  longitude: number;
};

interface ORSDirectionsResponse {
  features: Array<{
    geometry: {
      coordinates: [number, number][];
    };
    properties: {
      segments: Array<{
        distance: number;
        duration: number;
      }>;
    };
  }>;
}

export const MapWithRoute: React.FC<MapWithRouteProps> = ({
  customerAddress,
}) => {
  const [currentLocation, setCurrentLocation] = useState<Coord | null>(null);
  const [prevLocation, setPrevLocation] = useState<Coord | null>(null);
  const [customerLocation, setCustomerLocation] = useState<Coord | null>(null);
  const [routeCoords, setRouteCoords] = useState<Coord[]>([]);
  const [distance, setDistance] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [heading, setHeading] = useState<number>(0);
  const [isMoving, setIsMoving] = useState<boolean>(false);

  const mapRef = useRef<MapView>(null);
  const { colors } = useTheme();

  // Ref để kiểm soát việc gọi fetch route
  const hasFetchedRoute = useRef(false);

  const getDistanceBetweenCoords = (c1: Coord, c2: Coord) => {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6378137;
    const dLat = toRad(c2.latitude - c1.latitude);
    const dLon = toRad(c2.longitude - c1.longitude);
    const lat1 = toRad(c1.latitude);
    const lat2 = toRad(c2.latitude);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Permission to access location was denied");
        setLoading(false);
        return;
      }

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000000, // Tăng thời gian giữa các lần cập nhật
          distanceInterval: 25, // Tăng khoảng cách để cập nhật
        },
        (location) => {
          const coords = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };

          if (prevLocation) {
            const dist = getDistanceBetweenCoords(prevLocation, coords);
            setIsMoving(dist > 10);
          }

          setPrevLocation(currentLocation);
          setCurrentLocation(coords);
          setHeading(location.coords.heading ?? 0);
        }
      );

      return () => subscription.remove();
    })();
  }, []);

  // Reset ref mỗi khi địa chỉ khách hàng thay đổi (cho phép gọi lại API)
  useEffect(() => {
    hasFetchedRoute.current = false;
  }, [customerAddress]);

  // Chỉ gọi fetch route khi có địa chỉ và vị trí hiện tại, và chưa gọi lần nào
  useEffect(() => {
    if (customerAddress && currentLocation && !hasFetchedRoute.current) {
      hasFetchedRoute.current = true;
      fetchCustomerLocationAndRoute();
    }
  }, [customerAddress, currentLocation]);

  const fetchCustomerLocationAndRoute = async () => {
    try {
      setLoading(true);
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
    const apiKey = "5b3ce3597851110001cf6248c1185ad859c649078346f01e4a9adddb";

    try {
      const response = await axios.post<ORSDirectionsResponse>(
        "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
        {
          coordinates: [
            [origin.longitude, origin.latitude],
            [destination.longitude, destination.latitude],
          ],
        },
        {
          headers: {
            Authorization: apiKey,
            "Content-Type": "application/json",
          },
        }
      );

      const features = response.data.features[0];
      if (!features) return;

      const coords: Coord[] = features.geometry.coordinates.map((c) => ({
        latitude: c[1],
        longitude: c[0],
      }));
      setRouteCoords(coords);

      const distMeters = features.properties.segments[0].distance;
      const durationSeconds = features.properties.segments[0].duration;

      setDistance(`${(distMeters / 1000).toFixed(1)} km`);
      setDuration(`${Math.round(durationSeconds / 60)} phút`);

      if (!isMoving && mapRef.current) {
        mapRef.current.fitToCoordinates(coords, {
          edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
          animated: true,
        });
      }
    } catch (err) {
      log("OpenRouteService API error:", err);
    }
  };

  useEffect(() => {
    if (!currentLocation || !mapRef.current) return;

    if (isMoving) {
      const rotatedHeading = (heading + 180) % 360;
      mapRef.current.animateCamera({
        center: currentLocation,
        heading: rotatedHeading,
        pitch: 0,
        zoom: 16,
      });
    } else if (routeCoords.length > 0) {
      mapRef.current.fitToCoordinates(routeCoords, {
        edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
        animated: true,
      });
    } else {
      mapRef.current.animateCamera({
        center: currentLocation,
        zoom: 14,
      });
    }
  }, [currentLocation, heading, isMoving, routeCoords]);

  if (loading || !currentLocation) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          ...currentLocation,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker coordinate={currentLocation} title="Vị trí của bạn">
          <FontAwesome5 name="user-circle" size={30} color={colors.primary} />
        </Marker>
        {customerLocation && (
          <Marker coordinate={customerLocation} title="Khách hàng">
            <FontAwesome5 name="map-marker-alt" size={30} color="red" />
          </Marker>
        )}
        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeWidth={4}
            strokeColor={colors.primary}
          />
        )}
      </MapView>
      <View
        style={[
          styles.infoContainer,
          { backgroundColor: colors.elevation.level2 },
        ]}
      >
        <Text style={[styles.infoText, { color: colors.onSurface }]}>
          📍 {distance}
        </Text>
        <Text style={[styles.infoText, { color: colors.onSurface }]}>
          ⏱️ {duration}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    width: "100%",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  infoText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
