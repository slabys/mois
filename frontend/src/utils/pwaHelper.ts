import { sendNotification, subscribeUser, unsubscribeUser } from "@/app/actions";

export const urlBase64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export const checkSupported = () => {
  if (!("serviceWorker" in navigator)) {
    console.error("Service worker not supported!");
    return false;
  }
  if (!("Notification" in window)) {
    console.error("Notification API not supported!");
    return false;
  }
  return true;
};

export const registerServiceWorker = async () => {
  const registration = await navigator.serviceWorker.register("/sw.js", {
    scope: "/",
    updateViaCache: "none",
  });
  return await registration.pushManager.getSubscription();
};

export const subscribeToPush = async () => {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
  });
  const serializedSub = JSON.parse(JSON.stringify(subscription));
  await subscribeUser(serializedSub);
  return subscription;
};

export const unsubscribeFromPush = async (subscription: PushSubscription) => {
  await subscription?.unsubscribe();
  await unsubscribeUser();
};

export const sendTestNotification = async (subscription: PushSubscription, message: string) => {
  if (subscription) {
    await sendNotification(message);
  }
};
