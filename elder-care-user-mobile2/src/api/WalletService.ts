// services/walletService.js
import API from "../utils/api";
import useAuthStore from "../stores/authStore";
import {log} from "../utils/logger"
import { Transaction, Wallet } from "../types/Wallet";

export const getWallet = async (): Promise<Wallet> => {
  const token = useAuthStore.getState().token;
  try {
    const response = await API.get(`/wallet`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.wallet;
  } catch (error) {
    log("from api wallet:", error.response?.data || error.message);
    throw error;
  }
};

export const getTransactions= async (): Promise<Transaction[]> => {
  const token = useAuthStore.getState().token;
  try {
    const response = await API.get(`/wallet`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    log("from transaction api", response.data);
    return response.data.transactions;
  } catch (error) {
    log("from api wallet:", error.response?.data || error.message);
    throw error;
  }
};

export const makePayment = async (
  amount: string,
  description: string
)=> {
  try {
    const token = useAuthStore.getState().token;
    const { data } = await API.post(
      `wallet/pay`,
      { amount, description },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
        },
      }
    );

    if (!data || !data.schedule) {
      throw new Error("Dữ liệu trả về không hợp lệ");
    }

    return data.data;
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Đã có lỗi xảy ra khi cập nhật trạng thái schedule"
    );
  }
};


export const callMomoTopup = async (amount) => {
  const token = useAuthStore.getState().token;
  try {
    const response = await API.post(
      `/wallet/topup`,
      { amount },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    log("test momo", response.data)
    return response.data;
  } catch (error) {
    log("TopUp API Error:", error.response?.data || error.message);
    throw error;
  }
};
