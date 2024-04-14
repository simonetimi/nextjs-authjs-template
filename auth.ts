import { PrismaAdapter } from '@auth/prisma-adapter';
import { UserRole } from '@prisma/client';
import { compare } from 'bcryptjs';
import NextAuth, { type DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import Credentials from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

import { getUserByEmail } from '@/data/user';
import { getUserById } from '@/data/user';
import { prisma } from '@/lib/db';
import { LoginSchema } from '@/schemas';

//extend type for token to include role
declare module 'next-auth/jwt' {
  interface JWT {
    role?: UserRole;
  }
}

// extend type for session to include role
declare module 'next-auth' {
  interface Session {
    user: {
      role: UserRole;
    } & DefaultSession['user'];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          emailVerified: new Date(),
        },
      });
    },
  },
  callbacks: {
    async signIn({ user }) {
      /*
      const existingUser = await getUserById(user.id);
      if (!existingUser || !existingUser.emailVerified) {
        return false;
      }
       */
      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;
      token.role = existingUser.Role;
      return token;
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          const user = await getUserByEmail(email);
          // check if user exists
          // !user.password is true for users who used a provider like Google or GitHub. They can't use credentials to login
          if (!user || !user.password) return null;

          // check password
          const passwordsMatch = await compare(password, user.password);
          if (passwordsMatch) return user;
        }
        return null;
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
});
