import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import fs from "fs";
import path from "path";
import { db } from "@/lib/db";

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
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch reports from reports.json
    const reportsDB = readReportsDB();
    const userReports = reportsDB.reports.filter(
      (report) => report.userId === session.user.id
    );

    // Fetch user data to get points
    const user = await db.user.findById(session.user.id);

    return NextResponse.json({
      reports: userReports,
      points: user?.points || 0,
    });
  } catch (error) {
    console.error("USER_REPORTS_FETCH_ERROR", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
