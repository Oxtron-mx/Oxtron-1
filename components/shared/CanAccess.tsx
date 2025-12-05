"use client";

import { ReactNode } from "react";
import { useHasReadPermission, useHasWritePermission } from "@/hooks/auth/usePermissions";

interface CanAccessProps {
  moduleCode: string;
  action?: "read" | "write";
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Component to conditionally render children based on user permissions.
 * 
 * @param moduleCode - Module code to check permissions for
 * @param action - Action to check ("read" or "write"), defaults to "read"
 * @param children - Content to render if user has permission
 * @param fallback - Content to render if user doesn't have permission (optional)
 */
export default function CanAccess({
  moduleCode,
  action = "read",
  children,
  fallback = null,
}: CanAccessProps) {
  const hasRead = useHasReadPermission(moduleCode);
  const hasWrite = useHasWritePermission(moduleCode);
  
  const hasPermission = action === "read" ? hasRead : hasWrite;
  
  if (hasPermission) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
}

