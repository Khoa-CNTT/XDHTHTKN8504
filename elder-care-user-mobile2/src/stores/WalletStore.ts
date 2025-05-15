import { create } from "zustand";
import type { Wallet, Transaction } from "../types/Wallet";
import { getWallet } from "../api/WalletService"; // <--- dùng lại hàm đã có
import { log } from "../utils/logger";

interface WalletState {
  wallet: Wallet | null;
  setWallet: (wallet: Wallet) => void;
  updateBalance: (delta: number) => void;
  addTransaction: (transaction: Transaction) => void;
  fetchWallet: () => Promise<void>;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  wallet: null,

  setWallet: (wallet) => set({ wallet }),

  updateBalance: (delta) => {
    const { wallet } = get();
    if (!wallet) return;
    set({
      wallet: {
        ...wallet,
        balance: wallet.balance + delta,
      },
    });
  },

  addTransaction: (transaction) => {
    const { wallet } = get();
    if (!wallet) return;
    set({
      wallet: {
        ...wallet,
        transactions: [...wallet.transactions, transaction],
      },
    });
  },

  fetchWallet: async () => {
    try {
      const wallet = await getWallet();
      set({ wallet });
    } catch (error) {
      console.error("Failed to fetch wallet:", error);
      throw error;
    }
  },
}));
