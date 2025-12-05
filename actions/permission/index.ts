import axiosInstance from "@/lib/axios-instance";

export interface Module {
  id: number;
  name: string;
  code: string;
  description: string | null;
  parent_module_id: number | null;
  is_active: boolean;
}

export interface Permission {
  id: number;
  module_id: number;
  module_code: string;
  module_name: string;
  can_read: boolean;
  can_write: boolean;
}

export interface UpdatePermissionRequest {
  module_id: number;
  can_read: boolean;
  can_write: boolean;
}

export interface UpdatePermissionsRequest {
  permissions: UpdatePermissionRequest[];
}

/**
 * Get all available modules.
 */
export async function getModules(accessToken: string): Promise<Module[]> {
  const response = await axiosInstance.get<{ data: { modules: Module[] } }>(
    '/api/permissions/modules',
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  return response.data.data.modules;
}

/**
 * Get all permissions for a user.
 */
export async function getUserPermissions(
  accessToken: string,
  userId: number
): Promise<Permission[]> {
  const response = await axiosInstance.get<{ data: { permissions: Permission[] } }>(
    `/api/permissions/users/${userId}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  return response.data.data.permissions;
}

/**
 * Update permissions for a user.
 */
export async function updateUserPermissions(
  accessToken: string,
  userId: number,
  permissions: UpdatePermissionRequest[]
): Promise<Permission[]> {
  const response = await axiosInstance.put<{ data: { permissions: Permission[] } }>(
    `/api/permissions/users/${userId}`,
    { permissions },
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  return response.data.data.permissions;
}

