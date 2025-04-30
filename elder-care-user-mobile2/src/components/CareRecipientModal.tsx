import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import useCareRecipientStore from "../stores/careRecipientStore";
import type { Profile } from "../types/careRecipient";

type RootStackParamList = {
  AddCareRecipient: undefined;
};
type NavigationProp = StackNavigationProp<RootStackParamList>;

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (recipient: Profile) => void;
  selectedId?: string;
}

const CareRecipientModal: React.FC<Props> = ({
  visible,
  onClose,
  onSelect,
  selectedId,
}) => {
  const navigation = useNavigation<NavigationProp>();
  const profiles = useCareRecipientStore((state) => state.profiles);
  const fetchProfiles = useCareRecipientStore(
    (state) => state.fetchProfiles);
  console.log("profiles in modal: ", profiles);
  
  const [selectedRecipientId, setSelectedRecipientId] = useState<
    string | undefined
  >(selectedId);

  useEffect(() => {
    setSelectedRecipientId(selectedId); // sync selected khi mở modal
  }, [selectedId]);

  const handleApply = () => {
    const selected = profiles.find((r) => r._id === selectedRecipientId);
    if (selected) {
      onSelect(selected); // Truyền về component cha
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Care Recipient</Text>
          <Text style={styles.modalSubtitle}>Please choose one</Text>

          {profiles.length === 0 ? (
            <Text>No recipients found</Text>
          ) : (
            profiles.map((recipient) => (
              <TouchableOpacity
                key={recipient._id}
                style={[
                  styles.recipientBox,
                  selectedRecipientId === recipient._id && {
                    borderColor: "#007BFF",
                    backgroundColor: "#e6f0ff",
                  },
                ]}
                onPress={() => setSelectedRecipientId(recipient._id)}
              >
                <Ionicons name="person-circle-outline" size={40} color="#ccc" />
                <Text style={styles.recipientText}>
                  {recipient.firstName} {recipient.lastName}
                </Text>
              </TouchableOpacity>
            ))
          )}

          <TouchableOpacity
            onPress={() => {
              onClose();
              navigation.navigate("AddCareRecipient");
            }}
          >
            <Text style={styles.addRecipientText}>Add Care Recipient</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  recipientBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
    width: "100%",
    backgroundColor: "#fff",
  },
  recipientText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#333",
  },
  addRecipientText: {
    color: "#007BFF",
    marginTop: 10,
    marginBottom: 20,
  },
  applyButton: {
    backgroundColor: "#FFC107",
    padding: 10,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  applyButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default CareRecipientModal;
