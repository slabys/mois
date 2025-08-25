"use server";

import webpush from "web-push";

webpush.setVapidDetails(
  process.env.NEXT_PUBLIC_WEB_DOMAIN!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

let subscription: PushSubscription | null = null;

export const subscribeUser = async (sub: PushSubscription) => {
  subscription = sub;
  // In a production environment, you would want to store the subscription in a database
  // For example: await db.subscriptions.create({ data: sub })
  return { success: true };
};

export const unsubscribeUser = async () => {
  subscription = null;
  // In a production environment, you would want to remove the subscription from the database
  // For example: await db.subscriptions.delete({ where: { ... } })
  return { success: true };
};

export const sendNotification = async (message: string = "Hello World!") => {
  if (!subscription) {
    throw new Error("No subscription available");
  }

  try {
    await webpush.sendNotification(
      // @ts-ignore
      subscription,
      JSON.stringify({
        title: "Test Notification",
        body: message,
        icon: "/icon.svg",
      }),
    );
    return { success: true };
  } catch (error) {
    console.error("Error sending push notification:", error);
    return { success: false, error: "Failed to send notification" };
  }
};
