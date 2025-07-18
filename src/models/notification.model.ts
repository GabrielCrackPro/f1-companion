import * as Notifications from "expo-notifications";

export type StoredNotification = {
  id: string;
  title: string | null;
  body: string | null;
  data?: Record<string, any>;
  date: string;
  isRead: boolean;
  type: NotificationType;
};

export type ScheduleNotificationParams = {
  title: string;
  body: string;
  data?: Record<string, any>;
  trigger?: Notifications.NotificationTriggerInput | null;
};

export enum NotificationType {
  RACE = "race",
  DRIVER = "driver",
  NOTIFICATION = "notification",
}
