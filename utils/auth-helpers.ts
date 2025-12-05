/**
 * Helper functions for authentication in server actions.
 */

import { auth } from "@/auth";

/**
 * Get the JWT access token from the current session.
 *
 * @returns Access token string or null if not authenticated
 */
export async function getAccessToken(): Promise<string | null> {
  try {
    console.log("getAccessToken: Attempting to get session");
    const session = await auth();
    console.log("getAccessToken: Session received", session ? "Yes" : "No");
    console.log(
      "getAccessToken: Session data",
      session
        ? {
            hasUser: !!session.user,
            hasAccessToken: !!(session as any)?.accessToken,
            email: session.user?.email,
          }
        : "No session"
    );

    const token = (session as any)?.accessToken || null;
    console.log("getAccessToken: Token extracted", token ? "Yes" : "No");
    return token;
  } catch (error) {
    console.error("Error getting access token:", error);
    return null;
  }
}

/**
 * Check if user is authenticated.
 *
 * @returns True if user has a valid session and token
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = await getAccessToken();
  return token !== null;
}
