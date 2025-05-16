import * as Notifications from "expo-notifications";

// utils/notificationService.ts
export const sendLocalNotification = async ({
  title,
  body,
}: {
  title: string;
  body: string;
}) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: "default",
    },
    trigger: null,
  });
};
