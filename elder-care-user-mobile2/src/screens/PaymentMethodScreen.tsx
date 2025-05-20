import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { MaterialIcons, FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
    Home: undefined;
    ServiceScreen: { serviceId: string };
    Seach: undefined;
    PaymentMethodScreen: { onSelectMethod: (method: string) => void };
    TopUpScreen: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;
type PaymentMethodScreenRouteProp = RouteProp<RootStackParamList, 'PaymentMethodScreen'>;

const PaymentMethodScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<PaymentMethodScreenRouteProp>();
    const { onSelectMethod } = route.params;

    const handleMethodPress = (method: string) => {
        onSelectMethod(method);
        navigation.goBack();
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back-ios" size={24} color="#222" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Phương thức thanh toán</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* E-wallet */}
            <Text style={styles.sectionTitle}>Ví điện tử</Text>
            <TouchableOpacity style={styles.methodCard} onPress={() => handleMethodPress('momo')}>
                <Image
                    source={require("../asset/img/logo_momo.png")}
                    style={styles.momoLogo}
                />
                <Text style={styles.methodText}>Ví điện tử Momo</Text>
            </TouchableOpacity>

            {/* ATM */}
            <Text style={styles.sectionTitle}>Thẻ ATM nội địa</Text>
            <TouchableOpacity style={styles.methodCard} onPress={() => handleMethodPress('atm')}>
                <FontAwesome5 name="credit-card" size={28} color="#37B44E" />
                <Text style={styles.methodText}>Thẻ ATM nội địa</Text>
            </TouchableOpacity>

            {/* Credit Card */}
            <Text style={styles.sectionTitle}>Thẻ tín dụng (Visa/MasterCard/JCB)</Text>
            <TouchableOpacity style={styles.methodCard} onPress={() => handleMethodPress('credit')}>
                <View style={styles.iconRow}>
                    <FontAwesome name="cc-visa" size={20} color="#1A1F71" style={{ marginRight: 5 }} />
                    <FontAwesome name="cc-mastercard" size={20} color="#EB001B" style={{ marginRight: 5 }} />
                    <FontAwesome5 name="cc-jcb" size={20} color="#0070BA" />
                </View>
                <Text style={styles.methodText}>Thẻ tín dụng (Visa/MasterCard/JCB)</Text>
            </TouchableOpacity>

            {/* Bank Transfer */}
            <Text style={styles.sectionTitle}>Chuyển khoản</Text>
            <TouchableOpacity style={styles.methodCard} onPress={() => handleMethodPress('bank')}>
                <FontAwesome5 name="money-check-alt" size={28} color="#37B44E" />
                <Text style={styles.methodText}>Chuyển khoản</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 16, paddingTop: 30, },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#222' },
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

export default PaymentMethodScreen;
