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
import { Service } from "../types/Service";


type ServiceModalProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (service: Service) => void;
};

const ServiceModal: React.FC<ServiceModalProps> = ({
  visible,
  onClose,
  onSelect,
}) => {
  const { isLoading, services } = useServicesStore();
  
  
  

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
              data={services}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    onSelect(item);
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
