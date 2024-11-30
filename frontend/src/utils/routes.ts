export const routes = {
  // --- Unauthorized ---
  // Any unauthorized routes need to be added to CustomHooksLoader and middleware.ts
  LOGIN: "/login",
  REGISTER: "/registration",
  LOGOUT: "/api/auth/logout",

  // --- Authorized ---
  DASHBOARD: "/",
  MANAGE_EVENTS: "/events",
  SENT_APPLICATIONS: "/sent-applications",
  ACCOUNT: "/account",
  EVENT_DETAIL: (props: { id: number }) => `/event/${props.id}`,
};

export default routes;
