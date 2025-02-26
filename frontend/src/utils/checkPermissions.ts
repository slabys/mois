import { Role, RolePermissionsItem } from "@/utils/api.schemas";

export const hasEveryPermissions = (role: Role, requiredPermissions: RolePermissionsItem[] | null): boolean => {
  if (requiredPermissions === null) return true;
  if (!role) return false;
  if (role.id === 1 && role.name === "Admin") return true;
  return requiredPermissions.every((permission) => role.permissions.includes(permission));
};

export const hasSomePermissions = (role: Role, requiredPermissions: RolePermissionsItem[] | null): boolean => {
  if (requiredPermissions === null) return true;
  if (!role) return false;
  if (role.id === 1 && role.name === "Admin") return true;
  return requiredPermissions.some((permission) => role.permissions.includes(permission));
};
