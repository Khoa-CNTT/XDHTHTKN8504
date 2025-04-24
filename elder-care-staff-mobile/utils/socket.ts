// src/services/socket.js
import { io } from "socket.io-client";
import Constants from "expo-constants";

const socketBaseUrl = Constants.expoConfig?.extra?.socketBaseUrl; 
console.log("👉 API BASE URL:", socketBaseUrl); 
const socket = io(socketBaseUrl, {
  transports: ["websocket"],
  autoConnect: false,
});

export default socket;
