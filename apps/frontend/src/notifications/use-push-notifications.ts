import {
  requestNotificationPermission,
  showPushNotification,
  type PushNotificationOptions,
} from './notification-service';

export function usePushNotifications() {
  const permission =
    typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'unsupported';

  const requestPermission = async () => requestNotificationPermission();

  const notify = async (options: PushNotificationOptions) => {
    const result = await requestNotificationPermission();
    if (result !== 'granted') {
      return false;
    }

    return showPushNotification(options);
  };

  return {
    permission,
    requestPermission,
    notify,
  };
}
