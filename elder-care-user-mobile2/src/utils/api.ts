import axios from "axios";
import Constants from "expo-constants";

const extra = Constants.expoConfig?.extra ?? Constants.manifest2?.extra;
const apiBaseUrl = extra?.apiBaseUrl;

console.log("👉 API BASE URL:", apiBaseUrl);

const API = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;