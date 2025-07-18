import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import { useStorage } from "./useStorage";
import {
  NotificationType,
  ScheduleNotificationParams,
  StoredNotification,
} from "../models";

export const useNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  const { setValue, value: storedNotifications } = useStorage<
    StoredNotification[]
  >("notifications", []);

  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification:
        async (): Promise<Notifications.NotificationBehavior> => ({
          shouldShowBanner: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
          shouldShowList: true,
        }),
      handleError: (error) => {
        console.log("❌ Notification handler error:", error);
      },
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener(
        (notification: Notifications.Notification) => {
          const { request } = notification;
          const newNotification: StoredNotification = {
            id: request.identifier,
            title: request.content.title,
            body: request.content.body,
            data: request.content.data as Record<string, any>,
            date: new Date().toISOString(),
            type: request.content.data.type as NotificationType,
            isRead: false,
          };

          setValue((prev) => [newNotification, ...(prev || [])]);
        }
      );

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(
        (response: Notifications.NotificationResponse) => {
          console.log("👉 User tapped notification:", response);
        }
      );

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [setValue]);

  const requestPermission = async (): Promise<boolean> => {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
      });
      finalStatus = status;
    }

    const granted = finalStatus === "granted";
    setHasPermission(granted);

    if (granted) {
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
        });
      }
      const tokenData = await Notifications.getExpoPushTokenAsync();
      setExpoPushToken(tokenData.data);
    } else {
      setExpoPushToken(null);
    }

    return granted;
  };

  const scheduleNotification = async ({
    title,
    body,
    data,
    trigger = null,
  }: ScheduleNotificationParams): Promise<void> => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data ?? {},
      },
      trigger,
    });
  };

  const getUnreadNotifications = async (): Promise<StoredNotification[]> => {
    return storedNotifications || [];
  };

  const clearNotifications = async (): Promise<void> => {
    setValue([]);
  };

  return {
    expoPushToken,
    hasPermission,
    requestPermission,
    scheduleNotification,
    getUnreadNotifications,
    clearNotifications,
  };
};
