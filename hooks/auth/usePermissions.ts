import { useSession } from "next-auth/react";

export interface Permissions {
  [moduleCode: string]: {
    read: boolean;
    write: boolean;
  };
}

/**
 * Hook to get current user permissions from session.
 * 
 * @returns Permissions object or null if not authenticated
 */
export function usePermissions(): Permissions | null {
  const { data: session } = useSession();
  
  if (!session || !(session as any).permissions) {
    return null;
  }
  
  return (session as any).permissions as Permissions;
}

/**
 * Check if user has read permission for a module.
 * 
 * @param permissions - Permissions object
 * @param moduleCode - Module code (e.g., "dashboard", "measure.facilities")
 * @returns True if user has read permission
 */
export function hasReadPermission(
  permissions: Permissions | null,
  moduleCode: string
): boolean {
  if (!permissions) return false;
  
  // Check direct permission
  const modulePerm = permissions[moduleCode];
  if (modulePerm?.read) return true;
  
  // Check parent module permission (e.g., "measure" for "measure.facilities")
  if (moduleCode.includes(".")) {
    const parentCode = moduleCode.split(".")[0];
    const parentPerm = permissions[parentCode];
    if (parentPerm?.read) return true;
  }
  
  return false;
}

/**
 * Check if user has write permission for a module.
 * 
 * @param permissions - Permissions object
 * @param moduleCode - Module code (e.g., "dashboard", "measure.facilities")
 * @returns True if user has write permission
 */
export function hasWritePermission(
  permissions: Permissions | null,
  moduleCode: string
): boolean {
  if (!permissions) return false;
  
  // Check direct permission
  const modulePerm = permissions[moduleCode];
  if (modulePerm?.write) return true;
  
  // Check parent module permission
  if (moduleCode.includes(".")) {
    const parentCode = moduleCode.split(".")[0];
    const parentPerm = permissions[parentCode];
    if (parentPerm?.write) return true;
  }
  
  return false;
}

/**
 * Hook to check if user has read permission for a module.
 */
export function useHasReadPermission(moduleCode: string): boolean {
  const permissions = usePermissions();
  return hasReadPermission(permissions, moduleCode);
}

/**
 * Hook to check if user has write permission for a module.
 */
export function useHasWritePermission(moduleCode: string): boolean {
  const permissions = usePermissions();
  return hasWritePermission(permissions, moduleCode);
}

