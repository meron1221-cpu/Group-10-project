import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { findUserByEmail } from "@/lib/db";
import bcrypt from "bcrypt";

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

        // Find the user in our mock database
        const user = findUserByEmail(credentials.email);

        if (!user || !user.hashedPassword) {
          return null;
        }

        // Check if the password is correct
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (isPasswordCorrect) {
          // Return user object to be encoded in the JWT
          return { id: user.id, email: user.email };
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
  // Callbacks are essential for adding the user ID to the session
  callbacks: {
    async jwt({ token, user }) {
      // On sign-in, the `user` object is available. Add its ID to the token.
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Add the ID from the token to the session object, making it available on the client.
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Make sure to set this in your .env file
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
