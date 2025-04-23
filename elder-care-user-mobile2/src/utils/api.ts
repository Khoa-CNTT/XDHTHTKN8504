import axios from "axios";
import Constants from "expo-constants";

const apiBaseUrl = Constants.expoConfig?.extra?.API_URL;
console.log("👉 API BASE URL:", apiBaseUrl);

const API = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
