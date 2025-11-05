import NextAuth from "next-auth";
import Credentials from "@auth/core/providers/credentials";
import axiosInstance from "@/lib/axios-instance";
import { IUser } from "@/constants/types";

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
          const { status, data } = await axiosInstance.get('/UsersControl/Mostrar_Usuarios_Email_Pass', {
            params: { email, pass: password },
          });

          if (status === 200 && data.length) {
            const user: IUser = data[0];
            return {
              id: user.idUSerControl,
              email: user.email,
              name: user.firstName,
              lastname: user.lastName,
            };
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
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
