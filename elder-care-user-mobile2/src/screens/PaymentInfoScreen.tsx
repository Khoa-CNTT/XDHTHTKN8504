import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useWalletStore } from "../stores/WalletStore";
import { Transaction } from "../types/Wallet";

type RootStackParamList = {
  Home: undefined;
  ServiceScreen: { serviceId: string };
  Seach: undefined;
  TopUpScreen: undefined;
  PaymentInfoScreen: { newTransaction?: Transaction };
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

  const [showAllTransactions, setShowAllTransactions] = useState(false);

  const sortedTransactions = [...wallet.transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const visibleTransactions = showAllTransactions
    ? sortedTransactions
    : sortedTransactions.slice(0, 5);

    const renderTransaction = ({ item }: { item: Transaction }) => {
      let label = "";
      let color = "";
      let sign = "";

      switch (item.type) {
        case "PAYMENT":
          label = "Thanh toán";
          color = "#FF6B6B"; // đỏ
          sign = "-";
          break;
        case "TOP_UP":
          label = "Nạp tiền";
          color = "#2CB742"; // xanh
          sign = "+";
          break;
        case "REFUND":
          label = "Hoàn tiền";
          color = "#2CB742"; // xanh
          sign = "+";
          break;
        default:
          label = item.type;
          color = "#000";
          sign = "";
          break;
      }

      return (
        <View style={styles.transactionCard}>
          <View style={styles.transactionRow}>
            <Text style={styles.transactionType}>{label}</Text>
            <Text style={[styles.transactionAmount, { color }]}>
              {sign} {item.amount.toLocaleString("vi-VN")}đ
            </Text>
          </View>
          <View style={styles.transactionRow}>
            <Text
              style={styles.transactionDesc}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.description}
            </Text>
            <Text style={styles.transactionStatus}>{item.status}</Text>
          </View>
          <Text style={styles.transactionTime}>
            {new Date(item.date).toLocaleString("vi-VN")}
          </Text>
        </View>
      );
    };

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            <Text style={styles.header}>Thông tin thanh toán</Text>

            {/* Số dư ví */}
            <View style={styles.balanceCard}>
              <Text style={styles.balanceLabel}>Số dư ví ElderCare</Text>
              <Text style={styles.balanceAmount}>
                {wallet.balance.toLocaleString("vi-VN")}{" "}
                <Text style={styles.currency}>đ</Text>
              </Text>
            </View>

            {/* Hành động */}
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.actionCard}>
                <MaterialIcons
                  name="qr-code-scanner"
                  size={32}
                  color="#37B44E"
                />
                <Text style={styles.actionText}>Thanh toán</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => navigation.navigate("TopUpScreen")}
              >
                <FontAwesome5
                  name="money-bill-wave"
                  size={28}
                  color="#37B44E"
                />
                <Text style={styles.actionText}>Nạp tiền</Text>
              </TouchableOpacity>
            </View>

            {/* Quản lý thẻ */}
            <TouchableOpacity style={styles.cardManage} disabled>
              <MaterialIcons
                name="account-balance-wallet"
                size={20}
                color="#B0B0B0"
              />
              <Text style={styles.cardManageText}>
                Quản lý thẻ và tài khoản
              </Text>
            </TouchableOpacity>

            {/* Lịch sử giao dịch */}
            <Text style={styles.sectionTitle}>Lịch sử giao dịch</Text>

            {newTransaction && (
              <View style={styles.highlightCard}>
                <Text style={styles.highlightTitle}>Giao dịch mới</Text>
                {renderTransaction({ item: newTransaction })}
              </View>
            )}
          </>
        }
        data={visibleTransactions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderTransaction}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        ListFooterComponent={
          wallet.transactions.length > 5 ? (
            <TouchableOpacity
              onPress={() => setShowAllTransactions(!showAllTransactions)}
            >
              <Text style={styles.seeMore}>
                {showAllTransactions ? "Ẩn bớt" : "Xem thêm"}
              </Text>
            </TouchableOpacity>
          ) : null
        }
        ListEmptyComponent={
          <Text style={styles.noTransactionText}>Chưa có giao dịch nào</Text>
        }
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16, paddingTop: 30 },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
  },
  balanceCard: {
    backgroundColor: "#F3FFF6",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    elevation: 2,
    marginBottom: 20,
  },
  balanceLabel: { color: "#37B44E", fontWeight: "bold", fontSize: 16 },
  balanceAmount: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#222",
    marginTop: 6,
  },
  currency: { fontSize: 18, color: "#888" },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  actionCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 18,
    marginHorizontal: 6,
    elevation: 2,
  },
  actionText: { marginTop: 6, color: "#37B44E", fontWeight: "bold" },
  cardManage: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    opacity: 0.6,
  },
  cardManageText: { marginLeft: 10, color: "#B0B0B0", fontWeight: "bold" },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 12,
    color: "#333",
  },
  transactionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    elevation: 2,
  },
  transactionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
    gap: 10,
  },
  transactionType: { fontWeight: "bold", fontSize: 15, color: "#222" },
  transactionAmount: { fontWeight: "bold", fontSize: 15 },
  transactionDesc: { flex: 1, color: "#666", fontSize: 13 },
  transactionStatus: { color: "#37B44E", fontSize: 13, flexShrink: 0 },
  transactionTime: { color: "#999", fontSize: 12, marginTop: 4 },
  noTransactionText: {
    textAlign: "center",
    color: "#aaa",
    marginTop: 20,
    fontStyle: "italic",
  },
  highlightCard: {
    backgroundColor: "#E8FFF0",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  highlightTitle: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#37B44E",
    marginBottom: 6,
  },
  seeMore: {
    textAlign: "center",
    color: "#37B44E",
    fontWeight: "bold",
    marginTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#EEE",
    marginVertical: 8,
  },
});

export default PaymentInfoScreen;
