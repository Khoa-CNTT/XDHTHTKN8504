import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import useProfileStore from "../stores/profileStore";
import { Profile } from "../types/profile";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons

interface Props {
  visible: boolean;
  onClose: () => void;
  onApply: (profile: Profile | undefined) => void;
}
type RootStackParamList = {
  AddCareRecipient: undefined;
};
type NavigationProp = StackNavigationProp<RootStackParamList>;

const CareRecipientModal: React.FC<Props> = ({ visible, onClose, onApply }) => {
  const { profiles, fetchProfiles, isLoading } = useProfileStore();
  const [selected, setSelected] = useState<Profile | null>(null);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    if (visible) {
      fetchProfiles();
    }
  }, [visible]);

  const renderItem = ({ item }: { item: Profile }) => {
    const isSelected = selected?._id === item._id;

    return (
      <TouchableOpacity
        style={[styles.item, isSelected && styles.selectedItem]}
        onPress={() => setSelected(item)}
      >
        {/* Avatar Container */}
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarLetter}>
            {item.firstName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
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
              <Text style={{ fontSize: 35 }}>×</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>Vui lòng chọn một người</Text>

          <FlatList
            data={profiles}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
          />
          <TouchableOpacity
            onPress={() => {
              onClose();
              navigation.navigate('AddCareRecipient');
            }}>
            <Text style={styles.addText}>Thêm Người Được Chăm Sóc</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.applyBtn}
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
    </Modal >
  );
};


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10, // Added marginBottom to create space between title and subtitle
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 14,
    color: "gray",
    marginBottom: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    marginBottom: 8,
  },
  selectedItem: {
    backgroundColor: "#ccf1ff",
  },
  avatarContainer: {
    backgroundColor: '#c4a484',
    color: 'white',
    width: 32,
    height: 32,
    borderRadius: 16,
    textAlign: 'center',
    lineHeight: 32,
    marginRight: 10,
    justifyContent: 'center', // Center content
    alignItems: 'center',
  },
  avatarLetter: {
    fontSize: 18,  // Increased font size for better visibility
    color: 'white',
  },
  name: {
    fontSize: 16,
  },
  addBtn: {
    paddingVertical: 10,
  },
  addText: {
    color: "#00A8E8",
    fontWeight: "500",
  },
  applyBtn: {
    backgroundColor: "#FFC107",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  applyText: {
    fontWeight: "bold",
    color: "black",
  },
  closeBtn: {
    position: "absolute",
    top: 0,
    right: 0,
  },
});

export default CareRecipientModal;
