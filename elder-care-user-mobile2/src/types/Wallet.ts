// types/wallet.ts

export type Transaction = {
  transactionId?: string;
  type: "TOP_UP" | "PAYMENT" | "REFUND";
  amount: number;
  date: string; // ISO string
  status: "pending" | "success" | "failed";
  description?: string;
};

export interface Wallet {
  _id?: string; // nếu bạn làm việc với MongoDB document
  userId: string; // hoặc mongoose.Types.ObjectId nếu dùng backend
  balance: number;
  transactions: Transaction[];
  createdAt?: Date;
  updatedAt?: Date;
}
