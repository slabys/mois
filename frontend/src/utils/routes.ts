export const routes = {
  // Initial setup
  INIT: "/initialize",
  // --- Unauthorized ---
  // Any unauthorized routes need to be added to CustomHooksLoader and middleware.ts
  LOGIN: "/login",
  REGISTER: "/registration",
  LOGOUT: "/api/auth/logout",

  // --- Authorized ---
  DASHBOARD: "/",
  MANAGE_EVENTS: "/manage-events",
  MANAGE_PEOPLE: "/manage-people",
  MANAGE_ORGANIZATIONS: "/manage-organizations",
  SENT_APPLICATIONS: "/sent-applications",
  ACCOUNT: "/account",

  // Events
  EVENT_DETAIL: (props: { id: number }) => `/event/${props.id}`,
  EVENT_MANAGE: (props: { id: number }) => `/event/manage/${props.id}`,

  // Organization
  ORGANIZATION_MEMBERS: (props: { id: string }) => `/organization-members/${props.id}`,

  // Footer
  PRIVACY_POLICY: "/privacy-policy",
  TERMS_AND_CONDITIONS: "/terms-and-conditions",
};

export default routes;
