// components/PackageModal.tsx
import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { usePackageStore } from "../stores/PackageService";

interface PackageModalProps {
  visible: boolean;
  serviceId: string;
  onSelect: (pkgName: string) => void;
  onClose: () => void;
}

const PackageModal: React.FC<PackageModalProps> = ({
  visible,
  serviceId,
  onSelect,
  onClose,
}) => {
  const fetchPackages = usePackageStore((s) => s.fetchPackages);
  const packages = usePackageStore((s) => s.getPackageByServiceId(serviceId));
  const isLoading = usePackageStore((s) => s.isLoading);

  useEffect(() => {
    if (visible) fetchPackages();
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      transparent
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Chọn gói dịch vụ</Text>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              data={packages}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => onSelect(item.name)}
                  style={styles.item}
                >
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={<Text>Không có gói nào.</Text>}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#00000066",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    maxHeight: "80%",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  item: {
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },
});

export default PackageModal;
