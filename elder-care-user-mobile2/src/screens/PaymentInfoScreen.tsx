import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
    Home: undefined;
    ServiceScreen: { serviceId: string };
    Seach: undefined;
    TopUpScreen: undefined; // Add TopUp to the list of screens
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const PaymentInfoScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <Text style={styles.header}>Thông tin thanh toán</Text>

            {/* Balance */}
            <View style={styles.balanceCard}>
                <Text style={styles.balanceLabel}>Số dư ví TrueDoc</Text>
                <Text style={styles.balanceAmount}>0 <Text style={styles.currency}>đ</Text></Text>
            </View>

            {/* Actions */}
            <View style={styles.actionRow}>
                <TouchableOpacity style={styles.actionCard} onPress={() => { /* Handle payment */ }}>
                    <MaterialIcons name="qr-code-scanner" size={36} color="#7B61FF" />
                    <Text style={styles.actionText}>Thanh toán</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionCard}
                    onPress={() => navigation.navigate('TopUpScreen')} // Navigate to TopUpScreen
                >
                    <FontAwesome5 name="money-bill-wave" size={36} color="#7B61FF" />
                    <Text style={styles.actionText}>Nạp tiền</Text>
                </TouchableOpacity>
            </View>

            {/* Card Management */}
            <TouchableOpacity style={styles.cardManage} disabled>
                <MaterialIcons name="account-balance-wallet" size={24} color="#B0B0B0" />
                <Text style={styles.cardManageText}>Quản lý thẻ và tài khoản</Text>
            </TouchableOpacity>

            {/* Transaction History */}
            <Text style={styles.sectionTitle}>Lịch sử giao dịch</Text>
            <View style={styles.transactionCard}>
                <View style={styles.transactionRow}>
                    <Text style={styles.transactionType}>Nạp tiền</Text>
                    <Text style={styles.transactionAmount}>+ 20,000đ</Text>
                </View>
                <View style={styles.transactionRow}>
                    <Text style={styles.transactionDesc}>Chuyển khoản</Text>
                    <Text style={styles.transactionStatus}>Đang xử lý</Text>
                </View>
                <TouchableOpacity>
                    <Text style={styles.seeMore}>Xem thêm</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 16 },
    header: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginVertical: 12 },
    balanceCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        elevation: 2,
        marginBottom: 16,
    },
    balanceLabel: { color: '#7B61FF', fontWeight: 'bold', fontSize: 16 },
    balanceAmount: { fontSize: 32, fontWeight: 'bold', color: '#222', marginTop: 8 },
    currency: { fontSize: 18, color: '#888' },
    actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
    actionCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
        paddingVertical: 20,
        marginHorizontal: 6,
        elevation: 2,
    },
    actionText: { marginTop: 8, color: '#7B61FF', fontWeight: 'bold' },
    cardManage: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F6F6F6',
        borderRadius: 10,
        padding: 16,
        marginBottom: 20,
        opacity: 0.7,
    },
    cardManageText: { marginLeft: 10, color: '#B0B0B0', fontWeight: 'bold' },
    sectionTitle: { fontWeight: 'bold', fontSize: 15, marginBottom: 8 },
    transactionCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        elevation: 2,
        marginBottom: 20,
    },
    transactionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
    transactionType: { fontWeight: 'bold', fontSize: 15 },
    transactionAmount: { color: '#2CB742', fontWeight: 'bold', fontSize: 15 },
    transactionDesc: { color: '#888', fontSize: 13 },
    transactionStatus: { color: '#7B61FF', fontSize: 13 },
    seeMore: { color: '#7B61FF', textAlign: 'center', marginTop: 10, fontWeight: 'bold' },
});

export default PaymentInfoScreen;
