"use client";

import InstallPrompt from "@components/PWA/InstallPrompt";
import PushNotificationManager from "@components/PWA/PushNotificationManager";

const TestPage = () => {
  return (
    <div>
      <h1>Welcome to the App</h1>
      {/* Rest of your component */}
      <PushNotificationManager />
      <InstallPrompt />
    </div>
  );
};

export default TestPage;
