import React from "react";
import { Button } from "react-native-paper";
import { Phone, MessageCircle } from "lucide-react-native";
import { View, Linking, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

type Props = {
  phone: string;
  onStartChat: () => void; // thêm prop này
};


const ContactButtons: React.FC<Props> = ({ phone, onStartChat }) => {
  return (
    <View style={styles.row}>
      <Button
        mode="outlined"
        icon={() => <Phone size={20} />}
        style={styles.button}
        onPress={() => {
          if (phone) {
            Linking.openURL(`tel:${phone}`);
          } else {
            console.log("Số điện thoại không hợp lệ");
          }
        }}
      >
        Call
      </Button>
      <Button
        mode="outlined"
        icon={() => <MessageCircle size={20} />}
        style={styles.button}
        onPress={onStartChat} // dùng prop thay vì navigate trực tiếp
      >
     Chat
  </Button>
        
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: {
    width: "48%",
  },
});

export default ContactButtons;
