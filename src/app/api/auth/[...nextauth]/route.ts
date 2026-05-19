import NextAuth from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";

import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/db";

import User from "@/models/User";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",

      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        await connectDB();

        const user = await User.findOne({
          email: credentials?.email,
        });

        if (!user) {
          throw new Error("User not found");
        }

        const isPasswordCorrect =
          await bcrypt.compare(
            credentials!.password,
            user.password
          );

        if (!isPasswordCorrect) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          name: user.username,
          email: user.email,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id =
          token.id;
      }

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };