export type PushNotificationOptions = {
  title: string;
  body: string;
  tag?: string;
  data?: Record<string, string | number | boolean | undefined>;
  requireInteraction?: boolean;
};

const isNotificationSupported = () =>
  typeof window !== 'undefined' && 'Notification' in window;

export async function requestNotificationPermission(): Promise<
  NotificationPermission | 'unsupported'
> {
  if (!isNotificationSupported()) {
    return 'unsupported';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission === 'denied') {
    return 'denied';
  }

  return Notification.requestPermission();
}

export async function showPushNotification(
  options: PushNotificationOptions,
): Promise<boolean> {
  if (!isNotificationSupported()) {
    return false;
  }

  if (Notification.permission !== 'granted') {
    return false;
  }

  const notificationOptions = {
    body: options.body,
    tag: options.tag ?? 'athlink',
    requireInteraction: options.requireInteraction ?? true,
    data: options.data ?? { url: '/requests' },
  };

  try {
    if ('serviceWorker' in navigator && navigator.serviceWorker?.controller) {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(options.title, notificationOptions);
      return true;
    }

    const notification = new Notification(options.title, notificationOptions);
    return notification instanceof Notification;
  } catch {
    return false;
  }
}
