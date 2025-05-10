import { create } from "zustand";
import { Vibration } from "react-native";
import { playNotificationSound } from "../utils/soundService";

interface ModalState {
  visible: boolean;
  title?: string;
  message?: string;
  autoHideDuration?: number;
  onDetailPress?: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  type?: "popup" | "dialog";

  showModal: (
    title: string,
    message: string,
    options?: {
      type?: "popup" | "dialog";
      autoHideDuration?: number;
      onDetailPress?: () => void;
      onConfirm?: () => void;
      onCancel?: () => void;
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
  onConfirm: undefined,
  onCancel: undefined,
  type: "popup",

  showModal: async (title, message, options) => {
    Vibration.vibrate(300);
    await playNotificationSound(options?.type ?? "popup");

    set({
      visible: true,
      title,
      message,
      autoHideDuration: options?.autoHideDuration,
      onDetailPress: options?.onDetailPress,
      onConfirm: options?.onConfirm,
      onCancel: options?.onCancel,
      type: options?.type ?? "popup",
    });

    if (options?.autoHideDuration) {
      setTimeout(() => {
        set({
          visible: false,
          title: "",
          message: "",
          autoHideDuration: undefined,
          onDetailPress: undefined,
          onConfirm: undefined,
          onCancel: undefined,
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
      onConfirm: undefined,
      onCancel: undefined,
      type: "popup",
    });
  },
}));
