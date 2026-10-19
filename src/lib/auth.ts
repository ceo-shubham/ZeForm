import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { ADMIN_EMAIL } from "@/lib/utils";

export const authOptions: NextAuthOptions = {
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    // Credentials provider for easy developer sign-in / demo testing
    CredentialsProvider({
      id: "credentials",
      name: "Quick Sign In",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "user@example.com" },
        name: { label: "Name", type: "text", placeholder: "Your Name" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        const email = credentials.email.trim().toLowerCase();
        const name = credentials.name?.trim() || email.split("@")[0];
        const role = email === ADMIN_EMAIL.toLowerCase() ? "ADMIN" : "USER";

        const user = await prisma.user.upsert({
          where: { email },
          update: {
            name,
            role,
          },
          create: {
            email,
            name,
            role,
          },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (user.email) {
        const email = user.email.toLowerCase();
        const role = email === ADMIN_EMAIL.toLowerCase() ? "ADMIN" : "USER";

        await prisma.user.upsert({
          where: { email },
          update: {
            name: user.name || undefined,
            image: user.image || undefined,
            role,
          },
          create: {
            email,
            name: user.name || email.split("@")[0],
            image: user.image || undefined,
            role,
          },
        });
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || (user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? "ADMIN" : "USER");
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        const email = session.user.email?.toLowerCase();
        const isMasterAdmin = email === ADMIN_EMAIL.toLowerCase();
        (session.user as any).id = token.id || token.sub;
        (session.user as any).role = isMasterAdmin ? "ADMIN" : ((token.role as string) || "USER");
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET || "zeform-super-secret-auth-key-12345",
};
