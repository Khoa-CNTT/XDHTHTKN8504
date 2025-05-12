// components/PaymentMethods.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';

interface PaymentMethodsProps {
    onSelectMethod: (method: string) => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ onSelectMethod }) => {
    const handleMethodPress = (method: string) => {
        onSelectMethod(method);
    };

    return (
        <View>
            {/* E-wallet */}
            <Text style={styles.sectionTitle}>Ví điện tử</Text>
            <TouchableOpacity style={styles.methodCard} onPress={() => handleMethodPress('momo')}>
                <Image
                    source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/MoMo_Logo.png' }}
                    style={styles.momoLogo}
                />
                <Text style={styles.methodText}>Ví điện tử Momo</Text>
            </TouchableOpacity>

            {/* ATM */}
            <Text style={styles.sectionTitle}>Thẻ ATM nội địa</Text>
            <TouchableOpacity style={styles.methodCard} onPress={() => handleMethodPress('atm')}>
                <FontAwesome5 name="credit-card" size={28} color="#7B61FF" />
                <Text style={styles.methodText}>Thẻ ATM nội địa</Text>
            </TouchableOpacity>

            {/* Credit Card */}
            <Text style={styles.sectionTitle}>Thẻ tín dụng (Visa/MasterCard/JCB)</Text>
            <TouchableOpacity style={styles.methodCard} onPress={() => handleMethodPress('credit')}>
                <View style={styles.iconRow}>
                    <FontAwesome name="cc-visa" size={28} color="#1A1F71" style={{ marginRight: 4 }} />
                    <FontAwesome name="cc-mastercard" size={28} color="#EB001B" style={{ marginRight: 4 }} />
                    <FontAwesome5 name="cc-jcb" size={28} color="#0070BA" />
                </View>
                <Text style={styles.methodText}>Thẻ tín dụng (Visa/MasterCard/JCB)</Text>
            </TouchableOpacity>

            {/* Bank Transfer */}
            <Text style={styles.sectionTitle}>Chuyển khoản</Text>
            <TouchableOpacity style={styles.methodCard} onPress={() => handleMethodPress('bank')}>
                <FontAwesome5 name="money-check-alt" size={28} color="#7B61FF" />
                <Text style={styles.methodText}>Chuyển khoản</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    sectionTitle: { fontWeight: 'bold', fontSize: 15, marginTop: 16, marginBottom: 8 },
    methodCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        elevation: 2,
        marginBottom: 10,
    },
    momoLogo: { width: 32, height: 32, borderRadius: 6, marginRight: 12 },
    methodText: { fontWeight: 'bold', fontSize: 15, marginLeft: 8 },
    iconRow: { flexDirection: 'row', alignItems: 'center', marginRight: 8 },
});

export default PaymentMethods;