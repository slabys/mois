export const routes = {
  // --- Unauthorized ---
  // Any unauthorized routes need to be added to CustomHooksLoader and middleware.ts
  LOGIN: "/login",
  REGISTER: "/registration",
  LOGOUT: "/api/auth/logout",

  // --- Authorized ---
  DASHBOARD: "/",
  MANAGE_EVENTS: "/manage-events",
  SENT_APPLICATIONS: "/sent-applications",
  ACCOUNT: "/account",
  EVENT_DETAIL: (props: { id: number }) => `/event/${props.id}`,

  // Footer
  PRIVACY_POLICY: "/privacy-policy",
  TERMS_AND_CONDITIONS: "/terms-and-conditions",
};

export default routes;
