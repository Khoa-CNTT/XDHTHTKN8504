// components/LocationInput.tsx
import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { MapPin } from "lucide-react-native";

interface LocationInputProps {
  address: string;
  setAddress: (address: string) => void;
  handleGetCurrentLocation: () => void;
  isGettingLocation: boolean;
}

const LocationInput: React.FC<LocationInputProps> = ({
  address,
  setAddress,
  handleGetCurrentLocation,
  isGettingLocation,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Nhập địa chỉ..."
        value={address}
        onChangeText={setAddress}
        style={styles.textInput}
      />
      <TouchableOpacity onPress={handleGetCurrentLocation}>
        <MapPin
          size={20}
          color={isGettingLocation ? "#ccc" : "#28A745"}
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  textInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
  },
  icon: {
    marginLeft: 8,
  },
});

export default LocationInput;
