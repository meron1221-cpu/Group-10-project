import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // In a real application, you might want to add pagination
    const users = await db.user.findMany();

    // Sort users by points in descending order and add a rank
    const leaderboard = users
      .sort((a, b) => (b.points || 0) - (a.points || 0))
      .map((user, index) => ({
        id: user.id,
        name: user.username,
        email: user.email,
        points: user.points || 0,
        reports: 0, // You can add logic to count reports later
        rank: index + 1,
      }));

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error("LEADERBOARD_ERROR", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
