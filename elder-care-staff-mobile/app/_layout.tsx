import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { SocketProvider } from "./context/SocketContext"; // đường dẫn có thể chỉnh tùy cấu trúc

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SocketProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }} />
        </SafeAreaView>
      </SocketProvider>
    </SafeAreaProvider>
  );
}
