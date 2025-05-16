import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
    Home: undefined;
    ServiceScreen: { serviceId: string };
    Seach: undefined;
    PaymentMethodScreen: { onSelectMethod: (method: string) => void };
    TopUpScreen: { goToStep?: number; amount?: string }; // Sửa lại để truyền params
    TransferGuideScreen: { amount: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList>;
type TransferGuideRouteProp = RouteProp<RootStackParamList, 'TransferGuideScreen'>;

const BANK_NAME = 'VIETINBANK';
const ACCOUNT_NAME = 'CÔNG TY TNHH MỘT THÀNH VIÊN VNHEALTHCORP';
const ACCOUNT_NUMBER = '111002942279';
const TRANSFER_CONTENT = 'NT 0857484128';

const TransferGuideScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<TransferGuideRouteProp>();
    const amount = route.params?.amount || '0';

    const copyToClipboard = (text: string) => {
        // For Expo: import * as Clipboard from 'expo-clipboard'; Clipboard.setStringAsync(text);
        // For RN: import { Clipboard } from 'react-native'; Clipboard.setString(text);
        Alert.alert('Đã sao chép', text);
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.headerRow}>
                <Text style={styles.headerTitle}>Hướng dẫn chuyển khoản</Text>
                <Feather name="headphones" size={22} color="#37B44E" />
            </View>

            {/* Instructions */}
            <Text style={styles.instruction}>
                Bạn có thể sử dụng Internet banking, Mobile banking để chuyển tiền vào tài khoản của TrueDoc dưới đây:
            </Text>

            {/* Amount */}
            <Text style={styles.label}>Số tiền cần chuyển</Text>
            <Text style={styles.amount}>{amount}đ</Text>

            {/* Bank Info */}
            <Text style={styles.label}>Tài khoản ngân hàng của <Text style={styles.brand}>TrueDoc</Text></Text>
            <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Ngân hàng</Text>
                <Text style={styles.infoValue}>{BANK_NAME}</Text>
                <Text style={styles.infoLabel}>Tên tài khoản</Text>
                <Text style={styles.infoValue}>{ACCOUNT_NAME}</Text>
                <View style={styles.row}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.infoLabel}>Số tài khoản</Text>
                        <Text style={styles.infoValue}>{ACCOUNT_NUMBER}</Text>
                    </View>
                    <TouchableOpacity onPress={() => copyToClipboard(ACCOUNT_NUMBER)}>
                        <Text style={styles.copyText}>Sao chép</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Transfer Content */}
            <Text style={styles.label}>Nội dung chuyển khoản (ghi chính xác như bên dưới)</Text>
            <View style={styles.transferContentBox}>
                <Text style={styles.transferContent}>{TRANSFER_CONTENT}</Text>
                <TouchableOpacity onPress={() => copyToClipboard(TRANSFER_CONTENT)}>
                    <Text style={styles.copyText}>Sao chép</Text>
                </TouchableOpacity>
            </View>

            {/* Note */}
            <Text style={styles.note}>
                Sau khi đã chuyển khoản thành công, bạn vui lòng chọn vào nút <Text style={styles.link}>“Tôi đã chuyển khoản xong”</Text> bên dưới để thông báo cho TrueDoc biết nhé!
            </Text>

            {/* Confirm Button */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    navigation.navigate('TopUpScreen', { goToStep: 3, amount });
                }}
            >
                <Text style={styles.buttonText}>Tôi đã chuyển khoản xong</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16, paddingTop: 40 }, // paddingTop
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }, // Tăng marginBottom
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  instruction: { color: '#222', fontSize: 14, marginBottom: 18 }, // Tăng marginBottom
  label: { color: '#888', fontSize: 13, marginTop: 12, marginBottom: 4 }, // Tăng marginTop và marginBottom
  brand: { color: '#37B44E', fontWeight: 'bold' },
  amount: { color: '#37B44E', fontWeight: 'bold', fontSize: 28, marginBottom: 12 }, // Tăng marginBottom
  infoBox: { backgroundColor: '#F7F7F7', borderRadius: 8, padding: 12, marginBottom: 18 }, // Tăng marginBottom
  infoLabel: { color: '#888', fontSize: 13, marginTop: 8 }, // Tăng marginTop
  infoValue: { color: '#222', fontWeight: 'bold', fontSize: 15 },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 8 }, // Tăng marginTop
  copyText: { color: '#37B44E', fontWeight: 'bold', marginLeft: 12 },
  transferContentBox: {
   backgroundColor: '#F7F7F7',
   borderRadius: 8,
   padding: 12,
   flexDirection: 'row',
   alignItems: 'center',
   marginBottom: 18, // Tăng marginBottom
   justifyContent: 'space-between',
  },
  transferContent: { color: '#222', fontWeight: 'bold', fontSize: 16 },
  note: { color: '#222', fontSize: 13, marginVertical: 12 }, // Tăng marginVertical
  link: { color: '#37B44E', fontWeight: 'bold' },
  button: {
   backgroundColor: '#37B44E',
   borderRadius: 10,
   paddingVertical: 16,
   alignItems: 'center',
   marginTop: 20, // Tăng marginTop
   marginBottom: 30, // Tăng marginBottom
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
 });

export default TransferGuideScreen;