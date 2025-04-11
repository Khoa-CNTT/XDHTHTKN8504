import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Footer from '../components/Footer';

const PaymentScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Thông tin thanh toán</Text>

        <View style={styles.walletBox}>
          <Text style={styles.walletLabel}>Số dư ví TrueDoc</Text>
          <Text style={styles.walletAmount}>0</Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="qr-code-outline" size={24} color="#5E5CE5" />
            <Text style={styles.actionText}>Thanh toán</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="credit-card" size={24} color="#5E5CE5" />
            <Text style={styles.actionText}>Nạp tiền</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.disabledBox} disabled>
          <Text style={styles.disabledText}>Quản lý thẻ và tài khoản</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.moreButton}>
          <Text style={styles.moreText}>Xem thêm</Text>
        </TouchableOpacity>
      </ScrollView>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 12,
    color: '#000',
    fontWeight: '500',
  },
  walletBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 24,
  },
  walletLabel: {
    fontSize: 14,
    color: '#5E5CE5',
    marginBottom: 4,
  },
  walletAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: 'center',
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: {
    fontSize: 14,
    color: '#000',
    marginTop: 8,
  },
  disabledBox: {
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
  },
  disabledText: {
    color: '#ccc',
    fontSize: 14,
  },
  moreButton: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  moreText: {
    color: '#5E5CE5',
    fontSize: 14,
  },
});

export default PaymentScreen;