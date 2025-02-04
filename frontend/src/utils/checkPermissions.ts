import { Role, RolePermissionsItem } from "@/utils/api.schemas";

export const hasEveryPermissions = (role: Role, requiredPermissions: RolePermissionsItem[] | null): boolean => {
  if (requiredPermissions === null) return true;
  if (role === null) return false;
  return requiredPermissions.every((permission) => role.permissions.includes(permission));
};

export const hasSomePermissions = (role: Role, requiredPermissions: RolePermissionsItem[] | null): boolean => {
  if (requiredPermissions === null) return true;
  if (role === null) return false;
  return requiredPermissions.some((permission) => role.permissions.includes(permission));
};
