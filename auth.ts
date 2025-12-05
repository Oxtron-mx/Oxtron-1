import NextAuth from "next-auth";
import Credentials from "@auth/core/providers/credentials";
import axiosInstance from "@/lib/axios-instance";

interface LoginResponse {
  access_token: string;
  token_type: string;
}

interface TokenData {
  sub: string;
  email: string;
  role_id: number;
  role_name: string | null;
  role_level: number | null;
  organization_id: number | null;
  location_id: number | null;
  permissions: Record<string, { read: boolean; write: boolean }>;
}

export const { handlers: { GET, POST }, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'email', type: 'email' },
        password: { label: 'password', type: 'password' },
      },
      authorize: async ({ email, password }): Promise<any> => {
        try {
          // Use OAuth2PasswordRequestForm format (username = email)
          const formData = new URLSearchParams();
          formData.append('username', email as string);
          formData.append('password', password as string);

          const { status, data } = await axiosInstance.post<LoginResponse>(
            '/api/auth/login',
            formData,
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            }
          );

          if (status === 200 && data.access_token) {
            // Decode JWT token to get user info (simple base64 decode)
            const tokenParts = data.access_token.split('.');
            if (tokenParts.length === 3) {
              const payload = JSON.parse(
                Buffer.from(tokenParts[1], 'base64').toString('utf-8')
              ) as TokenData;

              return {
                id: payload.sub,
                email: payload.email,
                accessToken: data.access_token,
                roleId: payload.role_id,
                roleName: payload.role_name,
                roleLevel: payload.role_level,
                organizationId: payload.organization_id,
                locationId: payload.location_id,
                permissions: payload.permissions,
              };
            }
          }

          return null;
        } catch (error) {
          console.error('Error in authorization:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.accessToken = (user as any).accessToken;
        token.roleId = (user as any).roleId;
        token.roleName = (user as any).roleName;
        token.roleLevel = (user as any).roleLevel;
        token.organizationId = (user as any).organizationId;
        token.locationId = (user as any).locationId;
        token.permissions = (user as any).permissions;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        (session as any).accessToken = token.accessToken;
        (session as any).roleId = token.roleId;
        (session as any).roleName = token.roleName;
        (session as any).roleLevel = token.roleLevel;
        (session as any).organizationId = token.organizationId;
        (session as any).locationId = token.locationId;
        (session as any).permissions = token.permissions;
      }
      return session;
    },
  },
});
