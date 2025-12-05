import axiosInstance from "@/lib/axios-instance";

export interface User {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role_id: number;
  role_name: string | null;
  role_level: number | null;
  organization_id: number | null;
  location_id: number | null;
  is_active: boolean;
  created_by_user_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  role_id: number;
  organization_id?: number;
  location_id?: number;
}

export interface UpdateUserRequest {
  email?: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  role_id?: number;
  organization_id?: number;
  location_id?: number;
  is_active?: boolean;
}

export interface UserListResponse {
  users: User[];
  total: number;
}

/**
 * Get list of users with optional filters.
 */
export async function getUsers(
  accessToken: string,
  params?: {
    organization_id?: number;
    location_id?: number;
    role_id?: number;
    skip?: number;
    limit?: number;
  }
): Promise<UserListResponse> {
  const response = await axiosInstance.get<{ data: UserListResponse }>(
    '/api/users',
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      params,
    }
  );

  return response.data.data;
}

/**
 * Get a specific user by ID.
 */
export async function getUser(accessToken: string, userId: number): Promise<User> {
  const response = await axiosInstance.get<{ data: User }>(
    `/api/users/${userId}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  return response.data.data;
}

/**
 * Create a new user.
 */
export async function createUser(
  accessToken: string,
  userData: CreateUserRequest
): Promise<User> {
  const response = await axiosInstance.post<{ data: User }>(
    '/api/users',
    userData,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  return response.data.data;
}

/**
 * Update a user.
 */
export async function updateUser(
  accessToken: string,
  userId: number,
  userData: UpdateUserRequest
): Promise<User> {
  const response = await axiosInstance.put<{ data: User }>(
    `/api/users/${userId}`,
    userData,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  return response.data.data;
}

/**
 * Activate or deactivate a user.
 */
export async function activateUser(
  accessToken: string,
  userId: number,
  isActive: boolean
): Promise<User> {
  const response = await axiosInstance.patch<{ data: User }>(
    `/api/users/${userId}/activate`,
    null,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      params: {
        is_active: isActive,
      },
    }
  );

  return response.data.data;
}

