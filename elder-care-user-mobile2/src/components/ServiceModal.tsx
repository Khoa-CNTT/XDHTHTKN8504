import React, { useEffect } from "react";
import {
  Modal,
  FlatList,
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { useServicesStore } from "../stores/serviceStore";


type ServiceModalProps = {
  visible: boolean;
  role: string;
  onClose: () => void;
  onSelect: (serviceId: string) => void;
};

const ServiceModal: React.FC<ServiceModalProps> = ({
  visible,
  onClose,
  onSelect,
  role,
}) => {
  const { isLoading, getServicesByRole } = useServicesStore();
  

  const filteredServices = getServicesByRole(role); // lọc tại đây
  
  

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View
        style={{
          flex: 1,
          backgroundColor: "#000000aa",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            margin: 20,
            padding: 20,
            borderRadius: 10,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
            Chọn dịch vụ
          </Text>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              data={filteredServices}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    onSelect(item._id);
                    onClose();
                  }}
                  style={{
                    padding: 10,
                    borderBottomWidth: 1,
                    borderColor: "#ddd",
                  }}
                >
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          )}
          <TouchableOpacity onPress={onClose} style={{ marginTop: 10 }}>
            <Text style={{ color: "red", textAlign: "right" }}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};


export default ServiceModal;
