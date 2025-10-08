import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (
          user &&
          user.hashedPassword &&
          (await bcrypt.compare(credentials.password, user.hashedPassword))
        ) {
          // ✅ FIX: Return all necessary user data here
          return {
            id: user.id,
            name: user.username,
            email: user.email,
            guardianScore: user.points || 0, // Pass points as guardianScore
            // You can calculate or fetch leaderboardRank here if needed
            leaderboardRank: 142, // Example static value
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      // On sign-in, the `user` object from `authorize` is available.
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.guardianScore = user.guardianScore;
        token.leaderboardRank = user.leaderboardRank;
      }
      return token;
    },
    async session({ session, token }) {
      // Add the custom properties from the token to the session object.
      if (session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.guardianScore = token.guardianScore;
        session.user.leaderboardRank = token.leaderboardRank;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
