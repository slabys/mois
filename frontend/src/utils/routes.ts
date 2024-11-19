export const routes = {
  // --- Unauthorized ---
  // Any unauthorized routes need to be added to CustomHooksLoader and middleware.ts
  LOGIN: "/login",
  REGISTRATION: "/registration",

  // --- Authorized ---
  DASHBOARD: "/",
  EVENT_DETAIL: (props: { id: number }) => `/event/${props.id}`,
};

export default routes;
