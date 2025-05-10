import { create } from "zustand";
import { Vibration } from "react-native";
import { playNotificationSound } from "../utils/soundService";

interface ModalState {
  visible: boolean;
  title?: string;
  message?: string;
  autoHideDuration?: number;
  onDetailPress?: () => void;
  type?: "popup" | "dialog"; // Kiểu modal: popup hoặc dialog

  showModal: (
    title: string,
    message: string,
    options?: {
      type?: "popup" | "dialog"; // Xác định kiểu modal
      autoHideDuration?: number;
      onDetailPress?: () => void;
    }
  ) => void;

  hideModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  visible: false,
  title: "",
  message: "",
  autoHideDuration: undefined,
  onDetailPress: undefined,
  type: "popup", // Mặc định là popup

  showModal: async (title, message, options) => {
    // Rung nhẹ 300ms
    Vibration.vibrate(300);

    // Phát âm thanh thông báo
    await playNotificationSound(options?.type ?? "popup");  

    set({
      visible: true,
      title,
      message,
      autoHideDuration: options?.autoHideDuration,
      onDetailPress: options?.onDetailPress ?? undefined,
      type: options?.type ?? "popup", // Xác định kiểu modal
    });

    // Tự động ẩn sau thời gian nếu có
    if (options?.autoHideDuration) {
      setTimeout(() => {
        set({
          visible: false,
          title: "",
          message: "",
          autoHideDuration: undefined,
          onDetailPress: undefined,
          type: "popup", // Đảm bảo khi ẩn modal, kiểu mặc định là popup
        });
      }, options.autoHideDuration);
    }
  },

  hideModal: () => {
    set({
      visible: false,
      title: "",
      message: "",
      autoHideDuration: undefined,
      onDetailPress: undefined,
      type: "popup", // Đảm bảo khi ẩn modal, kiểu mặc định là popup
    });
  },
}));
