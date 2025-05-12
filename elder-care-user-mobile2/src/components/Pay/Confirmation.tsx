// components/Confirmation.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

interface ConfirmationProps {
    amount: string;
    selectedMethod?: string;
}

const paymentMethodDisplay: Record<string, string> = {
    momo: 'Ví điện tử Momo',
    atm: 'Thẻ ATM nội địa',
    credit: 'Thẻ tín dụng (Visa/MasterCard/JCB)',
    bank: 'Chuyển khoản',
};

const Confirmation: React.FC<ConfirmationProps> = ({ amount, selectedMethod }) => {
    return (
        <View style={styles.container}>
            <FontAwesome5 name="file-alt" size={60} color="#7B61FF" style={styles.icon} />
            <Text style={styles.title}>Xác nhận giao dịch</Text>
            {amount && <Text style={styles.detail}>Số tiền: {amount}</Text>}
            {selectedMethod && (
                <Text style={styles.detail}>Phương thức thanh toán: {paymentMethodDisplay[selectedMethod]}</Text>
            )}
            {!amount && <Text style={styles.warning}>Vui lòng nhập số tiền.</Text>}
            {!selectedMethod && <Text style={styles.warning}>Vui lòng chọn phương thức thanh toán.</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 20,
    },
    icon: {
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    detail: {
        fontSize: 16,
        marginBottom: 5,
    },
    warning: {
        fontSize: 16,
        color: 'orange',
        marginTop: 10,
    },
});

export default Confirmation;