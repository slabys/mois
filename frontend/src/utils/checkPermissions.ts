import { OrganizationMemberWithoutUser, RolePermissionsItem, User, UserRole } from "@/utils/api.schemas";

export const hasEveryPermissions = (role: UserRole, requiredPermissions: RolePermissionsItem[] | null): boolean => {
  if (requiredPermissions === null) return true;
  if (!role) return false;
  if (role.id === 1 && role.name.toLowerCase() === "admin") return true;
  return requiredPermissions.every((permission) => role.permissions.includes(permission));
};

export const hasSomePermissions = (role: UserRole, requiredPermissions: RolePermissionsItem[] | null): boolean => {
  if (requiredPermissions === null) return true;
  if (!role) return false;
  if (role.id === 1 && role.name.toLowerCase() === "admin") return true;
  return requiredPermissions.some((permission) => role.permissions.includes(permission));
};

export const isManager = (
  user: User | undefined,
  userOrganisationMemberships: OrganizationMemberWithoutUser[] | undefined,
): boolean => {
  const isManager = userOrganisationMemberships?.some((f) => f.organization.manager?.id === user?.id);
  if (!user) return false;
  if (user.role?.id === 1 && user.role?.name.toLowerCase() === "admin") return true;
  return !!isManager;
};
