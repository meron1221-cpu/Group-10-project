import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's database id. */
      id: string;
    } & DefaultSession["user"]; // ...and the default fields (name, email, image)
  }

  interface User extends DefaultUser {
    /** The user's database id. */
    id: string;
  }
}
