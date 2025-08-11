export const routes = {
  // Initial setup
  INIT: "/initialise",
  // --- Unauthorized ---
  // Any unauthorized routes need to be added to CustomHooksLoader and middleware.ts
  LOGIN: "/login",
  REGISTER: "/registration",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/forgot-password/reset",
  VERIFY: "/verify",
  LOGOUT: "/api/auth/logout",

  // --- Authorized ---
  DASHBOARD: "/",
  SENT_APPLICATIONS: "/sent-applications",
  ACCOUNT: "/account",
  MY_ORGANISATION: `/my-organisation`,
  MANAGE_ORGANISATION_DETAIL: (props: { id: string }) => `/my-organisation/${props.id}`,
  // --- Management ---
  MANAGE_EVENTS: "/manage-events",
  MANAGE_PEOPLE: "/manage-people",
  MANAGE_ORGANISATIONS: "/manage-organisations",

  // Events
  EVENT_DETAIL: (props: { id: number }) => `/event/${props.id}`,
  EVENT_MANAGE: (props: { id: number }) => `/event/manage/${props.id}`,

  // Organization
  ORGANISATION_MEMBERS: (props: { id: string }) => `/organisation-members/${props.id}`,

  // Footer
  PRIVACY_POLICY: "/privacy-policy",
  TERMS_AND_CONDITIONS: "/terms-and-conditions",
};

export default routes;
