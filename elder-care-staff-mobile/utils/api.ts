// utils/api.ts
import axios from "axios";

const API = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL, // đổi thành IP máy chủ thật khi deploy
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
