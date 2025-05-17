import { create } from "zustand";
import { Vibration } from "react-native";
import { playNotificationSound } from "../utils/soundService";
import { sendLocalNotification } from "../utils/notificationService";

interface ModalState {
  visible: boolean;
  title?: string;
  message?: string;
  autoHideDuration?: number;
  onDetailPress?: () => void;
  onConfirm?: () => void;
  type?: "popup" | "dialog";

  showModal: (
    title: string,
    message: string,
    options?: {
      type?: "popup" | "dialog";
      autoHideDuration?: number;
      onDetailPress?: () => void;
      onConfirm?: () => void;
      playSound?: boolean;
      vibrate?: boolean;
      notify?: boolean;
    }
  ) => void;

  hideModal: () => void;
}

export const useModalStore = create<ModalState>((set) => {
  const resetModal = () =>
    set({
      visible: false,
      title: "",
      message: "",
      autoHideDuration: undefined,
      onDetailPress: undefined,
      onConfirm: undefined,
      type: "popup",
    });

  return {
    visible: false,
    title: "",
    message: "",
    autoHideDuration: undefined,
    onDetailPress: undefined,
    onConfirm: undefined,
    type: "popup",

    showModal: async (title, message, options) => {
      const {
        type = "popup",
        autoHideDuration,
        onDetailPress,
        onConfirm,
        playSound = true,
        vibrate = true,
        notify = true,
      } = options || {};

      if (vibrate) Vibration.vibrate(300);
      if (playSound) await playNotificationSound(type);
      if (notify) await sendLocalNotification({ title, body: message });

      set({
        visible: true,
        title,
        message,
        autoHideDuration,
        onDetailPress,
        onConfirm,
        type,
      });

      if (autoHideDuration) {
        setTimeout(() => {
          resetModal();
        }, autoHideDuration);
      }
    },

    hideModal: resetModal,
  };
});
