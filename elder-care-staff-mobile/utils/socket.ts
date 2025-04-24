import { io } from "socket.io-client";
import Constants from "expo-constants";

const socketBaseUrl = Constants.expoConfig?.extra?.socketBaseUrl;
console.log("SOCKET URL:", socketBaseUrl);

if (!socketBaseUrl) {
  console.error("Socket URL chưa được cấu hình!");
}

const socket = io("http://192.168.81.102:5000", {
  transports: ["websocket"],
  autoConnect: false,
});

export default socket;
