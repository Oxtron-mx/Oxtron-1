import { useSession } from "next-auth/react";

export interface CurrentUser {
  id: string;
  email: string;
  roleId: number;
  roleName: string | null;
  roleLevel: number | null;
  organizationId: number | null;
  locationId: number | null;
  permissions: Record<string, { read: boolean; write: boolean }>;
}

/**
 * Hook to get current user information from session.
 * 
 * @returns Current user object or null if not authenticated
 */
export function useCurrentUser(): CurrentUser | null {
  const { data: session } = useSession();
  
  if (!session?.user) {
    return null;
  }
  
  return {
    id: session.user.id,
    email: session.user.email || "",
    roleId: (session as any).roleId || 0,
    roleName: (session as any).roleName || null,
    roleLevel: (session as any).roleLevel || null,
    organizationId: (session as any).organizationId || null,
    locationId: (session as any).locationId || null,
    permissions: (session as any).permissions || {},
  };
}

