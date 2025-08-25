import { sendNotification, subscribeUser } from "@/app/actions";
import { checkSupported, registerServiceWorker, unsubscribeFromPush, urlBase64ToUint8Array } from "@/utils/pwaHelper";
import { useEffect, useState } from "react";

const PushNotificationManager = () => {
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  useEffect(() => {
    const permission = checkSupported();
    if (permission) {
      registerServiceWorker();
    }
  }, []);

  async function subscribe() {
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
    });
    setSubscription(sub);
    const serializedSub = JSON.parse(JSON.stringify(sub));
    await subscribeUser(serializedSub);
  }

  const unsubscribe = async () => {
    if (!subscription) return;
    await unsubscribeFromPush(subscription);
    setSubscription(null);
  };

  async function sendTestNotification() {
    if (subscription) {
      await sendNotification();
    }
  }

  return (
    <div>
      <h3>Push Notifications</h3>
      {subscription ? (
        <>
          <p>You are subscribed to push notifications.</p>
          <button onClick={unsubscribe}>Unsubscribe</button>
          <button onClick={sendTestNotification}>Send Test</button>
        </>
      ) : (
        <>
          <p>You are not subscribed to push notifications.</p>
          <button onClick={subscribe}>Subscribe</button>
        </>
      )}
    </div>
  );
};

export default PushNotificationManager;
