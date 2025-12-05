"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useHasReadPermission } from "@/hooks/auth/usePermissions";

interface ProtectedRouteProps {
  moduleCode: string;
  children: ReactNode;
  redirectTo?: string;
}

/**
 * Component to protect routes based on user permissions.
 * 
 * Redirects to login or specified route if user doesn't have required permission.
 * 
 * @param moduleCode - Module code to check permissions for
 * @param children - Content to render if user has permission
 * @param redirectTo - Route to redirect to if no permission (defaults to login)
 */
export default function ProtectedRoute({
  moduleCode,
  children,
  redirectTo,
}: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const hasPermission = useHasReadPermission(moduleCode);
  
  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push(redirectTo || "/");
      return;
    }
    
    if (!hasPermission) {
      router.push(redirectTo || "/no-access");
      return;
    }
  }, [session, status, hasPermission, router, redirectTo]);
  
  if (status === "loading") {
    return <div>Loading...</div>;
  }
  
  if (!session || !hasPermission) {
    return null;
  }
  
  return <>{children}</>;
}

