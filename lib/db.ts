// This file acts as our simple, file-based database layer.
import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "db.json");

// Define the structure of our database and user
interface User {
  id: string;
  email: string;
  hashedPassword?: string;
  points?: number; // <--- ADDED THIS LINE for gamification
}

interface Database {
  users: User[];
}

// Function to read all users from the JSON file
function readDB(): Database {
  try {
    const data = fs.readFileSync(dbPath, "utf-8");
    return JSON.parse(data) as Database;
  } catch (error) {
    // If the file doesn't exist or is empty, return a default structure
    return { users: [] };
  }
}

// Function to write the entire database back to the JSON file
function writeDB(data: Database) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// --- Database Helper Functions ---

export function findUserByEmail(email: string): User | undefined {
  const db = readDB();
  return db.users.find((user) => user.email === email);
}

export function createUser(newUser: Omit<User, "id">): User {
  const db = readDB();
  // Initialize points for new users
  const user = { ...newUser, id: `user-${Date.now()}`, points: 0 }; // <--- INITIALIZE POINTS
  db.users.push(user);
  writeDB(db);
  return user;
}

// --- NEW: Function to update user points ---
export function updateUserPoints(
  userId: string,
  pointsToAdd: number
): User | undefined {
  const db = readDB();
  const userIndex = db.users.findIndex((user) => user.id === userId);
  if (userIndex > -1) {
    db.users[userIndex].points =
      (db.users[userIndex].points || 0) + pointsToAdd;
    writeDB(db);
    return db.users[userIndex];
  }
  return undefined;
}

// --- NEW: Function to get all users (for leaderboard) ---
export function getAllUsers(): User[] {
  const db = readDB();
  return db.users;
}
