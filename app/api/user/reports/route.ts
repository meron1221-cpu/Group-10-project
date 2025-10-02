import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Your NextAuth config
import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma"; // Your Prisma client instance

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  // In a real app, you would fetch from your database
  // const reports = await prisma.scamReport.findMany({
  //   where: {
  //     userId: session.user.id,
  //   },
  //   orderBy: {
  //     createdAt: "desc",
  //   },
  // });

  // For now, we return mock data
  const mockReports = [
    {
      id: "rep-001",
      type: "Phishing",
      date: "2024-05-21",
      status: "Verified Scam",
      details: "Email from 'Netflx' asking to update payment.",
    },
    {
      id: "rep-002",
      type: "Fake Job Offer",
      date: "2024-05-19",
      status: "Under Review",
      details: "WhatsApp message for a high-paying remote job.",
    },
  ];

  return NextResponse.json(mockReports);
}
