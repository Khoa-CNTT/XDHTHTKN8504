// utils/api.ts
import axios from "axios";

const API = axios.create({
  baseURL: "http://192.168.81.102:5000/api/v1/", // đổi thành IP máy chủ thật khi deploy
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
