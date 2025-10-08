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
    if (!fs.existsSync(reportsPath)) {
      return { reports: [] };
    }
    const data = fs.readFileSync(reportsPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("REPORTS_READ_ERROR", error);
    return { reports: [] };
  }
}

function writeReportsDB(data: { reports: Report[] }) {
  try {
    fs.writeFileSync(reportsPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("REPORTS_WRITE_ERROR", error);
    throw new Error("Failed to write to reports database");
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { scamType, description } = await request.json();
    if (!scamType || !description) {
      return NextResponse.json(
        { message: "Scam type and description are required" },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Fetch current user data
    const user = await db.user.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Calculate points: 50 for first report, 10 for subsequent ones
    const currentReports = user.reports || 0;
    const pointsToAdd = currentReports === 0 ? 50 : 10;

    // Create new report
    const newReport: Report = {
      id: `rep-${Date.now()}`,
      userId,
      type: scamType,
      details: description,
      date: new Date().toISOString().split("T")[0],
      status: "Pending",
      riskScore: Math.floor(Math.random() * 30) + 60,
      severity: "Medium",
    };

    // Update reports.json
    const reportsDB = readReportsDB();
    reportsDB.reports.unshift(newReport);
    writeReportsDB(reportsDB);

    // Update user points and report count in db.json
    await db.user.update({
      where: { email: user.email },
      data: {
        points: (user.points || 0) + pointsToAdd,
        reports: currentReports + 1,
      },
    });

    return NextResponse.json(newReport, { status: 201 });
  } catch (error) {
    console.error("REPORT_SUBMIT_ERROR", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
