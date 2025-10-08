import { DefaultSession, User as DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Extends the built-in session.user type to include your custom fields.
   */
  interface Session extends DefaultSession {
    user: {
      id: string;
      guardianScore?: number;
      leaderboardRank?: number;
    } & DefaultSession["user"]; // Keep the default properties like name, email, image
  }

  /**
   * Extends the built-in User type from the authorize callback.
   */
  interface User extends DefaultUser {
    guardianScore?: number;
    leaderboardRank?: number;
  }
}

declare module "next-auth/jwt" {
  /**
   * Extends the JWT token to include your custom fields.
   */
  interface JWT extends DefaultJWT {
    id: string;
    guardianScore?: number;
    leaderboardRank?: number;
  }
}
