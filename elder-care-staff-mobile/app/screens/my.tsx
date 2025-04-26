import React, { useEffect } from "react";
import { Text, View, Button } from "react-native";
import {useSocketStore} from "../../stores/socketStore"; // Thay đổi đường dẫn nếu cần

const WebSocketStatus = () => {
  const { isConnected, connect, disconnect } = useSocketStore();

  useEffect(() => {
    connect(); // Kết nối khi component được mount

    return () => {
      disconnect(); // Ngắt kết nối khi component bị unmount
    };
  }, [connect, disconnect]);

  return (
    <View>
      <Text>
        WebSocket Status: {isConnected ? "Connected" : "Disconnected"}
      </Text>
      <Button
        title={isConnected ? "Disconnect" : "Connect"}
        onPress={() => (isConnected ? disconnect() : connect())}
      />
    </View>
  );
};

export default WebSocketStatus;
