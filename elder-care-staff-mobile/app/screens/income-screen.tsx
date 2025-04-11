import React, { useEffect, useState, useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  View,
  Text,
} from "react-native";
import { Card } from "react-native-paper";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

const IncomeScreen = () => {
  const [incomeData, setIncomeData] = useState<{ day: number; income: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Giả lập API bằng setTimeout
  const fakeApiCall = (): Promise<{ day: number; income: number }[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { day: 1, income: 500 },
          { day: 5, income: 1200 },
          { day: 10, income: 1800 },
          { day: 15, income: 2500 },
          { day: 20, income: 3000 },
          { day: 25, income: 3500 },
          { day: 30, income: 4000 },
        ]);
      }, 2000); // Mô phỏng API mất 2 giây để phản hồi
    });
  };

  useEffect(() => {
    const fetchIncomeData = async () => {
      try {
        setLoading(true);
        const result = await fakeApiCall(); // Gọi API giả lập
        setIncomeData(result);
      } catch (err) {
        setError("Lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchIncomeData();
  }, []);

  // 🔹 Chuyển đổi dữ liệu để vẽ biểu đồ
  const chartData = useMemo(() => {
    return {
      labels: incomeData.map((item) => item.day.toString()),
      datasets: [{ data: incomeData.map((item) => item.income) }],
    };
  }, [incomeData]);

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Biểu đồ thu nhập" />
        <Card.Content>
          {loading ? (
            <ActivityIndicator size="large" color="blue" />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <LineChart
              data={chartData}
              width={screenWidth - 20}
              height={220}
              yAxisLabel=""
              yAxisSuffix=" VND"
              chartConfig={{
                backgroundGradientFrom: "#2196F3",
                backgroundGradientTo: "#64B5F6",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              }}
              bezier
            />
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  card: { marginVertical: 8, borderRadius: 10, padding: 10 },
  errorText: { color: "red", textAlign: "center", marginTop: 10 },
});

export default IncomeScreen;
