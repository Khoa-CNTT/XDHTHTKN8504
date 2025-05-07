// components/GlobalModal.tsx
import { Modal, View, Text, Button } from "react-native";
import { useModalStore } from "../stores/modalStore";

const GlobalModal = () => {
  const { visible, title, message, hideModal } = useModalStore();

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.4)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 10,
            padding: 20,
            width: "80%",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
            {title}
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 20 }}>{message}</Text>
          <Button title="Đóng" onPress={hideModal} />
        </View>
      </View>
    </Modal>
  );
};

export default GlobalModal;
