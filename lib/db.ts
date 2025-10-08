// This file acts as our simple, file-based database layer.
import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "db.json");

// Define the structure of our database and user
interface User {
  id: string;
  username: string;
  email: string;
  hashedPassword?: string;
  points?: number;
  reports?: number; // Added to track report count
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
    return { users: [] };
  }
}

// Function to write the entire database back to the JSON file
function writeDB(data: Database) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
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
        reports: 0, // Initialize reports count
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
        database.users[userIndex] = { ...database.users[userIndex], ...data };
        writeDB(database);
        return database.users[userIndex];
      }
      return null;
    },

    findMany: async (): Promise<User[]> => {
      const database = readDB();
      return database.users;
    },
  },
};
