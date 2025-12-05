import axiosInstance from "@/lib/axios-instance";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface UserMeResponse {
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
}

/**
 * Login user with email and password.
 *
 * @param credentials - User email and password
 * @returns Login response with access token
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const formData = new URLSearchParams();
  formData.append("username", credentials.email);
  formData.append("password", credentials.password);

  const response = await axiosInstance.post<LoginResponse>(
    "/api/auth/login",
    formData,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data;
}

/**
 * Get current authenticated user information.
 *
 * @param accessToken - JWT access token
 * @returns Current user information
 */
export async function getCurrentUser(
  accessToken: string
): Promise<UserMeResponse> {
  const response = await axiosInstance.get<UserMeResponse>("/api/auth/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
}
