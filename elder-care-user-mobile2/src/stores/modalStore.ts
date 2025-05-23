import { create } from "zustand";
import { Vibration } from "react-native";
import { playNotificationSound } from "../utils/soundService";
// import { sendLocalNotification } from "../utils/notificationService";

interface ModalState {
  visible: boolean;
  title?: string;
  message?: string;
  autoHideDuration?: number;
  onDetailPress?: () => void;
  type?: "popup" | "dialog";

  showModal: (
    title: string,
    message: string,
    options?: {
      type?: "popup" | "dialog";
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
  type: "popup",

  showModal: async (title, message, options) => {
    const type = options?.type ?? "popup";

    // 1. Rung thiết bị
    Vibration.vibrate(300);

    // 2. Phát âm thanh thông báo
    await playNotificationSound(type);

    // 3. Gửi local notification của hệ thống
    // await sendLocalNotification(
    //   title,
    //   message,
    // );

    // 4. Hiển thị modal
    set({
      visible: true,
      title,
      message,
      autoHideDuration: options?.autoHideDuration,
      onDetailPress: options?.onDetailPress,
      type,
    });

    // 5. Tự động ẩn nếu có autoHideDuration
    if (options?.autoHideDuration) {
      setTimeout(() => {
        set({
          visible: false,
          title: "",
          message: "",
          autoHideDuration: undefined,
          onDetailPress: undefined,
          type: "popup",
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
      type: "popup",
    });
  },
}));
