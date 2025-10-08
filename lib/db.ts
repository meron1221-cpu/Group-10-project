import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "db.json");

// Define the structure of our database and user
interface User {
  id: string;
  username: string;
  email: string;
  hashedPassword?: string;
  points: number;
  reports: number;
  resetToken?: string | null;
  resetTokenExpiry?: Date | null;
}

interface Database {
  users: User[];
}

// Function to read all users from the JSON file
function readDB(): Database {
  try {
    if (!fs.existsSync(dbPath)) {
      writeDB({ users: [] });
      return { users: [] };
    }
    const data = fs.readFileSync(dbPath, "utf-8");
    return JSON.parse(data) as Database;
  } catch (error) {
    console.error("DB_READ_ERROR", error);
    return { users: [] };
  }
}

// Function to write the entire database back to the JSON file
function writeDB(data: Database) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("DB_WRITE_ERROR", error);
    throw new Error("Failed to write to database");
  }
}

// --- Database Helper Functions ---
export const db = {
  user: {
    findUnique: async ({
      where: { email },
    }: {
      where: { email: string };
    }): Promise<User | null> => {
      const database = readDB();
      return database.users.find((user) => user.email === email) || null;
    },

    findById: async (id: string): Promise<User | null> => {
      const database = readDB();
      return database.users.find((user) => user.id === id) || null;
    },

    findFirst: async ({
      where: { resetToken },
    }: {
      where: { resetToken: string };
    }): Promise<User | null> => {
      const database = readDB();
      return (
        database.users.find(
          (user) =>
            user.resetToken === resetToken &&
            user.resetTokenExpiry &&
            new Date(user.resetTokenExpiry) > new Date()
        ) || null
      );
    },

    create: async ({
      data,
    }: {
      data: { username: string; email: string; hashedPassword?: string };
    }): Promise<User> => {
      const database = readDB();
      const user: User = {
        ...data,
        id: `user-${Date.now()}`,
        points: 0,
        reports: 0,
        resetToken: null,
        resetTokenExpiry: null,
      };
      database.users.push(user);
      writeDB(database);
      return user;
    },

    update: async ({
      where: { email },
      data,
    }: {
      where: { email: string };
      data: Partial<Omit<User, "id" | "email">>;
    }): Promise<User | null> => {
      const database = readDB();
      const userIndex = database.users.findIndex(
        (user) => user.email === email
      );
      if (userIndex > -1) {
        // Ensure points and reports are not set to undefined
        const updatedUser = {
          ...database.users[userIndex],
          ...data,
          points:
            data.points !== undefined
              ? data.points
              : database.users[userIndex].points || 0,
          reports:
            data.reports !== undefined
              ? data.reports
              : database.users[userIndex].reports || 0,
        };
        database.users[userIndex] = updatedUser;
        writeDB(database);
        return updatedUser;
      }
      return null;
    },

    findMany: async (): Promise<User[]> => {
      const database = readDB();
      return database.users;
    },
  },
};
