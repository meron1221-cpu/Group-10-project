import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
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
    return { reports: [] };
  }
}

function writeReportsDB(data: { reports: Report[] }) {
  fs.writeFileSync(reportsPath, JSON.stringify(data, null, 2));
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { scamType, description } = await request.json();
    const userId = session.user.id;

    // Add the new report
    const reportsDB = readReportsDB();
    const newReport: Report = {
      id: `rep-${Date.now()}`,
      userId,
      type: scamType,
      details: description,
      date: new Date().toISOString().split("T")[0],
      status: "Pending", // All new reports are pending
      riskScore: Math.floor(Math.random() * 30) + 60, // Simulate AI score
      severity: "Medium",
    };
    reportsDB.reports.unshift(newReport);
    writeReportsDB(reportsDB);

    // Update user points
    const user = await db.user.findById(userId);
    if (user) {
      const currentReports = user.reports || 0;
      const pointsToAdd = currentReports === 0 ? 50 : 10;
      await db.user.update({
        where: { email: user.email },
        data: {
          points: (user.points || 0) + pointsToAdd,
          reports: currentReports + 1,
        },
      });
    }

    return NextResponse.json(newReport, { status: 201 });
  } catch (error) {
    console.error("REPORT_SUBMIT_ERROR", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
