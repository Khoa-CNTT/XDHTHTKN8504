// stores/modalStore.ts
import { create } from "zustand";

interface ModalState {
  visible: boolean;
  title?: string;
  message?: string;
  showModal: (title: string, message: string) => void;
  hideModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  visible: false,
  title: "",
  message: "",
  showModal: (title, message) => set({ visible: true, title, message }),
  hideModal: () => set({ visible: false, title: "", message: "" }),
}));
