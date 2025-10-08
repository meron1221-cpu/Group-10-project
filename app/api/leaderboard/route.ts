import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import fs from "fs";
import path from "path";

const reportsPath = path.join(process.cwd(), "reports.json");

interface Report {
  id: string;
  userId: string;
  type: string;
  date: string;
  status: "Verified Scam" | "Under Review" | "Pending";
  details: string;
  riskScore: number;
  severity: "Low" | "Medium" | "High";
}

function readReportsDB(): { reports: Report[] } {
  try {
    if (!fs.existsSync(reportsPath)) return { reports: [] };
    const data = fs.readFileSync(reportsPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("REPORTS_READ_ERROR", error);
    return { reports: [] };
  }
}

export async function GET() {
  try {
    // Fetch all users from the database
    const users = await db.user.findMany();

    // Fetch reports from reports.json
    const reportsDB = readReportsDB();

    // Aggregate report counts by user
    const reportsByUser = reportsDB.reports.reduce(
      (acc: { [key: string]: number }, report: Report) => {
        acc[report.userId] = (acc[report.userId] || 0) + 1;
        return acc;
      },
      {}
    );

    // Create leaderboard data
    const leaderboard = users
      .map((user) => ({
        id: user.id,
        name: user.username,
        email: user.email,
        points: user.points || 0,
        reports: reportsByUser[user.id] || 0,
      }))
      .sort((a, b) => b.points - a.points)
      .map((user, index) => ({ ...user, rank: index + 1 }));

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error("LEADERBOARD_ERROR", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
