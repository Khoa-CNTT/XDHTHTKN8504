import { io } from "socket.io-client";
import Constants from "expo-constants";

const socketBaseUrl = Constants.expoConfig?.extra?.socketBaseUrl;
console.log("SOCKET URL:", socketBaseUrl);

if (!socketBaseUrl) {
  console.error("Socket URL chưa được cấu hình!");
}

const socket = io(socketBaseUrl, {
  transports: ["websocket"],
  path: "/socket.io",
  autoConnect: false,
  query: { debug: true },
});

export default socket;
