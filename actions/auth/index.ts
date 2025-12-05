"use server";

import axiosInstance from "@/lib/axios-instance";
import { signIn, signOut } from "@/auth";

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
 * Login user with email and password using NextAuth signIn.
 * 
 * @param credentials - User email and password
 * @returns true if login successful, false otherwise
 */
export async function login(credentials: LoginRequest): Promise<boolean> {
  try {
    const result = await signIn("credentials", {
      email: credentials.email,
      password: credentials.password,
      redirect: false,
    });

    return result?.ok ?? false;
  } catch (error) {
    console.error("Error in login:", error);
    return false;
  }
}

/**
 * Logout user by signing out from NextAuth.
 */
export async function logout(): Promise<void> {
  await signOut({ redirect: true, redirectTo: "/" });
}

/**
 * Get current authenticated user information.
 * 
 * @param accessToken - JWT access token
 * @returns Current user information
 */
export async function getCurrentUser(accessToken: string): Promise<UserMeResponse> {
  const response = await axiosInstance.get<UserMeResponse>(
    '/api/auth/me',
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
}
