import React from "react";
import { Appbar } from "react-native-paper";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

interface MyAppBarProps {
  title: string;
}

const MyAppBar: React.FC<MyAppBarProps> = ({ title }) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <Appbar.Header style={styles.appBar}>
      <Appbar.BackAction
        onPress={handleBackPress}
        color="#28a745" // Màu của nút back (chỉnh màu xanh hoặc theo yêu cầu)
        style={styles.backAction}
      />
      <Appbar.Content title={title} titleStyle={styles.title} />
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  appBar: {
    backgroundColor: "#fff", 
    height: 30, 
    paddingHorizontal: 20, // Khoảng cách hai bên
    flexDirection: "row", // Để các phần tử nằm trên một hàng
    alignItems: "center", // Căn giữa các phần tử theo chiều dọc
    marginBottom: 20,
  },
  backAction: {
    marginLeft: -8, // Điều chỉnh để nút back không bị lệch
    alignSelf: "center", // Đảm bảo nút back căn giữa theo chiều dọc
  },
  title: {
    fontWeight: "bold", // Đậm chữ tiêu đề
    fontSize: 20, // Kích thước chữ
    color: "#000", // Màu tiêu đề
    textAlign: "center", // Căn giữa tiêu đề
    flex: 1, // Tiêu đề chiếm phần còn lại của Appbar
    alignSelf: "center", // Đảm bảo tiêu đề căn giữa theo chiều dọc
  },
});

export default MyAppBar;
