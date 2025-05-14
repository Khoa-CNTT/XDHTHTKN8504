import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useWalletStore } from "../stores/WalletStore";
import { Transaction } from "../types/Wallet"; // Import kiểu dữ liệu Transaction

type RootStackParamList = {
  Home: undefined;
  ServiceScreen: { serviceId: string };
  Seach: undefined;
  TopUpScreen: undefined;
  PaymentInfoScreen: { newTransaction?: any };
};

type NavigationProp = StackNavigationProp<RootStackParamList>;
type PaymentInfoScreenRouteProp = RouteProp<
  RootStackParamList,
  "PaymentInfoScreen"
>;

const PaymentInfoScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<PaymentInfoScreenRouteProp>();
  const newTransaction = route.params?.newTransaction;
  const wallet = useWalletStore.getState().wallet;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Thông tin thanh toán</Text>

      {/* Balance */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Số dư ví ElderCare</Text>
        <Text style={styles.balanceAmount}>
          {wallet.balance} <Text style={styles.currency}>đ</Text>
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => {
            /* Handle payment */
          }}
        >
          <MaterialIcons name="qr-code-scanner" size={36} color="#37B44E" />
          <Text style={styles.actionText}>Thanh toán</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate("TopUpScreen")}
        >
          <FontAwesome5 name="money-bill-wave" size={36} color="#37B44E" />
          <Text style={styles.actionText}>Nạp tiền</Text>
        </TouchableOpacity>
      </View>

      {/* Card Management */}
      <TouchableOpacity style={styles.cardManage} disabled>
        <MaterialIcons
          name="account-balance-wallet"
          size={24}
          color="#B0B0B0"
        />
        <Text style={styles.cardManageText}>Quản lý thẻ và tài khoản</Text>
      </TouchableOpacity>

      {/* Transaction History */}
      <Text style={styles.sectionTitle}>Lịch sử giao dịch</Text>

      {/* Display new transaction if available */}
      {newTransaction ? (
        <View style={styles.transactionCard}>
          <View style={styles.transactionRow}>
            <Text style={styles.transactionType}>{newTransaction.type}</Text>
            <Text style={styles.transactionAmount}>
              + {newTransaction.amount.toLocaleString()}đ
            </Text>
          </View>
          <View style={styles.transactionRow}>
            <Text style={styles.transactionDesc}>{newTransaction.desc}</Text>
            <Text style={styles.transactionStatus}>
              {newTransaction.status}
            </Text>
          </View>
          <Text style={{ color: "#888", fontSize: 12, marginTop: 4 }}>
            {newTransaction.time}
          </Text>
        </View>
      ) : (
        <Text style={{ color: "#888", textAlign: "center", marginBottom: 20 }}>
          Chưa có giao dịch nào
        </Text>
      )}

      {/* Display all transaction history */}
      {wallet.transactions.length > 0 ? (
        wallet.transactions.map((transaction: Transaction, index: number) => (
          <View key={index} style={styles.transactionCard}>
            <View style={styles.transactionRow}>
              <Text style={styles.transactionType}>{transaction.type}</Text>
              <Text style={styles.transactionAmount}>
                {transaction.type === "topup" ? "+" : "-"}{" "}
                {transaction.amount.toLocaleString()}đ
              </Text>
            </View>
            <View style={styles.transactionRow}>
              <Text style={styles.transactionDesc}>
                {transaction.description}
              </Text>
              <Text style={styles.transactionStatus}>{transaction.status}</Text>
            </View>
            <Text style={{ color: "#888", fontSize: 12, marginTop: 4 }}>
              {new Date(transaction.date).toLocaleString()}
            </Text>
          </View>
        ))
      ) : (
        <Text style={{ color: "#888", textAlign: "center", marginBottom: 20 }}>
          Chưa có giao dịch nào
        </Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16, paddingTop: 30 },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 12,
  },
  balanceCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 2,
    marginBottom: 16,
  },
  balanceLabel: { color: "#37B44E", fontWeight: "bold", fontSize: 16 },
  balanceAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#222",
    marginTop: 8,
  },
  currency: { fontSize: 18, color: "#888" },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  actionCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 20,
    marginHorizontal: 6,
    elevation: 2,
  },
  actionText: { marginTop: 8, color: "#37B44E", fontWeight: "bold" },
  cardManage: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    opacity: 0.7,
  },
  cardManageText: { marginLeft: 10, color: "#B0B0B0", fontWeight: "bold" },
  sectionTitle: { fontWeight: "bold", fontSize: 15, marginBottom: 8 },
  transactionCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    elevation: 2,
    marginBottom: 20,
  },
  transactionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  transactionType: { fontWeight: "bold", fontSize: 15 },
  transactionAmount: { color: "#2CB742", fontWeight: "bold", fontSize: 15 },
  transactionDesc: { color: "#888", fontSize: 13 },
  transactionStatus: { color: "#37B44E", fontSize: 13 },
  seeMore: {
    color: "#37B44E",
    textAlign: "center",
    marginTop: 10,
    fontWeight: "bold",
  },
});

export default PaymentInfoScreen;
