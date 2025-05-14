import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";

const services = [
  {
    title: "Khám Tổng Quát",
    price: "700.000 đ",
    image: require("../asset/img/hinh1.png"), // Thay thế bằng ảnh thật
    backgroundColor: "#E0F7FA",
  },
  {
    title: "Nhi Khoa",
    price: "700.000 đ",
    image: require("../asset/img/hinh1.png"),
    backgroundColor: "#EDE7F6",
  },
  {
    title: "Điều Dưỡng Tại Nhà",
    price: "500.000 đ",
    image: require("../asset/img/hinh1.png"),
    backgroundColor: "#FCE4EC",
  },
];

const HomeServiceScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Chọn dịch vụ</Text>
      <Text style={styles.subText}>
        Các dịch vụ chăm sóc tại nhà hiện nay chỉ có tại thành phố Hồ Chí Minh.
      </Text>

      {services.map((service, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.card, { backgroundColor: service.backgroundColor }]}
        >
          <View style={styles.cardContent}>
            <View style={{ flex: 1 }}>
              <Text style={styles.serviceTitle}>{service.title}</Text>
              <Text style={styles.price}>
                Giá tư vấn chỉ từ {service.price}
              </Text>
            </View>
            <Image
              source={service.image}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    flex: 1,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0D47A1",
    marginBottom: 4,
  },
  subText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#000",
  },
  price: {
    fontSize: 14,
    color: "#1E88E5",
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: 12,
    marginLeft: 16,
  },
});

export default HomeServiceScreen;