import { Role } from "@/utils/api.schemas";

const formatPermission = (permission: string): string => {
  return permission
    .split(".")[1] // Take the second part (action)
    .replace(/([A-Z])/g, " $1") // Add space before uppercase letters (CamelCase support)
    .replace(/^\w/, (c) => c.toUpperCase()); // Capitalize first letter
};

export const groupPermissions = (role: Role) => {
  const groupedPermissions: Record<string, string[]> = {};

  role.permissions.forEach((permission) => {
    const [category, _] = permission.split(".");

    if (!groupedPermissions[category]) {
      groupedPermissions[category] = [];
    }

    groupedPermissions[category].push(formatPermission(permission));
  });

  return Object.entries(groupedPermissions).map(([name, permissionList]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize category name
    permissionList,
  }));
};
