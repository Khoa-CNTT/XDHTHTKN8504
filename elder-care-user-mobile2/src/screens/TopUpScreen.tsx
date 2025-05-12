import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
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
type TopUpScreenRouteProp = RouteProp<RootStackParamList, 'TopUpScreen'>;

const paymentMethodDisplay: Record<string, string> = {
    momo: 'Ví điện tử Momo',
    atm: 'Thẻ ATM nội địa',
    credit: 'Thẻ tín dụng (Visa/MasterCard/JCB)',
    bank: 'Chuyển khoản',
};

const TopUpScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const [amount, setAmount] = React.useState<string>('');
    const [selectedMethod, setSelectedMethod] = React.useState<string | undefined>();
    const [step, setStep] = React.useState<1 | 2 | 3>(1); // 1: Phương thức, 2: Xác nhận, 3: Kết quả
    const [paymentSuccess, setPaymentSuccess] = React.useState<boolean>(false); // State cho kết quả

    const handlePaymentMethodSelect = (method: string) => {
        setSelectedMethod(method);
    };

    const handleConfirmPayment = () => {
        // Gọi API nạp tiền ở đây (ví dụ: sau 3 giây giả lập thành công)
        setTimeout(() => {
            setPaymentSuccess(true);
            setStep(3); // Chuyển sang bước kết quả
        }, 3000);
    };

    const handleGoBack = () => {
        if (step > 1) {
            setStep(prevStep => (prevStep === 3 ? 2 : 1));
        } else {
            navigation.goBack();
        }
    };

    const handleStartOver = () => {
        setStep(1);
        setAmount('');
        setSelectedMethod(undefined);
        setPaymentSuccess(false);
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={handleGoBack}>
                    <MaterialIcons name="arrow-back-ios" size={24} color="#222" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Nạp tiền</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Stepper */}
            <View style={styles.stepperRow}>
                <View style={[styles.stepItem, step >= 1 && styles.stepItemActive]}>
                    <FontAwesome5 name="wallet" size={18} color={step >= 1 ? '#fff' : '#7B61FF'} />
                    <Text style={[styles.stepText, step >= 1 && styles.stepTextActive]}>Phương thức</Text>
                </View>
                <View style={[styles.stepDivider, step > 1 && styles.stepDividerActive]} />
                <View style={[styles.stepItem, step >= 2 && styles.stepItemActive]}>
                    <FontAwesome5 name="file-alt" size={18} color={step >= 2 ? '#fff' : '#7B61FF'} />
                    <Text style={[styles.stepText, step >= 2 && styles.stepTextActive]}>Xác nhận</Text>
                </View>
                <View style={[styles.stepDivider, step > 2 && styles.stepDividerActive]} />
                <View style={[styles.stepItem, step >= 3 && styles.stepItemActive]}>
                    <FontAwesome5 name="check-circle" size={18} color={step >= 3 ? '#fff' : '#7B61FF'} />
                    <Text style={[styles.stepText, step >= 3 && styles.stepTextActive]}>Kết quả</Text>
                </View>
            </View>

            {step === 1 && (
                <View>
                    {/* Input Amount */}
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập số tiền cần nạp"
                        keyboardType="numeric"
                        value={amount}
                        onChangeText={setAmount}
                    />
                    {/* Payment Method */}
                    <Text style={styles.label}>Phương thức thanh toán</Text>
                    <TouchableOpacity
                        style={styles.methodCard}
                        onPress={() => navigation.navigate('PaymentMethodScreen', { onSelectMethod: handlePaymentMethodSelect })}
                    >
                        <View style={styles.methodLeft}>
                            <FontAwesome5 name="money-check-alt" size={32} color="#7B61FF" />
                            <Text style={styles.methodTitle}>
                                {selectedMethod ? paymentMethodDisplay[selectedMethod] : 'Chọn phương thức thanh toán'}
                            </Text>
                        </View>
                        <Text style={styles.methodChoose}>Chọn</Text>
                    </TouchableOpacity>

                    {/* Policy */}
                    <View style={styles.policyCard}>
                        <Text style={styles.policyTitle}>Chính sách</Text>
                        {/* ... các điều khoản chính sách ... */}
                    </View>

                    <TouchableOpacity
                        style={[styles.button, (!amount || !selectedMethod) && styles.buttonDisabled]}
                        onPress={() => setStep(2)}
                        disabled={!amount || !selectedMethod}
                    >
                        <Text style={styles.buttonText}>Tiếp tục</Text>
                    </TouchableOpacity>
                </View>
            )}

            {step === 2 && (
                <View>
                    <Text style={styles.confirmationTitle}>Xác nhận giao dịch</Text>
                    {amount && <Text style={styles.confirmationText}>Số tiền: {amount}</Text>}
                    {selectedMethod && (
                        <Text style={styles.confirmationText}>Phương thức: {paymentMethodDisplay[selectedMethod]}</Text>
                    )}
                    <TouchableOpacity style={styles.button} onPress={handleConfirmPayment}>
                        <Text style={styles.buttonText}>Xác nhận nạp tiền</Text>
                    </TouchableOpacity>
                </View>
            )}

            {step === 3 && (
                <View>
                    <Text style={styles.resultTitle}>{paymentSuccess ? 'Nạp tiền thành công!' : 'Nạp tiền thất bại!'}</Text>
                    <TouchableOpacity style={styles.button} onPress={handleStartOver}>
                        <Text style={styles.buttonText}>Hoàn tất</Text>
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 16 },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#222' },
    stepperRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
    stepItem: { alignItems: 'center', backgroundColor: '#F2F2F2', borderRadius: 8, padding: 8, flex: 1 },
    stepItemActive: { alignItems: 'center', backgroundColor: '#7B61FF', borderRadius: 8, padding: 8, flex: 1 },
    stepText: { color: '#7B61FF', fontWeight: 'bold', fontSize: 13, marginTop: 2 },
    stepTextActive: { color: '#fff', fontWeight: 'bold', fontSize: 13, marginTop: 2 },
    stepDivider: { width: 16, height: 2, backgroundColor: '#7B61FF', marginHorizontal: 2 },
    stepDividerActive: { backgroundColor: '#7B61FF' },
    input: {
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
        backgroundColor: '#fff'
    },
    label: { fontWeight: 'bold', marginBottom: 8, marginTop: 2 },
    methodCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        elevation: 2,
        marginBottom: 18,
        justifyContent: 'space-between'
    },
    methodLeft: { flexDirection: 'row', alignItems: 'center' },
    methodTitle: { fontWeight: 'bold', marginLeft: 12, fontSize: 15 },
    methodChoose: { color: '#7B61FF', fontWeight: 'bold', fontSize: 15 },
    policyCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        elevation: 2,
        marginBottom: 24,
    },
    policyTitle: { fontWeight: 'bold', marginBottom: 8, fontSize: 15 },
    button: {
        backgroundColor: '#7B61FF',
        borderRadius: 10,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 24,
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    confirmationTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    confirmationText: { fontSize: 16, marginBottom: 5 },
    resultTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
});

export default TopUpScreen;