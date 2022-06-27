import { Notifications } from '~enums/notifications.enum';

export interface NotificationData {
  message: string;
  title: string;
  type: Notifications;
}
