import React, {useEffect} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Linking} from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {callMomoTopup} from "../api/WalletService"

type RootStackParamList = {
    Home: undefined;
    ServiceScreen: { serviceId: string };
    Seach: undefined;
    PaymentMethodScreen: { onSelectMethod: (method: string) => void };
    TopUpScreen: { goToStep?: number; amount?: string };
    TransferGuideScreen: { amount: string; selectedMethod?: string };
    PaymentInfoScreen: { newTransaction?: any }; // Sửa để nhận params
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
    const route = useRoute<TopUpScreenRouteProp>();
    const [amount, setAmount] = React.useState("");
    const [selectedMethod, setSelectedMethod] = React.useState<string | undefined>(undefined);
    const [step, setStep] = React.useState(1);

    // Callback to receive selected method from PaymentMethodScreen
    const handleSelectMethod = (method: string) => {
        setSelectedMethod(method);
    };

    // Handle navigation param to jump to step 3
    useEffect(() => {
        if (route.params?.goToStep === 3) {
            setStep(3);
        }
        if (route.params?.amount) {
            setAmount(route.params.amount);
        }
    }, [route.params]);

    useEffect(() => {
      const triggerMomoPayment = async () => {
        try {
          const response = await callMomoTopup(amount);

          if (response?.response?.deeplink) {
            Alert.alert(
              "Xác nhận thanh toán",
              "Bạn có muốn mở ứng dụng MoMo để hoàn tất thanh toán?",
              [
                {
                  text: "Hủy",
                  style: "cancel",
                },
                {
                  text: "Đồng ý",
                  onPress: () => Linking.openURL(response.response.deeplink),
                },
              ],
              { cancelable: true }
            );
          } else {
            Alert.alert("Không lấy được liên kết MoMo", "Vui lòng thử lại sau");
          }
        } catch (err) {
          Alert.alert(
            "Lỗi khi tạo giao dịch",
            "Vui lòng kiểm tra kết nối hoặc thử lại sau"
          );
        }
      };

      if (step === 3 && selectedMethod === "momo") {
        triggerMomoPayment();
      }
    }, [step, selectedMethod]);

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back-ios" size={24} color="#222" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Nạp tiền</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Stepper */}
            <View style={styles.stepperRow}>
                <View style={step === 1 ? styles.stepItemActive : styles.stepItem}>
                    <FontAwesome5 name="wallet" size={18} color={step === 1 ? "#fff" : "#37B44E"} />
                    <Text style={step === 1 ? styles.stepTextActive : styles.stepText}>Phương thức</Text>
                </View>
                <View style={styles.stepDivider} />
                <View style={step === 2 ? styles.stepItemActive : styles.stepItem}>
                    <FontAwesome5 name="file-alt" size={18} color={step === 2 ? "#fff" : "#37B44E"} />
                    <Text style={step === 2 ? styles.stepTextActive : styles.stepText}>Xác nhận</Text>
                </View>
                <View style={styles.stepDivider} />
                <View style={step === 3 ? styles.stepItemActive : styles.stepItem}>
                    <FontAwesome5 name="check-circle" size={18} color={step === 3 ? "#fff" : "#37B44E"} />
                    <Text style={step === 3 ? styles.stepTextActive : styles.stepText}>Kết quả</Text>
                </View>
            </View>

            {step === 1 && (
                <>
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
                        onPress={() =>
                            navigation.navigate('PaymentMethodScreen', {
                                onSelectMethod: handleSelectMethod,
                            })
                        }
                    >
                        <View style={styles.methodLeft}>
                            <FontAwesome5 name="money-check-alt" size={32} color="#37B44E" />
                            <Text style={styles.methodTitle}>
                                {selectedMethod ? paymentMethodDisplay[selectedMethod] : 'Chọn phương thức thanh toán'}
                            </Text>
                        </View>
                        <Text style={styles.methodChoose}>Chọn</Text>
                    </TouchableOpacity>

                    {/* Policy */}
                    <View style={styles.policyCard}>
                        <Text style={styles.policyTitle}>Chính sách</Text>
                        <View style={styles.policyRow}>
                            <MaterialIcons name="info-outline" size={16} color="#37B44E" />
                            <Text style={styles.policyText}>
                                Số tiền nạp vào <Text style={styles.link}>ElderCare</Text> chỉ được dùng để thanh toán các dịch vụ y tế, sức khoẻ do <Text style={styles.link}>ElderCare</Text> cung cấp
                            </Text>
                        </View>
                        <View style={styles.policyRow}>
                            <MaterialIcons name="info-outline" size={16} color="#37B44E" />
                            <Text style={styles.policyText}>
                                Khách hàng không được phép chuyển tiền giữa các tài khoản <Text style={styles.link}>ElderCare</Text> với nhau
                            </Text>
                        </View>
                        <View style={styles.policyRow}>
                            <MaterialIcons name="info-outline" size={16} color="#37B44E" />
                            <Text style={styles.policyText}>
                                Khách hàng không được phép tự rút tiền từ tài khoản <Text style={styles.link}>ElderCare</Text>
                            </Text>
                        </View>
                    </View>

                    {/* Next Button */}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            if (amount && selectedMethod) {
                                setStep(2);
                            }
                        }}
                    >
                        <Text style={styles.buttonText}>Nạp tiền</Text>
                    </TouchableOpacity>
                </>
            )}

            {step === 2 && (
                <View>
                    <Text style={styles.confirmationTitle}>Xác nhận giao dịch</Text>
                    {amount && <Text style={styles.confirmationText}>Số tiền: {Number(amount).toLocaleString()} VND</Text>}
                    {selectedMethod && (
                        <Text style={styles.confirmationText}>Phương thức: {paymentMethodDisplay[selectedMethod]}</Text>
                    )}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                           
                            navigation.navigate('TransferGuideScreen', { amount, selectedMethod }); setStep(3); 
                        }}
                    >
                        <Text style={styles.buttonText}>Xác nhận nạp tiền</Text>
                    </TouchableOpacity>
                </View>
            )}

            {step === 3 && (
               
                <View>
                    
                    <Text style={{ fontSize: 32, color: '#2CB742', fontWeight: 'bold', textAlign: 'center', marginTop: 12 }}>
                        + {Number(amount).toLocaleString()}VND
                    </Text>
                    <Text style={{ color: '#37B44E', textAlign: 'center', marginBottom: 12 }}>Đang xử lý</Text>
                    {/* Info Card */}
                    <View style={{
                        backgroundColor: '#fff',
                        borderRadius: 10,
                        padding: 16,
                        marginHorizontal: 16,
                        marginBottom: 24,
                        elevation: 2,
                    }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                            <Text style={{ color: '#888' }}>Nguồn tiền</Text>
                            <Text style={{ fontWeight: 'bold' }}>{selectedMethod ? paymentMethodDisplay[selectedMethod] : ''}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: '#888' }}>Thời gian</Text>
                            <Text style={{ fontWeight: 'bold' }}>
                                {new Date().toLocaleDateString('vi-VN')}  •  {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                        </View>
                    </View>
                    {/* Home Button */}
                    <TouchableOpacity
                        style={[styles.button, { marginHorizontal: 16 }]}
                        onPress={() => {
                            navigation.navigate('PaymentInfoScreen', {
                                newTransaction: {
                                    id: Date.now().toString(),
                                    type: 'Nạp tiền',
                                    amount: Number(amount),
                                    status: 'Đang xử lý',
                                    desc: selectedMethod ? paymentMethodDisplay[selectedMethod] : '',
                                    time: new Date().toLocaleString('vi-VN'),
                                }
                            });
                        }}
                    >
                        <Text style={styles.buttonText}>Quay về ví của tao</Text>
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 16 ,paddingTop: 30,},
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#222' },
    stepperRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
    stepItemActive: { alignItems: 'center', backgroundColor: '#37B44E', borderRadius: 8, padding: 8, flex: 1 },
    stepItem: { alignItems: 'center', backgroundColor: '#F2F2F2', borderRadius: 8, padding: 8, flex: 1 },
    stepTextActive: { color: '#fff', fontWeight: 'bold', fontSize: 13, marginTop: 2 },
    stepText: { color: '#37B44E', fontWeight: 'bold', fontSize: 13, marginTop: 2 },
    stepDivider: { width: 16, height: 2, backgroundColor: '#37B44E', marginHorizontal: 2 },
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
    methodChoose: { color: '#37B44E', fontWeight: 'bold', fontSize: 15 },
    policyCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        elevation: 2,
        marginBottom: 24,
    },
    policyTitle: { fontWeight: 'bold', marginBottom: 8, fontSize: 15 },
    policyRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
    policyText: { marginLeft: 8, color: '#222', fontSize: 13, flex: 1 },
    link: { color: '#37B44E', fontWeight: 'bold' },
    button: {
        backgroundColor: '#37B44E',
        borderRadius: 10,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 24,
        marginTop: 16,
    },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    confirmationTitle: { fontWeight: 'bold', fontSize: 18, marginBottom: 12, textAlign: 'center' },
    confirmationText: { fontSize: 16, marginBottom: 8, textAlign: 'center' },
});

export default TopUpScreen;