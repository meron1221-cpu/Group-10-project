import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import fs from "fs";
import path from "path";

const reportsPath = path.join(process.cwd(), "reports.json");

interface Report {
  id: string;
  userId: string;
  // ... other properties
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

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const reportsDB = readReportsDB();
    const userReports = reportsDB.reports.filter(
      (report) => report.userId === session.user.id
    );
    return NextResponse.json({ reports: userReports });
  } catch (error) {
    console.error("USER_REPORTS_FETCH_ERROR", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
