import { Card } from "react-native-paper";
import { View, Text } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

type BalanceCardProps = {
  salary: number;
  completed: number; // ví dụ số công việc hoàn thành
  distance: number; // ví dụ khoảng cách (km)
};
const BalanceCard = ({ salary, completed, distance }: BalanceCardProps) => {
  return (
    <Card style={{ margin: 16, borderRadius: 16, elevation: 4 }}>
      <Card.Content>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text style={{ fontSize: 16, color: "#666" }}>Tổng thu nhập</Text>
            <Text
              style={{ fontSize: 28, fontWeight: "bold", color: "#28a745" }}
            >
              {salary.toLocaleString()}đ
            </Text>
          </View>
          <FontAwesome5 name="wallet" size={32} color="#28a745" />
        </View>
        <View
          style={{
            marginTop: 16,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text>{completed} đơn hoàn thành</Text>
          <Text>{distance} đang thực hiện</Text>
        </View>
      </Card.Content>
    </Card>
  );
};

export default BalanceCard;
