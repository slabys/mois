import { RolePermissionsItem, UserRole } from "@/utils/api.schemas";

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
