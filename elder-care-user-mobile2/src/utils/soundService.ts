// services/soundService.ts
import { Audio } from "expo-av";

let sounds: Record<string, Audio.Sound | null> = {
  popup: null,
  dialog: null,
};

export const loadAllSounds = async () => {
  if (!sounds.popup) {
    const { sound } = await Audio.Sound.createAsync(
      require("../asset/audio/popup.wav")
    );
    sounds.popup = sound;
  }

  if (!sounds.dialog) {
    const { sound } = await Audio.Sound.createAsync(
      require("../asset/audio/notifi1.wav")
    );
    sounds.dialog = sound;
  }
};

export const playNotificationSound = async (
  type: "popup" | "dialog" = "popup"
) => {
  try {
    await loadAllSounds(); // Đảm bảo đã load
    if (type === "popup" && sounds.popup) {
      await sounds.popup.replayAsync();
    } else if (type === "dialog" && sounds.dialog) {
      await sounds.dialog.replayAsync();
    }
  } catch (err) {
    console.warn("Lỗi phát âm thanh:", err);
  }
};
