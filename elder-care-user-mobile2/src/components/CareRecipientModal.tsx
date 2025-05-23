import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  Image, // Add Image here
} from "react-native";
import useProfileStore from "../stores/profileStore";
import { Profile } from "../types/profile";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons

interface Props {
  visible: boolean;
  onClose: () => void;
  onApply: (profile: Profile | undefined) => void;
}
type RootStackParamList = {
  AddProfileScreen: undefined;
};
type NavigationProp = StackNavigationProp<RootStackParamList>;

const { width, height } = Dimensions.get('window');

const CareRecipientModal: React.FC<Props> = ({ visible, onClose, onApply }) => {
  const { profiles } = useProfileStore();
  const [selected, setSelected] = useState<Profile | null>(null);
  const navigation = useNavigation<NavigationProp>();

  // useEffect(() => {
  //   if (visible) {
  //     fetchProfiles();
  //   }
  // }, [visible]);

const renderItem = ({ item }: { item: Profile }) => {
  const isSelected = selected?._id === item._id;

  return (
    <TouchableOpacity
      style={[styles.item, isSelected && styles.selectedItem]}
      onPress={() => setSelected(item)}
    >
      {/* Avatar Container */}
      <View style={styles.avatarContainer}>
        {item.avartar ? (
          <Image
            source={{ uri: item.avartar }}
            style={{ width: 40, height: 40, borderRadius: 20 }}
            resizeMode="cover"
          />
        ) : (
          <Text style={styles.avatarLetter}>
            {item.firstName.charAt(0).toUpperCase()}
          </Text>
        )}
      </View>
      <Text style={styles.name}>
        {item.firstName} {item.lastName}
      </Text>
    </TouchableOpacity>
  );
};

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Chọn Người Được Chăm Sóc</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>Vui lòng chọn một người</Text>

          <FlatList
            data={profiles}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            style={styles.list} // Added style for FlatList
          />
          <TouchableOpacity
            onPress={() => {
              onClose();
              navigation.navigate("AddProfileScreen");
            }}
          >
            <Text style={styles.addText}>Thêm Người Được Chăm Sóc</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.applyBtn, !selected && styles.disabledApplyBtn]}
            disabled={!selected}
            onPress={() => {
              onApply(selected || undefined);
              onClose();
            }}
          >
            <Text style={styles.applyText}>Áp dụng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Slightly darker overlay
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: '#f9f9f9', // Lighter background
    padding: 20,
    borderTopLeftRadius: 24, // More rounded corners
    borderTopRightRadius: 24,
    maxHeight: '85%', // Increased max height
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 22, // Larger title
    fontWeight: "bold",
    color: '#2E3A59', // Darker title color
  },
  subtitle: {
    fontSize: 16, // Increased subtitle size
    color: '#718096', // Slightly darker subtitle color
    marginBottom: 24, // Increased margin
  },
  list: {
    marginBottom: 16, // Add margin to the list
    maxHeight: height * 0.5, // Limit the list height
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16, // Increased padding
    backgroundColor: '#fff', // White background for items
    borderRadius: 12, // More rounded corners for items
    marginBottom: 12, // Increased margin
    shadowColor: 'rgba(0, 0, 0, 0.1)', // Subtle shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,  // Add border
    borderColor: '#e2e8f0', // Light border color
  },
  selectedItem: {
    backgroundColor: '#E0F7FA', // Lighter selected color
    borderColor: '#80DEEA', // Highlight border
    shadowColor: 'rgba(0, 0, 0, 0.2)', //
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarContainer: {
    backgroundColor: '#c4a484', // Lighter avatar color
    width: 40, // Increased size
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16, // Increased margin
  },
  avatarLetter: {
    fontSize: 20, // Larger font size
    color: 'white',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 18, // Larger name font
    color: '#2D3748', // Darker name color
    fontWeight: '500',
  },
  addText: {
    color: '#34B44E',
    fontWeight: "600", // Stronger font weight
    fontSize: 17,
    textAlign: 'center',
    paddingVertical: 12,
  },
  applyBtn: {
    backgroundColor: '#34B44E',
    padding: 18, // Increased padding
    borderRadius: 12, // More rounded

    alignItems: "center",
    marginTop: 24, // Increased margin
  },
  disabledApplyBtn: {
    backgroundColor: '#DEDDDD', //
  },
  applyText: {
    fontWeight: "bold",
    color: '#fff',
    fontSize: 18, // Larger font

  },
  closeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  closeText: {
    fontSize: 40, // Larger close button
    color: '#4A5568', // Darker close color
    lineHeight: 40,
  },
});

export default CareRecipientModal;
